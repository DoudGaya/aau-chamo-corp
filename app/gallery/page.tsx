import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Gallery", description: "A.A.U Chamo cargo, travel, training, events and office activities." };

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="Work in motion." description="A growing view of cargo operations, staff activity, training, pilgrimage services, international events and company locations." meta={["Operations", "People", "Events"]} />
      <section className="section"><div className="shell"><div className="gallery-grid">{["Airport & cargo operations", "Training activities", "International business events", "Umrah & Ziyarah activities", "Staff & customer service", "Office locations"].map((item) => <div className="gallery-tile" key={item}><span>{item}</span></div>)}</div><p className="muted" style={{ marginTop: 20 }}>Additional approved company photography can be published through the configured content workflow.</p></div></section>
      <CtaBand />
    </>
  );
}
