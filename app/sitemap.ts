import type { MetadataRoute } from "next";
import { services } from "@/lib/content";
import { getEvents, getNewsArticles } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, events] = await Promise.all([
    getNewsArticles(),
    getEvents(),
  ]);

  const now = new Date();

  const coreRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/cargo-logistics", priority: 0.95, changeFrequency: "weekly" },
    { path: "/flight-travel", priority: 0.95, changeFrequency: "weekly" },
    { path: "/umrah-ziyarah", priority: 0.95, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" },
    { path: "/events", priority: 0.9, changeFrequency: "weekly" },
    { path: "/news", priority: 0.9, changeFrequency: "daily" },
    { path: "/about", priority: 0.85, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.85, changeFrequency: "monthly" },
    { path: "/gallery", priority: 0.8, changeFrequency: "weekly" },
    { path: "/track-cargo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/enquire", priority: 0.8, changeFrequency: "monthly" },
  ];

  const coreEntries: MetadataRoute.Sitemap = coreRoutes.map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}/news/${article.slug}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : article.publishedAt ? new Date(article.publishedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...coreEntries, ...serviceEntries, ...articleEntries];
}
