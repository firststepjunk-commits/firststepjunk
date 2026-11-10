"use client";

import SiteImage from "./SiteImage";
import { useEffect, useMemo, useRef, useState } from "react";
import { defaultContent } from "@/lib/content-data";
import { saveSubmission } from "@/lib/submissions";

// Submissions POST to our own /api/quote route, which relays to the Apps Script
// server-side — the browser can't read Google's cross-origin response directly.

const MAX_PHOTOS = 5;
const MAX_DIMENSION = 1200; // px, longest edge after client-side resize
const JPEG_QUALITY = 0.72;

/**
 * Decode any image the browser can handle — including iPhone Live Photos /
 * HEIC — into something drawable on a canvas. Tries the fast createImageBitmap
 * path first, then falls back to an <img> element (Safari decodes HEIC this
 * way), so photos taken on an iPhone still convert to JPEG.
 */
async function decodeImage(file) {
  try {
    const bitmap = await createImageBitmap(file);
    if (bitmap && bitmap.width) return bitmap;
  } catch {
    /* fall through to the <img> path */
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("decode failed"));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Shrink a photo in the browser (canvas → JPEG) and return base64 so the
 * whole submission stays a small JSON payload. Always re-encodes to JPEG so a
 * HEIC Live Photo never reaches the backend. Returns null if the file can't be
 * decoded at all — a single bad photo must never sink the whole request.
 */
async function compressImage(file) {
  try {
    const src = await decodeImage(file);
    const w = src.width || src.naturalWidth;
    const h = src.height || src.naturalHeight;
    if (!w || !h) return null;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(w, h));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    canvas.getContext("2d").drawImage(src, 0, 0, canvas.width, canvas.height);
    if (typeof src.close === "function") src.close();
    const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    const data = dataUrl.split(",")[1];
    return data ? { type: "image/jpeg", data } : null;
  } catch {
    return null;
  }
}

