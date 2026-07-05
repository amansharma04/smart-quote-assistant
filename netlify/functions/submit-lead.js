import { validateLead } from "./_lib/validate.js";
import { isRateLimited, getClientIp } from "./_lib/rateLimit.js";
import { verifyCaptcha } from "./_lib/captcha.js";
import { sheetsPost, sheetsGet } from "./_lib/sheetsClient.js";

/**
 * POST /.netlify/functions/submit-lead
 *
 * Security layers, in order:
 *  1. Rate limit by IP
 *  2. Honeypot check (silent reject, looks like success to the bot)
 *  3. Server-side validation + sanitization (never trust client input)
 *  4. Optional CAPTCHA (no-op unless configured)
 *  5. Duplicate-submission check against recent leads
 *  6. Write to Sheets via authenticated webhook call
 *  7. Email notification (best-effort, never blocks the response)
 *
 * Error responses are intentionally generic — internal details go to
 * server logs only, never to the client.
 */
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const ip = getClientIp(event);
  if (isRateLimited(ip)) {
    return { statusCode: 429, body: JSON.stringify({ error: "Too many requests. Please try again in a minute." }) };
  }

  let input;
  try {
    input = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request." }) };
  }

  // Honeypot — a hidden field real users never see or fill. If it has a
  // value, this is almost certainly a bot. Return a success-shaped
  // response so the bot doesn't learn its submission was rejected.
  if (input.hp_field) {
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  const { valid, errors, clean } = validateLead(input);
  if (!valid) {
    return { statusCode: 400, body: JSON.stringify({ error: errors[0] || "Invalid submission." }) };
  }

  const captcha = await verifyCaptcha(input.captchaToken);
  if (!captcha.valid) {
    return { statusCode: 400, body: JSON.stringify({ error: "Verification failed. Please try again." }) };
  }

  // Duplicate check — same phone number submitted within the last
  // 10 minutes is almost always a double-click or a retry, not a new lead.
  try {
    const isDuplicate = await checkDuplicate(clean.phone);
    if (isDuplicate) {
      return { statusCode: 200, body: JSON.stringify({ success: true, duplicate: true }) };
    }
  } catch (err) {
    console.error("Duplicate check failed:", err.message);
    // Don't block submission if the duplicate check itself fails —
    // better to accept a possible duplicate than lose a real lead.
  }

  const lead = {
    ...clean,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "New",
    assignedBusiness: "",
    internalNotes: "",
    leadScore: computeLeadScore(clean),
  };

  try {
    await sheetsPost({ sheet: "Leads", action: "upsert", row: lead });
  } catch (err) {
    console.error("Sheet save failed:", err.message);
    return { statusCode: 502, body: JSON.stringify({ error: "Something went wrong. Please try again." }) };
  }

  try {
    await notifyOwner(lead);
  } catch (err) {
    // Never fail the request over a notification error — the lead is saved.
    console.error("Notification failed:", err.message);
  }

  // Log only the lead id for traceability — never the full lead object,
  // which contains phone/email/notes.
  console.log(`Lead submitted: ${lead.id}`);

  return { statusCode: 200, body: JSON.stringify({ success: true, leadId: lead.id }) };
}

async function checkDuplicate(phone) {
  const data = await sheetsGet("Leads");
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  return (data.rows || []).some(
    (row) => row.phone === phone && new Date(row.createdAt).getTime() > tenMinutesAgo
  );
}

async function notifyOwner(lead) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  // Skip silently if EmailJS isn't configured yet
  if (!serviceId || !templateId || !privateKey) return;

  await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        lead_name: lead.name,
        lead_phone: lead.phone,
        lead_email: lead.email || "—",
        lead_city: lead.city || "—",
        lead_service: lead.serviceNeeded || "—",
        lead_urgency: lead.urgency || "—",
        lead_contact_time: lead.contactTime || "—",
        lead_score: lead.leadScore ?? "—",
        lead_notes: lead.notes || "—",
        lead_industry: lead.industry || "—",
      },
    }),
  });
}

// Prevents lead data (which is user-supplied) from being interpreted as
// HTML if it ever contains characters like < or & — defense in depth on
// top of the sanitization already done in validateLead.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function computeLeadScore(lead) {
  let score = 40;
  const urgencyPoints = { ASAP: 30, "This week": 20, Flexible: 10, "Just researching": 0 };
  score += urgencyPoints[lead.urgency] ?? 10;
  if (lead.email) score += 10;
  if (lead.contactTime) score += 10;
  if (lead.zip) score += 5;
  if (lead.notes) score += 5;
  return Math.max(0, Math.min(100, score));
}
