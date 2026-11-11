"use client";

import { useState } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { defaultContent } from "@/lib/content-data";
import { BUSINESS } from "@/lib/seo";
import {
  ArrowRightIcon,
  CameraIcon,
  CheckIcon,
  ClockIcon,
  PhoneIcon,
  ShieldCheckIcon,
  StarIcon,
} from "./icons";

/**
 * Hero, rebuilt on the competitor's structure (EZ Junk Hauling) with
 * FirstStep's real facts — not their copy or numbers.
 *
 * Layout: left content column (pill badge, giant extra-bold headline,
 * one paragraph, two big CTAs, star trust line, 2×2 trust cards, real
 * review card) and a big before/after photo on the right with a
 * "REAL ROCKFORD JOB" caption. Background is a subtle light grid.
 *
 * Headline and subtitle still come from the dashboard content (Sheet),
 * so owner edits keep working — only the layout and styling changed.
 * All icons here are inline SVGs (see icons.js): the hero never depends
 * on the Material Symbols font, so nothing can render as a stray word
 * like "call" if that font fails to load.
 *
 * The photo rotates through a few before/after pairs (see PAIRS below).
 * Pair 1 is the real job from the Sheet. Pair 2 is a generated
 * illustration — it carries NO real-job claim, just a neutral caption.
 */

const TRUST_CARDS = [
  {
    icon: <StarIcon className="h-5 w-5 text-amber-500" />,
    value: "5.0",
    label: "Google rated",
  },
  {
    icon: <span className="text-lg font-black leading-none text-primary">$</span>,
    value: "Free",
    label: "Easy quotes",
  },
  {
    icon: <ClockIcon className="h-5 w-5 text-primary" />,
    value: "Same-day",
    label: "Service · 7 days a week",
  },
  {
    icon: <ShieldCheckIcon className="h-5 w-5 text-primary" />,
    value: "Licensed",
    label: "& Fully insured",
  },
];

export default function Hero({ content }) {
  const h = { ...defaultContent.hero, ...(content?.hero || {}) };
  const [shot, setShot] = useState(0);

  // Before/after pairs for the auto-rotating hero photo. Pair 1 is the real
  // job (Sheet-driven images). Pair 2 is a generated illustration of a yard
  // cleanout — same scene for its before and after — and its caption makes
  // no claim that it is a real FirstStep job.
  const pairs = [
    {
      before: {
        src: h.beforeImage,
        alt: h.beforeAlt,
        label: h.beforeLabel,
        path: "hero.beforeImage",
        altPath: "hero.beforeAlt",
      },
      after: {
        src: h.afterImage,
        alt: h.afterAlt,
        label: h.afterLabel,
        path: "hero.afterImage",
        altPath: "hero.afterAlt",
      },
      captionKicker: "Real Rockford job",
      captionTitle: "Backyard patio cleanout",
    },
    {
      before: {
        src: "/images/hero-yard-before.jpg",
        alt: "Backyard patio piled with household junk: an old couch, trash bags, boxes, and a mattress",
        label: "Before",
      },
      after: {
        src: "/images/hero-yard-after.jpg",
        alt: "The same backyard patio, clean and clear",
        label: "After",
      },
      captionKicker: "Before & after",
      captionTitle: "A fresh, clear space",
    },
  ];
  const activePair = pairs[Math.floor(shot / 2)] || pairs[0];

  return (
    <section
      className="bg-surface-container-lowest"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgb(0 62 28 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 62 28 / 0.04) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-margin-mobile pb-16 pt-10 md:px-margin-desktop lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-14">
        <div className="animate-fade-in-up space-y-6 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/70 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary sm:text-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
              <CheckIcon className="h-3.5 w-3.5" />
            </span>
            {h.badge}
          </div>

          <h1 className="font-display-lg text-[3.25rem] font-black leading-[0.95] tracking-[-0.02em] text-on-surface sm:text-[4rem] lg:text-[4.5rem]">
            {h.titleLine1} <br />
            <span style={{ textShadow: "0.06em 0.06em 0 #dcdcdc" }}>{h.titleLine2}</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
            {h.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 pt-1">
            <a
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-10 py-5 text-lg font-extrabold uppercase tracking-wide text-on-primary shadow-xl transition-all hover:scale-[1.02] hover:shadow-primary/25 active:scale-95 sm:w-auto sm:min-w-[230px]"
              href="#quote"
            >
              {h.primaryCta}
            </a>
            <a
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-primary bg-white px-10 py-5 text-lg font-extrabold uppercase tracking-wide text-primary shadow-sm transition-all hover:scale-[1.02] hover:bg-primary hover:text-on-primary active:scale-95 sm:w-auto sm:min-w-[230px]"
              href={`tel:${BUSINESS.phone}`}
            >
              <PhoneIcon className="h-6 w-6" />
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>

          {/* Third, quieter path: text a photo. He already quotes from photos,
              and texting is the fastest way for a visitor to get a price. */}
          <div className="pt-1">
            <a
              href={`sms:${BUSINESS.phone}`}
              className="group inline-flex items-center gap-2 text-[15px] font-bold text-primary hover:underline"
            >
              <CameraIcon className="h-5 w-5" />
              or text us a photo of your pile — fastest way to a price
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
            <span className="flex gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
              <StarIcon className="h-5 w-5" />
              <StarIcon className="h-5 w-5" />
              <StarIcon className="h-5 w-5" />
              <StarIcon className="h-5 w-5" />
              <StarIcon className="h-5 w-5" />
            </span>
            <span className="font-extrabold text-primary">5.0 · 14 Google reviews</span>
            <span className="text-on-surface-variant">
              Most jobs $90–$425 · Free quotes, no surprise fees
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {TRUST_CARDS.map((card) => (
              <div
                key={card.label}
                className="flex items-center gap-3 rounded-xl border border-outline-variant/40 bg-white px-4 py-3.5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-container/60">
                  {card.icon}
                </span>
                <span>
                  <span className="block text-base font-extrabold leading-tight text-primary">
                    {card.value}
                  </span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {card.label}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <figure className="rounded-xl border border-outline-variant/40 bg-white p-5 shadow-sm">
            <span className="flex gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
              <StarIcon className="h-4 w-4" />
              <StarIcon className="h-4 w-4" />
              <StarIcon className="h-4 w-4" />
              <StarIcon className="h-4 w-4" />
              <StarIcon className="h-4 w-4" />
            </span>
            <blockquote className="mt-2 text-[15px] leading-relaxed text-on-surface">
              “5 stars is an understatement!! I highly recommend you call these guys for any
              junk removal needs.”
            </blockquote>
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm">
                <span className="font-bold text-primary">Hunter Brooks</span>{" "}
                <span className="text-on-surface-variant">· Google</span>
              </span>
              <a
                href={BUSINESS.google.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                See all reviews
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </figcaption>
          </figure>
        </div>

        <div className="lg:col-span-5">
          <BeforeAfterSlider
            pairs={pairs.map(({ before, after }) => ({ before, after }))}
            onShotChange={setShot}
            className="h-[420px] w-full sm:h-[520px] lg:h-[600px]"
          />
          <div className="mt-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              {activePair.captionKicker}
            </p>
            <p className="text-lg font-extrabold text-primary">{activePair.captionTitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
