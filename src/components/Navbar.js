"use client";

import SiteImage from "./SiteImage";
import { useState } from "react";
import { defaultContent } from "@/lib/content-data";
import { BUSINESS } from "@/lib/seo";

function resolveHref(href, homeLinks) {
  if (!href) return "/";
  if (href.startsWith("http") || href.startsWith("/")) return href;
  if (href.startsWith("#")) return homeLinks ? `/${href}` : href;
  return href;
}

export default function Navbar({ content, homeLinks = false }) {
  const nav = { ...defaultContent.nav, ...(content?.nav || {}) };
  const logo = content?.siteImages?.logo || defaultContent.siteImages.logo;
  const links = nav.links || [];
  const [open, setOpen] = useState(false);
  const quoteHref = homeLinks ? "/#quote" : "#quote";

  return (
    <header className="sticky top-0 z-50 bg-surface shadow-sm">
      <div className="flex h-28 w-full items-center justify-between px-margin-mobile md:px-margin-desktop">
        <a href="/" className="flex items-center gap-2" aria-label={`${BUSINESS.brandName} home`}>
          <SiteImage
            alt={`${BUSINESS.brandName} Logo`}
            width={220}
            height={220}
            className="h-24 w-auto object-contain"
            src={logo}
            priority
            data-image-path="siteImages.logo"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href + link.label}
              className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant transition-colors duration-200 hover:text-secondary"
              href={resolveHref(link.href, homeLinks)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="hidden rounded-lg bg-primary px-6 py-2.5 font-bold text-on-primary transition-transform duration-200 hover:scale-105 active:scale-95 sm:inline-block"
            href={quoteHref}
          >
            {nav.cta}
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-container-high md:hidden"
          >
            <span className="material-symbols-outlined text-3xl">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      <div
        className={`grid md:hidden motion-reduce:transition-none ${
          open
            ? "[grid-template-rows:1fr] transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.05,0.7,0.1,1)]"
            : "[grid-template-rows:0fr] transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.3,0,0.8,0.15)]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            inert={!open}
            className={`border-t border-outline-variant/30 bg-surface px-margin-mobile pb-6 pt-2 motion-reduce:transition-none motion-reduce:transform-none ${
              open
                ? "translate-y-0 opacity-100 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.05,0.7,0.1,1)]"
                : "-translate-y-2 opacity-0 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.3,0,0.8,0.15)]"
            }`}
          >
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.href + link.label}>
                  <a
                    className="block border-b border-outline-variant/20 py-4 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant transition-colors hover:text-secondary"
                    href={resolveHref(link.href, homeLinks)}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              className="mt-5 block rounded-lg bg-primary px-6 py-3 text-center font-bold text-on-primary active:scale-95"
              href={quoteHref}
              onClick={() => setOpen(false)}
            >
              {nav.cta}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
