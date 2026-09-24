import type { MetadataRoute } from "next";
import { services } from "@/lib/content";
import { getNewsArticles } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/services", "/cargo-logistics", "/flight-travel", "/umrah-ziyarah", "/news", "/gallery", "/track-cargo", "/contact", "/enquire"];
  const articles = await getNewsArticles();
  const now = new Date();
  return [
    ...routes.map((route) => ({ url: `${siteConfig.url}${route}`, lastModified: now, changeFrequency: route === "/news" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .8 })),
    ...services.map((service) => ({ url: `${siteConfig.url}/services/${service.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: .75 })),
    ...articles.map((article) => ({
      url: `${siteConfig.url}/news/${article.slug}`,
      lastModified: article.updatedAt || article.publishedAt || now,
      changeFrequency: "monthly" as const,
      priority: .7,
    })),
  ];
}
