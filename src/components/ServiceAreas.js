import SiteImage from "./SiteImage";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { TOWN_PAGES } from "@/lib/town-pages";
import { BUSINESS } from "@/lib/seo";

const linkCls =
  "block border-b border-outline-variant/40 py-3 font-semibold text-primary transition-colors hover:text-secondary";

/** Rockford neighborhoods and ZIP codes — the "we serve your street" proof
 *  Dropcurb-style local sites lead with. Plain geography, no invented claims. */
const ROCKFORD_NEIGHBORHOODS = [
  "Forest Hills",
  "Spring Creek",
  "Downtown Riverfront",
  "Churchill's Grove",
  "Signal Hill",
  "Guilford",
  "Edgebrook",
  "North End",
  "South Main",
  "Midtown",
  "Haight Village",
  "Kilburn Park",
];

const ROCKFORD_ZIPS = [
  "61101",
  "61102",
  "61103",
  "61104",
  "61105",
  "61106",
  "61107",
  "61108",
  "61109",
  "61110",
  "61111",
  "61112",
  "61114",
  "61115",
  "61125",
  "61126",
];

const chipCls =
  "rounded-full border border-outline-variant/40 bg-white px-3 py-1 text-sm font-semibold text-on-surface";

/** Crawlable internal links to every service page and town page. */
export default function ServiceAreas({ excludeSlug }) {
  const services = SERVICE_PAGES.filter((p) => p.slug !== excludeSlug);
  const towns = TOWN_PAGES.filter((p) => p.slug !== excludeSlug);
  return (
    <section className="border-t border-outline-variant/30 bg-surface-container-low py-section-gap">
      <div className="container mx-auto grid gap-12 px-margin-mobile md:grid-cols-2 md:px-margin-desktop">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Our junk removal services</h2>
          <ul className="mt-6">
            {services.map((p) => (
              <li key={p.slug}>
                <a href={p.path} className={linkCls}>
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Towns we serve</h2>
          <ul className="mt-6">
            {towns.map((p) => (
              <li key={p.slug}>
                <a href={p.path} className={linkCls}>
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container mx-auto mt-12 px-margin-mobile md:px-margin-desktop">
        <h3 className="text-xl font-bold text-primary">Rockford neighborhoods we serve</h3>
        <p className="mt-2 max-w-2xl text-on-surface-variant">
          Every neighborhood, every ZIP code across the city — if you&apos;re in Rockford, we&apos;re
          already nearby.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {ROCKFORD_NEIGHBORHOODS.map((n) => (
            <li key={n} className={chipCls}>
              {n}
            </li>
          ))}
        </ul>
        <h3 className="mt-8 text-xl font-bold text-primary">Rockford ZIP codes</h3>
        <ul className="mt-5 flex flex-wrap gap-2">
          {ROCKFORD_ZIPS.map((z) => (
            <li key={z} className={chipCls}>
              {z}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-on-surface-variant">
          Don&apos;t see your town?{" "}
          <a href="tel:+17797721857" className="font-bold text-secondary underline-offset-4 hover:underline">
            Call us
          </a>{" "}
          — if it&apos;s around Rockford, we can usually help.
        </p>

        {/* Real OpenStreetMap tiles with pins at geocoded town centers —
            built at deploy time, so the map loads as a plain image. */}
        <figure className="mt-10" data-aos="fade-up">
          <SiteImage
            src="/images/service-area-map.jpg"
            alt="Map of Rockford, Illinois and surrounding towns served by FirstStep Junk Removal: Rockford, Loves Park, Machesney Park, Belvidere, Cherry Valley, Roscoe, and Rockton"
            width={1024}
            height={768}
            className="w-full rounded-2xl border border-outline-variant/30 shadow-sm"
          />
          <figcaption className="mt-3 text-sm text-on-surface-variant">
            Where we work — Rockford and the surrounding towns, from Rockton to Belvidere.{" "}
            <a
              href={BUSINESS.google.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-secondary underline-offset-4 hover:underline"
            >
              Open in Google Maps
            </a>
            {" · "}Map © OpenStreetMap contributors.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
