import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserCheck,
  UserCircle2,
  Globe,
} from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { getStaffMember, getStaffMembers, sanityImageUrl, type StaffMember } from "@/lib/sanity";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { siteConfig, whatsappHref } from "@/lib/site";

export const revalidate = 300;

type StaffPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const staff = await getStaffMembers();
  return staff.filter((person) => Boolean(person.slug)).map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: StaffPageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = await getStaffMember(slug);
  if (!person) return {};

  const photo = sanityImageUrl(person.portrait, 1200, 630);
  const title = person.seoTitle || `${person.name} — ${person.role} | A.A.U Chamo`;
  const description =
    person.seoDescription ||
    person.bio ||
    `${person.name} serves as ${person.role} at A.A.U Chamo International Business Agency Services Limited.`;

  return createPageMetadata({
    title,
    description,
    path: `/staff/${person.slug}`,
    image: photo || "/cargo-operations-hero.png",
    type: "website",
    keywords: [
      person.name,
      person.role,
      person.department ? `${person.department} A.A.U Chamo` : "Corporate Team",
      "AAU Chamo leadership",
      "Nigeria logistics executive",
      "Kano aviation agency",
    ],
  });
}

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http");
      return (
        <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
          {children}
        </a>
      );
    },
  },
};

function formatDepartment(dept?: string): string {
  if (!dept) return "Corporate Leadership";
  const map: Record<string, string> = {
    executive: "Executive & Board",
    cargo: "Cargo & Logistics",
    aviation: "Aviation & Travel Services",
    umrah: "Umrah & Ziyarah Operations",
    customer_service: "Customer Relations & Support",
    operations: "Ground Operations & Freight Handling",
    finance_admin: "Finance & Corporate Administration",
    legal_compliance: "Legal & Regulatory Compliance",
    it_systems: "Information Technology & Digital Systems",
  };
  return map[dept] || dept.replace(/_/g, " ");
}

