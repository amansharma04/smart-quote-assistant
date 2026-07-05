/**
 * Optional CAPTCHA support via Cloudflare Turnstile.
 *
 * Off by default — if TURNSTILE_SECRET_KEY isn't set, verification is
 * skipped entirely (returns valid: true) so the form keeps working
 * without CAPTCHA until/unless you decide spam volume warrants it.
 * To enable: set TURNSTILE_SECRET_KEY (server) and VITE_TURNSTILE_SITE_KEY
 * (client) in Netlify env vars, then render the Turnstile widget in
 * QuoteWizard's final step and pass its token as `captchaToken`.
 */
export async function verifyCaptcha(token) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return { valid: true }; // CAPTCHA not configured — skip

  if (!token) return { valid: false, reason: "Missing CAPTCHA token" };

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });
    const data = await res.json();
    return { valid: !!data.success };
  } catch {
    // Fail closed on verification errors when CAPTCHA is enabled —
    // better to block a few legitimate users than open the gate wide.
    return { valid: false, reason: "CAPTCHA verification unavailable" };
  }
}
