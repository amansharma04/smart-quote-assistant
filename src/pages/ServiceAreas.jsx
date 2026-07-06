import { Link } from "react-router-dom";

const AREAS = [
  "Folsom", "Sacramento", "Roseville", "Elk Grove", "Rancho Cordova",
  "Rocklin", "Lincoln", "Auburn", "Citrus Heights", "Antelope",
  "Fair Oaks", "Orangevale", "Granite Bay", "El Dorado Hills", "Cameron Park",
];

export default function ServiceAreas() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link to="/" className="font-semibold text-[15px]">Smart Quote Assistant</Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Service Areas</h1>
        <p className="text-muted mb-8">We connect homeowners with trusted local professionals across the Greater Sacramento area, including:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AREAS.map((area) => (
            <div key={area} className="bg-canvasAlt border border-border rounded-xl px-4 py-2.5 text-[14px] flex items-center gap-2">
              <span className="text-green-500">✓</span> {area}
            </div>
          ))}
        </div>
        <p className="text-muted text-[14px] mt-8">Don't see your city? Submit a quote request anyway — our pros often serve surrounding communities too.</p>
        <Link to="/" className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-full text-[15px] font-medium mt-5 hover:bg-green-700 transition-colors">
          Get a Free Quote
        </Link>
      </main>
      <footer className="text-center text-[12px] text-muted py-6 border-t border-border">
        <Link to="/privacy" className="hover:underline">Privacy</Link> · <Link to="/terms" className="hover:underline">Terms</Link>
      </footer>
    </div>
  );
}
