import { BUSINESS } from "@/lib/seo";
import { StarIcon, ArrowRightIcon } from "./icons";
import SiteImage from "./SiteImage";

/**
 * Reviews — rebuilt on the competitor's reviews-section structure
 * (eyebrow, giant headline, wide aggregate bar, masonry cards), but with
 * FirstStep's real facts only.
 *
 * STRICT content rule — only verbatim quotes on file, never invent:
 * - Hunter Brooks and Chill brah: the only two quotes on file, verbatim.
 * - Adam Crawford, Nathan Holmes, Michelle Lass, Christie Conway: 5-star
 *   Google reviewers whose quote text we do NOT have. They appear by name
 *   with 5 stars and the Google badge, and NO quote text.
 * - The 2 newest reviews are behind Google's sign-in wall (names/text
 *   unknown) — no cards for them; the aggregate "14 five-star reviews"
 *   covers them.
 * - No dates anywhere: we have no review dates on file, and inventing
 *   one would be fabrication.
 *
 * The job-photo strip shows real FirstStep job photos in general. Photos
 * are NOT attributed to individual reviewers — we can't verify which
 * photo belongs to which reviewer's job.
 */
const QUOTES = [
  {
    name: "Hunter Brooks",
    quote:
      "5 stars is an understatement!! I highly recommend you call these guys for any junk removal needs.",
  },
  {
    name: "Chill brah",
    quote:
      "Very friendly, fair priced and great interaction. The team at firststep got the job done fast!",
  },
];

// 5-star Google reviewers with no quote text on file — name only, no quote.
const MORE_REVIEWERS = ["Adam Crawford", "Nathan Holmes", "Michelle Lass", "Christie Conway"];

// Real job photos from the site's gallery (crew at work, not portraits).
const JOB_PHOTOS = [
  {
    src: "/images/gallery/g01.webp",
    alt: "FirstStep crew hauling an appliance down the stairs",
  },
  {
    src: "/images/gallery/g02.webp",
    alt: "FirstStep crew clearing out a basement laundry room",
  },
  {
    src: "/images/gallery/g04.webp",
    alt: "FirstStep crew carrying a couch down the stairs",
  },
  {
    src: "/images/gallery/g06.webp",
    alt: "FirstStep crew clearing a yard beside the dump trailer",
  },
];

/** Google "G" mark in brand colors. */
function GoogleGMark({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45c-.28 1.48-1.11 2.73-2.37 3.57v2.97h3.84c2.24-2.07 3.57-5.11 3.57-8.73z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.84-2.97c-1.06.71-2.42 1.14-4.1 1.14-3.15 0-5.82-2.13-6.78-5.03H1.29v3.07C3.27 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.22 14.23c-.24-.71-.38-1.46-.38-2.23s.14-1.52.38-2.23V6.7H1.29C.47 8.41 0 10.15 0 12s.47 3.59 1.29 5.3l3.93-3.07z"
      />
      <path
        fill="#EA4335"
        d="M12 4.74c1.76 0 3.35.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.29 6.7l3.93 3.07C6.18 6.87 8.85 4.74 12 4.74z"
      />
    </svg>
  );
}

function Stars({ className = "h-4 w-4" }) {
  return (
    <span className="flex gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={className} />
      ))}
    </span>
  );
}

function GoogleBadge() {
  return (
    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
      <GoogleGMark className="h-4 w-4" />
      Google
    </span>
  );
}

export default function Reviews() {
  return (
    <section
      className="bg-surface-container-lowest py-section-gap"
      id="reviews"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgb(0 62 28 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 62 28 / 0.04) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header — eyebrow, giant headline, subtext (Google only: we have
            no Facebook reviews on file). */}
        <div data-aos="fade-up">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            What Rockford says
          </p>
          <h2 className="mt-3 font-display-lg text-[2.75rem] font-black leading-[0.95] tracking-[-0.02em] text-on-surface sm:text-6xl lg:text-7xl">
            Five stars,
            <br />
            fourteen times over.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-on-surface-variant">
            Real customers. Real jobs. Verbatim from Google.
          </p>
        </div>

        {/* Wide aggregate bar */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-outline-variant/30 bg-white px-6 py-5 shadow-sm"
          data-aos="fade-up"
        >
          <GoogleGMark className="h-7 w-7" />
          <span className="text-3xl font-extrabold text-on-surface">5.0</span>
          <Stars className="h-5 w-5" />
          <span className="text-lg font-bold text-[#4285F4]">Google</span>
          <span className="text-on-surface-variant">· 14 five-star reviews</span>
        </div>

        {/* Masonry review cards */}
        <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {QUOTES.map((q, i) => (
            <figure
              key={q.name}
              className="mb-6 break-inside-avoid rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-sm"
              data-aos="fade-up"
              data-aos-delay={100 * i}
            >
              <div className="flex items-start justify-between gap-3">
                <Stars />
                <GoogleBadge />
              </div>
              <blockquote className="mt-4 leading-relaxed text-on-surface">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 font-bold text-on-surface">{q.name}</figcaption>
            </figure>
          ))}

          {MORE_REVIEWERS.map((name, i) => (
            <figure
              key={name}
              className="mb-6 break-inside-avoid rounded-2xl border border-outline-variant/30 bg-white p-6 shadow-sm"
              data-aos="fade-up"
              data-aos-delay={100 * ((i + QUOTES.length) % 3)}
            >
              <div className="flex items-start justify-between gap-3">
                <Stars />
                <GoogleBadge />
              </div>
              <figcaption className="mt-4 text-lg font-bold text-on-surface">{name}</figcaption>
              <p className="mt-1 text-sm text-on-surface-variant">5-star Google review</p>
            </figure>
          ))}
        </div>

        <div className="mt-4 text-center" data-aos="fade-up">
          <a
            href={BUSINESS.google.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5"
          >
            See all 14 reviews on Google
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Real job photos — our real jobs in general, not tied to any
            individual reviewer. */}
        <div className="mt-16" data-aos="fade-up">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Straight from the job site
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-on-surface sm:text-3xl">
            Real FirstStep cleanups
          </h3>
          <p className="mt-1 text-on-surface-variant">
            Photos from actual jobs around Rockford — not stock photos.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {JOB_PHOTOS.map((p) => (
              <div
                key={p.src}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border-4 border-white shadow-lg"
              >
                <SiteImage
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
