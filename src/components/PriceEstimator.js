"use client";

import { useMemo, useState } from "react";
import { PRICE_TIERS, PRICING_INCLUDES, MATTRESS_NOTE } from "@/lib/seo";
import {
  CameraIcon,
  SofaIcon,
  ArmchairIcon,
  MattressIcon,
  FridgeIcon,
  TreeIcon,
  BricksIcon,
  BoxIcon,
  TvIcon,
  WasherIcon,
  DresserIcon,
} from "@/components/icons";

/**
 * Interactive price estimator — the Dropcurb "see your price instantly" idea,
 * rebuilt on FirstStep's own flat rates.
 *
 * Visitors tap what they've got; each item is worth an approximate share of
 * the 10x6 ft trailer (in eighths). The total rounds up to the nearest
 * owner-set tier from lib/seo.js — no invented prices. The result is always
 * labeled an estimate: the exact price is confirmed from a photo before any
 * work starts, which is how Michael actually quotes.
 *
 * Shed demolition ($725 flat) and pianos are NOT in the estimator — the shed
 * has its own tier card below, and the piano ballpark isn't a locked price.
 *
 * Minimum charge is $90 (the small-load floor) — a floor, never added on
 * top. Each TV is $40 for disposal: TVs alone cost max($90, $40 × count),
 * so 1–2 TVs are $90 total. TVs mixed with other items add $40 each on top
 * of the volume price, shown as its own line in the estimate.
 */

const ITEMS = [
  { key: "couch", name: "Couch / sofa", share: 2, shareLabel: "≈ 1/4 trailer", icon: SofaIcon },
  { key: "loveseat", name: "Loveseat / armchair", share: 1, shareLabel: "≈ 1/8 trailer", icon: ArmchairIcon },
  { key: "mattress", name: "Mattress", share: 1, shareLabel: "≈ 1/8 trailer", icon: MattressIcon },
  { key: "boxspring", name: "Box spring", share: 1, shareLabel: "≈ 1/8 trailer", icon: MattressIcon },
  { key: "dresser", name: "Dresser / chest", share: 1, shareLabel: "≈ 1/8 trailer", icon: DresserIcon },
  { key: "fridge", name: "Fridge", share: 1, shareLabel: "≈ 1/8 trailer", icon: FridgeIcon },
  { key: "washer", name: "Washer or dryer", share: 1, shareLabel: "≈ 1/8 trailer", icon: WasherIcon },
  { key: "tv", name: "TV", share: 1, shareLabel: "≈ 1/8 trailer · +$40 disposal", icon: TvIcon },
  { key: "bags", name: "Bags & boxes (per 5)", share: 1, shareLabel: "≈ 1/8 trailer", icon: BoxIcon },
  { key: "yard", name: "Yard waste pile", share: 2, shareLabel: "≈ 1/4 trailer", icon: TreeIcon },
  { key: "debris", name: "Construction debris pile", share: 2, shareLabel: "≈ 1/4 trailer", icon: BricksIcon },
];

function tierForEighths(n) {
  if (n <= 0) return null;
  if (n === 1) return PRICE_TIERS[0]; // Small load
  if (n === 2) return PRICE_TIERS[1]; // 1/4 load
  if (n <= 4) return PRICE_TIERS[2]; // 1/2 load
  if (n <= 6) return PRICE_TIERS[3]; // 3/4 load
  return PRICE_TIERS[4]; // Full load
}

