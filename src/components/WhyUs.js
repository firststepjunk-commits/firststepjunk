import SiteImage from "./SiteImage";
import { defaultContent } from "@/lib/content-data";

export default function WhyUs({ content }) {
  const w = { ...defaultContent.whyUs, ...(content?.whyUs || {}) };
  const amateurPoints = w.amateurPoints || [];
  const firstStepPoints = w.firstStepPoints || [];

  return (
    <section className="bg-surface-container-lowest py-section-gap" id="why-us">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto mb-20 max-w-3xl text-center" data-aos="fade-up">
          <h2 className="mb-4 font-headline-lg text-headline-lg text-primary">{w.heading}</h2>
          <p className="text-lg text-on-surface-variant">{w.intro}</p>
        </div>
        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
          <div
            className="group overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface shadow-sm"
            data-aos="fade-right"
          >
            <div className="border-b border-error/10 bg-error/5 p-8">
              <h3 className="flex items-center gap-2 font-headline-lg text-headline-lg text-error">
                <span className="material-symbols-outlined">report</span>
                {w.amateurTitle}
              </h3>
            </div>
            <div className="space-y-6 p-8 opacity-60">
              {amateurPoints.map((point, i) => (
                <div className="flex items-start gap-4" key={i}>
                  <span className="material-symbols-outlined pt-1 text-error">close</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Scaled up only from lg, where the two cards sit side by side and
              the lift reads as emphasis. Stacked on a phone this card is
              already full width, so scaling it pushed it past the screen edge
              and made the whole page scroll sideways. */}
          <div
            className="z-10 transform overflow-hidden rounded-2xl bg-primary text-on-primary shadow-xl lg:scale-105"
            data-aos="fade-left"
            data-aos-delay="150"
          >
            <div className="border-b border-on-primary/10 bg-primary-container p-8">
              <h3 className="flex items-center gap-2 font-headline-lg text-headline-lg text-on-primary-container">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                {w.firstStepTitle}
              </h3>
            </div>
            <div className="space-y-6 p-8">
              {firstStepPoints.map((item, i) => (
                <div key={item.t} className="flex items-start gap-4" data-aos="fade-up" data-aos-delay={200 + i * 100}>
                  <span className="material-symbols-outlined pt-1 text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <div>
                    <p className="font-bold">{item.t}</p>
                    <p className="text-sm text-on-primary/70">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-4 h-64">
              <SiteImage
                alt={w.imageAlt || "Professional crew at job site"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                src={w.image || defaultContent.whyUs.image}
                data-image-path="whyUs.image"
                data-alt-path="whyUs.imageAlt"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
