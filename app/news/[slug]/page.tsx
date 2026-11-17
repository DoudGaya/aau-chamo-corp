import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { ArrowLeft, BookOpen, Calendar, Clock, Lightbulb, MapPin, UserCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getNewsArticles, getPosts, getNewsOrPost, sanityImageUrl, type NewsArticle, type PostItem } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

type NewsArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const [articles, posts] = await Promise.all([getNewsArticles(), getPosts()]);
  return [
    ...articles.map((article) => ({ slug: article.slug })),
    ...posts.map((post) => ({ slug: post.slug })),
  ];
}

export async function generateMetadata({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const resolved = await getNewsOrPost(slug);
  if (!resolved) return {};
  const { item, isPost } = resolved;
  const article = !isPost ? (item as NewsArticle) : null;
  const post = isPost ? (item as PostItem) : null;
  const image = sanityImageUrl(item.mainImage, 1200, 630) || "/cargo-operations-hero.png";

  return createPageMetadata({
    title: article?.seoTitle || post?.seoTitle || item.title,
    description: article?.seoDescription || post?.seoDescription || article?.excerpt || `${item.title} — A.A.U Chamo operational guidance.`,
    path: `/news/${item.slug}`,
    image,
    type: "article",
    publishedTime: item.publishedAt,
    modifiedTime: item.updatedAt,
    keywords: [
      article?.category || (post?.type === "tip" ? "Quick Tip" : "Service Guide"),
      "AAU Chamo",
      "Nigeria logistics",
      "aviation Nigeria",
      item.title,
    ],
  });
}

function getChildrenText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getChildrenText).join("");
  if (children && typeof children === "object" && "props" in children) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getChildrenText((children as any).props?.children);
  }
  return "";
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="article-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="article-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="article-h4">{children}</h4>,
    normal: ({ children }) => {
      const text = getChildrenText(children).trim();
      const stepMatch = text.match(/^(\d+)\.\s+(.+)$/);
      if (stepMatch && text.length < 110) {
        return (
          <div className="article-step-heading">
            <span className="article-step-num">{stepMatch[1]}</span>
            <h3 className="article-step-title">{stepMatch[2]}</h3>
          </div>
        );
      }
      return <p className="article-p">{children}</p>;
    },
    blockquote: ({ children }) => <blockquote className="article-blockquote">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="article-ul">{children}</ul>,
    number: ({ children }) => <ol className="article-ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="article-li">{children}</li>,
    number: ({ children }) => <li className="article-li">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="article-strong">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="article-link"
        >
          {children}
        </a>
      );
    },
  },
};

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const resolved = await getNewsOrPost(slug);
  if (!resolved) notFound();

  const { item, isPost } = resolved;
  const article = !isPost ? (item as NewsArticle) : null;
  const post = isPost ? (item as PostItem) : null;

  // Thumbnail for card header — compact, not full-bleed
  const thumbUrl = sanityImageUrl(item.mainImage, 900, 500);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: isPost ? "Guides & News" : "News", path: "/news" },
    { name: item.title, path: `/news/${item.slug}` },
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": isPost ? "HowTo" : "NewsArticle",
    headline: item.title,
    description: article?.excerpt || post?.seoDescription || item.title,
    mainEntityOfPage: `${siteConfig.url}/news/${item.slug}`,
    image: thumbUrl || `${siteConfig.url}/cargo-operations-hero.png`,
    ...(item.publishedAt ? { datePublished: item.publishedAt } : {}),
    ...(item.updatedAt ? { dateModified: item.updatedAt } : {}),
    ...(post?.author ? { author: { "@type": "Person", name: post.author.name } } : {}),
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };

  const authorPhoto = post?.author?.portrait ? sanityImageUrl(post.author.portrait, 120, 120) : null;
  const pubDate = item.publishedAt
    ? new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.publishedAt))
    : null;

  const readTimeText = (() => {
    const bodyArr = article?.body || post?.content || [];
    const wordCount = JSON.stringify(bodyArr).split(" ").length;
    const mins = Math.max(1, Math.round(wordCount / 200));
    return `${mins} min read`;
  })();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, breadcrumbs]).replace(/</g, "\\u003c") }}
      />

      {/* ── Compact article header band ── */}
      <div className="article-header-band">
        <div className="shell">
          <Link className="article-back-link" href="/news">
            <ArrowLeft size={14} /> Back to news &amp; guides
          </Link>

          <div className="article-label-row">
            {isPost ? (
              <span className={`article-type-pill ${post?.type === "tip" ? "article-type-pill--tip" : "article-type-pill--guide"}`}>
                {post?.type === "tip" ? <Lightbulb size={12} /> : <BookOpen size={12} />}
                {post?.type === "tip" ? "Quick Tip" : "Operational Guide"}
              </span>
            ) : (
              <span className="article-type-pill article-type-pill--news">
                {article?.category}
              </span>
            )}
          </div>

          <h1 className="article-headline">{item.title}</h1>
          {article?.excerpt && <p className="article-deck">{article.excerpt}</p>}

          <div className="article-meta-row">
            {pubDate && (
              <span className="article-meta-item">
                <Calendar size={13} /> {pubDate}
              </span>
            )}
            <span className="article-meta-item">
              <Clock size={13} /> {readTimeText}
            </span>
            {post?.author && (
              <span className="article-meta-item">
                <UserCheck size={13} /> {post.author.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Article body layout ── */}
      <div className="article-layout-wrap">
        <div className="shell article-layout">

          {/* Main column */}
          <article className="article-main">

            {/* Optional cover image — tasteful, constrained */}
            {thumbUrl && (
              <div className="article-cover">
                <Image
                  src={thumbUrl}
                  alt={item.mainImage?.alt || item.title}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 760px"
                  style={{ objectFit: "cover" }}
                />
                {item.mainImage?.alt && (
                  <figcaption className="article-cover-caption">{item.mainImage.alt}</figcaption>
                )}
              </div>
            )}

            {/* Author card for guides */}
            {post?.author && (
              <div className="article-author-card">
                {authorPhoto ? (
                  <div className="article-author-avatar">
                    <Image src={authorPhoto} alt={post.author.name} fill style={{ objectFit: "cover" }} />
                  </div>
                ) : (
                  <div className="article-author-avatar article-author-avatar--placeholder">
                    <UserCheck size={18} />
                  </div>
                )}
                <div className="article-author-info">
                  <span className="article-author-label">Written by</span>
                  {post.author.slug ? (
                    <Link href={`/staff/${post.author.slug}`} className="article-author-name">
                      {post.author.name} →
                    </Link>
                  ) : (
                    <strong className="article-author-name">{post.author.name}</strong>
                  )}
                  <span className="article-author-role">{post.author.role}</span>
                </div>
              </div>
            )}

            {/* Body content */}
            <div className="article-body">
              {article?.body?.length ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <PortableText value={article.body as any} components={portableTextComponents} />
              ) : post?.content?.length ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <PortableText value={post.content as any} components={portableTextComponents} />
              ) : (
                <p className="article-p">
                  For current information about this topic, please contact the relevant A.A.U Chamo service team directly.
                </p>
              )}
            </div>

            {/* Footer nav */}
            <div className="article-footer-nav">
              <Link className="article-back-link" href="/news">
                <ArrowLeft size={14} /> All news &amp; guides
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="article-sidebar">
            <div className="article-sidebar-card">
              <span className="eyebrow" style={{ fontSize: 10 }}>About this content</span>
              <p className="article-sidebar-note">
                {isPost
                  ? "This guide was prepared by A.A.U Chamo operations staff to support customers with accurate procedures."
                  : "Company news and announcements are issued by the A.A.U Chamo communications team."}
              </p>
              <Link href="/contact" className="button red" style={{ width: "100%", justifyContent: "center", marginTop: 10, fontSize: 13, minHeight: 44 }}>
                Send an enquiry
              </Link>
              <Link href="/news" className="button ghost" style={{ width: "100%", justifyContent: "center", marginTop: 8, fontSize: 13, minHeight: 40, border: "1px solid var(--line)" }}>
                More articles
              </Link>
            </div>

            {post?.author && (
              <div className="article-sidebar-card" style={{ marginTop: 20 }}>
                <span className="eyebrow" style={{ fontSize: 10 }}>About the author</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
                  {authorPhoto ? (
                    <div style={{ width: 48, height: 48, borderRadius: 2, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                      <Image src={authorPhoto} alt={post.author.name} fill style={{ objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: 2, background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <UserCheck size={20} style={{ color: "var(--muted)" }} />
                    </div>
                  )}
                  <div>
                    {post.author.slug ? (
                      <Link href={`/staff/${post.author.slug}`} style={{ fontWeight: 700, fontSize: 14, display: "block" }}>{post.author.name} →</Link>
                    ) : (
                      <strong style={{ fontSize: 14, display: "block" }}>{post.author.name}</strong>
                    )}
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{post.author.role}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <CtaBand title="Need help with this service? Send an enquiry." />
    </>
  );
}
