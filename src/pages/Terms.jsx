import { Link } from "react-router-dom";

/**
 * Starting-point terms, not legal advice. Have an actual lawyer review
 * this before relying on it, especially once you're taking money for
 * leads at any meaningful volume.
 */
export default function Terms() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link to="/" className="font-semibold text-[15px]">Free Local Quotes</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-muted text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <Section title="What this service is">
          This site connects consumers requesting local service quotes with local service
          providers. Requesting a quote through this site is free and creates no obligation to
          hire any business you're connected with.
        </Section>

        <Section title="No guarantee of service">
          We do our best to match your request with a relevant local provider, but we do not
          guarantee that any provider will contact you, that a provider will be available in your
          area, or that any provider meets a particular standard of quality. Any work you engage a
          provider to perform is a separate agreement between you and that provider — we are not a
          party to it.
        </Section>

        <Section title="Accuracy of information">
          You agree to provide accurate contact information when requesting a quote. Submitting
          false, misleading, or spam submissions may result in your request being rejected.
        </Section>

        <Section title="Acceptable use">
          You agree not to use this site to submit fraudulent requests, to scrape or harvest data
          from this site, or to attempt to interfere with the site's normal operation.
        </Section>

        <Section title="Changes to these terms">
          We may update these terms from time to time. Continued use of the site after changes are
          posted means you accept the updated terms.
        </Section>

        <Section title="Contact us">
          Questions about these terms? Contact us at the email address listed on our site.
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
