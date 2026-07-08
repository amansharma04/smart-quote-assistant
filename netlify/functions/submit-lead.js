import { validateLead } from "./_lib/validate.js";
import { isRateLimited, getClientIp } from "./_lib/rateLimit.js";
import { verifyCaptcha } from "./_lib/captcha.js";
import { sheetsPost } from "./_lib/sheetsClient.js";

/**
 * POST /.netlify/functions/submit-lead
 *
 * Removed the duplicate check — it was reading the entire Sheet on every
 * submission which caused 504 timeouts as the Sheet grew. Rate limiting
 * + honeypot + validation provide sufficient spam protection without it.
 *
 * Email notification is now handled by Google Apps Script directly when
 * it saves the row — no EmailJS, no CSP issues, no extra accounts needed.
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

  // Honeypot — hidden field, real users never fill it
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

  console.log(`Lead submitted: ${lead.id}`);
  return { statusCode: 200, body: JSON.stringify({ success: true, leadId: lead.id }) };
}

function computeLeadScore(lead) {
  let score = 40;
  const urgencyPoints = { ASAP: 30, "This week": 20, Flexible: 10, "Just researching": 0 };
  score += urgencyPoints[lead.urgency] ?? 10;
  if (lead.email) score += 10;
  if (lead.zip) score += 5;
  if (lead.notes) score += 5;
  return Math.max(0, Math.min(100, score));
}
