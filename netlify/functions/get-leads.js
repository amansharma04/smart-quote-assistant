import { requireAdmin } from "./_lib/auth.js";
import { sheetsGet } from "./_lib/sheetsClient.js";

/**
 * GET /.netlify/functions/get-leads
 * Requires: Authorization: Bearer <admin session token>
 *
 * This previously had NO auth check — anyone with the URL could pull
 * every lead's PII. Now requires a valid signed session token obtained
 * via admin-login.js.
 */
export async function handler(event) {
  if (!requireAdmin(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized." }) };
  }

  try {
    const data = await sheetsGet("Leads");
    const leads = (data.rows || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { statusCode: 200, body: JSON.stringify({ leads }) };
  } catch (err) {
    console.error("get-leads failed:", err.message);
    return { statusCode: 502, body: JSON.stringify({ error: "Failed to load leads." }) };
  }
}
