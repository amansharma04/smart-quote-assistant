import { Link } from "react-router-dom";
import { LOCATIONS, getLocationPath } from "../config/locations.js";
import { ShieldCheck, Clock, Star, Bug, Wind, Droplet, BookOpen, Scissors, Trash2 } from "lucide-react";

const INDUSTRY_ICONS = {
  pest_control: { icon: Bug, color: "#16a34a", bg: "#f0fdf4" },
  hvac: { icon: Wind, color: "#0284c7", bg: "#f0f9ff" },
  plumbing: { icon: Droplet, color: "#7c3aed", bg: "#faf5ff" },
  bookkeeping: { icon: BookOpen, color: "#b45309", bg: "#fffbeb" },
  salon: { icon: Scissors, color: "#db2777", bg: "#fdf2f8" },
  junk_removal: { icon: Trash2, color: "#ea580c", bg: "#fff7ed" },
};

export default function Home() {
  const featured = LOCATIONS.find((l) => l.citySlug === "folsom" && l.serviceSlug === "pest-control") || LOCATIONS[0];
  const rest = LOCATIONS.filter((l) => l !== featured);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold text-[15px] tracking-tight">Smart Quote Assistant</span>
          <Link
            to={getLocationPath(featured)}
            className="inline-flex items-center rounded-full bg-brand text-white px-4 py-1.5 text-[13px] font-medium hover:bg-blue-700 transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-12 text-center max-w-3xl mx-auto">
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

      {/* Services grid */}
      <main className="max-w-4xl mx-auto px-6 pb-20">

        {/* Featured */}
        <Link
          to={getLocationPath(featured)}
          className="block rounded-2xl overflow-hidden border border-border hover:shadow-card transition-all mb-5 group"
          style={{ background: "linear-gradient(135deg, #111827, #1e3a5f)" }}
        >
          <div className="p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2">
                ⭐ Most Requested
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Pest Control
              </h2>
              <p className="text-white/60 text-[14px] mt-1">Folsom, CA · Same-day available</p>
              <div className="mt-5 inline-flex items-center gap-2 bg-white text-ink px-5 py-2.5 rounded-full text-[14px] font-medium group-hover:bg-gray-100 transition-colors">
                Get My Free Quote →
              </div>
            </div>
            <div className="text-6xl sm:text-8xl select-none">🐛</div>
          </div>
        </Link>

        {/* Other services */}
        <p className="text-[12px] font-medium text-muted uppercase tracking-widest mb-3">More Services</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {rest.map((loc) => {
            const meta = INDUSTRY_ICONS[loc.industry] || { icon: Star, color: "#0071e3", bg: "#eff6ff" };
            const Icon = meta.icon;
            return (
              <Link
                key={`${loc.citySlug}-${loc.serviceSlug}`}
                to={getLocationPath(loc)}
                className="bg-white border border-border rounded-2xl p-5 hover:border-gray-300 hover:shadow-card transition-all flex items-center gap-4 group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: meta.bg }}
                >
                  <Icon size={20} style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px]">{loc.service}</div>
                  <div className="text-[13px] text-muted">{loc.city}, CA</div>
                </div>
                <span className="text-muted text-lg group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Bottom trust bar */}
      <div className="border-t border-border bg-canvasAlt py-8 px-6 text-center">
        <p className="text-[13px] text-muted">
          Free to request · No obligation · Licensed local pros only
        </p>
      </div>

      <footer className="text-center text-[12px] text-muted py-6">
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        {" · "}
        <Link to="/terms" className="hover:underline">Terms</Link>
      </footer>
    </div>
  );
}
