/**
 * GOOGLE APPS SCRIPT — Smart Quote Assistant Sheets Backend
 * -----------------------------------------------------------
 * SETUP:
 * 1. Create a new Google Sheet, name it "Smart Quote Assistant Leads"
 * 2. Create ONE tab named "Leads" with these exact headers in row 1:
 *
 *    id  createdAt  industry  city  zip  name  phone  email
 *    serviceNeeded  urgency  contactTime  notes  status
 *    assignedBusiness  internalNotes  leadScore  locationSlug
 *
 * 3. Extensions > Apps Script, delete the placeholder code, paste this file
 * 4. IMPORTANT — set a shared secret so this webhook isn't fully public:
 *    Go to Project Settings (gear icon) > Script Properties > Add property
 *      Property: WEBHOOK_SECRET
 *      Value: (generate a long random string, e.g. from a password manager)
 *    Put that SAME value in Netlify's SHEETS_WEBHOOK_SECRET env var.
 *    Without this, anyone with the deployment URL could read/write leads —
 *    Apps Script Web Apps with "Anyone" access have no built-in auth.
 * 5. Deploy > New deployment > Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Copy the deployment URL into Netlify env var SHEETS_WEBHOOK_URL
 */

function checkAuth(e) {
  const expected = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
  const provided = e.parameter.token;
  if (!expected) {
    // Fail closed: if you haven't set a secret yet, reject everything
    // rather than silently running unauthenticated.
    return false;
  }
  return provided === expected;
}

function doGet(e) {
  if (!checkAuth(e)) return jsonResponse({ error: "Unauthorized" }, 401);

  const sheetName = e.parameter.sheet || "Leads";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return jsonResponse({ error: "Unknown sheet: " + sheetName });

  return jsonResponse({ rows: sheetToObjects(sheet) });
}

function doPost(e) {
  if (!checkAuth(e)) return jsonResponse({ error: "Unauthorized" }, 401);

  const body = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(body.sheet || "Leads");
  if (!sheet) return jsonResponse({ error: "Unknown sheet: " + body.sheet });

  if (body.action === "update") {
    // Merges only the provided fields into the existing row — used for
    // partial admin edits (status/assignment/notes) so other fields
    // aren't blanked out.
    mergeRow(sheet, body.row);
    return jsonResponse({ success: true });
  }

  if (body.action === "upsert") {
    upsertRow(sheet, body.row);
    // Email is sent by a separate time-driven trigger (sendNewLeadEmails)
    // so it never blocks or breaks the webhook response.
    return jsonResponse({ success: true });
  }

  appendRow(sheet, body.row);
  return jsonResponse({ success: true });
}

function sheetToObjects(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values
    .slice(1)
    .map((row) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i]));
      return obj;
    })
    .filter((obj) => obj.id);
}

function appendRow(sheet, rowObj) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map((h) => rowObj[h] ?? "");
  sheet.appendRow(row);
}

function upsertRow(sheet, rowObj) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idCol = headers.indexOf("id") + 1;
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol - 1] === rowObj.id) {
      const row = headers.map((h) => rowObj[h] ?? "");
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return;
    }
  }
  appendRow(sheet, rowObj);
}

function mergeRow(sheet, rowObj) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idCol = headers.indexOf("id") + 1;
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol - 1] === rowObj.id) {
      const existingRow = data[i];
      const merged = headers.map((h, colIdx) =>
        rowObj[h] !== undefined ? rowObj[h] : existingRow[colIdx]
      );
      sheet.getRange(i + 1, 1, 1, merged.length).setValues([merged]);
      return;
    }
  }
  // If the row doesn't exist yet, fall back to a plain append with
  // whatever fields were provided.
  appendRow(sheet, rowObj);
}

/**
 * EMAIL TRIGGER — run this on a time-driven trigger every 5 minutes.
 *
 * SETUP:
 * 1. In Apps Script → Triggers (clock icon on left sidebar)
 * 2. Add Trigger → Function: sendNewLeadEmails
 * 3. Event source: Time-driven → Minutes timer → Every 5 minutes
 * 4. Save
 *
 * This checks for leads where emailSent is blank, sends a notification
 * email, then marks emailSent = "yes" so it never sends twice.
 * Make sure NOTIFY_EMAIL is set in Script Properties.
 */
function sendNewLeadEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
  if (!sheet) return;

  const notifyEmail = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
  if (!notifyEmail) return;

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return;

  const headers = data[0];
  const statusIdx = headers.indexOf("status");
  const nameIdx = headers.indexOf("name");
  const phoneIdx = headers.indexOf("phone");
  const emailIdx = headers.indexOf("email");
  const serviceIdx = headers.indexOf("serviceNeeded");
  const urgencyIdx = headers.indexOf("urgency");
  const notesIdx = headers.indexOf("notes");
  const scoreIdx = headers.indexOf("leadScore");

  // We use internalNotes to track if email was sent — check for "email_sent" tag
  const internalNotesIdx = headers.indexOf("internalNotes");

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = row[statusIdx];
    const internalNotes = row[internalNotesIdx] || "";

    // Only email for New leads that haven't been emailed yet
    if (status !== "New" || internalNotes.includes("email_sent")) continue;

    const name = row[nameIdx] || "Unknown";
    const phone = row[phoneIdx] || "—";
    const emailAddr = row[emailIdx] || "—";
    const service = row[serviceIdx] || "—";
    const urgency = row[urgencyIdx] || "—";
    const notes = row[notesIdx] || "—";
    const score = row[scoreIdx] || "—";

    try {
      MailApp.sendEmail(
        notifyEmail,
        "New Lead: " + name + " — " + service,
        [
          "New lead from Smart Quote Assistant!",
          "",
          "Name: " + name,
          "Phone: " + phone,
          "Email: " + emailAddr,
          "Service: " + service,
          "Urgency: " + urgency,
          "Lead Score: " + score,
          "Notes: " + notes,
          "",
          "Follow up as soon as possible!",
        ].join("\n")
      );

      // Mark as emailed so we don't send again
      const newNotes = internalNotes ? internalNotes + " | email_sent" : "email_sent";
      sheet.getRange(i + 1, internalNotesIdx + 1).setValue(newNotes);

    } catch (err) {
      console.error("Failed to send email for lead " + name + ": " + err.message);
    }
  }
}

function sendLeadNotification(lead) {
  try {
    const to = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
    if (!to) return; // Set NOTIFY_EMAIL in Script Properties to enable

    const subject = "New Lead: " + (lead.name || "Unknown") + " — " + (lead.serviceNeeded || lead.industry || "");
    const body = [
      "New lead from Smart Quote Assistant!",
      "",
      "Name: " + (lead.name || "—"),
      "Phone: " + (lead.phone || "—"),
      "Email: " + (lead.email || "—"),
      "Service: " + (lead.serviceNeeded || "—"),
      "Urgency: " + (lead.urgency || "—"),
      "City: " + (lead.city || "—"),
      "Lead Score: " + (lead.leadScore || "—"),
      "Notes: " + (lead.notes || "—"),
      "",
      "Follow up as soon as possible!",
    ].join("\n");

    MailApp.sendEmail(to, subject, body);
  } catch (err) {
    // Never let email failure break the lead save
    console.error("Email notification failed: " + err.message);
  }
}

function jsonResponse(obj, statusCode) {
  // Apps Script Web Apps don't support custom HTTP status codes directly;
  // callers should check the `error` field in the response body.
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
