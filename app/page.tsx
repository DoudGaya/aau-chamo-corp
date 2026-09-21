import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Plane, Route } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { TrackingDock } from "@/components/tracking-dock";
import { branches, newsItems, services } from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <Image src="/cargo-operations-hero.png" alt="Air cargo operations at an international airport" fill priority sizes="100vw" />
        </div>
        <div className="shell hero-content">
          <span className="eyebrow">Built around every journey</span>
          <h1>Cargo in motion. <span>Travel made clear.</span></h1>
          <div className="hero-copy">
            <p>A.A.U Chamo connects cargo logistics, aviation, travel and business support through one dependable customer gateway.</p>
            <div className="hero-actions">
              <Link className="button red" href="/enquire">Book / Enquire <ArrowUpRight size={18} /></Link>
              <Link className="button light" href="/cargo-logistics">Explore cargo services</Link>
            </div>
          </div>
        </div>
        <TrackingDock />
      </section>

      <section className="metric-rail" aria-label="Service highlights">
        <div className="shell metric-grid">
          <div className="metric"><strong>01</strong><span>One reference from enquiry to staff follow-up</span></div>
          <div className="metric"><strong>9</strong><span>Dedicated cargo, travel and business services</span></div>
          <div className="metric"><strong>3</strong><span>Core Nigerian coverage points: Kano, Abuja and Lagos</span></div>
          <div className="metric"><strong>24/7</strong><span>Digital enquiry intake with guided assistance</span></div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div><span className="eyebrow">Service network</span><h2 className="headline">From first question to operational handover.</h2></div>
            <p className="lede">Choose a service, understand the process and send the right information to the right team.</p>
          </div>
          <div className="service-index">
            {services.map((service, index) => (
              <Link className="service-row" href={`/services/${service.slug}`} key={service.slug}>
                <span className="num">{String(index + 1).padStart(2, "0")}</span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <ArrowUpRight size={20} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cargo-feature section">
        <div className="shell cargo-grid">
          <div>
            <span className="eyebrow">Cargo & logistics</span>
            <h2 className="headline">Every route begins with precise information.</h2>
            <p className="lede">Airport-to-airport, door delivery, consolidation and interstate air logistics—structured for clear operational review.</p>
            <Link className="button light" href="/cargo-logistics">View cargo solutions <ArrowRight size={18} /></Link>
          </div>
          <div className="route-board" aria-label="Featured cargo corridors">
            <div className="route-board-head"><span>Origin</span><span /><span>Destination</span><span>Status</span></div>
            {[["Kano", "Abuja"], ["Lagos", "Kano"], ["Abuja", "Lagos"], ["Nigeria", "International"]].map(([origin, destination]) => (
              <div className="route-line" key={`${origin}-${destination}`}><strong>{origin}</strong><Plane size={18} /><strong>{destination}</strong><span className="route-status">Enquiry open</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <span className="eyebrow">How it works</span>
          <h2 className="headline" style={{ marginBottom: 48 }}>A clear path from request to verified action.</h2>
          <div className="process-grid">
            {[
              ["Tell us what you need", "Choose a service and share the route, date and customer details."],
              ["Receive a reference", "Every valid request gets a unique number for follow-up."],
              ["The right team reviews", "Cargo, travel or customer service receives the structured request."],
              ["Staff confirms next steps", "Only verified information is presented as confirmed."],
            ].map(([title, detail], index) => <div className="process-step" key={title}><span className="step-no">{index + 1}</span><h3>{title}</h3><p>{detail}</p></div>)}
          </div>
        </div>
      </section>

      <section className="split-feature">
        <div className="split-dark">
          <span className="eyebrow">Why A.A.U Chamo</span>
          <h2 className="headline">Customer clarity meets operational discipline.</h2>
          <p className="lede">We keep enquiries, provisional information and confirmed actions distinct—so customers always understand the next step.</p>
          <div className="value-list">
            {[
              ["01", "Structured service intake", "Forms collect the exact information each department needs."],
              ["02", "Human accountability", "Complex or uncertain requests are escalated to authorised staff."],
              ["03", "Integration-ready", "The customer experience is designed to connect securely with the ERP."],
            ].map(([number, title, detail]) => <div className="value-item" key={number}><span className="mono">{number}</span><strong>{title}</strong><span>{detail}</span></div>)}
          </div>
        </div>
        <div className="split-paper">
          <span className="eyebrow">Our network</span>
          <h2 className="headline">Connected across key Nigerian corridors.</h2>
          <div className="branch-list">{branches.map((branch) => <div className="branch-item" key={branch.city}><strong>{branch.city}</strong><span>{branch.role}</span></div>)}</div>
          <Link className="button ghost" href="/contact" style={{ marginTop: 34 }}>Contact the nearest team <Route size={18} /></Link>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div><span className="eyebrow">News & guidance</span><h2 className="headline">Useful information, clearly stated.</h2></div>
            <Link className="status-link" href="/news">View all updates <ArrowRight size={17} /></Link>
          </div>
          <div className="news-grid">
            {newsItems.map((item, index) => <article className={`news-card ${index === 0 ? "featured" : ""}`} key={item.title}><span className="news-meta">{item.category} · {item.date}</span><h3>{item.title}</h3><p>{item.excerpt}</p></article>)}
          </div>
          <div className="form-note" style={{ marginTop: 24 }}><Check size={17} /> Every service statement is written to avoid unverified prices, availability or confirmations.</div>
        </div>
      </section>

      <CtaBand title="One request. One reference. The right team." />
    </>
  );
}
