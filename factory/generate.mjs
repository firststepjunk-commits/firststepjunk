#!/usr/bin/env node
/**
 * Site Factory — clone generator.
 *
 * Takes a filled intake JSON (see INTAKE_FORM.md + intake.sample.json) and
 * spins an exact duplicate of this site's architecture with the new
 * business's identity wired through every moving part:
 *
 *   node factory/generate.mjs path/to/intake.json [--out ../my-new-site]
 *
 * What it does:
 *   1. Copies the master repo to a new folder (minus .git, node_modules, factory/).
 *   2. Applies an ordered brand/city/phone/owner/service replacement pass to
 *      every text file.
 *   3. Structurally rewrites seo.js (areaServed, geo, hours, alternateName).
 *   4. Regenerates the service route folders from templates for the new slugs.
 *   5. Renames the package, writes .env.example + CLONE_NOTES.md, git init + commit.
 *
 * After it runs, follow FINISH_SETUP.md (backend, Netlify, env, photos) and
 * COPY_BRIEF.md (copy polish). Node 18+, zero dependencies.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MASTER = path.resolve(__dirname, "..");

// ---------------------------------------------------------------- helpers
const die = (msg) => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};
const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const titleCase = (s) => String(s).replace(/\b[a-z]/g, (c) => c.toUpperCase());
const sentenceCase = (s) => {
  const str = String(s);
  return str.charAt(0).toUpperCase() + str.slice(1);
};
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const TEXT_EXT = new Set([
  ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".md", ".json", ".txt",
  ".toml", ".css", ".html", ".gs", ".yml", ".yaml", ".webmanifest", ".svg",
]);

// ---------------------------------------------------------------- args
const args = process.argv.slice(2);
const intakePath = args.find((a) => !a.startsWith("--"));
if (!intakePath) die("Usage: node factory/generate.mjs <intake.json> [--out <dir>]");
const outFlag = args.indexOf("--out");
let intake;
try {
  intake = JSON.parse(fs.readFileSync(path.resolve(intakePath), "utf8"));
} catch (e) {
  die(`Could not read intake JSON at ${intakePath}: ${e.message}`);
}

// ---------------------------------------------------------------- validate
const REQUIRED = [
  "legalName", "brandName", "shortName", "ownerFirstName", "primaryService",
  "gbpCategory", "city", "state", "phoneDigits", "email", "domain",
];
const missing = REQUIRED.filter((k) => !intake[k] || !String(intake[k]).trim());
if (missing.length) die(`Intake is missing required fields: ${missing.join(", ")}`);
if (!/^\d{10}$/.test(String(intake.phoneDigits)))
  die("phoneDigits must be exactly 10 digits (e.g. 8155551234)");
if (!/^[A-Z]{2}$/.test(intake.state))
  die('state must be a 2-letter code (e.g. "IL")');

// ---------------------------------------------------------------- derived
const digits = String(intake.phoneDigits);
const phone = {
  e164: `+1${digits}`,
  pretty: `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`,
  dashed: `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`,
  digits,
};
const citySlug = slugify(intake.city);
const brandSlug = slugify(intake.brandName);
const domain = String(intake.domain).replace(/^https?:\/\//, "").replace(/\/+$/, "");
const OUT = path.resolve(
  outFlag !== -1 ? args[outFlag + 1] : path.join(MASTER, "..", brandSlug)
);
if (OUT === MASTER || OUT.startsWith(MASTER + path.sep))
  die("--out must be OUTSIDE the master repo");
if (fs.existsSync(OUT) && fs.readdirSync(OUT).length)
  die(`Output folder already exists and is not empty: ${OUT}`);

// ---------------------------------------------------------------- master facts
// Pull the master's current social/maps URLs straight from seo.js so the
// generator keeps working even if those values change later.
const masterSeo = fs.readFileSync(path.join(MASTER, "src/lib/seo.js"), "utf8");
const pull = (re, label) => {
  const m = masterSeo.match(re);
  if (!m) die(`Could not locate ${label} in master src/lib/seo.js`);
  return m[1];
};
const masterInstagram = pull(/instagram:\s*"([^"]+)"/, "instagram URL");
const masterFacebook = pull(/facebook:\s*"([^"]+)"/, "facebook URL");
const masterMaps = pull(/mapsUrl:\s*"([^"]+)"/, "google mapsUrl");
const masterCrmLine = pull(/crmReplyLine:\s*\n?\s*"([^"]+)"/, "crmReplyLine");

// ---------------------------------------------------------------- copy tree
const EXCLUDE = new Set([
  ".git", "node_modules", ".next", ".netlify", "factory", ".content-data.json",
  // Never ship master's local secrets or tool state into a clone:
  ".env.local", ".claude", ".torch", "out",
]);
console.log(`\n▸ Copying master → ${OUT}`);
fs.cpSync(MASTER, OUT, {
  recursive: true,
  filter: (src) => {
    const rel = path.relative(MASTER, src);
    if (!rel) return true;
    const top = rel.split(path.sep)[0];
    return !EXCLUDE.has(top);
  },
});

// ---------------------------------------------------------------- replacement rules
// Ordered: longest / most specific first so broader rules never clobber them.
const adminPlaceholder = `changeme-${brandSlug}`;
const rules = buildRules();

function buildRules() {
  const r = [
    // Ordered longest-first. Every shorter rule carries a negative lookahead
    // so it can never re-match inside text a longer rule owns — this keeps
    // the pass idempotent even when intake values overlap master values
    // (the parity test: intake == master must produce a near-zero diff).
    ["FirstStep Junk Removal LLC", intake.legalName],
    ["First Step Junk Removal LLC", intake.legalName],
    [/First Step Junk Removal(?!\s+LLC)/g, intake.brandName],
    [/FirstStep Junk Removal(?!\s+LLC)/g, intake.brandName],
    [/First Step Junk(?!\s+Removal)/g, intake.shortName],
    // Unspaced variant ("FirstStep Junk" — e.g. manifest.webmanifest short_name)
    [/FirstStep Junk(?!\s+Removal)/g, intake.shortName],
    // Plural brand pun ("First Steps.") — the trailing "s" defeats the \b in
    // the standalone rule below, so catch it explicitly first.
    [/\bFirst Steps\b/g, intake.shortName],
    // Standalone "First Step" mentions only — the lookahead stops this rule
    // from re-matching inside already-correct "First Step Junk…" phrases,
    // which kept the pass idempotent (no "Junk Junk" doubling) when intake
    // values overlap master values (e.g. the parity test).
    [/\bFirst Step\b(?!\s+Junk)/g, intake.shortName],
    ["Junk removal service", intake.gbpCategory],
    ["https://firststepjunk.com", `https://${domain}`],
    ["firststepjunk.com", domain],
    ["firststep.junk@gmail.com", intake.email],
    [masterInstagram, intake.social?.instagram || "https://www.instagram.com/"],
    [masterFacebook, intake.social?.facebook || "https://www.facebook.com/"],
    [masterMaps, intake.social?.mapsUrl || "https://maps.google.com/"],
    // public/*.txt carry a longer place URL (plus-encoded name + master's
    // place ID) that differs from content-data's mapsUrl — nuke the whole URL.
    [
      /https:\/\/www\.google\.com\/maps\/place\/FirstStep\+Junk\+Removal\+LLC[^\s")\]]*/g,
      intake.social?.mapsUrl || "https://maps.google.com/",
    ],
    ["+17797721857", phone.e164],
    ["(779) 772-1857", phone.pretty],
    ["779-772-1857", phone.dashed],
    ["7797721857", phone.digits],
    ["Rockford, IL", `${intake.city}, ${intake.state}`],
    // ALL-CAPS display strings (e.g. the hero badge "ROCKFORD'S FRIENDLIEST…")
    [/\bROCKFORD\b/g, String(intake.city).toUpperCase()],
    [/\bRockford\b/g, intake.city],
    [/\brockford\b/g, citySlug],
    [/,\s*IL\b/g, `, ${intake.state}`],
    ['addressRegion: "IL"', `addressRegion: "${intake.state}"`],
    [/\bMichael\b/g, intake.ownerFirstName],
    ["G-D1QT0J7VPN", intake.gaMeasurementId || ""],
    ['ADMIN_PASSWORD = "please"', `ADMIN_PASSWORD = "${adminPlaceholder}"`],
    ["Junk Removal", titleCase(intake.primaryService)],
    ["Junk removal", sentenceCase(intake.primaryService)],
    ["junk removal", String(intake.primaryService).toLowerCase()],
  ];
  if (intake.crmReplyLine) r.push([masterCrmLine, intake.crmReplyLine]);
  for (const { from, to } of intake.extraReplacements || []) r.push([from, to]);
  return r;
}

