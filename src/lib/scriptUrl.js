// Single source of truth for resolving the Apps Script /exec URL from env.
//
// Env values pasted into Netlify routinely arrive with stray surrounding
// quotes, leading/trailing whitespace, or no https:// scheme — any of which
// makes fetch() throw "Failed to parse URL" and takes down whatever route uses
// it (the quote form, the CRM read, or status write-back). Normalize
// defensively so one bad paste can't break anything.
export function normalizeScriptUrl(raw) {
  let u = String(raw || "").trim().replace(/^["']+|["']+$/g, "").trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u.replace(/^\/+/, "");
  try {
    return new URL(u).toString();
  } catch {
    return "";
  }
}

// Resolve the script URL from env, normalized. Tries the server-only var first,
// then the public one — and crucially returns the first candidate that
// normalizes to a VALID url, so a non-empty-but-garbage QUOTE_SCRIPT_URL can't
// shadow a perfectly good NEXT_PUBLIC_QUOTE_SCRIPT_URL.
export function getScriptUrl() {
  const candidates = [
    process.env.QUOTE_SCRIPT_URL,
    process.env.NEXT_PUBLIC_QUOTE_SCRIPT_URL,
  ];
  for (const candidate of candidates) {
    const normalized = normalizeScriptUrl(candidate);
    if (normalized) return normalized;
  }
  return "";
}
