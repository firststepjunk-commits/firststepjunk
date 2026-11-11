"use client";

import { useState } from "react";
import { ArrowRightIcon } from "./icons";

/**
 * Seasonal banner — a small dismissible strip above the nav on the homepage.
 * In normal document flow, so it never covers the nav; the sticky navbar
 * simply scrolls up under it. Dismissal is per page load (useState only).
 */
export default function SeasonalBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative bg-secondary px-margin-mobile py-2.5 text-center text-sm font-bold text-on-secondary md:px-margin-desktop">
      <a href="#quote" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
        🍂 Fall cleanup — clear the yard and garage before winter. Get a free quote
        <ArrowRightIcon className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-lg font-bold leading-none text-on-secondary/80 transition-colors hover:bg-on-secondary/15 hover:text-on-secondary"
      >
        ×
      </button>
    </div>
  );
}
