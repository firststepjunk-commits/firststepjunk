// Merges live Sheet submissions (via the /api/submissions server proxy) with
// the per-device localStorage cache. The Google Sheet is the source of truth;
// local-only entries that haven't round-tripped yet are appended so a fresh
// submission shows immediately even before the Sheet read catches up.

import { getSubmissions } from "@/lib/submissions";

// Normalize a remote Sheet row (from the Apps Script doGet) into the same shape
// the CRM renders for local submissions. Remote rows carry a Drive image URL
// rather than an inline data URL.
function normalizeRemote(row) {
  // Parse tags: stored as newline- or comma-separated string in the Sheet.
  const rawTags = row.tags || "";
  const tags = Array.isArray(rawTags)
    ? rawTags
    : String(rawTags)
        .split(/[\n,]/)
        .map((t) => t.trim())
        .filter(Boolean);

  return {
    id: row.id || `sheet-${row.createdAt || ""}-${row.phone || ""}`,
    createdAt: row.createdAt || "",
    status: row.status || "new",
    name: row.name || "",
    phone: row.phone || "",
    email: row.email || "",
    junkDescription: row.junkDescription || "",
    pestTreatment: row.pestTreatment || "no",
    homeRepair: row.homeRepair || "no",
    photos: Array.isArray(row.photos)
      ? row.photos.map((p) => ({
          name: p.name || "photo",
          url: p.url || "",
        }))
      : [],
    // CRM enrichment fields
    notes: row.notes || "",
    priority: row.priority || "medium",
    estimatedValue: row.estimatedValue || "",
    assignedTo: row.assignedTo || "",
    lastContactedAt: row.lastContactedAt || "",
    tags,
    source: row.source || "sheet",
  };
}

// Dedupe key: same phone + same calendar day = same submission across stores.
function dedupeKey(s) {
  return `${(s.phone || "").replace(/\D/g, "")}|${String(s.createdAt || "").slice(0, 10)}`;
}

export async function fetchMergedSubmissions() {
  const local = getSubmissions().map((s) => ({ ...s, source: s.source || "local" }));

  let remote = [];
  let remoteOk = false;
  try {
    const res = await fetch("/api/submissions", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.submissions)) {
        remote = data.submissions.map(normalizeRemote);
        remoteOk = true;
      }
    }
  } catch {
    // Offline or proxy not configured — fall back to the local cache only.
  }

  const seen = new Set();
  const merged = [];
  for (const s of remote) {
    merged.push(s);
    seen.add(dedupeKey(s));
    seen.add(s.id);
  }
  for (const s of local) {
    if (seen.has(dedupeKey(s)) || seen.has(s.id)) continue;
    merged.push(s);
  }

  merged.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return { submissions: merged, remoteOk };
}
