import SiteImage from "./SiteImage";
import { defaultContent } from "@/lib/content-data";

export default function Services({ content }) {
  const s = { ...defaultContent.services, ...(content?.services || {}) };

  return (
    <section className="py-section-gap" id="services">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-16 flex items-end justify-between" data-aos="fade-up">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">{s.heading}</h2>
            <p className="mt-2 max-w-md text-on-surface-variant">{s.intro}</p>
          </div>
          <div className="hidden md:block">
            <span className="animate-float-slow font-label-sm text-label-sm uppercase tracking-widest text-secondary">
              {s.est}
            </span>
          </div>
        </div>
        <div className="grid h-auto grid-cols-1 gap-6 md:h-[600px] md:grid-cols-3">
          <div
            className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-2 md:col-span-2"
            data-aos="fade-up"
          >
            <div className="h-1/2 overflow-hidden">
              <SiteImage
                alt={s.imageAlt || "Crew loading logs"}
                width={1024}
                height={768}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                src={s.image || defaultContent.services.image}
                data-image-path="services.image"
                data-alt-path="services.imageAlt"
              />
            </div>
            <div className="flex flex-grow flex-col justify-between p-8">
              <div>
                <h3 className="mb-2 font-headline-lg text-headline-lg text-primary">{s.mainTitle}</h3>
                <p className="text-on-surface-variant">{s.mainBody}</p>
              </div>
              <div className="mt-4 flex gap-4">
                <span className="rounded bg-surface-container-low px-3 py-1 font-label-sm text-sm">
                  {s.mainTag1}
                </span>
                <span className="rounded bg-surface-container-low px-3 py-1 font-label-sm text-sm">
                  {s.mainTag2}
                </span>
              </div>
            </div>
          </div>
          <div className="flex h-full flex-col gap-6">
            <div
              className="flex flex-1 flex-col justify-between rounded-2xl bg-secondary-container p-8 transition-transform duration-300 hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 animate-float items-center justify-center rounded-lg bg-white/50">
                  <span className="material-symbols-outlined text-secondary">bug_report</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-on-secondary-container">{s.pestTitle}</h3>
                <p className="text-sm text-on-secondary-container/80">{s.pestBody}</p>
              </div>
              <a className="group inline-flex items-center gap-2 text-sm font-bold text-secondary" href="#quote">
                Learn More{" "}
                <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>
            </div>
            <div
              className="flex flex-1 flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface p-8 transition-transform duration-300 hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 animate-float items-center justify-center rounded-lg bg-primary/10" style={{ animationDelay: "1s" }}>
                  <span className="material-symbols-outlined text-primary">build</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-primary">{s.repairTitle}</h3>
                <p className="text-sm text-on-surface-variant">{s.repairBody}</p>
              </div>
              <a className="group inline-flex items-center gap-2 text-sm font-bold text-primary" href="#quote">
                Learn More{" "}
                <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
