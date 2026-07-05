import { Link } from "react-router-dom";
import { LOCATIONS, getLocationPath } from "../config/locations.js";
import { ShieldCheck, Clock, Star } from "lucide-react";

const INDUSTRY_CONFIG = {
  pest_control:  { emoji: "🐛", color: "#16a34a", bg: "#f0fdf4" },
  hvac:          { emoji: "❄️", color: "#0284c7", bg: "#f0f9ff" },
  plumbing:      { emoji: "🔧", color: "#7c3aed", bg: "#faf5ff" },
  bookkeeping:   { emoji: "📒", color: "#b45309", bg: "#fffbeb" },
  salon:         { emoji: "✂️", color: "#db2777", bg: "#fdf2f8" },
  junk_removal:  { emoji: "🗑️", color: "#ea580c", bg: "#fff7ed" },
  cleaning:      { emoji: "🧹", color: "#0891b2", bg: "#ecfeff" },
  painting:      { emoji: "🎨", color: "#7c3aed", bg: "#f5f3ff" },
  roofing:       { emoji: "🏠", color: "#64748b", bg: "#f8fafc" },
  handyman:      { emoji: "🔨", color: "#b45309", bg: "#fef3c7" },
  remodeling:    { emoji: "🏗️", color: "#0f766e", bg: "#f0fdfa" },
  fencing:       { emoji: "🪵", color: "#78350f", bg: "#fef9ee" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold text-[15px] tracking-tight">Smart Quote Assistant</span>
          <span className="text-[13px] text-muted hidden sm:block">Free quotes from local pros</span>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-14 pb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[12px] font-medium px-3 py-1 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
          Now serving Sacramento area
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
          Get Free Quotes From<br />Trusted Local Pros
        </h1>
        <p className="text-muted text-lg mt-4 max-w-xl mx-auto">
          Tell us what you need. We match you with licensed local professionals — fast, free, and no obligation.
        </p>
        <div className="flex flex-wrap justify-center gap-5 mt-6 text-[13px] text-muted">
          <div className="flex items-center gap-1.5"><ShieldCheck size={14} /> Licensed & Insured</div>
          <div className="flex items-center gap-1.5"><Clock size={14} /> Fast Response</div>
          <div className="flex items-center gap-1.5"><Star size={14} /> No Obligation</div>
        </div>
      </section>

      {/* Full services grid — all 12, equal weight */}
      <main className="max-w-4xl mx-auto px-6 pb-20">
        <p className="text-[12px] font-medium text-muted uppercase tracking-widest mb-4">
          {LOCATIONS.length} services available
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LOCATIONS.map((loc) => {
            const config = INDUSTRY_CONFIG[loc.industry] || { emoji: "⭐", color: "#0071e3", bg: "#eff6ff" };
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
                  <div className="font-semibold text-[15px] leading-tight">{loc.service}</div>
                  <div className="text-[13px] text-muted mt-0.5">{loc.city}, CA</div>
                </div>
                <span className="text-muted text-lg group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
              </Link>
            );
          })}
        </div>
      </main>

      <div className="border-t border-border bg-canvasAlt py-8 px-6 text-center">
        <p className="text-[13px] text-muted">Free to request · No obligation · Licensed local pros only</p>
      </div>

      <footer className="text-center text-[12px] text-muted py-6">
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        {" · "}
        <Link to="/terms" className="hover:underline">Terms</Link>
      </footer>
    </div>
  );
}
