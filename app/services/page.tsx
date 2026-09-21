import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { services } from "@/lib/content";

export const metadata: Metadata = { title: "Services", description: "Explore A.A.U Chamo cargo, travel, courier, visa, pilgrimage and international business services." };

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Nine services. One clear customer gateway." description="Explore each service, understand the process and submit a structured request to the appropriate A.A.U Chamo team." meta={["Cargo", "Travel", "Business support"]} />
      <section className="section"><div className="shell service-index">{services.map((service, index) => <Link className="service-row" href={`/services/${service.slug}`} key={service.slug}><span className="num">{String(index + 1).padStart(2, "0")}</span><h3>{service.title}</h3><p>{service.summary}</p><ArrowUpRight size={20} /></Link>)}</div></section>
      <CtaBand />
    </>
  );
}
