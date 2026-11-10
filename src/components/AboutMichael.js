import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS, CITY_STATE } from "@/lib/seo";
import { OWNER, SERVICE_PAGES } from "@/lib/service-pages";
import { defaultContent } from "@/lib/content-data";

export default function AboutMichael() {
  const content = defaultContent;

  return (
    <>
      <Navbar content={content} homeLinks />
      <main>
        <section className="border-b border-outline-variant/30 bg-surface-container-low">
          <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-margin-mobile py-16 md:grid-cols-[280px_1fr] md:px-margin-desktop md:py-24">
            <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl">
              <Image
                src={OWNER.image}
                alt={`${OWNER.name}, owner of ${BUSINESS.brandName} in ${CITY_STATE}`}
                fill
                className="object-cover"
                sizes="280px"
                priority
              />
            </div>
            <div>
              <p className="mb-3 font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                {OWNER.jobTitle} · {CITY_STATE}
              </p>
              <h1 className="font-headline-lg text-headline-lg text-primary md:text-5xl">
                Meet {OWNER.name}
              </h1>
              <p className="mt-2 text-lg font-semibold text-on-surface-variant">
                {OWNER.jobTitle}, {BUSINESS.legalName}
              </p>
              <p className="mt-5 text-lg leading-relaxed text-on-surface">{OWNER.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="rounded-lg bg-primary px-6 py-3 font-bold text-on-primary transition-transform hover:scale-105"
                >
                  Call {BUSINESS.phoneDisplay}
                </a>
                <a
                  href="/#quote"
                  className="rounded-lg border border-outline-variant px-6 py-3 font-bold text-primary hover:bg-white"
                >
                  Request a quote
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-section-gap">
          <div className="container mx-auto max-w-3xl space-y-6 px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-primary">Experience & approach</h2>
            {OWNER.bioParagraphs.map((p) => (
              <p key={p.slice(0, 32)} className="leading-relaxed text-on-surface-variant">
                {p}
              </p>
            ))}
          </div>
        </section>

        <section className="border-y border-outline-variant/30 bg-white py-section-gap">
          <div className="container mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Why customers call {OWNER.name}
            </h2>
            <ul className="mt-8 space-y-4">
              {OWNER.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="material-symbols-outlined text-secondary">verified</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-section-gap">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-primary">
              {BUSINESS.address.addressLocality} services
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_PAGES.map((p) => (
                <li key={p.slug}>
                  <a
                    href={p.path}
                    className="block border-b border-outline-variant/40 py-3 font-semibold text-primary hover:text-secondary"
                  >
                    {p.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-4 text-sm text-on-surface-variant">
              <a
                href={BUSINESS.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-secondary"
              >
                Instagram
              </a>
              <a
                href={BUSINESS.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-secondary"
              >
                Facebook
              </a>
              <a
                href={BUSINESS.google.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-secondary"
              >
                Google Business Profile
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
