import { z } from "zod";
import { enquiryInputSchema, missingEnquiryDetails } from "@/lib/enquiry-validation";
import { submitEnquiry } from "@/lib/enquiry-service";

export const runtime = "nodejs";

const schema = enquiryInputSchema.extend({
  consent: z.literal(true),
  company: z.string().max(0).optional().default(""),
});

const buckets = new Map<string, { count: number; resetAt: number }>();

function limited(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + 10 * 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 8;
}

export async function POST(request: Request) {
  if (limited(request)) return Response.json({ ok: false, error: "Too many requests. Please wait before submitting again." }, { status: 429 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 30_000) return Response.json({ ok: false, error: "Request is too large." }, { status: 413 });

  try {
    const input = schema.parse(await request.json());
    const missing = missingEnquiryDetails(input.type, input.details);
    if (missing.length) return Response.json({ ok: false, error: "Please complete all required service details." }, { status: 422 });

    const { record, emailSent } = await submitEnquiry({
      type: input.type,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      details: input.details,
    });

    return Response.json({ ok: true, reference: record.reference, status: record.status, emailSent }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ ok: false, error: "Please check the form and provide valid contact and service information." }, { status: 422 });
    }
    const message = error instanceof Error ? error.message : "Enquiry service is unavailable.";
    const status = message.includes("storage is not configured") ? 503 : 500;
    return Response.json({ ok: false, error: status === 503 ? "Enquiry storage is not configured for production." : "The enquiry could not be submitted. Please try again." }, { status });
  }
}
