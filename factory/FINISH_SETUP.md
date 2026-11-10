# Site Factory — Finish Setup (post-generate checklist)

Run `factory/generate.mjs` first (see README.md). Then work this list top to
bottom for the new clone. Nothing here is optional except where marked.

## 1. Local smoke
- [ ] `cd <clone> && npm install && npm run dev`
- [ ] Homepage shows the new brand, city, phone everywhere above the fold.
- [ ] `/about`, each service page, `/settings` (password = the `changeme-…`
      placeholder in `src/lib/content-data.js`) all render.
- [ ] `npm run build` passes.

## 2. Google backend (Sheets + Apps Script) — quote form, CRM, content store
Do this signed into the **business's own Google account** (owner does the
sign-in; never share the password).
- [ ] Create a Google Sheet named after the business (tabs are auto-created by
      the script on first run; see `google-apps-script/README.md`).
- [ ] Create a Drive folder for quote photos.
- [ ] script.google.com → New project → paste `google-apps-script/quote-form.gs`.
- [ ] Set Script Properties per `google-apps-script/README.md` (sheet ID, Drive
      folder ID, notify emails, read token — generate a long random token).
- [ ] Deploy → Web app → execute as *Me*, access *Anyone* → copy the `/exec` URL.

## 3. Owner accounts & credentials (owner does these personally)
- [ ] Change `ADMIN_PASSWORD` in `src/lib/content-data.js` from the placeholder.
- [ ] Buy/confirm the domain at the registrar.
- [ ] GA4 property (optional now): create, copy `G-…` id.

## 4. GitHub + Netlify
- [ ] Create a new GitHub repo, push the clone (`git remote add origin … && git push -u origin main`).
- [ ] Netlify → Add new site → import that repo (build cmd/publish dir come from
      `netlify.toml` automatically).
- [ ] Site configuration → Environment variables — set, from `.env.example`:
      `NEXT_PUBLIC_QUOTE_SCRIPT_URL`, `QUOTE_SCRIPT_URL`, `SUBMISSIONS_READ_TOKEN`,
      `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_URL` (empty string
      hides the Ads card in Settings).
- [ ] Deploy; add the custom domain + HTTPS; confirm `SITE_URL` in
      `src/lib/seo.js` matches the final domain exactly.

## 5. Photos & media (`public/images/`)
- [ ] `logo.png` — square logo (used for favicon, OG, schema).
- [ ] `hero-trailer.jpg` — real hero shot.
- [ ] `gallery/g01…` — real job photos (keep filenames; toggle in Settings → Photos).
- [ ] Owner headshot (the file referenced by `OWNER.image` in `src/lib/service-pages.js`).

## 6. Copy polish
- [ ] Work through `factory/COPY_BRIEF.md` — prices, FAQ, bios, testimonials,
      service-page copy. The generator swaps identity; it does not write the
      new business's real facts.

## 7. Launch verification (end-to-end)
- [ ] Submit a real test quote with a photo from a phone → row lands in the
      Sheet, photo in Drive, notification email arrives.
- [ ] `/submissions` CRM shows the entry; status change writes back.
- [ ] Settings → edit a heading → publish → homepage updates.
- [ ] Google Search Console + Bing Webmaster: add property, submit sitemap.
- [ ] Walk the `/seos` guide with the owner for the GBP checklist.