// ---------------------------------------------------------------- apply pass
const cloneServicePages = path.join(OUT, "src/lib/service-pages.js");
const slugsBefore = [
  ...fs.readFileSync(cloneServicePages, "utf8").matchAll(/slug:\s*"([^"]+)"/g),
].map((m) => m[1]);

let filesTouched = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
      continue;
    }
    if (!TEXT_EXT.has(path.extname(entry.name).toLowerCase())) continue;
    const before = fs.readFileSync(p, "utf8");
    let after = before;
    for (const [from, to] of rules) {
      after = after.replace(
        from instanceof RegExp ? from : new RegExp(escapeRe(from), "g"),
        to
      );
    }
    if (after !== before) {
      fs.writeFileSync(p, after);
      filesTouched++;
    }
  }
}
console.log("▸ Applying brand/city/service replacement pass");
walk(OUT);
console.log(`  ${filesTouched} files rewritten`);

// ---------------------------------------------------------------- seo.js structural pass
console.log("▸ Structural rewrite of src/lib/seo.js");
const seoPath = path.join(OUT, "src/lib/seo.js");
let seo = fs.readFileSync(seoPath, "utf8");
const setBlock = (label, re, replacement) => {
  if (!re.test(seo)) {
    console.warn(`  ! could not find ${label} block — skipped (fix by hand)`);
    return;
  }
  seo = seo.replace(re, replacement);
};
if (Array.isArray(intake.areaServed) && intake.areaServed.length) {
  const list = intake.areaServed.map((a) => `    "${a}",`).join("\n");
  setBlock("areaServed", /areaServed:\s*\[[^\]]*\]/, `areaServed: [\n${list}\n  ]`);
}
if (intake.geo?.latitude && intake.geo?.longitude) {
  setBlock("geo.latitude", /latitude:\s*[-\d.]+/, `latitude: ${intake.geo.latitude}`);
  setBlock("geo.longitude", /longitude:\s*[-\d.]+/, `longitude: ${intake.geo.longitude}`);
} else {
  // No coordinates in the intake — never inherit the master's location.
  // (JSON-LD builder omits the geo block when either value is null.)
  setBlock("geo.latitude", /latitude:\s*[-\d.]+/, "latitude: null");
  setBlock("geo.longitude", /longitude:\s*[-\d.]+/, "longitude: null");
}
if (intake.hours?.opens) setBlock("opens", /opens:\s*"[^"]*"/, `opens: "${intake.hours.opens}"`);
if (intake.hours?.closes) setBlock("closes", /closes:\s*"[^"]*"/, `closes: "${intake.hours.closes}"`);
// Google identity — never inherit the master's KG id, Maps CID, or GBP
// review stats. (JSON-LD builder omits aggregateRating when values are null.)
setBlock(
  "google.knowledgeGraphId",
  /knowledgeGraphId:\s*"[^"]*"/,
  `knowledgeGraphId: ${JSON.stringify(intake.google?.knowledgeGraphId || "")}`
);
setBlock(
  "google.mapsCid",
  /mapsCid:\s*"[^"]*"/,
  `mapsCid: ${JSON.stringify(intake.google?.mapsCid || "")}`
);
setBlock(
  "google.ratingValue",
  /ratingValue:\s*[\d.]+,/,
  `ratingValue: ${intake.google?.ratingValue ?? null},`
);
setBlock(
  "google.reviewCount",
  /reviewCount:\s*\d+,/,
  `reviewCount: ${intake.google?.reviewCount ?? null},`
);
// Offers — master's GBP price list must never ship on a clone. Use intake
// offers when given, otherwise empty the list (builder omits the catalog).
if (Array.isArray(intake.offers) && intake.offers.length) {
  const items = intake.offers
    .map(
      (o) =>
        `    { name: ${JSON.stringify(o.name)}, price: ${JSON.stringify(
          String(o.price)
        )} },`
    )
    .join("\n");
  setBlock("offers", /offers:\s*\[[\s\S]*?\n  \],/, `offers: [\n${items}\n  ],`);
} else {
  setBlock("offers", /offers:\s*\[[\s\S]*?\n  \],/, "offers: [],");
}
setBlock(
  "alternateName",
  /alternateName:\s*\[[^\]]*\]/,
  `alternateName: ["${intake.legalName}"]`
);
fs.writeFileSync(seoPath, seo);

