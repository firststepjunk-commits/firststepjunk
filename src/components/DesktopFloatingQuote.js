import { ArrowRightIcon } from "./icons";

/**
 * Floating "Get a Free Quote" button — desktop viewports only.
 * Mobile already has the sticky bottom bar (MobileStickyBar), so this stays
 * hidden below the md breakpoint to avoid doubling up.
 */
export default function DesktopFloatingQuote() {
  return (
    <a
      href="#quote"
      aria-label="Get a free quote"
      className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-primary px-5 py-3.5 font-bold text-on-primary shadow-xl transition-all hover:-translate-y-0.5 hover:bg-secondary hover:shadow-2xl md:inline-flex"
    >
      Get a Free Quote
      <ArrowRightIcon className="h-5 w-5" />
    </a>
  );
}
