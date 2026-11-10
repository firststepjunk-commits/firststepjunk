"use client";

import { useEffect } from "react";

// Lightweight AOS replacement: reveals [data-aos] elements as they scroll into
// view by toggling the `aos-animate` class the original AOS stylesheet targets.
export default function AosInit() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-aos]"));
    els.forEach((el) => el.classList.add("aos-init"));

    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("aos-animate"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));

    // Safety: reveal everything after load in case observer never fires.
    const fallback = setTimeout(() => {
      els.forEach((el) => el.classList.add("aos-animate"));
    }, 2500);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return null;
}
