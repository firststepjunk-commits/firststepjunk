"use client";

// Site Editor Mode — a live, fillable duplicate of the real front end.
//
// How it works: the actual landing-page components render ONCE with the
// current published content (the preview element is memoized, so React never
// reconciles that subtree again). A DOM pass then binds every rendered piece
// of copy to its path in the content JSON by matching text nodes against the
// content values, and marks those elements contentEditable in place. Edits
// commit to a draft on blur; Save & Publish POSTs the draft through the same
// /api/content wiring the Settings page uses — one source of truth.
//
// Because React never re-renders the preview, editing the DOM directly is
// safe. The one exception is components with internal state (the navbar's
// mobile menu): a MutationObserver re-applies any drafted text React reverts.

import { useEffect, useMemo, useRef, useState } from "react";
import { ADMIN_PASSWORD, IMAGE_KEYS, collectImagePaths } from "@/lib/content-data";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyUs from "@/components/WhyUs";
import Services from "@/components/Services";
import CtaBanner from "@/components/CtaBanner";
import DisasterCards from "@/components/DisasterCards";
import Gallery from "@/components/Gallery";
import Team from "@/components/Team";
import QuoteSection from "@/components/QuoteSection";
import Footer from "@/components/Footer";

const IOS_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", system-ui, sans-serif';

// Values that are wiring, not copy — never made editable inline.
function isNonCopyValue(str) {
  return /^(\/|#|tel:|mailto:|https?:)/.test(str);
}

// Build { trimmedValue -> path[] } for every string leaf in the content tree.
function buildValueMap(content) {
  const map = new Map();
  (function walk(node, path) {
    if (typeof node === "string") {
      const key = node.trim();
      if (key.length >= 2 && !isNonCopyValue(key) && !map.has(key)) map.set(key, path);
    } else if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, [...path, i]));
    } else if (node && typeof node === "object") {
      for (const k of Object.keys(node)) {
        if (IMAGE_KEYS.has(k)) continue; // photos, handled by the image picker
        walk(node[k], [...path, k]);
      }
    }
  })(content, []);
  return map;
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

// "gallery.images.3.src" -> ["gallery", "images", 3, "src"]. Components stamp
// this onto every photo they render as data-image-path, which beats guessing
// from the src: two fields can point at the same file, and next/image rewrites
// src to /_next/image?url=… anyway.
function parseContentPath(str) {
  return String(str)
    .split(".")
    .map((seg) => (/^\d+$/.test(seg) ? Number(seg) : seg));
}

// The element's own text (direct text nodes only) — excludes icon ligature
// text living in child <span>s, so committing a mixed element (icon + copy)
// never swallows the icon name into the saved value.
function ownText(el) {
  return Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.nodeValue)
    .join("");
}

function setOwnText(el, text) {
  const textNodes = Array.from(el.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE);
  if (textNodes.length === 0) {
    el.appendChild(document.createTextNode(text));
    return;
  }
  textNodes[0].nodeValue = text;
  for (let i = 1; i < textNodes.length; i++) textNodes[i].nodeValue = "";
}

