import { signToken } from "./_lib/auth.js";
import { isRateLimited, getClientIp } from "./_lib/rateLimit.js";

/**
 * POST /.netlify/functions/admin-login
 * Body: { password }
 *
 * This is the ONLY place the admin password is ever compared. It lives
 * in the server-side env var ADMIN_PASSWORD (never VITE_-prefixed, so
 * it's never bundled into client JS — unlike the previous approach).
 * On success, returns a signed session token; the client never sees
 * or stores the password itself.
 */
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const ip = getClientIp(event);
  if (isRateLimited(ip)) {
    return { statusCode: 429, body: JSON.stringify({ error: "Too many attempts. Please try again in a minute." }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request." }) };
  }

  const correctPassword = process.env.ADMIN_PASSWORD;
  if (!correctPassword) {
    console.error("ADMIN_PASSWORD not configured");
    return { statusCode: 500, body: JSON.stringify({ error: "Admin login is not configured." }) };
  }

  if (body.password !== correctPassword) {
    return { statusCode: 401, body: JSON.stringify({ error: "Incorrect password." }) };
  }

  const token = signToken();
  return { statusCode: 200, body: JSON.stringify({ token }) };
}
