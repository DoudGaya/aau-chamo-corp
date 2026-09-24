import { getNewsArticles } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] || character);
}

export async function GET() {
  const articles = await getNewsArticles();
  const items = articles.map((article) => {
    const url = `${siteConfig.url}/news/${article.slug}`;
    return `<item><title>${escapeXml(article.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(article.excerpt)}</description>${article.publishedAt ? `<pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>` : ""}</item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(siteConfig.name)} News</title><link>${escapeXml(siteConfig.url)}</link><description>Company announcements, service guidance and operational updates.</description><language>en-NG</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
