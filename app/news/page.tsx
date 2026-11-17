import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Lightbulb, UserCheck } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getNewsArticles, getPosts, sanityImageUrl, type NewsArticle, type PostItem } from "@/lib/sanity";

export const revalidate = 300;

export const metadata = createPageMetadata({
  title: "News, Operational Updates & Trade Insights | A.A.U Chamo",
  description:
    "Latest company announcements, air cargo shipping schedules, aviation insights, Umrah updates and trade guidance from A.A.U Chamo in Kano, Nigeria.",
  path: "/news",
  keywords: [
    "AAU Chamo news",
    "aviation updates Nigeria",
    "cargo shipping news Kano",
    "Umrah travel announcements",
    "Kano airport logistics news",
    "AAU Chamo guides",
  ],
});

function dateLabel(value?: string) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default async function NewsPage() {
  const [articles, posts] = await Promise.all([
    getNewsArticles(),
    getPosts(),
  ]);

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "News & Guides", path: "/news" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="News & guidance"
        title="Announcements, operational guides &amp; company activity."
        description="A clear record of service information, operational flight schedules, cargo freight guides, and practical customer walkthroughs."
        meta={["Company news", "Service guides", "Operational tips"]}
      />

      {/* ── Company News ── */}
      <section className="section">
        <div className="shell">
          <div className="news-index-header">
            <div>
              <span className="eyebrow">Announcements</span>
              <h2 className="headline" style={{ marginTop: 10 }}>Company news &amp; network updates.</h2>
            </div>
            <p className="lede" style={{ margin: 0, maxWidth: 400 }}>
              Official notices, new routes, partnership briefings, and terminal operations.
            </p>
          </div>

          <div className="news-index-list">
            {articles.map((item: NewsArticle, index: number) => {
              const coverUrl = sanityImageUrl(item.mainImage, 480, 320);
              const pub = dateLabel(item.publishedAt);
              const isLead = item.featured || index === 0;
              return (
                <article
                  className={`news-index-row${isLead ? " news-index-row--lead" : ""}`}
                  key={item._id}
                >
                  {isLead && coverUrl && (
                    <div className="news-index-thumb">
                      <Image
                        src={coverUrl}
                        alt={item.mainImage?.alt || item.title}
                        fill
                        sizes="(max-width: 760px) 100vw, 400px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <div className="news-index-body">
                    <div className="news-index-meta">
                      <span className="news-index-category">{item.category}</span>
                      {pub && (
                        <span className="news-index-date">
                          <Calendar size={12} /> {pub}
                        </span>
                      )}
                    </div>
                    <h3 className="news-index-title">{item.title}</h3>
                    {item.excerpt && <p className="news-index-excerpt">{item.excerpt}</p>}
                    <Link className="news-index-cta" href={`/news/${item.slug}`}>
                      Read update <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Posts & Guides ── */}
      {posts.length > 0 && (
        <section className="section" style={{ background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
          <div className="shell">
            <div className="news-index-header">
              <div>
                <span className="eyebrow">Posts &amp; Guides</span>
                <h2 className="headline" style={{ marginTop: 10 }}>Operational guides &amp; customer tips.</h2>
              </div>
              <p className="lede" style={{ margin: 0, maxWidth: 400 }}>
                Practical step-by-step guidance authored by our operations managers and logistics leads.
              </p>
            </div>

            <div className="guides-index-grid">
              {posts.map((post: PostItem) => {
                const coverUrl = sanityImageUrl(post.mainImage, 480, 300);
                const isTip = post.type === "tip";
                const pub = dateLabel(post.publishedAt);
                return (
                  <article className="guide-card" key={post._id}>
                    {coverUrl && (
                      <div className="guide-card-thumb">
                        <Image
                          src={coverUrl}
                          alt={post.mainImage?.alt || post.title}
                          fill
                          sizes="(max-width: 760px) 100vw, 380px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div className="guide-card-body">
                      <div className="guide-card-meta">
                        <span className={`guide-type-badge ${isTip ? "guide-type-badge--tip" : "guide-type-badge--guide"}`}>
                          {isTip ? <Lightbulb size={11} /> : <BookOpen size={11} />}
                          {isTip ? "Quick Tip" : "Service Guide"}
                        </span>
                        {pub && (
                          <span className="news-index-date">
                            <Calendar size={11} /> {pub}
                          </span>
                        )}
                      </div>
                      <h3 className="guide-card-title">{post.title}</h3>
                      {post.seoDescription && (
                        <p className="guide-card-excerpt">{post.seoDescription}</p>
                      )}
                      {post.author && (
                        <div className="guide-card-author">
                          <UserCheck size={13} style={{ color: "var(--red)", flexShrink: 0 }} />
                          <span>By <strong>{post.author.name}</strong> · {post.author.role}</span>
                        </div>
                      )}
                      <Link className="news-index-cta" href={`/news/${post.slug}`}>
                        Read {isTip ? "tip" : "guide"} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <CtaBand title="Need current service information? Ask the team." />
    </>
  );
}
