import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Mail } from 'lucide-react';

export default function Header({ settings, products, openEnquiry }) {
  const location = useLocation();
  const pathname = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navProducts = products?.filter((p) => p.status === 'PUBLISHED').slice(0, 3) || [];
  const isHome = pathname === '/';
  const isTransparent = isHome && !scrolled;

  const linkActiveStyle = 'text-accent font-semibold border-b-2 border-accent pb-1';
  const linkInactiveStyle = scrolled
    ? 'text-zinc-700 hover:text-primary-dark transition-colors'
    : isTransparent
    ? 'text-zinc-200 hover:text-white transition-colors'
    : 'text-zinc-700 hover:text-primary-dark transition-colors';

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent py-6 border-b border-transparent'
            : 'bg-bg-warm/95 backdrop-blur-md shadow-sm py-4 border-b border-sand/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {settings?.logo ? (
              <img
                src={settings.logo.url}
                alt={settings.brandName || 'Elisa Decor'}
                className="h-12 md:h-16 w-auto object-contain"
              />
            ) : (
              <span
                className={`text-xl font-bold tracking-widest font-serif ${
                  isTransparent ? 'text-white' : 'text-primary-dark'
                }`}
              >
                {settings?.brandName?.toUpperCase() || 'ELISA DECOR'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide">
            <Link to="/" className={pathname === '/' ? linkActiveStyle : linkInactiveStyle}>HOME</Link>
            <Link to="/about" className={pathname === '/about' ? linkActiveStyle : linkInactiveStyle}>ABOUT</Link>

            {navProducts.map((p) => {
              const url = `/products/${p.slug}`;
              return (
                <Link key={p._id} to={url} className={pathname === url ? linkActiveStyle : linkInactiveStyle}>
                  {p.name.toUpperCase()}
                </Link>
              );
            })}

            <Link to="/process" className={pathname === '/process' ? linkActiveStyle : linkInactiveStyle}>PROCESS</Link>
            <Link to="/projects" className={pathname === '/projects' ? linkActiveStyle : linkInactiveStyle}>PROJECTS</Link>
            <Link to="/contact" className={pathname === '/contact' ? linkActiveStyle : linkInactiveStyle}>CONTACT</Link>
          </nav>

          {/* Enquiry Button */}
          <div className="hidden lg:block">
            <button
              id="header-enquire-btn"
              onClick={() => openEnquiry()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm ${
                isTransparent
                  ? 'bg-white text-primary-dark hover:bg-zinc-100 hover:shadow-md'
                  : 'bg-forest text-bg-warm hover:bg-primary-dark hover:shadow-md'
              }`}
            >
              <Mail size={14} />
              Enquire Now
            </button>
          </div>

          {/* Mobile Toggler */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-1 rounded-md transition-colors focus:outline-none ${
              isTransparent ? 'text-white hover:bg-white/10' : 'text-primary-dark hover:bg-sand/30'
            }`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-primary-dark/95 backdrop-blur-lg flex flex-col justify-between p-8 text-bg-warm">
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
            <span className="text-xl font-bold font-serif tracking-widest">
              {settings?.brandName?.toUpperCase() || 'ELISA DECOR'}
            </span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-md text-zinc-400 hover:text-white focus:outline-none">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-xl font-bold font-serif tracking-wider py-8 overflow-y-auto">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <Link to="/about" className="hover:text-accent transition-colors">About Elisa Decor</Link>

            <div className="border-l border-zinc-800 pl-4 space-y-4">
              <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-semibold block">Products</span>
              {navProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/products/${p.slug}`}
                  className="block text-lg hover:text-accent font-sans font-semibold transition-colors"
                >
                  {p.name}
                </Link>
              ))}
            </div>

            <Link to="/process" className="hover:text-accent transition-colors">Process</Link>
            <Link to="/projects" className="hover:text-accent transition-colors">Projects Gallery</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link>
          </nav>

          <div className="border-t border-zinc-800 pt-6 space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openEnquiry();
              }}
              className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded text-sm uppercase tracking-wider transition-colors shadow-lg"
            >
              Enquire About Products <ArrowRight size={16} />
            </button>
            {settings?.phone && (
              <p className="text-center text-xs text-zinc-500 font-medium">
                Direct Line: <a href={`tel:${settings.phone}`} className="text-zinc-300 underline">{settings.phone}</a>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
