import "server-only";

import { createClient, type SanityClient } from "@sanity/client";
import { newsItems } from "@/lib/content";
import type { NewsArticle, GalleryItem, StaffMember, EventItem } from "./sanity-image";
export * from "./sanity-image";

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

export async function getStaffMembers(): Promise<StaffMember[]> {
  return safeFetch(
    `*[_type == "staffMember"] | order(hierarchyOrder asc, _createdAt asc) {
      _id, name, role, department, bio, portrait, hierarchyOrder, email, linkedinUrl
    }`,
    {},
    [],
    ["sanity-staff", "sanity-staffMember"],
  );
}

export async function getEvents(): Promise<EventItem[]> {
  return safeFetch(
    `*[_type == "event"] | order(dateRange.startDate asc, _createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      dateRange,
      location,
      coverImage,
      description,
      registrationLink
    }`,
    {},
    [],
    ["sanity-event"],
  );
}

export async function getEvent(slug: string): Promise<EventItem | null> {
  return safeFetch(
    `*[_type == "event" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      dateRange,
      location,
      coverImage,
      description,
      registrationLink
    }`,
    { slug },
    null,
    ["sanity-event", `sanity-event-${slug}`],
  );
}

