import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { createPageMetadata } from "@/lib/seo";
import { getEvents, sanityImageUrl } from "@/lib/sanity";

export const revalidate = 300;

export const metadata = createPageMetadata({
  title: "Events & Announcements",
  description: "Corporate seminars, logistics forums, trade summits and training activities by A.A.U Chamo.",
  path: "/events",
});

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <PageHero
        eyebrow="Events & Summits"
        title="Connecting industry leaders and global trade."
        description="Stay informed about upcoming A.A.U Chamo trade forums, aviation logistics workshops, pilgrimage travel briefings and corporate partner events."
        meta={["Trade summits", "Aviation workshops", "Customer briefings"]}
      />

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Schedule</span>
              <h2 className="headline">Upcoming &amp; recent activities.</h2>
            </div>
            <p className="lede">
              Participate in our interactive sessions to understand cross-border cargo routing, flight ticketing guidelines, and international trade operations.
            </p>
          </div>

          {events.length > 0 ? (
            <div className="events-grid">
              {events.map((ev) => {
                const cover = sanityImageUrl(ev.coverImage, 800, 500);
                const startDate = ev.dateRange?.startDate ? new Date(ev.dateRange.startDate).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : null;
                const startTime = ev.dateRange?.startDate ? new Date(ev.dateRange.startDate).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }) : null;

                return (
                  <article className="event-card" key={ev._id}>
                    <div className="event-card-media">
                      {cover ? (
                        <Image src={cover} alt={ev.coverImage?.alt || ev.title} fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                      ) : (
                        <div className="event-card-placeholder">
                          <Calendar size={48} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="event-card-content">
                      <div className="event-meta-tags">
                        {startDate ? (
                          <span className="event-date-tag">
                            <Calendar size={14} /> {startDate} {startTime ? `at ${startTime}` : ""}
                          </span>
                        ) : null}
                        {ev.location ? (
                          <span className="event-location-tag">
                            <MapPin size={14} /> {ev.location}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="event-title">{ev.title}</h3>

                      {ev.registrationLink ? (
                        <a href={ev.registrationLink} target="_blank" rel="noopener noreferrer" className="button red" style={{ minHeight: "44px", fontSize: "14px", alignSelf: "flex-start", marginTop: "auto" }}>
                          <span>Register Now</span> <ExternalLink size={16} />
                        </a>
                      ) : (
                        <Link href="/contact" className="button ghost" style={{ minHeight: "44px", fontSize: "14px", alignSelf: "flex-start", marginTop: "auto", border: "1px solid var(--line)" }}>
                          <span>Enquire to Attend</span> <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-events-banner">
              <div className="empty-events-icon">
                <Calendar size={36} />
              </div>
              <h3>New Event Schedules Being Finalised</h3>
              <p>
                Our upcoming stakeholder sessions, cargo customer workshops, and travel briefings are scheduled regularly. Publish new events anytime via the Sanity Studio.
              </p>
              <Link href="/contact" className="button red" style={{ marginTop: "20px" }}>
                <span>Contact Event Coordination</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <CtaBand title="Need tailored corporate or group travel coordination?" />
    </>
  );
}
