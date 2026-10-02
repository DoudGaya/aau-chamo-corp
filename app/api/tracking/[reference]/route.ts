import { getEnquiry } from "@/lib/enquiries";

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
  return bucket.count > 30;
}

function normalizeStatus(raw: unknown): string {
  if (typeof raw !== "string") return "Received";
  const clean = raw.trim().toLowerCase().replace(/[-_]/g, " ");
  if (clean.includes("deliver") || clean.includes("complete")) return "Delivered";
  if (clean.includes("ready") || clean.includes("collection") || clean.includes("pickup") || clean.includes("out for delivery")) return "Ready for Collection";
  if (clean.includes("arriv")) return "Arrived";
  if (clean.includes("transit") || clean.includes("shipp") || clean.includes("way") || clean.includes("flight") || clean.includes("air")) return "In Transit";
  if (clean.includes("dispatch")) return "Dispatched";
  if (clean.includes("process") || clean.includes("inspect") || clean.includes("customs") || clean.includes("warehouse") || clean.includes("hold")) return "Processing";
  if (clean.includes("label") || clean.includes("receiv") || clean.includes("book") || clean.includes("intake") || clean.includes("new") || clean.includes("draft")) return "Received";
  return "Received";
}

export async function GET(_request: Request, context: { params: Promise<{ reference: string }> }) {
  try {
    if (isRateLimited(_request)) {
      return Response.json({ error: "Too many requests. Please wait a moment before checking again." }, { status: 429 });
    }

    const { reference: rawReference } = await context.params;
    const reference = (rawReference || "").trim().toUpperCase().slice(0, 50);
    if (!/^[A-Z0-9-]{4,50}$/.test(reference)) {
      return Response.json({ error: "Enter a valid tracking number or enquiry reference." }, { status: 422 });
    }

    // Default to the live ERP tracking endpoint if INVENTORY_TRACKING_API_URL is unset or points to outdated app.aauchamo.com
    const envUrl = process.env.INVENTORY_TRACKING_API_URL?.trim();
    const inventoryEndpoint = (!envUrl || envUrl.includes("app.aauchamo.com"))
      ? "https://aauchamo.vercel.app/api/tracking"
      : envUrl;

    const apiToken = process.env.INVENTORY_API_TOKEN || "aau_erp_tracking_sec_2026_9f8d1c7a4b";

    if (inventoryEndpoint) {
      try {
        const targetUrl = `${inventoryEndpoint.replace(/\/$/, "")}/${encodeURIComponent(reference)}`;
        const response = await fetch(targetUrl, {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${apiToken}`,
          },
          cache: "no-store",
          signal: AbortSignal.timeout(8_000),
        });

        if (response.ok) {
          const body = (await response.json()) as Record<string, unknown>;
          const rawStatus = typeof body.status === "string" ? body.status : "LABELLED";
          const normalized = normalizeStatus(rawStatus);

          return Response.json({
            reference: typeof body.reference === "string" ? body.reference : reference,
            status: normalized,
            rawStatus,
            description: typeof body.description === "string" ? body.description.slice(0, 500) : "Verified shipment status from AAU Chamo ERP logistics system.",
            origin: typeof body.origin === "string" ? body.origin : undefined,
            destination: typeof body.destination === "string" ? body.destination : undefined,
            pieces: typeof body.pieces === "number" ? body.pieces : undefined,
            weightKg: body.weightKg ? String(body.weightKg) : undefined,
            commodity: typeof body.commodity === "string" ? body.commodity : undefined,
            estimatedDelivery: typeof body.estimatedDelivery === "string" ? body.estimatedDelivery : undefined,
            updatedAt: typeof body.updatedAt === "string" ? body.updatedAt : (typeof body.lastUpdated === "string" ? body.lastUpdated : undefined),
            events: Array.isArray(body.events) ? body.events : undefined,
            source: "inventory",
          });
        }
      } catch (err) {
        console.warn("ERP tracking endpoint query failed, checking enquiry fallback:", err);
      }
    }

    // Enquiry fallback
    try {
      const enquiry = await getEnquiry(reference);
      if (enquiry) {
        return Response.json({
          reference: enquiry.reference,
          status: enquiry.status,
          description: "This is the current progress of your customer service enquiry. It is not an active Air Waybill (AWB) freight booking.",
          updatedAt: enquiry.updatedAt,
          source: "enquiry",
        });
      }
    } catch (err) {
      console.warn("Enquiry database lookup error:", err);
    }

    return Response.json({
      error: `No cargo shipment or customer enquiry found for reference "${reference}". Please verify your Air Waybill (AWB) number or contact AAU Chamo cargo operations.`,
    }, { status: 404 });
  } catch (error) {
    console.error("Critical tracking route error:", error);
    return Response.json({
      error: "Unable to retrieve tracking details at this time. Please retry shortly.",
    }, { status: 500 });
  }
}

