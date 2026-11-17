import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { ArrowLeft, BookOpen, Lightbulb, UserCheck } from "lucide-react";
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

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http");
      return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>;
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

  const image = sanityImageUrl(item.mainImage, 1400, 800);
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
    image: image || `${siteConfig.url}/cargo-operations-hero.png`,
    ...(item.publishedAt ? { datePublished: item.publishedAt } : {}),
    ...(item.updatedAt ? { dateModified: item.updatedAt } : {}),
    ...(post?.author ? { author: { "@type": "Person", name: post.author.name } } : {}),
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };

  const authorPhoto = post?.author?.portrait ? sanityImageUrl(post.author.portrait, 120, 120) : null;

  return (
    <>
      <article className="section article-page">
        <div className="shell article-shell">
          <Link className="status-link" href="/news"><ArrowLeft size={15} /> Back to news &amp; guides</Link>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: 12 }}>
            {isPost ? (
              <span className={`news-meta-pill ${post?.type === "tip" ? "tip-pill" : "guide-pill"}`} style={{
                background: post?.type === "tip" ? "#fef3c7" : "#e0f2fe",
                color: post?.type === "tip" ? "#92400e" : "#0369a1",
                padding: "3px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "5px"
              }}>
                {post?.type === "tip" ? <Lightbulb size={13} /> : <BookOpen size={13} />}
                {post?.type === "tip" ? "Quick Operational Tip" : "Comprehensive Service Guide"}
              </span>
            ) : (
              <span className="news-meta">{article?.category}</span>
            )}
            {item.publishedAt ? (
              <span className="news-meta" style={{ margin: 0 }}>
                · {new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.publishedAt))}
              </span>
            ) : null}
          </div>

          <h1 style={{ marginTop: 14 }}>{item.title}</h1>
          {article?.excerpt && <p className="article-intro">{article.excerpt}</p>}

          {/* Guide Author attribution card */}
          {post?.author && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 16px",
              background: "var(--paper, #f9f9f9)",
              border: "1px solid var(--line, #eee)",
              borderRadius: "4px",
              margin: "18px 0"
            }}>
              {authorPhoto ? (
                <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                  <Image src={authorPhoto} alt={post.author.name} fill style={{ objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", flexShrink: 0 }}>
                  <UserCheck size={20} />
                </div>
              )}
              <div>
                <strong style={{ fontSize: "14px", display: "block" }}>
                  {post.author.slug ? (
                    <Link href={`/staff/${post.author.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {post.author.name} &rarr;
                    </Link>
                  ) : post.author.name}
                </strong>
                <span style={{ fontSize: "12px", color: "var(--muted, #666)" }}>{post.author.role}</span>
              </div>
            </div>
          )}

          {image ? <div className="article-image"><Image src={image} alt={item.mainImage?.alt || item.title} fill priority sizes="(max-width: 900px) 100vw, 900px" /></div> : null}
          
          {/* Content Body */}
          {article?.body?.length ? (
            <div className="portable-content"><PortableText value={article.body as any} components={portableTextComponents} /></div>
          ) : post?.content?.length ? (
            <div className="portable-content"><PortableText value={post.content as any} components={portableTextComponents} /></div>
          ) : (
            <p className="portable-content">For current information about this topic, contact the relevant A.A.U Chamo service team.</p>
          )}
        </div>
      </article>
      <CtaBand title="Need help with this service? Send an enquiry." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, breadcrumbs]).replace(/</g, "\\u003c") }} />
    </>
  );
}
