import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  noindex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = "/cargo-operations-hero.png",
  type = "website",
  publishedTime,
  modifiedTime,
  keywords,
  noindex = false,
}: PageMetadata): Metadata {
  const canonical = new URL(path, siteConfig.url).toString();
  const imageUrl = new URL(image, siteConfig.url).toString();

  return {
    title,
    description,
    keywords: keywords && keywords.length > 0 ? keywords : undefined,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type,
      url: canonical,
      title: `${title} | A.A.U Chamo`,
      description,
      siteName: siteConfig.name,
      locale: "en_NG",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | A.A.U Chamo`,
      description,
      images: [imageUrl],
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.url).toString(),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  url,
  serviceType,
  areaServed = "Nigeria",
}: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: serviceType || name,
    description,
    url: new URL(url, siteConfig.url).toString(),
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: { "@type": "Country", name: areaServed },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${name} Catalog`,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name,
          },
        },
      ],
    },
  };
}

export function articleJsonLd({
  title,
  description,
  url,
  imageUrl = "/cargo-operations-hero.png",
  publishedTime,
  modifiedTime,
  authorName = "A.A.U Chamo Editorial",
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url: new URL(url, siteConfig.url).toString(),
    image: [new URL(imageUrl, siteConfig.url).toString()],
    datePublished: publishedTime || new Date().toISOString(),
    dateModified: modifiedTime || publishedTime || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: authorName,
      url: siteConfig.url,
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": new URL(url, siteConfig.url).toString(),
    },
  };
}
