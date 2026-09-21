import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/page-hero";
import { branches } from "@/lib/content";
import { siteConfig, whatsappHref } from "@/lib/site";

export const metadata: Metadata = { title: "Contact Us", description: "Contact A.A.U Chamo customer service, cargo operations and travel support." };

export default function ContactPage() {
  const whatsapp = whatsappHref();
  return (
    <>
      <PageHero eyebrow="Contact us" title="Reach the right team without the runaround." description="Use the secure form for structured service requests, or contact customer service through the configured official channels." meta={["Customer service", "Cargo operations", "Travel desk"]} />
      <section className="section">
        <div className="shell contact-grid">
          <div>
            <span className="eyebrow">Head office</span><h2 className="headline">Start with customer service.</h2>
            <div className="contact-list" style={{ marginTop: 40 }}>
              <div className="contact-row"><MapPin size={19} /><div><strong>Address</strong><span>{siteConfig.address}</span></div></div>
              <div className="contact-row"><Phone size={19} /><div><strong>Telephone</strong><span>{siteConfig.phone}</span></div></div>
              <div className="contact-row"><Mail size={19} /><div><strong>Email</strong><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div></div>
              <div className="contact-row"><MessageCircle size={19} /><div><strong>WhatsApp</strong><a href={whatsapp} target={whatsapp.startsWith("https") ? "_blank" : undefined} rel="noreferrer">Open official channel</a></div></div>
              <div className="contact-row"><Clock3 size={19} /><div><strong>Business hours</strong><span>{siteConfig.hours}</span></div></div>
            </div>
          </div>
          {siteConfig.mapEmbedUrl ? <iframe className="map-frame" src={siteConfig.mapEmbedUrl} title="A.A.U Chamo location" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="map-frame"><div className="map-pin"><MapPin size={34} /></div></div>}
        </div>
      </section>
      <section className="section" style={{ background: "var(--paper)" }}><div className="shell form-layout"><div><span className="eyebrow">General enquiry</span><h2 className="headline">Send a message with a trackable reference.</h2><p className="lede">For a specific cargo or travel request, choose the matching service type in the form.</p><div className="branch-list">{branches.map((branch) => <div className="branch-item" key={branch.city}><strong>{branch.city}</strong><span>{branch.role}</span></div>)}</div></div><EnquiryForm defaultType="general" /></div></section>
    </>
  );
}
