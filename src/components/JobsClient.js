"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMergedSubmissions } from "@/lib/remoteSubmissions";
import { patchLocalStatus } from "@/lib/localStatus";

const STATUS_STYLES = {
  new: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
  contacted: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  scheduled: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20",
  done: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
};

const STATUS_OPTIONS = ["new", "contacted", "scheduled", "done"];
const STATUS_FILTERS = ["all", ...STATUS_OPTIONS];

// A Sheet-backed row can be written back; local-only rows just update the cache.
function isRemoteRow(job) {
  return job.source === "sheet" || /^(row-|sheet-)/.test(String(job.id || ""));
}

function statusStyle(status) {
  return (
    STATUS_STYLES[String(status || "").toLowerCase()] ||
    "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
  );
}

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function JobsClient() {
  const [submissions, setSubmissions] = useState([]);
  const [liveSynced, setLiveSynced] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [savingId, setSavingId] = useState("");
  const [statusError, setStatusError] = useState("");

  const refresh = useCallback(async () => {
    // Live Sheet rows (via /api/submissions) merged with this device's cache.
    const { submissions: merged, remoteOk } = await fetchMergedSubmissions();
    setSubmissions(merged);
    setLiveSynced(remoteOk);
  }, []);

  const updateStatus = useCallback(async (job, nextStatus) => {
    const prev = String(job.status || "new").toLowerCase();
    if (nextStatus === prev) return;

    // Optimistic: update the card and this device's cache immediately.
    setStatusError("");
    setSubmissions((list) =>
      list.map((s) => (s.id === job.id ? { ...s, status: nextStatus } : s))
    );
    patchLocalStatus(job.id, nextStatus);

    // Local-only rows have no Sheet row to write back to — the cache patch above
    // is all that's needed.
    if (!isRemoteRow(job)) return;

    setSavingId(job.id);
    try {
      const res = await fetch("/api/submissions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: job.id, status: nextStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!data.ok) throw new Error(data.reason || "save failed");
    } catch (err) {
      // Revert on failure so the UI never lies about what's saved.
      setSubmissions((list) =>
        list.map((s) => (s.id === job.id ? { ...s, status: prev } : s))
      );
      patchLocalStatus(job.id, prev);
      setStatusError(
        `Couldn't save "${job.name || "job"}" status — ${String(
          err?.message || err
        )}. It's back to "${prev}".`
      );
    } finally {
      setSavingId("");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load; setState runs inside an awaited async callback, not synchronously in the effect body
    refresh();
  }, [refresh]);

  const counts = useMemo(() => {
    const c = { all: submissions.length, new: 0, contacted: 0, scheduled: 0, done: 0 };
    for (const s of submissions) {
      const st = String(s.status || "new").toLowerCase();
      if (c[st] !== undefined) c[st] += 1;
    }
    return c;
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions.filter((s) => {
      if (statusFilter !== "all" && String(s.status || "new").toLowerCase() !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return [s.name, s.phone, s.email, s.junkDescription]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [submissions, query, statusFilter]);

  return (
    <main className="min-h-screen bg-surface-container-lowest px-4 py-10 text-on-surface sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-5xl">
        {/* header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm">Jobs CRM</p>
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">Work queue</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              {counts.all} {counts.all === 1 ? "job" : "jobs"} tracked
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-white px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>
            <Link
              href="/submissions"
              className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-white px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">inbox</span>
              Intake
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              Settings
            </Link>
          </div>
        </div>

        {/* search + status filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant/60">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, description…"
              className="w-full rounded-full border border-outline-variant/60 bg-white py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  statusFilter === f
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant/60 bg-white text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                {f} ({counts[f] ?? 0})
              </button>
            ))}
          </div>
        </div>

        {statusError && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="material-symbols-outlined text-lg">error</span>
            <span>{statusError}</span>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-outline-variant bg-white p-10 text-center shadow-sm">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">work</span>
            <p className="mt-3 text-lg font-semibold">
              {submissions.length === 0 ? "No jobs yet." : "No jobs match your filters."}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              {submissions.length === 0
                ? "Every quote request lands here as a job card you can track and follow up on."
                : "Try clearing the search or switching the status filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <article
                key={s.id}
                className="rounded-2xl border border-outline-variant/40 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-bold text-primary">{s.name || "Unassigned job"}</h2>
                      <span className="relative inline-flex items-center">
                        <select
                          value={String(s.status || "new").toLowerCase()}
                          onChange={(e) => updateStatus(s, e.target.value)}
                          disabled={savingId === s.id}
                          aria-label="Job status"
                          className={`cursor-pointer appearance-none rounded-full py-0.5 pl-2.5 pr-6 text-xs font-semibold capitalize outline-none transition-opacity disabled:opacity-60 ${statusStyle(s.status)}`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-white text-on-surface">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-sm opacity-70">
                          expand_more
                        </span>
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-on-surface-variant">{formatWhen(s.createdAt)}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">image</span>
                    {s.photos?.length || 0}
                  </span>
                </div>

                {s.junkDescription && (
                  <p className="mt-3 line-clamp-2 text-sm text-on-surface">{s.junkDescription}</p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {s.phone ? (
                    <a
                      href={`tel:${s.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-sm font-semibold text-on-surface transition-colors hover:bg-primary hover:text-on-primary"
                    >
                      <span className="material-symbols-outlined text-base">call</span>
                      {s.phone}
                    </a>
                  ) : (
                    <span className="rounded-full bg-surface-container px-3 py-1.5 text-sm text-on-surface-variant">No phone</span>
                  )}
                  {s.email && (
                    <a
                      href={`mailto:${s.email}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-sm font-semibold text-on-surface transition-colors hover:bg-primary hover:text-on-primary"
                    >
                      <span className="material-symbols-outlined text-base">mail</span>
                      Email
                    </a>
                  )}
                  {s.pestTreatment === "yes" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="material-symbols-outlined text-sm">pest_control</span>
                      Pest
                    </span>
                  )}
                  {s.homeRepair === "yes" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="material-symbols-outlined text-sm">handyman</span>
                      Repair
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* footer live status */}
        <p className="mt-6 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest px-5 py-4 text-sm text-on-surface-variant">
          {liveSynced
            ? "Live from the Google Sheet, merged with this device's cache. The Sheet is the source of truth."
            : "Live Sheet sync unavailable — showing this device's local cache. The Google Sheet remains the source of truth."}
        </p>
      </div>
    </main>
  );
}
