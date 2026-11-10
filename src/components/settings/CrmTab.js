"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMergedSubmissions } from "@/lib/remoteSubmissions";
import { patchLocal } from "@/lib/localStatus";
import { defaultContent } from "@/lib/content-data";
import { BUSINESS, CITY_STATE } from "@/lib/seo";
import styles from "./crm-tab.module.css";

/* ---------------- constants ---------------- */

const STATUS_COLUMNS = [
  { key: "new", label: "New", color: "#0b6e4f" },
  { key: "contacted", label: "Contacted", color: "#b8860b" },
  { key: "scheduled", label: "Scheduled", color: "#5b4db8" },
  { key: "done", label: "Done", color: "#1b7f4e" },
];

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const TEAM_MEMBERS = (defaultContent.team?.members || [])
  .filter((m) => m.published !== false)
  .map((m) => m.name);

function isRemoteRow(job) {
  return job.source === "sheet" || /^(row-|sheet-)/.test(String(job.id || ""));
}

/* ---------------- helpers ---------------- */

function formatWhen(iso) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatWhenShort(iso) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return "";
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
    hour: "numeric",
    minute: "2-digit",
  });
}

function initials(name) {
  const parts = (name || "").trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function driveImageSrc(url, size = 1600) {
  if (!url) return "";
  const m =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const id = m && m[1];
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${size}` : url;
}

function parseValue(str) {
  if (!str) return 0;
  const n = parseFloat(String(str).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatCurrency(n) {
  if (!n) return "$0";
  return n >= 1000
    ? `$${(n / 1000).toFixed(1)}k`
    : `$${Math.round(n).toLocaleString()}`;
}

function firstNameOf(name) {
  const n = (name || "").trim();
  return n ? n.split(/\s+/)[0] : "there";
}

function summarizeServices(s) {
  const extras = [];
  if (s.pestTreatment === "yes") extras.push("pest treatment");
  if (s.homeRepair === "yes") extras.push("home repair");
  const desc = (s.junkDescription || "").trim();
  if (!desc && extras.length === 0) return "our services";
  const svcs = [BUSINESS.primaryService, ...extras];
  const list =
    svcs.length > 1
      ? `${svcs.slice(0, -1).join(", ")} and ${svcs[svcs.length - 1]}`
      : svcs[0];
  return desc ? `${list} for ${desc}` : list;
}

function buildReplyMailto(s) {
  const name = firstNameOf(s.name);
  const subject = `Hi ${name}, ${BUSINESS.shortName} appreciates your interest`;
  const body = [
    `Hi ${name},`,
    "",
    `We see you're interested in ${summarizeServices(s)}. ${BUSINESS.crmReplyLine}`,
    "",
    `Thanks and best regards,`,
    BUSINESS.brandName,
    defaultContent.footer?.location || CITY_STATE,
    [defaultContent.contact?.email, defaultContent.contact?.phone].filter(Boolean).join(" · "),
  ].join("\n");
  return `mailto:${s.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ---------------- inline icons ---------------- */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function PipelineIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="3" width="6" height="18" rx="1" />
      <rect x="15" y="3" width="6" height="11" rx="1" />
      <path d="M9 9h6" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg {...iconProps}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}
function ReplyIcon() {
  return (
    <svg {...iconProps}>
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="m15 11-6-6 6-6" transform="translate(0 6)" />
      <path d="m15 7-6 6 6 6" />
    </svg>
  );
}
function PhotoIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg {...iconProps}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function DollarIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function InboxIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

/* ---------------- lead card ---------------- */

function LeadCard({ lead, isSelected, onClick }) {
  const priorityClass =
    lead.priority === "high"
      ? styles.priorityHigh
      : lead.priority === "medium"
      ? styles.priorityMedium
      : styles.priorityLow;

  const cardAccent =
    lead.priority === "high"
      ? "var(--gold)"
      : lead.priority === "medium"
      ? "#64b5f6"
      : "transparent";

  return (
    <div
      className={`${styles.card}${isSelected ? ` ${styles.cardSelected}` : ""}`}
      style={{ "--card-accent": cardAccent }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={styles.cardTop}>
        <p className={styles.cardName}>{lead.name || "Unnamed lead"}</p>
        <span className={`${styles.priorityDot} ${priorityClass}`} title={`${lead.priority || "medium"} priority`} />
      </div>

      {lead.junkDescription && (
        <p className={styles.cardDesc}>{lead.junkDescription}</p>
      )}

      <div className={styles.cardTags}>
        {lead.pestTreatment === "yes" && (
          <span className={`${styles.tag} ${styles.tagPest}`}>Pest</span>
        )}
        {lead.homeRepair === "yes" && (
          <span className={`${styles.tag} ${styles.tagRepair}`}>Repair</span>
        )}
        {(lead.tags || []).slice(0, 3).map((t, i) => (
          <span key={i} className={styles.tag}>{t}</span>
        ))}
      </div>

      <div className={styles.cardFooter}>
        {lead.estimatedValue ? (
          <span className={styles.cardValue}>
            <DollarIcon />
            {lead.estimatedValue}
          </span>
        ) : (
          <span />
        )}
        <span className={styles.cardMeta}>
          {lead.photos?.length > 0 && (
            <span className={styles.cardMetaItem}>
              <PhotoIcon />
              {lead.photos.length}
            </span>
          )}
          {lead.assignedTo && (
            <span className={styles.cardAssigned}>
              <UserIcon />
              {lead.assignedTo}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

/* ---------------- detail drawer ---------------- */

function DetailDrawer({ lead, onClose, onUpdate, saving, saveError }) {
  const [tagInput, setTagInput] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [localNotes, setLocalNotes] = useState(lead?.notes || "");

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(null);
        else onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, lightbox]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!lead) return null;

  function handleStatusChange(newStatus) {
    const fields = { status: newStatus };
    // Auto-stamp lastContactedAt when moving to "contacted"
    if (newStatus === "contacted" && !lead.lastContactedAt) {
      fields.lastContactedAt = new Date().toISOString();
    }
    onUpdate(fields);
  }

  function handlePriorityChange(priority) {
    onUpdate({ priority });
  }

  function handleAssignedChange(e) {
    onUpdate({ assignedTo: e.target.value });
  }

  function handleValueChange(e) {
    onUpdate({ estimatedValue: e.target.value });
  }

  function handleNotesBlur() {
    if (localNotes !== (lead.notes || "")) {
      onUpdate({ notes: localNotes });
    }
  }

  function addTag(tag) {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const current = lead.tags || [];
    if (current.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;
    onUpdate({ tags: [...current, trimmed] });
    setTagInput("");
  }

  function removeTag(tag) {
    const current = lead.tags || [];
    onUpdate({ tags: current.filter((t) => t !== tag) });
  }

  function handleTagKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  }

  const photoCount = lead.photos?.length || 0;

  return (
    <>
      <div className={styles.drawerBackdrop} onClick={onClose} />
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label={`Lead details: ${lead.name || "Unnamed"}`}>
        {/* header */}
        <div className={styles.drawerHeader}>
          <div className={styles.drawerAvatar}>{initials(lead.name)}</div>
          <div className={styles.drawerTitleBlock}>
            <h3 className={styles.drawerName}>{lead.name || "Unnamed lead"}</h3>
            <p className={styles.drawerDate}>Received {formatWhen(lead.createdAt)}</p>
          </div>
          <button className={styles.drawerClose} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* body */}
        <div className={styles.drawerBody}>
          {/* quick actions */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Quick Actions</p>
            <div className={styles.actions}>
              {lead.phone && (
                <a className={styles.actionBtn} href={`tel:${lead.phone}`}>
                  <PhoneIcon /> Call
                </a>
              )}
              {lead.email && (
                <a className={styles.actionBtn} href={`mailto:${lead.email}`}>
                  <MailIcon /> Email
                </a>
              )}
              {lead.email && (
                <a className={styles.actionBtn} href={buildReplyMailto(lead)}>
                  <ReplyIcon /> Reply
                </a>
              )}
            </div>
          </div>

          {/* pipeline controls */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Pipeline</p>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Status</label>
                <div className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={String(lead.status || "new").toLowerCase()}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    {STATUS_COLUMNS.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                  <span className={`${styles.selectArrow} material-symbols-outlined`}>expand_more</span>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Priority</label>
                <div className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={lead.priority || "medium"}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <span className={`${styles.selectArrow} material-symbols-outlined`}>expand_more</span>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Estimated Value</label>
                <input
                  className={styles.input}
                  type="text"
                  value={lead.estimatedValue || ""}
                  onChange={handleValueChange}
                  onBlur={(e) => onUpdate({ estimatedValue: e.target.value })}
                  placeholder="$350"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Assigned To</label>
                <div className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={lead.assignedTo || ""}
                    onChange={handleAssignedChange}
                  >
                    <option value="">Unassigned</option>
                    {TEAM_MEMBERS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <span className={`${styles.selectArrow} material-symbols-outlined`}>expand_more</span>
                </div>
              </div>
            </div>
          </div>

          {/* tags */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Tags</p>
            <div className={styles.tagsEditor}>
              {(lead.tags || []).map((t) => (
                <span key={t} className={styles.tagChip}>
                  {t}
                  <button className={styles.tagRemove} onClick={() => removeTag(t)} aria-label={`Remove tag ${t}`}>
                    ×
                  </button>
                </span>
              ))}
              <input
                className={styles.tagInput}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => addTag(tagInput)}
                placeholder="Add tag…"
              />
            </div>
          </div>

          {/* contact info */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Contact Info</p>
            <dl className={styles.infoRows}>
              <div className={styles.infoRow}>
                <dt>Phone</dt>
                <dd>
                  {lead.phone ? (
                    <a className={styles.infoLink} href={`tel:${lead.phone}`}>{lead.phone}</a>
                  ) : "—"}
                </dd>
              </div>
              <div className={styles.infoRow}>
                <dt>Email</dt>
                <dd>
                  {lead.email ? (
                    <a className={styles.infoLink} href={buildReplyMailto(lead)}>{lead.email}</a>
                  ) : "—"}
                </dd>
              </div>
              <div className={styles.infoRow}>
                <dt>Junk</dt>
                <dd>{lead.junkDescription || "—"}</dd>
              </div>
              <div className={styles.infoRow}>
                <dt>Add-ons</dt>
                <dd>
                  Pest: {lead.pestTreatment || "no"} · Repair: {lead.homeRepair || "no"}
                </dd>
              </div>
              <div className={styles.infoRow}>
                <dt>Source</dt>
                <dd>{lead.source || "website"}</dd>
              </div>
              {lead.lastContactedAt && (
                <div className={styles.infoRow}>
                  <dt>Last Contact</dt>
                  <dd>{formatWhen(lead.lastContactedAt)}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* notes */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Internal Notes</p>
            <textarea
              className={styles.textarea}
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Add notes about this lead…"
              rows={4}
            />
          </div>

          {/* photos */}
          {photoCount > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>
                Photos ({photoCount})
              </p>
              <div className={styles.photosGrid}>
                {lead.photos.map((photo, i) => {
                  const src = driveImageSrc(photo.url);
                  return (
                    <div key={i} className={styles.photoTile} onClick={() => setLightbox(photo)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={photo.name || `Photo ${i + 1}`}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fb = e.currentTarget.nextElementSibling;
                          if (fb) fb.style.display = "flex";
                        }}
                      />
                      <div className={styles.photoFallback} style={{ display: "none" }}>
                        Unavailable
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* save indicator */}
        <div className={styles.saveBar}>
          {saving ? (
            <>
              <RefreshIcon />
              <span>Saving…</span>
            </>
          ) : saveError ? (
            <span className={styles.saveError}>{saveError}</span>
          ) : (
            <span className={styles.saveOk}>✓ All changes saved</span>
          )}
        </div>
      </div>

      {/* lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightbox(null)} aria-label="Close">
            <CloseIcon />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={driveImageSrc(lightbox.url, 2048)} alt={lightbox.name || "Photo"} />
        </div>
      )}
    </>
  );
}

/* ---------------- main CRM component ---------------- */

export default function CrmTab() {
  const [submissions, setSubmissions] = useState([]);
  const [liveSynced, setLiveSynced] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [savingId, setSavingId] = useState("");
  const [saveError, setSaveError] = useState("");
  // Mobile drill: pick a pipeline stage, then open a lead (list → detail)
  const [mobileStage, setMobileStage] = useState("new");

  const refresh = useCallback(async () => {
    const { submissions: merged, remoteOk } = await fetchMergedSubmissions();
    setSubmissions(merged);
    setLiveSynced(remoteOk);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load; setState runs inside an awaited async callback
    refresh();
  }, [refresh]);

  const updateLead = useCallback(
    async (lead, fields) => {
      const prevValues = {};
      for (const key of Object.keys(fields)) prevValues[key] = lead[key];

      // Optimistic update
      setSubmissions((list) =>
        list.map((s) => (s.id === lead.id ? { ...s, ...fields } : s))
      );
      patchLocal(lead.id, fields);
      setSaveError("");

      // Local-only rows have no Sheet row to write back to
      if (!isRemoteRow(lead)) return;

      setSavingId(lead.id);
      try {
        const res = await fetch("/api/submissions/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: lead.id, fields }),
        });
        const data = await res.json().catch(() => ({}));
        if (!data.ok) throw new Error(data.reason || "save failed");
      } catch (err) {
        // Revert on failure
        setSubmissions((list) =>
          list.map((s) => (s.id === lead.id ? { ...s, ...prevValues } : s))
        );
        patchLocal(lead.id, prevValues);
        setSaveError(`Couldn't save — ${String(err?.message || err)}. Reverted.`);
      } finally {
        setSavingId("");
      }
    },
    []
  );

  // Filter by search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter((s) =>
      [s.name, s.phone, s.email, s.junkDescription, ...(s.tags || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [submissions, query]);

  // Group by status
  const columns = useMemo(() => {
    const groups = { new: [], contacted: [], scheduled: [], done: [] };
    for (const s of filtered) {
      const st = String(s.status || "new").toLowerCase();
      if (groups[st]) groups[st].push(s);
      else groups.new.push(s);
    }
    return groups;
  }, [filtered]);

  // Stats
  const stats = useMemo(() => {
    const c = { total: submissions.length, new: 0, contacted: 0, scheduled: 0, done: 0 };
    let pipelineValue = 0;
    for (const s of submissions) {
      const st = String(s.status || "new").toLowerCase();
      if (c[st] !== undefined) c[st] += 1;
      if (st !== "done") pipelineValue += parseValue(s.estimatedValue);
    }
    return { ...c, pipelineValue };
  }, [submissions]);

  const selectedLead = selectedId
    ? submissions.find((s) => s.id === selectedId)
    : null;

  const mobileLeads = columns[mobileStage] || [];
  const activeMobileCol =
    STATUS_COLUMNS.find((c) => c.key === mobileStage) || STATUS_COLUMNS[0];

  return (
    <div className={styles.root}>
      {/* top bar */}
      <div className={styles.topBar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <PipelineIcon />
          </div>
          <div className={styles.brandText}>
            <h2>Lead Pipeline</h2>
            <p>CRM</p>
          </div>
        </div>

        <div className={styles.topActions}>
          <button type="button" className={styles.iconBtn} onClick={refresh} aria-label="Refresh leads">
            <RefreshIcon />
            <span className={styles.iconBtnLabel}>Refresh</span>
          </button>

          <span className={`${styles.syncBadge} ${liveSynced ? styles.syncOn : styles.syncOff}`}>
            <span className={styles.syncDot} />
            {liveSynced ? "Live" : "Local"}
          </span>
        </div>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
          <input
            className={styles.searchInput}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads…"
            enterKeyHint="search"
          />
        </div>
      </div>

      {/* stats — compact strip */}
      <div className={styles.stats} role="list" aria-label="Pipeline stats">
        <div className={styles.stat} role="listitem">
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        {STATUS_COLUMNS.map((c) => (
          <button
            key={c.key}
            type="button"
            role="listitem"
            className={`${styles.stat} ${styles.statTap}${mobileStage === c.key ? ` ${styles.statActive}` : ""}`}
            style={{ "--col-accent": c.color }}
            onClick={() => setMobileStage(c.key)}
          >
            <span className={styles.statValue}>{stats[c.key]}</span>
            <span className={styles.statLabel}>{c.label}</span>
          </button>
        ))}
        <div className={`${styles.stat} ${styles.statAccent}`} role="listitem">
          <span className={`${styles.statValue} ${styles.statValueGold}`}>
            {formatCurrency(stats.pipelineValue)}
          </span>
          <span className={styles.statLabel}>Pipeline</span>
        </div>
      </div>

      {/* Mobile: stage chips → vertical list (drill) */}
      <div className={styles.mobilePipeline}>
        <div className={styles.stageChips} role="tablist" aria-label="Pipeline stage">
          {STATUS_COLUMNS.map((col) => {
            const count = (columns[col.key] || []).length;
            const active = mobileStage === col.key;
            return (
              <button
                key={col.key}
                type="button"
                role="tab"
                aria-selected={active}
                className={`${styles.stageChip}${active ? ` ${styles.stageChipActive}` : ""}`}
                style={{ "--col-accent": col.color }}
                onClick={() => setMobileStage(col.key)}
              >
                <span className={styles.stageChipDot} />
                {col.label}
                <span className={styles.stageChipCount}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.mobileList} role="tabpanel">
          <div className={styles.mobileListHeader}>
            <h3>{activeMobileCol.label}</h3>
            <span>{mobileLeads.length} lead{mobileLeads.length === 1 ? "" : "s"}</span>
          </div>
          {mobileLeads.length === 0 ? (
            <div className={styles.emptyColumn}>
              <InboxIcon />
              <p>No {activeMobileCol.label.toLowerCase()} leads</p>
            </div>
          ) : (
            mobileLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isSelected={selectedId === lead.id}
                onClick={() => setSelectedId(lead.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Desktop: horizontal kanban */}
      <div className={styles.board}>
        {STATUS_COLUMNS.map((col) => {
          const leads = columns[col.key] || [];
          return (
            <div key={col.key} className={styles.column}>
              <div className={styles.columnHeader} style={{ "--col-accent": col.color }}>
                <span className={styles.columnTitle}>
                  <span className={styles.columnDot} />
                  {col.label}
                </span>
                <span className={styles.columnCount}>{leads.length}</span>
              </div>
              <div className={styles.columnBody}>
                {leads.length === 0 ? (
                  <div className={styles.emptyColumn}>
                    <InboxIcon />
                    <p>No {col.label.toLowerCase()} leads</p>
                  </div>
                ) : (
                  leads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      isSelected={selectedId === lead.id}
                      onClick={() => setSelectedId(lead.id)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* detail drawer */}
      {selectedLead && (
        <DetailDrawer
          key={selectedLead.id}
          lead={selectedLead}
          onClose={() => setSelectedId(null)}
          onUpdate={(fields) => updateLead(selectedLead, fields)}
          saving={Boolean(savingId)}
          saveError={saveError}
        />
      )}
    </div>
  );
}