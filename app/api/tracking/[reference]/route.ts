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

function normalizeStatus(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const clean = raw.trim().toLowerCase().replace(/[-_]/g, " ");
  if (clean.includes("deliver") || clean.includes("complete")) return "Delivered";
  if (clean.includes("ready") || clean.includes("collection") || clean.includes("pickup") || clean.includes("out for delivery")) return "Ready for Collection";
  if (clean.includes("arriv")) return "Arrived";
  if (clean.includes("transit") || clean.includes("shipp") || clean.includes("way") || clean.includes("flight") || clean.includes("air")) return "In Transit";
  if (clean.includes("dispatch")) return "Dispatched";
  if (clean.includes("process") || clean.includes("inspect") || clean.includes("customs") || clean.includes("warehouse")) return "Processing";
  if (clean.includes("receiv") || clean.includes("book") || clean.includes("intake") || clean.includes("new")) return "Received";
  return null;
}

export async function GET(_request: Request, context: { params: Promise<{ reference: string }> }) {
  if (isRateLimited(_request)) {
    return Response.json({ error: "Too many requests. Please wait before checking again." }, { status: 429 });
  }

  const { reference: rawReference } = await context.params;
  const reference = rawReference.trim().toUpperCase().slice(0, 40);
  if (!/^[A-Z0-9-]{4,40}$/.test(reference)) return Response.json({ error: "Enter a valid tracking or enquiry reference." }, { status: 422 });

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
        const body = await response.json() as Record<string, unknown>;
        const normalized = normalizeStatus(body.status) || normalizeStatus(body.state) || normalizeStatus(body.currentStatus);
        if (normalized) {
          return Response.json({
            reference: typeof body.reference === "string" ? body.reference : (typeof body.trackingNumber === "string" ? body.trackingNumber : reference),
            status: normalized,
            rawStatus: typeof body.status === "string" ? body.status : undefined,
            description: typeof body.description === "string" ? body.description.slice(0, 500) : "Verified shipment status from logistics inventory system.",
            origin: typeof body.origin === "string" ? body.origin : undefined,
            destination: typeof body.destination === "string" ? body.destination : undefined,
            estimatedDelivery: typeof body.estimatedDelivery === "string" ? body.estimatedDelivery : undefined,
            updatedAt: typeof body.updatedAt === "string" ? body.updatedAt : (typeof body.lastUpdated === "string" ? body.lastUpdated : undefined),
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
