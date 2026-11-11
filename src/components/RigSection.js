import SiteImage from "./SiteImage";

/** The rig: real trailer photo, flat-rate framing. */
export default function RigSection() {
  return (
    <section className="bg-surface-container-low py-section-gap">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-margin-mobile md:grid-cols-2 md:px-margin-desktop">
        <div className="overflow-hidden rounded-2xl shadow-lg" data-aos="fade-right">
          <SiteImage
            alt="FirstStep Junk Removal dump trailer loaded on a Rockford job"
            width={1200}
            height={800}
            className="h-full w-full object-cover"
            src="/images/hero-trailer.jpg"
          />
        </div>
        <div data-aos="fade-left">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            Our rig
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            One trailer. Flat rates.
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-on-surface-variant">
            Our 10×6 ft dump trailer with 4 ft walls does the heavy lifting. A full load is a
            $425 flat rate — labor, pickup, hauling, and dump fees included. Smaller loads are
            priced by the space they take, from $90.
          </p>
          <a
            href="#pricing"
            className="group mt-6 inline-flex items-center gap-2 font-bold text-secondary hover:underline"
          >
            See pricing
            <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">
              arrow_forward
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
