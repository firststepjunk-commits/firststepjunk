import { defaultContent } from "@/lib/content-data";
import { BUSINESS } from "@/lib/seo";
import PriceTierGrid from "@/components/PriceTierGrid";

/**
 * Pricing section: the owner's flat-rate load tiers (single source of truth in
 * lib/seo.js), followed by the per-item "what we haul" list. Every item is
 * covered by the load rates, so each row shows the starting price instead of a
 * "contact" label.
 */
export default function PricingStrip({ content }) {
  const p = { ...defaultContent.pricing, ...(content?.pricing || {}) };
  const offers = BUSINESS.offers;

  return (
    <section className="border-y border-outline-variant/30 bg-white py-section-gap" id="pricing">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-10 max-w-2xl" data-aos="fade-up">
          <h2 className="font-headline-lg text-headline-lg text-primary">{p.heading}</h2>
          <p className="mt-3 text-on-surface-variant">{p.intro}</p>
        </div>
        <div data-aos="fade-up">
          <PriceTierGrid />
        </div>

        <h3 className="mt-14 text-xl font-bold text-primary" data-aos="fade-up">
          What we haul
        </h3>
        <ul className="mt-4 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, i) => (
            <li
              key={offer.name}
              className="flex items-baseline justify-between gap-4 border-b border-outline-variant/25 py-3"
              data-aos="fade-up"
              data-aos-delay={Math.min(i * 40, 200)}
            >
              <span className="text-on-surface">{offer.name}</span>
              <a
                href="#quote"
                className="shrink-0 font-semibold text-secondary underline-offset-4 hover:underline"
              >
                {BUSINESS.quoteLabel}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-on-surface-variant" data-aos="fade-up">
          {p.footnote}
        </p>
      </div>
    </section>
  );
}