export default function SiteEditor() {
  const [unlocked, setUnlocked] = useState(null); // null = checking
  const [content, setContent] = useState(null); // set exactly once
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [picker, setPicker] = useState(null); // the photo being swapped

  const previewRef = useRef(null);
  const draftRef = useRef(null);
  const boundCount = useRef(0);
  const libraryRef = useRef([]); // /public/images on disk; read when a picker opens

  // Same session unlock as the Settings page.
  useEffect(() => {
    setUnlocked(sessionStorage.getItem("fs_admin_unlocked") === "1");
  }, []);

  // Load the published content once.
  useEffect(() => {
    if (!unlocked || content) return;
    let cancelled = false;
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          draftRef.current = structuredClone(data);
          setContent(data);
        }
      })
      .catch(() => {
        if (!cancelled) setSaveMsg({ type: "error", text: "Couldn't load site content." });
      });
    return () => {
      cancelled = true;
    };
  }, [unlocked, content]);

  // Photo library for the picker. Best-effort: if the route can't read the
  // filesystem, the picker still lists every photo the site already uses.
  useEffect(() => {
    if (!unlocked) return;
    let cancelled = false;
    fetch("/api/site-images")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.images)) libraryRef.current = data.images;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [unlocked]);

  // The hint pill gets out of the way by itself.
  useEffect(() => {
    if (!content) return;
    const t = setTimeout(() => setHintVisible(false), 6000);
    return () => clearTimeout(t);
  }, [content]);

  // Force-reveal all AOS-animated elements inside the preview. AosInit (in the
  // layout) runs on page mount, but the preview doesn't exist yet — content is
  // fetched asynchronously — so the IntersectionObserver never picks up these
  // elements and they stay hidden (opacity:0, translated). Reveal them
  // immediately so the full page is visible in the editor.
  useEffect(() => {
    if (!content || !previewRef.current) return;
    const reveal = () => {
      const els = previewRef.current.querySelectorAll("[data-aos]");
      els.forEach((el) => {
        el.classList.add("aos-init", "aos-animate");
      });
    };
    // Reveal immediately, and again after a beat in case client components
    // (gallery, quote form) mount slightly after the preview container.
    reveal();
    const t = setTimeout(reveal, 300);
    return () => clearTimeout(t);
  }, [content]);

  // Warn before leaving with unpublished edits.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // ---------------- photo swapping ----------------
  // Declared above the wiring effect below, which calls openPicker().

  function openPicker(el) {
    const pathStr = el.getAttribute("data-image-path");
    if (!pathStr) return;
    const altPathStr = el.getAttribute("data-alt-path");
    const path = parseContentPath(pathStr);
    const altPath = altPathStr ? parseContentPath(altPathStr) : null;
    const current = getAtPath(draftRef.current, path) || "";
    // The library is snapshotted here, at open time, so the sheet itself never
    // has to read a ref while rendering.
    const photos = new Set([...libraryRef.current, ...collectImagePaths(draftRef.current)]);
    if (current) photos.add(current);
    return setPicker({
      pathStr,
      path,
      altPath,
      current,
      alt: altPath ? getAtPath(draftRef.current, altPath) || "" : null,
      photos: [...photos].sort(),
    });
  }

  // Repaint every element bound to this field — one photo can appear more than
  // once (the logo runs in the navbar, the mid-page banner and the footer).
  function paintImage(pathStr, src) {
    const nodes = previewRef.current?.querySelectorAll("[data-image-path]") || [];
    for (const el of nodes) {
      if (el.getAttribute("data-image-path") !== pathStr) continue;
      if (el.tagName === "IMG") {
        // next/image ships a srcset pointing at the OLD file; leave it in
        // place and the browser keeps painting the old one.
        el.removeAttribute("srcset");
        el.removeAttribute("sizes");
        el.setAttribute("src", src);
      } else {
        // The initials placeholder a team member falls back to.
        el.style.backgroundImage = `url("${src.replace(/"/g, '\\"')}")`;
      }
    }
  }

  function chooseImage(src) {
    const next = String(src || "").trim();
    if (!next || !picker) return;
    draftRef.current = setAtPath(draftRef.current, picker.path, next);
    paintImage(picker.pathStr, next);
    const photos = picker.photos.includes(next)
      ? picker.photos
      : [...picker.photos, next].sort();
    setPicker((p) => (p ? { ...p, current: next, photos } : p));
    setDirty(true);
    setSaveMsg(null);
  }

  function changeAlt(text) {
    if (!picker?.altPath) return;
    draftRef.current = setAtPath(draftRef.current, picker.altPath, text);
    const nodes = previewRef.current?.querySelectorAll("[data-image-path]") || [];
    for (const el of nodes) {
      if (el.getAttribute("data-image-path") === picker.pathStr) el.setAttribute("alt", text);
    }
    setPicker((p) => (p ? { ...p, alt: text } : p));
    setDirty(true);
  }

  // ------- attribution + editing wiring (runs once, after preview mounts) -------
  useEffect(() => {
    if (!content || !previewRef.current) return;
    const root = previewRef.current;
    const valueMap = buildValueMap(content);
    const registry = new Map(); // pathKey -> Set<element>

    // Give client components (navbar, gallery, quote form) a beat to mount.
    const timer = setTimeout(() => {
      const bind = (el, path) => {
        const key = JSON.stringify(path);
        el.setAttribute("data-editable", "1");
        el.setAttribute("data-path", key);
        el.setAttribute("spellcheck", "false");
        // plaintext-only keeps pasted formatting out; fall back where unsupported.
        el.contentEditable = "plaintext-only";
        if (el.contentEditable !== "plaintext-only") el.contentEditable = "true";
        // Icons and other child elements are decoration, not copy — keep the
        // caret out of them so they can't be edited or deleted.
        for (const child of el.children) child.setAttribute("contenteditable", "false");
        if (!registry.has(key)) registry.set(key, new Set());
        registry.get(key).add(el);
        return el;
      };

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n;
      const byParent = new Map(); // element -> [{ node, path }]
      while ((n = walker.nextNode())) {
        const t = (n.nodeValue || "").trim();
        if (!t) continue;
        const path = valueMap.get(t);
        if (!path) continue;
        const el = n.parentElement;
        if (!el || el.closest("[data-editor-ui]") || el.isContentEditable) continue;
        if (!byParent.has(el)) byParent.set(el, []);
        byParent.get(el).push({ node: n, path });
      }

      let count = 0;
      for (const [el, entries] of byParent) {
        if (entries.length === 1) {
          // Whole element hosts one copy value — edit it in place.
          bind(el, entries[0].path);
          count++;
        } else {
          // Multiple values share one element (e.g. the hero title's two
          // lines inside a single <h1>). Wrap each text node in its own
          // editable span so each line binds to — and saves to — its own
          // field. Safe to mutate: the preview subtree never re-renders.
          for (const { node, path } of entries) {
            const span = document.createElement("span");
            span.textContent = node.nodeValue;
            node.replaceWith(span);
            bind(span, path);
            count++;
          }
        }
      }
      boundCount.current = count;
      root.setAttribute("data-bound", String(count));
    }, 700);

    // ---- editing events (delegated) ----
    const originals = new WeakMap();

    const onFocusIn = (e) => {
      const el = e.target.closest?.("[data-editable]");
      if (el) originals.set(el, ownText(el));
    };

    const commit = (el) => {
      const key = el.getAttribute("data-path");
      if (!key) return;
      const path = JSON.parse(key);
      const newValue = ownText(el).replace(/\s+/g, " ").trim();
      const prev = originals.get(el);
      if (newValue === (prev ?? "").replace(/\s+/g, " ").trim()) return;
      draftRef.current = setAtPath(draftRef.current, path, newValue);
      // Keep every other on-page instance of this field in sync (e.g. the
      // phone number appears in several sections but is ONE saved value).
      for (const sibling of registry.get(key) || []) {
        if (sibling !== el) setOwnText(sibling, newValue);
      }
      originals.set(el, newValue);
      setDirty(true);
      setSaveMsg(null);
    };

    const onFocusOut = (e) => {
      const el = e.target.closest?.("[data-editable]");
      if (el) commit(el);
    };

    const onKeyDown = (e) => {
      const el = e.target.closest?.("[data-editable]");
      if (!el) return;
      if (e.key === "Enter") {
        e.preventDefault();
        el.blur();
      } else if (e.key === "Escape") {
        const prev = originals.get(el);
        if (prev != null) setOwnText(el, prev);
        el.blur();
      }
    };

    // Editing a duplicate of the site, not browsing it: swallow navigation,
    // button actions, and form controls inside the preview. Text stays
    // selectable/editable; the editor chrome (data-editor-ui) is exempt.
    // Tap-vs-drag: the hero's before/after divider is dragged by pointer, and
    // that gesture ends in a click on the photo. Without this, every drag
    // would also pop the photo picker open.
    let downX = 0;
    let downY = 0;
    let dragged = false;
    const onPointerDownCapture = (e) => {
      downX = e.clientX;
      downY = e.clientY;
      dragged = false;
    };
    const onPointerUpCapture = (e) => {
      dragged = Math.abs(e.clientX - downX) > 8 || Math.abs(e.clientY - downY) > 8;
    };

    const onClickCapture = (e) => {
      if (e.target.closest?.("[data-editor-ui]")) return;
      if (!root.contains(e.target)) return;

      // Photos open the picker instead of doing whatever they'd normally do
      // (the navbar logo, for one, is wrapped in a link home).
      const photo = e.target.closest?.("[data-image-path]");
      if (photo) {
        e.preventDefault();
        e.stopPropagation();
        if (!dragged) openPicker(photo);
        return;
      }

      const editable = e.target.closest?.("[data-editable]");
      const control = e.target.closest?.("a, button, input, textarea, select, label, [role='switch']");
      if (control && !editable) {
        e.preventDefault();
        e.stopPropagation();
      } else if (control && editable) {
        // Editable copy inside a link/button: edit, don't navigate.
        e.preventDefault();
      }
    };

    const onSubmitCapture = (e) => {
      if (root.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onPaste = (e) => {
      const el = e.target.closest?.("[data-editable]");
      if (!el) return;
      e.preventDefault();
      const text = (e.clipboardData?.getData("text/plain") || "").replace(/\s+/g, " ");
      document.execCommand("insertText", false, text);
    };

    // Self-heal: if a stateful component (navbar menu) re-renders and React
    // resets a drafted string back to the published value, re-apply the draft.
    const observer = new MutationObserver(() => {
      for (const [key, els] of registry) {
        const path = JSON.parse(key);
        const draftVal = path.reduce((acc, k) => (acc == null ? acc : acc[k]), draftRef.current);
        if (typeof draftVal !== "string") continue;
        for (const el of els) {
          if (document.activeElement === el) continue;
          if (ownText(el).replace(/\s+/g, " ").trim() !== draftVal.replace(/\s+/g, " ").trim()) {
            setOwnText(el, draftVal);
          }
        }
      }
    });
    observer.observe(root, { childList: true, characterData: true, subtree: true });

    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    root.addEventListener("keydown", onKeyDown);
    root.addEventListener("paste", onPaste);
    document.addEventListener("pointerdown", onPointerDownCapture, true);
    document.addEventListener("pointerup", onPointerUpCapture, true);
    document.addEventListener("click", onClickCapture, true);
    document.addEventListener("submit", onSubmitCapture, true);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("paste", onPaste);
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
      document.removeEventListener("pointerup", onPointerUpCapture, true);
      document.removeEventListener("click", onClickCapture, true);
      document.removeEventListener("submit", onSubmitCapture, true);
    };
  }, [content]);


  async function save() {
    // Commit any in-progress edit before publishing.
    if (document.activeElement?.closest?.("[data-editable]")) document.activeElement.blur();
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: ADMIN_PASSWORD, content: draftRef.current }),
      });
      const data = await res.json();
      if (data.ok) {
        setDirty(false);
        setSaveMsg({
          type: "success",
          text: data.store === "sheet" ? "Published live ✓" : "Saved (dev store) ✓",
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

  // Memoized ONCE with the loaded content: parent state changes (dirty, saving,
  // hint) reuse this exact element, so React skips reconciling the preview and
  // our in-place DOM edits are never clobbered.
  const preview = useMemo(
    () =>
      content ? (
        <div ref={previewRef}>
          <Navbar content={content} />
          <Hero content={content} />
          <WhyUs content={content} />
          <Services content={content} />
          <CtaBanner content={content} />
          <DisasterCards content={content} />
          <Gallery content={content} />
          <Team content={content} />
          <QuoteSection content={content} />
          <Footer content={content} />
        </div>
      ) : null,
    [content]
  );

  // ---------------- gates ----------------
  if (unlocked === false) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f2f2f7] px-6 text-center" style={{ fontFamily: IOS_FONT }}>
        <span className="material-symbols-outlined text-5xl text-[#8e8e93]" style={{ fontVariationSettings: "'FILL' 1" }}>
          lock
        </span>
        <h1 className="text-xl font-bold text-black">Site Editor is locked</h1>
        <p className="max-w-xs text-[15px] text-[#8e8e93]">Unlock the Settings page first, then come back.</p>
        <a href="/settings" className="mt-2 rounded-full bg-[#007aff] px-6 py-2.5 text-[15px] font-semibold text-white">
          Go to Settings
        </a>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f2f2f7]" style={{ fontFamily: IOS_FONT }}>
        <p className="animate-pulse text-[15px] text-[#8e8e93]">
          {saveMsg?.type === "error" ? saveMsg.text : "Loading Site Editor…"}
        </p>
      </main>
    );
  }

  return (
    <>
      {/* Editable affordances: invisible until hover/focus, so the preview
          stays nearly indistinguishable from the real site. */}
      <style>{`
        [data-editable] {
          cursor: text;
          border-radius: 4px;
          outline: 2px dashed transparent;
          outline-offset: 3px;
          transition: outline-color .15s ease, background-color .15s ease;
        }
        [data-editable]:hover {
          outline-color: rgba(0, 122, 255, .6);
          background-color: rgba(0, 122, 255, .07);
        }
        [data-editable]:focus {
          outline: 2px solid #007aff;
          background-color: rgba(0, 122, 255, .08);
          box-shadow: 0 0 0 4px rgba(0, 122, 255, .15);
        }
        /* Photos get a standing outline rather than a hover-only one: on a
           phone there is no hover, and nothing else says "tap me". */
        [data-image-path] {
          cursor: pointer;
          outline: 2px dashed rgba(0, 122, 255, .45);
          outline-offset: -6px;
          transition: outline-color .15s ease;
        }
        [data-image-path]:hover {
          outline: 3px solid #007aff;
          outline-offset: -6px;
        }
      `}</style>

      {preview}

      {/* ---- floating editor chrome (out of the way) ----
          Both bars are pinned by inset-x (not a bare left/right offset with
          auto width), so their box can never lay out wider than the screen —
          on a narrow phone the content wraps onto a second line instead of
          bleeding off the opposite edge and forcing the page to scroll
          horizontally. */}
      <div
        data-editor-ui
        className={`pointer-events-none fixed inset-x-3 top-3 z-[95] flex justify-center transition-opacity duration-700 sm:inset-x-0 ${
          hintVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ fontFamily: IOS_FONT }}
      >
        <div className="flex max-w-full items-center gap-2 rounded-full bg-black/80 px-4 py-2 text-[13px] font-medium text-white shadow-lg backdrop-blur">
          <span className="material-symbols-outlined flex-shrink-0 text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            visibility
          </span>
          <span className="truncate">
            <span className="sm:hidden">Tap any text or photo to edit</span>
            <span className="hidden sm:inline">
              Site Editor — tap any text to edit it, or any photo to swap it
            </span>
          </span>
        </div>
      </div>

      {picker && (
        <PhotoPicker
          picker={picker}
          onChoose={chooseImage}
          onAlt={changeAlt}
          onClose={() => setPicker(null)}
        />
      )}

      <div
        data-editor-ui
        className="fixed inset-x-3 bottom-3 z-[96] flex flex-wrap items-center justify-end gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4"
        style={{ fontFamily: IOS_FONT, paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {saveMsg && (
          <span
            className={`rounded-full px-3 py-1.5 text-[13px] font-semibold shadow-lg backdrop-blur ${
              saveMsg.type === "success" ? "bg-[#34c759] text-white" : "bg-[#ff3b30] text-white"
            }`}
          >
            {saveMsg.text}
          </span>
        )}
        {dirty && !saveMsg && (
          <span className="flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-[13px] font-medium text-white shadow-lg backdrop-blur">
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#ff9500]" />
            Unsaved edits
          </span>
        )}
        <a
          href="/settings"
          onClick={(e) => {
            if (dirty && !confirm("Leave without publishing your edits?")) e.preventDefault();
          }}
          className="flex h-11 flex-shrink-0 items-center gap-1 rounded-full bg-white px-4 text-[15px] font-semibold text-[#007aff] shadow-lg"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          Exit
        </a>
        <button
          onClick={save}
          disabled={saving || !dirty}
          className="flex h-11 flex-shrink-0 items-center gap-1.5 rounded-full bg-[#007aff] px-5 text-[15px] font-semibold text-white shadow-lg transition-transform active:scale-[0.97] disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            cloud_upload
          </span>
          {saving ? "Publishing…" : "Save & Publish"}
        </button>
      </div>
    </>
  );
}

/* ---------------- photo picker (bottom sheet) ----------------
   Picking is applied immediately so the change shows through behind the
   sheet — there's no "preview" step to get wrong. Nothing is published until
   Save & Publish, same as text edits. */
function PhotoPicker({ picker, onChoose, onAlt, onClose }) {
  const [link, setLink] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Everything in /public/images plus any photo the site already points at —
  // snapshotted when the sheet opened.
  const photos = picker.photos || [];

  return (
    <div data-editor-ui style={{ fontFamily: IOS_FONT }}>
      <button
        aria-label="Close photo picker"
        onClick={onClose}
        className="fixed inset-0 z-[97] w-full cursor-default bg-black/25"
      />
      <div className="fixed inset-x-0 bottom-0 z-[98] max-h-[72vh] overflow-y-auto rounded-t-[18px] bg-[#f9f9f9] shadow-[0_-8px_40px_rgba(0,0,0,.25)]">
        <div className="sticky top-0 z-10 border-b border-black/[0.07] bg-[#f9f9f9]/95 px-4 pb-3 pt-2 backdrop-blur-xl">
          <div className="mx-auto mb-2 h-1 w-9 rounded-full bg-black/20" />
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[17px] font-semibold text-black">Change photo</p>
              <p className="truncate text-[13px] text-[#8e8e93]">
                {picker.current || "No photo set"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-9 flex-shrink-0 rounded-full bg-[#007aff] px-5 text-[15px] font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>

        <div className="space-y-5 px-4 pb-8 pt-4" style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
          <section>
            <p className="mb-2 text-[13px] font-medium uppercase tracking-wide text-[#6d6d72]">
              Your photos
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {photos.map((src) => {
                const active = src === picker.current;
                return (
                  <button
                    key={src}
                    onClick={() => onChoose(src)}
                    title={src}
                    className={`relative overflow-hidden rounded-[10px] bg-white transition-transform active:scale-[0.97] ${
                      active ? "ring-[3px] ring-[#007aff]" : "ring-1 ring-black/[0.08]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" className="h-20 w-full object-cover" />
                    {active && (
                      <span
                        className="material-symbols-outlined absolute right-1 top-1 rounded-full bg-[#007aff] text-[18px] text-white"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {photos.length === 0 && (
              <p className="text-[13px] text-[#8e8e93]">No photos found — paste a link below.</p>
            )}
          </section>

          <section>
            <p className="mb-2 text-[13px] font-medium uppercase tracking-wide text-[#6d6d72]">
              Or paste a link
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://… or /images/your-photo.jpg"
                className="h-[44px] min-w-0 flex-1 rounded-[10px] border border-black/10 bg-white px-3 text-[15px] text-black outline-none focus:border-[#007aff]"
              />
              <button
                onClick={() => {
                  onChoose(link);
                  setLink("");
                }}
                disabled={!link.trim()}
                className="h-[44px] flex-shrink-0 rounded-[10px] bg-[#007aff] px-4 text-[15px] font-semibold text-white disabled:opacity-40"
              >
                Use
              </button>
            </div>
            <p className="mt-1.5 text-[12px] leading-snug text-[#8e8e93]">
              New photos go in <code className="rounded bg-black/[0.06] px-1">public/images/</code> and
              show up here after the next deploy.
            </p>
          </section>

          {picker.altPath && (
            <section>
              <p className="mb-2 text-[13px] font-medium uppercase tracking-wide text-[#6d6d72]">
                Describe this photo
              </p>
              <input
                type="text"
                value={picker.alt || ""}
                onChange={(e) => onAlt(e.target.value)}
                placeholder="e.g. Garage packed with junk before the cleanout"
                className="h-[44px] w-full rounded-[10px] border border-black/10 bg-white px-3 text-[15px] text-black outline-none focus:border-[#007aff]"
              />
              <p className="mt-1.5 text-[12px] leading-snug text-[#8e8e93]">
                Read aloud by screen readers and used by Google — worth a real sentence.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
