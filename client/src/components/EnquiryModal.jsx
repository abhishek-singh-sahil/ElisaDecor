import { useState, useEffect } from 'react';
import { X, CheckCircle, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function EnquiryModal({ isOpen, onClose, products, initialProductSlug, settings }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [company, setCompany] = useState('');
  const [productId, setProductId] = useState('');
  const [requirement, setRequirement] = useState('');
  const [consent, setConsent] = useState(true);
  const [website, setWebsite] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError('');
      if (initialProductSlug && products?.length > 0) {
        const activeProd = products.find((p) => p.slug === initialProductSlug);
        if (activeProd) {
          setProductId(activeProd._id);
        }
      } else {
        setProductId('');
      }
    }
  }, [isOpen, initialProductSlug, products]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/enquiries', {
        name,
        phone,
        email,
        city,
        state,
        company,
        productId: productId || null,
        requirement,
        consent,
        website,
        sourcePage: typeof window !== 'undefined' ? window.location.href : '',
      });

      if (res.data.success) {
        setSuccess(true);
        setName('');
        setPhone('');
        setEmail('');
        setCity('');
        setState('');
        setCompany('');
        setRequirement('');
      } else {
        setError(res.data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error('Submit enquiry failed:', err);
      setError(err.response?.data?.error || 'A connection issue occurred. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeProductData = products?.find((p) => p._id === productId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-4xl bg-bg-warm border border-sand rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-50 h-auto md:h-[580px] max-h-[90vh] min-h-0 animate-popup">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-950/20 text-primary-dark hover:bg-zinc-950/40 hover:text-white transition-colors z-20"
        >
          <X size={18} />
        </button>

        <div className="hidden md:flex md:w-5/12 bg-primary-dark text-bg-warm flex-col justify-between p-8 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80')] bg-cover opacity-15 mix-blend-overlay" />
          
          <div className="relative space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brass">ELISA DECOR</span>
            <h3 className="text-2xl font-bold font-serif leading-tight">
              Request Technical Consultation
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Let us assist you with custom calibration specifications, thickness choices, and certified dealers near you.
            </p>
          </div>

          {activeProductData && (
            <div className="relative p-4 border border-zinc-800 rounded bg-zinc-950/50 space-y-3">
              {activeProductData.heroImage && (
                <img
                  src={activeProductData.heroImage.url}
                  alt={activeProductData.name}
                  className="h-20 w-full object-cover rounded border border-zinc-800"
                />
              )}
              <div>
                <span className="text-[9px] uppercase tracking-wider text-accent font-bold">Selected Material</span>
                <h4 className="text-sm font-semibold text-white leading-tight">{activeProductData.name}</h4>
                <p className="text-[10px] text-zinc-400 line-clamp-2 mt-1 leading-normal">{activeProductData.shortDescription}</p>
              </div>
            </div>
          )}

          <div className="relative space-y-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-accent" />
              <span className="font-mono">{settings?.phone || '+91 82107 20731'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-accent" />
              <span className="font-mono">{settings?.email || 'enquiry@elisadecor.com'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-accent" />
              <span>{settings?.address || 'Anshika Plywoods, Manish Hardware Building, Ranchi - Patna Rd, Jhumri Telaiya, Jharkhand 825409'}</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto flex flex-col justify-start md:justify-center min-h-0">
          {success ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-emerald-600" />
              <h3 className="text-xl font-bold font-serif text-primary-dark">Thank You!</h3>
              <p className="text-sm text-zinc-650 max-w-sm mx-auto leading-relaxed">
                Your enquiry for <span className="font-semibold text-forest">{activeProductData?.name || 'Elisa Decor Plywood'}</span> has been successfully logged. Our technical sales executive will contact you shortly.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-forest hover:bg-primary-dark text-bg-warm font-semibold text-xs uppercase tracking-wider rounded transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-primary-dark font-serif">Product Specific Enquiry</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Please provide your details below.</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-2 text-xs rounded border border-red-200">
                  {error}
                </div>
              )}

              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex="-1"
                autoComplete="off"
                className="hidden"
                style={{ display: 'none' }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
                    Interested In *
                  </label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full rounded bg-sand/30 border border-sand/80 px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="">General Corporate Enquiry</option>
                    {products
                      ?.filter((p) => p.status === 'PUBLISHED')
                      .map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} Plywood
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abhi Patel"
                    className="w-full rounded bg-sand/30 border border-sand/80 px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 8210720731"
                    className="w-full rounded bg-sand/30 border border-sand/80 px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. abhi@domain.com"
                    className="w-full rounded bg-sand/30 border border-sand/80 px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Ahmedabad"
                    className="w-full rounded bg-sand/30 border border-sand/80 px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Jharkhand"
                    className="w-full rounded bg-sand/30 border border-sand/80 px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Studio Line Design"
                    className="w-full rounded bg-sand/30 border border-sand/80 px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
                    Describe your requirement
                  </label>
                  <textarea
                    rows={3}
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="e.g. Need 19mm boiling water proof sheets for modular kitchen cabinetry, approx 40 sheets..."
                    className="w-full rounded bg-sand/30 border border-sand/80 px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-[10px] text-zinc-500 leading-normal pt-1">
                <input
                  type="checkbox"
                  required
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="rounded bg-sand/20 border-sand text-forest focus:ring-forest mt-0.5"
                />
                <label htmlFor="consent" className="cursor-pointer">
                  I consent to Elisa Decor saving my coordinates and contacting me about product specifications.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-forest hover:bg-primary-dark text-bg-warm font-bold py-3 rounded text-xs uppercase tracking-wider transition-colors shadow disabled:opacity-50"
                >
                  {loading && <Loader2 className="animate-spin" size={14} />}
                  {loading ? 'Processing...' : 'Submit Enquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
