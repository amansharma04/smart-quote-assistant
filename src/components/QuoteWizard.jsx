import { useState } from "react";
import { createBlankLead, computeLeadScore, URGENCY_OPTIONS } from "../config/leadSchema.js";
import { api } from "../lib/api.js";

/**
 * The consumer-facing quote request flow. Deliberately styled as a
 * multi-step FORM with a progress bar — no avatar, no chat bubbles,
 * no "assistant" persona — so it reads as "requesting a quote," not
 * "talking to a bot." See positioning note in README.
 */
export default function QuoteWizard({ location, onComplete }) {
  const steps = buildSteps(location);
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState({});
  const [textValue, setTextValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [hpField, setHpField] = useState(""); // honeypot — real users never see or fill this

  const step = steps[stepIndex];
  const progress = Math.round((stepIndex / steps.length) * 100);

  function goNext(updatedValues) {
    setTextValue("");
    setError("");
    if (stepIndex + 1 >= steps.length) {
      handleSubmit(updatedValues);
    } else {
      setStepIndex(stepIndex + 1);
    }
  }

  function handleOptionSelect(value) {
    const updated = { ...values, [step.id]: value };
    setValues(updated);
    goNext(updated);
  }

  function handleTextSubmit(e) {
    e.preventDefault();
    if (step.required && !textValue.trim()) {
      setError("This is required to continue.");
      return;
    }
    if (step.type === "email" && textValue && !/\S+@\S+\.\S+/.test(textValue)) {
      setError("Please enter a valid email.");
      return;
    }
    if (step.type === "tel" && textValue && textValue.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (step.id === "phone" && !consentGiven) {
      setError("Please check the box to confirm you'd like to be contacted.");
      return;
    }
    const updated = { ...values, [step.id]: textValue };
    setValues(updated);
    goNext(updated);
  }

  function skip() {
    goNext({ ...values, [step.id]: "" });
  }

  async function handleSubmit(finalValues) {
    setSubmitting(true);
    setError("");

    const lead = createBlankLead();
    lead.industry = location.industry;
    lead.locationSlug = `${location.citySlug}/${location.serviceSlug}`;
    lead.city = location.city; // pre-filled from page config, not asked
    lead.zip = finalValues.zip || "";
    lead.serviceNeeded = finalValues.serviceNeeded || "";
    lead.urgency = finalValues.urgency || "";
    lead.contactTime = finalValues.contactTime || "";
    lead.notes = buildNotesWithExtras(finalValues, steps);
    lead.name = finalValues.name || "";
    lead.phone = finalValues.phone || "";
    lead.email = finalValues.email || "";
    lead.leadScore = computeLeadScore(lead);
    lead.consentGiven = consentGiven;
    lead.hp_field = hpField; // honeypot value — server rejects silently if non-empty

    try {
      await api.submitLead(lead);
      // Send email notification client-side via EmailJS — this works
      // reliably from the browser where EmailJS is designed to run,
      // unlike server-side calls which EmailJS doesn't fully support.
      await sendEmailNotification(lead);
      onComplete(lead);
    } catch (err) {
      console.error("Lead submission failed:", err.message);
      setError(err.message || "Something went wrong submitting your request. Please try again.");
      setSubmitting(false);
    }
  }

  async function sendEmailNotification(lead) {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    console.log("EmailJS config check:", {
      hasServiceId: !!serviceId,
      hasTemplateId: !!templateId,
      hasPublicKey: !!publicKey,
    });

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS: missing env vars — check VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY in Netlify");
      return;
    }

    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            lead_name: lead.name,
            lead_phone: lead.phone,
            lead_email: lead.email || "—",
            lead_city: lead.city || "—",
            lead_service: lead.serviceNeeded || "—",
            lead_urgency: lead.urgency || "—",
            lead_score: lead.leadScore ?? "—",
            lead_notes: lead.notes || "—",
            lead_industry: lead.industry || "—",
          },
        }),
      });
      const text = await res.text();
      console.log("EmailJS response:", res.status, text);
    } catch (err) {
      console.error("EmailJS fetch failed:", err.message);
    }
  }

  const isChoice = step.type === "select";

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="h-1 bg-canvasAlt">
        <div className="h-full bg-brand transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-7">
        <div className="text-[12px] text-muted mb-2">
          Step {stepIndex + 1} of {steps.length}
        </div>
        <h3 className="text-xl font-semibold tracking-tight mb-5">{step.label}</h3>

        {isChoice ? (
          <div className="grid gap-2">
            {step.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                className="text-left px-4 py-3 rounded-xl border border-border hover:border-ink transition-colors text-[15px] font-medium"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleTextSubmit} className="space-y-3">
            <input
              autoFocus
              type={step.type === "email" ? "email" : step.type === "tel" ? "tel" : "text"}
              inputMode={step.id === "zip" ? "numeric" : step.type === "tel" ? "tel" : undefined}
              autoComplete={
                step.id === "name" ? "name" :
                step.id === "phone" ? "tel" :
                step.id === "email" ? "email" :
                step.id === "city" ? "address-level2" :
                step.id === "zip" ? "postal-code" : "off"
              }
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={step.placeholder || "Type your answer..."}
              className="w-full rounded-xl border border-border px-4 py-3 text-base outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            {step.id === "phone" && (
              <label className="flex items-start gap-2 text-[13px] text-muted leading-relaxed">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5"
                />
                I agree to be contacted about my quote request by phone, text, or email.
              </label>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center bg-brand text-white px-6 py-3 rounded-full text-[15px] font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : stepIndex === steps.length - 1 ? "Get My Free Quote" : "Continue"}
            </button>
          </form>
        )}

        {/* Honeypot — invisible to real users (off-screen, not display:none,
            since some bots skip fields hidden that way). Any real person
            filling this out is essentially impossible. */}
        <input
          type="text"
          name="website"
          value={hpField}
          onChange={(e) => setHpField(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        {!step.required && (
          <button onClick={skip} className="text-[13px] text-muted mt-3 hover:underline">
            Skip
          </button>
        )}
        {error && <p className="text-[14px] text-red-600 mt-3">{error}</p>}
      </div>
    </div>
  );
}

