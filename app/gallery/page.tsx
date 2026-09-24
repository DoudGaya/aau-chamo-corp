import Image from "next/image";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";
import { getGalleryItems, sanityImageUrl } from "@/lib/sanity";

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
      <PageHero eyebrow="Gallery" title="Work in motion." description="A growing view of cargo operations, staff activity, training, pilgrimage services, international events and company locations." meta={["Operations", "People", "Events"]} />
      <section className="section">
        <div className="shell">
          <div className="gallery-grid">
            {items.map((item) => {
              const image = sanityImageUrl(item.image, 900, 700);
              return (
                <figure className={`gallery-tile ${image ? "has-image" : ""}`} key={item._id}>
                  {image ? <Image src={image} alt={item.image?.alt || item.title} fill sizes="(max-width: 760px) 100vw, 33vw" /> : null}
                  <figcaption><span>{item.title}</span>{item.caption ? <small>{item.caption}</small> : null}</figcaption>
                </figure>
              );
            })}
          </div>
          <p className="muted" style={{ marginTop: 20 }}>Published images are managed by authorised staff through the Sanity content studio.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
