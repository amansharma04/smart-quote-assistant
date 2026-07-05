import { requireAdmin } from "./_lib/auth.js";
import { validateLeadUpdate } from "./_lib/validate.js";
import { sheetsPost } from "./_lib/sheetsClient.js";

/**
 * POST /.netlify/functions/update-lead
 * Requires: Authorization: Bearer <admin session token>
 * Body: { id, status?, assignedBusiness?, internalNotes? }
 *
 * Previously had NO auth check — anyone with the URL could edit any
 * lead's status or reassign it. Now requires admin auth, and only
 * accepts the specific fields an admin should be able to change (not
 * an arbitrary row overwrite).
 */
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  if (!requireAdmin(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized." }) };
  }

  let input;
  try {
    input = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request." }) };
  }

  const { valid, errors, clean } = validateLeadUpdate(input);
  if (!valid) {
    return { statusCode: 400, body: JSON.stringify({ error: errors[0] || "Invalid update." }) };
  }

  // Only include fields that were actually provided, so partial updates
  // don't blank out fields the admin didn't intend to touch.
  const row = { id: clean.id };
  if (clean.status !== undefined) row.status = clean.status;
  if (input.assignedBusiness !== undefined) row.assignedBusiness = clean.assignedBusiness;
  if (input.internalNotes !== undefined) row.internalNotes = clean.internalNotes;

  try {
    await sheetsPost({ sheet: "Leads", action: "update", row });
  } catch (err) {
    console.error("update-lead failed:", err.message);
    return { statusCode: 502, body: JSON.stringify({ error: "Failed to update lead." }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
}
