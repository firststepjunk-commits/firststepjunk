/** Business identity aligned with Google Business Profile (FirstStep Junk Removal LLC). */
export const SITE_URL = "https://firststepjunk.com";

export const BUSINESS = {
  legalName: "FirstStep Junk Removal LLC",
  brandName: "First Step Junk Removal",
  /** Short conversational name used in email subjects / casual copy. */
  shortName: "First Step Junk",
  /** Owner's first name (about page, CRM links). */
  owner: "Michael",
  /** Lowercase primary service phrase used in sentences ("… interested in X"). */
  primaryService: "junk removal",
  /** One-liner used in CRM reply email drafts. */
  crmReplyLine:
    "We'd love to help you take the first step toward a cleaner space, and we'll be in touch shortly to get you a quote.",
  alternateName: ["FirstStep Junk Removal", "First Step Junk Removal LLC"],
  description:
    "FirstStep Junk Removal provides professional junk removal, debris removal, dumpster rental, waste management, and garbage collection services in Rockford, IL. We help homeowners, businesses, property managers, contractors, and real estate professionals with the removal of unwanted items, construction debris, yard waste, household junk, office cleanouts, and other non-hazardous materials. Our team works to keep properties clean, organized, and ready for use through dependable waste disposal and cleanup solutions. Whether you need a single-item pickup, a full property cleanout, ongoing waste management support, or a dumpster rental for a project, FirstStep Junk Removal serves customers in Rockford, IL and nearby areas.",
  shortDescription:
    "Professional junk removal, debris removal, dumpster rental, and waste management in Rockford, IL. Licensed & insured. Same-day pickup available. Call (779) 772-1857.",
  category: "Junk removal service",
  phone: "+17797721857",
  phoneDisplay: "(779) 772-1857",
  email: "firststep.junk@gmail.com",
  priceRange: "$90-$425",
  areaServed: [
    "Rockford, IL",
    "Loves Park, IL",
    "Machesney Park, IL",
    "Belvidere, IL",
    "Roscoe, IL",
    "Rockton, IL",
    "Cherry Valley, IL",
    "Winnebago County, IL",
  ],
  address: {
    addressLocality: "Rockford",
    addressRegion: "IL",
    addressCountry: "US",
  },
  geo: {
    // Approximate Rockford, IL centroid for local SEO / Maps alignment
    latitude: 42.2711,
    longitude: -89.094,
  },
  openingHours: {
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "07:30",
    closes: "19:30",
  },
  social: {
    instagram: "https://www.instagram.com/firststep_junkremoval/",
    facebook: "https://www.facebook.com/profile.php?id=61589040134967",
  },
  google: {
    knowledgeGraphId: "/g/11nqc0h48d",
    mapsCid: "0xc09e203e15b1f205",
    mapsUrl:
      "https://www.google.com/maps/place/FirstStep+Junk+Removal+LLC/@42.2711,-89.0940,15z/data=!4m2!3m1!1s0x0:0xc09e203e15b1f205",
    ratingValue: 5,
    reviewCount: 14,
  },
  /**
   * Label shown next to each item in the "what we haul" list. Pricing is by
   * load size (see PRICE_TIERS below), so every item is covered by the tiers.
   */
  quoteLabel: "Priced by load · from $90",
  offers: [
    { name: "Curbside Pickup" },
    { name: "Recliner Chair Removal" },
    { name: "Boxspring Removal" },
    { name: "Couch Removal" },
    { name: "Dryer Removal" },
    { name: "Dishwasher Removal" },
    { name: "Sectional Sofa Disposal" },
    { name: "TV Removal & Electronics Recycling" },
    { name: "Piano Removal" },
    { name: "Water Heater Removal" },
  ],
  serviceTypes: [
    "Junk removal",
    "Debris removal",
    "Dumpster rental",
    "Waste management",
    "Furniture removal",
    "Appliance removal",
    "Estate cleanouts",
    "Construction debris hauling",
    "Yard waste removal",
    "Office cleanouts",
    "Shed demolition",
  ],
  keywords: [
    "junk removal Rockford IL",
    "junk hauling Rockford",
    "debris removal Rockford",
    "dumpster rental Rockford IL",
    "furniture removal Rockford",
    "same-day junk pickup Rockford",
    "appliance removal Rockford",
    "estate cleanout Rockford",
    "construction debris removal Rockford",
    "shed demolition Rockford IL",
    "curbside junk pickup Rockford",
    "garage cleanout Rockford IL",
    "junk removal Loves Park IL",
    "junk removal Machesney Park IL",
    "junk removal Belvidere IL",
    "junk removal Roscoe IL",
    "junk removal Rockton IL",
    "junk removal Cherry Valley IL",
    "FirstStep Junk Removal",
  ],
};

/**
 * Owner-set rates (single source of truth — used on the homepage, every
 * service/town page, JSON-LD, and llms files). Change prices here only.
 * All rates include labor, pickup, hauling, and all dump fees.
 */
