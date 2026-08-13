import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function CookiePolicy() {
  return (
    <div className="bg-bg-warm min-h-screen py-16 px-6 md:px-8 fade-in">
      <SEO
        title="Cookie Policy | Elisa Decor"
        description="Understand how Elisa Decor utilizes cookies to optimize user experience and track analytics."
        canonical="/cookie-policy"
      />
      <div className="max-w-3xl mx-auto space-y-8 text-left text-zinc-650 leading-relaxed text-sm">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary-dark tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-xs text-zinc-500 font-mono">Last Updated: August 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">1. What are Cookies?</h2>
          <p>
            Cookies are small text files stored on your computer or mobile device by your web browser when you visit a site. They allow websites to remember user preferences, maintain session states, and collect analytics.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">2. How We Use Cookies</h2>
          <p>
            Our website uses cookies for the following purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Authentication Sessions:</strong> We use an HTTP-only secure cookie named `admin_token` to maintain session login states for administrators accessing the CMS panel.</li>
            <li><strong>Analytics & Optimization:</strong> If configured, we load Google Analytics 4 cookies to measure user interactions (e.g. product views, enquiry submissions) to optimize page layouts.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-primary-dark">3. Managing Cookie Settings</h2>
          <p>
            You can restrict, block, or delete cookies through your browser settings. If you disable cookies, please note that you will not be able to log in to the administrative CMS panel, but public pages will remain fully functional.
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
