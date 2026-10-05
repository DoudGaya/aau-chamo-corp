import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Plane, Route, ShieldCheck } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { TrackingDock } from "@/components/tracking-dock";
import { branches, services } from "@/lib/content";
import {
  getEvents,
  getNewsArticles,
  getPartners,
  getTestimonials,
  getActivityHighlights,
  sanityImageUrl,
  type EventItem,
  type NewsArticle,
  type PartnerItem,
  type TestimonialItem,
  type ActivityHighlight,
} from "@/lib/sanity";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Cargo Logistics, Flight Reservations & Agency Services Nigeria",
  description:
    "Nigeria's trusted corporate gateway for international air and sea cargo freight forwarding, domestic & global flight bookings, Umrah pilgrimage travel packages, and business agency services in Kano and across Nigeria.",
  path: "/",
  keywords: [
    "A.A.U Chamo",
    "AAU Chamo",
    "cargo logistics Nigeria",
    "air cargo Kano",
    "flight reservations Kano",
    "airline booking Kano Nigeria",
    "Umrah packages Kano Nigeria",
    "freight forwarding Nigeria",
    "courier delivery Kano",
    "clearing and forwarding agency Nigeria",
    "Mallam Aminu Kano International Airport cargo",
    "international business agency Kano",
  ],
});

