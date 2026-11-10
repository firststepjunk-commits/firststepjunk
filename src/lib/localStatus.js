// Patches fields of a submission in this device's localStorage cache so changes
// survive a page refresh for local-only rows (ones that haven't round-tripped
// to the Sheet yet). Uses the same storage key as lib/submissions.
// No-op if the id isn't in the local cache (e.g. a Sheet-backed row).

const STORAGE_KEY = "first-step-junk-submissions";

/**
 * Patch one or more fields on a cached submission by id.
 * @param {string} id — submission id
 * @param {Record<string, any>} fields — field/value pairs to merge
 */
export function patchLocal(id, fields) {
  if (typeof window === "undefined" || !id || !fields) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return;
    let changed = false;
    const next = list.map((s) => {
      if (s && s.id === id) {
        changed = true;
        return { ...s, ...fields };
      }
      return s;
    });
    if (changed) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Storage unavailable or malformed — the remote write is the source of truth.
  }
}

/** Backward-compat wrapper: patch just the status field. */
export function patchLocalStatus(id, status) {
  patchLocal(id, { status });
}
