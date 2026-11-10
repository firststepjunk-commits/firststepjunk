'use client';

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
import {
  Button,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  Switch,
} from "react-aria-components";
import { clearSubmissions } from "@/lib/submissions";
import { fetchMergedSubmissions } from "@/lib/remoteSubmissions";
import { defaultContent } from "@/lib/content-data";
import { BUSINESS, CITY_STATE } from "@/lib/seo";
import styles from "./SubmissionsClient.module.css";

const BIZ = defaultContent.contact || {};
const BIZ_LOCATION = defaultContent.footer?.location || CITY_STATE;
const THEME_KEY = "fsj-crm-theme";

/* ---------------- date formatting ---------------- */

function formatWhen(iso) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Compact form for the collapsed row: drops the year when it's the current
// one so the thin header keeps room for the name on small screens.
function formatWhenShort(iso) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return "";
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Turn any Google Drive link into a render-friendly image URL. The stored
 * `uc?export=view` form is unreliable inside <img>; the `thumbnail` endpoint
 * serves the image bytes directly for link-shared files. Handles every shape
 * we might have stored: /file/d/<ID>/view, uc?...&id=<ID>, thumbnail?id=<ID>.
 * Requires the file (or its folder) to be shared "Anyone with the link".
 */
function driveImageSrc(url, size = 1600) {
  if (!url) return "";
  const m =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const id = m && m[1];
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${size}` : url;
}

/* ---------------- interest + reply-email helpers ---------------- */

function firstNameOf(name) {
  const n = (name || "").trim();
  return n ? n.split(/\s+/)[0] : "there";
}

// Short plain-text summary of what the lead asked for — shown on the
// collapsed row so each intake is scannable without opening it.
function interestOf(s) {
  const services = ["Junk removal"];
  if (s.pestTreatment === "yes") services.push("pest treatment");
  if (s.homeRepair === "yes") services.push("home repair");
  return services.join(" + ");
}

// Summarize the services this lead asked for, straight from their intake
// fields (junk removal is always implied; add-ons + free-text description
// flesh it out). Falls back to a generic phrase when nothing was specified.
function summarizeServices(s) {
  const extras = [];
  if (s.pestTreatment === "yes") extras.push("pest treatment");
  if (s.homeRepair === "yes") extras.push("home repair");
  const desc = (s.junkDescription || "").trim();
  if (!desc && extras.length === 0) return "our services";
  const svcs = [BUSINESS.primaryService, ...extras];
  const list =
    svcs.length > 1 ? `${svcs.slice(0, -1).join(", ")} and ${svcs[svcs.length - 1]}` : svcs[0];
  return desc ? `${list} for ${desc}` : list;
}

// Build a mailto: link with the subject + body pre-filled for a friendly reply.
function buildReplyMailto(s) {
  const name = firstNameOf(s.name);
  const subject = `Hi ${name}, ${BUSINESS.shortName} appreciates your interest`;
  const body = [
    `Hi ${name},`,
    ``,
    `We see you're interested in ${summarizeServices(s)}. ${BUSINESS.crmReplyLine}`,
    ``,
    `Thanks and best regards,`,
    BUSINESS.brandName,
    BIZ_LOCATION,
    [BIZ.email, BIZ.phone].filter(Boolean).join(" · "),
  ].join("\n");
  return `mailto:${s.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ---------------- inline icons (stroke style) ---------------- */

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ---------------- Fullscreen zoomable viewer ---------------- */

function Lightbox({ item, onClose }) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.name ? `Photo: ${item.name}` : "Photo viewer"}
    >
      {/* top bar */}
      <div
        className="flex flex-shrink-0 items-center justify-between gap-3 px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white/90">{item.name || "Photo"}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* content */}
      <div className="min-h-0 flex-1 overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex min-h-full items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={driveImageSrc(item.url, 2048)}
            alt={item.name || "Uploaded photo"}
            onClick={() => setZoomed((z) => !z)}
            className={
              zoomed
                ? "w-[200%] max-w-none cursor-zoom-out sm:w-[150%]"
                : "max-h-[80vh] max-w-full cursor-zoom-in object-contain"
            }
          />
        </div>
      </div>

      <p className="flex-shrink-0 pb-4 text-center text-xs text-white/40" onClick={(e) => e.stopPropagation()}>
        Tap image to zoom · tap outside to close
      </p>
    </div>
  );
}

/* ---------------- Single photo tile (clickable) ---------------- */

function PhotoTile({ photo, index, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasPhoto = Boolean(photo.url) && !imgFailed;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
      <button
        type="button"
        onClick={() => onOpen(photo)}
        className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden"
        aria-label={`Open photo ${index + 1}`}
      >
        {hasPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={driveImageSrc(photo.url)}
            alt={photo.name || `Uploaded photo ${index + 1}`}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center text-xs text-white/40">
            Image unavailable
          </div>
        )}
        <span className="pointer-events-none absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <span className="material-symbols-outlined text-lg">zoom_in</span>
        </span>
      </button>
    </div>
  );
}

/* ---------------- Per-submission Splide carousel (swipe / drag) ---------------- */

function PhotoCarousel({ photos, onOpen }) {
  const rootRef = useRef(null);
  const count = photos.length;

  useEffect(() => {
    if (!rootRef.current || count === 0) return;
    const splide = new Splide(rootRef.current, {
      type: "slide",
      perPage: 1,
      perMove: 1,
      gap: "0.75rem",
      pagination: count > 1,
      arrows: count > 1,
      drag: true,
      snap: true,
      speed: 450,
      breakpoints: {
        768: { arrows: false },
      },
    });
    splide.mount();
    return () => splide.destroy();
  }, [count]);

  if (count === 0) return null;

  return (
    <div className="splide overflow-hidden" ref={rootRef} aria-label="Submission photos">
      <div className="splide__track">
        <ul className="splide__list">
          {photos.map((photo, i) => (
            <li className="splide__slide" key={i}>
              <PhotoTile photo={photo} index={i} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- One collapsible intake card ---------------- */

function SubmissionCard({ submission: s, index, isExpanded, onOpenPhoto }) {
  const photoCount = s.photos?.length || 0;
  const meta = [interestOf(s), photoCount ? `${photoCount} photo${photoCount === 1 ? "" : "s"}` : ""]
    .filter(Boolean)
    .join(" · ");

  return (
    <Disclosure
      id={s.id}
      className={styles.card}
      // Staggered entry cadence — each card slides in a beat after the last.
      style={{ animationDelay: `${Math.min(index, 10) * 0.12}s` }}
    >
      <Heading level={3} className={styles.cardHeading}>
        <Button slot="trigger" className={styles.trigger}>
          <span className={styles.triggerTop}>
            <span className={styles.name}>{s.name || "Unnamed intake"}</span>
            <time className={styles.date} dateTime={s.createdAt || undefined}>
              {formatWhenShort(s.createdAt)}
            </time>
          </span>
          <span className={styles.triggerBottom}>
            <span className={styles.interest}>{meta}</span>
            <ChevronIcon className={styles.chevron} />
          </span>
        </Button>
      </Heading>

      <DisclosurePanel className={styles.panel}>
        <div className={styles.panelInner}>
          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt>Phone</dt>
              <dd>
                {s.phone ? (
                  <a className={styles.link} href={`tel:${s.phone}`}>
                    {s.phone}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className={styles.row}>
              <dt>Email</dt>
              <dd>
                {s.email ? (
                  <a className={styles.link} href={buildReplyMailto(s)}>
                    {s.email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className={styles.row}>
              <dt>Junk</dt>
              <dd>{s.junkDescription || "—"}</dd>
            </div>
            <div className={styles.row}>
              <dt>Add-ons</dt>
              <dd>
                Pest treatment: {s.pestTreatment || "no"} · Home repair: {s.homeRepair || "no"}
              </dd>
            </div>
            <div className={styles.row}>
              <dt>Status</dt>
              <dd>{s.status || "new"}</dd>
            </div>
            <div className={styles.row}>
              <dt>Received</dt>
              <dd>{formatWhen(s.createdAt)}</dd>
            </div>
          </dl>

          {photoCount > 0 && (
            <div>
              <p className={styles.photosHead}>
                <span>Photos</span>
                <span>
                  {photoCount} {photoCount === 1 ? "image" : "images"}
                </span>
              </p>
              {/* Mount the carousel only while expanded so Splide measures
                  real widths (and images stay lazy until needed). */}
              {isExpanded && <PhotoCarousel photos={s.photos || []} onOpen={onOpenPhoto} />}
              <p className={styles.photosHint}>Swipe / drag to browse · tap to zoom</p>
            </div>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

/* ---------------- Page ---------------- */

export default function SubmissionsClient() {
  const [submissions, setSubmissions] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [liveSynced, setLiveSynced] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState(() => new Set());
  const seededExpanded = useRef(false);

  const refresh = useCallback(async () => {
    // Live Sheet rows (via the /api/submissions proxy) merged with this
    // device's local cache. setState here is inside an async callback (after
    // an await), so it doesn't trip the synchronous-set-state-in-effect rule.
    const { submissions: merged, remoteOk } = await fetchMergedSubmissions();
    setSubmissions(merged);
    setLiveSynced(remoteOk);
    // Default view: only the two most recent intakes open, the rest collapsed.
    // Seed once so the user's own expand/collapse choices survive refreshes.
    if (!seededExpanded.current && merged.length > 0) {
      seededExpanded.current = true;
      setExpandedKeys(new Set(merged.slice(0, 2).map((s) => s.id)));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load; setState runs inside an awaited async callback, not synchronously in the effect body
    refresh();
  }, [refresh]);

  useEffect(() => {
    // Restore the saved theme (or fall back to the OS preference) after mount
    // so server and first client render stay identical.
    try {
      const stored = window.localStorage.getItem(THEME_KEY);
      const preferDark =
        stored === "dark" ||
        (stored === null && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time theme hydration from localStorage; cannot run during SSR render
      if (preferDark) setDarkMode(true);
    } catch {
      /* storage unavailable — stay on light */
    }
  }, []);

  function handleThemeChange(isSelected) {
    setDarkMode(isSelected);
    try {
      window.localStorage.setItem(THEME_KEY, isSelected ? "dark" : "light");
    } catch {
      /* private mode — theme just won't persist */
    }
  }

  function handleClear() {
    if (confirm("Clear the LOCAL submission cache on this device? Your Google Sheet backend stays intact — this only empties what's stored in this browser.")) {
      clearSubmissions();
      refresh();
    }
  }

  const total = submissions.length;
  const photoCount = submissions.reduce((n, s) => n + (s.photos?.length || 0), 0);

  return (
    <main className={`${styles.page}${darkMode ? ` ${styles.dark}` : ""}`}>
      <div className={styles.wrap}>
        {/* header */}
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Intake CRM</p>
            <h1 className={styles.title}>Incoming submissions</h1>
            <p className={styles.counts}>
              {total} {total === 1 ? "submission" : "submissions"} · {photoCount}{" "}
              {photoCount === 1 ? "photo" : "photos"}
            </p>
          </div>
          <div className={styles.controls}>
            <Switch
              isSelected={darkMode}
              onChange={handleThemeChange}
              className={styles.themeSwitch}
              aria-label="Dark mode"
            >
              <span className={styles.themeTrack}>
                <span className={styles.themeSide}>
                  <SunIcon />
                  Light
                </span>
                <span className={styles.themeSide}>
                  <MoonIcon />
                  Dark
                </span>
              </span>
            </Switch>
            <Button onPress={refresh} className={styles.btn}>
              Refresh
            </Button>
            <Link href="/settings" className={`${styles.btn} ${styles.btnPrimary}`}>
              Settings
            </Link>
          </div>
        </header>

        {total === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No submissions yet.</p>
            <p className={styles.emptyBody}>
              Once a quote comes in, the intake appears here with its photos and contact details.
            </p>
          </div>
        ) : (
          <DisclosureGroup
            allowsMultipleExpanded
            expandedKeys={expandedKeys}
            onExpandedChange={setExpandedKeys}
            className={styles.list}
          >
            {submissions.map((submission, i) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                index={i}
                isExpanded={expandedKeys.has(submission.id)}
                onOpenPhoto={setLightbox}
              />
            ))}
          </DisclosureGroup>
        )}

        {total > 0 && (
          <div className={styles.footerNote}>
            <p>
              {liveSynced
                ? "Live from the Google Sheet, merged with this device's cache. The Sheet is the source of truth."
                : "Live Sheet sync unavailable — showing this device's local cache. The Google Sheet remains the source of truth."}
            </p>
            <Button onPress={handleClear} className={`${styles.btn} ${styles.btnDanger}`}>
              Clear local cache
            </Button>
          </div>
        )}
      </div>

      {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} />}
    </main>
  );
}
