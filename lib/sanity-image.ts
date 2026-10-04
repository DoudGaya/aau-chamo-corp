import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

const imageBuilder = projectId
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

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

export type StaffMember = {
  _id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  portrait?: SanityImage;
  hierarchyOrder?: number;
  email?: string;
  linkedinUrl?: string;
};

export type EventItem = {
  _id: string;
  title: string;
  slug?: string;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  location?: string;
  coverImage?: SanityImage;
  description?: unknown[];
  registrationLink?: string;
};

export type PartnerItem = {
  _id: string;
  name: string;
  slug?: string;
  category?: string;
  scope: string;
  badge?: string;
  logo?: SanityImage;
  activityImage?: SanityImage;
  websiteUrl?: string;
  order?: number;
  featured?: boolean;
};

export type TestimonialItem = {
  _id: string;
  clientName: string;
  clientRole: string;
  company: string;
  service: string;
  quote: string;
  avatar?: SanityImage;
  companyLogo?: SanityImage;
  activityImage?: SanityImage;
  rating?: number;
  verified?: boolean;
  order?: number;
  featured?: boolean;
};

export type ActivityHighlight = {
  _id: string;
  title: string;
  code?: string;
  category: string;
  summary: string;
  image?: SanityImage;
  imageUrl?: string;
  stat?: string;
  statLabel?: string;
  capabilities?: string[];
  linkUrl?: string;
  linkText?: string;
  order?: number;
  featured?: boolean;
};

export function sanityImageUrl(source: SanityImage | undefined, width: number, height: number): string | null {
  if (!imageBuilder || !source?.asset) return null;
  try {
    return imageBuilder.image(source).width(width).height(height).fit("crop").auto("format").url();
  } catch {
    return null;
  }
}
