"use client";

import { useEffect, useState } from "react";
import { ADMIN_PASSWORD, IMAGE_KEYS, defaultContent } from "@/lib/content-data";
import THEMES from "@/lib/themes.json";
import CrmTab from "./CrmTab";

// First Step Junk invoice generator. "?provider=junk" asks the invoice app to
// start as First Step Junk (the app itself must read this param).
const INVOICE_URL = "https://fsj-invoice.netlify.app/?provider=junk";

// Per-business: set NEXT_PUBLIC_GOOGLE_ADS_URL in the site's env (Netlify).
// Falls back to the First Step report when the var is not defined at build
// time; set it to an empty string on clones to hide the card entirely.
const GOOGLE_ADS_URL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_URL ??
  "https://ads.google.com/aw/unifiedassetreport/pmaxassetdetails?campaignId=23973976752&ocid=8342188468&workspaceId=0&entityId=6725828803&isPMax=true&assetGroupId=6725828803&authuser=1&__u=8735719831&__c=7016749332";

// Apple system font stack — renders as SF Pro on iPhone/Mac.
const IOS_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", system-ui, sans-serif';

// Keys never shown in the free-text editor (handled in the Photos tab instead).
const SKIP_KEYS = new Set([...IMAGE_KEYS, "published", "images"]);

// Sections that are nothing but photos — the Photos tab owns them.
const SKIP_SECTIONS = new Set(["siteImages"]);

// Strong page-anchored section headers for the Website Text tab. Each entry
// names WHERE on the page the copy lives (in page order, top to bottom).
const SECTION_META = {
  nav: { title: "NAVIGATION", where: "Menu bar — links & quote button", icon: "menu", tint: "#5856d6" },
  hero: { title: "HERO (TOP OF PAGE)", where: "The first screen visitors see", icon: "home", tint: "#007aff" },
  whyUs: { title: "WHY US", where: `“${defaultContent.whyUs?.heading ?? "Why choose us"}” comparison`, icon: "thumb_up", tint: "#34c759" },
  services: { title: "SERVICES", where: "Service cards & add-ons", icon: "handyman", tint: "#ff9500" },
  ctaBanner: { title: "CALL-TO-ACTION BANNER", where: `“${defaultContent.ctaBanner?.heading ?? "Call to action"}” strip (mid-page)`, icon: "campaign", tint: "#ff2d55" },
  disasters: { title: "INDUSTRY DISASTERS", where: "Problem vs. solution cards", icon: "warning", tint: "#ff3b30" },
  gallery: { title: "GALLERY (OUR WORK)", where: "Heading & intro above the job photos", icon: "photo_library", tint: "#af52de" },
  team: { title: "MEET THE TEAM", where: "Crew names, roles & bios", icon: "groups", tint: "#30b0c7" },
  quote: { title: "QUOTE FORM (BOTTOM OF PAGE)", where: "Form copy & the sent-confirmation screen", icon: "request_quote", tint: "#003e1c" },
  contact: { title: "CONTACT INFO", where: "Phone & email used across the whole site", icon: "call", tint: "#34c759" },
  footer: { title: "FOOTER (VERY BOTTOM)", where: "Tagline, link list & copyright", icon: "vertical_align_bottom", tint: "#8e8e93" },
};

