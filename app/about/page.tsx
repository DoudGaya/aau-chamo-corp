import type { Metadata } from "next";
import { Award, Check, Compass, Handshake, ShieldCheck, Target } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { branches } from "@/lib/content";

export const metadata: Metadata = { title: "About Us", description: "Company profile, values, network and service approach of A.A.U Chamo." };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Company" title="Built to connect people, cargo and opportunity." description="A.A.U Chamo brings logistics, aviation, travel and business support together through disciplined service and direct customer care." meta={["Nigeria-based", "Multi-service", "Customer-focused"]} />
      <section className="section">
        <div className="shell content-grid">
          <div className="prose">
            <h2>A practical partner for complex journeys.</h2>
            <p>A.A.U Chamo International Business Agency Services Limited serves customers who need dependable coordination across cargo logistics, flight and travel support, courier services, visa assistance, pilgrimage travel and international business activity.</p>
            <p>Our public website is designed as a clear front door to those services. It gathers the right information, routes each request to the appropriate team and keeps unverified information separate from confirmed action.</p>
            <h3>Vision</h3>
            <p>To be a trusted African gateway for efficient cargo movement, confident travel and responsible international business support.</p>
            <h3>Mission</h3>
            <p>To make complex service requests easier to understand, easier to submit and easier for our teams to process with accountability.</p>
          </div>
          <aside className="side-panel"><h3>What defines us</h3><p>Clear requests. Responsible communication. Operational follow-through.</p><ul className="check-list" style={{ gridTemplateColumns: "1fr" }}>{["Customer clarity", "Service integrity", "Secure handling", "Human accountability"].map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></aside>
        </div>
      </section>
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="shell">
          <span className="eyebrow">Core values</span><h2 className="headline" style={{ marginBottom: 48 }}>A service culture built for trust.</h2>
          <div className="process-grid">
            {[
              [ShieldCheck, "Integrity", "We do not present an enquiry, provisional option or estimate as confirmed."],
              [Target, "Precision", "We collect structured information to reduce delays and avoid assumptions."],
              [Handshake, "Partnership", "We coordinate with customers, staff and approved service partners."],
              [Compass, "Progress", "Our systems are designed to connect with future tracking and customer tools."],
            ].map(([Icon, title, detail]) => {
              const ValueIcon = Icon as typeof Award;
              return <div className="process-step" key={String(title)}><span className="step-no"><ValueIcon size={17} /></span><h3>{String(title)}</h3><p>{String(detail)}</p></div>;
            })}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <div className="section-heading"><div><span className="eyebrow">Branches & stations</span><h2 className="headline">Coverage where customers need it.</h2></div><p className="lede">Contact details are maintained centrally so customers can be routed to the appropriate station.</p></div>
          <div className="service-index">{branches.map((branch, index) => <div className="service-row" key={branch.city}><span className="num">{String(index + 1).padStart(2, "0")}</span><h3>{branch.city}</h3><p>{branch.role}</p><Award size={20} /></div>)}</div>
        </div>
      </section>
      <CtaBand title="Bring us the journey. We’ll route the request." />
    </>
  );
}
