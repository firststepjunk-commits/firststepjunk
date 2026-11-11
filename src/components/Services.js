/**
 * Services as clean numbered cards, each linking to its own service page.
 * Copy is short and factual; the detail lives on the linked pages.
 */
const SERVICES = [
  {
    n: "01",
    icon: "weekend",
    title: "Furniture Removal",
    body: "Couches, beds, dressers, and more — we lift it, load it, and haul it away.",
    href: "/furniture-removal-rockford",
  },
  {
    n: "02",
    icon: "kitchen",
    title: "Appliance Removal",
    body: "Fridges, washers, dryers, and water heaters — the heavy lifting is handled.",
    href: "/appliance-removal-rockford",
  },
  {
    n: "03",
    icon: "home",
    title: "Estate Cleanouts",
    body: "Whole homes and estates cleared room by room, quickly and carefully.",
    href: "/estate-cleanout-rockford",
  },
  {
    n: "04",
    icon: "garage",
    title: "Garage & Basement Cleanouts",
    body: "Get your space back. We load, sweep, and you're done.",
    href: "/garage-basement-cleanout-rockford",
  },
  {
    n: "05",
    icon: "local_shipping",
    title: "Curbside Pickup",
    body: "Set it at the curb, send a photo, and we'll grab it — no contact needed.",
    href: "/curbside-pickup-rockford",
  },
  {
    n: "06",
    icon: "construction",
    title: "Shed Demolition",
    body: "Standard empty wood 10×12 shed — demo, haul, and disposal for a $725 flat rate.",
    href: "/shed-demolition-rockford",
  },
  {
    n: "07",
    icon: "bolt",
    title: "Same-Day Pickup",
    body: "Call in the morning, gone by afternoon when the schedule allows.",
    href: "/same-day-junk-pickup-rockford",
  },
];

export default function Services() {
  return (
    <section className="bg-surface-container-lowest py-section-gap" id="services">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-14 max-w-2xl" data-aos="fade-up">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            What we haul
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary">Services.</h2>
          <p className="mt-3 text-lg text-on-surface-variant">
            From one couch to a full property cleanout — if it&apos;s junk, we haul it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <a
              key={s.n}
              href={s.href}
              className="group flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={Math.min(i * 60, 300)}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-display-lg text-4xl font-extrabold text-primary/15 transition-colors group-hover:text-secondary">
                    {s.n}
                  </span>
                  <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">
                    {s.icon}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-primary">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{s.body}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-secondary">
                Learn more
                <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </a>
          ))}

          {/* Eighth cell: catch-all CTA */}
          <a
            href="#quote"
            className="group flex flex-col justify-between rounded-2xl bg-primary p-7 text-on-primary shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div>
              <span className="material-symbols-outlined rounded-lg bg-on-primary/15 p-2 text-on-primary">
                help
              </span>
              <h3 className="mt-5 text-xl font-bold">Something else?</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-primary/75">
                Send a photo of what you&apos;ve got and we&apos;ll tell you the price — usually
                within the hour.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-secondary-fixed">
              Get a free quote
              <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">
                arrow_forward
              </span>
            </span>
          </a>
        </div>

        {/* Single-item pages — a compact link row so the 7-card grid stays
            clean while every item page gets a homepage link. */}
        <div className="mt-10" data-aos="fade-up">
          <p className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
            More single-item removals
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "Mattress removal", href: "/mattress-removal-rockford" },
              { label: "Recliner removal", href: "/recliner-removal-rockford" },
              { label: "Ping pong table removal", href: "/ping-pong-table-removal-rockford" },
              { label: "Trampoline removal", href: "/trampoline-removal-rockford" },
              { label: "Hot tub removal", href: "/hot-tub-removal-rockford" },
              { label: "Piano removal", href: "/piano-removal-rockford" },
              { label: "TV removal", href: "/tv-removal-rockford" },
              { label: "Couch removal", href: "/couch-removal-rockford" },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-block rounded-full border border-outline-variant/40 bg-white px-3.5 py-1.5 text-sm font-semibold text-primary transition-colors hover:border-secondary hover:text-secondary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