// Plain-English labels for cryptic field keys, so the owner never has to
// decode names like "titleLine1" or "t".
const FIELD_LABELS = {
  titleLine1: "Main title — line 1",
  titleLine2: "Main title — line 2",
  subtitle: "Subtitle",
  badge: "Badge (small pill above the title)",
  primaryCta: "Primary button",
  secondaryCta: "Secondary button",
  floatTitle: "Floating card — title",
  floatText: "Floating card — text",
  cta: "Button label",
  est: "“Established” badge",
  mainTitle: "Main card — title",
  mainBody: "Main card — text",
  mainTag1: "Main card — tag 1",
  mainTag2: "Main card — tag 2",
  pestTitle: "Add-on card 1 — title",
  pestBody: "Add-on card 1 — text",
  repairTitle: "Add-on card 2 — title",
  repairBody: "Add-on card 2 — text",
  t: "Point — title",
  d: "Point — description",
  eyebrow: "Eyebrow (small text above heading)",
  intro: "Intro paragraph",
  heading: "Heading",
  amateurTitle: `“${defaultContent.whyUs?.amateurTitle ?? "The Amateur Way"}” — title`,
  firstStepTitle: `“${defaultContent.whyUs?.firstStepTitle ?? "The Right Way"}” — title`,
  addPhotosTitle: "Add-photos card — title",
  addPhotosText: "Add-photos card — text",
  callTitle: "Call card — title",
  successHeading: "Success screen — heading",
  successText: "Success screen — text",
  submitLabel: "Submit button label",
  phoneHref: "Phone link (keep tel: format)",
  tagline: "Tagline",
  servicesHeading: "Services column — heading",
  contactHeading: "Contact column — heading",
  location: "Service-area line",
  copyright: "Copyright line",
  quote: "Customer quote",
  body: "Body text",
  title: "Title",
  label: "Label",
  href: "Link target",
  name: "Name",
  role: "Role",
  bio: "Bio",
  alt: "Caption",
  phone: "Phone number",
  email: "Email address",
};

