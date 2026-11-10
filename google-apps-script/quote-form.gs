/**
 * First Step Junk Removal — Google Apps Script backend.
 *
 * Responsibilities:
 *   1. Quote form → Drive photos + Sheet row + owner/customer email
 *   2. CRM read (doGet) + status/lead write-back (token-guarded)
 *   3. Site content headless store (SiteContent tab, Key | Data JSON)
 *      — replaces Airtable for /settings Save & Publish
 *
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1MBLSA8jBLTscBl-fdP3p-ynOKimRJCXeyBycvHCGYio
 *
 * Tabs:
 *   • First sheet (gid=0) — quote / CRM submissions (header-driven)
 *   • SiteContent         — website text/settings (Key | Data)
 *
 * Deploy: see README.md. After edits → Manage deployments → New version.
 */

// ── Config (filled for First Step Junk) ──────────────────────────────────────
var NOTIFY_EMAILS = ["firststep.junk@gmail.com", "loganwdev@gmail.com"];
var DRIVE_FOLDER_ID = "PASTE_DRIVE_FOLDER_ID_HERE"; // optional; auto-creates folder if unset
var SHEET_ID = "1MBLSA8jBLTscBl-fdP3p-ynOKimRJCXeyBycvHCGYio";
// Must match SUBMISSIONS_READ_TOKEN in Netlify / .env.local
var READ_TOKEN = "FsJ8rK2mP9xQ4nW7vL3sT6hY1bN5cD0e";
var CONTENT_TAB = "SiteContent";
var CONTENT_KEY = "content";
// ─────────────────────────────────────────────────────────────────────────────

var MAX_PHOTOS = 5;
var PHOTO_FOLDER_NAME = "First Step Junk Photos";
var ALLOWED_STATUS = ["new", "contacted", "scheduled", "done"];

var FIELD_ORDER = [
  "date", "name", "phone", "email", "junkDescription",
  "pestTreatment", "homeRepair", "photoUrl", "id", "status",
  "notes", "priority", "estimatedValue", "assignedTo", "lastContactedAt",
  "tags", "source",
];

var SUBMISSION_HEADERS = [
  "Date", "Name", "Phone", "Email", "Junk description", "Pest treatment",
  "Home repair", "Photo_url", "id", "status", "notes", "priority",
  "estimatedValue", "assignedTo", "lastContactedAt", "tags", "source",
];

function normalizeHeader(h) {
  return String(h == null ? "" : h).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function fieldForHeader(n) {
  switch (n) {
    case "date": return "date";
    case "name": return "name";
    case "phone": return "phone";
    case "email": return "email";
    case "junkdescription":
    case "junk":
    case "description": return "junkDescription";
    case "pesttreatment":
    case "pest": return "pestTreatment";
    case "homerepair":
    case "repair": return "homeRepair";
    case "photourl":
    case "photourls":
    case "photolink":
    case "photolinks":
    case "photos":
    case "links": return "photoUrl";
    case "id": return "id";
    case "status": return "status";
    case "notes": return "notes";
    case "priority": return "priority";
    case "estimatedvalue":
    case "estimate":
    case "value": return "estimatedValue";
    case "assignedto":
    case "assigned": return "assignedTo";
    case "lastcontacted":
    case "lastcontactedat":
    case "lastcontact": return "lastContactedAt";
    case "tags": return "tags";
    case "source": return "source";
    default: return "";
  }
}

function getColumnMap(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return { map: {}, lastCol: 0, hasHeaders: false };
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  for (var c = 0; c < headers.length; c++) {
    var field = fieldForHeader(normalizeHeader(headers[c]));
    if (field && !map[field]) map[field] = c + 1;
  }
  var hasHeaders = !!(map.name && (map.status || map.id || map.phone || map.email));
  return { map: map, lastCol: lastCol, hasHeaders: hasHeaders };
}

function appendSubmissionRow(sheet, values) {
  var info = getColumnMap(sheet);
  if (info.hasHeaders) {
    var row = [];
    for (var i = 0; i < info.lastCol; i++) row.push("");
    for (var field in info.map) {
      if (values.hasOwnProperty(field)) row[info.map[field] - 1] = values[field];
    }
    sheet.appendRow(row);
  } else {
    sheet.appendRow(FIELD_ORDER.map(function (f) {
      return values.hasOwnProperty(f) ? values[f] : "";
    }));
  }
}

function cell(row, map, field) {
  var col = map[field];
  if (col) return row[col - 1];
  var idx = FIELD_ORDER.indexOf(field);
  return idx >= 0 ? row[idx] : "";
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(SHEET_ID);
}

/** First tab = submissions. Seeds headers if the sheet is empty. */
function getSubmissionSheet() {
  var sheet = getSpreadsheet().getSheets()[0];
  ensureSubmissionHeaders(sheet);
  return sheet;
}

function ensureSubmissionHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(SUBMISSION_HEADERS);
}

function getOrCreateContentSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONTENT_TAB);
  if (!sheet) {
    sheet = ss.insertSheet(CONTENT_TAB);
    sheet.appendRow(["Key", "Data"]);
  } else if (sheet.getLastRow() < 1) {
    sheet.appendRow(["Key", "Data"]);
  }
  return sheet;
}

function tokenOk(token) {
  return READ_TOKEN && READ_TOKEN !== "PASTE_READ_TOKEN_HERE" && token === READ_TOKEN;
}

function handleGetContent() {
  var sheet = getOrCreateContentSheet();
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === CONTENT_KEY && rows[i][1]) {
      try {
        return jsonOut({ ok: true, content: JSON.parse(String(rows[i][1])) });
      } catch (err) {
        return jsonOut({ ok: false, error: "invalid_json" });
      }
    }
  }
  return jsonOut({ ok: true, content: null });
}

function handleSaveContent(data) {
  if (!tokenOk(data.token)) {
    return jsonOut({ ok: false, error: "unauthorized" });
  }
  var content = data.content;
  if (!content || typeof content !== "object") {
    return jsonOut({ ok: false, error: "bad_request" });
  }

  var sheet = getOrCreateContentSheet();
  var rows = sheet.getDataRange().getValues();
  var json = JSON.stringify(content);
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === CONTENT_KEY) {
      sheet.getRange(i + 1, 2).setValue(json);
      return jsonOut({ ok: true });
    }
  }
  sheet.appendRow([CONTENT_KEY, json]);
  return jsonOut({ ok: true });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ ok: false, error: "bad_request" });
    }
    var data = JSON.parse(e.postData.contents);

    if (data.action === "updateStatus") {
      return handleUpdateStatus(data);
    }
    if (data.action === "updateLead") {
      return handleUpdateLead(data);
    }
    if (data.action === "saveContent") {
      return handleSaveContent(data);
    }

    // Honeypot: bots fill the hidden field — accept silently and drop.
    if (data["bot-field"]) {
      return ContentService.createTextOutput("ok");
    }

    return handleQuoteSubmission(data);
  } catch (err) {
    // Never lose the HTTP response — return JSON so /api/quote can diagnose.
    return jsonOut({
      ok: false,
      error: "script_error",
      detail: String(err && err.message ? err.message : err).slice(0, 300),
    });
  }
}

function handleQuoteSubmission(data) {
  var stamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd HH.mm"
  );
  var safeName = String(data.name || "no-name")
    .replace(/[^\w -]/g, "")
    .slice(0, 40);

  var links = [];
  var photoError = "";
  var photos = (data.photos || [])
    .filter(function (p) { return p && p.data; })
    .slice(0, MAX_PHOTOS);
  if (photos.length > 0) {
    try {
      var folder = getPhotoFolder();
      links = photos
        .map(function (p, i) {
          try {
            var blob = Utilities.newBlob(
              Utilities.base64Decode(p.data),
              p.type || "image/jpeg",
              stamp + " " + safeName + " " + (i + 1) + ".jpg"
            );
            return folder.createFile(blob).getUrl();
          } catch (perr) {
            return "";
          }
        })
        .filter(function (u) { return u; });
    } catch (ferr) {
      photoError = String(ferr && ferr.message ? ferr.message : ferr);
    }
  }

  var rowId = "row-" + Date.now() + "-" + Math.floor(Math.random() * 1e6);
  var sheet = getSubmissionSheet();
  appendSubmissionRow(sheet, {
    date: new Date(),
    name: data.name || "",
    phone: data.phone || "",
    email: data.email || "",
    junkDescription: data.junkDescription || "",
    pestTreatment: data.pestTreatment || "",
    homeRepair: data.homeRepair || "",
    photoUrl: links.join("\n"),
    id: rowId,
    status: "new",
    notes: "",
    priority: "medium",
    estimatedValue: "",
    assignedTo: "",
    lastContactedAt: "",
    tags: "",
    source: "website",
  });

  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAILS.join(","),
      subject:
        "New quote request — " +
        (data.name || "no name") +
        " (" + links.length + " photo" + (links.length === 1 ? "" : "s") + ")",
      body: [
        "New quote request from the website:",
        "",
        "Name:  " + (data.name || "—"),
        "Phone: " + (data.phone || "—"),
        "Email: " + (data.email || "—"),
        "",
        "Junk description:",
        data.junkDescription || "—",
        "",
        "Pest treatment: " + (data.pestTreatment || "no"),
        "Home repair:    " + (data.homeRepair || "no"),
        "",
        links.length
          ? "Photos:\n" + links.join("\n")
          : (photoError
              ? "Photos were submitted but could NOT be saved to Drive: " + photoError
              : "No photos attached."),
      ].join("\n"),
    });
  } catch (mailErr) {
    // Sheet row already saved — don't fail the form over email quota.
  }

  if (data.email) {
    try {
      MailApp.sendEmail({
        to: data.email,
        subject: "Thanks for your request — First Step Junk",
        body: [
          "Hi " + (data.name || "there") + ",",
          "",
          "Thanks for reaching out to First Step Junk. We received your form and will get back to you shortly.",
          "",
          "If you already uploaded photos, our team will review them and follow up with the next steps.",
        ].join("\n"),
      });
    } catch (confirmErr) {
      // ignore
    }
  }

  return ContentService.createTextOutput("ok");
}

