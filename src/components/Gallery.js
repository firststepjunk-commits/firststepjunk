"use client";

import { useEffect, useRef } from "react";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
import { defaultContent } from "@/lib/content-data";
import { BUSINESS } from "@/lib/seo";

export default function Gallery({ content }) {
  const g = { ...defaultContent.gallery, ...(content?.gallery || {}) };
  // `index` is the position in the saved content, kept through the filter so
  // the Site Editor can write an edit back to the right slot.
  const images = (g.images || [])
    .map((img, index) => (img ? { ...img, index } : null))
    .filter((img) => img && img.published !== false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current || images.length === 0) return;
    const splide = new Splide(rootRef.current, {
      type: images.length > 3 ? "loop" : "slide",
      perPage: 3,
      perMove: 1,
      gap: "1.5rem",
      padding: { left: 0, right: "3rem" },
      pagination: true,
      arrows: images.length > 1,
      drag: "free",
      snap: true,
      autoplay: images.length > 3,
      interval: 4000,
      pauseOnHover: true,
      speed: 600,
      breakpoints: {
        1024: { perPage: 2, padding: { right: "2.5rem" } },
        640: { perPage: 1, padding: { right: "2rem" }, gap: "1rem" },
      },
    });
    splide.mount();
    return () => splide.destroy();
    // Re-mount if the published set changes (e.g. after a settings edit reload).
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <section className="bg-surface-container-low py-section-gap" id="gallery">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-12 max-w-2xl" data-aos="fade-up">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            {g.eyebrow}
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary">{g.heading}</h2>
          <p className="mt-4 text-on-surface-variant">{g.subtitle}</p>
        </div>

        <div className="splide" ref={rootRef} aria-label={`${BUSINESS.brandName} job photos`}>
          <div className="splide__track">
            <ul className="splide__list">
              {images.map((img, i) => (
                <li className="splide__slide" key={img.src + i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt || `${BUSINESS.brandName} job photo`}
                    loading="lazy"
                    className="h-[420px] w-full rounded-2xl border-4 border-white object-cover shadow-lg"
                    data-image-path={`gallery.images.${img.index}.src`}
                    data-alt-path={`gallery.images.${img.index}.alt`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