function humanize(key) {
  if (/^\d+$/.test(String(key))) return `Item ${Number(key) + 1}`;
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

// Label an array item by what it IS (member name, point title…), not "Item 3".
function itemLabel(item, i) {
  if (item && typeof item === "object") {
    const name = item.name || item.t || item.title || item.label;
    if (name) return String(name);
  }
  return `Item ${i + 1}`;
}

function setAtPath(root, path, value) {
  const next = structuredClone(root);
  let node = next;
  for (let i = 0; i < path.length - 1; i++) node = node[path[i]];
  node[path[path.length - 1]] = value;
  return next;
}

function getAtPath(root, path) {
  return path.reduce((acc, k) => (acc == null ? acc : acc[k]), root);
}

/* ---------------- iOS toggle switch ---------------- */
function IOSSwitch({ on, onClick, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative inline-flex h-[31px] w-[51px] flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
        on ? "bg-[#34c759]" : "bg-[#e9e9ea]"
      }`}
    >
      <span
        className={`inline-block h-[27px] w-[27px] transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-transform duration-200 ${
          on ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

// ---------------- Theming tab ----------------
// Theme definitions live in src/lib/themes.json (factory-wide catalog).
// Picking one stores `content.theme`; Save & Publish makes it live via the
// same Sheet pipeline as text/photos — <ThemeStyle/> applies it per-request.
function ThemingTab({ content, update }) {
  const current = content.theme || "master";
  return (
    <section>
      <p className="mb-4 text-[13px] leading-snug text-[#8e8e93]">
        Pick the site&apos;s color theme. It applies to the whole website for
        everyone — tap <strong className="font-semibold text-black">Save &amp; Publish</strong>{" "}
        below to make it live. You can switch back any time.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {THEMES.themes.map((th) => {
          const v = th.vars || {};
          const active = current === th.id;
          return (
            <button
              key={th.id}
              type="button"
              onClick={() => update("theme", th.id)}
              className={`rounded-[14px] bg-white p-3 text-left shadow-sm transition-all active:scale-[0.98] ${
                active ? "ring-2 ring-[#007aff]" : "ring-1 ring-black/[0.06]"
              }`}
            >
              <span className="flex gap-1.5">
                {["primary", "accent", "bg", "text"].map(
                  (k) =>
                    v[k] && (
                      <span
                        key={k}
                        className="h-6 w-6 rounded-[8px] border border-black/10"
                        style={{ background: v[k] }}
                        title={`${k}: ${v[k]}`}
                      />
                    )
                )}
              </span>
              <span className="mt-2 flex items-center gap-1 text-[15px] font-semibold text-black">
                {th.name}
                {active && (
                  <span className="material-symbols-outlined text-[18px] text-[#007aff]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-[12px] leading-snug text-[#8e8e93]">{th.style}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function SettingsApp() {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");

  const [content, setContent] = useState(null);
  const [tab, setTab] = useState("crm");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  // Persist unlock for the browser session only.
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("fs_admin_unlocked") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of session flag on mount
      setUnlocked(true);
    }
  }, []);

  // Load current content once unlocked (setState happens in async callbacks, not synchronously).
  useEffect(() => {
    if (!unlocked || content) return;
    let cancelled = false;
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setContent(data);
      })
      .catch(() => {
        if (!cancelled) setContent(structuredClone(defaultContent));
      });
    return () => {
      cancelled = true;
    };
  }, [unlocked, content]);

  function tryUnlock(e) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setUnlocked(true);
      setPwError("");
      if (typeof window !== "undefined") sessionStorage.setItem("fs_admin_unlocked", "1");
    } else {
      setPwError("Incorrect password.");
    }
  }

  function update(path, value) {
    setContent((c) => setAtPath(c, path, value));
  }

  async function save() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: ADMIN_PASSWORD, content }),
      });
      const data = await res.json();
      if (data.ok) {
        setSaveMsg({
          type: "success",
          text:
            data.store === "sheet"
              ? "Saved & published live to the website (via Google Sheet)."
              : "Saved locally (dev). Add the Apps Script URL + read token to publish live.",
        });
      } else {
        setSaveMsg({ type: "error", text: data.error || "Save failed." });
      }
    } catch (err) {
      setSaveMsg({ type: "error", text: String(err?.message || err) });
    } finally {
      setSaving(false);
    }
  }

  function resetDefaults() {
    if (confirm("Reset ALL text and image settings back to the original defaults? This can't be undone after you Save.")) {
      setContent(structuredClone(defaultContent));
      setSaveMsg({ type: "info", text: "Reset to defaults — click Save to publish." });
    }
  }

  // ---------------- password gate ----------------
  if (!unlocked) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#f2f2f7] px-4"
        style={{ fontFamily: IOS_FONT }}
      >
        <form onSubmit={tryUnlock} className="w-full max-w-[340px] text-center">
          <div className="mb-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[22px] bg-gradient-to-b from-[#0a84ff] to-[#0060df] shadow-lg">
              <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-black">Site Settings</h1>
            <p className="mt-1 text-[15px] text-[#8e8e93]">Enter the password to continue.</p>
          </div>
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="h-[52px] w-full rounded-[14px] border border-transparent bg-white px-4 text-center text-[17px] text-black shadow-sm outline-none focus:border-[#0a84ff]"
          />
          {pwError && <p className="mt-3 text-[15px] text-[#ff3b30]">{pwError}</p>}
          <button
            type="submit"
            className="mt-5 h-[52px] w-full rounded-[14px] bg-[#007aff] text-[17px] font-semibold text-white transition-transform active:scale-[0.98]"
          >
            Unlock
          </button>
        </form>
      </main>
    );
  }

  // ---------------- loading ----------------
  if (!content) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#f2f2f7]"
        style={{ fontFamily: IOS_FONT }}
      >
        <p className="animate-pulse text-[15px] text-[#8e8e93]">Loading settings…</p>
      </main>
    );
  }

  const tabs = [
    { id: "crm", label: "CRM", icon: "dashboard" },
    { id: "text", label: "Text", icon: "edit_note" },
    { id: "photos", label: "Photos", icon: "image" },
    { id: "theming", label: "Theming", icon: "palette" },
    { id: "resources", label: "Links", icon: "link" },
    { id: "form", label: "Message", icon: "mail" },
  ];

  const showSaveBar = tab === "text" || tab === "photos" || tab === "theming";

  return (
    <main
      className={`min-h-screen bg-[#f2f2f7] text-black ${showSaveBar ? "pb-36" : "pb-16"}`}
      style={{ fontFamily: IOS_FONT }}
    >
      {/* iOS large-title header */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#f9f9f9]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 pb-2 pt-3">
          <div className="flex items-center justify-between">
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-0.5 text-[17px] font-normal text-[#007aff]">
              <span className="material-symbols-outlined text-xl">chevron_left</span>
              Site
            </a>
            <span className="text-[15px] font-semibold text-black/80">Settings</span>
            <div className="flex items-center gap-1.5">
              {/* Direct link: First Step Junk invoice generator */}
              <a
                href={INVOICE_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-[#af52de] py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-white shadow-sm transition-transform active:scale-[0.96]"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  receipt_long
                </span>
                Invoice
              </a>
              {/* Call to action: live front-end editor (eye icon per site icon style) */}
              <a
                href="/settings/editor"
                className="flex items-center gap-1.5 rounded-full bg-[#007aff] py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-white shadow-sm transition-transform active:scale-[0.96]"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  visibility
                </span>
                Site Editor
              </a>
            </div>
          </div>
          <h1 className="mt-1 text-[32px] font-bold tracking-tight text-black">Settings</h1>
        </div>

        {/* iOS segmented control */}
        <div className="mx-auto max-w-2xl px-4 pb-3">
          <div className="flex gap-0.5 rounded-[10px] bg-[#767680]/[0.12] p-0.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-[8px] py-1.5 text-[13px] font-semibold transition-all ${
                  tab === t.id ? "bg-white text-black shadow-sm" : "text-black/60"
                }`}
              >
                <span className="material-symbols-outlined text-base">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className={`mx-auto px-4 py-6 ${tab === "crm" ? "max-w-7xl" : "max-w-2xl"}`}>
        {tab === "crm" && <CrmTab />}
        {tab === "text" && <TextTab content={content} update={update} />}
        {tab === "photos" && <PhotosTab content={content} update={update} />}
        {tab === "theming" && <ThemingTab content={content} update={update} />}
        {tab === "resources" && <ResourcesTab />}
        {tab === "form" && <ContactFormTab />}
      </div>

      {/* iOS-style sticky save bar */}
      {showSaveBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-[#f9f9f9]/90 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl px-4 py-3">
            {saveMsg && (
              <p
                className={`mb-2 text-center text-[13px] ${
                  saveMsg.type === "success"
                    ? "text-[#34c759]"
                    : saveMsg.type === "error"
                    ? "text-[#ff3b30]"
                    : "text-[#8e8e93]"
                }`}
              >
                {saveMsg.text}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={resetDefaults}
                className="h-[50px] flex-shrink-0 rounded-[14px] bg-[#767680]/[0.12] px-5 text-[15px] font-semibold text-[#ff3b30] transition-transform active:scale-[0.98]"
              >
                Reset
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="h-[50px] flex-1 rounded-[14px] bg-[#007aff] text-[17px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save & Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------------- iOS grouped list primitives ---------------- */
function GroupLabel({ children }) {
  return (
    <p className="mb-2 ml-4 text-[13px] font-normal uppercase tracking-wide text-[#6d6d72]">{children}</p>
  );
}

// Strong page-anchored section header: tinted icon chip + bold uppercase
// title + a "where this appears on the page" hint.
function SectionHeader({ meta, fallback }) {
  const m = meta || { title: fallback, where: "", icon: "description", tint: "#8e8e93" };
  return (
    <div className="mb-2.5 flex items-center gap-3 px-1">
      <span
        className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[9px]"
        style={{ backgroundColor: m.tint }}
      >
        <span className="material-symbols-outlined text-[20px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
          {m.icon}
        </span>
      </span>
      <div className="min-w-0">
        <p className="text-[15px] font-bold uppercase tracking-wide text-black">{m.title}</p>
        {m.where && <p className="text-[13px] leading-tight text-[#8e8e93]">{m.where}</p>}
      </div>
    </div>
  );
}

function Group({ children }) {
  return (
    <div className="overflow-hidden rounded-[12px] bg-white">
      <div className="divide-y divide-black/[0.07]">{children}</div>
    </div>
  );
}

// ---------------- Website Text tab (recursive editor) ----------------
function TextTab({ content, update }) {
  return (
    <div className="space-y-7">
      <p className="px-1 text-[15px] leading-snug text-[#6d6d72]">
        Edit any text on the website below. Changes go live for everyone after you tap{" "}
        <strong className="font-semibold text-black">Save &amp; Publish</strong>.
      </p>
      {Object.keys(content).filter((k) => !SKIP_SECTIONS.has(k)).map((sectionKey) => (
        <section key={sectionKey}>
          <SectionHeader meta={SECTION_META[sectionKey]} fallback={humanize(sectionKey)} />
          <Group>
            <div className="p-4">
              <Fields node={content[sectionKey]} path={[sectionKey]} update={update} />
            </div>
          </Group>
        </section>
      ))}
    </div>
  );
}

function Fields({ node, path, update }) {
  if (Array.isArray(node)) {
    return (
      <div className="space-y-4">
        {node.map((item, i) => (
          <div key={i} className="rounded-[10px] bg-[#f2f2f7] p-3">
            {typeof item === "object" && item !== null ? (
              <>
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#8e8e93]">{itemLabel(item, i)}</p>
                <Fields node={item} path={[...path, i]} update={update} />
              </>
            ) : (
              <LeafField label={`Item ${i + 1}`} value={item} path={[...path, i]} update={update} />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (node !== null && typeof node === "object") {
    return (
      <div className="space-y-4">
        {Object.keys(node).map((key) => {
          if (SKIP_KEYS.has(key)) return null;
          const value = node[key];
          if (value !== null && typeof value === "object") {
            return (
              <div key={key}>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#8e8e93]">{humanize(key)}</p>
                <Fields node={value} path={[...path, key]} update={update} />
              </div>
            );
          }
          return <LeafField key={key} label={humanize(key)} value={value} path={[...path, key]} update={update} />;
        })}
      </div>
    );
  }

  return <LeafField label={humanize(path[path.length - 1])} value={node} path={path} update={update} />;
}

function LeafField({ label, value, path, update }) {
  const str = value == null ? "" : String(value);
  const long = str.length > 70 || str.includes("\n");
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#6d6d72]">{label}</span>
      {long ? (
        <textarea
          value={str}
          rows={Math.min(8, Math.max(3, Math.ceil(str.length / 60)))}
          onChange={(e) => update(path, e.target.value)}
          className="w-full rounded-[10px] border border-black/10 bg-[#f2f2f7] p-3 text-[15px] text-black outline-none focus:border-[#007aff] focus:bg-white"
        />
      ) : (
        <input
          type="text"
          value={str}
          onChange={(e) => update(path, e.target.value)}
          className="h-[44px] w-full rounded-[10px] border border-black/10 bg-[#f2f2f7] px-3 text-[15px] text-black outline-none focus:border-[#007aff] focus:bg-white"
        />
      )}
    </label>
  );
}

// ---------------- Photos tab ----------------
// One row per photo: thumbnail, plain-English label, and the path it points
// at. The Site Editor does the same job by tapping the photo on the page —
// this is the list view for anyone who'd rather see them all at once.
function PhotoRow({ label, hint, value, onChange }) {
  return (
    <div className="flex items-center gap-3 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={value}
        alt=""
        className="h-14 w-14 flex-shrink-0 rounded-[10px] bg-[#f2f2f7] object-cover"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />
      <div className="min-w-0 flex-grow">
        <p className="text-[15px] font-semibold text-black">{label}</p>
        {hint && <p className="text-[12px] leading-tight text-[#8e8e93]">{hint}</p>}
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/your-photo.jpg"
          className="mt-1 h-9 w-full rounded-[8px] bg-[#f2f2f7] px-2.5 text-[13px] text-black outline-none focus:ring-2 focus:ring-[#007aff]"
        />
      </div>
    </div>
  );
}

function PhotosTab({ content, update }) {
  const images = content.gallery?.images || [];
  const members = content.team?.members || [];
  const publishedCount = images.filter((i) => i.published !== false).length;

  const pagePhotos = [
    { path: ["hero", "beforeImage"], label: "Hero — “before”", hint: "Left side of the drag slider: the junk-filled shot." },
    { path: ["hero", "afterImage"], label: "Hero — “after”", hint: "Right side of the drag slider: the same space cleared." },
    { path: ["siteImages", "logo"], label: "Logo", hint: "Menu bar, mid-page banner and footer." },
    { path: ["whyUs", "image"], label: "Why Us section" },
    { path: ["services", "image"], label: "Services section" },
    { path: ["quote", "image"], label: "Quote form section" },
    ...(content.disasters?.cards || []).map((card, i) => ({
      path: ["disasters", "cards", i, "image"],
      label: `Disasters card ${i + 1}`,
      hint: card.title,
    })),
  ];

  return (
    <div className="space-y-8">
      <section>
        <GroupLabel>Page Photos</GroupLabel>
        <p className="mb-3 px-1 text-[15px] leading-snug text-[#6d6d72]">
          Every photo on the page. Drop new files into{" "}
          <code className="rounded bg-black/[0.06] px-1 text-[13px]">public/images/</code> and point a
          row at it — or just tap the photo in the{" "}
          <a href="/settings/editor" className="font-semibold text-[#007aff]">
            Site Editor
          </a>
          .
        </p>
        <Group>
          {pagePhotos.map((p) => (
            <PhotoRow
              key={p.path.join(".")}
              label={p.label}
              hint={p.hint}
              value={getAtPath(content, p.path) || ""}
              onChange={(v) => update(p.path, v)}
            />
          ))}
        </Group>
      </section>

      <section>
        <div className="mb-2 flex items-end justify-between px-1">
          <GroupLabel>Gallery Photos</GroupLabel>
          <span className="mb-2 text-[13px] text-[#8e8e93]">
            {publishedCount} of {images.length} shown
          </span>
        </div>
        <p className="mb-3 px-1 text-[15px] leading-snug text-[#6d6d72]">
          Toggle which job photos appear in the website gallery.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, i) => {
            const on = img.published !== false;
            return (
              <div
                key={img.src + i}
                className={`overflow-hidden rounded-[14px] bg-white shadow-sm transition-opacity ${on ? "" : "opacity-50"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="h-28 w-full object-cover" />
                <div className="space-y-2 p-2.5">
                  <input
                    type="text"
                    value={img.alt || ""}
                    onChange={(e) => update(["gallery", "images", i, "alt"], e.target.value)}
                    placeholder="Caption"
                    className="h-9 w-full rounded-[8px] bg-[#f2f2f7] px-2.5 text-[13px] text-black outline-none focus:ring-2 focus:ring-[#007aff]"
                  />
                  <div className="flex items-center justify-between">
                    <span className={`text-[13px] font-medium ${on ? "text-black" : "text-[#8e8e93]"}`}>
                      {on ? "Shown" : "Hidden"}
                    </span>
                    <IOSSwitch
                      on={on}
                      onClick={() => update(["gallery", "images", i, "published"], !on)}
                      label={`Toggle ${img.alt || "photo"}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <GroupLabel>Team Photos</GroupLabel>
        <p className="mb-3 px-1 text-[15px] leading-snug text-[#6d6d72]">
          Toggle team members on/off and set each photo path. Upload into{" "}
          <code className="rounded bg-black/[0.06] px-1 text-[13px]">public/images/team/</code> and set the path (e.g.{" "}
          <code className="rounded bg-black/[0.06] px-1 text-[13px]">/images/team/michael.jpg</code>).
        </p>
        <Group>
          {members.map((m, i) => {
            const on = m.published !== false;
            return (
              <div key={m.name + i} className="flex items-center gap-3 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.photo}
                  alt={m.name}
                  className="h-14 w-14 flex-shrink-0 rounded-[10px] object-cover"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
                <div className="min-w-0 flex-grow">
                  <p className="text-[15px] font-semibold text-black">{m.name}</p>
                  <input
                    type="text"
                    value={m.photo || ""}
                    onChange={(e) => update(["team", "members", i, "photo"], e.target.value)}
                    placeholder="/images/gallery/g09.webp"
                    className="mt-1 h-9 w-full rounded-[8px] bg-[#f2f2f7] px-2.5 text-[13px] text-black outline-none focus:ring-2 focus:ring-[#007aff]"
                  />
                </div>
                <IOSSwitch
                  on={on}
                  onClick={() => update(["team", "members", i, "published"], !on)}
                  label={`Toggle ${m.name}`}
                />
              </div>
            );
          })}
        </Group>
      </section>
    </div>
  );
}

// ---------------- Resources tab ----------------
function ResourcesTab() {
  const resources = [
    ...(GOOGLE_ADS_URL
      ? [
          {
            icon: "ads_click",
            tint: "#ff9500",
            title: "Google Ads — Performance Max",
            desc: "Open your Performance Max asset detail report.",
            url: GOOGLE_ADS_URL,
          },
        ]
      : []),
    {
      icon: "fact_check",
      tint: "#34c759",
      title: "Intake CRM",
      desc: "Review every submission with photos.",
      url: "/submissions",
    },
    {
      icon: "assignment",
      tint: "#007aff",
      title: "Jobs CRM",
      desc: "Track each intake as a job card for follow-up.",
      url: "/jobs",
    },
    {
      icon: "receipt_long",
      tint: "#af52de",
      title: "Invoice Generator",
      desc: "Create PDF invoices as First Step Junk.",
      url: INVOICE_URL,
    },
    {
      icon: "travel_explore",
      tint: "#5856d6",
      title: "SEO & AI guide",
      desc: "Why local/Gemini visibility works + GBP checklist. Private.",
      url: "/seos",
    },
  ];

  return (
    <div>
      <GroupLabel>Business Tools</GroupLabel>
      <Group>
        {resources.map((r) => (
          <a
            key={r.title}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-3 transition-colors active:bg-black/[0.04]"
          >
            <span
              className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[7px]"
              style={{ backgroundColor: r.tint }}
            >
              <span className="material-symbols-outlined text-[19px] text-white">{r.icon}</span>
            </span>
            <div className="min-w-0 flex-grow">
              <p className="text-[16px] leading-tight text-black">{r.title}</p>
              <p className="mt-0.5 text-[13px] leading-tight text-[#8e8e93]">{r.desc}</p>
            </div>
            <span className="material-symbols-outlined flex-shrink-0 text-xl text-[#c4c4c6]">chevron_right</span>
          </a>
        ))}
      </Group>
    </div>
  );
}

// ---------------- Contact Form tab (real, Netlify-registered) ----------------
function ContactFormTab() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSending(true);
    const data = new FormData(e.target);
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-[12px] bg-white p-10 text-center">
        <span className="material-symbols-outlined text-5xl text-[#34c759]" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
        <h2 className="mt-2 text-xl font-bold text-black">Message sent!</h2>
        <p className="mt-1 text-[15px] text-[#8e8e93]">It will show up in your Netlify Forms inbox.</p>
      </div>
    );
  }

  return (
    <div>
      <GroupLabel>Send a test / internal message</GroupLabel>
      <p className="mb-3 px-1 text-[15px] leading-snug text-[#6d6d72]">
        A working form wired to Netlify Forms — use it to test notifications or jot an internal note.
      </p>
      <form
        name="settings-contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={onSubmit}
      >
        <input type="hidden" name="form-name" value="settings-contact" />
        <p className="hidden">
          <label>Skip: <input name="bot-field" /></label>
        </p>
        <Group>
          <div className="p-3">
            <span className="mb-1.5 block text-[13px] font-medium text-[#6d6d72]">Name</span>
            <input
              name="name"
              required
              className="h-[44px] w-full rounded-[10px] bg-[#f2f2f7] px-3 text-[15px] text-black outline-none focus:ring-2 focus:ring-[#007aff]"
            />
          </div>
          <div className="p-3">
            <span className="mb-1.5 block text-[13px] font-medium text-[#6d6d72]">Email</span>
            <input
              name="email"
              type="email"
              className="h-[44px] w-full rounded-[10px] bg-[#f2f2f7] px-3 text-[15px] text-black outline-none focus:ring-2 focus:ring-[#007aff]"
            />
          </div>
          <div className="p-3">
            <span className="mb-1.5 block text-[13px] font-medium text-[#6d6d72]">Message</span>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full rounded-[10px] bg-[#f2f2f7] p-3 text-[15px] text-black outline-none focus:ring-2 focus:ring-[#007aff]"
            />
          </div>
        </Group>
        <button
          type="submit"
          disabled={sending}
          className="mt-4 h-[50px] w-full rounded-[14px] bg-[#007aff] text-[17px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
