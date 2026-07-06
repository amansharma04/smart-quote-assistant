import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOCATIONS, getLocationPath } from "../config/locations.js";
import { Search } from "lucide-react";

const INDUSTRY_CONFIG = {
  pest_control:  { emoji: "🐛", label: "Pest Control" },
  hvac:          { emoji: "❄️", label: "HVAC" },
  plumbing:      { emoji: "🔧", label: "Plumbing" },
  bookkeeping:   { emoji: "📒", label: "Bookkeeping" },
  salon:         { emoji: "✂️", label: "Salon & Spa" },
  junk_removal:  { emoji: "🗑️", label: "Junk Removal" },
  cleaning:      { emoji: "🧹", label: "Cleaning" },
  painting:      { emoji: "🎨", label: "Painting" },
  roofing:       { emoji: "🏠", label: "Roofing" },
  handyman:      { emoji: "🔨", label: "Handyman" },
  remodeling:    { emoji: "🏗️", label: "Remodeling" },
  fencing:       { emoji: "🪵", label: "Fencing" },
};

export default function Home() {
  const [zip, setZip] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    // Find first matching service or go to first location
    const match = LOCATIONS.find((l) =>
      l.service.toLowerCase().includes(search.toLowerCase())
    );
    if (match) navigate(getLocationPath(match));
    else navigate(getLocationPath(LOCATIONS[0]));
  }

  return (
    <div className="min-h-screen bg-white text-ink">

      {/* Nav */}
      <header className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#16a34a"/>
              <path d="M14 6L5 13h2v8h6v-5h2v5h6v-8h2L14 6z" fill="white" opacity="0.9"/>
              <rect x="16" y="15" width="8" height="6" rx="2" fill="white"/>
              <path d="M18 22l-2 2v-2" fill="white"/>
              <circle cx="18.5" cy="18" r="0.8" fill="#16a34a"/>
              <circle cx="21" cy="18" r="0.8" fill="#16a34a"/>
            </svg>
            <span className="font-bold text-[16px] tracking-tight">Smart Quote Assistant</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[14px] text-muted">
            <a href="#services" className="hover:text-ink transition-colors">Find Pros</a>
            <Link to="/partner" className="hover:text-ink transition-colors">Join as a Pro</Link>
            <Link to="/service-areas" className="hover:text-ink transition-colors">Service Areas</Link>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link to="/partner" className="hidden sm:block text-[13px] font-medium text-ink border border-border px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
              Join as a Pro
            </Link>
            <a href="#services" className="text-[13px] font-medium bg-green-600 text-white px-4 py-1.5 rounded-full hover:bg-green-700 transition-colors">
              Get My Free Quote
            </a>
          </div>
        </div>
      </header>

      {/* Hero — full width with gradient background */}
      <section className="relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        minHeight: "420px"
      }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center text-white">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 text-[12px] font-medium px-3 py-1 rounded-full mb-6">
            🟢 Serving Greater Sacramento
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
            The one you trust to find<br/>the ones you trust.
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Get free quotes from licensed local professionals — no obligation, no spam calls.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What service do you need?"
                className="w-full pl-11 pr-4 py-4 rounded-xl text-ink text-[15px] outline-none border-0 shadow-lg"
              />
            </div>
            <div className="relative sm:w-36">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]">📍</span>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="ZIP Code"
                className="w-full pl-9 pr-4 py-4 rounded-xl text-ink text-[15px] outline-none border-0 shadow-lg"
                maxLength={5}
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-[15px] hover:bg-green-700 transition-colors whitespace-nowrap shadow-lg"
            >
              Find Pros
            </button>
          </form>

          <p className="text-white/50 text-[12px] mt-4">
            ★★★★★ Trusted by homeowners across Greater Sacramento
          </p>
        </div>
      </section>

      {/* Service icons row — Angi-style horizontal */}
      <section id="services" className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max mx-auto justify-center flex-wrap">
            {LOCATIONS.map((loc) => {
              const config = INDUSTRY_CONFIG[loc.industry] || { emoji: "⭐", label: loc.service };
              return (
                <Link
                  key={`${loc.citySlug}-${loc.serviceSlug}`}
                  to={getLocationPath(loc)}
                  className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group min-w-[80px]"
                >
                  <span className="text-3xl">{config.emoji}</span>
                  <span className="text-[11px] font-medium text-muted group-hover:text-ink transition-colors text-center leading-tight">
                    {config.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service cards grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-2">Popular services near you</h2>
        <p className="text-muted text-[14px] mb-6">Greater Sacramento area · Free quotes · No obligation</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOCATIONS.map((loc) => {
            const config = INDUSTRY_CONFIG[loc.industry] || { emoji: "⭐" };
            return (
              <Link
                key={`${loc.citySlug}-${loc.serviceSlug}`}
                to={getLocationPath(loc)}
                className="group border border-border rounded-2xl p-5 hover:border-gray-300 hover:shadow-md transition-all bg-white flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
                  {config.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] group-hover:text-green-600 transition-colors">{loc.service}</div>
                  <div className="text-[12px] text-muted mt-0.5">Free quotes · Licensed pros</div>
                  <div className="text-[12px] text-green-600 font-medium mt-1.5">Get a free quote →</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-gray-50 border-t border-border py-12 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">🛡️</div>
            <div className="font-semibold text-[15px]">Licensed & Insured</div>
            <div className="text-[13px] text-muted mt-1">Every pro is verified, licensed, and insured before they're listed.</div>
          </div>
          <div>
            <div className="text-3xl mb-2">💬</div>
            <div className="font-semibold text-[15px]">Free Quotes</div>
            <div className="text-[13px] text-muted mt-1">Request quotes from multiple local pros. Always free, no obligation.</div>
          </div>
          <div>
            <div className="text-3xl mb-2">📍</div>
            <div className="font-semibold text-[15px]">Local Professionals</div>
            <div className="text-[13px] text-muted mt-1">Real local businesses serving your community in Greater Sacramento.</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#16a34a"/>
              <path d="M14 6L5 13h2v8h6v-5h2v5h6v-8h2L14 6z" fill="white"/>
            </svg>
            <span className="font-semibold text-[13px]">Smart Quote Assistant</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-muted">
            <Link to="/privacy" className="hover:text-ink">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ink">Terms</Link>
            <Link to="/partner" className="hover:text-ink">Become a Partner</Link>
            <Link to="/contact" className="hover:text-ink">Contact</Link>
            <Link to="/service-areas" className="hover:text-ink">Service Areas</Link>
          </div>
        </div>
        <p className="text-center text-[11px] text-muted mt-4">© {new Date().getFullYear()} Smart Quote Assistant · Greater Sacramento Area</p>
      </footer>
    </div>
  );
}
