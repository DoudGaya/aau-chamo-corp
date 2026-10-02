import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { services } from "@/lib/content";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Corporate Services | Cargo, Aviation, Travel & Agency Services Nigeria",
  description:
    "Comprehensive corporate services by A.A.U Chamo: air cargo logistics, flight bookings, express courier, visa advisory, Umrah pilgrimage packages, clearing and forwarding in Kano, Nigeria.",
  path: "/services",
  keywords: [
    "AAU Chamo services",
    "cargo logistics Kano",
    "airline booking Nigeria",
    "express courier Kano",
    "visa assistance Nigeria",
    "Umrah packages Kano",
    "business agency services Nigeria",
  ],
});

export default function ServicesPage() {
  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "A.A.U Chamo Services",
      description: "List of official logistics, aviation, travel and business services offered by A.A.U Chamo.",
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.title,
        url: `${siteConfig.url}/services/${service.slug}`,
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Services"
        title="Nine services. One clear customer gateway."
        description="Explore each service, understand the process and submit a structured request to the appropriate A.A.U Chamo team."
        meta={["Cargo", "Travel", "Business support"]}
      />
      <section className="section">
        <div className="shell service-index">
          {services.map((service, index) => (
            <Link className="service-row" href={`/services/${service.slug}`} key={service.slug}>
              <span className="num">{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