export default async function Home() {
  const [articles, events, partners, testimonials, activities] = await Promise.all([
    getNewsArticles(),
    getEvents(),
    getPartners(),
    getTestimonials(),
    getActivityHighlights(),
  ]);
  const recentArticles = articles.slice(0, 3);
  const upcomingEvents = events.slice(0, 2);

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
              <Link className="button red" href="/onboard">Get Started / Onboard <ArrowUpRight size={18} /></Link>
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
            <span className="eyebrow">Cargo &amp; logistics</span>
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

      {activities.length > 0 && (
        <section className="section" style={{ background: "var(--paper)" }}>
          <div className="shell">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Operations in action</span>
                <h2 className="headline">Ground, air and cargo capabilities executed daily.</h2>
              </div>
              <p className="lede">
                Direct verification of operational activities across major Nigerian gateways, airside cargo tarmacs, bonded customs terminals and pilgrimage routes.
              </p>
            </div>
            <div className="activities-grid">
              {activities.map((act: ActivityHighlight, index: number) => {
                const imgUrl = sanityImageUrl(act.image, 800, 500) || act.imageUrl || "/images/activity-cargo-ramp.jpg";
                const code = act.code || String(index + 1).padStart(2, "0");

                return (
                  <article className="activity-card" key={act._id}>
                    <div className="activity-card-media">
                      <Image
                        src={imgUrl}
                        alt={act.title}
                        fill
                        sizes="(max-width: 980px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="activity-card-badge">
                        <span>{code}</span>
                        <span>·</span>
                        <span>{act.category}</span>
                      </div>
                    </div>
                    <div className="activity-card-body">
                      {act.stat && (
                        <div className="activity-stat-bar">
                          <strong>{act.stat}</strong>
                          <span>{act.statLabel || "Operational Standard"}</span>
                        </div>
                      )}
                      <h3>{act.title}</h3>
                      <p>{act.summary}</p>
                      {act.capabilities && act.capabilities.length > 0 && (
                        <ul className="activity-caps">
                          {act.capabilities.map((cap) => (
                            <li key={cap}>{cap}</li>
                          ))}
                        </ul>
                      )}
                      <div className="activity-card-action">
                        <Link className="status-link" href={act.linkUrl || "/enquire"}>
                          {act.linkText || "Enquire for this service"} <ArrowUpRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

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

      {partners.length > 0 && (
        <section className="section">
          <div className="shell">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Strategic Alliances</span>
                <h2 className="headline">Certified airline, handling and regulatory network.</h2>
              </div>
              <p className="lede">
                Direct carrier capacity agreements and accredited handling infrastructure ensuring space guarantee, customs compliance and rapid clearance.
              </p>
            </div>
            <div className="partners-grid">
              {partners.map((partner: PartnerItem, index: number) => {
                const logoUrl = sanityImageUrl(partner.logo, 240, 80);
                return (
                  <article className="partner-card" key={partner._id}>
                    <div>
                      <div className="partner-top">
                        <span className="partner-index">{String(index + 1).padStart(2, "0")}</span>
                        {partner.badge && (
                          <span className="partner-badge-pill">
                            <ShieldCheck size={11} style={{ color: "var(--red)" }} />
                            {partner.badge}
                          </span>
                        )}
                      </div>
                      {logoUrl && (
                        <div style={{ marginBottom: 14 }}>
                          <Image src={logoUrl} alt={partner.name} width={120} height={36} style={{ objectFit: "contain" }} />
                        </div>
                      )}
                      <h3>{partner.name}</h3>
                      <p className="partner-scope">{partner.scope}</p>
                    </div>
                    <div className="partner-footer">
                      <span className="partner-status">
                        <span className="partner-status-dot" />
                        Active Network Alliance
                      </span>
                      {partner.websiteUrl ? (
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="partner-link"
                        >
                          Verify Portal <ArrowUpRight size={13} />
                        </a>
                      ) : (
                        <span className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>Accredited</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section" style={{ background: "var(--paper)" }}>
          <div className="shell">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Verified Customer Feedback</span>
                <h2 className="headline">Trusted by enterprise shippers and travel leaders.</h2>
              </div>
              <p className="lede">
                Documented operational experiences from commercial cargo exporters, corporate travelers, and pilgrimage coordinators across Nigeria.
              </p>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((t: TestimonialItem) => {
                const initials = t.clientName
                  .split(" ")
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                const avatarUrl = sanityImageUrl(t.avatar, 96, 96);

                return (
                  <article className="testimonial-card" key={t._id}>
                    <div>
                      <div className="testimonial-head">
                        <span className="testimonial-service-tag">{t.service}</span>
                        <div className="testimonial-stars" aria-label={`${t.rating || 5} out of 5 stars`}>
                          {"★".repeat(t.rating || 5)}
                        </div>
                      </div>
                      <blockquote className="testimonial-quote">
                        {t.quote}
                      </blockquote>
                    </div>
                    <div className="testimonial-client">
                      {avatarUrl ? (
                        <div style={{ width: 44, height: 44, borderRadius: 2, overflow: "hidden", position: "relative", flexShrink: 0, border: "1px solid var(--line)" }}>
                          <Image src={avatarUrl} alt={t.clientName} fill style={{ objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div className="testimonial-avatar" aria-hidden="true">
                          {initials}
                        </div>
                      )}
                      <div className="testimonial-details">
                        <strong>{t.clientName}</strong>
                        <span>{t.clientRole} · {t.company}</span>
                        {t.verified && (
                          <span className="testimonial-verified-badge">
                            <Check size={12} /> Verified Corporate Client
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section className="section" style={{ background: "var(--paper)" }}>
          <div className="shell">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Events &amp; Forums</span>
                <h2 className="headline">Corporate summits and trade briefings.</h2>
              </div>
              <Link className="status-link" href="/events">View all events <ArrowRight size={17} /></Link>
            </div>
            <div className="events-grid">
              {upcomingEvents.map((ev: EventItem) => {
                const cover = sanityImageUrl(ev.coverImage, 800, 500);
                const startDate = ev.dateRange?.startDate ? new Date(ev.dateRange.startDate).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : null;
                return (
                  <article className="event-card" key={ev._id}>
                    <div className="event-card-media">
                      {cover ? (
                        <Image src={cover} alt={ev.coverImage?.alt || ev.title} fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                      ) : null}
                    </div>
                    <div className="event-card-content">
                      <div className="event-meta-tags">
                        {startDate && <span className="event-date-tag">{startDate}</span>}
                        {ev.location && <span className="event-location-tag">{ev.location}</span>}
                      </div>
                      <h3 className="event-title">{ev.title}</h3>
                      <Link href="/events" className="button ghost" style={{ minHeight: "40px", fontSize: "13px", alignSelf: "flex-start", marginTop: "auto", border: "1px solid var(--line)" }}>
                        <span>Learn More</span> <ArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div><span className="eyebrow">News &amp; guidance</span><h2 className="headline">Useful information, clearly stated.</h2></div>
            <Link className="status-link" href="/news">View all updates <ArrowRight size={17} /></Link>
          </div>
          <div className="news-grid">
            {recentArticles.map((item: NewsArticle, index: number) => (
              <article className={`news-card ${item.featured || index === 0 ? "featured" : ""}`} key={item._id}>
                <span className="news-meta">{item.category} {item.publishedAt ? `· ${new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.publishedAt))}` : ""}</span>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <Link className="status-link" href={`/news/${item.slug}`}>Read full update <ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
          <div className="form-note" style={{ marginTop: 24 }}><Check size={17} /> Every service statement is written to avoid unverified prices, availability or confirmations.</div>
        </div>
      </section>

      <CtaBand title="One request. One reference. The right team." />
    </>
  );
}
