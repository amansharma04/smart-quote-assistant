/**
 * LOCATION CONFIGS
 * ----------------
 * Every landing page (/folsom/pest-control, /roseville/hvac, etc.) is
 * generated entirely from one object in this file. Adding a new city
 * for an existing service = adding one object here. No component
 * changes, no new routes — App.jsx has one dynamic /:citySlug/:serviceSlug
 * route that looks up the matching config.
 *
 * URL structure: /:citySlug/:serviceSlug — both lowercase, hyphenated.
 * This scales to unlimited cities per service (the actual requirement)
 * better than one flat slug per page would, since citySlug and
 * serviceSlug are independent lookup keys rather than one opaque string.
 *
 * `services` doubles as the option list for the primary "service needed"
 * step in the quote flow. `extraQuestions` (optional) adds industry-
 * specific follow-up questions beyond the universal fields — see
 * QuoteWizard.jsx for how these get merged into the question sequence.
 *
 * `reviews` is intentionally empty until you have real ones. The reviews
 * section only renders when this array is non-empty — never fabricate
 * customer names/quotes here. Fake testimonials presented as real is
 * deceptive advertising, not a placeholder worth shipping.
 */

export const LOCATIONS = [
  {
    citySlug: "folsom",
    serviceSlug: "pest-control",
    city: "Folsom",
    service: "Pest Control",
    industry: "pest_control",
    headline: "Get a Free Pest Control Quote in Folsom",
    subheadline: "Answer a few quick questions and a licensed local exterminator will reach out — usually within the hour.",
    seoTitle: "Pest Control in Folsom, CA | Free Quotes from Local Exterminators",
    metaDescription:
      "Request a free, no-obligation pest control quote from licensed exterminators serving Folsom, CA. Fast response for ants, rodents, termites, and more.",
    services: ["Ants", "Rodents", "Termites", "Roaches", "Spiders", "Other"],
    extraQuestions: [
      {
        id: "location",
        label: "Is this mainly inside or outside your home?",
        type: "select",
        options: ["Inside", "Outside", "Both"],
        required: false,
      },
    ],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "How fast will I hear back?", a: "Most requests get a response within an hour during business hours, and often sooner for urgent requests." },
      { q: "Is there a cost to request a quote?", a: "No — requesting a quote is completely free with no obligation to hire anyone." },
      { q: "Are the providers licensed?", a: "We only work with licensed, insured local pest control professionals serving the Folsom area." },
      { q: "What if I have an infestation right now?", a: "Mark your request as ASAP in the form — local providers prioritize urgent requests and many offer same-day service." },
      { q: "Do I have to commit to anything?", a: "No. You'll be connected with a local provider directly — any decision to hire them, and any pricing, is between you and them." },
    ],
    reviews: [], // populate with real reviews once you have them — see note above
  },
  {
    citySlug: "roseville",
    serviceSlug: "hvac",
    city: "Roseville",
    service: "HVAC",
    industry: "hvac",
    headline: "Get a Free HVAC Quote in Roseville",
    subheadline: "Compare trusted local HVAC pros for repair, installation, or maintenance.",
    seoTitle: "HVAC Repair & Installation in Roseville | Free Quotes",
    metaDescription: "Get fast, free HVAC quotes from licensed technicians serving Roseville, CA.",
    services: ["AC Repair", "Furnace Repair", "New Installation", "Maintenance", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "Do you handle emergencies?", a: "Yes — mark your request urgent and local pros can prioritize same-day service." },
      { q: "Is there a cost to request a quote?", a: "No, it's completely free with no obligation." },
    ],
    reviews: [],
  },
  {
    citySlug: "sacramento",
    serviceSlug: "plumbing",
    city: "Sacramento",
    service: "Plumbing",
    industry: "plumbing",
    headline: "Get a Free Plumbing Quote in Sacramento",
    subheadline: "Answer a few quick questions and a licensed local plumber will reach out — usually within the hour.",
    seoTitle: "Plumbing Services in Sacramento, CA | Free Quotes from Local Plumbers",
    metaDescription:
      "Request a free, no-obligation plumbing quote from licensed plumbers serving Sacramento, CA. Fast response for leaks, clogs, water heaters, and more.",
    services: ["Leak Repair", "Drain Clog", "Water Heater", "Pipe Repair", "Fixture Installation", "Other"],
    extraQuestions: [
      {
        id: "emergency",
        label: "Is this an emergency?",
        type: "select",
        options: ["Yes — active leak or flooding", "No — can schedule"],
        required: true,
      },
    ],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "How fast will I hear back?", a: "Most requests get a response within an hour during business hours, and often sooner for urgent requests." },
      { q: "What if I have an active leak right now?", a: "Mark your request as an emergency — local plumbers prioritize urgent calls and many offer same-day service." },
      { q: "Is there a cost to request a quote?", a: "No — requesting a quote is completely free with no obligation to hire anyone." },
      { q: "Are the providers licensed?", a: "We only work with licensed, insured local plumbers serving the Sacramento area." },
    ],
    reviews: [],
  },
  {
    citySlug: "sacramento",
    serviceSlug: "bookkeeping",
    city: "Sacramento",
    service: "Bookkeeping",
    industry: "bookkeeping",
    headline: "Get a Free Bookkeeping Quote in Sacramento",
    subheadline: "Compare trusted local bookkeepers and CPAs for your business.",
    seoTitle: "Bookkeeping & CPA Services in Sacramento | Free Quotes",
    metaDescription: "Get a free quote from a local bookkeeper or CPA serving Sacramento, CA.",
    services: ["Monthly Bookkeeping", "Tax Prep", "Business Formation", "Catch-up Bookkeeping", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Experienced Local Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "Is my financial info secure?", a: "We only collect basic contact info here — a professional follows up directly for anything sensitive." },
      { q: "Is there a cost to request a quote?", a: "No, it's free with no obligation." },
    ],
    reviews: [],
  },
  {
    citySlug: "elk-grove",
    serviceSlug: "salon",
    city: "Elk Grove",
    service: "Salon",
    industry: "salon",
    headline: "Find a Top Salon in Elk Grove",
    subheadline: "Book with trusted local salons near you — hair, nails, and more.",
    seoTitle: "Salons in Elk Grove | Book a Free Consultation",
    metaDescription: "Connect with top-rated salons serving Elk Grove, CA.",
    services: ["Hair", "Nails", "Facial", "Color", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Top Rated Locally", "Fast Response", "No Obligation"],
    faq: [
      { q: "Is there a cost to request an appointment quote?", a: "No, it's free with no obligation." },
    ],
    reviews: [],
  },
  {
    citySlug: "folsom",
    serviceSlug: "junk-removal",
    city: "Folsom",
    service: "Junk Removal",
    industry: "junk_removal",
    headline: "Get a Free Junk Removal Quote in Folsom",
    subheadline: "Compare trusted local junk removal teams — fast, easy pickup.",
    seoTitle: "Junk Removal in Folsom | Free Quotes",
    metaDescription: "Get a free junk removal quote from local pros serving Folsom, CA.",
    services: ["Single Item", "Full Room", "Full Property", "Yard Waste", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Same-Day Available", "Fast Response", "No Obligation"],
    faq: [
      { q: "Can they come today?", a: "Mark your request as ASAP and local teams can prioritize same-day pickup where available." },
      { q: "Is there a cost to request a quote?", a: "No, it's free with no obligation." },
    ],
    reviews: [],
  },

  // --- 6 new services from Angi's top categories ---

  {
    citySlug: "folsom",
    serviceSlug: "cleaning",
    city: "Folsom",
    service: "Cleaning & Maid Services",
    industry: "cleaning",
    headline: "Get a Free House Cleaning Quote in Folsom",
    subheadline: "Connect with trusted local cleaners for one-time or recurring service — fast, free, no obligation.",
    seoTitle: "House Cleaning Services in Folsom, CA | Free Quotes",
    metaDescription: "Request a free house cleaning quote from local cleaning pros serving Folsom, CA. One-time, recurring, and move-in/out cleaning available.",
    services: ["One-Time Deep Clean", "Recurring Weekly/Biweekly", "Move-In/Move-Out Clean", "Post-Construction Clean", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Background Checked Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "Do I need to be home during the cleaning?", a: "Not necessarily — many clients provide access instructions. Your cleaner will work with your preference." },
      { q: "How fast will I hear back?", a: "Most requests get a response within an hour during business hours." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation to hire anyone." },
    ],
    reviews: [],
  },

  {
    citySlug: "folsom",
    serviceSlug: "painting",
    city: "Folsom",
    service: "Painting",
    industry: "painting",
    headline: "Get a Free Painting Quote in Folsom",
    subheadline: "Connect with trusted local painters for interior and exterior projects — fast, free, no obligation.",
    seoTitle: "Painting Services in Folsom, CA | Free Quotes from Local Painters",
    metaDescription: "Request a free painting quote from local painters serving Folsom, CA. Interior, exterior, and commercial painting available.",
    services: ["Interior Painting", "Exterior Painting", "Cabinet Painting", "Deck/Fence Staining", "Commercial Painting", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "Do painters provide the materials?", a: "Most local painters include materials in their quote — confirm when they reach out." },
      { q: "How fast will I hear back?", a: "Most requests get a response within an hour during business hours." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation." },
    ],
    reviews: [],
  },

  {
    citySlug: "folsom",
    serviceSlug: "roofing",
    city: "Folsom",
    service: "Roofing",
    industry: "roofing",
    headline: "Get a Free Roofing Quote in Folsom",
    subheadline: "Connect with trusted local roofers for repairs, replacement, or inspections — fast, free, no obligation.",
    seoTitle: "Roofing Services in Folsom, CA | Free Quotes from Local Roofers",
    metaDescription: "Request a free roofing quote from licensed roofers serving Folsom, CA. Repairs, full replacement, and storm damage inspections.",
    services: ["Roof Repair", "Full Replacement", "Roof Inspection", "Storm/Hail Damage", "Gutters", "Not sure"],
    extraQuestions: [
      {
        id: "roof_type",
        label: "What type of roof do you have?",
        type: "select",
        options: ["Shingle", "Tile", "Metal", "Flat", "Not sure"],
        required: false,
      },
    ],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "Do you help with insurance claims?", a: "Many local roofers assist with storm-damage insurance claims — ask when they contact you." },
      { q: "How fast will I hear back?", a: "Most requests get a response within an hour during business hours." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation." },
    ],
    reviews: [],
  },

  {
    citySlug: "folsom",
    serviceSlug: "handyman",
    city: "Folsom",
    service: "Handyman Service",
    industry: "handyman",
    headline: "Get a Free Handyman Quote in Folsom",
    subheadline: "Connect with a trusted local handyman for repairs, installations, and odd jobs — fast, free, no obligation.",
    seoTitle: "Handyman Services in Folsom, CA | Free Quotes from Local Pros",
    metaDescription: "Request a free handyman quote from local pros serving Folsom, CA. Repairs, installations, assembly, and more.",
    services: ["General Repairs", "TV/Shelf Mounting", "Furniture Assembly", "Door/Window Repair", "Drywall Repair", "Other"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Background Checked Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "What size jobs do handymen take?", a: "Most local handymen handle anything from small repairs to multi-day projects — describe your job in the notes." },
      { q: "How fast will I hear back?", a: "Most requests get a response within an hour during business hours." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation." },
    ],
    reviews: [],
  },

  {
    citySlug: "folsom",
    serviceSlug: "remodeling",
    city: "Folsom",
    service: "Remodeling",
    industry: "remodeling",
    headline: "Get a Free Remodeling Quote in Folsom",
    subheadline: "Connect with trusted local contractors for kitchen, bathroom, and home addition projects — fast, free, no obligation.",
    seoTitle: "Home Remodeling in Folsom, CA | Free Quotes from Local Contractors",
    metaDescription: "Request a free remodeling quote from local contractors serving Folsom, CA. Kitchen, bathroom, addition, and full home remodels.",
    services: ["Kitchen Remodel", "Bathroom Remodel", "Home Addition", "Basement Finishing", "Full Home Renovation", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "How long does a remodel take?", a: "It depends on the scope — your local contractor will provide a timeline when they reach out." },
      { q: "How fast will I hear back?", a: "Most requests get a response within an hour during business hours." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation." },
    ],
    reviews: [],
  },

  {
    citySlug: "folsom",
    serviceSlug: "fencing",
    city: "Folsom",
    service: "Fencing",
    industry: "fencing",
    headline: "Get a Free Fencing Quote in Folsom",
    subheadline: "Connect with trusted local fence contractors for installation, repair, or replacement — fast, free, no obligation.",
    seoTitle: "Fencing Services in Folsom, CA | Free Quotes from Local Fence Contractors",
    metaDescription: "Request a free fencing quote from local contractors serving Folsom, CA. Wood, vinyl, chain link, and more.",
    services: ["New Fence Installation", "Fence Repair", "Fence Replacement", "Gate Installation", "Not sure"],
    extraQuestions: [
      {
        id: "fence_type",
        label: "What type of fencing are you interested in?",
        type: "select",
        options: ["Wood", "Vinyl/PVC", "Chain Link", "Wrought Iron", "Not sure"],
        required: false,
      },
    ],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "Do I need a permit for a fence?", a: "It depends on your city — your local contractor will advise you when they reach out." },
      { q: "How fast will I hear back?", a: "Most requests get a response within an hour during business hours." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation." },
    ],
    reviews: [],
  },
];

export function getLocation(citySlug, serviceSlug) {
  if (!citySlug || !serviceSlug) return null;
  return (
    LOCATIONS.find(
      (l) => l.citySlug === citySlug.toLowerCase() && l.serviceSlug === serviceSlug.toLowerCase()
    ) || null
  );
}

export function getLocationPath(location) {
  return `/${location.citySlug}/${location.serviceSlug}`;
}

// Used server-side to cross-check a submitted lead's locationSlug
// (stored as "citySlug/serviceSlug") against a real, live page.
export function getLocationByCombinedSlug(combined) {
  if (!combined || typeof combined !== "string") return null;
  const [citySlug, serviceSlug] = combined.split("/");
  return getLocation(citySlug, serviceSlug);
}
