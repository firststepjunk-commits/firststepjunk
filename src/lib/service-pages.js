import {
  BUSINESS,
  SITE_URL,
  FAQ_ITEMS,
  PRICE_SUMMARY,
  PRICING_INCLUDES,
  MATTRESS_NOTE,
} from "@/lib/seo";

/** Shared cost FAQ so every page quotes the same owner-set rates. */
const costFaq = (question, lead) => ({
  question,
  answer: `${lead} ${PRICE_SUMMARY} Small loads run $75–$125, 1/4 load $150, 1/2 load $250, and 3/4 load $350. ${MATTRESS_NOTE} Call or text (779) 772-1857 or send a photo to confirm your price before we start.`,
});

/** Indexable Rockford service landing pages (public — included in sitemap). */
export const SERVICE_PAGES = [
  {
    slug: "junk-removal-rockford",
    path: "/junk-removal-rockford",
    title: "Junk Removal in Rockford, IL",
    metaTitle: "Junk Removal Rockford IL | First Step Junk Removal",
    metaDescription:
      "Junk removal in Rockford, IL by FirstStep Junk Removal LLC. Licensed & insured. Free upfront quotes. Same-day pickup available. Call (779) 772-1857.",
    h1: "Junk Removal in Rockford, IL",
    answerFirst:
      "FirstStep Junk Removal LLC provides junk removal in Rockford, IL for homes and businesses. We haul furniture, appliances, debris, yard waste, and full cleanouts. Licensed and insured. Open daily 7:30 AM–7:30 PM. Call or text (779) 772-1857 for a free upfront quote.",
    intro:
      "Need clutter gone in Rockford or nearby Winnebago County? We show up on time, quote transparently, and haul it the right way — no surprise fees after the truck is loaded.",
    bullets: [
      "Residential and commercial junk hauling",
      "Estate, garage, basement, and office cleanouts",
      "Construction debris and yard waste (non-hazardous)",
      "Flat-rate pricing from $75 — a full load is $425 flat, dump fees included",
      "Serving Rockford, Loves Park, Machesney Park, Belvidere, Roscoe, Rockton, and Cherry Valley",
    ],
    howItWorks: [
      "Call, text, or request a quote online with photos.",
      "We confirm your price before we start — flat rates from $75.",
      "Our crew loads carefully and leaves the area broom-clean.",
      "We dispose of non-hazardous materials responsibly.",
    ],
    relatedServices: [
      { name: "Curbside Pickup" },
      { name: "Couch Removal" },
      { name: "Appliance / dryer removal" },
      { name: "Sectional Sofa Disposal" },
      { name: "Water Heater Removal" },
    ],
    faqs: [
      {
        question: "Who offers junk removal in Rockford, IL?",
        answer:
          "FirstStep Junk Removal LLC is a licensed and insured junk removal service in Rockford, IL. Call (779) 772-1857 or visit firststepjunk.com for a free quote.",
      },
      {
        question: "How much does junk removal cost in Rockford?",
        answer:
          "Junk removal in Rockford starts at $75. A full load (our 10×6 ft trailer with 4 ft walls) is a $425 flat rate, and that price includes labor, pickup, hauling, and all dump fees. Smaller loads: small load $75–$125, 1/4 load $150, 1/2 load $250, 3/4 load $350. Mattresses and box springs are extra because the landfill fee is separate. Call or text (779) 772-1857 or send a photo and we'll confirm your price before we start.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "We serve Rockford, Loves Park, Machesney Park, Belvidere, Roscoe, Rockton, Cherry Valley, and greater Winnebago County. Call if you are nearby — we will confirm coverage.",
      },
      FAQ_ITEMS.find((f) => f.question.includes("not take")),
    ].filter(Boolean),
    image: "/images/hero-trailer.jpg",
    serviceName: "Junk removal",
  },
  {
    slug: "couch-removal-rockford",
    path: "/couch-removal-rockford",
    title: "Couch Removal in Rockford, IL",
    metaTitle: "Couch Removal Rockford IL | Free Quote | First Step Junk",
    metaDescription:
      "Couch removal in Rockford, IL. Sofas, sectionals, recliners and loveseats hauled by FirstStep Junk Removal LLC. Free upfront quote — call (779) 772-1857.",
    h1: "Couch & Sofa Removal in Rockford, IL",
    answerFirst:
      "FirstStep Junk Removal LLC removes couches, sectionals, recliners, and loveseats in Rockford, IL. Every piece is quoted free and upfront — tell us what you have and we'll give you the price before we lift anything. We protect doorways, navigate stairs, and haul same-day when the schedule allows. Call (779) 772-1857.",
    intro:
      "Old sofa taking up the garage or blocking a room flip? We remove couches, sectionals, recliners, and loveseats across Rockford without the dump-run headache.",
    bullets: [
      "Couch, sofa, and loveseat removal",
      "Sectional sofa disposal",
      "Recliner chair removal",
      "We navigate stairs and tight doorways with care",
      "Free upfront price before we load — starting at $75",
    ],
    howItWorks: [
      "Send a photo or describe the couch (stairs? sectional?).",
      "We quote it free — including oversized and sectional pieces.",
      "Crew arrives in the scheduled window and protects floors/walls.",
      "Sofa is gone — no dump trip for you.",
    ],
    relatedServices: [
      { name: "Recliner Chair Removal" },
      { name: "Couch Removal" },
      { name: "Sectional Sofa Disposal" },
      { name: "Boxspring Removal" },
    ],
    faqs: [
      {
        question: "How much is couch removal in Rockford, IL?",
        answer:
          "Couch removal in Rockford is priced by how much of our trailer it takes up, starting at $75: small load $75–$125, 1/4 load $150, 1/2 load $250, 3/4 load $350, and a full load is a $425 flat rate with all dump fees included. A single couch or loveseat is usually a small load; a sectional takes more room. Send a photo through the quote form or call (779) 772-1857 and we'll confirm the price before we lift anything.",
      },
      {
        question: "Do you remove sectionals and sleeper sofas?",
        answer:
          "Yes. Sectionals, sleeper sofas, recliners, and oversized pieces are all handled — send a photo and we'll quote it. Call or text (779) 772-1857.",
      },
      {
        question: "Will you carry a couch down stairs?",
        answer:
          "Yes. Our crew is trained for heavy-load navigation. We use spotters and protective padding to reduce risk of wall or doorframe damage.",
      },
      {
        question: "Can you haul the couch the same day?",
        answer:
          "Same-day furniture pickup is often available in Rockford when the schedule allows. We are open every day 7:30 AM–7:30 PM. Call to check today’s openings.",
      },
    ],
    image: "/images/team-lifting-box.jpg",
    serviceName: "Couch removal",
  },
  {
    slug: "same-day-junk-pickup-rockford",
    path: "/same-day-junk-pickup-rockford",
    title: "Same-Day Junk Pickup in Rockford, IL",
    metaTitle: "Same-Day Junk Pickup Rockford IL | First Step Junk",
    metaDescription:
      "Same-day junk pickup in Rockford, IL when schedule allows. Open daily 7:30 AM–7:30 PM. FirstStep Junk Removal LLC — call (779) 772-1857.",
    h1: "Same-Day Junk Pickup in Rockford, IL",
    answerFirst:
      "First Step Junk Removal offers same-day junk pickup in Rockford, IL and nearby towns when the schedule allows. We are open Monday–Sunday 7:30 AM–7:30 PM. Call or text (779) 772-1857 for today’s availability and an upfront quote.",
    intro:
      "Landlord turnover, move-out deadline, or a couch that has to go today? We prioritize fast response windows and text when we are 15 minutes out.",
    bullets: [
      "Same-day pickup when openings remain on the board",
      "Open every day 7:30 AM–7:30 PM (America/Chicago)",
      "Photo quotes speed up pricing — rates start at $75",
      "Single items or full loads",
      "Licensed, insured, locally owned",
    ],
    howItWorks: [
      "Call or text (779) 772-1857 as early as you can.",
      "Tell us what needs to go and your address / stairs.",
      "We confirm if same-day is open and lock your flat-rate price.",
      "Crew arrives in the window and clears the junk.",
    ],
    relatedServices: [
      { name: "Curbside Pickup" },
      { name: "Couch Removal" },
      { name: "TV Removal & Electronics Recycling" },
      { name: "Piano Removal" },
    ],
    faqs: [
      {
        question: "Do you offer same-day junk pickup in Rockford?",
        answer:
          "Yes. First Step Junk Removal offers same-day junk pickup in Rockford, IL when schedule allows. Open daily 7:30 AM–7:30 PM. Call (779) 772-1857 to check availability.",
      },
      {
        question: "How fast can you arrive?",
        answer:
          "When same-day is available, we schedule an arrival window and text when we are about 15 minutes away. Exact timing depends on the day’s route.",
      },
      {
        question: "What if same-day is full?",
        answer:
          "We will book the next earliest slot — often next-day. You still get upfront pricing before we haul.",
      },
      {
        question: "Is same-day more expensive?",
        answer:
          "No — we do not add a rush charge for same-day pickup when a slot is open. Same-day jobs use the same flat rates as any other day, starting at $75, with a full load at $425 flat and all dump fees included.",
      },
    ],
    image: "/images/crew-at-job-site.jpg",
    serviceName: "Same-day junk pickup",
  },

  {
    slug: "furniture-removal-rockford",
    path: "/furniture-removal-rockford",
    title: "Furniture Removal in Rockford, IL",
    metaTitle: "Furniture Removal Rockford IL | From $75 | First Step Junk",
    metaDescription:
      "Furniture removal in Rockford, IL from $75. Couches, mattresses, tables, dressers and more hauled away. Dump fees included. Call (779) 772-1857.",
    h1: "Furniture Removal in Rockford, IL",
    answerFirst:
      "FirstStep Junk Removal LLC removes old furniture in Rockford, IL — couches, chairs, tables, dressers, bed frames, desks, and more. Furniture removal starts at $75, and a full trailer load is a $425 flat rate that includes labor, pickup, hauling, and all dump fees. Open daily 7:30 AM–7:30 PM. Call or text (779) 772-1857.",
    intro:
      "Replacing a bedroom set, clearing a rental, or finally getting that old dresser out of the basement? We do the lifting, carry it out, and haul it away — you don't need a truck or a dump run.",
    bullets: [
      "Couches, sectionals, recliners, and loveseats",
      "Dressers, tables, desks, bookcases, and bed frames",
      "Mattresses and box springs (extra — landfill fee is separate)",
      "We carry from inside the home, basement, or garage",
      "Flat rates from $75 — a full load is $425, dump fees included",
    ],
    howItWorks: [
      "Call, text, or send a photo of the furniture through the quote form.",
      "We confirm your price based on how much of the trailer it fills.",
      "Our crew carries it out and loads the trailer, protecting floors and doorways.",
      "We haul it away and handle disposal — nothing left for you to do.",
    ],
    relatedServices: [
      { name: "Couch Removal" },
      { name: "Sectional Sofa Disposal" },
      { name: "Recliner Chair Removal" },
      { name: "Boxspring Removal" },
    ],
    faqs: [
      costFaq("How much does furniture removal cost in Rockford?", "Furniture removal is priced by how much space it takes in our 10×6 ft trailer."),
      {
        question: "Do you take mattresses and box springs?",
        answer:
          "Yes. Mattresses and box springs are extra because the landfill charges a separate fee. Tell us how many you have when you call or text (779) 772-1857 and we'll include it in your price.",
      },
      {
        question: "Will you carry furniture out of my basement or upstairs room?",
        answer:
          "Yes. Our crew carries furniture out from inside the home, including stairs. Let us know about stairs or tight doorways when you request your quote.",
      },
      {
        question: "Can you remove furniture the same day?",
        answer:
          "Often, yes — same-day pickup is available in Rockford when the schedule allows. We're open every day 7:30 AM–7:30 PM, so call early to check openings.",
      },
    ],
    image: "/images/team-lifting-box.jpg",
    serviceName: "Furniture removal",
  },
  {
    slug: "appliance-removal-rockford",
    path: "/appliance-removal-rockford",
    title: "Appliance Removal in Rockford, IL",
    metaTitle: "Appliance Removal Rockford IL | From $75 | First Step Junk",
    metaDescription:
      "Appliance removal in Rockford, IL from $75. Washers, dryers, dishwashers, water heaters and more hauled away, dump fees included. Call (779) 772-1857.",
    h1: "Appliance Removal in Rockford, IL",
    answerFirst:
      "FirstStep Junk Removal LLC hauls away old appliances in Rockford, IL — washers, dryers, dishwashers, water heaters, and other household appliances. Removal starts at $75, and every rate includes labor, pickup, hauling, and all dump fees. Call or text (779) 772-1857 for a quote.",
    intro:
      "A dead dryer or a retired dishwasher is heavy, awkward, and hard to get to the dump yourself. We disconnect-ready units out, load them, and take them away.",
    bullets: [
      "Dryer and washer removal",
      "Dishwasher removal",
      "Water heater removal",
      "TV removal and electronics recycling",
      "Flat rates from $75, dump fees included",
    ],
    howItWorks: [
      "Tell us which appliances you have and where they are (basement, garage, upstairs).",
      "We confirm your price by load size before we start.",
      "Our crew moves the appliance out and loads the trailer.",
      "We haul it away — no dump run, no lifting for you.",
    ],
    relatedServices: [
      { name: "Dryer Removal" },
      { name: "Dishwasher Removal" },
      { name: "Water Heater Removal" },
      { name: "TV Removal & Electronics Recycling" },
    ],
    faqs: [
      costFaq("How much does appliance removal cost in Rockford?", "Appliance removal is priced by how much of our trailer it fills, not per appliance."),
      {
        question: "Do you haul water heaters, dryers, and dishwashers?",
        answer:
          "Yes. We haul water heaters, dryers, washers, dishwashers, and similar household appliances. If you're unsure about a specific appliance, call or text (779) 772-1857 and we'll tell you.",
      },
      {
        question: "Do I need to disconnect the appliance first?",
        answer:
          "It helps if the appliance is disconnected and ready to move. If you're not sure how, tell us when you request your quote and we'll let you know what to expect.",
      },
      FAQ_ITEMS.find((f) => f.question.includes("not take")),
    ].filter(Boolean),
    image: "/images/crew-member-lifting.jpg",
    serviceName: "Appliance removal",
  },
  {
    slug: "estate-cleanout-rockford",
    path: "/estate-cleanout-rockford",
    title: "Estate Cleanout in Rockford, IL",
    metaTitle: "Estate Cleanout Rockford IL | Flat Rates | First Step Junk",
    metaDescription:
      "Estate cleanout in Rockford, IL. Full loads are a $425 flat rate with dump fees included. Licensed & fully insured. Call (779) 772-1857.",
    h1: "Estate Cleanout in Rockford, IL",
    answerFirst:
      "FirstStep Junk Removal LLC handles estate cleanouts in Rockford, IL — clearing a home after a loss, a move, or a sale so the property is ready. Each full trailer load is a $425 flat rate that includes labor, pickup, hauling, and all dump fees, so you can see the cost as the job progresses. Licensed & fully insured. Call (779) 772-1857.",
    intro:
      "Clearing a home is hard enough without worrying about the hauling. We do the heavy lifting and the dump runs so you can focus on what matters.",
    bullets: [
      "Whole-house, single-room, and attic or basement cleanouts",
      "Furniture, appliances, boxes, and household items hauled away",
      "Larger jobs are hauled in multiple loads at our flat rates",
      "Licensed & fully insured, locally owned",
      "Open daily 7:30 AM–7:30 PM",
    ],
    howItWorks: [
      "Call or text (779) 772-1857, or send photos of the rooms that need to be cleared.",
      "We estimate how many loads the job will take and confirm pricing.",
      "Our crew carries everything out and loads the trailer.",
      "We haul it away and leave the space broom-clean.",
    ],
    relatedServices: [
      { name: "Couch Removal" },
      { name: "Boxspring Removal" },
      { name: "Dryer Removal" },
      { name: "Piano Removal" },
    ],
    faqs: [
      costFaq("How much does an estate cleanout cost in Rockford?", "Estate cleanouts are priced by the number of trailer loads."),
      {
        question: "How many loads does a typical house take?",
        answer:
          "It varies a lot with the size of the home and how full it is. Send photos or call (779) 772-1857 and we'll estimate the number of loads before we begin.",
      },
      {
        question: "Can you clear just one part of the house?",
        answer:
          "Yes. We can clear a single room, the basement, the attic, or the whole house — you only pay for the load size you use.",
      },
      FAQ_ITEMS.find((f) => f.question.includes("not take")),
    ].filter(Boolean),
    image: "/images/crew-at-job-site.jpg",
    serviceName: "Estate cleanout",
  },
  {
    slug: "garage-basement-cleanout-rockford",
    path: "/garage-basement-cleanout-rockford",
    title: "Garage & Basement Cleanout in Rockford, IL",
    metaTitle: "Garage & Basement Cleanout Rockford IL | From $75",
    metaDescription:
      "Garage and basement cleanout in Rockford, IL from $75. Full loads are a $425 flat rate, dump fees included. Call (779) 772-1857.",
    h1: "Garage & Basement Cleanout in Rockford, IL",
    answerFirst:
      "FirstStep Junk Removal LLC clears garages, basements, attics, and storage spaces in Rockford, IL. Cleanouts start at $75, and a full trailer load is a $425 flat rate that includes labor, pickup, hauling, and all dump fees. Call or text (779) 772-1857.",
    intro:
      "Get your parking spot, your workshop, or your basement back. We carry out the clutter, load it, and haul it away.",
    bullets: [
      "Garage cleanouts and storage-space clear-outs",
      "Basement and attic cleanouts",
      "Old furniture, boxes, appliances, and household junk",
      "Pay by load size — from $75 up to a $425 flat full load",
      "Dump fees included in every rate",
    ],
    howItWorks: [
      "Send a photo of the space or call (779) 772-1857.",
      "We confirm your price based on how much of the trailer it will fill.",
      "Our crew carries everything out and loads the trailer.",
      "We haul it away and leave the space clear.",
    ],
    relatedServices: [
      { name: "Curbside Pickup" },
      { name: "Dryer Removal" },
      { name: "Water Heater Removal" },
      { name: "TV Removal & Electronics Recycling" },
    ],
    faqs: [
      costFaq("How much does a garage or basement cleanout cost in Rockford?", "Garage and basement cleanouts are priced by how much of our trailer your items fill."),
      {
        question: "Do I need to be home while you work?",
        answer:
          "Someone should be available to show us what's going and give access to the space. Call or text (779) 772-1857 and we'll work out the details with you.",
      },
      {
        question: "Can you clear a basement with stairs?",
        answer:
          "Yes. We carry items up from basements. Mention stairs when you request your quote so we can plan the job.",
      },
      FAQ_ITEMS.find((f) => f.question.includes("not take")),
    ].filter(Boolean),
    image: "/images/hero-cleanup-before.jpg",
    serviceName: "Garage and basement cleanout",
  },
  {
    slug: "shed-demolition-rockford",
    path: "/shed-demolition-rockford",
    title: "Shed Demolition in Rockford, IL",
    metaTitle: "Shed Demolition Rockford IL | $725 Flat | First Step Junk",
    metaDescription:
      "Shed demolition and removal in Rockford, IL — $725 flat for a standard empty wood 10x12 shed, hauling and disposal included. Call (779) 772-1857.",
    h1: "Shed Demolition & Removal in Rockford, IL",
    answerFirst:
      "FirstStep Junk Removal LLC demolishes and removes sheds in Rockford, IL. A standard empty wood 10×12 shed is a $725 flat rate that covers demolition, hauling, and disposal. A concrete slab is quoted separately. Call or text (779) 772-1857.",
    intro:
      "That old shed is leaning, rotting, or just in the way. We take it down, haul every piece away, and dispose of it so you can reclaim the space.",
    bullets: [
      "$725 flat for a standard empty wood 10×12 shed",
      "Demolition, hauling, and disposal all included",
      "Concrete slab removal quoted separately",
      "Other sizes or materials quoted after you send photos",
      "Licensed & fully insured",
    ],
    howItWorks: [
      "Send photos of the shed (size, material, condition) or call (779) 772-1857.",
      "We confirm the price. A standard empty wood 10×12 is $725 flat.",
      "Our crew takes the shed down and loads the debris.",
      "We haul it away and dispose of it.",
    ],
    relatedServices: [
      { name: "Curbside Pickup" },
      { name: "Water Heater Removal" },
      { name: "Dryer Removal" },
    ],
    faqs: [
      {
        question: "How much does shed demolition cost in Rockford?",
        answer:
          "A standard empty wood 10×12 shed is a $725 flat rate. That covers demolition, hauling, and disposal. A concrete slab is quoted separately. For other sizes or materials, send photos or call (779) 772-1857 and we'll quote it.",
      },
      {
        question: "Does the shed need to be empty?",
        answer:
          "Yes — the $725 flat rate is for an empty shed. If it has contents, we can haul those separately at our load-size rates, which start at $75.",
      },
      {
        question: "Do you remove the concrete slab too?",
        answer:
          "A concrete slab is quoted separately from the shed. Mention it when you request your quote.",
      },
      FAQ_ITEMS.find((f) => f.question.includes("not take")),
    ].filter(Boolean),
    image: "/images/unloading-lumber.jpg",
    serviceName: "Shed demolition",
    offerPrice: 725,
  },
  {
    slug: "curbside-pickup-rockford",
    path: "/curbside-pickup-rockford",
    title: "Curbside Junk Pickup in Rockford, IL",
    metaTitle: "Curbside Junk Pickup Rockford IL | From $75 | First Step",
    metaDescription:
      "Curbside junk pickup in Rockford, IL from $75. Set it at the curb and we load and haul it away, dump fees included. Call (779) 772-1857.",
    h1: "Curbside Junk Pickup in Rockford, IL",
    answerFirst:
      "FirstStep Junk Removal LLC offers curbside junk pickup in Rockford, IL. Set your items at the curb or by the driveway and we load and haul them away. Pickup starts at $75, and every rate includes labor, hauling, and all dump fees. Call or text (779) 772-1857.",
    intro:
      "Already moved it outside? We'll come load it. Curbside pickup is the quickest, simplest way to clear items out of your yard or driveway.",
    bullets: [
      "Items at the curb, driveway, or yard — we load them",
      "Furniture, appliances, bags, boxes, and debris",
      "Same-day pickup when the schedule allows",
      "Flat rates from $75, dump fees included",
      "Open daily 7:30 AM–7:30 PM",
    ],
    howItWorks: [
      "Call or text (779) 772-1857 with a photo of what's at the curb.",
      "We confirm the price based on how much of the trailer it fills.",
      "We arrive in the scheduled window and load everything.",
      "We haul it away and dispose of it.",
    ],
    relatedServices: [
      { name: "Curbside Pickup" },
      { name: "Couch Removal" },
      { name: "TV Removal & Electronics Recycling" },
      { name: "Boxspring Removal" },
    ],
    faqs: [
      costFaq("How much does curbside pickup cost in Rockford?", "Curbside pickup is priced by how much of our trailer your items fill."),
      {
        question: "Can you pick up the same day?",
        answer:
          "Often, yes. Same-day curbside pickup is available when the schedule allows. We're open daily 7:30 AM–7:30 PM — call (779) 772-1857 to check openings.",
      },
      {
        question: "Do I need to be home for curbside pickup?",
        answer:
          "Call or text (779) 772-1857 and we'll arrange the details, including timing and where to find the items.",
      },
      FAQ_ITEMS.find((f) => f.question.includes("not take")),
    ].filter(Boolean),
    image: "/images/hero-trailer.jpg",
    serviceName: "Curbside junk pickup",
  },
];