// ---------------------------------------------------------------- service routes
console.log("▸ Regenerating service route folders");
const slugsAfter = [
  ...fs.readFileSync(cloneServicePages, "utf8").matchAll(/slug:\s*"([^"]+)"/g),
].map((m) => m[1]);
const template = fs.readFileSync(
  path.join(__dirname, "templates", "service-route.template.js"),
  "utf8"
);
for (const old of slugsBefore) {
  const dir = path.join(OUT, "src/app", old);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
}
for (const slug of slugsAfter) {
  const dir = path.join(OUT, "src/app", slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.js"), template.replaceAll("__SLUG__", slug));
  console.log(`  /${slug}`);
}

// ---------------------------------------------------------------- theme pass
// Bakes the chosen theme's tokens into the clone's globals.css @theme block
// and stamps defaultContent.theme, so the clone's stock look = the picked
// theme. The owner can still switch any time in Settings → Theming (runtime
// override via published content — see src/components/ThemeStyle.js).
if (intake.theme) {
  console.log(`▸ Applying theme "${intake.theme}"`);
  const catalog = JSON.parse(
    fs.readFileSync(path.join(MASTER, "src/lib/themes.json"), "utf8")
  );
  const theme = catalog.themes.find((t) => t.id === intake.theme);
  if (!theme) {
    console.warn(`  ! unknown theme id "${intake.theme}" — skipped (valid: ${catalog.themes.map((t) => t.id).join(", ")})`);
  } else {
    const cssPath = path.join(OUT, "src/app/globals.css");
    let css = fs.readFileSync(cssPath, "utf8");
    let applied = 0;
    for (const [token, value] of Object.entries(theme.css || {})) {
      const re = new RegExp(`(${escapeRe(token)}:\\s*)[^;]+;`);
      if (re.test(css)) {
        css = css.replace(re, `$1${value};`);
        applied++;
      } else {
        console.warn(`  ! token ${token} not found in globals.css — skipped`);
      }
    }
    fs.writeFileSync(cssPath, css);
    const cdPath = path.join(OUT, "src/lib/content-data.js");
    let cd = fs.readFileSync(cdPath, "utf8");
    if (/theme:\s*"[^"]*"/.test(cd)) {
      cd = cd.replace(/theme:\s*"[^"]*"/, `theme: "${theme.id}"`);
      fs.writeFileSync(cdPath, cd);
    } else {
      console.warn("  ! defaultContent.theme key not found in content-data.js — skipped");
    }
    console.log(`  "${theme.name}" — ${applied} CSS tokens applied`);
  }
}

