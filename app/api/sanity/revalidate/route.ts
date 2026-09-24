import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

export const runtime = "nodejs";

const payloadSchema = z.object({
  _type: z.enum(["newsArticle", "galleryItem", "siteSettings"]),
  slug: z.string().optional(),
});

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return Response.json({ ok: false, error: "Webhook is not configured." }, { status: 503 });

  const signature = request.headers.get(SIGNATURE_HEADER_NAME) || "";
  const rawBody = await request.text();
  if (!(await isValidSignature(rawBody, signature, secret))) {
    return Response.json({ ok: false, error: "Invalid signature." }, { status: 401 });
  }

  const payload = payloadSchema.safeParse(JSON.parse(rawBody));
  if (!payload.success) return Response.json({ ok: false, error: "Unsupported webhook payload." }, { status: 422 });

  if (payload.data._type === "newsArticle") {
    revalidateTag("sanity-news", { expire: 0 });
    revalidatePath("/news");
    revalidatePath("/sitemap.xml");
    revalidatePath("/feed.xml");
    if (payload.data.slug) revalidatePath(`/news/${payload.data.slug}`);
  } else if (payload.data._type === "galleryItem") {
    revalidateTag("sanity-gallery", { expire: 0 });
    revalidatePath("/gallery");
  } else {
    revalidatePath("/", "layout");
  }

  return Response.json({ ok: true, revalidated: payload.data._type });
}
