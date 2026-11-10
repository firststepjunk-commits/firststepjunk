// Server-only content loader — HEADLESS via Google Sheets (Apps Script).
//
// The site's text/settings live in the spreadsheet's "SiteContent" tab
// (Key | Data JSON). Pure data + helpers live in ./content-data (client-safe)
// and are re-exported here so server components can keep importing from
// "@/lib/content".
//
// Storage precedence:
//   1. Google Sheet (Apps Script) — when script URL + SUBMISSIONS_READ_TOKEN are set
//   2. local dev file             — .content-data.json (gitignored)
//   3. bundled defaults           — always works, never throws
//
// Photos themselves are NOT stored in the Sheet — only the text/settings JSON
// (including which photos are toggled on). Image files stay in /public.
import { defaultContent, mergeContent, ADMIN_PASSWORD } from "./content-data";
import { getScriptUrl } from "./scriptUrl";

export { defaultContent, mergeContent, ADMIN_PASSWORD };

const TOKEN = process.env.SUBMISSIONS_READ_TOKEN;
const LOCAL_FILE = ".content-data.json";

const sheetConfigured = () => Boolean(getScriptUrl() && TOKEN);

async function parseJsonResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Sheet response not JSON (${res.status}): ${text.slice(0, 120)}`);
  }
}

async function readFromSheet() {
  const url = `${getScriptUrl()}?token=${encodeURIComponent(TOKEN)}&action=getContent`;
  const res = await fetch(url, { cache: "no-store", redirect: "follow" });
  if (!res.ok) throw new Error(`Sheet read ${res.status}`);
  const json = await parseJsonResponse(res);
  if (!json?.ok) throw new Error(json?.error || "sheet_read_failed");
  return json.content || null;
}

async function writeToSheet(content) {
  const res = await fetch(getScriptUrl(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "saveContent", token: TOKEN, content }),
    redirect: "follow",
  });
  const json = await parseJsonResponse(res);
  if (!res.ok || json?.ok === false) {
    throw new Error(json?.error || `Sheet write ${res.status}`);
  }
}

async function readFromFile() {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const raw = await fs.readFile(path.join(process.cwd(), LOCAL_FILE), "utf8");
  return JSON.parse(raw);
}

async function writeToFile(content) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.writeFile(
    path.join(process.cwd(), LOCAL_FILE),
    JSON.stringify(content, null, 2),
    "utf8"
  );
}

// Read current content (Sheet → dev file → defaults). Always returns a full object.
export async function getContent() {
  let saved = null;
  try {
    saved = sheetConfigured() ? await readFromSheet() : await readFromFile();
  } catch {
    saved = null;
  }
  return saved ? mergeContent(defaultContent, saved) : defaultContent;
}

// Persist content. Returns { persisted, store } so the UI can tell the user
// whether the change is live for everyone (Sheet) or only saved in dev.
export async function saveContent(content) {
  if (sheetConfigured()) {
    await writeToSheet(content);
    return { persisted: true, store: "sheet" };
  }
  await writeToFile(content);
  return { persisted: true, store: "file" };
}
