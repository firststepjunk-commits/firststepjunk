import { BUSINESS } from "@/lib/seo";
import {
  ArmchairIcon,
  BoxIcon,
  BricksIcon,
  FenceIcon,
  FridgeIcon,
  HomeIcon,
  InfoIcon,
  MattressIcon,
  PianoIcon,
  ShedIcon,
  SofaIcon,
  StorageIcon,
  TreeIcon,
} from "./icons";

/**
 * "We haul almost anything" — the breadth section. It answers the
 * visitor's real question ("can they take MY stuff?") with a grid of
 * the things he actually hauls, so nobody bounces because their item
 * isn't named anywhere.
 *
 * Every item here is verified from his service pages, the CRM, or known
 * jobs: furniture, couches, mattresses & box springs, appliances,
 * pianos, sheds, decks & fences, yard waste, construction debris &
 * drywall, estate & hoarder cleanouts, storage units, household junk.
 * Nothing is invented — no hot tubs, no items he hasn't done.
 *
 * The "can't haul" note is honest on purpose: hazardous materials are
 * the one hard no, and pointing people to the right place for those
 * builds trust instead of losing it.
 *
 * Icons are inline SVGs (see icons.js) — no font ligatures anywhere
 * in this section.
 */
const ITEMS = [
  {
    icon: <ArmchairIcon className="h-8 w-8 text-primary" />,
    title: "Furniture",
    body: "Dressers, tables, beds & more — we lift it and load it.",
  },
  {
    icon: <SofaIcon className="h-8 w-8 text-primary" />,
    title: "Couches & sofas",
    body: "Sofas, sectionals & recliners, up or down the stairs.",
  },
  {
    icon: <MattressIcon className="h-8 w-8 text-primary" />,
    title: "Mattresses & box springs",
    body: "Single pieces or a whole set — hauled away the same day.",
  },
  {
    icon: <FridgeIcon className="h-8 w-8 text-primary" />,
    title: "Appliances",
    body: "Fridges, washers, dryers & water heaters.",
  },
  {
    icon: <PianoIcon className="h-8 w-8 text-primary" />,
    title: "Pianos",
    body: "Upright pianos moved with a two-person lift.",
  },
  {
    icon: <ShedIcon className="h-8 w-8 text-primary" />,
    title: "Sheds",
    body: "Demo, haul & disposal — $725 flat for a standard empty wood 10×12.",
  },
  {
    icon: <FenceIcon className="h-8 w-8 text-primary" />,
    title: "Decks & fences",
    body: "Teardown and haul-away, boards and all.",
  },
  {
    icon: <TreeIcon className="h-8 w-8 text-primary" />,
    title: "Yard waste",
    body: "Branches, brush & garden debris, cleared out.",
  },
  {
    icon: <BricksIcon className="h-8 w-8 text-primary" />,
    title: "Construction debris",
    body: "Drywall, lumber & remodel waste from the job site.",
  },
  {
    icon: <HomeIcon className="h-8 w-8 text-primary" />,
    title: "Estate & hoarder cleanouts",
    body: "Whole homes cleared room by room, quickly and carefully.",
  },
  {
    icon: <StorageIcon className="h-8 w-8 text-primary" />,
    title: "Storage units",
    body: "Units cleared out fast — one load or the whole thing.",
  },
  {
    icon: <BoxIcon className="h-8 w-8 text-primary" />,
    title: "Household junk",
    body: "Boxes, clothes, clutter & general junk — all of it.",
  },
];

export default function WeHaul() {
  return (
    <section className="bg-white py-section-gap" id="we-haul">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-12 max-w-2xl" data-aos="fade-up">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            One call, any pile
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            We haul almost anything.
          </h2>
          <p className="mt-3 text-lg text-on-surface-variant">
            From a single couch to a full estate cleanout — if it&apos;s junk, we haul it. One
            trailer, flat rates from $75 to $425 by the space it takes, no surprise fees.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6"
              data-aos="fade-up"
              data-aos-delay={Math.min(i * 50, 300)}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                {item.icon}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-primary sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* Honest boundary: the one hard no, plus where to go instead. */}
        <div
          className="mt-8 flex flex-col gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 sm:flex-row sm:items-center sm:gap-4 sm:p-6"
          data-aos="fade-up"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <InfoIcon className="h-6 w-6 text-primary" />
          </span>
          <p className="text-[15px] leading-relaxed text-on-surface">
            <span className="font-bold text-primary">A few things we can&apos;t take: </span>
            hazardous materials — paint, chemicals, asbestos.{" "}
            <a
              href={`tel:${BUSINESS.phone}`}
              className="font-bold text-primary underline underline-offset-2 hover:no-underline"
            >
              Call us
            </a>{" "}
            and we&apos;ll point you to the right place for those.
          </p>
        </div>

        <p className="mt-8 text-lg text-on-surface-variant" data-aos="fade-up">
          Don&apos;t see it on the list?{" "}
          <a
            href="#quote"
            className="font-bold text-primary underline underline-offset-4 hover:text-secondary"
          >
            Send a photo
          </a>{" "}
          — if it&apos;s junk, we&apos;ll haul it.
        </p>
      </div>
    </section>
  );
}
