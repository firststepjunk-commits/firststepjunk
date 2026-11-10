import { BUSINESS, SITE_URL, FAQ_ITEMS } from "@/lib/seo";

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
      "Upfront pricing — the quote is the price you pay",
      "Serving Rockford, Loves Park, Machesney Park, Belvidere, Roscoe, and Cherry Valley",
    ],
    howItWorks: [
      "Call, text, or request a quote online with photos.",
      "We confirm price before we start.",
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
          "Cost depends on the item, the load size, and how hard it is to reach. Every job is quoted individually and every quote is free — you get an upfront price before we haul, and that price is what you pay. Call or text (779) 772-1857 for an estimate.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "We serve Rockford, Loves Park, Machesney Park, Belvidere, Roscoe, Cherry Valley, and greater Winnebago County. Call if you are nearby — we will confirm coverage.",
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
      "Free upfront price before we load",
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
          "It depends on the piece and the access — a recliner on the curb is not the same job as a sectional down two flights of stairs. FirstStep Junk Removal LLC quotes every couch free and upfront, so you know the price before we touch it. Call or text (779) 772-1857, or send a photo through the quote form.",
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
      "Photo quotes speed up pricing",
      "Single items or full loads",
      "Licensed, insured, locally owned",
    ],
    howItWorks: [
      "Call or text (779) 772-1857 as early as you can.",
      "Tell us what needs to go and your address / stairs.",
      "We confirm if same-day is open and lock a price.",
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
          "No — we do not add a rush charge for same-day pickup when a slot is open. Every job is quoted the same way on what you have and how much of it there is, and we tell you the price before we start.",
      },
    ],
    image: "/images/crew-at-job-site.jpg",
    serviceName: "Same-day junk pickup",
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
      areaServed: BUSINESS.areaServed.map((name) => ({
        "@type": "City",
        name,
      })),
      image: `${SITE_URL}${page.image}`,
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
