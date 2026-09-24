import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getNewsArticle, getNewsArticles, sanityImageUrl } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

type NewsArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getNewsArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) return {};
  const image = sanityImageUrl(article.mainImage, 1200, 630) || "/cargo-operations-hero.png";
  return createPageMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path: `/news/${article.slug}`,
    image,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
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
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  const image = sanityImageUrl(article.mainImage, 1400, 800);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: article.title, path: `/news/${article.slug}` },
  ]);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    mainEntityOfPage: `${siteConfig.url}/news/${article.slug}`,
    image: image || `${siteConfig.url}/cargo-operations-hero.png`,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <>
      <article className="section article-page">
        <div className="shell article-shell">
          <Link className="status-link" href="/news"><ArrowLeft size={15} /> Back to news</Link>
          <span className="news-meta">{article.category}{article.publishedAt ? ` · ${new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt))}` : ""}</span>
          <h1>{article.title}</h1>
          <p className="article-intro">{article.excerpt}</p>
          {image ? <div className="article-image"><Image src={image} alt={article.mainImage?.alt || article.title} fill priority sizes="(max-width: 900px) 100vw, 900px" /></div> : null}
          {article.body?.length ? <div className="portable-content"><PortableText value={article.body} components={portableTextComponents} /></div> : <p className="portable-content">For current information about this topic, contact the relevant A.A.U Chamo service team.</p>}
        </div>
      </article>
      <CtaBand title="Need help with this service? Send an enquiry." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, breadcrumbs]).replace(/</g, "\\u003c") }} />
    </>
  );
}
