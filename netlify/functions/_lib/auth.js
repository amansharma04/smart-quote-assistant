import crypto from "node:crypto";

/**
 * Lightweight signed session tokens for admin auth. The admin password
 * itself never leaves the server — the client only ever sees this token,
 * which proves a successful login without re-exposing the secret.
 *
 * Not a replacement for a real auth provider (Netlify Identity, etc.) if
 * you ever need multiple admin users — this is sized for "one operator,
 * one password," which matches current scope.
 */

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD not configured");
  return secret;
}

export function signToken() {
  const secret = getSecret();
  const expires = Date.now() + TOKEN_TTL_MS;
  const hmac = crypto.createHmac("sha256", secret).update(String(expires)).digest("hex");
  return `${expires}.${hmac}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [expiresStr, hmac] = token.split(".");
  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return false;

  try {
    const secret = getSecret();
    const expected = crypto.createHmac("sha256", secret).update(expiresStr).digest("hex");
    // Constant-time comparison to avoid timing side-channels.
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function requireAdmin(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  return verifyToken(token);
}
