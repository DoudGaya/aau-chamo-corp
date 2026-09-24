import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = {
  _type: string;
};

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_WEBHOOK_SECRET,
    );

    if (!isValidSignature) {
      const message = "Invalid signature";
      return new Response(JSON.stringify({ message, isValidSignature, body }), {
        status: 401,
      });
    }

    if (!body?._type) {
      const message = "Bad Request";
      return new Response(JSON.stringify({ message, body }), { status: 400 });
    }

    revalidateTag(\`sanity-\${body._type}\`);

    // Special case for newsArticle to revalidate specific slugs and generic 'sanity-news' tag
    if (body._type === 'newsArticle') {
      revalidateTag('sanity-news');
      // If we had slug in the body, we could revalidate 'sanity-news-SLUG'
    }

    return NextResponse.json({ body });
  } catch (err: any) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
}
