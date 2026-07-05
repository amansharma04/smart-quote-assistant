# Smart Quote Assistant — MVP

A local lead generation platform. Consumers visit city + service landing
pages, request a quote through a guided form, and the lead is captured
and emailed to you. You manually review, assign, and sell/forward leads
to local businesses — no automation, no business logins, no payments yet.
That's intentional: this is the MVP, scoped to prove the model works
before adding anything else.

## Positioning — read this before changing any copy
The consumer should feel like they're requesting a quote from a local
service directory, **not** using AI or chatbot software. No "assistant"
persona, no chat bubbles, no avatar. The quote flow (`QuoteWizard.jsx`)
is deliberately styled as a plain multi-step form with a progress bar.
Keep any future copy changes consistent with that.

## Architecture
```
src/config/locations.js   → every landing page, generated from one config object per page
src/config/leadSchema.js  → the lead data shape + scoring logic
src/components/QuoteWizard.jsx → the guided quote request flow
src/pages/LandingPage.jsx → renders any location from its config, via /:citySlug/:serviceSlug
src/pages/admin/          → Dashboard (stats + filters + table) and LeadDetail (edit one lead)
netlify/functions/        → submit-lead, get-leads, update-lead — all backed by Google Sheets
```

Adding a new city + service page = adding one object to `src/config/locations.js`.
No new routes, no new components.

## Local dev
```bash
npm install
npm run dev
```

## Step 1 — Set up the Google Sheet (database)
1. Create a new Google Sheet, name it "Smart Quote Assistant Leads"
2. Create one tab named **Leads** with these exact headers in row 1:
   ```
   id  createdAt  industry  city  zip  name  phone  email  serviceNeeded  urgency  contactTime  notes  status  assignedBusiness  internalNotes  leadScore  locationSlug
   ```
3. Go to **Extensions → Apps Script**
4. Delete the placeholder code, paste in `google-apps-script/Code.gs`
5. **Set a shared secret** (important — without this, the webhook is public
   to anyone with the URL): Project Settings (gear icon) → Script Properties
   → Add property → Name: `WEBHOOK_SECRET`, Value: a long random string
   (generate one from a password manager)
6. **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy the deployment URL — you'll need it in Step 2. Looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## Step 2 — Set up email notifications (Resend)
1. Create a free account at resend.com
2. Verify a sending domain (or use their test domain while testing)
3. Grab your API key from the dashboard

## Step 3 — Deploy to Netlify

### Option A: Connect a GitHub repo (recommended)
1. Push this project to GitHub
2. In Netlify: **Add new site → Import an existing project → GitHub**
3. Build settings auto-detect from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Before first deploy, go to **Site settings → Environment variables** and add:
   ```
   SHEETS_WEBHOOK_URL     = (Apps Script URL from Step 1)
   SHEETS_WEBHOOK_SECRET  = (the SAME random string you set as WEBHOOK_SECRET in Step 1.5)
   RESEND_API_KEY         = (from Step 2)
   NOTIFY_FROM_EMAIL      = leads@yourdomain.com
   NOTIFY_TO_EMAIL        = you@yourdomain.com
   ADMIN_PASSWORD         = (pick a real password — this is checked server-side only)
   ```
5. Deploy.

