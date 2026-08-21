import { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Mail, ShieldCheck, Heart } from 'lucide-react';
import MediaPickerModal from '../components/MediaPickerModal';
import api from '../../api/axios';
import SEO from '../../components/SEO';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  // Logo & Favicon
  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);

  // Social Links
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [youtube, setYoutube] = useState('');

  // Email Settings
  const [businessEnquiryEmail, setBusinessEnquiryEmail] = useState('');
  const [customerConfirmationOn, setCustomerConfirmationOn] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [senderName, setSenderName] = useState('');
  const [replyTo, setReplyTo] = useState('');

  // Default SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null); // 'logo', 'favicon'

  const [activeTab, setActiveTab] = useState('branding'); // branding, socials, email, seo

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/settings');
      if (res.data?.settings) {
        const s = res.data.settings;
        setBrandName(s.brandName || '');
        setTagline(s.tagline || '');
        setPhone(s.phone || '');
        setEmail(s.email || '');
        setAddress(s.address || '');
        setWhatsApp(s.whatsApp || '');
        setBusinessHours(s.businessHours || '');
        setGoogleMapsUrl(s.googleMapsUrl || '');
        setLogo(s.logo || null);
        setFavicon(s.favicon || null);

        setFacebook(s.socialUrls?.facebook || '');
        setInstagram(s.socialUrls?.instagram || '');
        setTwitter(s.socialUrls?.twitter || '');
        setYoutube(s.socialUrls?.youtube || '');

        setBusinessEnquiryEmail(s.emailSettings?.businessEnquiryEmail || '');
        setCustomerConfirmationOn(s.emailSettings?.customerConfirmationOn || false);
        setEmailSubject(s.emailSettings?.emailSubject || '');
        setSenderName(s.emailSettings?.senderName || '');
        setReplyTo(s.emailSettings?.replyTo || '');

        setSeoTitle(s.defaultSeo?.title || '');
        setSeoDescription(s.defaultSeo?.description || '');
      }
    } catch (err) {
      console.error('Fetch settings failed:', err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      brandName,
      tagline,
      phone,
      email,
      address,
      whatsApp,
      businessHours,
      googleMapsUrl,
      logo: logo?._id || null,
      favicon: favicon?._id || null,
      socialUrls: {
        facebook,
        instagram,
        twitter,
        youtube,
      },
      emailSettings: {
        businessEnquiryEmail,
        customerConfirmationOn,
        emailSubject,
        senderName,
        replyTo,
      },
      defaultSeo: {
        title: seoTitle,
        description: seoDescription,
      },
    };

    try {
      const res = await api.patch('/admin/settings', payload);

      if (res.data.success) {
        alert('Site settings updated successfully.');
        fetchSettings();
      } else {
        alert(res.data.error || 'Failed to update settings.');
      }
    } catch (err) {
      console.error('Save settings failed:', err);
      alert(err.response?.data?.error || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (asset) => {
    if (mediaTarget === 'logo') {
      setLogo(asset);
    } else if (mediaTarget === 'favicon') {
      setFavicon(asset);
    }
    setMediaPickerOpen(false);
  };

  return (
    <div className="space-y-6 font-sans text-left">
      <SEO title="Settings | Elisa Decor Admin" noIndex={true} />
      
      <div className="flex items-center justify-between border-b border-zinc-805 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif">Settings</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Configure contact coordinates, brand imagery, SEO fallbacks, and notification SMTP routing.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-zinc-400 text-sm">Loading configurations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Tabs */}
          <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-2 space-y-1">
            {[
              { id: 'branding', label: 'Company & Branding', icon: Globe },
              { id: 'socials', label: 'Social Media Links', icon: Heart },
              { id: 'email', label: 'CRM & Email Settings', icon: Mail },
              { id: 'seo', label: 'Default Site SEO', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-600/10 text-emerald-400 border-l-4 border-emerald-500 pl-3'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* RIGHT: Content Forms */}
          <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            
            {/* TAB 1: BRANDING & CONTACTS */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2 font-serif">Branding & Contact Info</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-zinc-950 rounded-lg border border-zinc-850">
                  <div className="space-y-2">
                    <span className="block text-xs font-semibold text-zinc-400">Website Logo</span>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-24 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center overflow-hidden">
                        {logo ? (
                          <img src={logo.url} alt="Logo" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-zinc-650 font-bold uppercase">No Logo</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTarget('logo');
                          setMediaPickerOpen(true);
                        }}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-semibold border border-zinc-700"
                      >
                        Choose
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-xs font-semibold text-zinc-400">Favicon (32x32)</span>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center overflow-hidden">
                        {favicon ? (
                          <img src={favicon.url} alt="Favicon" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-zinc-650 font-bold uppercase">No Icon</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTarget('favicon');
                          setMediaPickerOpen(true);
                        }}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-semibold border border-zinc-700"
                      >
                        Choose
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={whatsApp}
                      onChange={(e) => setWhatsApp(e.target.value)}
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">General Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Business Hours</label>
                    <input
                      type="text"
                      value={businessHours}
                      onChange={(e) => setBusinessHours(e.target.value)}
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Physical Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Google Maps Embed URL</label>
                  <input
                    type="text"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://google.com/maps/embed/..."
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: SOCIALS */}
            {activeTab === 'socials' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2 font-serif">Social Media Links</h3>
                
                {[
                  { label: 'Facebook URL', val: facebook, setVal: setFacebook },
                  { label: 'Instagram URL', val: instagram, setVal: setInstagram },
                  { label: 'Twitter / X URL', val: twitter, setVal: setTwitter },
                  { label: 'YouTube URL', val: youtube, setVal: setYoutube },
                ].map((item) => (
                  <div key={item.label}>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">{item.label}</label>
                    <input
                      type="text"
                      value={item.val}
                      onChange={(e) => item.setVal(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white font-mono text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: EMAIL CONFIGS */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2 font-serif">Email CRM Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Recipient Business Email</label>
                    <input
                      type="email"
                      value={businessEnquiryEmail}
                      onChange={(e) => setBusinessEnquiryEmail(e.target.value)}
                      placeholder="enquiry@elisadecor.com"
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">This is where new customer website leads are routed.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Subject Header</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Sender Name (display)</label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Reply-To Address</label>
                      <input
                        type="email"
                        value={replyTo}
                        onChange={(e) => setReplyTo(e.target.value)}
                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="bg-zinc-805 p-4 border border-zinc-800 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-semibold text-white">Send Customer Auto-Confirmation</span>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Dispatches verification receipt to users upon submit.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customerConfirmationOn}
                        onChange={(e) => setCustomerConfirmationOn(e.target.checked)}
                        className="sr-only peer animate-none"
                      />
                      <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 animate-none" />
                    </label>
                  </div>
                </div>

                <div className="bg-zinc-950 p-4 rounded border border-zinc-850">
                  <p className="text-[10px] text-zinc-400 leading-normal">
                    <span className="font-bold text-amber-500 uppercase block mb-1">SMTP Credentials Isolation Warning</span>
                    Mail transmission SMTP host, port, username, and password parameters are safely restricted inside the local environment configuration file (`.env`). They are never stored inside MongoDB or exposed publicly to frontend clients.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: DEFAULT SEO */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2 font-serif">Default Site SEO Fallbacks</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Default SEO Page Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Used if a page lacks a specific custom SEO Title override.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Default Meta Description</label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white resize-none"
                  />
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaTarget(null);
        }}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
