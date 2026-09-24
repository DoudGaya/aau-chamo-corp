import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";
import { getNewsArticles } from "@/lib/sanity";

export const revalidate = 300;

export const metadata = createPageMetadata({
  title: "News & Updates",
  description: "A.A.U Chamo service guidance, company announcements and operational updates.",
  path: "/news",
});

function dateLabel(value?: string) {
  if (!value) return "Customer guide";
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default async function NewsPage() {
  const articles = await getNewsArticles();

  return (
    <>
      <PageHero eyebrow="News & updates" title="Announcements, guidance and company activity." description="A clear record of service information, new routes, partnerships, events and customer guidance." meta={["Company news", "Service guides", "Announcements"]} />
      <section className="section">
        <div className="shell news-grid">
          {articles.map((item, index) => (
            <article className={`news-card ${item.featured || index === 0 ? "featured" : ""}`} key={item._id}>
              <span className="news-meta">{item.category} · {dateLabel(item.publishedAt)}</span>
              <h2>{item.title}</h2>
              <p>{item.excerpt}</p>
              <Link className="status-link" href={`/news/${item.slug}`}>Read update <ArrowRight size={15} /></Link>
            </article>
          ))}
        </div>
      </section>
      <CtaBand title="Need current service information? Ask the team." />
    </>
  );
}
