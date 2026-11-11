// Pure, client-safe content data + helpers (NO server-only imports here).
// Both client components and the server content loader import from this file.

import { FAQ_ITEMS } from "@/lib/seo";

export const ADMIN_PASSWORD = "please";

export const defaultContent = {
  // Visual theme id from src/lib/themes.json — switch in Settings → Theming.
  theme: "master",

  // Images used in more than one place (or in no single section).
  siteImages: {
    logo: "/images/logo.png",
  },

  nav: {
    links: [
      { label: "Services", href: "#services" },
      { label: "Pricing", href: "#pricing" },
      { label: "Our Work", href: "#gallery" },
      { label: "FAQ", href: "#faq" },
      { label: "Why Us", href: "#why-us" },
      { label: "Meet the Team", href: "#about" },
    ],
    cta: "Get a Quote",
  },

  hero: {
    badge: "ROCKFORD'S FRIENDLIEST HAULING TEAM",
    titleLine1: "Clean Spaces,",
    titleLine2: "First Steps.",
    subtitle:
      "Professional Junk Removal in Rockford. We clear the clutter so you can take your next step with a clean slate.",
    primaryCta: "Get a Fast Quote",
    secondaryCta: "Our Services",
    floatTitle: "Fast Response",
    floatText: "Same-day pickup available",
    // Hero before/after slider. Swap these for a matched pair shot from the
    // same spot (junk-filled, then cleared) and the wipe sells itself.
    beforeImage: "/images/hero-cleanup-before.jpg",
    afterImage: "/images/hero-cleanup-after.jpg",
    beforeAlt: "Backyard patio piled with bagged junk before First Step Junk Removal arrived",
    afterAlt: "The backyard patio cleared after First Step Junk Removal finished the cleanup",
    beforeLabel: "Before",
    afterLabel: "After",
  },

  whyUs: {
    heading: "Why Rockford Trusts Us",
    intro:
      "We've heard the horror stories. That's why we've built a service focused on reliability and radical professionalism.",
    amateurTitle: "The Amateur Way",
    amateurPoints: [
      'Uncertain scheduling and "no-shows" that waste your entire Saturday.',
      'Hidden fees and "surprise" surcharges once the truck is loaded.',
      "Reckless handling that leaves scuffs on your walls or oil on your driveway.",
    ],
    image: "/images/crew-at-job-site.jpg",
    imageAlt: "Professional crew at job site",
    firstStepTitle: "The First Step Way",
    firstStepPoints: [
      { t: "Guaranteed Arrival Windows", d: "We text when we're 15 minutes away. No waiting around." },
      { t: "Upfront All-In Pricing", d: "The quote you get is the price you pay. Period." },
      { t: "Licensed & Fully Insured", d: "Total peace of mind while we work in your home." },
    ],
  },

  services: {
    heading: "Full-Service Solutions",
    intro: "More than just a truck. We're your local home service partners.",
    est: "Est. 2024 Rockford",
    image: "/images/crew-loading-logs.jpg",
    imageAlt: "Crew loading logs",
    mainTitle: "Residential & Commercial Hauling",
    mainBody:
      "From old sofas to construction debris, we handle the heavy lifting and proper disposal.",
    mainTag1: "Estate Cleanouts",
    mainTag2: "Shed Removal",
    pestTitle: "Pest Removal Add-on",
    pestBody:
      "Clearing a hoarding situation? We can provide safe pest mitigation alongside hauling.",
    repairTitle: "Home Repair Add-on",
    repairBody:
      "Drywall patch or minor repairs needed after the clutter is gone? We've got you covered.",
  },

  pricing: {
    heading: "Junk Removal Pricing in Rockford, IL",
    intro:
      "Simple flat rates based on how much of our 10×6 ft trailer your junk fills. Junk removal starts at $90, and every rate includes labor, pickup, hauling, and all dump fees.",
    quoteLabel: "Priced by load · from $90",
    footnote:
      "Mattresses and box springs are extra (landfill fee is separate). Not sure how much you have? Call or text (779) 772-1857, or send photos through the form, and we'll confirm your price before we start.",
  },

  faq: {
    heading: "Rockford Junk Removal FAQ",
    intro:
      "Straight answers about junk removal cost, same-day pickup, and what we haul in Rockford, IL.",
    items: FAQ_ITEMS,
  },

  ctaBanner: {
    heading: "Ready to Clear the Clutter?",
    intro:
      "Join hundreds of Rockford residents who have taken the first step toward a cleaner, more organized space.",
    primaryCta: "Contact Us Now",
    secondaryCta: "Call for a Free Quote",
  },

  disasters: {
    heading: "AVOID: Common Industry Disasters",
    intro:
      "Don't let your cleanout become a headache. See how First Step Junk Removal solves the problems others leave behind.",
    cards: [
      {
        image: "/images/team-lifting-box.jpg",
        imageAlt: "Team lifting box",
        badge: "HOW WE DEFEAT IT: Reliable Logistics",
        title: "The Abandonment Trap",
        body: "We use a centralized dispatch system and backup crews to ensure every job is completed on schedule. We never leave a site until the client is 100% satisfied.",
        quote:
          '"Another service left 3 tons of debris in a client\'s yard after failing to show up for day two. We arrived in 4 hours and cleared it all before sunset."',
      },
      {
        image: "/images/garden-path-lift.jpg",
        imageAlt: "Lifting at garden path",
        badge: "HOW WE DEFEAT IT: Professional Care",
        title: "The Damage Dilemma",
        body: "Our team is trained in heavy-load navigation. We use floor runners, corner guards, and dedicated spotters to protect your property from every angle.",
        quote:
          '"The last guys dented the client\'s door frame. We used protective padding and a spotter to move a massive workstation safely."',
      },
      {
        image: "/images/unloading-lumber.jpg",
        imageAlt: "Unloading lumber",
        badge: "HOW WE DEFEAT IT: Certified Disposal",
        title: "The Illegal Dumping Risk",
        body: "We maintain strict compliance with local environmental laws. Every load is tracked, and we provide official disposal receipts for your records.",
        quote:
          '"Client was worried about fly-tipping fines. We provided a full disposal receipt from the Rockford transfer station same-day."',
      },
    ],
  },

  gallery: {
    eyebrow: "Our Work",
    heading: "Real Jobs, Real Results",
    subtitle:
      "Swipe through recent First Step Junk Removal jobs around Rockford — from full cleanouts to single-item hauls.",
    images: [
      { src: "/images/gallery/g01.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g02.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g03.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g04.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g05.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g06.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g07.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g08.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g09.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g10.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g11.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g12.webp", alt: "First Step Junk Removal job in Rockford", published: true },
      { src: "/images/gallery/g13.webp", alt: "First Step Junk Removal job in Rockford", published: true },
    ],
  },

  team: {
    eyebrow: "The Crew",
    heading: "Meet the First Step Team",
    intro:
      "Locals who actually show up, actually lift carefully, and actually answer the phone.",
    members: [
      {
        name: "Michael",
        role: "Owner",
        bio: "Michael is the guy behind it all, turning “junk problems” into simple, stress-free solutions. When he’s not running jobs or building the business, you’ll usually find him deep into video games, brainstorming the next move as an entrepreneur, or out handling pest control work like it’s second nature. He’s all about the grind—always hustling, always improving. Big cat and dog lover, and the type who genuinely enjoys helping people out without expecting anything in return.",
        photo: "/images/gallery/g09.webp",
        published: true,
      },
      {
        name: "Ben",
        role: "The Creative One",
        bio: "Ben brings the artistic energy to the team. He’s usually sketching something out, creating art, or finding inspiration in the little things most people overlook. Outside of that, he’s a big One Piece fan, always watching and staying caught up. Music is constantly playing in his world, and he’s the type of person who naturally shows up when someone needs help—no questions asked, just action.",
        photo: "/images/gallery/g11.webp",
        published: true,
      },
      {
        name: "Josh",
        role: "The People Person",
        bio: "Josh is the social engine of the crew. He’s a natural with people and can turn any job site into a comfortable, easy-going space. Outside of work, he’s big on fitness—always in the gym, focused on dieting and personal health goals. He’s also a cat lover and a gamer, balancing discipline with downtime in a way that keeps him sharp and motivated.",
        photo: "/images/gallery/g08.webp",
        published: true,
      },
      {
        name: "Mercedes",
        role: "Customer Care",
        bio: "Mercedes keeps everything running smoothly behind the scenes. She’s the friendly first point of contact for a lot of our customers, making sure every cleanout is scheduled, organized, and stress-free from the first call to the final sweep. She takes pride in turning a hectic junk problem into an easy, no-pressure experience.",
        photo: "/images/garden-path-lift.jpg",
        published: true,
      },
    ],
  },

  quote: {
    heading: "Ready to Take the First Step?",
    intro:
      "Tell us what needs to go. We'll provide a transparent, no-obligation estimate in minutes.",
    image: "/images/crew-member-lifting.jpg",
    imageAlt: "Crew member lifting",
    addPhotosTitle: "Add Photos",
    addPhotosText: "Fastest way to get a quote",
    callTitle: "Call Now",
    successHeading: "Quote Request Sent!",
    successText: "Thanks — we'll get back to you shortly with a free estimate.",
    submitLabel: "Request My Free Quote",
  },

  contact: {
    phone: "(779) 772-1857",
    phoneHref: "tel:+17797721857",
    email: "firststep.junk@gmail.com",
  },

  footer: {
    tagline:
      "Rockford's dependable partner for residential and commercial cleanouts. Professional, insured, and locally owned.",
    servicesHeading: "Our Services",
    serviceLinks: [
      { label: "Junk Removal Rockford", href: "/junk-removal-rockford" },
      { label: "Couch Removal", href: "/couch-removal-rockford" },
      { label: "Same-Day Pickup", href: "/same-day-junk-pickup-rockford" },
      { label: "Furniture Removal", href: "/furniture-removal-rockford" },
      { label: "Appliance Removal", href: "/appliance-removal-rockford" },
      { label: "Estate Cleanouts", href: "/estate-cleanout-rockford" },
      { label: "Shed Demolition", href: "/shed-demolition-rockford" },
      { label: "About Michael", href: "/about" },
      { label: "Get a Quote", href: "/#quote" },
    ],
    contactHeading: "Contact Us",
    location: "Serving Rockford, IL and surrounding areas.",
    copyright: "© 2024 First Step Junk Removal. Serving Rockford, IL and surrounding areas.",
  },
};

// ---- image fields ----
// Content keys whose value is a photo path, not copy. Both editors use this to
// tell "swap the picture" fields apart from "edit the words" fields.
export const IMAGE_KEYS = new Set([
  "src",
  "photo",
  "image",
  "logo",
  "beforeImage",
  "afterImage",
]);

// Every distinct photo the site currently points at — the picker's library, so
// an owner can reuse a job photo anywhere without typing a path.
export function collectImagePaths(content) {
  const found = new Set();
  (function walk(node) {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        if (IMAGE_KEYS.has(key) && typeof value === "string" && value.trim()) {
          found.add(value.trim());
        } else {
          walk(value);
        }
      }
    }
  })(content);
  return [...found];
}

// ---- deep merge (saved content over defaults; arrays replaced wholesale) ----
function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function mergeContent(base, over) {
  if (Array.isArray(base)) return Array.isArray(over) ? over : base;
  if (isPlainObject(base)) {
    const out = { ...base };
    if (isPlainObject(over)) {
      for (const key of Object.keys(over)) {
        out[key] = key in base ? mergeContent(base[key], over[key]) : over[key];
      }
    }
    return out;
  }
  return over === undefined ? base : over;
}
