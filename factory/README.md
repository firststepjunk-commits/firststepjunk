# Site Factory — turnkey duplicates of this site

This folder turns the First Step site into a repeatable product. One filled
intake form → one command → a complete new site (same architecture, new
business identity) ready for backend hookup and copy polish.

The factory ships **with the master repo only** — the generator excludes
`factory/` from clones automatically.

## The moving parts you're duplicating
| Part | Where it lives | Per-clone step |
|---|---|---|
| Next.js site (pages, CRM, settings editor) | this repo | generated |
| Business identity | `src/lib/seo.js` | generated from intake |
| Site copy | `src/lib/content-data.js` | generated + COPY_BRIEF pass |
| Service pages + routes | `src/lib/service-pages.js`, `src/app/<slug>/` | generated |
| Quote backend (Sheets + Apps Script + Drive) | `google-apps-script/` | FINISH_SETUP §2 |
| Hosting | Netlify (`netlify.toml`) | FINISH_SETUP §4 |
| Analytics / Ads links | env vars | FINISH_SETUP §4 |

## Step-by-step: spin a duplicate
1. **Intake** — sit with the owner and answer `INTAKE_FORM.md`. Put the answers
   in a copy of `intake.sample.json` (e.g. `intake.smith-hauling.json`). Keep
   intake files out of git if they contain anything private.
2. **Generate**
   ```
   node factory/generate.mjs intake.smith-hauling.json
   # or:  node factory/generate.mjs intake.smith-hauling.json --out ..\smith-hauling
   ```
   Output: a sibling folder named after the brand, git-initialized, with
   `CLONE_NOTES.md` and `.env.example` inside.
3. **Smoke** — `cd` into the clone, `npm install && npm run build`.
4. **Finish setup** — work `FINISH_SETUP.md` top to bottom (Google backend,
   GitHub, Netlify + env, domain, photos). Owner personally handles passwords,
   account sign-ins, and domain purchase.
5. **Copy polish** — `COPY_BRIEF.md` per file, with the owner's real facts.
6. **Launch verification** — FINISH_SETUP §7 end-to-end test.

## What the generator rewrites automatically
- Brand/legal/short names, owner first name, primary service phrase (3 casings),
  GBP category.
- Phone in every format, email, domain, social/maps URLs.
- City & state — display text, lowercase slugs, service route folders
  (regenerated from `templates/service-route.template.js`).
- `areaServed`, `geo`, `openingHours`, `alternateName` in `seo.js`.
- GA measurement id, admin-password placeholder, `package.json` name.

## What it deliberately does NOT do
- Real prices, FAQ answers, bios, testimonials → COPY_BRIEF pass.
- Photos → FINISH_SETUP §5.
- Accounts, passwords, domains, deployments → owner + FINISH_SETUP.

## Maintaining the factory
The generator reads the master's current social URLs from `seo.js` at run time
and fails loudly if a landmark string it relies on disappears. If you rename
brand strings in the master, update the rule list in `generate.mjs`
(`buildRules()`), then run a test generation against `intake.sample.json` —
identity values equal to the master's should produce a clone that builds and
diffs near-zero against master.
