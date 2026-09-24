import { z } from "zod";
import { createHash } from "node:crypto";
import { answerAssistant } from "@/lib/assistant";

const schema = z.object({
  message: z.string().trim().min(1).max(600),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(1800) })).max(8).default([]),
});

const buckets = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) buckets.set(key, { count: 1, resetAt: now + 5 * 60_000 });
  else if (++bucket.count > 25) return Response.json({ answer: "Please wait a few minutes or contact our team through the enquiry form." }, { status: 429 });

  try {
    const input = schema.parse(await request.json());
    const safetyIdentifier = createHash("sha256").update(`aau-chamo:${key}`).digest("hex").slice(0, 32);
    const result = await answerAssistant(input.message, input.history, safetyIdentifier);
    return Response.json({ ...result, scope: "approved-service-information", confirmation: false });
  } catch (error) {
    const status = error instanceof z.ZodError ? 422 : 500;
    return Response.json({ answer: "I could not process that message. Please submit an enquiry for staff assistance." }, { status });
  }
}