### Option B: Deploy from your machine
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set SHEETS_WEBHOOK_URL "your-apps-script-url"
netlify env:set SHEETS_WEBHOOK_SECRET "your-shared-secret"
netlify env:set RESEND_API_KEY "your-key"
netlify env:set NOTIFY_FROM_EMAIL "leads@yourdomain.com"
netlify env:set NOTIFY_TO_EMAIL "you@yourdomain.com"
netlify env:set ADMIN_PASSWORD "your-password"
netlify deploy --prod
```

## Step 4 — Verify it works end to end
1. Visit your deployed site, pick one of the 5 starter pages (e.g. `/folsom/pest-control`)
2. Go through the quote flow — you'll be asked to check the consent box before
   the phone step advances
3. Submit a test request, confirm you land on the Thank You page
4. Check the Google Sheet — a new row should appear
5. Check your email — you should get the notification
6. Go to `/admin`, enter your password, confirm the lead shows up
7. Click the lead, change its status, assign a business name, add a note — confirm it saves
8. **Security check:** try visiting `/.netlify/functions/get-leads` directly in
   a browser (no admin login) — it should return `{"error":"Unauthorized."}`,
   not lead data. If it returns real leads, your deploy is misconfigured.

## Security — what's implemented

| Requirement | How it's handled |
|---|---|
| API keys never in frontend | All secrets (`SHEETS_WEBHOOK_SECRET`, `RESEND_API_KEY`, `ADMIN_PASSWORD`) are server-side env vars only, never `VITE_`-prefixed |
| All submissions through Netlify Functions | Frontend never talks to Sheets or Resend directly |
| Server-side validation | `netlify/functions/_lib/validate.js` — every field re-validated server-side regardless of client checks |
| Input sanitization | HTML tags and control characters stripped before storage; output also HTML-escaped in notification emails |
| Rate limiting by IP | `netlify/functions/_lib/rateLimit.js` — 5 requests/minute per IP (see in-code note on its in-memory limitation) |
| Honeypot field | Hidden `hp_field` in the quote form; non-empty submissions silently rejected |
| Optional CAPTCHA | Cloudflare Turnstile hook in `_lib/captcha.js` — inactive unless `TURNSTILE_SECRET_KEY` is set |
| Duplicate/suspicious submissions blocked | Same phone number within 10 minutes is treated as a duplicate; URL-in-notes and numeric-only names are rejected as spam signals |
| Phone/email format validation | Enforced server-side in `validate.js`, not just client-side |
| Google Sheets not public | Apps Script webhook requires a shared secret (`WEBHOOK_SECRET`) on every request — see Step 1.5 |
| Writes only from backend | Only Netlify Functions ever call the Sheets webhook |
| Admin dashboard login protection | Real server-side check in `admin-login.js` — password never ships to the client; session uses a signed, expiring token |
| Lead data not exposed publicly | `get-leads` and `update-lead` both require a valid admin session token |
| Security headers | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy — set in `netlify.toml` |
| Privacy Policy / Terms pages | `/privacy` and `/terms` — starting points, **have a lawyer review before relying on them** |
| Consent checkbox | Required before the phone step can advance in the quote flow |
| Unsubscribe language | Included in the Privacy Policy; add an actual unsubscribe link/footer if you build consumer-facing marketing emails later |
| Minimal logging | Functions log lead IDs, not full lead objects with PII |
| Generic error messages | Client-facing errors never include stack traces or internal details |



## Adding a new city + service page
Add one object to `src/config/locations.js` with a unique `citySlug` +
`serviceSlug` combination (lowercase, hyphenated — e.g. `citySlug: "roseville"`,
`serviceSlug: "plumbing"` becomes `/roseville/plumbing`). That's it —
no new routes, no new files. The `services` array in that config also
drives the "service needed" question in the quote form automatically.

Two optional fields per location:
- `extraQuestions` — industry-specific follow-up questions inserted right
  after the primary service question (see the Folsom Pest Control entry
  for an example). Answers are folded into the lead's `notes` field.
- `reviews` — an array of `{ name, text, rating }`. The reviews section
  only renders when this is non-empty. **Never populate this with
  fabricated names/quotes** — an empty array is the correct default
  until you have real reviews to add.

Every location page automatically gets a canonical URL, Open Graph tags,
Twitter Card tags, and JSON-LD Service schema generated from its config —
see `applySeo()` in `LandingPage.jsx`.

## What's intentionally NOT built (per MVP scope)
- SMS notifications
- CRM integration
- Calendar/booking
- Stripe/payments
- Automated lead routing to businesses
- Business login/dashboard
- AI call answering

All of these are additive — the Netlify Functions layer isolates all
Sheets/email logic, so none of them require restructuring what's here.

## Env vars reference
| Variable | Purpose |
|---|---|
| `SHEETS_WEBHOOK_URL` | Your Apps Script deployment URL |
| `SHEETS_WEBHOOK_SECRET` | Shared secret matching Apps Script's `WEBHOOK_SECRET` Script Property — keeps the webhook from being fully public |
| `RESEND_API_KEY` | Resend API key for email notifications |
| `NOTIFY_FROM_EMAIL` | Sending address for notification emails |
| `NOTIFY_TO_EMAIL` | Your email — where new lead notifications go |
| `ADMIN_PASSWORD` | Password to unlock `/admin` — checked server-side only, never shipped to the client |
| `TURNSTILE_SECRET_KEY` | Optional — enables CAPTCHA verification server-side |
| `VITE_TURNSTILE_SITE_KEY` | Optional — enables the CAPTCHA widget client-side |
