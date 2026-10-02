import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { GalleryView } from "@/components/gallery-view";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getGalleryItems } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export const metadata = createPageMetadata({
  title: "Operations, Fleet & Travel Media Gallery | A.A.U Chamo",
  description:
    "Visual showcase of A.A.U Chamo cargo handling, airport freight operations, training programs, Umrah travel groups, and corporate milestones in Nigeria.",
  path: "/gallery",
  keywords: [
    "AAU Chamo gallery",
    "cargo operations photos Kano",
    "airport logistics Nigeria",
    "Umrah groups photos Nigeria",
    "logistics media Kano",
  ],
});

export default async function GalleryPage() {
  const items = await getGalleryItems();

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Gallery", path: "/gallery" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "A.A.U Chamo Media Gallery",
      description: "Visual records of cargo handling, flights, pilgrimage, and corporate operations.",
      url: `${siteConfig.url}/gallery`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Gallery"
        title="Work in motion across air, land &amp; global trade."
        description="A live record of cargo operations, airport activities, training sessions, pilgrimage services, international partner meetings and company locations."
        meta={["Cargo operations", "Aviation & travel", "Corporate activities"]}
      />
      <section className="section">
        <div className="shell">
          <GalleryView items={items} />
          <p className="muted" style={{ marginTop: 40, textAlign: "center" }}>
            Visual records and gallery archives are managed securely through the Sanity Content Studio.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