// ---------------------------------------------------------------- design pass
// Designs (factory/design-templates/registry.json) are a separate axis from
// color themes: whole layouts. status "live" designs ship inside the master,
// so nothing to do; "draft" designs are standalone JSX+SCSS swapped in by
// hand after generation. Here we validate the id and record the choice so the
// follow-up step can't be lost.
let designNote = "";
if (intake.design && intake.design !== "master") {
  const regPath = path.join(MASTER, "factory/design-templates/registry.json");
  const reg = fs.existsSync(regPath)
    ? JSON.parse(fs.readFileSync(regPath, "utf8"))
    : { designs: [] };
  const design = reg.designs.find((d) => d.id === intake.design);
  if (!design) {
    console.warn(`  ! unknown design id "${intake.design}" — skipped (valid: ${reg.designs.map((d) => d.id).join(", ")})`);
  } else {
    console.log(`▸ Design "${design.name}" (${design.status}) — recorded for the post-generation swap`);
    designNote = ` ·
design "${design.name}" requested — a ${design.status} template. Apply it by hand from
\`${design.source}\` (see its README); the clone ships with the master layout until then`;
  }
}

// ---------------------------------------------------------------- package + env + notes
console.log("▸ package.json, .env.example, CLONE_NOTES.md");
const pkgPath = path.join(OUT, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.name = brandSlug;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

fs.writeFileSync(
  path.join(OUT, ".env.example"),
  `# ${intake.brandName} — required environment (set these in Netlify too)
# Apps Script /exec URL from the deployed quote-form backend (FINISH_SETUP.md step 2)
NEXT_PUBLIC_QUOTE_SCRIPT_URL=
QUOTE_SCRIPT_URL=
# Shared token the Apps Script backend checks on reads
SUBMISSIONS_READ_TOKEN=
# GA4 measurement id (leave empty to disable analytics)
NEXT_PUBLIC_GA_MEASUREMENT_ID=${intake.gaMeasurementId || ""}
# Google Ads report deep link for the Settings → Resources card ("" hides the card)
NEXT_PUBLIC_GOOGLE_ADS_URL=
`
);

fs.writeFileSync(
  path.join(OUT, "CLONE_NOTES.md"),
  `# ${intake.brandName} — generated clone

Generated ${new Date().toISOString().slice(0, 10)} from the First Step master by factory/generate.mjs.

## Finish the setup (in order)
1. \`npm install && npm run dev\` — smoke-check the homepage renders with the new identity.
2. Follow **FINISH_SETUP.md** from the master's \`factory/\` folder: Google backend
   (Apps Script + Sheet + Drive), Netlify site + env vars (see \`.env.example\`), domain.
3. **Change the admin password** in \`src/lib/content-data.js\` (currently \`${adminPlaceholder}\`).
4. Replace photos in \`public/images/\` (logo, hero, gallery, owner headshot).
5. Run the copy polish pass per the master's \`factory/COPY_BRIEF.md\`.

## What was auto-swapped
brand/legal/short names · owner first name · phone (all formats) · email ·
domain · city/state (display + slugs + routes) · service phrase · GBP category ·
socials/maps · areaServed/geo/hours · GA id · admin password placeholder${intake.theme ? ` ·
theme "${intake.theme}" (switch any time in /settings → Theming)` : ""}${designNote}.

Prices, testimonials, team bios, FAQ copy, and photos still describe the master
business until steps 4–5 are done.
`
);

// ---------------------------------------------------------------- leak scan
// Belt-and-braces: after every transform, walk the clone for residual master
// identity. Brand patterns are case-SENSITIVE so the generic lowercase idiom
// ("take the first step toward…") never false-positives; each marker is
// skipped when the intake legitimately shares the value (parity runs).
// CLONE_NOTES.md is excluded — it references the master on purpose.
console.log("▸ Leak scan (residual master identity)");
const leakPatterns = [];
if (!/rockford/i.test(intake.city)) leakPatterns.push([/rockford/i, "Rockford"]);
if (!/first ?step/i.test(intake.brandName + intake.shortName + intake.legalName))
  leakPatterns.push([/First ?Steps?|FIRST ?STEPS?/, "First Step (brand-cased)"]);
if (phone.digits !== "7797721857")
  leakPatterns.push([/7797721857|779-772-1857|\(779\) 772-1857/, "master phone"]);
if (!/firststep\.?junk/i.test(domain))
  leakPatterns.push([/firststep\.?junk/i, "firststepjunk domain/email"]);
const leaks = [];
const LEAK_SKIP_DIRS = new Set(["node_modules", ".git", ".next"]);
(function leakScan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (LEAK_SKIP_DIRS.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      leakScan(p);
      continue;
    }
    if (entry.name === "CLONE_NOTES.md") continue;
    if (!TEXT_EXT.has(path.extname(entry.name).toLowerCase())) continue;
    const lines = fs.readFileSync(p, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const [re, label] of leakPatterns)
        if (re.test(line))
          leaks.push(
            `${path.relative(OUT, p)}:${i + 1} [${label}] ${line.trim().slice(0, 100)}`
          );
    });
  }
})(OUT);
if (leaks.length) {
  console.warn(`  ! ${leaks.length} residual master string(s) — fix before shipping:`);
  for (const l of leaks.slice(0, 20)) console.warn(`    ${l}`);
  if (leaks.length > 20) console.warn(`    …and ${leaks.length - 20} more`);
} else {
  console.log("  clean — no residual master identity found");
}