export const PRICE_TIERS = [
  { name: "Small load", price: "$90–$125", min: 90, max: 125, detail: "A few items or bags" },
  { name: "1/4 load", price: "$150", amount: 150, detail: "About a quarter of our trailer" },
  { name: "1/2 load", price: "$250", amount: 250, detail: "About half of our trailer" },
  { name: "3/4 load", price: "$350", amount: 350, detail: "About three-quarters of our trailer" },
  { name: "Full load", price: "$425", amount: 425, detail: "Flat rate for the full 10×6 ft trailer with 4 ft walls" },
];

export const SHED_DEMO = {
  name: "Shed demolition",
  price: "$725",
  amount: 725,
  detail:
    "Flat rate for a standard empty wood 10×12 shed — demolition, hauling, and disposal. A concrete slab is quoted separately.",
};

export const PRICING_INCLUDES =
  "Every rate includes labor, pickup, hauling, and all dump fees.";
export const MATTRESS_NOTE =
  "Mattresses and box springs are extra — the landfill fee is separate.";
export const PRICE_SUMMARY =
  "Junk removal starts at $90, and a full load is a $425 flat rate that includes labor, pickup, hauling, and all dump fees.";

/** "Rockford, IL" — derived once; use for labels instead of hardcoding. */
export const CITY_STATE = `${BUSINESS.address.addressLocality}, ${BUSINESS.address.addressRegion}`;

/** Must match visible FAQ copy on the homepage (FAQPage schema rule). */
export const FAQ_ITEMS = [
  {
    question: "How much does junk removal cost in Rockford, IL?",
    answer:
      "Junk removal in Rockford starts at $90. Pricing is by how much of our 10×6 ft trailer your junk fills: small load $90–$125, 1/4 load $150, 1/2 load $250, 3/4 load $350, and a full load is a $425 flat rate. Every rate includes labor, pickup, hauling, and all dump fees. Mattresses and box springs are extra because the landfill fee is separate. Call or text (779) 772-1857, or send photos through the quote form, to confirm your price before we start.",
  },
  {
    question: "Do you offer same-day junk pickup in Rockford?",
    answer:
      "Yes. First Step Junk Removal offers same-day junk pickup in Rockford, IL and nearby areas when schedule allows. We are open every day from 7:30 AM to 7:30 PM. Call or text (779) 772-1857 to check availability.",
  },
  {
    question: "What areas do you serve near Rockford?",
    answer:
      "We serve Rockford, Loves Park, Machesney Park, Belvidere, Roscoe, Rockton, Cherry Valley, and the greater Winnebago County area. If you are nearby and unsure, call (779) 772-1857 — we will confirm coverage quickly.",
  },
  {
    question: "What items will junk removal services not take?",
    answer:
      "We remove household junk, furniture, appliances, electronics, yard waste, construction debris, and other non-hazardous materials. We do not take regulated hazardous waste such as chemicals, paints, oils, asbestos, or medical waste. Ask us if you are unsure about a specific item.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. FirstStep Junk Removal LLC is licensed and fully insured for residential and commercial work in Rockford, IL. We protect your property with careful handling and provide peace of mind on every job.",
  },
  {
    question: "How do I get a free junk removal quote?",
    answer:
      "Request a free quote on firststepjunk.com, or call/text (779) 772-1857. Photos of your junk help us price faster. We give transparent, no-obligation estimates, and our flat load rates include all dump fees.",
  },
];

/** Offers with real prices for each load-size tier and shed demolition. */
export function buildTierOffers() {
  const mk = (name, priceFields, description) => ({
    "@type": "Offer",
    name,
    description,
    priceCurrency: "USD",
    ...priceFields,
    availability: "https://schema.org/InStock",
    areaServed: "Rockford, IL",
    itemOffered: {
      "@type": "Service",
      name: `Junk removal — ${name}`,
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: { "@type": "City", name: "Rockford, IL" },
    },
  });
  return [
    ...PRICE_TIERS.map((t) =>
      mk(
        t.name,
        t.amount
          ? { price: String(t.amount) }
          : {
              priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: t.min,
                maxPrice: t.max,
                priceCurrency: "USD",
              },
            },
        `${t.detail}. ${PRICING_INCLUDES}`
      )
    ),
    mk(SHED_DEMO.name, { price: String(SHED_DEMO.amount) }, SHED_DEMO.detail),
  ];
}