export default function PriceEstimator() {
  const [counts, setCounts] = useState(() => Object.fromEntries(ITEMS.map((i) => [i.key, 0])));

  const totalEighths = useMemo(
    () => ITEMS.reduce((sum, item) => sum + counts[item.key] * item.share, 0),
    [counts]
  );
  const tier = tierForEighths(totalEighths);
  const hasMattress = counts.mattress > 0 || counts.boxspring > 0;
  const overFull = totalEighths > 8;
  const fillPct = Math.min(totalEighths, 8) / 8 * 100;
  const totalItems = ITEMS.reduce((sum, item) => sum + counts[item.key], 0);

  // TV disposal: $40 per TV. The $90 minimum is a FLOOR, never added on top
  // of the TV fees: TVs alone cost max($90, $40 × count), so 1–2 TVs are
  // $90 total. TVs mixed with other items add $40 each on top of the volume
  // price, as before. The volume price is the tier's flat amount, or the $90
  // small-load floor when the tier is a range.
  const MINIMUM_FEE = PRICE_TIERS[0].min; // $90 small-load floor
  const TV_DISPOSAL_FEE = 40;
  const tvCount = counts.tv;
  const tvFee = tvCount * TV_DISPOSAL_FEE;
  const tvOnly = tvCount > 0 && totalItems === tvCount;
  const volumePrice = tier ? (tier.amount ?? tier.min) : 0;
  const totalPrice = tvOnly ? Math.max(MINIMUM_FEE, tvFee) : volumePrice + tvFee;
  const floorApplies = tvOnly && tvFee < MINIMUM_FEE;

  function bump(key, delta) {
    setCounts((prev) => ({ ...prev, [key]: Math.max(0, Math.min(9, prev[key] + delta)) }));
  }
  function reset() {
    setCounts(Object.fromEntries(ITEMS.map((i) => [i.key, 0])));
  }

  return (
    <div className="mb-12 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 md:p-8" data-aos="fade-up">
      <h3 className="text-2xl font-bold text-primary">What will it cost?</h3>
      <p className="mt-2 max-w-2xl text-on-surface-variant">
        Tap what you&apos;ve got and see your price in seconds. This is an estimate — your exact
        price is confirmed from a photo before we start, and it never changes after that.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ITEMS.map((item) => {
              const count = counts[item.key];
              return (
                <li
                  key={item.key}
                  className={`flex items-center justify-between gap-3 rounded-xl border bg-white p-3 transition-colors ${
                    count > 0 ? "border-primary ring-1 ring-primary" : "border-outline-variant/40"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${count > 0 ? "bg-primary text-on-primary" : "bg-surface-container-low text-primary"}`}>
                      <item.icon className="h-6 w-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold leading-snug text-on-surface">{item.name}</span>
                      <span className="block text-xs text-on-surface-variant">{item.shareLabel}</span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => bump(item.key, -1)}
                      disabled={count === 0}
                      aria-label={`Remove one ${item.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/50 text-lg font-bold text-primary transition-colors hover:border-primary disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-bold" aria-live="polite">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => bump(item.key, 1)}
                      disabled={count >= 9}
                      aria-label={`Add one ${item.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/50 text-lg font-bold text-primary transition-colors hover:border-primary disabled:opacity-30"
                    >
                      +
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
          {totalItems > 0 ? (
            <button
              type="button"
              onClick={reset}
              className="mt-4 text-sm font-bold text-secondary underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          ) : null}
        </div>

        <div className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-xl bg-primary p-6 text-on-primary shadow-md">
            {tier ? (
              <>
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-primary/80">
                  Your estimate
                </p>
                <p className="mt-3 text-4xl font-extrabold">${totalPrice}</p>
                <p className="mt-1 font-bold">{tvOnly ? "TV disposal" : tier.name}</p>
                {tvCount > 0 ? (
                  <div className="mt-4 space-y-1 border-t border-on-primary/20 pt-4 text-sm font-semibold text-on-primary/90">
                    {tvOnly ? (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <span>TV disposal $40 × {tvCount}</span>
                          <span>${tvFee}</span>
                        </div>
                        {floorApplies ? (
                          <p className="pt-1 font-normal leading-relaxed text-on-primary/80">
                            Our $90 minimum applies — 1–2 TVs are $90 total.
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <span>Load · {tier.name}</span>
                          <span>${volumePrice}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>TV disposal $40 × {tvCount}</span>
                          <span>${tvFee}</span>
                        </div>
                      </>
                    )}
                  </div>
                ) : null}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-on-primary/80">
                    <span>Trailer space</span>
                    <span>
                      {overFull ? "Full +" : `${Math.min(totalEighths, 8)}/8 full`}
                    </span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-on-primary/25">
                    <div
                      className="h-full rounded-full bg-on-primary transition-all duration-300"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
                {overFull ? (
                  <p className="mt-4 text-sm leading-relaxed text-on-primary/90">
                    That&apos;s more than one full load — send a photo and we&apos;ll price the whole job.
                  </p>
                ) : null}
                {hasMattress ? <p className="mt-4 text-sm leading-relaxed text-on-primary/90">{MATTRESS_NOTE}</p> : null}
                <p className="mt-4 text-sm leading-relaxed text-on-primary/90">{PRICING_INCLUDES}</p>
                <p className="mt-2 text-sm leading-relaxed text-on-primary/90">
                  Usually same-day. Your exact price is confirmed from a photo before we lift a finger.
                </p>
                <a
                  href="#quote"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-base font-bold text-primary shadow transition-transform hover:-translate-y-0.5"
                >
                  <CameraIcon className="h-5 w-5" />
                  Get my exact price
                </a>
              </>
            ) : (
              <>
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-primary/80">
                  Your estimate
                </p>
                <p className="mt-4 text-2xl font-extrabold leading-snug">
                  Tap what you&apos;ve got — your price shows up here.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-on-primary/90">
                  A full trailer load is $425 flat, and small loads start at $90. Every rate includes
                  labor, pickup, hauling, and all dump fees.
                </p>
                <a
                  href="#quote"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-base font-bold text-primary shadow transition-transform hover:-translate-y-0.5"
                >
                  <CameraIcon className="h-5 w-5" />
                  Or send a photo for a price
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
