"use client";

import { BUSINESS } from "@/lib/seo";
import { CameraIcon, CheckIcon, PhoneIcon } from "./icons";

/**
 * Sticky mobile bottom bar — the three things a visitor on their phone
 * actually wants, always one tap away: call, text a photo, or get a
 * free quote (scrolls to the quote form).
 *
 * Mobile only (md:hidden). The page adds a same-height spacer after the
 * footer (see page.js) so the bar never covers footer content, and the
 * bar itself respects the iPhone home-indicator safe area.
 *
 * Icons are inline SVGs — no font ligatures anywhere in this bar.
 */
export default function MobileStickyBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-50 grid h-16 grid-cols-3 border-t border-outline-variant/30 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.12)] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={`tel:${BUSINESS.phone}`}
        className="flex flex-col items-center justify-center gap-0.5 text-primary transition-colors active:bg-primary/10"
      >
        <PhoneIcon className="h-6 w-6" />
        <span className="text-[11px] font-extrabold uppercase tracking-wide">Call</span>
      </a>
      <a
        href={`sms:${BUSINESS.phone}`}
        className="flex flex-col items-center justify-center gap-0.5 border-x border-outline-variant/30 text-primary transition-colors active:bg-primary/10"
      >
        <CameraIcon className="h-6 w-6" />
        <span className="text-[11px] font-extrabold uppercase tracking-wide">Text a photo</span>
      </a>
      <a
        href="#quote"
        className="flex flex-col items-center justify-center gap-0.5 bg-primary text-on-primary transition-colors active:bg-secondary"
      >
        <CheckIcon className="h-6 w-6" />
        <span className="text-[11px] font-extrabold uppercase tracking-wide">Free quote</span>
      </a>
    </nav>
  );
}
