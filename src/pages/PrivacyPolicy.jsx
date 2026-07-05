import { Link } from "react-router-dom";

/**
 * This is a starting-point privacy policy, not legal advice. Have an
 * actual lawyer review this before relying on it, especially once real
 * consumer data is flowing through the site at any meaningful volume.
 */
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link to="/" className="font-semibold text-[15px]">Free Local Quotes</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-14 prose-sm">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <Section title="What we collect">
          When you request a quote, we collect the information you provide: your name, phone
          number, email address (if given), city, zip code, the service you're interested in,
          your urgency, preferred contact time, and any notes you add.
        </Section>

        <Section title="How we use it">
          We use this information to connect you with a local service provider who can respond to
          your request. Your information may be shared with one or more local businesses so they
          can contact you about your request. We do not sell your information to unrelated third
          parties or use it for purposes beyond fulfilling your quote request.
        </Section>

        <Section title="Consent to be contacted">
          By submitting a quote request, you agree to be contacted about that request by phone,
          text, or email — including by the local business(es) matched to your request.
        </Section>

        <Section title="Email communications">
          If we ever send you marketing or follow-up emails beyond your original quote request,
          every such email will include a clear way to unsubscribe, and we will honor
          unsubscribe requests promptly.
        </Section>

        <Section title="How we protect your information">
          Your information is stored securely and is only accessible through authenticated,
          server-side systems. We do not make your information publicly accessible.
        </Section>

        <Section title="Your rights">
          You can request that we delete your information at any time by contacting us. We will
          honor reasonable requests to access, correct, or delete your data.
        </Section>

        <Section title="Contact us">
          Questions about this policy or your data? Contact us at the email address listed on our
          site.
        </Section>
      </main>

      <footer className="text-center text-[12px] text-muted py-8 border-t border-border">
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        {" · "}
        <Link to="/terms" className="hover:underline">Terms</Link>
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-[15px] text-muted leading-relaxed">{children}</p>
    </div>
  );
}
