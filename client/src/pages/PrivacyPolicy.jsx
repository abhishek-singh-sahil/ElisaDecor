import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="bg-bg-warm min-h-screen py-16 px-6 md:px-8 fade-in">
      <SEO
        title="Privacy Policy | Elisa Decor"
        description="Understand how Elisa Decor handles, saves, and protects customer enquiry information and coordinates."
        canonical="/privacy-policy"
      />
      <div className="max-w-3xl mx-auto space-y-8 text-left text-zinc-650 leading-relaxed text-sm">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary-dark tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500 font-mono">Last Updated: August 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">1. Collection of Enquiry Information</h2>
          <p>
            When you submit a product enquiry or contact message via our website forms, we collect personal coordinates you explicitly provide. This includes your full name, phone number, email address, city, state, company or design studio name, and specific structural plywood requirements. We also log your IP hash and browser user-agent to protect against automated spam submissions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">2. Purpose of Processing Details</h2>
          <p>
            Your details are processed strictly to verify, qualify, and reply to your product requests. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Dispatching technical catalogs, specifications sheets, and sample details.</li>
            <li>Routing direct supply coordinates or referring you to certified local dealers.</li>
            <li>Replying to questions regarding our calibration density, wood sources, or warranty metrics.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">3. Data Preservation & Security</h2>
          <p>
            Enquiry data is saved securely in a restricted-access MongoDB database. Administrative controls are protected using hashed passwords and token sessions, verifying permissions server-side. SMTP email dispatch coordinates are isolated using environment configurations. We never sell, lease, or lease-out your details to third-party marketing companies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">4. Your Rights</h2>
          <p>
            You have the right to request deletion or modification of your personal coordinates saved in our logs. To request database removal, please email <a href="mailto:contact@elisadecor.com" className="text-accent underline font-mono">contact@elisadecor.com</a> with your request, and our system administrator will purge your data record within 30 business days.
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