export default function QuoteSection({ content }) {
  const q = { ...defaultContent.quote, ...(content?.quote || {}) };
  const contact = { ...defaultContent.contact, ...(content?.contact || {}) };

  const fileRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const errorRef = useRef(null);
  // Selected photos live in React state so repeated camera shots accumulate
  // (a single <input> can't — each new capture replaces the last).
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(0);

  // Thumbnail preview URLs, rebuilt whenever the photo set changes and
  // revoked on the next change / unmount to avoid leaking object URLs.
  const previews = useMemo(
    () =>
      files.map((f, i) => ({
        key: `${f.name}-${f.size}-${f.lastModified}-${i}`,
        name: f.name,
        url: URL.createObjectURL(f),
      })),
    [files]
  );
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  // The outcome of a submit must always be visible: on mobile the success
  // panel is shorter than the form it replaces, which used to leave the
  // viewport parked below the confirmation. Scroll the feedback (success or
  // error) to the middle of the screen. behavior:"instant" on purpose —
  // smooth programmatic scrolls are unreliably canceled on pages with CSS
  // scroll-behavior:smooth (and on iOS Safari), and an instant reposition is
  // also the correct experience for prefers-reduced-motion users. The pop-in
  // animations supply the motion where the eye lands.
  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "instant", block: "center" });
    }
  }, [submitted]);
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "instant", block: "center" });
    }
  }, [error]);

  function addFiles(list) {
    const incoming = Array.from(list || []).filter((f) => f && f.type.startsWith("image/"));
    if (!incoming.length) return;
    setError("");
    setFiles((prev) => {
      const merged = [...prev];
      for (const f of incoming) {
        const dupe = merged.some(
          (m) => m.name === f.name && m.size === f.size && m.lastModified === f.lastModified
        );
        if (!dupe) merged.push(f);
      }
      return merged.slice(0, MAX_PHOTOS);
    });
  }

  function openPicker() {
    if (fileRef.current) {
      // Clear first so picking the *same* file (or another camera shot) still
      // fires onChange on iOS.
      fileRef.current.value = "";
      fileRef.current.click();
    }
  }

  function removePhoto(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setProgress(3);
    const data = new FormData(e.target);

    // Estimate the work (photo compression + upload dominate) and animate the
    // bar toward that estimate, capping at 92% until the server actually replies
    // so the fill only completes when the submission is truly confirmed.
    const estMs = 1600 + files.length * 1500;
    const startedAt = Date.now();
    setEta(Math.ceil(estMs / 1000));
    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.max(3, Math.min(92, Math.round((elapsed / estMs) * 100))));
      setEta(Math.max(1, Math.ceil((estMs - elapsed) / 1000)));
    }, 120);

    try {
      const chosen = files.slice(0, MAX_PHOTOS);
      // Process each photo independently. A single unreadable file must not
      // sink the whole request — a text-only quote should always go through.
      const processed = await Promise.all(
        chosen.map(async (file) => {
          const photo = { name: file.name };
          const compressed = await compressImage(file);
          if (compressed?.data) {
            photo.type = compressed.type;
            photo.data = compressed.data;
          }
          return photo;
        })
      );
      // Only photos that actually produced JPEG bytes go to the backend, so the
      // Apps Script never tries to base64-decode an empty photo (which 500s).
      const photosForScript = processed
        .filter((p) => p.data)
        .map((p) => ({ name: p.name, type: p.type, data: p.data }));
      const payload = {
        "bot-field": data.get("bot-field") || "",
        name: data.get("name") || "",
        phone: data.get("phone") || "",
        email: data.get("email") || "",
        junkDescription: data.get("junk-description") || "",
        pestTreatment: data.get("pest-treatment") ? "yes" : "no",
        homeRepair: data.get("home-repair") ? "yes" : "no",
        photos: photosForScript,
        confirmationEmail: data.get("email") ? true : false,
      };
      // Keep a local copy for the intake CRM, carrying the compressed image as
      // a data URL so the operator sees the actual photo (the Apps Script
      // response can't be read cross-origin, so this data URL is the link).
      saveSubmission({
        ...payload,
        photos: processed.map((p) => ({
          name: p.name,
          url: p.data ? `data:${p.type || "image/jpeg"};base64,${p.data}` : "",
        })),
      });
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !result.ok) {
        // Carry the server's real reason (reason/error/cause) into the thrown
        // error so it lands in the console below — customers still see the
        // friendly message, but we're never debugging blind again.
        const detail = [result.reason, result.error, result.cause]
          .filter(Boolean)
          .join(" — ");
        throw new Error(detail || `send_failed (HTTP ${res.status})`);
      }
      clearInterval(timer);
      setProgress(100);
      setEta(0);
      setFiles([]);
      // Let the filled bar land for a beat before the success screen.
      await new Promise((r) => setTimeout(r, 350));
      setSubmitted(true);
    } catch (err) {
      // Log the real reason for whoever is debugging; customers see friendly text.
      console.error("[quote] submission failed:", err?.message || err);
      clearInterval(timer);
      setProgress(0);
      setError(
        `Something went wrong sending your request. Please try again, or call/text us at ${contact.phone}.`
      );
    } finally {
      clearInterval(timer);
      setSubmitting(false);
    }
  }

  return (
    <section className="relative py-section-gap" id="quote">
      <div className="absolute inset-0 -z-10 skew-y-1 bg-surface-container-low" />
      <div className="container mx-auto grid grid-cols-1 items-center gap-section-gap px-margin-mobile md:px-margin-desktop lg:grid-cols-2">
        <div data-aos="fade-right">
          <h2 className="mb-6 font-headline-lg text-headline-lg text-primary">{q.heading}</h2>
          <p className="mb-8 text-lg text-on-surface-variant">{q.intro}</p>
          <div className="grid grid-cols-2 gap-6">
            <button
              type="button"
              onClick={openPicker}
              className="flex cursor-pointer flex-col items-center rounded-xl border border-outline-variant/30 bg-white p-6 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 active:scale-95"
              data-aos="zoom-in"
              data-aos-delay="150"
            >
              <span className="material-symbols-outlined mb-2 animate-float text-4xl text-secondary">
                photo_camera
              </span>
              <p className="font-bold">{q.addPhotosTitle}</p>
              <p className="text-xs text-on-surface-variant">
                {files.length > 0
                  ? `${files.length} photo${files.length > 1 ? "s" : ""} added`
                  : q.addPhotosText}
              </p>
            </button>
            <a
              href={contact.phoneHref}
              className="flex cursor-pointer flex-col items-center rounded-xl border border-outline-variant/30 bg-white p-6 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 active:scale-95"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <span className="material-symbols-outlined mb-2 animate-float text-4xl text-primary" style={{ animationDelay: "0.8s" }}>
                call
              </span>
              <p className="font-bold">{q.callTitle}</p>
              <p className="text-xs text-on-surface-variant">{contact.phone}</p>
            </a>
          </div>
          <div className="mt-12" data-aos="fade-up">
            <SiteImage
              alt={q.imageAlt || "Crew member lifting"}
              width={768}
              height={1024}
              className="h-64 w-full rounded-2xl object-cover shadow-lg grayscale transition-all duration-500 hover:grayscale-0"
              src={q.image || defaultContent.quote.image}
              data-image-path="quote.image"
              data-alt-path="quote.imageAlt"
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-surface-container-high bg-white p-8 shadow-2xl md:p-12" data-aos="fade-left" data-aos-delay="150">
          {submitted ? (
            <div ref={successRef} className="flex flex-col items-center justify-center py-16 text-center">
              <span className="mb-5 flex h-24 w-24 animate-success-ring items-center justify-center rounded-full bg-secondary-container/40">
                <span
                  className="material-symbols-outlined animate-success-pop text-6xl text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </span>
              <h3
                className="mb-2 animate-fade-in-up font-headline-lg text-headline-lg text-primary"
                style={{ animationDuration: "0.6s", animationDelay: "0.15s" }}
              >
                {q.successHeading}
              </h3>
              <p
                className="animate-fade-in-up text-on-surface-variant"
                style={{ animationDuration: "0.6s", animationDelay: "0.3s" }}
              >
                {q.successText}
              </p>
            </div>
          ) : (
            <form
              ref={formRef}
              name="quote"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <p className="hidden">
                <label>
                  Don&apos;t fill this out: <input name="bot-field" />
                </label>
              </p>
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm uppercase text-primary">
                  Describe the Junk
                </label>
                <textarea
                  className="h-32 w-full rounded-xl border border-outline-variant p-4 text-body-md transition-shadow duration-200 focus:border-primary focus:ring-primary"
                  placeholder="e.g. 1 Queen Mattress, a box of old electronics, 2 wooden pallets..."
                  rows={4}
                  name="junk-description"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm uppercase text-primary">Name</label>
                  <input
                    className="h-14 w-full rounded-xl border border-outline-variant px-4 transition-shadow duration-200 focus:border-primary"
                    type="text"
                    name="name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm uppercase text-primary">Phone Number</label>
                  <input
                    className="h-14 w-full rounded-xl border border-outline-variant px-4 transition-shadow duration-200 focus:border-primary"
                    type="tel"
                    name="phone"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm uppercase text-primary">Email</label>
                <input
                  className="h-14 w-full rounded-xl border border-outline-variant px-4 transition-shadow duration-200 focus:border-primary"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com — so we can reply"
                />
              </div>
              <div className="space-y-3">
                <label className="font-label-sm text-label-sm uppercase text-primary">Upload Photos</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  name="photos"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={openPicker}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest py-8 text-on-surface-variant transition-colors duration-200 hover:border-secondary hover:text-secondary"
                >
                  <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                  <span className="text-sm font-bold">
                    {files.length > 0
                      ? `${files.length} photo${files.length > 1 ? "s" : ""} selected${files.length < MAX_PHOTOS ? " — tap to add more" : ""}`
                      : "Add photos of your junk (up to 5)"}
                  </span>
                  <span className="text-xs">Take one at a time or pick several — they add up. Helpful photos are reviewed by our team for internal follow-up details.</span>
                </button>
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {previews.map((p, i) => (
                      <div
                        key={p.key}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.url}
                          alt={p.name || `Photo ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          aria-label={`Remove photo ${i + 1}`}
                          className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white shadow-sm transition-colors hover:bg-red-600"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4 pt-4">
                <p className="font-bold text-primary">Need Add-on Services?</p>
                <div className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 transition-colors duration-200 hover:border-secondary/40">
                  <span className="text-sm">Pest Treatment (Sanitization)</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input className="peer sr-only" type="checkbox" name="pest-treatment" value="yes" />
                    <div className="peer h-6 w-11 rounded-full bg-surface-variant transition-colors duration-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full" />
                  </label>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 transition-colors duration-200 hover:border-secondary/40">
                  <span className="text-sm">Post-Haul Home Repair</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input className="peer sr-only" type="checkbox" name="home-repair" value="yes" />
                    <div className="peer h-6 w-11 rounded-full bg-surface-variant transition-colors duration-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full" />
                  </label>
                </div>
              </div>
              {error && (
                <p
                  ref={errorRef}
                  className="animate-error-in rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <button
                className="relative w-full overflow-hidden rounded-xl bg-primary py-5 text-lg font-bold text-on-primary shadow-lg transition-all hover:bg-secondary hover:shadow-secondary/20 active:scale-[0.98] disabled:cursor-not-allowed"
                type="submit"
                disabled={submitting}
              >
                {submitting && (
                  <span
                    className="absolute inset-y-0 left-0 z-0 bg-secondary transition-[width] duration-150 ease-linear"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Submitting your request"
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-xl" aria-hidden="true">
                        progress_activity
                      </span>
                      <span>{progress >= 100 ? "Sent!" : `Sending your request… ~${eta}s`}</span>
                    </>
                  ) : (
                    q.submitLabel
                  )}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
