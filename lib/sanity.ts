import "server-only";

import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { newsItems } from "@/lib/content";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const token = process.env.SANITY_API_READ_TOKEN?.trim();

export const sanityConfigured = Boolean(projectId && dataset);

const client: SanityClient | null = sanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion: "2026-09-01",
      useCdn: !token && process.env.NODE_ENV === "production",
      token,
      perspective: "published",
    })
  : null;

const imageBuilder = client ? imageUrlBuilder(client) : null;

export type SanityImage = {
  asset?: { _ref?: string; _type?: string };
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
};

export type NewsArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  mainImage?: SanityImage;
  body?: unknown[];
  seoTitle?: string;
  seoDescription?: string;
};

export type GalleryItem = {
  _id: string;
  title: string;
  category: string;
  caption?: string;
  occurredAt?: string;
  image?: SanityImage;
};

const fallbackArticles: NewsArticle[] = newsItems.map((item, index) => ({
  _id: `fallback-news-${index + 1}`,
  title: item.title,
  slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  excerpt: item.excerpt,
  category: item.category,
  featured: index === 0,
}));

const fallbackGallery: GalleryItem[] = [
  "Airport & cargo operations",
  "Training activities",
  "International business events",
  "Umrah & Ziyarah activities",
  "Staff & customer service",
  "Office locations",
].map((title, index) => ({ _id: `fallback-gallery-${index + 1}`, title, category: title }));

const newsFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  publishedAt,
  "updatedAt": _updatedAt,
  featured,
  mainImage,
  body,
  seoTitle,
  seoDescription
`;

async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T, tags: string[]): Promise<T> {
  if (!client) return fallback;
  try {
    return await client.fetch<T>(query, params, {
      cache: "force-cache",
      next: { revalidate: 300, tags },
    });
  } catch (error) {
    console.error("Sanity content fetch failed", error);
    return fallback;
  }
}

export function sanityImageUrl(source: SanityImage | undefined, width: number, height: number) {
  if (!imageBuilder || !source?.asset) return null;
  return imageBuilder.image(source).width(width).height(height).fit("crop").auto("format").url();
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  return safeFetch(
    `*[_type == "newsArticle" && defined(slug.current)] | order(featured desc, publishedAt desc, _createdAt desc) {${newsFields}}`,
    {},
    fallbackArticles,
    ["sanity-news"],
  );
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  const fallback = fallbackArticles.find((item) => item.slug === slug) || null;
  return safeFetch(
    `*[_type == "newsArticle" && slug.current == $slug][0] {${newsFields}}`,
    { slug },
    fallback,
    ["sanity-news", `sanity-news-${slug}`],
  );
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return safeFetch(
    `*[_type == "galleryItem"] | order(order asc, occurredAt desc, _createdAt desc) {
      _id, title, category, caption, occurredAt, image
    }`,
    {},
    fallbackGallery,
    ["sanity-gallery"],
  );
}