export default async function StaffMemberPage({ params }: StaffPageProps) {
  const { slug } = await params;
  const person = await getStaffMember(slug);
  if (!person) notFound();

  const allStaff = await getStaffMembers();
  const colleagues = allStaff
    .filter((s) => s._id !== person._id && s.slug)
    .slice(0, 3);

  const photo = sanityImageUrl(person.portrait, 800, 800);
  const departmentName = formatDepartment(person.department);
  const stationName = person.station || "Kano Corporate Headquarters (KAN)";

  const whatsapp = whatsappHref(
    `Hello A.A.U Chamo, I am reaching out to enquire regarding the ${departmentName} department led by ${person.name}.`
  );

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Leadership & Team", path: "/about#team" },
      { name: person.name, path: `/staff/${person.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: person.name,
      jobTitle: person.role,
      worksFor: {
        "@type": "Organization",
        name: "A.A.U Chamo International Business Agency Services Limited",
        "@id": `${siteConfig.url}/#organization`,
      },
      url: `${siteConfig.url}/staff/${person.slug}`,
      ...(photo ? { image: photo } : {}),
      ...(person.email ? { email: `mailto:${person.email}` } : {}),
      ...(person.phone ? { telephone: person.phone } : {}),
      ...(person.bio ? { description: person.bio } : {}),
      sameAs: [person.linkedinUrl, person.twitterUrl].filter(Boolean),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <div className="section staff-profile-page">
        <div className="shell">
          <div className="staff-breadcrumbs">
            <Link className="status-link" href="/about">
              <ArrowLeft size={15} /> Back to leadership &amp; team
            </Link>
          </div>

          {/* Profile Header Hero */}
          <div className="staff-hero-card">
            <div className="staff-hero-grid">
              <div className="staff-hero-photo-wrap">
                {photo ? (
                  <Image
                    src={photo}
                    alt={person.portrait?.alt || person.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="staff-hero-photo"
                  />
                ) : (
                  <div className="staff-hero-placeholder">
                    <UserCircle2 size={88} strokeWidth={1.2} />
                  </div>
                )}
                <span className="staff-dept-tag">{departmentName}</span>
              </div>

              <div className="staff-hero-info">
                <div className="staff-badge-row">
                  <span className="staff-station-badge">
                    <MapPin size={14} /> {stationName}
                  </span>
                  <span className="staff-verified-badge">
                    <UserCheck size={14} /> Verified Corporate Officer
                  </span>
                  {person.joinedYear ? (
                    <span className="staff-tenure-badge">
                      <Calendar size={14} /> {person.joinedYear}
                    </span>
                  ) : null}
                </div>

                <h1 className="staff-name">{person.name}</h1>
                <p className="staff-headline-role">{person.role}</p>

                {person.bio ? <p className="staff-short-bio">{person.bio}</p> : null}

                <div className="staff-action-buttons">
                  {person.email ? (
                    <a href={`mailto:${person.email}`} className="button red">
                      <Mail size={16} /> Contact Email
                    </a>
                  ) : null}
                  {person.phone ? (
                    <a href={`tel:${person.phone}`} className="button ghost">
                      <Phone size={16} /> {person.phone}
                    </a>
                  ) : null}
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button ghost"
                  >
                    <MessageCircle size={16} /> WhatsApp Dept
                  </a>
                  {person.linkedinUrl ? (
                    <a
                      href={person.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button ghost icon-only-btn"
                      title="LinkedIn Profile"
                      aria-label="LinkedIn Profile"
                    >
                      <Globe size={16} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content & Sidebar Grid */}
          <div className="content-grid staff-main-grid">
            <div className="prose staff-prose">
              {/* Detailed Background / Portable Text */}
              {person.body && Array.isArray(person.body) && person.body.length > 0 ? (
                <div className="staff-section">
                  <h2>Professional Background &amp; Leadership</h2>
                  <div className="portable-content">
                    <PortableText value={person.body} components={portableTextComponents} />
                  </div>
                </div>
              ) : null}

              {/* Core Responsibilities */}
              {person.responsibilities && person.responsibilities.length > 0 ? (
                <div className="staff-section">
                  <h2>Operational Scope &amp; Responsibilities</h2>
                  <p className="section-subtext">
                    Key executive and operational mandates coordinated under this portfolio at A.A.U Chamo:
                  </p>
                  <ul className="staff-check-list">
                    {person.responsibilities.map((resp, index) => (
                      <li key={index}>
                        <CheckCircle2 size={18} className="check-icon" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Areas of Expertise */}
              {person.expertise && person.expertise.length > 0 ? (
                <div className="staff-section">
                  <h2>Specializations &amp; Core Competencies</h2>
                  <div className="staff-chips-wrap">
                    {person.expertise.map((skill, index) => (
                      <span className="staff-skill-chip" key={index}>
                        <Briefcase size={14} /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Qualifications & Accreditations */}
              {person.qualifications && person.qualifications.length > 0 ? (
                <div className="staff-section">
                  <h2>Credentials, Education &amp; Accreditations</h2>
                  <ul className="staff-credentials-list">
                    {person.qualifications.map((qual, index) => (
                      <li key={index}>
                        <GraduationCap size={18} className="qual-icon" />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Fallback note if minimal text is provided */}
              {!person.body?.length && !person.responsibilities?.length && (
                <div className="staff-section">
                  <h2>Corporate Mandate</h2>
                  <p>
                    {person.name} oversees key operations within the {departmentName} division, ensuring
                    compliance with A.A.U Chamo standards of operational discipline, customer clarity, and
                    secure coordination across our cargo stations and travel service desks.
                  </p>
                  <p>
                    For inquiries, service contracts, or operational coordination, use the contact channels
                    listed on this profile or connect directly with our Kano Central Operations desk.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Details Panel */}
            <aside className="side-panel staff-side-panel">
              <div className="staff-meta-card">
                <h3>Executive Summary</h3>
                <dl className="staff-meta-dl">
                  <div>
                    <dt>Full Name</dt>
                    <dd>{person.name}</dd>
                  </div>
                  <div>
                    <dt>Role / Title</dt>
                    <dd>{person.role}</dd>
                  </div>
                  <div>
                    <dt>Department</dt>
                    <dd>{departmentName}</dd>
                  </div>
                  <div>
                    <dt>Operational Base</dt>
                    <dd>{stationName}</dd>
                  </div>
                  {person.joinedYear ? (
                    <div>
                      <dt>Experience / Tenure</dt>
                      <dd>{person.joinedYear}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Corporate Entity</dt>
                    <dd>A.A.U Chamo Int&apos;l Business Agency Services Ltd</dd>
                  </div>
                  <div>
                    <dt>Company Registration</dt>
                    <dd>RC: 1782299 (Nigeria)</dd>
                  </div>
                </dl>
              </div>

              <div className="staff-contact-card">
                <h3>Direct Communications</h3>
                <p>Official communication channels for this officer:</p>
                <div className="staff-contact-links">
                  {person.email ? (
                    <a href={`mailto:${person.email}`} className="staff-contact-item">
                      <Mail size={16} />
                      <div>
                        <strong>Email Address</strong>
                        <span>{person.email}</span>
                      </div>
                    </a>
                  ) : null}
                  {person.phone ? (
                    <a href={`tel:${person.phone}`} className="staff-contact-item">
                      <Phone size={16} />
                      <div>
                        <strong>Direct Telephone</strong>
                        <span>{person.phone}</span>
                      </div>
                    </a>
                  ) : null}
                  {person.linkedinUrl ? (
                    <a
                      href={person.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="staff-contact-item"
                    >
                      <Globe size={16} />
                      <div>
                        <strong>LinkedIn Profile</strong>
                        <span>View professional profile</span>
                      </div>
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="staff-governance-box">
                <ShieldCheck size={20} />
                <p>
                  Official corporate profile approved by A.A.U Chamo Corporate Governance &amp; Executive Board.
                </p>
              </div>

              <Link className="button red" href="/enquire">
                Initiate Service Request
              </Link>
            </aside>
          </div>

          {/* Colleagues / Other Leadership Carousel */}
          {colleagues.length > 0 ? (
            <div className="staff-colleagues-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Corporate Directory</span>
                  <h2 className="headline">Other Corporate Leaders &amp; Managers</h2>
                </div>
                <Link href="/about#team" className="status-link">
                  View all team members &rarr;
                </Link>
              </div>

              <div className="team-grid">
                {colleagues.map((colleague) => {
                  const colleaguePhoto = sanityImageUrl(colleague.portrait, 500, 500);
                  return (
                    <div className="team-card" key={colleague._id}>
                      <div className="team-card-image">
                        {colleaguePhoto ? (
                          <Image
                            src={colleaguePhoto}
                            alt={colleague.portrait?.alt || colleague.name}
                            fill
                            sizes="(max-width: 760px) 100vw, 33vw"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="team-card-placeholder">
                            <UserCircle2 size={54} strokeWidth={1.5} />
                          </div>
                        )}
                        {colleague.department ? (
                          <span className="team-dept-badge">
                            {formatDepartment(colleague.department)}
                          </span>
                        ) : null}
                      </div>
                      <div className="team-card-body">
                        <h3>
                          <Link href={`/staff/${colleague.slug}`} className="team-card-name-link">
                            {colleague.name}
                          </Link>
                        </h3>
                        <p className="team-role">{colleague.role}</p>
                        {colleague.bio ? <p className="team-bio">{colleague.bio}</p> : null}
                        <div className="team-card-links">
                          <Link href={`/staff/${colleague.slug}`} className="team-link team-view-profile">
                            View full profile &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <CtaBand title="Need to coordinate with our operations team? Submit an enquiry." />
    </>
  );
}
