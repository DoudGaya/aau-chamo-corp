import type { Metadata } from "next";
import { AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Book / Enquire", description: "Submit a structured flight, cargo, courier, Umrah, visa, travel or general enquiry." };

export default async function EnquirePage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type = "cargo" } = await searchParams;
  return (
    <>
      <PageHero eyebrow="Book / enquire" title="Give the right team a complete request." description="Select a service, submit the required details and receive a unique reference for secure staff follow-up." meta={["Unique reference", "Department routing", "Acknowledgement email"]} />
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="shell form-layout">
          <div>
            <span className="eyebrow">Before you submit</span><h2 className="headline">A request starts the conversation.</h2>
            <p className="lede">A submission is not a confirmed price, booking, flight, cargo slot or transaction. Authorised staff will review and confirm next steps.</p>
            <div className="contact-list">
              <div className="contact-row"><CheckCircle2 size={19} /><div><strong>Immediate reference</strong><span>Use it for email, tracking and WhatsApp follow-up.</span></div></div>
              <div className="contact-row"><MessageCircle size={19} /><div><strong>Department routing</strong><span>Your service type routes the request to the appropriate team.</span></div></div>
              <div className="contact-row"><AlertCircle size={19} /><div><strong>Verified confirmation</strong><span>Only staff or an approved connected system can confirm availability.</span></div></div>
            </div>
          </div>
          <EnquiryForm defaultType={type} />
        </div>
      </section>
    </>
  );
}
