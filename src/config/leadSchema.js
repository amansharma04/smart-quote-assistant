/**
 * LEAD SCHEMA
 * -----------
 * One row in the "Leads" Google Sheet = one submitted quote request.
 * This shape is deliberately flat (no nested objects except answers-free)
 * so it maps 1:1 onto spreadsheet columns with no transformation layer.
 */

export const LEAD_STATUSES = ["New", "Contacted", "Assigned", "Sold", "Closed", "Rejected"];

export const URGENCY_OPTIONS = ["ASAP", "This week", "Flexible", "Just researching"];

export const CONTACT_TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Anytime"];

export function createBlankLead() {
  return {
    id: "",               // Lead ID, generated server-side
    createdAt: "",         // Date/time
    industry: "",
    city: "",
    zip: "",
    name: "",
    phone: "",
    email: "",
    serviceNeeded: "",
    urgency: "",
    contactTime: "",
    notes: "",
    status: "New",
    assignedBusiness: "",
    internalNotes: "",
    leadScore: 0,
    locationSlug: "",
    consentGiven: false,
  };
}

/**
 * Simple, transparent scoring — favors urgency and completeness.
 * Every factor is visible so it's easy to tune later, not a black box.
 */
export function computeLeadScore(lead) {
  let score = 40; // baseline for any complete, valid submission

  const urgencyPoints = { ASAP: 30, "This week": 20, Flexible: 10, "Just researching": 0 };
  score += urgencyPoints[lead.urgency] ?? 10;

  if (lead.email) score += 10;
  if (lead.contactTime) score += 10;
  if (lead.zip) score += 5;
  if (lead.notes) score += 5;

  return Math.max(0, Math.min(100, score));
}
