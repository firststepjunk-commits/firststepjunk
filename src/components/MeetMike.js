import SiteImage from "./SiteImage";
import { OWNER } from "@/lib/service-pages";
import { BUSINESS } from "@/lib/seo";

/**
 * Meet Mike — the owner note. Verified facts only: owner-operated, Rockford
 * local, licensed & insured, open daily 7:30 AM–7:30 PM. No invented
 * biography and no invented quote.
 *
 * QUOTE SLOT — waiting on Michael: a 1–2 sentence quote in his own words
 * goes in the commented-out block below. Do not publish this section with
 * placeholder quote text; the section reads fine without it.
 */
export default function MeetMike() {
  return (
    <section className="border-t border-outline-variant/30 bg-surface-container-low py-section-gap">
      <div className="container mx-auto grid items-center gap-10 px-margin-mobile md:grid-cols-2 md:px-margin-desktop">
        <div data-aos="fade-right">
          <SiteImage
            src={OWNER.image}
            alt="Michael, owner of FirstStep Junk Removal LLC, on a job in Rockford, Illinois"
            width={768}
            height={768}
            className="aspect-square w-full rounded-2xl object-cover shadow-lg"
          />
        </div>
        <div data-aos="fade-left">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            Meet the owner
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Hi, I&apos;m Michael.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-on-surface">
            I own and run FirstStep Junk Removal LLC right here in Rockford. When you call{" "}
            <a href={`tel:${BUSINESS.phone}`} className="font-bold text-secondary underline-offset-4 hover:underline">
              {BUSINESS.phoneDisplay}
            </a>
            , you&apos;re talking to me — not a call center, not a franchise. I handle the
            quotes, I&apos;m on the jobs, and I make sure the place is left clean when we go.
          </p>
          <ul className="mt-6 space-y-2 text-on-surface">
            <li className="flex gap-2">
              <span className="font-bold text-secondary">✓</span>
              <span>Owner-operated and local to Rockford, IL</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-secondary">✓</span>
              <span>Licensed &amp; fully insured</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-secondary">✓</span>
              <span>Upfront flat rates from $90 — a full load is $425, dump fees included</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-secondary">✓</span>
              <span>Open every day, 7:30 AM–7:30 PM</span>
            </li>
          </ul>
          {/* QUOTE SLOT — 1–2 sentences in Michael's own words. Uncomment and
              fill in once he provides them; do not invent quote text.
          <blockquote className="mt-8 border-l-4 border-secondary pl-5 text-lg italic text-on-surface">
            &ldquo;…&rdquo;
            <footer className="mt-2 text-sm font-bold not-italic text-primary">
              — Michael, owner
            </footer>
          </blockquote>
          */}
          <p className="mt-8">
            <a
              href="/about"
              className="font-bold text-secondary underline-offset-4 hover:underline"
            >
              More about Michael →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
