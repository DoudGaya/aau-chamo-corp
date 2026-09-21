import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { newsItems } from "@/lib/content";

export const metadata: Metadata = { title: "News & Updates", description: "A.A.U Chamo service guidance, company announcements and operational updates." };

export default function NewsPage() {
  const extended = [
    ...newsItems,
    { category: "Customer guide", date: "Enquiries", title: "Why every website request receives a unique reference", excerpt: "The reference connects acknowledgement, internal routing and customer follow-up without presenting the request as confirmed." },
    { category: "Travel", date: "Process guide", title: "What to include in a visa-assistance enquiry", excerpt: "Destination, nationality, purpose and travel date help the travel team review the correct request." },
    { category: "Digital service", date: "Safety", title: "How A.A.U Assist handles unverified information", excerpt: "The assistant explains approved services, but prices, availability and confirmations remain with authorised staff or connected systems." },
  ];
  return (
    <>
      <PageHero eyebrow="News & updates" title="Announcements, guidance and company activity." description="A clear record of service information, new routes, partnerships, events and customer guidance." meta={["Company news", "Service guides", "Announcements"]} />
      <section className="section"><div className="shell news-grid">{extended.map((item, index) => <article className={`news-card ${index === 0 ? "featured" : ""}`} key={item.title}><span className="news-meta">{item.category} · {item.date}</span><h3>{item.title}</h3><p>{item.excerpt}</p>{index > 2 ? <Link className="status-link" href="/enquire" style={{ marginTop: 22 }}>Ask a related question <ArrowRight size={15} /></Link> : null}</article>)}</div></section>
      <CtaBand title="Need current service information? Ask the team." />
    </>
  );
}
