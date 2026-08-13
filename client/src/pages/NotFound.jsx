import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-dark text-bg-warm flex flex-col items-center justify-center p-6 text-center font-sans">
      <SEO title="404 - Page Not Found | Elisa Decor" noIndex={true} />
      <div className="max-w-md">
        <h1 className="text-8xl md:text-9xl font-bold font-serif text-brass mb-2 tracking-widest">
          404
        </h1>

        <h2 className="text-2xl font-bold font-serif text-white mb-3">
          Page Not Found
        </h2>

        <p className="text-sm text-taupe leading-relaxed mb-8 max-w-xs mx-auto">
          It might have been renamed, archived, or is temporarily offline. Let us guide you back.
        </p>

        <div className="flex flex-col gap-3 items-center">
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow min-w-[180px]"
          >
            Return Home
          </Link>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded transition-all hover:bg-white/10 min-w-[180px]"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </div>
  );
}
