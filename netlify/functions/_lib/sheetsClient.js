/**
 * Shared client for calling the Google Apps Script webhook. Every call
 * attaches SHEETS_WEBHOOK_SECRET — a shared secret only known to Netlify
 * (server-side env var) and the Apps Script itself (Script Property).
 *
 * Why this matters: an Apps Script Web App deployed with "Anyone" access
 * is reachable by anyone who has the URL, regardless of how it's used.
 * Without a secret, someone who found the URL (e.g. leaked in a log,
 * browser history, guessed) could read or write every lead directly.
 * The secret means the URL alone isn't enough — see google-apps-script/Code.gs.
 */

export async function callSheetsWebhook(path = "", options = {}) {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;
  if (!webhookUrl) throw new Error("SHEETS_WEBHOOK_URL not configured");
  if (!secret) throw new Error("SHEETS_WEBHOOK_SECRET not configured");

  const separator = path.includes("?") ? "&" : "?";
  const url = `${webhookUrl}${path}${separator}token=${encodeURIComponent(secret)}`;

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Sheets webhook returned ${res.status}`);
  const data = await res.json();
  // Apps Script Web Apps can't set real HTTP status codes — it signals
  // errors (like our own "Unauthorized" from a bad secret) via an
  // `error` field in an otherwise-200 response. Check for that too.
  if (data.error) throw new Error(`Sheets webhook error: ${data.error}`);
  return data;
}

export async function sheetsPost(body) {
  return callSheetsWebhook("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function sheetsGet(sheet) {
  return callSheetsWebhook(`?sheet=${encodeURIComponent(sheet)}`);
}
