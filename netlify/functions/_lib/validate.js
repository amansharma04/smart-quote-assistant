/**
 * Server-side validation and sanitization for lead submissions.
 * Never trust client-side validation alone — this is the real gate.
 */
import { getLocationByCombinedSlug } from "../../../src/config/locations.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_MIN = 10;

// Strips tags/scripts and control characters, trims, and caps length.
// Deliberately conservative — this is contact-form data, not rich text.
export function sanitizeText(value, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // strip control chars
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email) {
  if (!email) return true; // email is optional
  return EMAIL_RE.test(email) && email.length <= 254;
}

export function isValidPhone(phone) {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= PHONE_DIGITS_MIN && digits.length <= 15;
}

const ALLOWED_URGENCY = ["ASAP", "This week", "Flexible", "Just researching"];
const ALLOWED_CONTACT_TIME = ["Morning", "Afternoon", "Evening", "Anytime", ""];
const ALLOWED_STATUS = ["New", "Contacted", "Assigned", "Sold", "Closed", "Rejected"];

/**
 * Validates and sanitizes a full lead submission. Returns
 * { valid, errors, clean } — `clean` is the sanitized object to persist,
 * only ever built from validated fields (never a raw passthrough).
 */
export function validateLead(input) {
  const errors = [];

  const name = sanitizeText(input.name, 100);
  const phone = sanitizeText(input.phone, 20);
  const email = sanitizeText(input.email, 254);
  const city = sanitizeText(input.city, 100);
  const zip = sanitizeText(input.zip, 12);
  const serviceNeeded = sanitizeText(input.serviceNeeded, 100);
  const urgency = sanitizeText(input.urgency, 30);
  const contactTime = sanitizeText(input.contactTime, 30);
  const notes = sanitizeText(input.notes, 1000);
  const industry = sanitizeText(input.industry, 50);
  const locationSlug = sanitizeText(input.locationSlug, 100);

  if (!name || name.length < 2) errors.push("Please enter a valid name.");
  if (!isValidPhone(phone)) errors.push("Please enter a valid phone number.");
  if (email && !isValidEmail(email)) errors.push("Please enter a valid email address.");
  if (urgency && !ALLOWED_URGENCY.includes(urgency)) errors.push("Invalid urgency value.");
  if (contactTime && !ALLOWED_CONTACT_TIME.includes(contactTime)) errors.push("Invalid contact time value.");
  if (!input.consentGiven) errors.push("Consent is required to submit a request.");

  // Cross-check against the real location config rather than trusting
  // whatever the client sent — this closes the gap where someone could
  // POST directly to the function with a fabricated industry/service
  // combination that was never actually offered on any page.
  const matchedLocation = getLocationByCombinedSlug(locationSlug);
  if (!matchedLocation) {
    errors.push("Invalid request.");
  } else {
    if (industry !== matchedLocation.industry) errors.push("Invalid request.");
    if (serviceNeeded && !matchedLocation.services.includes(serviceNeeded)) {
      errors.push("Invalid service selection.");
    }
  }

  // Basic spam heuristics — reject obvious garbage without being clever
  // about it. Anything more aggressive risks false-positiving real leads.
  if (/https?:\/\//i.test(notes)) errors.push("Notes cannot contain links.");
  if (/^\d+$/.test(name)) errors.push("Please enter a valid name.");

  return {
    valid: errors.length === 0,
    errors,
    clean: {
      name,
      phone,
      email,
      city,
      zip,
      serviceNeeded,
      urgency,
      contactTime,
      notes,
      industry,
      locationSlug,
      consentGiven: !!input.consentGiven,
    },
  };
}

/**
 * Validates a lead UPDATE (admin dashboard) — narrower than a new
 * submission, since only status/assignment/notes should be editable here.
 */
export function validateLeadUpdate(input) {
  const errors = [];
  if (!input.id || typeof input.id !== "string") errors.push("Missing lead id.");
  if (input.status && !ALLOWED_STATUS.includes(input.status)) errors.push("Invalid status value.");

  return {
    valid: errors.length === 0,
    errors,
    clean: {
      id: sanitizeText(input.id, 100),
      status: input.status && ALLOWED_STATUS.includes(input.status) ? input.status : undefined,
      assignedBusiness: sanitizeText(input.assignedBusiness, 200),
      internalNotes: sanitizeText(input.internalNotes, 2000),
    },
  };
}
