import { defaultContent } from "@/lib/content-data";

/**
 * Why FirstStep — four plain reasons, no "amateur vs. us" comparison.
 * Heading/intro still come from the dashboard content (Sheet); the four
 * points are fixed because they state the standing offer.
 */
const POINTS = [
  {
    icon: "schedule",
    title: "Same-day or next-day",
    body: "Call in the morning, gone by afternoon when the schedule allows.",
  },
  {
    icon: "request_quote",
    title: "Upfront flat pricing",
    body: "The quote you get is the price you pay. No surprise fees.",
  },
  {
    icon: "verified",
    title: "Licensed & Fully Insured",
    body: "Residential and commercial work across Rockford, IL.",
  },
  {
    icon: "location_on",
    title: "Local Rockford crew",
    body: "No franchise, no call center. Real replies from real people.",
  },
];

export default function WhyUs({ content }) {
  const w = { ...defaultContent.whyUs, ...(content?.whyUs || {}) };

  return (
    <section className="bg-surface-container-low py-section-gap" id="why-us">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto mb-14 max-w-2xl text-center" data-aos="fade-up">
          <h2 className="font-headline-lg text-headline-lg text-primary">{w.heading}</h2>
          <p className="mt-3 text-lg text-on-surface-variant">{w.intro}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p, i) => (
            <div
              key={p.title}
              className="rounded-2xl border border-outline-variant/30 bg-white p-7 shadow-sm transition-transform duration-300 hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={i * 80}
            >
              <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2.5 text-primary">
                {p.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold text-primary">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
