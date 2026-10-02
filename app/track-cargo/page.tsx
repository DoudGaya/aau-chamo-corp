import type { Metadata } from "next";
import { TrackingPanel } from "@/components/tracking-panel";
import { PageHero } from "@/components/page-hero";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Track Cargo Shipment & Consignment Status Online | A.A.U Chamo",
  description:
    "Track your air cargo shipment, international freight consignment, or enquiry progress in real time with your official A.A.U Chamo tracking reference code.",
  path: "/track-cargo",
  keywords: [
    "track cargo Nigeria",
    "AAU Chamo tracking",
    "air cargo tracking Kano",
    "check shipment status Nigeria",
    "freight tracking Kano airport",
  ],
});

export default async function TrackCargoPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference = "" } = await searchParams;

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Track Cargo", path: "/track-cargo" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Cargo visibility"
        title="Track with the reference you received."
        description="The tracking interface shows approved customer-facing status from the inventory integration or the progress of a website enquiry."
        meta={["Customer-safe status", "Secure integration", "No hidden operational data"]}
      />
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="shell">
          <TrackingPanel initialReference={reference.slice(0, 40)} />
        </div>
      </section>
    </>
  );
}