export function buildLocalBusinessJsonLd() {
  const { openingHours, google, offers, social, address, geo } = BUSINESS;

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.legalName,
    legalName: BUSINESS.legalName,
    alternateName: BUSINESS.alternateName,
    description: BUSINESS.description,
    url: SITE_URL,
    image: [`${SITE_URL}/images/logo.png`, `${SITE_URL}/images/hero-trailer.jpg`],
    logo: `${SITE_URL}/images/logo.png`,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Debit Card",
    hasMap: google.mapsUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      addressCountry: address.addressCountry,
    },
    ...(geo.latitude && geo.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: geo.latitude,
            longitude: geo.longitude,
          },
        }
      : {}),
    areaServed: BUSINESS.areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
    openingHoursSpecification: openingHours.days.map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day,
      opens: openingHours.opens,
      closes: openingHours.closes,
    })),
    sameAs: [social.instagram, social.facebook, google.mapsUrl].filter(
      Boolean
    ),
    ...(google.ratingValue && google.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: google.ratingValue,
            reviewCount: google.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    // Load-size pricing (owner-set flat rates, see PRICE_TIERS) plus the
    // per-item service menu, which is covered by those same rates.
    makesOffer: [...buildTierOffers(), ...offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      availability: "https://schema.org/InStock",
      areaServed: "Rockford, IL",
      itemOffered: {
        "@type": "Service",
        name: offer.name,
        provider: { "@id": `${SITE_URL}/#business` },
        areaServed: {
          "@type": "City",
          name: "Rockford, IL",
        },
      },
    }))],
    ...(offers.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Junk removal services",
            itemListElement: offers.map((offer) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: offer.name,
                areaServed: "Rockford, IL",
                provider: { "@id": `${SITE_URL}/#business` },
              },
              availability: "https://schema.org/InStock",
            })),
          },
        }
      : {}),
    knowsAbout: BUSINESS.serviceTypes,
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS.legalName,
    alternateName: BUSINESS.alternateName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    sameAs: [
      BUSINESS.social.instagram,
      BUSINESS.social.facebook,
      BUSINESS.google.mapsUrl,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BUSINESS.phone,
        contactType: "customer service",
        areaServed: "US-IL",
        availableLanguage: ["English"],
      },
    ],
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/about#person`,
      name: "Michael",
      jobTitle: "Owner",
      url: `${SITE_URL}/about`,
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BUSINESS.brandName,
    url: SITE_URL,
    description: BUSINESS.shortDescription,
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@id": `${SITE_URL}/#business` },
    inLanguage: "en-US",
  };
}

export function buildFaqPageJsonLd(items = FAQ_ITEMS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildServiceJsonLd() {
  const dedicated = [
    { name: "Junk removal", url: `${SITE_URL}/junk-removal-rockford` },
    { name: "Couch removal", url: `${SITE_URL}/couch-removal-rockford` },
    { name: "Same-day junk pickup", url: `${SITE_URL}/same-day-junk-pickup-rockford` },
    { name: "Furniture removal", url: `${SITE_URL}/furniture-removal-rockford` },
    { name: "Appliance removal", url: `${SITE_URL}/appliance-removal-rockford` },
    { name: "Estate cleanouts", url: `${SITE_URL}/estate-cleanout-rockford` },
    { name: "Garage & basement cleanouts", url: `${SITE_URL}/garage-basement-cleanout-rockford` },
    { name: "Shed demolition", url: `${SITE_URL}/shed-demolition-rockford` },
    { name: "Curbside pickup", url: `${SITE_URL}/curbside-pickup-rockford` },
  ];

  const fromCatalog = BUSINESS.serviceTypes
    .filter((name) => !dedicated.some((d) => d.name.toLowerCase() === name.toLowerCase()))
    .map((name, i) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE_URL}/#service-${i + 1}`,
      name,
      description: `${name} in Rockford, IL by ${BUSINESS.legalName}. Licensed & insured. Call ${BUSINESS.phoneDisplay}.`,
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: BUSINESS.areaServed.map((city) => ({
        "@type": "City",
        name: city,
      })),
      url: `${SITE_URL}/junk-removal-rockford`,
    }));

  const dedicatedLd = dedicated.map((d, i) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service-dedicated-${i + 1}`,
    name: d.name,
    description: `${d.name} in Rockford, IL by ${BUSINESS.legalName}. Licensed & insured. Call ${BUSINESS.phoneDisplay}.`,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: BUSINESS.areaServed.map((city) => ({
      "@type": "City",
      name: city,
    })),
    url: d.url,
  }));

  return [...dedicatedLd, ...fromCatalog];
}

export function buildReviewJsonLd() {
  // Real reviews only, verbatim from the Google Business Profile.
  return [
    {
      "@context": "https://schema.org",
      "@type": "Review",
      author: { "@type": "Person", name: "Hunter Brooks" },
      reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
      reviewBody:
        "5 stars is an understatement!! I highly recommend you call these guys for any junk removal needs.",
      itemReviewed: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Review",
      author: { "@type": "Person", name: "Chill brah" },
      reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
      reviewBody:
        "Very friendly, fair priced and great interaction. The team at firststep got the job done fast!",
      itemReviewed: { "@id": `${SITE_URL}/#business` },
    },
  ];
}

export function buildAllJsonLd() {
  return [
    buildOrganizationJsonLd(),
    buildLocalBusinessJsonLd(),
    buildWebSiteJsonLd(),
    buildFaqPageJsonLd(),
    ...buildReviewJsonLd(),
    ...buildServiceJsonLd(),
  ];
}
