"use client";

import { useState } from "react";
import { ADMIN_PASSWORD } from "@/lib/content-data";
import { BUSINESS, SITE_URL } from "@/lib/seo";
import { OWNER, SERVICE_PAGES } from "@/lib/service-pages";

const IOS_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/** Green = AI shipped · Amber = owner (GBP) · Blue = next / monitor */
const AI_DONE = [
  {
    title: "Site identity matched to Google Business Profile",
    detail: `Legal name, phone, hours, ${BUSINESS.address.addressLocality} description themes, and the service menu.`,
  },
  {
    title: "Homepage metadata + Open Graph + geo tags",
    detail: `Canonical ${BUSINESS.address.addressLocality} title/description for Search snippets.`,
  },
  {
    title: "JSON-LD schema",
    detail: "LocalBusiness, Organization (with founder), FAQPage, Services, Person on /about.",
  },
  {
    title: `Visible service menu + ${BUSINESS.address.addressLocality} FAQ on homepage`,
    detail:
      "Quote-on-request per job — no published prices on the page or in schema. Q&A matches FAQPage schema text word for word.",
  },
  {
    title: "Dedicated service URLs (indexable)",
    detail: `${SERVICE_PAGES.map((p) => p.path).join(" · ")} — each with answer-first copy, service list, FAQ + schema.`,
    links: SERVICE_PAGES.map((p) => ({ href: p.path, label: p.title })),
  },
  {
    title: "Owner E-E-A-T page",
    detail: `/about — ${OWNER.name} bio, experience, Person + AboutPage schema, sameAs to IG/FB/Maps.`,
    links: [{ href: "/about", label: `About ${OWNER.name}` }],
  },
  {
    title: "robots.txt + sitemap.xml",
    detail: `Public URLs in sitemap (home, ${SERVICE_PAGES.length} services, about). Back office blocked: /seos, /settings, /settings/editor, /jobs, /submissions, /api.`,
  },
  {
    title: "AI crawler allows + discovery files",
    detail: "OAI-SearchBot, Googlebot, bingbot allowed. llms.txt / llms-full.txt / ai.txt published.",
  },
  {
    title: "Footer + Team internal links",
    detail: `Footer points at service pages; ${OWNER.name} links to /about.`,
  },
];

const MIKE_GBP = [
  {
    group: "Foundation",
    items: [
      "Confirm profile is Verified",
      `Primary category: ${BUSINESS.category} (+ up to 9 real extra categories)`,
      "Set accurate service area (cities/Zips you actually cover)",
      "Hide street address if no customer walk-in location",
      `Phone + ${SITE_URL} exact`,
      "Hours + special hours for holidays",
      "Opening date (month/year) if available",
    ],
  },
  {
    group: "Relevance content",
    items: [
      "Description ≤750 chars; no URLs/HTML; not mainly promo copy",
      "Edit Services: every real service + short description",
      "Site quotes per job — remove fixed Product prices from GBP so the two match",
      "Turn on every factual Attribute that is true",
      "Social links (IG/FB already public — keep them)",
    ],
  },
  {
    group: "Prominence & freshness",
    items: [
      "Upload more real job / truck / team photos",
      "Publish GBP Posts regularly",
      "Reply to every Google review",
      "Ask real customers via Google review link/QR — never pay for reviews",
      "Answer Q&A if it appears on your category",
      "Review Collected info / Google suggested edits",
    ],
  },
];

const NEXT_STEPS = [
  {
    title: "Claim Bing Places (same name / phone / website)",
    detail: "ChatGPT Search and Copilot lean on Bing’s local index.",
  },
  {
    title: "Submit sitemap in Google Search Console + Bing Webmaster",
    detail: "Include the new service URLs and /about after deploy.",
  },
  {
    title: "Request indexing for new pages",
    detail: `Home, the ${BUSINESS.address.addressLocality} service pages, and /about.`,
  },
  {
    title: "Keep stacking honest Google reviews",
    detail: `Real customers mentioning ${BUSINESS.address.addressLocality} + the job type help prominence.`,
  },
  {
    title: "Optional: Yelp / Nextdoor / Angi with identical NAP",
    detail: "Third-party corroboration for AI answers — only if listings are accurate.",
  },
];

