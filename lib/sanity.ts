import "server-only";

import { createClient, type SanityClient } from "@sanity/client";
import { newsItems } from "@/lib/content";
import type { NewsArticle, GalleryItem, StaffMember, EventItem, PartnerItem, TestimonialItem, ActivityHighlight } from "./sanity-image";
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

const fallbackPartners: PartnerItem[] = [
  {
    _id: "partner-1",
    name: "EgyptAir Cargo & Airlines",
    slug: "egyptair-cargo",
    category: "airline",
    scope: "Scheduled cargo allotment and passenger corridors linking Kano & Lagos to Cairo and Mediterranean/Middle East hubs.",
    badge: "IATA Airline Partner",
    websiteUrl: "https://www.egyptair.com",
    order: 1,
    featured: true,
  },
  {
    _id: "partner-2",
    name: "Saudia Airlines & Cargo",
    slug: "saudia-cargo",
    category: "airline",
    scope: "Dedicated passenger seats and air cargo space allocations connecting Northern Nigeria to Jeddah, Madinah & Riyadh.",
    badge: "Pilgrimage Carrier Alliance",
    websiteUrl: "https://www.saudia.com",
    order: 2,
    featured: true,
  },
  {
    _id: "partner-3",
    name: "Turkish Airlines Cargo",
    slug: "turkish-cargo",
    category: "airline",
    scope: "Worldwide wide-body freight transit network connecting Mallam Aminu Kano International Airport to over 120 countries.",
    badge: "Global Freight Alliance",
    websiteUrl: "https://www.turkishcargo.com",
    order: 3,
    featured: true,
  },
  {
    _id: "partner-4",
    name: "NAHCO Aviance",
    slug: "nahco-aviance",
    category: "ground_handling",
    scope: "Airport apron operations, ULD cargo loading, aircraft ground power, and bonded warehouse clearance across Nigerian gateways.",
    badge: "Certified Ground Handler",
    websiteUrl: "https://nahcoaviance.com",
    order: 4,
    featured: true,
  },
  {
    _id: "partner-5",
    name: "SAHCO Ground Handling",
    slug: "sahco-handling",
    category: "ground_handling",
    scope: "Aviation ramp logistics, temperature-controlled cold-chain cargo storage, and airside consignment transfer services.",
    badge: "Cold-Chain & Ramp Alliance",
    websiteUrl: "https://sahcoplc.com",
    order: 5,
    featured: true,
  },
  {
    _id: "partner-6",
    name: "Nigeria Customs Service Licensed",
    slug: "ncs-licensed-agent",
    category: "customs_port",
    scope: "Accredited customs brokerage, Form 'M' & PAAR clearance, single goods declaration (SGD) processing, and bonded escrow.",
    badge: "Authorized Clearing Agent",
    order: 6,
    featured: true,
  },
];

const fallbackTestimonials: TestimonialItem[] = [
  {
    _id: "testimonial-1",
    clientName: "Alhaji Mustapha Danbatta",
    clientRole: "Managing Director",
    company: "Sahel Grain & Agro-Export Consortium",
    service: "Air Cargo & Logistics",
    quote: "Our bulk sesame and agricultural shipments through Mallam Aminu Kano International Airport require strict flight schedules. A.A.U Chamo manages the palletization, cargo hold space confirmation, and export customs clearance with absolute operational discipline.",
    rating: 5,
    verified: true,
    order: 1,
    featured: true,
  },
  {
    _id: "testimonial-2",
    clientName: "Hajiya Amina Bello-Katsina",
    clientRole: "Group Operations Director",
    company: "Al-Bayan Pilgrimage Delegations",
    service: "Umrah & Ziyarah Pilgrimage",
    quote: "Coordinating flights, group visas, and airport protocol for over 240 Umrah pilgrims from Kano to Madinah was completely seamless. Every booking reference was verified in advance, giving our delegates total comfort and peace of mind.",
    rating: 5,
    verified: true,
    order: 2,
    featured: true,
  },
  {
    _id: "testimonial-3",
    clientName: "Engr. Tunde Adeleke",
    clientRole: "Head of Procurement & Supply",
    company: "Horizon Power & Infrastructure Ltd",
    service: "Clearing & Forwarding",
    quote: "Emergency power generation parts cleared through Lagos bonded terminal and freighted to Kano within 36 hours. The structured reference tracking kept our project directors updated at every operational handover point without guesswork.",
    rating: 5,
    verified: true,
    order: 3,
    featured: true,
  },
  {
    _id: "testimonial-4",
    clientName: "Alhaji Bashir Umar Farouk",
    clientRole: "Chief Executive Officer",
    company: "Danfarouk Global Trading Group",
    service: "International Business & Trade Services",
    quote: "In cross-border trade between Nigeria, Dubai, and Guangzhou, having a single corporate partner that handles both executive flight itineraries and freight clearance under one roof has eliminated costly weeks of friction for our merchant network.",
    rating: 5,
    verified: true,
    order: 4,
    featured: true,
  },
];

