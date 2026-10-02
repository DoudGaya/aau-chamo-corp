import { z } from "zod";
import { listEnquiries, countPersistentFailures } from "@/lib/enquiries";

export const runtime = "nodejs";

function isAuthorised(request: Request): boolean {
  const secret = process.env.ADMIN_API_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

const querySchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export async function GET(request: Request) {
  if (!isAuthorised(request)) {
    return Response.json({ error: "Unauthorised." }, { status: 401 });
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return Response.json({ error: "Invalid query parameters." }, { status: 422 });
  }

  try {
    const [enquiries, persistentFailures] = await Promise.all([
      listEnquiries(parsed.data),
      countPersistentFailures(),
    ]);

    return Response.json({
      ok: true,
      count: enquiries.length,
      persistentNotificationFailures: persistentFailures,
      enquiries: enquiries.map((e) => ({
        reference: e.reference,
        type: e.type,
        status: e.status,
        source: e.source,
        name: e.name,
        email: e.email,
        phone: e.phone,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Admin enquiries list failed", error);
    return Response.json({ error: "Could not retrieve enquiries." }, { status: 500 });
  }
}
