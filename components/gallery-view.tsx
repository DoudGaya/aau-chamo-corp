"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn, Image as ImageIcon } from "lucide-react";
import { type GalleryItem, sanityImageUrl } from "@/lib/sanity-image";

export function GalleryView({ items }: { items: GalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filteredItems = selectedCategory === "All"
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <>
      {/* Category Filter Pills */}
      <div className="gallery-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`gallery-filter-pill ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      <div className="gallery-showcase-grid">
        {filteredItems.map((item) => {
          const image = sanityImageUrl(item.image, 1000, 750);
          return (
            <div
              key={item._id}
              className="gallery-card"
              onClick={() => setActiveItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveItem(item); }}
            >
              <div className="gallery-card-thumb">
                {image ? (
                  <Image
                    src={image}
                    alt={item.image?.alt || item.title}
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="gallery-placeholder">
                    <ImageIcon size={36} />
                  </div>
                )}
                <div className="gallery-overlay">
                  <ZoomIn size={24} />
                  <span>View Photo</span>
                </div>
              </div>
              <div className="gallery-card-info">
                {item.category ? <span className="gallery-tag">{item.category}</span> : null}
                <h4>{item.title}</h4>
                {item.caption ? <p>{item.caption}</p> : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="gallery-lightbox" onClick={() => setActiveItem(null)} role="dialog" aria-modal="true">
          <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="gallery-close-btn"
              type="button"
              onClick={() => setActiveItem(null)}
              aria-label="Close preview"
            >
              <X size={24} />
            </button>
            <div className="gallery-lightbox-image">
              {sanityImageUrl(activeItem.image, 1600, 1100) ? (
                <Image
                  src={sanityImageUrl(activeItem.image, 1600, 1100)!}
                  alt={activeItem.image?.alt || activeItem.title}
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              ) : (
                <div className="gallery-placeholder">
                  <ImageIcon size={64} />
                </div>
              )}
            </div>
            <div className="gallery-lightbox-details">
              {activeItem.category ? <span className="gallery-tag">{activeItem.category}</span> : null}
              <h3>{activeItem.title}</h3>
              {activeItem.caption ? <p>{activeItem.caption}</p> : null}
              {activeItem.occurredAt ? (
                <time className="mono" style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginTop: "8px" }}>
                  {new Date(activeItem.occurredAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" })}
                </time>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