const fallbackActivityHighlights: ActivityHighlight[] = [
  {
    _id: "activity-1",
    title: "Scheduled Air Cargo & Heavy Freighter Operations",
    code: "01",
    category: "Air Freight & Cargo Charter",
    summary: "Direct palletized freight intake, ramp escort, and space allocation across domestic and international airline freighters at Mallam Aminu Kano International Airport (KAN) and Lagos (LOS).",
    imageUrl: "/images/activity-cargo-ramp.jpg",
    stat: "48-Hour Hub Feed",
    statLabel: "Transit Turnaround",
    capabilities: [
      "Main deck freighter palletization & ULD loading",
      "Perishable & dangerous goods compliance",
      "Ramp escort & airside transfer supervision",
    ],
    linkUrl: "/cargo-logistics",
    linkText: "Explore air cargo corridors",
    order: 1,
    featured: true,
  },
  {
    _id: "activity-2",
    title: "Bonded Customs Clearing & Inter-Terminal Transit",
    code: "02",
    category: "Bonded Customs & Forwarding",
    summary: "End-to-end import/export documentation, tariff classification, single goods declaration (SGD), and secure inter-terminal transit for sea and air shipments.",
    imageUrl: "/images/activity-customs-hub.jpg",
    stat: "100% Cleared",
    statLabel: "Documentation Compliance",
    capabilities: [
      "Form 'M' & PAAR expedited processing",
      "Bonded warehouse release & escort",
      "Direct seaport & airport door-to-door transit",
    ],
    linkUrl: "/services/clearing-forwarding",
    linkText: "Review clearing protocol",
    order: 2,
    featured: true,
  },
  {
    _id: "activity-3",
    title: "Corporate Aviation & Group Flight Reservations",
    code: "03",
    category: "Executive Aviation & Ticketing",
    summary: "Corporate flight reservations, itinerary management, and group travel charters across domestic carriers and premier international airlines.",
    imageUrl: "/images/activity-aviation-hub.jpg",
    stat: "3 Core Hubs",
    statLabel: "Kano · Abuja · Lagos",
    capabilities: [
      "Dedicated corporate booking accounts",
      "Fast-track VIP protocol & airport lounge access",
      "Flexible schedule re-routing & reissue management",
    ],
    linkUrl: "/flight-travel",
    linkText: "Book & enquire flights",
    order: 3,
    featured: true,
  },
  {
    _id: "activity-4",
    title: "Umrah Pilgrimage & Delegation Ground Coordination",
    code: "04",
    category: "Pilgrimage & Delegation Travel",
    summary: "Comprehensive pilgrimage travel facilitation including visa processing, scheduled group flights to Jeddah/Madinah, and structured ground transport guidance.",
    imageUrl: "/images/activity-pilgrimage.jpg",
    stat: "10,000+ Pilgrims",
    statLabel: "Guided Since Inception",
    capabilities: [
      "Saudi e-visa & biometric appointment coordination",
      "Dedicated reception team at Jeddah & Madinah",
      "Structured air-conditioned ground transfer fleets",
    ],
    linkUrl: "/umrah-ziyarah",
    linkText: "View pilgrimage packages",
    order: 4,
    featured: true,
  },
];

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

export async function getPartners(): Promise<PartnerItem[]> {
  const result = await safeFetch<PartnerItem[]>(
    `*[_type == "partner" && featured != false] | order(order asc, _createdAt desc) {
      _id,
      name,
      "slug": slug.current,
      category,
      scope,
      badge,
      logo,
      activityImage,
      websiteUrl,
      order,
      featured
    }`,
    {},
    fallbackPartners,
    ["sanity-partners"],
  );
  return result && result.length > 0 ? result : fallbackPartners;
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  const result = await safeFetch<TestimonialItem[]>(
    `*[_type == "testimonial" && featured != false] | order(order asc, _createdAt desc) {
      _id,
      clientName,
      clientRole,
      company,
      service,
      quote,
      avatar,
      companyLogo,
      activityImage,
      rating,
      verified,
      order,
      featured
    }`,
    {},
    fallbackTestimonials,
    ["sanity-testimonials"],
  );
  return result && result.length > 0 ? result : fallbackTestimonials;
}

export async function getActivityHighlights(): Promise<ActivityHighlight[]> {
  const result = await safeFetch<ActivityHighlight[]>(
    `*[_type == "activityHighlight" && featured != false] | order(order asc, _createdAt desc) {
      _id,
      title,
      code,
      category,
      summary,
      image,
      stat,
      statLabel,
      capabilities,
      linkUrl,
      linkText,
      order,
      featured
    }`,
    {},
    fallbackActivityHighlights,
    ["sanity-activities"],
  );
  return result && result.length > 0 ? result : fallbackActivityHighlights;
}