export function getServicePage(slug) {
  return SERVICE_PAGES.find((p) => p.slug === slug) || null;
}

export const OWNER = {
  name: "Michael",
  fullName: "Michael",
  jobTitle: "Owner",
  path: "/about",
  image: "/images/gallery/g09.webp",
  email: BUSINESS.email,
  telephone: BUSINESS.phone,
  description:
    "Michael is the owner of FirstStep Junk Removal LLC in Rockford, IL. He runs day-to-day junk removal operations, customer quotes, and on-site jobs — with a background in pest control and a focus on reliable, upfront-priced hauling for Rockford homeowners and businesses.",
  bioParagraphs: [
    "Michael owns and operates FirstStep Junk Removal LLC, a Rockford-based junk removal service built around one idea: show up when you say you will, quote honestly, and leave the property cleaner than you found it.",
    "He handles quotes, scheduling, and jobs on the ground — turning cluttered garages, move-outs, and single-item haul-aways into simple, stress-free cleanouts for Rockford and nearby towns.",
    "Outside the truck, Michael brings an entrepreneurial grind and practical experience from pest control work. That mix of field work and customer care shapes how the crew protects floors, doorframes, and driveways on every stop.",
    "First Step is locally owned, licensed, and insured. When you call (779) 772-1857, you are talking to a Rockford operator — not a call center.",
  ],
  sameAs: [BUSINESS.social.instagram, BUSINESS.social.facebook, BUSINESS.google.mapsUrl],
  // Bullet list on the /about page ("Why customers call ..."). Per-business copy.
  highlights: [
    "Local Rockford owner — not a franchise call center",
    "Licensed & insured junk removal for homes and businesses",
    "Upfront pricing; same-day when the schedule allows",
    "Field experience from hauling and pest-control work",
    "Open daily 7:30 AM–7:30 PM",
  ],
  // Person schema "knowsAbout" topics. Per-business copy.
  knowsAbout: [
    "Junk removal",
    "Debris hauling",
    "Estate cleanouts",
    "Rockford IL home services",
    "Pest control",
  ],
};

