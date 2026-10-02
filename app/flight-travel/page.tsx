import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, FileCheck2, HelpCircle, PlaneTakeoff, ShieldCheck } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { breadcrumbJsonLd, createPageMetadata, faqJsonLd, serviceJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Flight Booking & Airline Ticket Agency Kano | A.A.U Chamo",
  description:
    "Professional flight reservations, domestic and international airline tickets, visa assistance, travel insurance and baggage coordination from Mallam Aminu Kano International Airport and across Nigeria.",
  path: "/flight-travel",
  keywords: [
    "flight reservations Kano",
    "airline ticketing Nigeria",
    "cheap flights from Kano",
    "flight booking agency Nigeria",
    "Kano to Jeddah flights",
    "Kano to Dubai flights",
    "visa assistance Kano",
    "travel agency Kano",
    "flight tickets Nigeria",
    "travel insurance Nigeria",
  ],
});

const faqs = [
  {
    question: "Can I book flights from Kano to domestic and international destinations?",
    answer:
      "Yes. Our travel desk handles domestic routes across Nigeria (Abuja, Lagos, Port Harcourt, Maiduguri) and international scheduled flights to Saudi Arabia (Jeddah, Madinah), UAE (Dubai), Egypt (Cairo), Qatar (Doha), Turkey (Istanbul), Europe, and the Americas.",
  },
  {
    question: "How do I request a verified flight quotation?",
    answer:
      "Submit your departure city, destination, preferred dates, class of travel, and passenger details through our online enquiry form. An officer cross-references certified airline availability and issues a verified quote.",
  },
  {
    question: "Do you offer visa assistance and application guidance?",
    answer:
      "Yes, we provide step-by-step document guidance, appointment scheduling, and verification support for tourist, business, study, and pilgrimage visas.",
  },
  {
    question: "Can you assist with flight re-booking, changes or excess baggage?",
    answer:
      "Yes, our ticketing officers handle airline ticket re-issuance, date changes, route modifications, and extra baggage requests in line with airline fare rules.",
  },
];

export default function FlightTravelPage() {
  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Flight & Travel", path: "/flight-travel" },
    ]),
    serviceJsonLd({
      name: "Flight Reservations & Airline Ticketing Agency",
      description:
        "Full-spectrum travel agency services including airline reservation, discounted international tickets, visa processing assistance, and passenger travel protection.",
      url: "/flight-travel",
      serviceType: "TravelAgency",
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
        eyebrow="Flight & travel"
        title="Plan the journey. Verify every commitment."
        description="Flight requests, visa assistance, travel insurance and baggage support through one structured travel desk."
        meta={["Flight enquiries", "Visa support", "Travel protection"]}
      />

      <section className="section">
        <div className="shell">
          <span className="eyebrow">Travel desk</span>
          <h2 className="headline" style={{ marginBottom: 48 }}>Support around the whole journey.</h2>
          <div className="process-grid">
            {[
              [PlaneTakeoff, "Flight requests", "Submit route, date, passenger count and requirements for verified pricing."],
              [FileCheck2, "Visa assistance", "Request country-specific preparation, document checklists, and process support."],
              [ShieldCheck, "Travel insurance", "Ask for verified travel medical and baggage protection through approved providers."],
              [CalendarCheck, "Baggage support", "Share excess luggage, special cargo and route handling requirements for review."],
            ].map(([Icon, title, detail]) => {
              const TravelIcon = Icon as typeof PlaneTakeoff;
              return (
                <div className="process-step" key={String(title)}>
                  <span className="step-no"><TravelIcon size={17} /></span>
                  <h3>{String(title)}</h3>
                  <p>{String(detail)}</p>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="button red" href="/enquire?type=flight">Request a flight</Link>
            <Link className="button ghost" href="/services/visa-assistance">Visa assistance</Link>
          </div>
        </div>
      </section>

      {/* SEO FAQ Section */}
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Travel FAQs</span>
              <h2 className="headline">Answers to common booking questions.</h2>
            </div>
            <p className="lede">Important details on airline tickets, visas, dates, and journey preparation.</p>
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

      <CtaBand title="Start with the route. We’ll guide the request." />
    </>
  );
}
