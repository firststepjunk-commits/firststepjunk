"use client";

import { createContext, useContext, useMemo, useState } from "react";
/* Generated copy of factory/themes.json — see the `sync-themes` npm script. */
import THEME_CATALOG from "../themes.gen.json";
/* Generated copy of factory/design-templates/registry.json — `sync-designs`. */
import DESIGN_CATALOG from "../designs.gen.json";

/* Mirrors factory/generate.mjs — the generator refuses to run without these. */
const REQUIRED = [
  "legalName", "brandName", "shortName", "ownerFirstName", "primaryService",
  "gbpCategory", "city", "state", "phoneDigits", "email", "domain",
];

const t = (v) => String(v ?? "").trim();
const lines = (v) => t(v).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
const slugify = (s) =>
  t(s).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function validate(v) {
  const e = {};
  for (const k of REQUIRED) if (!t(v[k])) e[k] = "Required.";
  if (t(v.state) && !/^[A-Za-z]{2}$/.test(t(v.state))) e.state = "2-letter code, e.g. IL.";
  if (t(v.phoneDigits) && t(v.phoneDigits).replace(/\D/g, "").length !== 10)
    e.phoneDigits = "Exactly 10 digits.";
  if (t(v.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t(v.email)))
    e.email = "Doesn't look like an email address.";
  const dom = t(v.domain).replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
  if (t(v.domain) && !/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(dom))
    e.domain = "Domain only, e.g. firststepjunk.com.";
  for (const k of ["opens", "closes"])
    if (t(v[k]) && !/^\d{2}:\d{2}$/.test(t(v[k]))) e[k] = "24h HH:MM, e.g. 07:30.";
  const lat = t(v.latitude), lng = t(v.longitude);
  if (lat && !lng) e.longitude = "Provide both coordinates.";
  if (!lat && lng) e.latitude = "Provide both coordinates.";
  if (lat && Number.isNaN(Number(lat))) e.latitude = "Number, e.g. 42.2711.";
  if (lng && Number.isNaN(Number(lng))) e.longitude = "Number, e.g. -89.094.";
  if (t(v.gaMeasurementId) && !/^G-[A-Z0-9]{4,}$/i.test(t(v.gaMeasurementId)))
    e.gaMeasurementId = 'Looks like "G-XXXXXXXXXX" — or leave blank.';
  for (const u of ["instagram", "facebook", "mapsUrl"])
    if (t(v[u]) && !/^https?:\/\//i.test(t(v[u]))) e[u] = "Full URL starting with https://";
  for (const line of lines(v.extraReplacements))
    if (!/\s=>\s/.test(line)) {
      e.extraReplacements = "Each line must be:  old text => new text";
      break;
    }
  return e;
}

/* Assembles JSON in the exact shape of factory/intake.sample.json. */
function buildIntake(v) {
  const intake = {
    legalName: t(v.legalName),
    brandName: t(v.brandName),
    shortName: t(v.shortName),
    ownerFirstName: t(v.ownerFirstName),
    primaryService: t(v.primaryService).toLowerCase(),
    gbpCategory: t(v.gbpCategory),
    city: t(v.city),
    state: t(v.state).toUpperCase(),
    phoneDigits: t(v.phoneDigits).replace(/\D/g, ""),
    email: t(v.email),
    domain: t(v.domain).replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase(),
  };
  const area = lines(v.areaServed);
  if (area.length) intake.areaServed = area;
  if (t(v.latitude) && t(v.longitude))
    intake.geo = { latitude: Number(v.latitude), longitude: Number(v.longitude) };
  if (t(v.opens) || t(v.closes)) {
    intake.hours = {};
    if (t(v.opens)) intake.hours.opens = t(v.opens);
    if (t(v.closes)) intake.hours.closes = t(v.closes);
  }
  const social = {};
  for (const k of ["instagram", "facebook", "mapsUrl"]) if (t(v[k])) social[k] = t(v[k]);
  if (Object.keys(social).length) intake.social = social;
  if (t(v.gaMeasurementId)) intake.gaMeasurementId = t(v.gaMeasurementId).toUpperCase();
  if (t(v.theme)) intake.theme = t(v.theme);
  if (t(v.design) && t(v.design) !== "master") intake.design = t(v.design);
  if (t(v.crmReplyLine)) intake.crmReplyLine = t(v.crmReplyLine);
  const er = lines(v.extraReplacements)
    .map((l) => {
      const m = l.split(/\s=>\s/);
      return m.length === 2 ? { from: m[0].trim(), to: m[1].trim() } : null;
    })
    .filter(Boolean);
  if (er.length) intake.extraReplacements = er;
  const bio = lines(v.ownerBioFacts);
  if (bio.length) intake.$ownerBioFacts = bio; // copy-pass notes; generator ignores $-keys
  return intake;
}

const Ctx = createContext(null);
const useCtx = () => useContext(Ctx);

export function IntakeForm({ children }) {
  const [values, setValues] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null); // null | "ok" | "fail" | "skipped"
  const [result, setResult] = useState(null); // { json, filename }

  const errors = useMemo(() => validate(values), [values]);
  const setValue = (name, v) => setValues((old) => ({ ...old, [name]: v }));

  async function submit(downloadOnly) {
    setAttempted(true);
    if (Object.keys(errors).length) {
      requestAnimationFrame(() =>
        document.querySelector(".err")?.scrollIntoView({ behavior: "smooth", block: "center" })
      );
      return;
    }
    const intake = buildIntake(values);
    const json = JSON.stringify(intake, null, 2);
    const filename = `${slugify(intake.brandName)}-intake.json`;
    setResult({ json, filename });
    if (downloadOnly) {
      setSent("skipped");
      return;
    }
    setSending(true);
    try {
      const body = new URLSearchParams({
        "form-name": "site-intake",
        brandName: intake.brandName,
        legalName: intake.legalName,
        email: intake.email,
        phoneDigits: intake.phoneDigits,
        city: intake.city,
        state: intake.state,
        domain: intake.domain,
        theme: intake.theme || "",
        design: intake.design || "",
        payload: json,
      });
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      setSent(res.ok ? "ok" : "fail");
    } catch {
      setSent("fail");
    } finally {
      setSending(false);
    }
  }

  return (
    <Ctx.Provider value={{ values, setValue, attempted, errors, submit, sending, sent, result }}>
      <form onSubmit={(e) => { e.preventDefault(); submit(false); }} noValidate>
        <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />
        {children}
      </form>
    </Ctx.Provider>
  );
}

