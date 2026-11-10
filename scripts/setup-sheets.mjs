/**
 * Verify the Google Sheet backend (Apps Script) and optionally seed SiteContent.
 *
 * Prerequisites:
 *   1. quote-form.gs deployed as a Web app (Anyone)
 *   2. .env.local with NEXT_PUBLIC_QUOTE_SCRIPT_URL (or QUOTE_SCRIPT_URL)
 *      and SUBMISSIONS_READ_TOKEN matching READ_TOKEN in the script
 *
 * Usage: npm run sheets:seed
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function loadEnvLocal() {
  const p = join(process.cwd(), ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const v = m[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadEnvLocal();

function normalizeScriptUrl(raw) {
  let u = String(raw || "").trim().replace(/^["']+|["']+$/g, "").trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u.replace(/^\/+/, "");
  try {
    return new URL(u).toString();
  } catch {
    return "";
  }
}

async function parseJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("✗ Response was not JSON. Redeploy Apps Script with Who has access: Anyone.");
    console.error(text.slice(0, 400));
    process.exit(1);
  }
}

const SCRIPT_URL = normalizeScriptUrl(
  process.env.QUOTE_SCRIPT_URL || process.env.NEXT_PUBLIC_QUOTE_SCRIPT_URL
);
const TOKEN = process.env.SUBMISSIONS_READ_TOKEN;

if (!SCRIPT_URL || !TOKEN) {
  console.error("✗ Set NEXT_PUBLIC_QUOTE_SCRIPT_URL and SUBMISSIONS_READ_TOKEN in .env.local");
  process.exit(1);
}

console.log("→ Reading SiteContent from Sheet…");
const getJson = await parseJson(
  await fetch(`${SCRIPT_URL}?token=${encodeURIComponent(TOKEN)}&action=getContent`, {
    redirect: "follow",
  })
);

if (!getJson.ok) {
  console.error("✗ getContent failed:", getJson.error || getJson);
  process.exit(1);
}

if (getJson.content) {
  console.log("✓ SiteContent has data.");
} else {
  // Prefer seeding from a local `.content-data.json` if the owner already edited
  // in dev; otherwise leave empty — first Save on /settings writes full content.
  const localPath = join(process.cwd(), ".content-data.json");
  if (existsSync(localPath)) {
    console.log("→ Seeding from .content-data.json…");
    const content = JSON.parse(readFileSync(localPath, "utf8"));
    const postJson = await parseJson(
      await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "saveContent", token: TOKEN, content }),
        redirect: "follow",
      })
    );
    if (!postJson.ok) {
      console.error("✗ saveContent failed:", postJson.error || postJson);
      process.exit(1);
    }
    console.log("✓ Seeded SiteContent from .content-data.json.");
  } else {
    console.log("○ SiteContent empty — open /settings → Save & Publish once to seed it.");
  }
}

console.log("→ Checking submissions read…");
const listJson = await parseJson(
  await fetch(`${SCRIPT_URL}?token=${encodeURIComponent(TOKEN)}&limit=5`, {
    redirect: "follow",
  })
);
if (!listJson.ok) {
  console.error("✗ submissions read failed:", listJson.error || listJson);
  process.exit(1);
}
console.log(`✓ Submissions API OK (${(listJson.submissions || []).length} row(s) in sample).`);
console.log("\n✅ Google Sheet backend is ready.");
