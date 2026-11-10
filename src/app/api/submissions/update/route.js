// Server-side proxy for the Apps Script lead write-back.
//
// Mirrors the read proxy: the browser can't POST to the Apps Script /exec URL
// with the secret, so this route injects the token server-side and forwards the
// payload. Reuses the same SUBMISSIONS_READ_TOKEN that guards the read API —
// no separate secret needed.
//
// Supports two action shapes:
//   1. Legacy:  { id, status }                     → updateStatus
//   2. General:  { id, fields: { ... } }            → updateLead (any CRM field)
import { getScriptUrl } from "@/lib/scriptUrl";

export const dynamic = "force-dynamic";

const ALLOWED_STATUS = ["new", "contacted", "scheduled", "done"];
const ALLOWED_PRIORITY = ["high", "medium", "low"];

// Fields the CRM can write back to the Sheet, with per-field validation.
const FIELD_VALIDATORS = {
  status: (v) => ALLOWED_STATUS.includes(String(v).toLowerCase()),
  priority: (v) => ALLOWED_PRIORITY.includes(String(v).toLowerCase()),
  notes: () => true,
  estimatedValue: () => true,
  assignedTo: () => true,
  lastContactedAt: () => true,
  tags: (v) => Array.isArray(v) || typeof v === "string",
  source: () => true,
};

export async function POST(request) {
  const scriptUrl = getScriptUrl();
  const token = process.env.SUBMISSIONS_READ_TOKEN;

  if (!scriptUrl || !token) {
    return Response.json({ ok: false, reason: "not_configured" });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "bad_request" });
  }

  const id = String(body?.id || "");
  if (!id) {
    return Response.json({ ok: false, reason: "bad_request" });
  }

  // Build the fields object to send upstream.
  let fields = {};

  if (body.fields && typeof body.fields === "object") {
    // General updateLead path — validate each field.
    for (const [key, value] of Object.entries(body.fields)) {
      const validator = FIELD_VALIDATORS[key];
      if (validator && validator(value)) {
        fields[key] = key === "tags" && Array.isArray(value) ? value.join(", ") : value;
      }
    }
  } else if (body.status) {
    // Legacy updateStatus path.
    const status = String(body.status).toLowerCase();
    if (!ALLOWED_STATUS.includes(status)) {
      return Response.json({ ok: false, reason: "bad_request" });
    }
    fields.status = status;
  }

  if (Object.keys(fields).length === 0) {
    return Response.json({ ok: false, reason: "bad_request" });
  }

  // If only status is changing, use the legacy action for backward compat.
  const action = Object.keys(fields).length === 1 && fields.status ? "updateStatus" : "updateLead";
  const payload = { action, token, id };
  if (action === "updateStatus") {
    payload.status = fields.status;
  } else {
    payload.fields = fields;
  }

  try {
    // text/plain avoids a CORS preflight and matches how the form posts; Apps
    // Script reads the raw body regardless of content type.
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store",
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json({ ok: false, reason: "upstream_not_json" });
    }

    if (!data || data.ok !== true) {
      return Response.json({
        ok: false,
        reason: (data && data.error) || "upstream_error",
      });
    }

    return Response.json({ ok: true, id, fields });
  } catch {
    // NEVER return err.message here — the thrown fetch error embeds the full
    // request URL/body context and can carry the token. Keep it generic.
    return Response.json({ ok: false, reason: "fetch_failed" });
  }
}
