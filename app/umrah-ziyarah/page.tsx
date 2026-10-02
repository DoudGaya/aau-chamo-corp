import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, HeartHandshake, HelpCircle, MessageCircle, Users } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { breadcrumbJsonLd, createPageMetadata, faqJsonLd, serviceJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Umrah & Ziyarah Pilgrimage Packages Nigeria | Kano Agency",
  description:
    "Guided Umrah and Ziyarah pilgrimage travel packages from Kano, Nigeria. Comprehensive visa processing, Makkah and Madinah hotel reservations, flight coordination and dedicated ground support for individuals, families and groups.",
  path: "/umrah-ziyarah",
  keywords: [
    "Umrah packages Nigeria",
    "Umrah travel agency Kano",
    "Ziyarah packages Nigeria",
    "Umrah visa Nigeria",
    "Kano to Makkah Umrah flights",
    "Hajj and Umrah operators Kano",
    "family Umrah packages Nigeria",
    "Ramadan Umrah packages Kano",
    "Madinah hotel booking Nigeria",
  ],
});

const faqs = [
  {
    question: "What is included in the A.A.U Chamo Umrah packages?",
    answer:
      "Our comprehensive packages cover verified Saudi Umrah visa issuance, confirmed round-trip air tickets from Kano (Mallam Aminu Kano International Airport) or Abuja/Lagos to Jeddah or Madinah, hotel accommodations near the Haram, ground transfers, and guided historical Ziyarah tours.",
  },
  {
    question: "How early should I begin my Umrah visa and travel booking?",
    answer:
      "We recommend submitting your enquiry at least 4 to 6 weeks before your intended departure date—and 8 to 12 weeks ahead for Ramadan seasons—to ensure optimal flight schedules and high-demand hotel allocations.",
  },
  {
    question: "Can packages be customized for families, private groups, and seniors?",
    answer:
      "Yes. We specialize in tailored itineraries including walking-distance 5-star or 4-star hotels, family-connected rooms, private SUV transfers, and wheelchair assistance for elderly pilgrims.",
  },
  {
    question: "What documents are required to apply for an Umrah visa?",
    answer:
      "You will need an international passport valid for at least 6 months, passport-sized photographs on a white background, and standard immunization certificates as mandated by the Saudi Ministry of Hajj and Umrah.",
  },
];

export default function UmrahPage() {
  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Umrah & Ziyarah", path: "/umrah-ziyarah" },
    ]),
    serviceJsonLd({
      name: "Umrah & Ziyarah Pilgrimage Travel Services",
      description:
        "Full-service spiritual pilgrimage arrangements including visa processing, flight bookings from Kano to Saudi Arabia, hotel reservations in Makkah and Madinah, and guided holy site tours.",
      url: "/umrah-ziyarah",
      serviceType: "PilgrimageTravelAgency",
    }),
    faqJsonLd(faqs),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Pilgrimage travel"
        title="Umrah & Ziyarah, guided with care."
        description="Tell us who is travelling, your preferred period and the support you need. Verified package details follow after staff review."
        meta={["Individuals", "Families", "Groups"]}
      />

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Enquiry journey</span>
              <h2 className="headline">A considered process for a meaningful journey.</h2>
            </div>
            <p className="lede">No unverified package price or availability is presented as confirmed.</p>
          </div>
          <div className="process-grid">
            {[
              [Users, "Traveller details", "Share the primary contact, ages, and total number of travellers."],
              [CalendarDays, "Preferred period", "Select your travel dates or spiritual window for operations review."],
              [HeartHandshake, "Package interest", "Describe accommodation preferences, distance from Haram, and support required."],
              [MessageCircle, "Personal follow-up", "A dedicated pilgrimage travel officer responds with verified options and transparent pricing."],
            ].map(([Icon, title, detail]) => {
              const StepIcon = Icon as typeof Users;
              return (
                <div className="process-step" key={String(title)}>
                  <span className="step-no"><StepIcon size={17} /></span>
                  <h3>{String(title)}</h3>
                  <p>{String(detail)}</p>
                </div>
              );
            })}
          </div>
          <Link className="button red" href="/enquire?type=umrah" style={{ marginTop: 36 }}>
            Start Umrah enquiry
          </Link>
        </div>
      </section>

      {/* High Value SEO FAQ Section */}
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Pilgrimage guidance</span>
              <h2 className="headline">Common questions on Umrah &amp; Ziyarah.</h2>
            </div>
            <p className="lede">Essential information to prepare for your journey to the holy lands.</p>
          </div>
          <div className="process-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {faqs.map((faq) => (
              <div className="process-step" key={faq.question} style={{ height: "100%" }}>
                <span className="step-no"><HelpCircle size={17} /></span>
                <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>{faq.question}</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--muted)" }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Prepare the details. Let our team guide the next step." />
    </>
  );
}
