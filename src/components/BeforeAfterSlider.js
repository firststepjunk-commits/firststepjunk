"use client";

// Automatic before/after photo rotation for the hero.
//
// Like the competitor's hero: the photo crossfades between shots on a timer
// (~4s) instead of a drag handle. It cycles through a few before/after
// pairs: pair 1 before → pair 1 after → pair 2 before → pair 2 after → …
// The BEFORE / AFTER label flips with the shot, and one small dot per shot
// shows where you are in the rotation. The swap pauses while the visitor
// hovers over or touches the photo, and visitors who prefer reduced motion
// just see the first finished (after) shot.
//
// `pairs` is [{ before, after }] where each side is
// { src, alt, label, path, altPath }. `path` and `altPath` are dotted
// content paths — the Site Editor reads them off the rendered <img> to know
// which field a photo came from. `onShotChange` fires with the shot index
// (0 = pair 1 before, 1 = pair 1 after, 2 = pair 2 before, …) so the
// parent can swap the caption to match the pair on screen.

import { useEffect, useRef, useState } from "react";
import SiteImage from "./SiteImage";

const SWAP_MS = 4000;

export default function BeforeAfterSlider({ pairs, onShotChange, className = "" }) {
  const total = pairs.length * 2;
  const [shot, setShot] = useState(0);
  // Ref, not state: the interval reads it, and a stale closure would keep
  // swapping even while paused.
  const pausedRef = useRef(false);

  useEffect(() => {
    onShotChange?.(shot);
  }, [shot, onShotChange]);

  useEffect(() => {
    if (typeof window === "undefined" || total < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShot(1);
      return;
    }
    const id = setInterval(() => {
      if (!pausedRef.current) setShot((s) => (s + 1) % total);
    }, SWAP_MS);
    return () => clearInterval(id);
  }, [total]);

  // Flattened shot list: [pair0 before, pair0 after, pair1 before, …]
  const shots = pairs.flatMap((pair, pairIndex) => [
    { ...pair.before, pairIndex, isAfter: false },
    { ...pair.after, pairIndex, isAfter: true },
  ]);
  const active = shots[shot] || shots[0];
  const activeLabel = active?.isAfter
    ? active?.label || "After"
    : active?.label || "Before";

  return (
    <div
      className={`group relative select-none overflow-hidden rounded-xl border-4 border-white shadow-2xl ${className}`}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onTouchStart={() => {
        pausedRef.current = true;
      }}
      onTouchEnd={() => {
        pausedRef.current = false;
      }}
    >
      {shots.map((s, i) => (
        <div
          key={`${s.pairIndex}-${s.isAfter ? "after" : "before"}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === shot ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== shot}
        >
          <SiteImage
            src={s.src}
            alt={s.alt || s.label}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            draggable={false}
            priority={i < 2}
            data-image-path={s.path}
            data-alt-path={s.altPath}
          />
        </div>
      ))}

      {/* Label pill — flips with the shot */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors duration-500 ${
          active?.isAfter ? "bg-primary/85" : "bg-black/65"
        }`}
      >
        {activeLabel}
      </span>

      {/* Dots — quiet indicator of which shot is showing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2"
      >
        {shots.map((s, i) => (
          <span
            key={`dot-${i}`}
            className={`h-2 w-2 rounded-full transition-colors duration-500 ${
              i === shot ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      <span className="sr-only">
        {active?.isAfter ? "Showing the after photo" : "Showing the before photo"} — the
        photo swaps automatically every few seconds.
      </span>
    </div>
  );
}
