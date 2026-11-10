// Server-side proxy for the Apps Script read API.
//
// The browser cannot fetch the Apps Script /exec URL directly (CORS), and we
// must never expose the read token to the client. This route runs on the
// server, injects the secret token, and returns the Sheet rows as JSON. If the
// env vars aren't configured yet, it returns ok:false/not_configured so the CRM
// cleanly falls back to the per-device localStorage cache.
import { getScriptUrl } from "@/lib/scriptUrl";

export const dynamic = "force-dynamic";

export async function GET() {
  const scriptUrl = getScriptUrl();
  const token = process.env.SUBMISSIONS_READ_TOKEN;

  if (!scriptUrl || !token) {
    return Response.json({ ok: false, reason: "not_configured", submissions: [] });
  }

  try {
    const url = `${scriptUrl}?token=${encodeURIComponent(token)}&limit=200`;
    const res = await fetch(url, { redirect: "follow", cache: "no-store" });

    // Apps Script sometimes returns an HTML error page instead of JSON.
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json({ ok: false, reason: "upstream_not_json", submissions: [] });
    }

    if (!data || data.ok === false) {
      return Response.json({
        ok: false,
        reason: (data && data.error) || "upstream_error",
        submissions: [],
      });
    }

    return Response.json({
      ok: true,
      submissions: Array.isArray(data.submissions) ? data.submissions : [],
    });
  } catch {
    // NEVER return err.message here — the thrown fetch error embeds the full
    // request URL, which carries the read token as a query param. Leaking that
    // to the client would hand out the secret that guards all customer PII.
    return Response.json({
      ok: false,
      reason: "fetch_failed",
      submissions: [],
    });
  }
}
