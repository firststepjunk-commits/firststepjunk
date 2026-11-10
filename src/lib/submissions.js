const STORAGE_KEY = "first-step-junk-submissions";

function readStoredSubmissions() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStoredSubmissions(submissions) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch {
    // Quota exceeded (large image data URLs) — keep only the most recent
    // entries and retry so a full store never blocks a new submission.
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions.slice(0, 20)));
    } catch {
      /* give up silently; the Google backend remains the source of truth */
    }
  }
}

export function buildSubmissionRecord(data) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "new",
    name: data.name || "",
    phone: data.phone || "",
    email: data.email || "",
    junkDescription: data.junkDescription || "",
    pestTreatment: data.pestTreatment || "no",
    homeRepair: data.homeRepair || "no",
    photos: (data.photos || []).map((photo) => ({
      name: photo.name || "uploaded-image",
      url: photo.url || "",
    })),
    // CRM enrichment fields (LinkedIn Recruiter-style lead pipeline)
    notes: "",
    priority: "medium",
    estimatedValue: "",
    assignedTo: "",
    lastContactedAt: "",
    tags: [],
    source: "website",
  };
}

export function getSubmissions() {
  return readStoredSubmissions();
}

export function saveSubmission(data) {
  const record = buildSubmissionRecord(data);
  const submissions = [record, ...readStoredSubmissions()];
  writeStoredSubmissions(submissions);
  return record;
}

export function clearSubmissions() {
  writeStoredSubmissions([]);
}