export function Section({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Row({ children }) {
  return <div className="row2">{children}</div>;
}

export function Field({ name, label, required = false, hint, placeholder, type = "text", rows = 3 }) {
  const { values, setValue, attempted, errors } = useCtx();
  const err = attempted ? errors[name] : null;
  const cls = (base) => base + (err ? " invalid" : "");
  const common = {
    id: name,
    value: values[name] ?? "",
    placeholder,
    onChange: (e) => setValue(name, e.target.value),
  };
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="req" title="Required">★</span>}
      </label>
      {hint && <span className="hint">{hint}</span>}
      {type === "textarea" ? (
        <textarea className={cls("textarea")} rows={rows} {...common} />
      ) : (
        <input className={cls("input")} type={type} {...common} />
      )}
      {err && <div className="err">{err}</div>}
    </div>
  );
}

export function ThemePicker({ name = "theme" }) {
  const { values, setValue } = useCtx();
  const sel = values[name] ?? "";
  return (
    <div className="themes" role="radiogroup" aria-label="Theme">
      {THEME_CATALOG.themes.map((th) => {
        const v = th.vars;
        const active = sel === th.id;
        return (
          <button
            type="button"
            role="radio"
            aria-checked={active}
            key={th.id}
            className={"theme-card" + (active ? " selected" : "")}
            onClick={() => setValue(name, active ? "" : th.id)}
          >
            {th.preview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="theme-shot" src={th.preview} alt={`${th.name} preview`} />
            ) : (
              <span className="theme-mock" style={{ background: v.bg }} aria-hidden="true">
                <span className="mock-bar" style={{ background: v.primary }} />
                <span className="mock-card" style={{ background: v.surface }}>
                  <span className="mock-line" style={{ background: v.text }} />
                  <span className="mock-line thin" style={{ background: v.muted }} />
                  <span className="mock-btn" style={{ background: v.accent }} />
                </span>
              </span>
            )}
            <span className="theme-chips" aria-hidden="true">
              {["primary", "accent", "bg", "surface", "text", "muted"].map(
                (k) => v[k] && <span key={k} className="chip" style={{ background: v[k] }} title={`${k}: ${v[k]}`} />
              )}
            </span>
            <span className="theme-name">{th.name}</span>
            <span className="theme-style">{th.style}</span>
            <span className="theme-fonts">{th.fonts.heading} / {th.fonts.body}</span>
          </button>
        );
      })}
    </div>
  );
}

