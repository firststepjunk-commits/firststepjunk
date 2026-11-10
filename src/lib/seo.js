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
  priceRange: "$$",
  areaServed: [
    "Rockford, IL",
    "Loves Park, IL",
    "Machesney Park, IL",
    "Belvidere, IL",
    "Roscoe, IL",
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
    reviewCount: 10,
  },
  /**
   * The service menu. Deliberately price-free: every job is quoted on what the
   * customer actually has, so nothing here (or in the JSON-LD built from it)
   * publishes a number we'd be held to.
   */
  quoteLabel: "Contact for inquiry",
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
    "FirstStep Junk Removal",
  ],
};

/** "Rockford, IL" — derived once; use for labels instead of hardcoding. */
export const CITY_STATE = `${BUSINESS.address.addressLocality}, ${BUSINESS.address.addressRegion}`;

/** Must match visible FAQ copy on the homepage (FAQPage schema rule). */
export const FAQ_ITEMS = [
  {
    question: "How much does junk removal cost in Rockford, IL?",
    answer:
      "Every job is quoted individually — cost depends on what you have, how much of it there is, and how hard it is to reach. FirstStep Junk Removal LLC gives a free, no-obligation estimate before any work starts, and the quote you get is the price you pay. Call or text (779) 772-1857, or send photos through the quote form, for a same-day answer.",
  },
  {
    question: "Do you offer same-day junk pickup in Rockford?",
    answer:
      "Yes. First Step Junk Removal offers same-day junk pickup in Rockford, IL and nearby areas when schedule allows. We are open every day from 7:30 AM to 7:30 PM. Call or text (779) 772-1857 to check availability.",
  },
  {
    question: "What areas do you serve near Rockford?",
    answer:
      "We serve Rockford, Loves Park, Machesney Park, Belvidere, Roscoe, Cherry Valley, and the greater Winnebago County area. If you are nearby and unsure, call (779) 772-1857 — we will confirm coverage quickly.",
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
      "Request a free quote on firststepjunk.com, or call/text (779) 772-1857. Photos of your junk help us price faster. We give transparent, no-obligation estimates — the quote you get is the price you pay.",
  },
];

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
    // No `price`/`priceCurrency` anywhere below: the site quotes per job, and
    // an Offer is valid without a price. Publishing one here would put a
    // number in front of customers that we never actually committed to.
    makesOffer: offers.map((offer) => ({
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
    })),
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

export function buildAllJsonLd() {
  return [
    buildOrganizationJsonLd(),
    buildLocalBusinessJsonLd(),
    buildWebSiteJsonLd(),
    buildFaqPageJsonLd(),
    ...buildServiceJsonLd(),
  ];
}
