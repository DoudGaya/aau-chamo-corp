import { getEnquiry } from "@/lib/enquiries";

const allowedStatuses = new Set(["Received", "Processing", "Dispatched", "In Transit", "Arrived", "Ready for Collection", "Delivered"]);

const trackingBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(request: Request): boolean {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const bucket = trackingBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    trackingBuckets.set(key, { count: 1, resetAt: now + 5 * 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 20;
}

export async function GET(_request: Request, context: { params: Promise<{ reference: string }> }) {
  if (isRateLimited(_request)) {
    return Response.json({ error: "Too many requests. Please wait before checking again." }, { status: 429 });
  }

  const { reference: rawReference } = await context.params;
  const reference = rawReference.trim().toUpperCase().slice(0, 40);
  if (!/^[A-Z0-9-]{6,40}$/.test(reference)) return Response.json({ error: "Enter a valid tracking or enquiry reference." }, { status: 422 });

  const inventoryEndpoint = process.env.INVENTORY_TRACKING_API_URL;
  if (inventoryEndpoint) {
    try {
      const response = await fetch(`${inventoryEndpoint.replace(/\/$/, "")}/${encodeURIComponent(reference)}`, {
        headers: {
          accept: "application/json",
          ...(process.env.INVENTORY_API_TOKEN ? { authorization: `Bearer ${process.env.INVENTORY_API_TOKEN}` } : {}),
        },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) {
        const body = await response.json() as { reference?: unknown; status?: unknown; description?: unknown; updatedAt?: unknown };
        const status = typeof body.status === "string" && allowedStatuses.has(body.status) ? body.status : null;
        if (status) {
          return Response.json({
            reference: typeof body.reference === "string" ? body.reference : reference,
            status,
            description: typeof body.description === "string" ? body.description.slice(0, 500) : "Customer-facing shipment status from the inventory system.",
            updatedAt: typeof body.updatedAt === "string" ? body.updatedAt : undefined,
            source: "inventory",
          });
        }
      }
    } catch {
      // Enquiry lookup below remains available when inventory integration is offline.
    }
  }

  const enquiry = await getEnquiry(reference);
  if (enquiry) {
    return Response.json({
      reference: enquiry.reference,
      status: enquiry.status,
      description: "This is the progress of your customer enquiry. It is not a live shipment status or confirmed booking.",
      updatedAt: enquiry.updatedAt,
      source: "enquiry",
    });
  }

  return Response.json({
    error: inventoryEndpoint
      ? "No customer-facing result was found. Check the reference or contact support."
      : "Live cargo tracking is awaiting inventory-system configuration. Enquiry references submitted on this website can still be checked here.",
  }, { status: 404 });
}
