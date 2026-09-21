import type { Metadata } from "next";
import Link from "next/link";
import { Check, PackageSearch, Plane, Truck } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { cargoModes } from "@/lib/content";

export const metadata: Metadata = { title: "Cargo & Logistics", description: "Airport cargo, door delivery, consolidation, handling and tracking-ready logistics services." };

export default function CargoPage() {
  return (
    <>
      <PageHero eyebrow="Cargo & logistics" title="Cargo movement, structured from origin to handover." description="Submit complete shipment details, request a quotation and keep one reference through operational review." meta={["Air cargo", "Door delivery", "Nationwide coverage"]} />
      <section className="section"><div className="shell content-grid"><div className="prose"><h2>Flexible routes. Controlled handling.</h2><p>Our cargo section supports airport, door and interstate requests with the information required for safe operational review. Quotations, capacity and delivery timing are confirmed by authorised staff after assessment.</p><ul className="check-list">{cargoModes.map((mode) => <li key={mode}><Check size={17} />{mode}</li>)}</ul></div><aside className="side-panel"><h3>Have shipment details ready?</h3><p>Prepare the cargo type, weight, pieces, origin, destination, date and delivery preference.</p><Link className="button red" href="/enquire?type=cargo">Request cargo quote</Link><Link className="button ghost" href="/track-cargo"><PackageSearch size={17} /> Track cargo</Link></aside></div></section>
      <section className="cargo-feature section"><div className="shell"><span className="eyebrow">Cargo flow</span><h2 className="headline" style={{ marginBottom: 48 }}>From airport intake to customer-safe status.</h2><div className="process-grid">{[[Plane, "Airport-to-airport", "Coordinate air cargo between supported stations."], [Truck, "Door connections", "Connect pickup or final delivery where available."], [PackageSearch, "Customer tracking", "Expose only approved customer-facing shipment status."], [Check, "Verified completion", "Delivered status comes from staff or a connected system."]].map(([Icon, title, detail]) => { const ItemIcon = Icon as typeof Plane; return <div className="process-step" key={String(title)}><span className="step-no"><ItemIcon size={17} /></span><h3>{String(title)}</h3><p>{String(detail)}</p></div>; })}</div></div></section>
      <CtaBand title="Tell operations what needs to move." />
    </>
  );
}
