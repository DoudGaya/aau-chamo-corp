import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle, Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { getService, services } from "@/lib/content";
import { whatsappHref } from "@/lib/site";

export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })); }

type ServicePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return { title: service.title, description: service.summary };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const typeMap: Record<string, string> = { "flight-reservation-ticketing": "flight", "air-cargo-logistics": "cargo", "courier-delivery": "courier", "visa-assistance": "visa", "travel-insurance": "travel", "umrah-ziyarah": "umrah" };
  const enquiryType = typeMap[service.slug] || "general";
  const whatsapp = whatsappHref(`Hello A.A.U Chamo, I would like to enquire about ${service.title}.`);

  return (
    <>
      <PageHero eyebrow="Service" title={service.title} description={service.summary} meta={["Structured enquiry", "Staff reviewed", "WhatsApp handover"]} />
      <section className="section">
        <div className="shell content-grid">
          <div className="prose">
            <h2>Service overview</h2><p>{service.description}</p>
            <h3>What this service supports</h3>
            <ul className="check-list">{service.benefits.map((benefit) => <li key={benefit}><Check size={17} />{benefit}</li>)}</ul>
          </div>
          <aside className="side-panel"><h3>Start this request</h3><p>Submit the required details and receive a unique reference for staff follow-up.</p><Link className="button red" href={`/enquire?type=${enquiryType}`}>Book / Enquire</Link><a className="button ghost" href={whatsapp} target={whatsapp.startsWith("https") ? "_blank" : undefined} rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a></aside>
        </div>
      </section>
      <section className="section" style={{ background: "var(--paper)" }}><div className="shell"><span className="eyebrow">Service process</span><h2 className="headline" style={{ marginBottom: 48 }}>Four steps, clearly owned.</h2><div className="process-grid">{service.process.map((step, index) => <div className="process-step" key={step.title}><span className="step-no">{index + 1}</span><h3>{step.title}</h3><p>{step.detail}</p></div>)}</div></div></section>
      <section className="section"><div className="shell"><span className="eyebrow">Frequently asked</span><h2 className="headline" style={{ marginBottom: 44 }}>Before you submit.</h2><div className="faq-list">{service.faqs.map((faq) => <details className="faq-item" key={faq.question}><summary>{faq.question}<Plus size={19} /></summary><p>{faq.answer}</p></details>)}</div></div></section>
      <CtaBand title={`Start a ${service.shortTitle.toLowerCase()} request.`} />
    </>
  );
}
