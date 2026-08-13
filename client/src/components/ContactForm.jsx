import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import api from '../api/axios';

export default function ContactForm({ products }) {
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
        setError(res.data.error || 'Failed to submit message.');
      }
    } catch (err) {
      console.error('Submit contact failed:', err);
      setError(err.response?.data?.error || 'A connection issue occurred. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-bg-warm p-8 border border-sand rounded-xl shadow-sm text-center space-y-4">
        <CheckCircle className="mx-auto h-14 w-14 text-emerald-600 animate-bounce" />
        <h3 className="text-xl font-bold font-serif text-primary-dark">Message Sent!</h3>
        <p className="text-sm text-zinc-650 max-w-sm mx-auto leading-relaxed">
          Thank you for reaching out to Elisa Decor. Your query has been logged. Our customer support executive will contact you shortly.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-2.5 bg-forest hover:bg-primary-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-warm p-6 md:p-8 border border-sand rounded-xl shadow-sm space-y-4">
      <div>
        <h3 className="text-xl font-bold text-primary-dark font-serif">Send an Enquiry</h3>
        <p className="text-xs text-zinc-500 mt-0.5">We typically respond to technical catalog queries within 24 business hours.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-xs rounded">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
            Interested In Plywood Grade?
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full rounded bg-sand/20 border border-sand px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">General Corporate Enquiry</option>
            {products?.map((p) => (
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
            className="w-full rounded bg-sand/20 border border-sand px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
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
            className="w-full rounded bg-sand/20 border border-sand px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
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
            className="w-full rounded bg-sand/20 border border-sand px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
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
            className="w-full rounded bg-sand/20 border border-sand px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
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
            className="w-full rounded bg-sand/20 border border-sand px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
            Company / Architect Studio
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Studio Line Design"
            className="w-full rounded bg-sand/20 border border-sand px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-wider mb-1">
            Project requirements / Message
          </label>
          <textarea
            rows={4}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Please detail your structural dimensions or wholesale requirements..."
            className="w-full rounded bg-sand/20 border border-sand px-3 py-2 text-xs text-primary-dark focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          />
        </div>
      </div>

      <div className="flex items-start gap-2 text-[10px] text-zinc-500 leading-normal pt-1">
        <input
          type="checkbox"
          required
          id="contact-consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="rounded bg-sand/10 border-sand text-forest focus:ring-forest mt-0.5"
        />
        <label htmlFor="contact-consent" className="cursor-pointer">
          I consent to Elisa Decor saving my contact coordinates to reply to my request.
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-forest hover:bg-primary-dark text-white font-bold py-3 rounded text-xs uppercase tracking-wider transition-colors shadow disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            'Send Message'
          )}
          {loading ? 'Sending message...' : 'Submit Message'}
        </button>
      </div>
    </form>
  );
}
