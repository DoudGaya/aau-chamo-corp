import type { Metadata } from "next";
import Image from "next/image";
import { Award, Check, Compass, Globe, Handshake, Mail, ShieldCheck, Target, UserCircle2 } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { aboutContent, branches } from "@/lib/content";
import { getStaffMembers, sanityImageUrl } from "@/lib/sanity";

import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "About A.A.U Chamo | Cargo, Aviation & International Business Agency Nigeria",
  description:
    "Company profile, corporate leadership, operational stations, and service philosophy of A.A.U Chamo International Business Agency Services Limited, headquartered in Kano, Nigeria.",
  path: "/about",
  keywords: [
    "about AAU Chamo",
    "AAU Chamo Kano",
    "AAU Chamo leadership",
    "cargo company profile Kano",
    "aviation and travel agency Kano",
    "international business agency Nigeria",
  ],
});

export default async function AboutPage() {
  const staff = await getStaffMembers();

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${siteConfig.url}/about/#webpage`,
      url: `${siteConfig.url}/about`,
      name: "About A.A.U Chamo",
      description: "Company background, mission, and leadership of A.A.U Chamo International Business Agency Services Limited.",
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#organization` },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
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
          <span className="eyebrow">Leadership &amp; Management</span>
          <h2 className="headline" style={{ marginBottom: 48 }}>The team behind every service decision.</h2>
          
          {staff.length > 0 ? (
            <div className="team-grid">
              {staff.map((person) => {
                const photo = sanityImageUrl(person.portrait, 600, 600);
                return (
                  <div className="team-card" key={person._id}>
                    <div className="team-card-image">
                      {photo ? (
                        <Image src={photo} alt={person.portrait?.alt || person.name} fill sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                      ) : (
                        <div className="team-card-placeholder">
                          <UserCircle2 size={54} strokeWidth={1.5} />
                        </div>
                      )}
                      {person.department ? (
                        <span className="team-dept-badge">{person.department.replace(/_/g, " ")}</span>
                      ) : null}
                    </div>
                    <div className="team-card-body">
                      <h3>{person.name}</h3>
                      <p className="team-role">{person.role}</p>
                      {person.bio ? <p className="team-bio">{person.bio}</p> : null}
                      <div className="team-card-links">
                        {person.email ? (
                          <a href={`mailto:${person.email}`} title={`Email ${person.name}`} className="team-link">
                            <Mail size={16} /> <span>{person.email}</span>
                          </a>
                        ) : null}
                        {person.linkedinUrl ? (
                          <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn Profile" className="team-link">
                            <Globe size={16} /> <span>LinkedIn</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="process-grid">
              {aboutContent.management.map((person) => {
                const isPending = person.name.startsWith("[");
                return (
                  <div className="process-step" key={person.title} style={isPending ? { border: "2px dashed #e5a000", opacity: 0.8 } : undefined}>
                    <span className="step-no"><UserCircle2 size={17} /></span>
                    <h3>{isPending ? "Awaiting approved content" : person.name}</h3>
                    <p style={{ fontWeight: 600, marginBottom: 6 }}>{person.title}</p>
                    {!isPending && <p>{person.bio}</p>}
                    {isPending && <p className="muted" style={{ fontSize: 12 }}>Manage leadership profiles anytime via the Sanity Content Studio.</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <div className="section-heading"><div><span className="eyebrow">Branches &amp; stations</span><h2 className="headline">Coverage where customers need it.</h2></div><p className="lede">Contact details are maintained centrally so customers can be routed to the appropriate station.</p></div>
          <div className="service-index">{branches.map((branch, index) => <div className="service-row" key={branch.city}><span className="num">{String(index + 1).padStart(2, "0")}</span><h3>{branch.city}</h3><p>{branch.role}</p><Award size={20} /></div>)}</div>
        </div>
      </section>
      <CtaBand title="Bring us the journey. We’ll route the request." />
    </>
  );
}