function getPhotoFolder() {
  if (DRIVE_FOLDER_ID && DRIVE_FOLDER_ID !== "PASTE_DRIVE_FOLDER_ID_HERE") {
    try {
      return DriveApp.getFolderById(DRIVE_FOLDER_ID);
    } catch (err) {
      // fall through
    }
  }
  var existing = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
  if (existing.hasNext()) return existing.next();
  return DriveApp.createFolder(PHOTO_FOLDER_NAME);
}

function findRowById(sheet, targetId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var info = getColumnMap(sheet);
  var idCol = info.map.id || (FIELD_ORDER.indexOf("id") + 1);
  var dateCol = info.map.date || (FIELD_ORDER.indexOf("date") + 1);

  var ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === targetId) return i + 2;
  }

  if (targetId.indexOf("sheet-") === 0) {
    var wantMs = new Date(targetId.slice(6)).getTime();
    var dates = sheet.getRange(2, dateCol, lastRow - 1, 1).getValues();
    for (var j = 0; j < dates.length; j++) {
      var d = dates[j][0];
      var ms = (d instanceof Date) ? d.getTime() : new Date(d).getTime();
      if (!isNaN(ms) && Math.abs(ms - wantMs) < 2000) return j + 2;
    }
  }
  return -1;
}

function handleUpdateStatus(data) {
  if (!tokenOk(data.token)) {
    return jsonOut({ ok: false, error: "unauthorized" });
  }

  var targetId = String(data.id || "");
  var newStatus = String(data.status || "").toLowerCase();
  if (!targetId || ALLOWED_STATUS.indexOf(newStatus) === -1) {
    return jsonOut({ ok: false, error: "bad_request" });
  }

  var sheet = getSubmissionSheet();
  var rowNum = findRowById(sheet, targetId);
  if (rowNum === -1) return jsonOut({ ok: false, error: "not_found" });

  var info = getColumnMap(sheet);
  var statusCol = info.map.status || (FIELD_ORDER.indexOf("status") + 1);
  sheet.getRange(rowNum, statusCol).setValue(newStatus);
  return jsonOut({ ok: true, id: targetId, status: newStatus });
}

var ALLOWED_PRIORITY = ["high", "medium", "low"];
var UPDATABLE_FIELDS = {
  notes: "notes",
  priority: "priority",
  estimatedValue: "estimatedValue",
  assignedTo: "assignedTo",
  lastContactedAt: "lastContactedAt",
  tags: "tags",
  status: "status",
  source: "source",
};

