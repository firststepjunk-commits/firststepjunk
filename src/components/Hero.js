import BeforeAfterSlider from "./BeforeAfterSlider";
import ShaderBackground from "./ShaderBackground";
import { defaultContent } from "@/lib/content-data";

export default function Hero({ content }) {
  const h = { ...defaultContent.hero, ...(content?.hero || {}) };

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <ShaderBackground className="absolute inset-0 z-0 h-full w-full opacity-40" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[6%] top-28 h-16 w-16 animate-float rounded-full bg-secondary-container/50 blur-[2px]" />
        <div
          className="absolute right-[10%] top-20 h-24 w-24 animate-float-slow rounded-3xl bg-primary/5 blur-sm"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute bottom-32 left-[18%] h-8 w-8 animate-float-slower rounded-full bg-secondary/15"
          style={{ animationDelay: "0.6s" }}
        />
        <div
          className="absolute bottom-16 right-[28%] h-12 w-12 animate-bob rounded-xl bg-primary-fixed/40 blur-[1px]"
          style={{ animationDelay: "2s", "--bob-rotate": "12deg" }}
        />
        <span
          className="material-symbols-outlined absolute left-[40%] top-24 animate-float-slow text-5xl text-primary/10"
          style={{ animationDelay: "0.8s" }}
        >
          recycling
        </span>
        <span
          className="material-symbols-outlined absolute bottom-40 right-[6%] animate-float text-6xl text-secondary/15"
          style={{ animationDelay: "1.6s" }}
        >
          local_shipping
        </span>
      </div>

      <div className="container z-10 mx-auto grid grid-cols-1 items-center gap-gutter px-margin-mobile md:grid-cols-2 md:px-margin-desktop">
        <div className="animate-fade-in-up space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-1.5 font-label-sm text-label-sm text-on-secondary-container">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            {h.badge}
          </div>
          <h1 className="font-display-lg text-display-lg leading-none text-primary">
            {h.titleLine1} <br />
            {h.titleLine2}
          </h1>
          <p className="max-w-lg text-xl text-on-surface-variant">{h.subtitle}</p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              className="rounded-lg bg-primary px-8 py-4 text-lg font-bold text-on-primary shadow-lg transition-all hover:scale-105 hover:shadow-primary/20 active:scale-95"
              href="#quote"
            >
              {h.primaryCta}
            </a>
            <a
              className="rounded-lg border-2 border-primary px-8 py-4 text-lg font-bold text-primary transition-all hover:bg-primary hover:text-on-primary active:scale-95"
              href="#services"
            >
              {h.secondaryCta}
            </a>
          </div>
        </div>

        <div className="relative mt-12 md:mt-0">
          <div className="absolute -inset-4 rounded-[2rem] bg-primary/5 blur-2xl" />
          {/* Not floating like the old static shot — a drag target that drifts
              under the finger is a bad drag target. */}
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
              className="h-[440px] w-full sm:h-[600px]"
            />
            <div className="absolute -bottom-6 -left-6 hidden animate-float rounded-xl border border-surface-container-high bg-white p-6 shadow-xl md:block">
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
    </section>
  );
}
