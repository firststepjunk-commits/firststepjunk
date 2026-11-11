import { FAQ_ITEMS, PRICE_SUMMARY, MATTRESS_NOTE } from "@/lib/seo";

/**
 * Town landing pages (indexable, in the sitemap). They share the
 * ServiceLanding template and the JSON-LD builder in service-pages.js.
 * `where` is a short, factual description of the town relative to Rockford.
 */
const TOWNS = [
  { slug: "loves-park", name: "Loves Park", county: "Winnebago County", where: "just north of Rockford", image: "/images/hero-trailer.jpg" },
  { slug: "machesney-park", name: "Machesney Park", county: "Winnebago County", where: "north of Rockford", image: "/images/crew-at-job-site.jpg" },
  { slug: "belvidere", name: "Belvidere", county: "Boone County", where: "east of Rockford", image: "/images/team-lifting-box.jpg" },
  { slug: "roscoe", name: "Roscoe", county: "Winnebago County", where: "north of Rockford", image: "/images/crew-member-lifting.jpg" },
  { slug: "rockton", name: "Rockton", county: "Winnebago County", where: "north of Rockford", image: "/images/crew-loading-logs.jpg" },
  { slug: "cherry-valley", name: "Cherry Valley", county: "Winnebago County", where: "east of Rockford", image: "/images/hero-cleanup-after.jpg" },
];

function buildTown(t) {
  const area = `${t.name}, IL`;
  const path = `/junk-removal-${t.slug}`;
  return {
    slug: `junk-removal-${t.slug}`,
    path,
    title: `Junk Removal in ${area}`,
    metaTitle: `Junk Removal ${t.name} IL | From $90 | First Step Junk`,
    metaDescription: `Junk removal in ${area} from $90. Full loads are a $425 flat rate with dump fees included. Licensed & fully insured. Call (779) 772-1857.`,
    h1: `Junk Removal in ${area}`,
    answerFirst: `FirstStep Junk Removal LLC provides junk removal in ${area} for homes and businesses. ${PRICE_SUMMARY} We're based in Rockford and serve ${t.name} in ${t.county}. Open daily 7:30 AM–7:30 PM. Call or text (779) 772-1857.`,
    intro: `${t.name} is ${t.where}, and our crew serves it every day. Furniture, appliances, garage and basement cleanouts, yard debris, and shed demolition — we load it and haul it away.`,
    bullets: [
      `Junk removal, furniture and appliance hauling in ${t.name}`,
      "Garage, basement, and estate cleanouts",
      "Shed demolition — $725 flat for a standard empty wood 10×12",
      "Flat rates from $90 — a full load is $425, dump fees included",
      "Same-day pickup when the schedule allows",
    ],
    howItWorks: [
      "Call, text, or send photos through the quote form.",
      "We confirm your flat-rate price before we start.",
      `Our crew comes to your ${t.name} address and loads the trailer.`,
      "We haul it away and dispose of it responsibly.",
    ],
    relatedServices: [
      { name: "Curbside Pickup" },
      { name: "Couch Removal" },
      { name: "Dryer Removal" },
      { name: "Water Heater Removal" },
    ],
    faqs: [
      {
        question: `How much does junk removal cost in ${area}?`,
        answer: `${PRICE_SUMMARY} Small loads run $90–$125, 1/4 load $150, 1/2 load $250, and 3/4 load $350. ${MATTRESS_NOTE} Call or text (779) 772-1857 or send a photo to confirm your price before we start.`,
      },
      {
        question: `Do you offer junk removal in ${t.name}?`,
        answer: `Yes. FirstStep Junk Removal LLC is based in Rockford and serves ${t.name} and the surrounding area. Call or text (779) 772-1857 and we'll confirm availability for your address.`,
      },
      {
        question: `Can you pick up junk in ${t.name} the same day?`,
        answer: `Often, yes — same-day pickup is available when the schedule allows. We're open every day 7:30 AM–7:30 PM. Call (779) 772-1857 to check openings.`,
      },
      FAQ_ITEMS.find((f) => f.question.includes("not take")),
    ].filter(Boolean),
    image: t.image,
    serviceName: `Junk removal in ${area}`,
    areaServed: [area, "Rockford, IL"],
  };
}

export const TOWN_PAGES = TOWNS.map(buildTown);

export function getTownPage(slug) {
  return TOWN_PAGES.find((p) => p.slug === slug) || null;
}
