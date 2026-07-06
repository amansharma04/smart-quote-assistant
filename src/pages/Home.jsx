import { Link } from "react-router-dom";
import { LOCATIONS, getLocationPath } from "../config/locations.js";
import { ShieldCheck, Users, BadgeCheck } from "lucide-react";

const INDUSTRY_CONFIG = {
  pest_control:  { emoji: "🐛", bg: "#f0fdf4" },
  hvac:          { emoji: "❄️", bg: "#f0f9ff" },
  plumbing:      { emoji: "🔧", bg: "#faf5ff" },
  bookkeeping:   { emoji: "📒", bg: "#fffbeb" },
  salon:         { emoji: "✂️", bg: "#fdf2f8" },
  junk_removal:  { emoji: "🗑️", bg: "#fff7ed" },
  cleaning:      { emoji: "🧹", bg: "#ecfeff" },
  painting:      { emoji: "🎨", bg: "#f5f3ff" },
  roofing:       { emoji: "🏠", bg: "#f8fafc" },
  handyman:      { emoji: "🔨", bg: "#fef3c7" },
  remodeling:    { emoji: "🏗️", bg: "#f0fdfa" },
  fencing:       { emoji: "🪵", bg: "#fef9ee" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas text-ink">

      {/* Header with logo */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            {/* House + chat bubble logo mark */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="7" fill="#16a34a"/>
              <path d="M14 6L5 13h2v8h6v-5h2v5h6v-8h2L14 6z" fill="white" opacity="0.9"/>
              <rect x="16" y="15" width="8" height="6" rx="2" fill="white"/>
              <path d="M18 22l-2 2v-2h-2" fill="white"/>
              <circle cx="18" cy="18" r="1" fill="#16a34a"/>
              <circle cx="21" cy="18" r="1" fill="#16a34a"/>
            </svg>
            <div>
              <div className="font-semibold text-[14px] leading-tight">Smart Quote Assistant</div>
              <div className="text-[10px] text-muted leading-tight">Connecting homeowners with trusted local professionals.</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <a href="#services" className="hidden sm:block text-[13px] text-muted hover:text-ink transition-colors">Browse Services</a>
            <a
              href="#services"
              className="inline-flex items-center rounded-full bg-green-600 text-white px-4 py-1.5 text-[13px] font-medium hover:bg-green-700 transition-colors"
            >
              Get My Free Quote
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-14 pb-10 text-center max-w-3xl mx-auto">
        {/* Green badge */}
        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[12px] font-medium px-3 py-1 rounded-full mb-5">
          🟢 Serving Greater Sacramento
        </div>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
          Get Free Quotes From<br />Trusted Local Pros
        </h1>
        <p className="text-muted text-lg mt-4 max-w-xl mx-auto">
          Tell us what you need. We match you with licensed local professionals — fast, free, and no obligation.
        </p>

        {/* Trust icons */}
        <div className="flex flex-wrap justify-center gap-5 mt-6 text-[13px] text-muted" style={{ WebkitTouchCallout: "none" }}>
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Licensed & Insured</span>
          <span className="flex items-center gap-1.5"><Users size={14} /> Local Professionals</span>
          <span className="flex items-center gap-1.5"><BadgeCheck size={14} /> No Obligation</span>
        </div>

        {/* Social proof */}
        <div className="mt-5 text-[13px] text-muted">
          <div className="text-yellow-400 text-[15px] mb-0.5">★★★★★</div>
          Helping homeowners across Greater Sacramento find trusted local professionals.
        </div>
      </section>

      {/* How it works — compact */}
      <section className="bg-canvasAlt py-8 px-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 text-[13px] text-muted">
          <Step icon="📋" text="Tell us what you need" />
          <Arrow />
          <Step icon="💬" text="Answer a few questions" />
          <Arrow />
          <Step icon="✅" text="Get connected with a local pro" />
        </div>
      </section>

      {/* Services grid */}
      <main id="services" className="max-w-4xl mx-auto px-6 py-10 pb-20">
        <p className="text-[13px] font-medium text-muted mb-4">Choose the service you need</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LOCATIONS.map((loc) => {
            const config = INDUSTRY_CONFIG[loc.industry] || { emoji: "⭐", bg: "#eff6ff" };
            return (
              <Link
                key={`${loc.citySlug}-${loc.serviceSlug}`}
                to={getLocationPath(loc)}
                className="bg-white border border-border rounded-2xl p-5 hover:border-gray-300 hover:shadow-card transition-all flex items-center gap-4 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                  style={{ background: config.bg }}
                >
                  {config.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] leading-tight truncate">{loc.service}</div>
                  <div className="text-[12px] text-muted mt-0.5">Free Local Quotes</div>
                  <div className="text-[11px] text-muted mt-0.5">Licensed Local Professionals</div>
                </div>
                <span className="text-muted text-lg group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Bottom trust bar */}
      <div className="border-t border-border bg-canvasAlt py-6 px-6 text-center">
        <p className="text-[13px] text-muted">Free to request · No obligation · Licensed local pros only</p>
      </div>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-muted">
          <Link to="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-ink transition-colors">Terms</Link>
          <Link to="/partner" className="hover:text-ink transition-colors">Become a Partner</Link>
          <Link to="/contact" className="hover:text-ink transition-colors">Contact</Link>
          <Link to="/service-areas" className="hover:text-ink transition-colors">Service Areas</Link>
        </div>
        <p className="text-center text-[11px] text-muted mt-4">© {new Date().getFullYear()} Smart Quote Assistant</p>
      </footer>
    </div>
  );
}

function Step({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <span className="text-lg">{icon}</span>
      <span className="text-[13px] text-muted">{text}</span>
    </div>
  );
}

function Arrow() {
  return (
    <span className="text-muted text-lg hidden sm:block">→</span>
  );
}