function CheckItem({ children }) {
  const [done, setDone] = useState(false);
  return (
    <label className="flex cursor-pointer items-start gap-3 border-b border-black/[0.06] px-3 py-3 last:border-b-0 active:bg-black/[0.03]">
      <input
        type="checkbox"
        checked={done}
        onChange={() => setDone((v) => !v)}
        className="mt-1 h-4 w-4 accent-[#ff9500]"
      />
      <span className={`text-[15px] leading-snug ${done ? "text-[#8e8e93] line-through" : "text-black"}`}>
        {children}
      </span>
    </label>
  );
}

function SectionLegend() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <div className="flex items-center gap-2 rounded-[12px] bg-[#34c759]/15 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#34c759]" />
        <span className="text-[13px] font-semibold text-[#1b7a34]">Done by AI (site)</span>
      </div>
      <div className="flex items-center gap-2 rounded-[12px] bg-[#ff9500]/15 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
        <span className="text-[13px] font-semibold text-[#9a5700]">Mike — do in GBP</span>
      </div>
      <div className="flex items-center gap-2 rounded-[12px] bg-[#007aff]/15 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#007aff]" />
        <span className="text-[13px] font-semibold text-[#0055b3]">Next steps</span>
      </div>
    </div>
  );
}

export default function SeosGuide() {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");

  function tryUnlock(e) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setUnlocked(true);
      setPwError("");
    } else {
      setPwError("Incorrect password.");
    }
  }

  if (!unlocked) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#f2f2f7] px-4"
        style={{ fontFamily: IOS_FONT }}
      >
        <form onSubmit={tryUnlock} className="w-full max-w-[340px] text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#5856d6]">
            <span className="material-symbols-outlined text-3xl text-white">travel_explore</span>
          </div>
          <h1 className="text-[22px] font-bold text-black">SEO / AI guide</h1>
          <p className="mt-1 text-[15px] text-[#8e8e93]">Back office only. Enter the password to continue.</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="mt-5 h-[52px] w-full rounded-[14px] border border-black/10 bg-white px-4 text-[17px] outline-none focus:border-[#007aff]"
            autoFocus
          />
          {pwError ? <p className="mt-2 text-[13px] text-[#ff3b30]">{pwError}</p> : null}
          <button
            type="submit"
            className="mt-5 h-[52px] w-full rounded-[14px] bg-[#007aff] text-[17px] font-semibold text-white active:scale-[0.98]"
          >
            Unlock
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f2f2f7] pb-16 text-black" style={{ fontFamily: IOS_FONT }}>
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#f9f9f9]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 pb-3 pt-3">
          <div className="flex items-center justify-between">
            <a href="/settings" className="flex items-center gap-0.5 text-[17px] text-[#007aff]">
              <span className="material-symbols-outlined text-xl">chevron_left</span>
              Settings
            </a>
            <span className="text-[15px] font-semibold text-black/80">Back office</span>
            <a href="/" target="_blank" rel="noreferrer" className="text-[17px] text-[#007aff]">
              Site
            </a>
          </div>
          <h1 className="mt-1 text-[32px] font-bold tracking-tight">SEO & AI</h1>
          <p className="mt-1 text-[14px] text-[#8e8e93]">
            Color-coded operator guide · private · noindex
          </p>
          <p className="mt-0.5 text-[13px] text-[#8e8e93]">Updated July 13, 2026</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 px-4 pt-5">
        <SectionLegend />

        {/* Summary */}
        <section className="overflow-hidden rounded-[14px] bg-white">
          <div className="border-b border-black/[0.06] px-4 py-3">
            <h2 className="text-[17px] font-semibold">Summary</h2>
          </div>
          <div className="space-y-3 px-4 py-4 text-[15px] leading-relaxed text-black/80">
            <p>
              Google ranks local results on <strong>relevance, distance, and prominence</strong>. The
              website now matches your Google Business Profile and publishes indexable{" "}
              {BUSINESS.address.addressLocality} service pages plus an owner page for E-E-A-T.
            </p>
            <p>
              <span className="font-semibold text-[#1b7a34]">Green</span> = already built on the site.{" "}
              <span className="font-semibold text-[#9a5700]">Amber</span> = you finish inside GBP.{" "}
              <span className="font-semibold text-[#0055b3]">Blue</span> = deploy / Bing / reviews after
              that.
            </p>
          </div>
        </section>

        {/* Why it works */}
        <section className="overflow-hidden rounded-[14px] border border-[#34c759]/30 bg-[#34c759]/[0.06]">
          <div className="border-b border-[#34c759]/25 px-4 py-3">
            <h2 className="text-[17px] font-semibold text-[#1b7a34]">Why this will work</h2>
          </div>
          <ul className="space-y-0 px-4 py-2 text-[14px] text-black/80">
            {[
              "Site + GBP say the same facts (entity corroboration).",
              "Gemini/AI Overviews use normal Search + an up-to-date Business Profile (Google’s docs).",
              "Service URLs answer specific queries (one indexable page per service).",
              "Owner page gives a real Person for trust, not anonymous marketing copy.",
              "FAQ + service menu are visible text AI can quote — not hidden in images.",
            ].map((t) => (
              <li key={t} className="flex gap-2 border-b border-[#34c759]/15 py-2.5 last:border-0">
                <span className="material-symbols-outlined text-[18px] text-[#34c759]">check</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* AI DONE */}
        <section>
          <div className="mb-2 flex items-center gap-2 px-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#34c759]" />
            <p className="text-[13px] font-semibold uppercase tracking-wide text-[#1b7a34]">
              Done by AI — already on the site
            </p>
          </div>
          <div className="overflow-hidden rounded-[14px] border border-[#34c759]/35 bg-white">
            {AI_DONE.map((item, i) => (
              <div
                key={item.title}
                className={`px-4 py-3 ${i < AI_DONE.length - 1 ? "border-b border-black/[0.06]" : ""}`}
              >
                <div className="flex gap-2">
                  <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#34c759]">
                    check_circle
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-black">{item.title}</p>
                    <p className="mt-1 text-[13px] leading-snug text-[#8e8e93]">{item.detail}</p>
                    {item.links ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.links.map((l) => (
                          <a
                            key={l.href}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-[#34c759]/15 px-3 py-1 text-[12px] font-semibold text-[#1b7a34]"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MIKE */}
        <section>
          <div className="mb-2 flex items-center gap-2 px-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff9500]" />
            <p className="text-[13px] font-semibold uppercase tracking-wide text-[#9a5700]">
              Mike — do manually in Google Business Profile
            </p>
          </div>
          <p className="mb-3 px-1 text-[13px] text-[#8e8e93]">
            Official GBP Help only. Check off as you go (this browser session).
          </p>
          {MIKE_GBP.map((block) => (
            <div
              key={block.group}
              className="mb-3 overflow-hidden rounded-[14px] border border-[#ff9500]/35 bg-white"
            >
              <div className="border-b border-[#ff9500]/25 bg-[#ff9500]/10 px-4 py-2.5">
                <h3 className="text-[15px] font-semibold text-[#9a5700]">{block.group}</h3>
              </div>
              {block.items.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </div>
          ))}
        </section>

        {/* NEXT */}
        <section>
          <div className="mb-2 flex items-center gap-2 px-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#007aff]" />
            <p className="text-[13px] font-semibold uppercase tracking-wide text-[#0055b3]">
              Next steps — after deploy
            </p>
          </div>
          <div className="overflow-hidden rounded-[14px] border border-[#007aff]/35 bg-white">
            {NEXT_STEPS.map((item, i) => (
              <div
                key={item.title}
                className={`px-4 py-3 ${i < NEXT_STEPS.length - 1 ? "border-b border-black/[0.06]" : ""}`}
              >
                <div className="flex gap-2">
                  <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#007aff]">
                    arrow_forward
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold">{item.title}</p>
                    <p className="mt-1 text-[13px] text-[#8e8e93]">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[14px] bg-white px-4 py-4 text-[13px] text-[#8e8e93]">
          <p className="font-semibold text-black/70">Myths (skip)</p>
          <p className="mt-2">llms.txt does not rank you in Gemini — Google Search ignores it.</p>
          <p className="mt-1">You cannot pay for better local pack ranking.</p>
          <p className="mt-1">There is no official “10 FAQ slots” product — use Services, Products, Q&A, Posts.</p>
        </section>

        <p className="px-1 pb-8 text-center text-[12px] text-[#8e8e93]">
          Sources: support.google.com/business · developers.google.com/search (AI features) · OpenAI
          OAI-SearchBot docs
        </p>
      </div>
    </main>
  );
}
