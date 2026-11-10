"use client";

import { useState } from "react";
import { defaultContent } from "@/lib/content-data";

export default function FaqSection({ content }) {
  const faq = { ...defaultContent.faq, ...(content?.faq || {}) };
  const items = faq.items || [];
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-surface-container-low py-section-gap" id="faq">
      <div className="container mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
        <div className="mb-12 text-center" data-aos="fade-up">
          <h2 className="font-headline-lg text-headline-lg text-primary">{faq.heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-on-surface-variant">{faq.intro}</p>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.question}
                className="border-b border-outline-variant/40"
                data-aos="fade-up"
                data-aos-delay={Math.min(i * 50, 250)}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="text-lg font-semibold text-primary">{item.question}</span>
                  <span className="material-symbols-outlined shrink-0 text-secondary">
                    {isOpen ? "remove" : "add"}
                  </span>
                </button>
                {isOpen ? (
                  <p className="pb-5 text-on-surface-variant leading-relaxed">{item.answer}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
