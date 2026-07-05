/**
 * LOCATION CONFIGS
 * ----------------
 * URL structure changed from /:citySlug/:serviceSlug to a simpler
 * /:serviceSlug pattern — pages now serve the whole Sacramento region
 * rather than one specific city, so visitors from Elk Grove, Roseville,
 * Rancho Cordova, etc. don't feel excluded by a "Folsom" URL.
 *
 * citySlug is now "sacramento-area" for all pages — a neutral regional
 * identifier. The display copy says "Sacramento Area, CA" which is
 * welcoming to anyone within ~40 miles.
 *
 * To add a city-specific page later (e.g. for SEO or a specific buyer
 * in one city), just add another entry with a real citySlug like "elk-grove".
 */

const AREA = "Sacramento Area";
const AREA_SLUG = "sacramento-area";

export const LOCATIONS = [
  {
    citySlug: AREA_SLUG,
    serviceSlug: "pest-control",
    city: AREA,
    service: "Pest Control",
    industry: "pest_control",
    headline: "Get a Free Pest Control Quote",
    subheadline: "Answer a few quick questions and a licensed local exterminator will reach out — usually within the hour.",
    seoTitle: "Pest Control in Sacramento Area | Free Quotes from Local Exterminators",
    metaDescription: "Request a free pest control quote from licensed exterminators serving the Sacramento area. Fast response for ants, rodents, termites, and more.",
    services: ["Ants", "Rodents", "Termites", "Roaches", "Spiders", "Other"],
    extraQuestions: [
      { id: "pest_location", label: "Is this mainly inside or outside?", type: "select", options: ["Inside", "Outside", "Both"], required: false },
    ],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "How fast will I hear back?", a: "Most requests get a response within an hour during business hours, and often sooner for urgent requests." },
      { q: "Is there a cost to request a quote?", a: "No — requesting a quote is completely free with no obligation to hire anyone." },
      { q: "Are the providers licensed?", a: "We only work with licensed, insured local pest control professionals serving the Sacramento area." },
      { q: "What if I have an infestation right now?", a: "Mark your request as ASAP — local providers prioritize urgent requests and many offer same-day service." },
      { q: "Do I have to commit to anything?", a: "No. You'll be connected with a local provider directly — any decision to hire them is between you and them." },
    ],
    reviews: [],
  },
  {
    citySlug: AREA_SLUG,
    serviceSlug: "hvac",
    city: AREA,
    service: "HVAC",
    industry: "hvac",
    headline: "Get a Free HVAC Quote",
    subheadline: "Compare trusted local HVAC pros for repair, installation, or maintenance — usually within the hour.",
    seoTitle: "HVAC Repair & Installation in Sacramento Area | Free Quotes",
    metaDescription: "Get fast, free HVAC quotes from licensed technicians serving the Sacramento area.",
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
    citySlug: AREA_SLUG,
    serviceSlug: "plumbing",
    city: AREA,
    service: "Plumbing",
    industry: "plumbing",
    headline: "Get a Free Plumbing Quote",
    subheadline: "Answer a few quick questions and a licensed local plumber will reach out — usually within the hour.",
    seoTitle: "Plumbing Services in Sacramento Area | Free Quotes from Local Plumbers",
    metaDescription: "Request a free plumbing quote from licensed plumbers serving the Sacramento area. Fast response for leaks, clogs, water heaters, and more.",
    services: ["Leak Repair", "Drain Clog", "Water Heater", "Pipe Repair", "Fixture Installation", "Other"],
    extraQuestions: [
      { id: "emergency", label: "Is this an emergency?", type: "select", options: ["Yes — active leak or flooding", "No — can schedule"], required: true },
    ],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "What if I have an active leak right now?", a: "Mark your request as an emergency — local plumbers prioritize urgent calls and many offer same-day service." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation to hire anyone." },
    ],
    reviews: [],
  },
  {
    citySlug: AREA_SLUG,
    serviceSlug: "bookkeeping",
    city: AREA,
    service: "Bookkeeping",
    industry: "bookkeeping",
    headline: "Get a Free Bookkeeping Quote",
    subheadline: "Compare trusted local bookkeepers and CPAs for your business — fast, free, no obligation.",
    seoTitle: "Bookkeeping & CPA Services in Sacramento Area | Free Quotes",
    metaDescription: "Get a free quote from a local bookkeeper or CPA serving the Sacramento area.",
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
    citySlug: AREA_SLUG,
    serviceSlug: "salon",
    city: AREA,
    service: "Salon & Spa",
    industry: "salon",
    headline: "Find a Top Salon or Spa Near You",
    subheadline: "Book with trusted local salons near you — hair, nails, facials, and more.",
    seoTitle: "Salons & Spas in Sacramento Area | Free Consultation",
    metaDescription: "Connect with top-rated salons serving the Sacramento area.",
    services: ["Hair", "Nails", "Facial", "Color", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Top Rated Locally", "Fast Response", "No Obligation"],
    faq: [
      { q: "Is there a cost to request an appointment quote?", a: "No, it's free with no obligation." },
    ],
    reviews: [],
  },
  {
    citySlug: AREA_SLUG,
    serviceSlug: "junk-removal",
    city: AREA,
    service: "Junk Removal",
    industry: "junk_removal",
    headline: "Get a Free Junk Removal Quote",
    subheadline: "Compare trusted local junk removal teams — fast, easy pickup, no obligation.",
    seoTitle: "Junk Removal in Sacramento Area | Free Quotes",
    metaDescription: "Get a free junk removal quote from local pros serving the Sacramento area.",
    services: ["Single Item", "Full Room", "Full Property", "Yard Waste", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Same-Day Available", "Fast Response", "No Obligation"],
    faq: [
      { q: "Can they come today?", a: "Mark your request as ASAP and local teams can prioritize same-day pickup where available." },
      { q: "Is there a cost to request a quote?", a: "No, it's free with no obligation." },
    ],
    reviews: [],
  },
  {
    citySlug: AREA_SLUG,
    serviceSlug: "cleaning",
    city: AREA,
    service: "House Cleaning",
    industry: "cleaning",
    headline: "Get a Free House Cleaning Quote",
    subheadline: "Connect with trusted local cleaners for one-time or recurring service — fast, free, no obligation.",
    seoTitle: "House Cleaning Services in Sacramento Area | Free Quotes",
    metaDescription: "Request a free house cleaning quote from local cleaning pros serving the Sacramento area.",
    services: ["One-Time Deep Clean", "Recurring Weekly/Biweekly", "Move-In/Move-Out Clean", "Post-Construction Clean", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Background Checked Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "Do I need to be home during the cleaning?", a: "Not necessarily — many clients provide access instructions. Your cleaner will work with your preference." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation to hire anyone." },
    ],
    reviews: [],
  },
  {
    citySlug: AREA_SLUG,
    serviceSlug: "painting",
    city: AREA,
    service: "Painting",
    industry: "painting",
    headline: "Get a Free Painting Quote",
    subheadline: "Connect with trusted local painters for interior and exterior projects — fast, free, no obligation.",
    seoTitle: "Painting Services in Sacramento Area | Free Quotes from Local Painters",
    metaDescription: "Request a free painting quote from local painters serving the Sacramento area.",
    services: ["Interior Painting", "Exterior Painting", "Cabinet Painting", "Deck/Fence Staining", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "Do painters provide the materials?", a: "Most local painters include materials in their quote — confirm when they reach out." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation." },
    ],
    reviews: [],
  },
  {
    citySlug: AREA_SLUG,
    serviceSlug: "roofing",
    city: AREA,
    service: "Roofing",
    industry: "roofing",
    headline: "Get a Free Roofing Quote",
    subheadline: "Connect with trusted local roofers for repairs, replacement, or inspections — fast, free, no obligation.",
    seoTitle: "Roofing Services in Sacramento Area | Free Quotes from Local Roofers",
    metaDescription: "Request a free roofing quote from licensed roofers serving the Sacramento area.",
    services: ["Roof Repair", "Full Replacement", "Roof Inspection", "Storm/Hail Damage", "Gutters", "Not sure"],
    extraQuestions: [
      { id: "roof_type", label: "What type of roof do you have?", type: "select", options: ["Shingle", "Tile", "Metal", "Flat", "Not sure"], required: false },
    ],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "Do you help with insurance claims?", a: "Many local roofers assist with storm-damage insurance claims — ask when they contact you." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation." },
    ],
    reviews: [],
  },
  {
    citySlug: AREA_SLUG,
    serviceSlug: "handyman",
    city: AREA,
    service: "Handyman",
    industry: "handyman",
    headline: "Get a Free Handyman Quote",
    subheadline: "Connect with a trusted local handyman for repairs, installations, and odd jobs — fast, free, no obligation.",
    seoTitle: "Handyman Services in Sacramento Area | Free Quotes from Local Pros",
    metaDescription: "Request a free handyman quote from local pros serving the Sacramento area.",
    services: ["General Repairs", "TV/Shelf Mounting", "Furniture Assembly", "Door/Window Repair", "Drywall Repair", "Other"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Background Checked Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "What size jobs do handymen take?", a: "Most local handymen handle anything from small repairs to multi-day projects." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation." },
    ],
    reviews: [],
  },
  {
    citySlug: AREA_SLUG,
    serviceSlug: "remodeling",
    city: AREA,
    service: "Remodeling",
    industry: "remodeling",
    headline: "Get a Free Remodeling Quote",
    subheadline: "Connect with trusted local contractors for kitchen, bathroom, and home addition projects — fast, free, no obligation.",
    seoTitle: "Home Remodeling in Sacramento Area | Free Quotes from Local Contractors",
    metaDescription: "Request a free remodeling quote from local contractors serving the Sacramento area.",
    services: ["Kitchen Remodel", "Bathroom Remodel", "Home Addition", "Basement Finishing", "Full Home Renovation", "Not sure"],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "How long does a remodel take?", a: "It depends on the scope — your local contractor will provide a timeline when they reach out." },
      { q: "Is there a cost to request a quote?", a: "No — it's completely free with no obligation." },
    ],
    reviews: [],
  },
  {
    citySlug: AREA_SLUG,
    serviceSlug: "fencing",
    city: AREA,
    service: "Fencing",
    industry: "fencing",
    headline: "Get a Free Fencing Quote",
    subheadline: "Connect with trusted local fence contractors for installation, repair, or replacement — fast, free, no obligation.",
    seoTitle: "Fencing Services in Sacramento Area | Free Quotes from Local Contractors",
    metaDescription: "Request a free fencing quote from local contractors serving the Sacramento area.",
    services: ["New Fence Installation", "Fence Repair", "Fence Replacement", "Gate Installation", "Not sure"],
    extraQuestions: [
      { id: "fence_type", label: "What type of fencing?", type: "select", options: ["Wood", "Vinyl/PVC", "Chain Link", "Wrought Iron", "Not sure"], required: false },
    ],
    heroCTA: "Get My Free Quote",
    trustBadges: ["Licensed & Insured Pros", "Fast Response", "No Obligation"],
    faq: [
      { q: "Do I need a permit for a fence?", a: "It depends on your city — your local contractor will advise you when they reach out." },
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

export function getLocationByCombinedSlug(combined) {
  if (!combined || typeof combined !== "string") return null;
  const [citySlug, serviceSlug] = combined.split("/");
  return getLocation(citySlug, serviceSlug);
}
