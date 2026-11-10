import { SITE_URL } from "@/lib/seo";

/** Back-office + API paths — never crawl / index these. */
const PRIVATE_DISALLOW = [
  "/settings",
  "/settings/",
  "/settings/editor",
  "/settings/editor/",
  "/jobs",
  "/jobs/",
  "/submissions",
  "/submissions/",
  "/seos",
  "/seos/",
  "/api/",
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      // Google Search + Gemini / AI Overviews / AI Mode
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: "Gemini-Deep-Research",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      // ChatGPT Search (critical — separate from GPTBot training crawler)
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      // Bing / Copilot
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: "BingPreview",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
