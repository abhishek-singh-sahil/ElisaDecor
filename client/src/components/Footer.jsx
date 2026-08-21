import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer({ settings, products }) {
  const publishedProducts = products?.filter((p) => p.status === 'PUBLISHED') || [];

  return (
    <footer className="bg-primary-dark text-zinc-400 pt-16 pb-8 border-t border-forest">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-forest">
        {/* Column 1: Brand Intro & Socials */}
        <div className="space-y-6">
          <Link to="/" className="inline-block">
            {settings?.logo ? (
              <img
                src={settings.logo.url}
                alt={settings.brandName || 'Elisa Decor'}
                className="h-12 md:h-16 w-auto object-contain"
              />
            ) : (
              <span className="text-xl font-bold tracking-widest text-white font-serif">
                {settings?.brandName?.toUpperCase() || 'ELISA DECOR'}
              </span>
            )}
          </Link>
          
          <p className="text-sm leading-relaxed text-zinc-450">
            {settings?.footer?.description ||
              'Premium quality plywood and architectural wood surfaces designed to create timeless, warp-free interior spaces.'}
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            {settings?.socialUrls?.facebook && (
              <a href={settings.socialUrls.facebook} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="Facebook">
                <Facebook size={18} />
              </a>
            )}
            {settings?.socialUrls?.instagram && (
              <a href={settings.socialUrls.instagram} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="Instagram">
                <Instagram size={18} />
              </a>
            )}
            {settings?.socialUrls?.twitter && (
              <a href={settings.socialUrls.twitter} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors flex items-center justify-center" title="X (Twitter)">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {settings?.socialUrls?.youtube && (
              <a href={settings.socialUrls.youtube} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="YouTube">
                <Youtube size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Products Links */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-bold tracking-widest uppercase border-l-2 border-accent pl-2">
            Products
          </h4>
          <ul className="space-y-2 text-sm">
            {publishedProducts.map((p) => (
              <li key={p._id}>
                <Link to={`/products/${p.slug}`} className="hover:text-white transition-colors font-medium">
                  {p.name}
                </Link>
              </li>
            ))}
            {publishedProducts.length > 0 && (
              <li className="pt-1.5 border-t border-forest/40">
                <Link to="/products" className="text-accent hover:text-white transition-colors font-semibold">
                  All Products →
                </Link>
              </li>
            )}
            {publishedProducts.length === 0 && (
              <li className="text-zinc-650 text-xs italic">No products added.</li>
            )}
          </ul>
        </div>

        {/* Column 3: Corporate Links */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-bold tracking-widest uppercase border-l-2 border-accent pl-2">
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-white transition-colors font-medium">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition-colors font-medium">
                Products Range
              </Link>
            </li>
            <li>
              <Link to="/process" className="hover:text-white transition-colors font-medium">
                Our Process
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-white transition-colors font-medium">
                Applications Gallery
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors font-medium">
                Contact & Location
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Coordinates */}
        <div className="space-y-4 text-sm text-zinc-450">
          <h4 className="text-white text-xs font-bold tracking-widest uppercase border-l-2 border-accent pl-2">
            Office Contacts
          </h4>
          <ul className="space-y-3">
            {settings?.address && (
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
            )}
            {settings?.phone && (
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors font-mono">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-accent flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors font-mono">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.businessHours && (
              <li className="flex items-start gap-2.5 pt-1 border-t border-forest/40">
                <Clock size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <span>{settings.businessHours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom Legal Copyright */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 flex flex-col md:flex-row gap-4 justify-between items-center text-xs text-zinc-550">
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <p>{settings?.footer?.copyrightText || `© ${new Date().getFullYear()} Elisa Decor. All rights reserved.`}</p>
          <p className="text-[10px] text-zinc-500">
            Website developed and managed by{' '}
            <a
              href="https://wa.me/919117261314?text=Hi%20Abhishek%2C%20I%E2%80%99m%20looking%20to%20build%20a%20website%20or%20software%20for%20my%20business.%20I%E2%80%99d%20like%20to%20discuss%20my%20requirements%20with%20you."
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline font-semibold"
            >
              Abhishek Singh Sahil
            </a>{' '}
            phone no. +91 6204635073
          </p>
        </div>
        <div className="flex gap-6 font-medium">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link to="/cookie-policy" className="hover:text-white transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
