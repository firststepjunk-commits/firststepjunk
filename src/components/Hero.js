import BeforeAfterSlider from "./BeforeAfterSlider";
import TrustBar from "./TrustBar";
import { defaultContent } from "@/lib/content-data";
import { BUSINESS } from "@/lib/seo";

/**
 * Hero, redesigned for clarity: one big headline, the real starting price,
 * and two actions (get a quote / call). Copy still comes from the dashboard
 * content (Sheet), so owner edits keep working — only the layout changed.
 * The before/after slider stays: it's real photos of a real cleanup.
 */
export default function Hero({ content }) {
  const h = { ...defaultContent.hero, ...(content?.hero || {}) };

  return (
    <section className="bg-surface-container-lowest">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-margin-mobile pb-16 pt-14 md:grid-cols-2 md:px-margin-desktop md:pt-20">
        <div className="animate-fade-in-up space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-1.5 font-label-sm text-label-sm text-on-secondary-container">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            {h.badge}
          </div>
          <h1 className="font-display-lg text-[2.75rem] font-extrabold leading-[1.02] tracking-tight text-primary md:text-display-xl">
            {h.titleLine1} <br />
            {h.titleLine2}
          </h1>
          <p className="max-w-lg text-xl leading-relaxed text-on-surface-variant">{h.subtitle}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              className="rounded-lg bg-primary px-8 py-4 text-lg font-bold text-on-primary shadow-lg transition-all hover:scale-105 hover:shadow-primary/20 active:scale-95"
              href="#quote"
            >
              {h.primaryCta}
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-8 py-4 text-lg font-bold text-primary transition-all hover:bg-primary hover:text-on-primary active:scale-95"
              href={`tel:${BUSINESS.phone}`}
            >
              <span className="material-symbols-outlined">call</span>
              {BUSINESS.phoneDisplay}
            </a>
          </div>
          <p className="text-sm text-on-surface-variant">
            Open every day, 7:30 AM–7:30 PM · Free quotes · No obligation
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-primary/5 blur-2xl" />
          <div className="relative">
            <BeforeAfterSlider
              before={{
                src: h.beforeImage,
                alt: h.beforeAlt,
                label: h.beforeLabel,
                path: "hero.beforeImage",
                altPath: "hero.beforeAlt",
              }}
              after={{
                src: h.afterImage,
                alt: h.afterAlt,
                label: h.afterLabel,
                path: "hero.afterImage",
                altPath: "hero.afterAlt",
              }}
              className="h-[440px] w-full sm:h-[560px]"
            />
            <div className="absolute -bottom-6 -left-6 hidden animate-float rounded-xl border border-surface-container-high bg-white p-5 shadow-xl md:block">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-secondary p-2">
                  <span className="material-symbols-outlined text-white">schedule</span>
                </div>
                <div>
                  <p className="font-bold text-primary">{h.floatTitle}</p>
                  <p className="text-sm text-on-surface-variant">{h.floatText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TrustBar />
    </section>
  );
}
