import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link to="/" className="font-semibold text-[15px]">Smart Quote Assistant</Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Contact Us</h1>
        <p className="text-muted mb-8">Have a question, feedback, or want to become a partner? We'd love to hear from you.</p>
        <div className="space-y-4 text-[15px]">
          <div className="bg-canvasAlt rounded-2xl p-5 border border-border">
            <h2 className="font-semibold mb-1">General inquiries</h2>
            <a href="mailto:hello@smartquoteassistant.com" className="text-brand hover:underline">hello@smartquoteassistant.com</a>
          </div>
          <div className="bg-canvasAlt rounded-2xl p-5 border border-border">
            <h2 className="font-semibold mb-1">Partner with us</h2>
            <a href="mailto:partner@smartquoteassistant.com" className="text-brand hover:underline">partner@smartquoteassistant.com</a>
          </div>
        </div>
      </main>
      <footer className="text-center text-[12px] text-muted py-6 border-t border-border">
        <Link to="/privacy" className="hover:underline">Privacy</Link> · <Link to="/terms" className="hover:underline">Terms</Link>
      </footer>
    </div>
  );
}
