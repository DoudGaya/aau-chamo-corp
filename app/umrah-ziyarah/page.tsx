import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, HeartHandshake, MessageCircle, Users } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Umrah & Ziyarah", description: "Guided pilgrimage travel enquiries for individuals, families and groups." };

export default function UmrahPage() {
  return (
    <>
      <PageHero eyebrow="Pilgrimage travel" title="Umrah & Ziyarah, guided with care." description="Tell us who is travelling, your preferred period and the support you need. Verified package details follow after staff review." meta={["Individuals", "Families", "Groups"]} />
      <section className="section"><div className="shell"><div className="section-heading"><div><span className="eyebrow">Enquiry journey</span><h2 className="headline">A considered process for a meaningful journey.</h2></div><p className="lede">No unverified package price or availability is presented as confirmed.</p></div><div className="process-grid">{[[Users, "Traveller details", "Share the primary contact and total number of travellers."], [CalendarDays, "Preferred period", "Select a date or travel window for staff review."], [HeartHandshake, "Package interest", "Describe the arrangements and support required."], [MessageCircle, "Personal follow-up", "A pilgrimage travel officer responds with verified options."]].map(([Icon, title, detail]) => { const StepIcon = Icon as typeof Users; return <div className="process-step" key={String(title)}><span className="step-no"><StepIcon size={17} /></span><h3>{String(title)}</h3><p>{String(detail)}</p></div>; })}</div><Link className="button red" href="/enquire?type=umrah" style={{ marginTop: 36 }}>Start Umrah enquiry</Link></div></section>
      <CtaBand title="Prepare the details. Let our team guide the next step." />
    </>
  );
}
