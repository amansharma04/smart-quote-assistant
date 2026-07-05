/**
 * IP-based rate limiting.
 *
 * HONEST LIMITATION: Netlify Functions are stateless between cold starts —
 * this in-memory map only persists within a warm instance, so it's a real
 * but imperfect first line of defense (it will catch rapid bursts within
 * a session, but a determined attacker spread across cold starts isn't
 * fully stopped by this alone). The duplicate-submission check in
 * submit-lead.js (backed by the Sheet, not memory) is the more durable
 * guard. If abuse becomes a real problem, upgrade this to Upstash Redis
 * or Netlify's edge rate limiting — this function's signature won't need
 * to change for callers.
 */

const hits = new Map(); // ip -> [timestamps]
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;

export function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_PER_WINDOW) {
    hits.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  return false;
}

export function getClientIp(event) {
  return (
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["client-ip"] ||
    (event.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown"
  );
}
