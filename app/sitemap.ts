import type { MetadataRoute } from "next";
import { services } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/services", "/cargo-logistics", "/flight-travel", "/umrah-ziyarah", "/news", "/gallery", "/track-cargo", "/contact", "/enquire"];
  const now = new Date();
  return [
    ...routes.map((route) => ({ url: `${siteConfig.url}${route}`, lastModified: now, changeFrequency: route === "/news" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .8 })),
    ...services.map((service) => ({ url: `${siteConfig.url}/services/${service.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: .75 })),
  ];
}
