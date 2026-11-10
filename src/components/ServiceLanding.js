import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS, CITY_STATE } from "@/lib/seo";
import ServiceAreas from "@/components/ServiceAreas";
import PriceTierGrid from "@/components/PriceTierGrid";
import { defaultContent } from "@/lib/content-data";

export default function ServiceLanding({ page }) {
  const content = defaultContent;

  return (
    <>
      <Navbar content={content} homeLinks />
      <main>
        <section className="relative overflow-hidden border-b border-outline-variant/30 bg-surface-container-low">
          <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-margin-mobile py-16 md:grid-cols-2 md:px-margin-desktop md:py-24">
            <div>
              <p className="mb-3 font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                {CITY_STATE} · {BUSINESS.legalName}
              </p>
              <h1 className="font-headline-lg text-headline-lg text-primary md:text-5xl">{page.h1}</h1>
              <p className="mt-5 text-lg leading-relaxed text-on-surface">{page.answerFirst}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="rounded-lg bg-primary px-6 py-3 font-bold text-on-primary transition-transform hover:scale-105"
                >
                  Call {BUSINESS.phoneDisplay}
                </a>
                <a
                  href="/#quote"
                  className="rounded-lg border border-outline-variant px-6 py-3 font-bold text-primary transition-colors hover:bg-white"
                >
                  Get a free quote
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={page.image}
                alt={page.h1}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </section>

        <section className="border-b border-outline-variant/30 bg-white">
          <ul className="container mx-auto grid grid-cols-2 gap-4 px-margin-mobile py-5 text-center text-sm font-semibold text-primary md:grid-cols-4 md:px-margin-desktop">
            <li>★ {BUSINESS.google.ratingValue.toFixed(1)} on Google · {BUSINESS.google.reviewCount} reviews</li>
            <li>Licensed &amp; Fully Insured</li>
            <li>Open daily 7:30 AM–7:30 PM</li>
            <li>Flat rates from $75 · dump fees included</li>
          </ul>
        </section>

        <section className="py-section-gap">
          <div className="container mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-primary">What you get</h2>
            <p className="mt-3 text-on-surface-variant">{page.intro}</p>
            <ul className="mt-8 space-y-3">
              {page.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-outline-variant/30 bg-white py-section-gap">
          <div className="container mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-primary">How it works</h2>
            <ol className="mt-8 space-y-5">
              {page.howItWorks.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-on-surface">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-surface-container-low py-section-gap" id="pricing">
          <div className="container mx-auto max-w-4xl px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-primary">Pricing</h2>
            <p className="mt-2 mb-8 text-on-surface-variant">
              Simple flat rates based on how much of our 10×6 ft trailer your junk fills.
            </p>
            <PriceTierGrid compact />
            <p className="mt-6">
              <a href="/#quote" className="font-semibold text-secondary underline-offset-4 hover:underline">
                Get a free quote →
              </a>
            </p>
          </div>
        </section>

        <section className="py-section-gap">
          <div className="container mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-primary">What we haul</h2>
            <p className="mt-2 text-on-surface-variant">
              Ask about any of these — it&apos;s all covered by our load-size rates, and we
              confirm your price before we start.
            </p>
            <ul className="mt-8">
              {page.relatedServices.map((service) => (
                <li
                  key={service.name}
                  className="flex items-baseline justify-between gap-4 border-b border-outline-variant/25 py-3"
                >
                  <span>{service.name}</span>
                  <Link
                    href="/#quote"
                    className="shrink-0 font-semibold text-secondary underline-offset-4 hover:underline"
                  >
                    {BUSINESS.quoteLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-surface-container-low py-section-gap" id="faq">
          <div className="container mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-primary">FAQ</h2>
            <div className="mt-8 space-y-6">
              {page.faqs.map((item) => (
                <div key={item.question} className="border-b border-outline-variant/40 pb-6">
                  <h3 className="text-lg font-semibold text-primary">{item.question}</h3>
                  <p className="mt-2 leading-relaxed text-on-surface-variant">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServiceAreas excludeSlug={page.slug} />

        <section className="py-section-gap">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
            <p className="text-on-surface-variant">
              <a className="font-semibold text-primary" href="/about">
                About the owner — {BUSINESS.owner}
              </a>
              {" · "}Questions? Call{" "}
              <a className="font-semibold text-primary" href={`tel:${BUSINESS.phone}`}>
                {BUSINESS.phoneDisplay}
              </a>{" "}
              or{" "}
              <a className="font-semibold text-primary" href="/#quote">
                request a quote
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