function handleUpdateLead(data) {
  if (!tokenOk(data.token)) {
    return jsonOut({ ok: false, error: "unauthorized" });
  }

  var targetId = String(data.id || "");
  var fields = data.fields || {};
  if (!targetId || !fields || typeof fields !== "object") {
    return jsonOut({ ok: false, error: "bad_request" });
  }

  var cleanFields = {};
  for (var key in fields) {
    if (!fields.hasOwnProperty(key)) continue;
    var canonical = UPDATABLE_FIELDS[key];
    if (!canonical) continue;
    var val = fields[key];
    if (canonical === "status") {
      val = String(val || "").toLowerCase();
      if (ALLOWED_STATUS.indexOf(val) === -1) continue;
    }
    if (canonical === "priority") {
      val = String(val || "").toLowerCase();
      if (ALLOWED_PRIORITY.indexOf(val) === -1) continue;
    }
    if (canonical === "tags" && Array.isArray(val)) {
      val = val.join(", ");
    }
    cleanFields[canonical] = String(val);
  }

  if (Object.keys(cleanFields).length === 0) {
    return jsonOut({ ok: false, error: "bad_request" });
  }

  var sheet = getSubmissionSheet();
  var rowNum = findRowById(sheet, targetId);
  if (rowNum === -1) return jsonOut({ ok: false, error: "not_found" });

  var info = getColumnMap(sheet);
  for (var fieldKey in cleanFields) {
    if (!cleanFields.hasOwnProperty(fieldKey)) continue;
    var col = info.map[fieldKey];
    if (!col) {
      var lastCol = sheet.getLastColumn();
      sheet.getRange(1, lastCol + 1).setValue(fieldKey);
      col = lastCol + 1;
      info.map[fieldKey] = col;
    }
    sheet.getRange(rowNum, col).setValue(cleanFields[fieldKey]);
  }

  return jsonOut({ ok: true, id: targetId, fields: cleanFields });
}

/**
 * GET ?token=…&limit=200          → submissions
 * GET ?token=…&action=getContent  → site content JSON
 */
function doGet(e) {
  try {
    var token = e && e.parameter ? e.parameter.token : "";
    if (!tokenOk(token)) {
      return jsonOut({ ok: false, error: "unauthorized" });
    }

    var action = e && e.parameter ? e.parameter.action : "";
    if (action === "getContent") {
      return handleGetContent();
    }

    var limit = parseInt((e.parameter && e.parameter.limit) || "200", 10) || 200;
    limit = Math.max(1, Math.min(limit, 1000));

    var sheet = getSubmissionSheet();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return jsonOut({ ok: true, submissions: [] });

    var info = getColumnMap(sheet);
    var lastCol = Math.max(info.lastCol, FIELD_ORDER.length);
    var startRow = Math.max(2, lastRow - limit + 1);
    var numRows = lastRow - startRow + 1;
    var values = sheet.getRange(startRow, 1, numRows, lastCol).getValues();

    var map = info.map;
    var submissions = values
      .map(function (row) { return rowToSubmission(row, map); })
      .filter(function (s) { return s; })
      .reverse();

    return jsonOut({ ok: true, submissions: submissions });
  } catch (err) {
    return jsonOut({
      ok: false,
      error: "script_error",
      detail: String(err && err.message ? err.message : err).slice(0, 300),
    });
  }
}

function rowToSubmission(row, map) {
  var date = cell(row, map, "date");
  var name = cell(row, map, "name");
  var phone = cell(row, map, "phone");
  if (!date && !name && !phone) return null;

  var createdAt;
  try {
    createdAt = (date instanceof Date) ? date.toISOString() : new Date(date).toISOString();
  } catch (err) {
    createdAt = new Date().toISOString();
  }

  var links = String(cell(row, map, "photoUrl") || "")
    .split("\n")
    .filter(function (s) { return s; });
  var photos = links.map(function (u) {
    return { name: "", url: driveViewUrl(u) };
  });

  var status = String(cell(row, map, "status") || "new").toLowerCase();
  if (ALLOWED_STATUS.indexOf(status) === -1) status = "new";

  var id = cell(row, map, "id");
  var rawTags = String(cell(row, map, "tags") || "");
  var tags = rawTags.split(/[\n,]/).map(function (t) { return t.trim(); }).filter(function (t) { return t; });

  return {
    id: id || ("sheet-" + createdAt),
    createdAt: createdAt,
    status: status,
    name: name || "",
    phone: String(phone || ""),
    email: cell(row, map, "email") || "",
    junkDescription: cell(row, map, "junkDescription") || "",
    pestTreatment: cell(row, map, "pestTreatment") || "",
    homeRepair: cell(row, map, "homeRepair") || "",
    photos: photos,
    notes: cell(row, map, "notes") || "",
    priority: String(cell(row, map, "priority") || "medium").toLowerCase(),
    estimatedValue: cell(row, map, "estimatedValue") || "",
    assignedTo: cell(row, map, "assignedTo") || "",
    lastContactedAt: cell(row, map, "lastContactedAt") || "",
    tags: tags,
    source: cell(row, map, "source") || "website",
  };
}

function driveViewUrl(url) {
  var s = String(url || "");
  var m = s.match(/\/d\/([^\/]+)/) || s.match(/[?&]id=([^&]+)/);
  return m ? ("https://drive.google.com/uc?export=view&id=" + m[1]) : s;
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
