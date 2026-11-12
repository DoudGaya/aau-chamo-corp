import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, MapPin, UserCircle2 } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { getStaffMembers, sanityImageUrl } from "@/lib/sanity";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  title: "Corporate Leadership & Staff Directory | A.A.U Chamo Nigeria",
  description:
    "Meet the corporate leadership, station managers, and operations personnel directing cargo logistics, aviation ticketing, and international trade at A.A.U Chamo.",
  path: "/staff",
  keywords: [
    "AAU Chamo staff",
    "AAU Chamo management",
    "AAU Chamo team",
    "Nigeria cargo management",
    "Kano aviation executives",
  ],
});

function formatDepartment(dept?: string): string {
  if (!dept) return "Leadership";
  const map: Record<string, string> = {
    executive: "Executive & Board",
    cargo: "Cargo & Logistics",
    aviation: "Aviation & Travel",
    umrah: "Umrah & Ziyarah",
    customer_service: "Customer Service",
    operations: "Operations",
    finance_admin: "Finance & Admin",
    legal_compliance: "Legal & Compliance",
    it_systems: "IT & Systems",
  };
  return map[dept] || dept.replace(/_/g, " ");
}

export default async function StaffDirectoryPage() {
  const staff = await getStaffMembers();

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Staff Directory", path: "/staff" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${siteConfig.url}/staff/#webpage`,
      url: `${siteConfig.url}/staff`,
      name: "Corporate Leadership & Staff Directory",
      description: "Leadership and operational personnel at A.A.U Chamo International Business Agency Services Limited.",
      isPartOf: { "@id": `${siteConfig.url}/#website` },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Corporate Team"
        title="The team behind every service decision."
        description="A.A.U Chamo brings together experienced managers and certified personnel across air cargo logistics, flight ticketing, diplomatic travel, and international trade support."
        meta={["Executive Board", "Station Managers", "Operational Personnel"]}
      />

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Personnel Directory</span>
              <h2 className="headline">Officers &amp; Portfolio Leads</h2>
            </div>
            <p className="lede">
              Explore individual professional profiles, operational scopes, and direct departmental channels.
            </p>
          </div>

          {staff.length > 0 ? (
            <div className="team-grid">
              {staff.map((person) => {
                const photo = sanityImageUrl(person.portrait, 600, 600);
                const profileHref = person.slug ? `/staff/${person.slug}` : `/about#team`;
                return (
                  <div className="team-card" key={person._id}>
                    <div className="team-card-image">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={person.portrait?.alt || person.name}
                          fill
                          sizes="(max-width: 760px) 100vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="team-card-placeholder">
                          <UserCircle2 size={54} strokeWidth={1.5} />
                        </div>
                      )}
                      {person.department ? (
                        <span className="team-dept-badge">{formatDepartment(person.department)}</span>
                      ) : null}
                    </div>
                    <div className="team-card-body">
                      <h3>
                        {person.slug ? (
                          <Link href={profileHref} className="team-card-name-link">
                            {person.name}
                          </Link>
                        ) : (
                          person.name
                        )}
                      </h3>
                      <p className="team-role">{person.role}</p>
                      {person.station ? (
                        <p className="team-station-label">
                          <MapPin size={13} /> {person.station}
                        </p>
                      ) : null}

                      <div className="team-card-links">
                        {person.slug ? (
                          <Link href={profileHref} className="team-link team-view-profile">
                            View full profile &rarr;
                          </Link>
                        ) : null}
                        {person.email ? (
                          <a href={`mailto:${person.email}`} title={`Email ${person.name}`} className="team-link">
                            <Mail size={16} /> <span>{person.email}</span>
                          </a>
                        ) : null}
                        {person.linkedinUrl ? (
                          <a
                            href={person.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="LinkedIn Profile"
                            className="team-link"
                          >
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
              <div className="process-step">
                <span className="step-no"><UserCircle2 size={17} /></span>
                <h3>Corporate Profiles in Sanity</h3>
                <p>
                  Staff member records are managed live via the Sanity Content Studio under &ldquo;Corporate &amp; Team&rdquo;.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBand title="Need to reach our corporate desk? Send an enquiry." />
    </>
  );
}

