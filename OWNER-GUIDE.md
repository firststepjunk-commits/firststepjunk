# First Step Junk Removal — Owner Guide

Everything you need to run the site yourself. No code required.

## 1. The private Settings page

- Go to **`/settings`** (e.g. `https://yoursite.com/settings`).
- Password: **`please`**
- It is hidden from Google (no-index) and not linked anywhere public.

> ⚠️ The password is light protection (good enough to keep the page private), **not** bank-grade security. Don't put secrets here. If you ever want real login security, ask and we can add Netlify Identity.

### What you can do there
- **Website Text** — edit *every* piece of text on the site (hero, services, team bios, footer, phone/email, etc.). Click **Save & Publish** and it goes live for everyone.
- **Photos** — toggle which gallery photos and which team members show on the site. Turned-off photos stay saved but hidden ("just chillin"). You can also edit captions and team photo paths here.
- **Resources** — quick links: your **Google Ads** Performance Max report, plus Netlify.
- **Contact Form** — a working test/internal message form.

Your text edits and photo on/off toggles are stored **headless in Google Sheets**
(the `SiteContent` tab of your quote spreadsheet — one JSON row). Photos stay in
the site files. See **§5**.

## 2. Quote form → Google (email + Sheet + Drive)

Quote-form submissions go through a **free Google Apps Script** in your Google account:

- 📧 You get an **email** at firststep.junk@gmail.com for every request.
- 📋 Every request is logged as a row in your **Google Sheet**.
- 📷 Uploaded photos land in a **Drive folder**, linked from the email/Sheet.

**Sheet:** https://docs.google.com/spreadsheets/d/1MBLSA8jBLTscBl-fdP3p-ynOKimRJCXeyBycvHCGYio/edit

Setup / redeploy: follow **`google-apps-script/README.md`**. You need
`NEXT_PUBLIC_QUOTE_SCRIPT_URL` + `SUBMISSIONS_READ_TOKEN` in Netlify, then redeploy.

The form also has an optional **Email** field so you can reply to customers.
(The small internal contact form on `/settings` may still use Netlify's free tier.)

## 3. Photos

- The gallery uses **13 job photos** pulled from your "The best Junk pics" Google Drive folder, converted to optimized WebP (~90 KB each, all 13 ≈ 1.2 MB total) so they look sharp without slowing the site.
- To add/remove gallery photos later: drop optimized images in `public/images/gallery/` and add them in the Settings → Photos list (or ask me).

## 4. Team photos

The four team members (Michael, Ben, Josh, Mercedes) are live with their real
bios. To use real portraits, overwrite these files (same names), then redeploy:

- `public/images/team/michael.jpg`
- `public/images/team/ben.jpg`
- `public/images/team/josh.jpg`
- `public/images/team/mercedes.jpg`

Recommended size: ~800×1000, JPG, under ~150 KB. No code changes needed.

## 5. Connect Google Sheets (headless text + quotes + CRM)

One Apps Script powers the form, CRM sync, and Settings publish. Spreadsheet ID
is already set in `google-apps-script/quote-form.gs`.

1. Paste `quote-form.gs` into [script.google.com](https://script.google.com) and
   **Deploy as Web app** (Execute as Me, Who has access: Anyone). See README in
   that folder.
2. Copy `.env.example` → `.env.local` and set:
   - `NEXT_PUBLIC_QUOTE_SCRIPT_URL` = the `/exec` URL
   - `SUBMISSIONS_READ_TOKEN` = same value as `READ_TOKEN` in the script
3. Add the **same** vars in **Netlify → Environment variables**, then redeploy.
4. Optional: `npm run sheets:seed` to write default site text into the
   `SiteContent` tab (or just Save once from `/settings`).

After that, **Save & Publish** on `/settings` writes to the Sheet and is live for
everyone. Quote rows land on tab 1; CRM pages read/write the same sheet.

## Local development

- `npm run dev` — runs the site locally. Without the script URL + token, settings
  edits save to `.content-data.json` (gitignored) and the message says saved
  locally. With `.env.local` set, dev reads/writes the real Sheet.
- On the live site, Save publishes via Google Sheets for everyone.