// Core fields already have their own dedicated lead columns. Any other
// step id (i.e. an industry-specific extraQuestion from locations.js)
// gets folded into notes as readable text, rather than silently dropped —
// the lead schema doesn't have a generic "answers" bucket to hold them.
const CORE_FIELD_IDS = ["serviceNeeded", "city", "zip", "urgency", "name", "phone", "email", "contactTime", "notes"];

function buildNotesWithExtras(finalValues, steps) {
  const extraLines = Object.entries(finalValues)
    .filter(([id, value]) => !CORE_FIELD_IDS.includes(id) && value)
    .map(([id, value]) => {
      const step = steps.find((s) => s.id === id);
      const label = step?.label?.replace(/\?$/, "") || id;
      return `${label}: ${value}`;
    });

  const parts = [...extraLines];
  if (finalValues.notes) parts.push(finalValues.notes);
  return parts.join(" — ");
}

// Builds the question sequence for this location. Service options come
// straight from the location config, so the form always matches what
// the page advertises without maintaining a separate question list.
// extraQuestions (optional, industry-specific) are inserted right after
// the primary service question — while the visitor's still describing
// the problem, before the flow shifts into contact info.
function buildSteps(location) {
  return [
    {
      id: "serviceNeeded",
      label: `What ${location.service.toLowerCase()} service do you need?`,
      type: "select",
      options: location.services,
      required: true,
    },
    ...(location.extraQuestions || []),
    {
      id: "urgency",
      label: "How soon do you need this done?",
      type: "select",
      options: URGENCY_OPTIONS,
      required: true,
    },
    { id: "name", label: "What's your name?", type: "text", required: true },
    { id: "phone", label: "Best phone number to reach you?", type: "tel", required: true },
    { id: "email", label: "Email address? (optional)", type: "email", required: false },
  ];
}
