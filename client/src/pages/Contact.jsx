import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Loader2 } from 'lucide-react';
import api from '../api/axios';
import ContactForm from '../components/ContactForm';
import SEO from '../components/SEO';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settRes, prodRes] = await Promise.all([
          api.get('/settings'),
          api.get('/products'),
        ]);
        setSettings(settRes.data.settings);
        setProducts(prodRes.data.products || []);
      } catch (err) {
        console.error('Failed to load contact data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-zinc-500">
        <Loader2 className="animate-spin text-accent mr-2" size={24} />
        Loading...
      </div>
    );
  }
  const getEmbedMapUrl = () => {
    const url = settings?.googleMapsUrl;
    if (url && (url.includes('embed') || url.includes('output=embed'))) {
      return url;
    }
    if (settings?.address) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }
    return '';
  };

  return (
    <div className="bg-bg-warm min-h-screen pt-[72px] pb-24 fade-in">
      <SEO
        title="Contact Us | Corporate Headquarters & Locations"
        description="Reach out to Elisa Decor. Contact our corporate sales desk for plywood sheet queries, catalog documents, or direct wholesale dealer coordinates."
        canonical="/contact"
      />

      {/* 1. Header Banner */}
      <section className="bg-primary-dark text-white py-16 px-6 md:px-8 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80')] bg-cover opacity-15 mix-blend-overlay" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-bold tracking-widest text-brass uppercase block">CONNECT WITH US</span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
            Contact Elisa Decor
          </h1>
          <p className="text-sm md:text-base text-zinc-350 max-w-xl mx-auto leading-relaxed">
            Have questions about thickness choices, custom calibration, or wholesale dealers? Reach out to our team.
          </p>
        </div>
      </section>

      {/* 2. Grid content */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: Coordinates Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-sand/15 border border-sand/40 rounded-xl p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-bold font-serif text-primary-dark border-b border-sand pb-3">
              Corporate Contacts
            </h3>
            
            <ul className="space-y-4 text-sm text-zinc-650">
              {settings?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="text-accent h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Corporate Office</span>
                    <p className="font-medium text-primary-dark leading-relaxed">{settings.address}</p>
                  </div>
                </li>
              )}

              {settings?.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="text-accent h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Direct Line</span>
                    <a href={`tel:${settings.phone}`} className="font-semibold text-primary-dark font-mono hover:text-accent transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                </li>
              )}

              {settings?.email && (
                <li className="flex items-start gap-3">
                  <Mail className="text-accent h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Sales Desk</span>
                    <a href={`mailto:${settings.email}`} className="font-semibold text-primary-dark font-mono hover:text-accent transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </li>
              )}

              {settings?.businessHours && (
                <li className="flex items-start gap-3 pt-4 border-t border-sand/40">
                  <Clock className="text-accent h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Office Hours</span>
                    <p className="font-medium text-primary-dark">{settings.businessHours}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {getEmbedMapUrl() && (
            <div className="rounded-xl overflow-hidden border border-sand/50 shadow-sm aspect-video bg-zinc-200">
              <iframe
                src={getEmbedMapUrl()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Elisa Decor Office Map"
              />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Contact Form */}
        <div className="lg:col-span-7">
          <ContactForm products={products} />
        </div>

      </section>
    </div>
  );
}
