import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { GalleryView } from "@/components/gallery-view";
import { createPageMetadata } from "@/lib/seo";
import { getGalleryItems } from "@/lib/sanity";

export const revalidate = 300;

export const metadata = createPageMetadata({
  title: "Gallery",
  description: "A.A.U Chamo cargo, travel, training, events and office activities.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
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
