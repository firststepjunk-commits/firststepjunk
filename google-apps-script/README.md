# Quote + site content + CRM — Google Apps Script (free)

The website talks to **one** Google Apps Script web app:

| Flow | How |
|------|-----|
| Quote form | Browser → `/api/quote` → Apps Script → Sheet row + Drive photos + email |
| CRM Intake/Jobs | `/api/submissions` + `/api/submissions/update` → Apps Script (token) |
| Settings text | `/api/content` → Apps Script `getContent` / `saveContent` → **SiteContent** tab |

**Spreadsheet:** [First Step Junk Sheet](https://docs.google.com/spreadsheets/d/1MBLSA8jBLTscBl-fdP3p-ynOKimRJCXeyBycvHCGYio/edit)

- Tab 1 (gid=0) — quote submissions / CRM
- Tab `SiteContent` — website text JSON (`Key` | `Data`) — created automatically on first save

## One-time deploy (~5 minutes, as firststep.junk@gmail.com)

1. Open [script.new](https://script.new) → delete placeholder → paste **all** of `quote-form.gs`.
2. Confirm `SHEET_ID` and `READ_TOKEN` match `.env.example` / Netlify.
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy → Authorize (Advanced → Go to … → Allow)
4. Copy the **Web app URL** (ends in `/exec`).
5. Set env vars locally and on Netlify, then **redeploy** the site:

```
NEXT_PUBLIC_QUOTE_SCRIPT_URL=https://script.google.com/macros/s/…/exec
SUBMISSIONS_READ_TOKEN=FsJ8rK2mP9xQ4nW7vL3sT6hY1bN5cD0e
```

6. Optional: seed site content once: `npm run sheets:seed` (needs `.env.local` with the URL + token).

## After editing the script

Deploy → Manage deployments → ✏️ Edit → Version: **New version** → Deploy.  
Saving alone does **not** update the live `/exec` URL.

## Sheet headers (tab 1)

If the first tab is empty, the script seeds these headers automatically:

`Date | Name | Phone | Email | Junk description | Pest treatment | Home repair | Photo_url | id | status | notes | priority | estimatedValue | assignedTo | lastContactedAt | tags | source`

## Smoke test

1. Submit the quote form with a photo → new row on tab 1 + email.
2. Open `/submissions` or Jobs → should show the row (live Sheet sync).
3. Edit text on `/settings` → Save → `SiteContent` tab gets/updates the `content` row → refresh homepage.