// ---------------------------------------------------------------- git
// Inherit the master repo's git identity (this machine has no global config);
// fall back to a neutral factory identity so the first commit never fails.
console.log("▸ git init + first commit");
function masterGitConfig(key, fallback) {
  try {
    return execSync(`git config ${key}`, { cwd: MASTER, stdio: "pipe", shell: true })
      .toString()
      .trim() || fallback;
  } catch {
    return fallback;
  }
}
try {
  const gitName = masterGitConfig("user.name", "Site Factory");
  const gitEmail = masterGitConfig("user.email", "factory@localhost");
  execSync(
    `git init -q && git config user.name "${gitName}" && git config user.email "${gitEmail}" && git add -A && git commit -q -m "Initial clone from First Step master via site factory"`,
    { cwd: OUT, stdio: "pipe", shell: true }
  );
} catch (e) {
  console.warn(`  ! git step failed (${e.message.split("\n")[0]}) — run it by hand`);
}

// ---------------------------------------------------------------- done
console.log(`
✔ Clone generated: ${OUT}

Next steps:
  1. cd "${OUT}" && npm install && npm run dev
  2. Open FINISH_SETUP.md (in master factory/) and work top to bottom.
  3. Copy polish per factory/COPY_BRIEF.md, photos in public/images/.
`);
