import { z } from "zod";
import { updateEnquiryStatus, type EnquiryStatus } from "@/lib/enquiries";

export const runtime = "nodejs";

function isAuthorised(request: Request): boolean {
  const secret = process.env.ADMIN_API_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

const bodySchema = z.object({
  status: z.enum(["New", "In Review", "Awaiting Customer", "Confirmed", "Completed", "Cancelled"]),
  note: z.string().trim().max(500).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ ref: string }> },
) {
  if (!isAuthorised(request)) {
    return Response.json({ error: "Unauthorised." }, { status: 401 });
  }

  const { ref } = await context.params;
  const reference = ref.trim().toUpperCase().slice(0, 40);
  if (!/^[A-Z0-9-]{6,40}$/.test(reference)) {
    return Response.json({ error: "Invalid reference format." }, { status: 422 });
  }

  try {
    const body = bodySchema.parse(await request.json());
    const record = await updateEnquiryStatus(reference, body.status as EnquiryStatus, "staff:api", body.note);
    return Response.json({ ok: true, reference: record.reference, status: record.status, updatedAt: record.updatedAt });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid request body.", details: error.flatten().fieldErrors }, { status: 422 });
    }
    const message = error instanceof Error ? error.message : "Could not update status.";
    const status = message.includes("not permitted") || message.includes("authorised") ? 403 : 500;
    return Response.json({ error: message }, { status });
  }
}