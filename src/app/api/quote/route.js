// Server-side proxy for quote submissions.
//
// Why this exists: the browser can't POST straight to the Apps Script /exec URL
// and read the result — Apps Script 302-redirects to googleusercontent.com,
// which sends no CORS headers, so the browser's fetch throws even though the
// row was actually created. Posting from the server (no CORS) lets us read
// Google's real response and return a clean ok/fail to the form.
import { getScriptUrl } from "@/lib/scriptUrl";

export const dynamic = "force-dynamic";

const SCRIPT_URL = getScriptUrl();

export async function POST(request) {
  if (!SCRIPT_URL) {
    // Empty OR unparseable even after normalization — treat the same.
    return Response.json({ ok: false, reason: "not_configured" }, { status: 200 });
  }

  let body;
  try {
    body = await request.text();
  } catch {
    return Response.json({ ok: false, reason: "bad_request" }, { status: 200 });
  }

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      // text/plain matches what Apps Script expects and avoids a preflight.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
      redirect: "follow",
    });
    const text = await res.text();

    if (!res.ok) {
      // A non-2xx here usually means the Apps Script threw — most often a bad
      // DRIVE_FOLDER_ID (photo submissions) or an unpublished deployment.
      return Response.json(
        { ok: false, reason: "upstream_error", status: res.status, detail: text.slice(0, 300) },
        { status: 200 }
      );
    }

    // Apps Script returns either JSON ({"ok":true|false}) or a bare "ok" string.
    let ok = true;
    let reason = "sent";
    let detail = "";
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed?.ok === "boolean") ok = parsed.ok;
      if (!ok) {
        reason = parsed?.error || "rejected";
        detail = String(parsed?.detail || "").slice(0, 300);
      }
    } catch {
      ok = /\bok\b/i.test(text.slice(0, 80));
      reason = ok ? "sent" : "rejected";
    }
    return Response.json(
      { ok, reason, ...(detail ? { detail } : {}) },
      { status: 200 }
    );
  } catch (err) {
    // "fetch failed" alone is useless — undici tucks the real reason (DNS,
    // TLS, connection reset, redirect target) into err.cause. Surface it so a
    // failing submission is diagnosable instead of a silent mystery.
    const cause = err?.cause;
    return Response.json(
      {
        ok: false,
        reason: "fetch_failed",
        error: String(err?.message || err),
        cause: String(cause?.message || cause?.code || cause || ""),
      },
      { status: 200 }
    );
  }
}
