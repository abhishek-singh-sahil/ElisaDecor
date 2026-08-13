import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Terms() {
  return (
    <div className="bg-bg-warm min-h-screen py-16 px-6 md:px-8 fade-in">
      <SEO
        title="Terms of Service | Elisa Decor"
        description="Review the terms of service governing usage of the Elisa Decor corporate website and enquiry portals."
        canonical="/terms"
      />
      <div className="max-w-3xl mx-auto space-y-8 text-left text-zinc-650 leading-relaxed text-sm">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary-dark tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-zinc-500 font-mono">Last Updated: August 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">1. Acceptance of Terms</h2>
          <p>
            By using this website, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use this website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">2. Purpose of Website</h2>
          <p>
            This website is a premium brand showcase and lead-generation portal for Elisa Decor. It is NOT an e-commerce website. There are no online payment facilities, shopping carts, or online purchases.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">3. Accuracy of Content</h2>
          <p>
            We strive to provide accurate, reliable, and up-to-date information regarding our plywood specifications, processes, and applications. However, technical properties (e.g. density, thickness calibration tolerances) should be verified with the official printed catalog sheets before purchase.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">4. Anti-Abuse and Spam</h2>
          <p>
            You agree not to submit false, malicious, or automated spam enquiries through our forms. All form inputs are validated, rate-limited, and checked using anti-spam honeypot parameters.
          </p>
        </section>

        <div className="pt-6 border-t border-sand/40">
          <Link to="/" className="text-xs font-bold text-primary-dark hover:text-accent transition-colors">
            ← Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
