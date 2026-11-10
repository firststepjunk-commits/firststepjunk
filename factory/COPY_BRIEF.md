# Site Factory — Copy Polish Brief

The generator swaps identity (names, city, phone, service phrase) but the
resulting copy still *describes the master business's facts*: its prices, its
FAQ answers, its team, its testimonials. This brief is the per-file punch list
for making the words true for the new business. Do it with the owner's intake
answers (INTAKE_FORM.md section B/G) in hand.

Rule of thumb: **every number, price, name, and claim must be true for the new
business** — schema and visible text must keep saying the same thing.

## src/lib/content-data.js (site copy — or edit live in /settings)
- `hero` — title lines, subtitle, floating card claim.
- `whyUs` — the comparison table: amateur-way vs right-way points must match
  the new trade's real failure modes.
- `services` — main card + the two add-on cards (`pestTitle/Body`,
  `repairTitle/Body` keys are generic "add-on 1/2" slots — fill with the new
  business's real add-ons).
- `disasters` — problem/solution cards for the new industry.
- `pricing`/quote copy — real prices; must match GBP products and the FAQ.
- `team` — real names, roles, bios (or trim to owner-only).
- `gallery` — intro copy; photos handled in FINISH_SETUP §5.
- `quote` form — service checkboxes must list the new services.
- `faq` — rewrite Q&A; answers are quoted by AI/Search, keep them factual.

## src/lib/service-pages.js
- `SERVICE_PAGES` — for each page: `serviceName`, `title`, `metaTitle`,
  `metaDescription`, `answerFirst` (the 2–3 sentence direct answer at the top),
  price facts, `faqs` (question/answer), `image`.
- Slugs: if the clone's services differ in kind (not just city), set new slugs
  here AND rename the matching `src/app/<slug>/` folders to stay in sync.
- `OWNER` — `description`, `bioParagraphs`, `highlights`, `knowsAbout`: rewrite
  from the owner's real intake facts. This feeds /about + Person schema.

## src/lib/seo.js
- `description` / `shortDescription` — rewrite as flowing sentences for the new
  trade (the mechanical swap leaves them grammatical but generic).
- `keywords`, `priceRange`, `alternateName` — sanity-check.

## public/
- `llms.txt`, `llms-full.txt`, `ai.txt` — regenerate facts for the new business.
- `manifest.webmanifest` — name fields (generator swaps brand; verify).

## Tone
Plain-spoken, owner-voiced, local. No agency fluff. Short sentences. Facts
that a search engine can quote verbatim without embarrassment.
