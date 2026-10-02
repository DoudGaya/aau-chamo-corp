import type { Metadata } from "next";
import { AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/page-hero";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Book Flight, Request Cargo Quote & Enquire Online | A.A.U Chamo",
  description:
    "Submit an official service enquiry for air cargo logistics, airline flight reservations, courier pickup, Umrah packages, or visa assistance with A.A.U Chamo.",
  path: "/enquire",
  keywords: [
    "request cargo quote Nigeria",
    "book flight Kano",
    "Umrah booking Nigeria",
    "AAU Chamo enquiry",
    "courier pickup request Kano",
  ],
});

export default async function EnquirePage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type = "cargo" } = await searchParams;

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Book / Enquire", path: "/enquire" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Book / enquire"
        title="Give the right team a complete request."
        description="Select a service, submit the required details and receive a unique reference for secure staff follow-up."
        meta={["Unique reference", "Department routing", "Acknowledgement email"]}
      />
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="shell form-layout">
          <div>
            <span className="eyebrow">Before you submit</span>
            <h2 className="headline">A request starts the conversation.</h2>
            <p className="lede">
              A submission is not a confirmed price, booking, flight, cargo slot or transaction. Authorised staff will review and confirm next steps.
            </p>
            <div className="contact-list">
              <div className="contact-row">
                <CheckCircle2 size={19} />
                <div>
                  <strong>Immediate reference</strong>
                  <span>Use it for email, tracking and WhatsApp follow-up.</span>
                </div>
              </div>
              <div className="contact-row">
                <MessageCircle size={19} />
                <div>
                  <strong>Department routing</strong>
                  <span>Your service type routes the request to the appropriate team.</span>
                </div>
              </div>
              <div className="contact-row">
                <AlertCircle size={19} />
                <div>
                  <strong>Verified confirmation</strong>
                  <span>Only staff or an approved connected system can confirm availability.</span>
                </div>
              </div>
            </div>
          </div>
          <EnquiryForm defaultType={type} />
        </div>
      </section>
    </>
  );
}
