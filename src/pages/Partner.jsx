import { Link } from "react-router-dom";

export default function Partner() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link to="/" className="font-semibold text-[15px]">Smart Quote Assistant</Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Become a Partner</h1>
        <p className="text-muted mb-8">Are you a licensed local service professional in the Greater Sacramento area? We'd love to connect you with homeowners actively looking for your services.</p>
        <div className="space-y-4 text-[15px]">
          <div className="bg-canvasAlt rounded-2xl p-5 border border-border">
            <h2 className="font-semibold mb-1">What we offer</h2>
            <p className="text-muted">Exclusive, pre-qualified leads from homeowners in your service area who are ready to hire.</p>
          </div>
          <div className="bg-canvasAlt rounded-2xl p-5 border border-border">
            <h2 className="font-semibold mb-1">Who we work with</h2>
            <p className="text-muted">Licensed, insured local professionals across pest control, HVAC, plumbing, roofing, cleaning, and more.</p>
          </div>
          <div className="bg-canvasAlt rounded-2xl p-5 border border-border">
            <h2 className="font-semibold mb-1">Get started</h2>
            <p className="text-muted">Email us at <a href="mailto:smartquoteassistant@gmail.com" className="text-brand hover:underline">smartquoteassistant@gmail.com</a> with your name, business, service type, and service area.</p>
          </div>
        </div>
      </main>
      <footer className="text-center text-[12px] text-muted py-6 border-t border-border">
        <Link to="/privacy" className="hover:underline">Privacy</Link> · <Link to="/terms" className="hover:underline">Terms</Link>
      </footer>
    </div>
  );
}
