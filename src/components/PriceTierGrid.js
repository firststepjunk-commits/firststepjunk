import { PRICE_TIERS, SHED_DEMO, PRICING_INCLUDES, MATTRESS_NOTE } from "@/lib/seo";

/** Owner-set flat rates. Shared by the homepage and every service/town page. */
export default function PriceTierGrid({ compact = false }) {
  const cards = [...PRICE_TIERS, SHED_DEMO];
  return (
    <div>
      <ul
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          compact ? "lg:grid-cols-3" : "lg:grid-cols-3"
        }`}
      >
        {cards.map((tier) => (
          <li
            key={tier.name}
            className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-5"
          >
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
              {tier.name}
            </p>
            <p className="mt-1 text-3xl font-bold text-primary">{tier.price}</p>
            <p className="mt-2 text-sm text-on-surface-variant">{tier.detail}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm font-semibold text-on-surface">{PRICING_INCLUDES}</p>
      <p className="mt-1 text-sm text-on-surface-variant">{MATTRESS_NOTE}</p>
    </div>
  );
}
