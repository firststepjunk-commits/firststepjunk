import { SITE_URL } from "@/lib/seo";
import { SERVICE_PAGES, OWNER } from "@/lib/service-pages";

/**
 * Public sitemap only — back-office routes omitted:
 * /settings, /settings/editor, /jobs, /submissions, /seos, /api/*
 */
export default function sitemap() {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...SERVICE_PAGES.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    })),
    {
      url: `${SITE_URL}${OWNER.path}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
