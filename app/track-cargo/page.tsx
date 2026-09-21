import type { Metadata } from "next";
import { TrackingPanel } from "@/components/tracking-panel";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Track Cargo", description: "Check customer-facing cargo or website enquiry status with your A.A.U Chamo reference." };

export default async function TrackCargoPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference = "" } = await searchParams;
  return (
    <>
      <PageHero eyebrow="Cargo visibility" title="Track with the reference you received." description="The tracking interface shows approved customer-facing status from the inventory integration or the progress of a website enquiry." meta={["Customer-safe status", "Secure integration", "No hidden operational data"]} />
      <section className="section" style={{ background: "var(--paper)" }}><div className="shell"><TrackingPanel initialReference={reference.slice(0, 40)} /></div></section>
    </>
  );
}
