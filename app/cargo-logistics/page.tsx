import type { Metadata } from "next";
import Link from "next/link";
import { Check, HelpCircle, PackageSearch, Plane, Truck } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { cargoModes } from "@/lib/content";
import { breadcrumbJsonLd, createPageMetadata, faqJsonLd, serviceJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Air Cargo & Freight Logistics Nigeria | Kano Hub",
  description:
    "Reliable airport-to-airport air cargo, door-to-door freight forwarding, customs clearing and parcel consolidation connecting Kano, Abuja, Lagos with Dubai, China, Turkey and global hubs.",
  path: "/cargo-logistics",
  keywords: [
    "air cargo Nigeria",
    "cargo logistics Kano",
    "freight forwarding Nigeria",
    "Mallam Aminu Kano Airport cargo",
    "door to door cargo Nigeria",
    "China to Nigeria air cargo",
    "Dubai to Kano shipping",
    "customs clearance Kano airport",
    "interstate cargo delivery Nigeria",
    "cargo tracking Nigeria",
  ],
});

const faqs = [
  {
    question: "What cargo routes does A.A.U Chamo operate?",
    answer:
      "We operate airport-to-airport air freight, regional door delivery, and international consolidation routes connecting Kano (Mallam Aminu Kano International Airport), Lagos, and Abuja with major international trade gateways in Dubai (UAE), China, Turkey, Europe, and Saudi Arabia.",
  },
  {
    question: "How do I track my cargo shipment online?",
    answer:
      "Every shipment is assigned an official tracking reference (e.g., ABN or tracking number). You can enter this reference on our Track Cargo portal to view real-time transit status, checkpoints, and estimated delivery dates.",
  },
  {
    question: "What cargo handling options are available?",
    answer:
      "We offer airport-to-airport air freight, door-to-airport collection, door-to-door delivery where available, bulk cargo consolidation, express courier parcels, and bonded warehouse clearance support.",
  },
  {
    question: "How are shipping rates and quotations calculated?",
    answer:
      "Quotations are calculated based on gross weight, volumetric weight (CBM), route origin/destination, commodity type, and any specialized handling or customs requirements. Contact our cargo desk for an exact quotation.",
  },
];

export default function CargoPage() {
  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Cargo & Logistics", path: "/cargo-logistics" },
    ]),
    serviceJsonLd({
      name: "Air Cargo Logistics & International Freight Forwarding",
      description:
        "Comprehensive air and ground cargo solutions including airport-to-airport freight, customs documentation, parcel consolidation, and door delivery across Nigeria and international routes.",
      url: "/cargo-logistics",
      serviceType: "FreightForwardingService",
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
        eyebrow="Cargo & logistics"
        title="Cargo movement, structured from origin to handover."
        description="Submit complete shipment details, request a quotation and keep one reference through operational review."
        meta={["Air cargo", "Door delivery", "Nationwide coverage"]}
      />

      <section className="section">
        <div className="shell content-grid">
          <div className="prose">
            <h2>Flexible routes. Controlled handling.</h2>
            <p>
              Our cargo section supports airport, door and interstate requests with the information required for safe operational review. Quotations, capacity and delivery timing are confirmed by authorised staff after assessment.
            </p>
            <ul className="check-list">
              {cargoModes.map((mode) => (
                <li key={mode}>
                  <Check size={17} />
                  {mode}
                </li>
              ))}
            </ul>
          </div>
          <aside className="side-panel">
            <h3>Have shipment details ready?</h3>
            <p>Prepare the cargo type, weight, pieces, origin, destination, date and delivery preference.</p>
            <Link className="button red" href="/enquire?type=cargo">Request cargo quote</Link>
            <Link className="button ghost" href="/track-cargo"><PackageSearch size={17} /> Track cargo</Link>
          </aside>
        </div>
      </section>

      <section className="cargo-feature section">
        <div className="shell">
          <span className="eyebrow">Cargo flow</span>
          <h2 className="headline" style={{ marginBottom: 48 }}>From airport intake to customer-safe status.</h2>
          <div className="process-grid">
            {[
              [Plane, "Airport-to-airport", "Coordinate air cargo between supported domestic and international stations."],
              [Truck, "Door connections", "Connect secure pickup or final door delivery where available."],
              [PackageSearch, "Customer tracking", "Expose only approved customer-facing shipment status with ERP alignment."],
              [Check, "Verified completion", "Delivered status confirmed by authorized operations personnel or connected systems."],
            ].map(([Icon, title, detail]) => {
              const ItemIcon = Icon as typeof Plane;
              return (
                <div className="process-step" key={String(title)}>
                  <span className="step-no"><ItemIcon size={17} /></span>
                  <h3>{String(title)}</h3>
                  <p>{String(detail)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* High-Impact SEO FAQ Section */}
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Frequently asked questions</span>
              <h2 className="headline">Clear answers on cargo logistics.</h2>
            </div>
            <p className="lede">Everything you need to know about shipping, routes, customs, and tracking.</p>
          </div>
          <div className="process-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {faqs.map((faq, index) => (
              <div className="process-step" key={faq.question} style={{ height: "100%" }}>
                <span className="step-no"><HelpCircle size={17} /></span>
                <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>{faq.question}</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--muted)" }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Tell operations what needs to move." />
    </>
  );
}
