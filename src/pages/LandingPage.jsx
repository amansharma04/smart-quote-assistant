import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getLocation, getLocationPath } from "../config/locations.js";
import QuoteWizard from "../components/QuoteWizard.jsx";
import { Star } from "lucide-react";

export default function LandingPage() {
  const { citySlug, serviceSlug } = useParams();
  const navigate = useNavigate();
  const location = getLocation(citySlug, serviceSlug);
  const quoteFormRef = useRef(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    if (!location) return;
    applySeo(location);
  }, [location]);

  // Mobile sticky CTA: the header's CTA is hidden on small screens (no
  // room for it next to the logo), so mobile visitors have no persistent
  // way to jump to the form once they've scrolled past it. This shows a
  // bottom bar specifically when the quote form itself is out of view.
  useEffect(() => {
    if (!location || !quoteFormRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(quoteFormRef.current);
    return () => observer.disconnect();
  }, [location]);

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted text-sm">
        This page isn't available. <Link to="/" className="text-brand ml-1">Go home</Link>
      </div>
    );
  }

  function handleComplete(lead) {
    navigate("/thank-you", { state: { location, lead } });
  }

  const hasReviews = location.reviews && location.reviews.length > 0;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Sticky nav */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-[15px] tracking-tight">Smart Quote Assistant</Link>
          <a
            href="#quote-form"
            className="hidden sm:inline-flex items-center rounded-full bg-brand text-white px-4 py-1.5 text-[13px] font-medium hover:bg-blue-700 transition-colors"
          >
            {location.heroCTA}
          </a>
        </div>
      </header>

      {/* Mobile sticky bottom CTA */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-30 p-4 bg-white/90 backdrop-blur-xl border-t border-border transition-transform duration-200 ${
          showStickyCta ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <a
          href="#quote-form"
          className="flex items-center justify-center bg-brand text-white px-6 py-3 rounded-full text-[15px] font-medium"
        >
          {location.heroCTA}
        </a>
      </div>

      {/* Hero + Form side by side — form visible immediately without scrolling */}
      <section className="px-6 pt-12 pb-16 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="pt-4">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-brand text-[12px] font-medium px-3 py-1 rounded-full mb-4">
              📍 Greater Sacramento, CA
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]">
              {location.headline}
            </h1>
            <p className="text-muted text-[16px] mt-4 leading-relaxed">{location.subheadline}</p>

            <div className="flex flex-col gap-2.5 mt-6">
              {location.trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[14px]">
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600 text-[10px]">✓</span>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          <div id="quote-form" ref={quoteFormRef} className="shadow-card rounded-2xl">
            <QuoteWizard location={location} onComplete={handleComplete} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-canvasAlt py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-10">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { num: "1", icon: "📋", title: "Tell us what you need", desc: "Answer a few quick questions — takes under 2 minutes." },
              { num: "2", icon: "🔍", title: "We find your match", desc: "We connect you with a licensed local pro in your area." },
              { num: "3", icon: "📞", title: "They reach out fast", desc: "A local provider calls or texts you — usually within the hour." },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-5 text-left border border-border">
                <div className="text-2xl mb-3" role="img">{step.icon}</div>
                <div className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">Step {step.num}</div>
                <div className="font-semibold text-[15px]">{step.title}</div>
                <div className="text-[13px] text-muted mt-1 leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews — only rendered when real reviews exist */}
      {hasReviews && (
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold tracking-tight mb-10">What people are saying</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-left">
              {location.reviews.map((r, i) => (
                <div key={i} className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: r.rating || 5 }).map((_, s) => (
                      <Star key={s} size={13} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-[14px] text-muted leading-relaxed">{r.text}</p>
                  <p className="text-[13px] text-ink font-semibold mt-3">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-center mb-8">Common Questions</h2>
        <div className="divide-y divide-border border-t border-b border-border">
          {location.faq.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="font-medium text-[15px] cursor-pointer list-none flex justify-between items-center">
                {f.q}
                <span className="text-muted text-xl group-open:rotate-45 transition-transform leading-none">+</span>
              </summary>
              <p className="text-[15px] text-muted mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #111827, #1e3a5f)" }}>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Ready for your free {location.service.toLowerCase()} quote?
        </h2>
        <p className="text-white/60 text-[15px] mt-2 mb-7">Takes less than 2 minutes. No obligation, ever.</p>
        <a
          href="#quote-form"
          className="inline-flex items-center justify-center bg-white text-ink px-7 py-3 rounded-full text-[15px] font-medium hover:bg-gray-100 transition-colors"
        >
          {location.heroCTA}
        </a>
      </section>

      <footer className="text-center text-[12px] text-muted py-6 pb-24 sm:pb-6">
        <Link to="/" className="hover:underline">Smart Quote Assistant</Link>
        {" · "}
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        {" · "}
        <Link to="/terms" className="hover:underline">Terms</Link>
      </footer>
    </div>
  );
}

/**
 * Sets document title, meta description, canonical URL, Open Graph tags,
 * Twitter Card tags, and JSON-LD structured data — all derived from the
 * location config, all cleaned up/replaced on route change so tags never
 * leak between pages during client-side navigation.
 */
function applySeo(location) {
  document.title = location.seoTitle;
  const url = `${window.location.origin}${getLocationPath(location)}`;

  setMeta("description", location.metaDescription);

  setMetaProperty("og:title", location.seoTitle);
  setMetaProperty("og:description", location.metaDescription);
  setMetaProperty("og:url", url);
  setMetaProperty("og:type", "website");

  setMeta("twitter:card", "summary");
  setMeta("twitter:title", location.seoTitle);
  setMeta("twitter:description", location.metaDescription);

  setCanonical(url);
  setJsonLd(buildSchema(location, url));
}

function buildSchema(location, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: location.service,
    name: `${location.service} in ${location.city}, CA`,
    description: location.metaDescription,
    areaServed: {
      "@type": "City",
      name: location.city,
    },
    url,
  };
}

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setMetaProperty(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setCanonical(url) {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = "canonical";
    document.head.appendChild(tag);
  }
  tag.href = url;
}

function setJsonLd(schema) {
  let tag = document.getElementById("location-schema");
  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = "location-schema";
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(schema);
}
