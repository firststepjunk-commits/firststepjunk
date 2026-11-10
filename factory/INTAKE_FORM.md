# Site Factory — Intake Form

Answer every question below, then transfer the answers into a copy of
`intake.sample.json`. Required fields are marked ★ — the generator refuses to
run without them. Everything else improves the clone but can be fixed later.

## A. Business identity
1. ★ **Legal name** — exactly as registered (goes in schema + footer). _e.g. "FirstStep Junk Removal LLC"_
2. ★ **Brand name** — the public-facing name used in headlines. _e.g. "First Step Junk Removal"_
3. ★ **Short name** — casual name for email subjects & small UI. _e.g. "First Step Junk"_
4. ★ **Primary service phrase** — lowercase, reads naturally mid-sentence: "…interested in ___". _e.g. "junk removal", "pressure washing"_
5. ★ **Google Business Profile primary category** — pick the real GBP category. _e.g. "Junk removal service"_

## B. Owner (powers /about + Person schema)
6. ★ **Owner first name** — used across the site & CRM. _e.g. "Michael"_
7. **Owner bio facts** — 3–5 short facts: years in trade, prior work, what they personally handle, licensing/insurance. (Used in the copy pass, not by the generator.)
8. **Owner headshot** — a real photo file, to replace `public/images/gallery/g09.webp` later.

## C. Contact
9. ★ **Phone** — 10 digits, no punctuation. _e.g. "7797721857"_
10. ★ **Email** — the business inbox (quote notifications go here too).

## D. Location & service area
11. ★ **City** — the anchor city for local SEO. _e.g. "Rockford"_
12. ★ **State** — 2-letter code. _e.g. "IL"_
13. **Area served** — list of "Town, ST" strings (6–8 max, real coverage only).
14. **Latitude / longitude** — city centroid from Google Maps (right-click → copy coordinates).

## E. Hours
15. **Opens / closes** — 24h format. _e.g. "07:30" / "19:30"_ (days default to all 7; edit `src/lib/seo.js` if not daily).

## F. Web presence
16. ★ **Domain** — the production domain, no protocol. _e.g. "firststepjunk.com"_ (use the planned domain even if not purchased yet).
17. **Instagram URL** · **Facebook URL** · **Google Maps/GBP URL** — leave blank to get neutral placeholders.
18. **GA4 measurement ID** — _e.g. "G-XXXXXXXXXX"_; blank disables analytics until set in Netlify env.

## G. Voice (optional)
19. **CRM reply line** — one warm sentence used in draft reply emails. Default keeps a generic version of the master's line.
20. **Extra replacements** — any additional literal `from → to` swaps, e.g. a competitor name in copy, a special town spelling.

## H. Not asked here on purpose (handled in FINISH_SETUP.md)
- Admin password — generator writes a `changeme-…` placeholder; the owner sets the real one directly in `src/lib/content-data.js`.
- Apps Script URL + read token — produced when the Google backend is deployed.
- Photos, prices, testimonials, FAQ copy — the COPY_BRIEF.md polish pass.
