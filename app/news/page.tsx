import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Lightbulb, UserCheck } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getNewsArticles, getPosts, sanityImageUrl, type PostItem } from "@/lib/sanity";

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
  if (!value) return "Published update";
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

      {/* Main Company News Section */}
      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Announcements</span>
              <h2 className="headline">Company news &amp; network updates.</h2>
            </div>
            <p className="lede">Official notices, new routes, partnership briefings, and terminal operations.</p>
          </div>
          <div className="news-grid">
            {articles.map((item, index) => {
              const coverUrl = sanityImageUrl(item.mainImage, 600, 360);
              return (
                <article className={`news-card ${item.featured || index === 0 ? "featured" : ""}`} key={item._id}>
                  {coverUrl && (
                    <div style={{ position: "relative", width: "100%", height: "180px", marginBottom: "14px", overflow: "hidden", borderRadius: "2px" }}>
                      <Image src={coverUrl} alt={item.mainImage?.alt || item.title} fill sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                    </div>
                  )}
                  <span className="news-meta">{item.category} · {dateLabel(item.publishedAt)}</span>
                  <h2>{item.title}</h2>
                  <p>{item.excerpt}</p>
                  <Link className="status-link" href={`/news/${item.slug}`}>Read update <ArrowRight size={15} /></Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Posts & Guides Section (Sanity 'post' collection) */}
      {posts.length > 0 && (
        <section className="section" style={{ background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
          <div className="shell">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Posts &amp; Guides</span>
                <h2 className="headline">Operational guides &amp; customer tips.</h2>
              </div>
              <p className="lede">Practical step-by-step guidance authored by our operations managers and logistics leads.</p>
            </div>
            <div className="news-grid">
              {posts.map((post: PostItem) => {
                const coverUrl = sanityImageUrl(post.mainImage, 600, 360);
                const isTip = post.type === "tip";
                return (
                  <article className="news-card" key={post._id} style={{ display: "flex", flexDirection: "column" }}>
                    {coverUrl && (
                      <div style={{ position: "relative", width: "100%", height: "180px", marginBottom: "14px", overflow: "hidden", borderRadius: "2px" }}>
                        <Image src={coverUrl} alt={post.mainImage?.alt || post.title} fill sizes="(max-width: 760px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{
                        background: isTip ? "#fef3c7" : "#e0f2fe",
                        color: isTip ? "#92400e" : "#0369a1",
                        padding: "2px 8px",
                        borderRadius: "3px",
                        fontSize: "11px",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        {isTip ? <Lightbulb size={12} /> : <BookOpen size={12} />}
                        {isTip ? "Quick Tip" : "Service Guide"}
                      </span>
                      {post.publishedAt && (
                        <span className="news-meta" style={{ margin: 0 }}>
                          · {dateLabel(post.publishedAt)}
                        </span>
                      )}
                    </div>
                    <h2>{post.title}</h2>
                    {post.seoDescription && <p>{post.seoDescription}</p>}
                    
                    {/* Author Attribution */}
                    {post.author && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--line)" }}>
                        <UserCheck size={14} style={{ color: "var(--red)" }} />
                        <small style={{ fontSize: "12px", color: "var(--muted)" }}>
                          Authored by <strong>{post.author.name}</strong> ({post.author.role})
                        </small>
                      </div>
                    )}

                    <div style={{ marginTop: "12px" }}>
                      <Link className="status-link" href={`/news/${post.slug}`}>
                        Read {isTip ? "tip" : "guide"} <ArrowRight size={15} />
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