const AUDIENCES = [
  { id: "", label: "Show all" },
  { id: "local-service", label: "Local service business" },
  { id: "artist", label: "Artist / music act" },
  { id: "community", label: "Community / fan hub" },
  { id: "creative", label: "Creative / portfolio" },
];

export function DesignPicker({ name = "design" }) {
  const { values, setValue } = useCtx();
  const sel = values[name] ?? "";
  const [aud, setAud] = useState("");
  const designs = DESIGN_CATALOG.designs.filter(
    (d) => !aud || (d.for || []).includes(aud) || (d.for || []).includes("any")
  );
  return (
    <div className="designs">
      <div className="aud-filter" role="radiogroup" aria-label="Who is this site for?">
        <span className="label">Who's the site for?</span>
        {AUDIENCES.map((a) => (
          <button
            type="button"
            role="radio"
            aria-checked={aud === a.id}
            key={a.id || "all"}
            className={"aud-chip" + (aud === a.id ? " selected" : "")}
            onClick={() => setAud(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>
      <div className="design-grid" role="radiogroup" aria-label="Design template">
        {designs.map((d) => {
          const active = sel === d.id || (!sel && d.id === "master");
          return (
            <button
              type="button"
              role="radio"
              aria-checked={active}
              key={d.id}
              className={"design-card" + (active ? " selected" : "")}
              onClick={() => setValue(name, d.id === "master" ? "" : d.id)}
            >
              <span className="design-head">
                <span className="design-name">{d.name}</span>
                <span className={"design-status " + d.status}>
                  {d.status === "live" ? "auto-applied" : "applied after generation"}
                </span>
              </span>
              <span className="design-aud">{d.audience}</span>
              <span className="design-style">{d.style}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SubmitBar() {
  const { submit, sending, sent, result } = useCtx();

  function download() {
    if (!result) return;
    const blob = new Blob([result.json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="submitbar">
        <button className="btn" type="submit" disabled={sending}>
          {sending ? "Submitting…" : "Submit intake"}
        </button>
        <button className="btn secondary" type="button" onClick={() => submit(true)}>
          Download JSON only
        </button>
      </div>
      {result && (
        <div className={"panel" + (sent === "fail" ? " warn" : "")}>
          <h3>
            {sent === "ok" && "Intake captured ✔"}
            {sent === "skipped" && "Intake JSON ready"}
            {sent === "fail" && "Saved locally — submission didn't reach Netlify"}
            {sent === null && "Intake JSON ready"}
          </h3>
          <p>
            {sent === "ok" &&
              "The submission is stored in Netlify Forms (site dashboard → Forms → site-intake)."}
            {sent === "fail" &&
              "Likely running outside Netlify. Download the file below and use it directly."}
            {(sent === "skipped" || sent === null) &&
              "Nothing was submitted — the file below is generated in your browser."}
          </p>
          <div className="submitbar">
            <button className="btn" type="button" onClick={download}>
              Download {result.filename}
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={() => navigator.clipboard?.writeText(result.json)}
            >
              Copy JSON
            </button>
          </div>
          <p>
            Then run:{" "}
            <code>node factory/generate.mjs ./{result.filename} --out ../new-site</code>
          </p>
          <div className="filejson">{result.json}</div>
        </div>
      )}
    </>
  );
}
