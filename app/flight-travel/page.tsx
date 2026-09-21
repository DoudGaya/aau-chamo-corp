import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, FileCheck2, PlaneTakeoff, ShieldCheck } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Flight & Travel", description: "Flight reservation enquiries, visa assistance, travel insurance and baggage support." };

export default function FlightTravelPage() {
  return (
    <>
      <PageHero eyebrow="Flight & travel" title="Plan the journey. Verify every commitment." description="Flight requests, visa assistance, travel insurance and baggage support through one structured travel desk." meta={["Flight enquiries", "Visa support", "Travel protection"]} />
      <section className="section"><div className="shell"><span className="eyebrow">Travel desk</span><h2 className="headline" style={{ marginBottom: 48 }}>Support around the whole journey.</h2><div className="process-grid">{[[PlaneTakeoff, "Flight requests", "Submit route, date, passenger count and requirements."], [FileCheck2, "Visa assistance", "Request country-specific preparation and process support."], [ShieldCheck, "Travel insurance", "Ask for verified options through approved providers."], [CalendarCheck, "Baggage support", "Share item, route and handling requirements for review."]].map(([Icon, title, detail]) => { const TravelIcon = Icon as typeof PlaneTakeoff; return <div className="process-step" key={String(title)}><span className="step-no"><TravelIcon size={17} /></span><h3>{String(title)}</h3><p>{String(detail)}</p></div>; })}</div><div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}><Link className="button red" href="/enquire?type=flight">Request a flight</Link><Link className="button ghost" href="/services/visa-assistance">Visa assistance</Link></div></div></section>
      <CtaBand title="Start with the route. We’ll guide the request." />
    </>
  );
}
