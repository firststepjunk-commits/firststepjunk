import { BUSINESS } from "@/lib/seo";

/**
 * Reviews — real quotes only, verbatim from the Google Business Profile.
 * The two newest reviews are behind Google's sign-in wall, so only the two
 * quotes on file are shown; the aggregate (5.0, 14 reviews) covers the rest.
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

const MORE_REVIEWERS = ["Adam Crawford", "Nathan Holmes", "Michelle Lass", "Christie Conway"];

function Stars() {
  return (
    <span className="text-lg leading-none tracking-[0.15em] text-amber-500" aria-label="5 out of 5 stars">
      ★★★★★
    </span>
  );
}

export default function Reviews() {
  return (
    <section className="bg-white py-section-gap" id="reviews">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto mb-14 max-w-2xl text-center" data-aos="fade-up">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            What Rockford says
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Five stars, fourteen times over.
          </h2>
          <p className="mt-3 text-on-surface-variant">
            Real customers, real jobs — every review on our Google profile is five stars.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Aggregate */}
          <div
            className="flex flex-col justify-between rounded-2xl bg-primary p-8 text-on-primary"
            data-aos="fade-up"
          >
            <div>
              <p className="text-6xl font-extrabold leading-none">5.0</p>
              <div className="mt-3">
                <Stars />
              </div>
              <p className="mt-4 text-lg font-semibold">14 five-star reviews on Google</p>
              <p className="mt-1 text-sm text-on-primary/70">
                From homeowners, landlords, and businesses across Rockford.
              </p>
            </div>
            <a
              href={BUSINESS.google.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2 font-bold text-secondary-fixed hover:underline"
            >
              Read all 14 reviews on Google
              <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>
          </div>

          {/* Real quotes */}
          {QUOTES.map((q, i) => (
            <figure
              key={q.name}
              className="flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm"
              data-aos="fade-up"
              data-aos-delay={150 * (i + 1)}
            >
              <div>
                <Stars />
                <blockquote className="mt-4 text-lg leading-relaxed text-on-surface">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-6 font-bold text-primary">— {q.name}</figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-on-surface-variant" data-aos="fade-up">
          Also rated us 5 stars: {MORE_REVIEWERS.join(" · ")}
        </p>
      </div>
    </section>
  );
}