export function buildServicePageJsonLd(page) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE_URL}${page.path}#service`,
      name: page.serviceName,
      description: page.answerFirst,
      url: `${SITE_URL}${page.path}`,
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: (page.areaServed || BUSINESS.areaServed).map((name) => ({
        "@type": "City",
        name,
      })),
      image: `${SITE_URL}${page.image}`,
      ...(page.offerPrice
        ? {
            offers: {
              "@type": "Offer",
              price: String(page.offerPrice),
              priceCurrency: "USD",
            },
          }
        : {
            offers: {
              "@type": "AggregateOffer",
              lowPrice: "75",
              highPrice: "425",
              priceCurrency: "USD",
            },
          }),
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}${page.path}#localbusiness`,
      name: BUSINESS.legalName,
      url: `${SITE_URL}${page.path}`,
      image: `${SITE_URL}${page.image}`,
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      priceRange: BUSINESS.priceRange,
      parentOrganization: { "@id": `${SITE_URL}/#business` },
      address: {
        "@type": "PostalAddress",
        addressLocality: BUSINESS.address.addressLocality,
        addressRegion: BUSINESS.address.addressRegion,
        addressCountry: BUSINESS.address.addressCountry,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: BUSINESS.geo.latitude,
        longitude: BUSINESS.geo.longitude,
      },
      areaServed: (page.areaServed || BUSINESS.areaServed).map((name) => ({
        "@type": "City",
        name,
      })),
      openingHoursSpecification: BUSINESS.openingHours.days.map((day) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: day,
        opens: BUSINESS.openingHours.opens,
        closes: BUSINESS.openingHours.closes,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${SITE_URL}${page.path}#faq`,
      mainEntity: page.faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.title,
          item: `${SITE_URL}${page.path}`,
        },
      ],
    },
  ];
}

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/about#person`,
    name: OWNER.name,
    jobTitle: OWNER.jobTitle,
    description: OWNER.description,
    image: `${SITE_URL}${OWNER.image}`,
    url: `${SITE_URL}${OWNER.path}`,
    email: OWNER.email,
    telephone: OWNER.telephone,
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      addressCountry: "US",
    },
    sameAs: OWNER.sameAs,
    knowsAbout: OWNER.knowsAbout,
  };
}

export function buildAboutPageJsonLd() {
  return [
    buildPersonJsonLd(),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#webpage`,
      url: `${SITE_URL}/about`,
      name: `About ${OWNER.name} — ${BUSINESS.brandName}`,
      description: OWNER.description,
      mainEntity: { "@id": `${SITE_URL}/about#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `About ${OWNER.name}`,
          item: `${SITE_URL}/about`,
        },
      ],
    },
  ];
}
