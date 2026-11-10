"use client";

// Draggable before/after reveal for the hero.
//
// Both photos are stacked and full-bleed; the "before" layer is clipped from
// the right, so moving the divider wipes between them. Position is a
// percentage, which means a resize (or a phone rotating) needs no recalculation.
//
// Touch: the frame is `touch-action: pan-y`, so a vertical swipe still scrolls
// the page and only horizontal drags belong to the slider — the grip itself is
// `touch-action: none` so a drag that starts there is never stolen by a scroll.

import { useCallback, useEffect, useRef, useState } from "react";
import SiteImage from "./SiteImage";

const START = 55; // opens showing a little more "before" than "after"

const clamp = (n) => Math.min(100, Math.max(0, n));

// `before` / `after` are { src, alt, label, path, altPath }. `path` and
// `altPath` are dotted content paths — the Site Editor reads them off the
// rendered <img> to know which field a photo came from.
export default function BeforeAfterSlider({ before, after, className = "" }) {
  const beforeLabel = before?.label || "Before";
  const afterLabel = after?.label || "After";
  const [pos, setPos] = useState(START);
  const [dragging, setDragging] = useState(false);

  const frameRef = useRef(null);
  // Refs, not state: pointermove can fire before React has re-rendered, and
  // reading a stale `dragging` there would drop the first frames of a drag.
  const draggingRef = useRef(false);
  const engagedRef = useRef(false); // has the visitor touched it yet?

  // React coalesces these continuous events itself, so a plain setState per
  // move is smooth — and unlike a requestAnimationFrame buffer, it can't
  // strand the divider mid-drag if frames stop being served.
  const applyClientX = useCallback((clientX) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if (!rect.width) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  // One-time hint that this thing moves: swing the divider open and settle
  // back. Skipped for reduced-motion users and cancelled the moment they touch
  // it themselves.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timers = [
      setTimeout(() => !engagedRef.current && setPos(START - 16), 900),
      setTimeout(() => !engagedRef.current && setPos(START + 6), 1500),
      setTimeout(() => !engagedRef.current && setPos(START), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  function engage(clientX) {
    engagedRef.current = true;
    draggingRef.current = true;
    setDragging(true);
    applyClientX(clientX);
  }

  function onPointerDown(e) {
    if (e.button > 0) return; // left button / touch / pen only
    // Stops the browser starting a text selection or an image drag. Only for
    // mouse: on touch, preventDefault here can cancel the scroll gesture that
    // `touch-action: pan-y` is meant to keep working.
    if (e.pointerType === "mouse") e.preventDefault();
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // No live pointer to capture — the drag still tracks, it just stops if
      // the cursor leaves the frame.
    }
    engage(e.clientX);
  }

  function onPointerMove(e) {
    if (!draggingRef.current) return;
    applyClientX(e.clientX);
  }

  function endDrag(e) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (e?.pointerId != null) {
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {
        /* capture already released (pointercancel) */
      }
    }
  }

  function onKeyDown(e) {
    const step = e.shiftKey ? 10 : 2;
    let next = null;
    if (e.key === "ArrowLeft") next = pos - step;
    else if (e.key === "ArrowRight") next = pos + step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    if (next === null) return;
    e.preventDefault();
    engagedRef.current = true;
    setPos(clamp(next));
  }

  const rounded = Math.round(pos);
  // Snap to the pointer while dragging; glide for taps, keys and the hint.
  const ease = dragging ? "none" : "clip-path .35s cubic-bezier(.22,1,.36,1)";

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`group relative select-none overflow-hidden rounded-xl border-4 border-white shadow-2xl ${className}`}
      style={{ touchAction: "pan-y", cursor: dragging ? "grabbing" : "ew-resize" }}
    >
      {/* AFTER — the cleared space, full frame underneath */}
      <div className="absolute inset-0">
        <SiteImage
          src={after?.src}
          alt={after?.alt || afterLabel}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          draggable={false}
          priority
          data-image-path={after?.path}
          data-alt-path={after?.altPath}
        />
      </div>

      {/* BEFORE — the junk, clipped away as the divider moves left */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: ease }}
      >
        <SiteImage
          src={before?.src}
          alt={before?.alt || beforeLabel}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          draggable={false}
          priority
          data-image-path={before?.path}
          data-alt-path={before?.altPath}
        />
      </div>

      {/* Corner labels — each fades out as its own side gets squeezed away */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: pos < 18 ? 0 : 1 }}
      >
        {beforeLabel}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 rounded-full bg-primary/85 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: pos > 82 ? 0 : 1 }}
      >
        {afterLabel}
      </span>

      {/* Divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,.45)]"
        style={{ left: `${pos}%`, transition: dragging ? "none" : "left .35s cubic-bezier(.22,1,.36,1)" }}
      />

      {/* Grip — also the keyboard control */}
      <button
        type="button"
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={`${rounded}% ${beforeLabel}, ${100 - rounded}% ${afterLabel}`}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white/95 text-primary shadow-xl outline-none transition-transform duration-150 focus-visible:ring-4 focus-visible:ring-primary/50 active:scale-95"
        style={{
          left: `${pos}%`,
          touchAction: "none",
          transition: dragging ? "none" : "left .35s cubic-bezier(.22,1,.36,1), transform .15s",
        }}
      >
        <span className="material-symbols-outlined text-[26px] leading-none">
          drag_indicator
        </span>
      </button>
    </div>
  );
}
