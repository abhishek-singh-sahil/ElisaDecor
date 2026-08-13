import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Sparkles,
} from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';
import api from '../../api/axios';

export default function ProductForm({ initialData, isEdit = false, id }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic'); // basic, media, specs, faqs, seo
  const [loading, setLoading] = useState(false);

  // Reusable Media Picker State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null); // 'hero', 'mobileHero', 'ogImage', 'application-X', 'gallery'
  const [appIndexTarget, setAppIndexTarget] = useState(null);

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [productCode, setProductCode] = useState(initialData?.productCode || '');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [longDescription, setLongDescription] = useState(initialData?.longDescription || '');
  const [status, setStatus] = useState(initialData?.status || 'DRAFT');
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);

  // Media references
  const [heroImage, setHeroImage] = useState(initialData?.heroImage || null);
  const [mobileHeroImage, setMobileHeroImage] = useState(initialData?.mobileHeroImage || null);
  const [gallery, setGallery] = useState(initialData?.gallery || []);

  // Features list: [{ title, description, icon }]
  const [features, setFeatures] = useState(initialData?.features || []);
  
  // Specifications list: [{ key, value }]
  const [specifications, setSpecifications] = useState(initialData?.specifications || []);

  // Applications list: [{ title, description, image }]
  const [applications, setApplications] = useState(initialData?.applications || []);

  // Benefits list: [String]
  const [benefits, setBenefits] = useState(initialData?.benefits || []);

  // FAQs list: [{ question, answer }]
  const [faqs, setFaqs] = useState(initialData?.faqs || []);

  // SEO details
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description || '');
  const [seoCanonical, setSeoCanonical] = useState(initialData?.seo?.canonical || '');
  const [seoOgTitle, setSeoOgTitle] = useState(initialData?.seo?.ogTitle || '');
  const [seoOgDescription, setSeoOgDescription] = useState(initialData?.seo?.ogDescription || '');
  const [seoOgImage, setSeoOgImage] = useState(initialData?.seo?.ogImage || null);
  const [seoNoIndex, setSeoNoIndex] = useState(initialData?.seo?.noIndex || false);
  const [seoNoFollow, setSeoNoFollow] = useState(initialData?.seo?.noFollow || false);

  // Auto-generate slug from name in real-time if not in edit mode
  useEffect(() => {
    if (!isEdit && name) {
      const generated = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generated);
    }
  }, [name, isEdit]);

  // Handle Media selections
  const handleMediaSelect = (asset) => {
    if (mediaTarget === 'hero') {
      setHeroImage(asset);
    } else if (mediaTarget === 'mobileHero') {
      setMobileHeroImage(asset);
    } else if (mediaTarget === 'ogImage') {
      setSeoOgImage(asset);
    } else if (mediaTarget === 'gallery') {
      if (!gallery.some((g) => g._id === asset._id)) {
        setGallery([...gallery, asset]);
      }
    } else if (mediaTarget === 'application') {
      const updated = [...applications];
      updated[appIndexTarget].image = asset;
      setApplications(updated);
    }
    setMediaPickerOpen(false);
  };

  const removeGalleryImage = (index) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  // Dynamic Array Handlers
  const addFeature = () => setFeatures([...features, { title: '', description: '', icon: 'Settings' }]);
  const removeFeature = (index) => setFeatures(features.filter((_, i) => i !== index));
  const updateFeature = (index, field, value) => {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  };

  const addSpecification = () => setSpecifications([...specifications, { key: '', value: '' }]);
  const removeSpecification = (index) => setSpecifications(specifications.filter((_, i) => i !== index));
  const updateSpecification = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const addApplication = () => setApplications([...applications, { title: '', description: '', image: null }]);
  const removeApplication = (index) => setApplications(applications.filter((_, i) => i !== index));
  const updateApplication = (index, field, value) => {
    const updated = [...applications];
    updated[index][field] = value;
    setApplications(updated);
  };

  const addBenefit = () => setBenefits([...benefits, '']);
  const removeBenefit = (index) => setBenefits(benefits.filter((_, i) => i !== index));
  const updateBenefit = (index, value) => {
    const updated = [...benefits];
    updated[index] = value;
    setBenefits(updated);
  };

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !slug) {
      alert('Name and Slug are required.');
      return;
    }

    setLoading(true);
    const payload = {
      name,
      slug,
      productCode,
      shortDescription,
      longDescription,
      status,
      sortOrder: parseInt(sortOrder || '0'),
      heroImage: heroImage?._id || null,
      mobileHeroImage: mobileHeroImage?._id || null,
      gallery: gallery.map((g) => g._id),
      features,
      specifications,
      applications: applications.map((app) => ({
        title: app.title,
        description: app.description,
        image: app.image?._id || null,
      })),
      benefits: benefits.filter((b) => b.trim() !== ''),
      faqs,
      seo: {
        title: seoTitle || name,
        description: seoDescription || shortDescription,
        canonical: seoCanonical,
        ogTitle: seoOgTitle || seoTitle || name,
        ogDescription: seoOgDescription || seoDescription || shortDescription,
        ogImage: seoOgImage?._id || heroImage?._id || null,
        noIndex: seoNoIndex,
        noFollow: seoNoFollow,
      },
    };

    try {
      const url = isEdit ? `/admin/products/${id}` : '/admin/products';
      const res = isEdit ? await api.patch(url, payload) : await api.post(url, payload);

      if (res.data.success) {
        alert(isEdit ? 'Product updated successfully.' : 'Product created successfully.');
        navigate('/admin/products');
      } else {
        alert(res.data.error || 'Failed to save product details.');
      }
    } catch (err) {
      console.error('Save product failed:', err);
      alert(err.response?.data?.error || 'Save operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const seoTitleWarning = seoTitle.length > 60;
  const seoDescWarning = seoDescription.length > 160;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans text-left">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white font-serif">
              {isEdit ? `Edit Product: ${name}` : 'Create New Product'}
            </h1>
            <p className="text-xs text-zinc-400">Configure parameters, specifications, dynamic modules, and metadata.</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-800 text-sm">
        {['basic', 'media', 'specs', 'faqs', 'seo'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-semibold border-b-2 capitalize transition-all ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-400 bg-zinc-900/45'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/10'
            }`}
          >
            {tab === 'specs' ? 'Specs & Features' : tab === 'faqs' ? 'Applications & FAQs' : tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        
        {/* PANEL 1: BASIC INFO */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elisa Green"
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans font-sans">Slug URL *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. elisa-green"
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
                />
                <p className="text-[10px] text-zinc-500 mt-1">This forms the SEO URL slug: /products/your-slug</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans">Product Model/Code</label>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="e.g. ELG-MR-01"
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans font-sans">Short Description (Summary)</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Summarize the product for listing cards..."
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans font-sans">Long Description (Overview)</label>
                <textarea
                  rows={4}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Provide deep overview and narrative copy about construction..."
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: MEDIA ASSIGNMENT */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Desktop Hero Image */}
              <div className="bg-zinc-800/40 p-4 border border-zinc-850 rounded-lg">
                <label className="block text-xs font-semibold text-zinc-300 mb-3 font-sans">Desktop Hero Image</label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-40 rounded border border-zinc-700 overflow-hidden flex items-center justify-center bg-zinc-950">
                    {heroImage ? (
                      <img src={heroImage.url} alt="Hero" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="text-zinc-600 h-8 w-8" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget('hero');
                        setMediaPickerOpen(true);
                      }}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-medium border border-zinc-750 transition-colors"
                    >
                      Select Image
                    </button>
                    {heroImage && (
                      <button
                        type="button"
                        onClick={() => setHeroImage(null)}
                        className="text-[10px] text-red-400 hover:underline text-left font-sans"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Hero Image */}
              <div className="bg-zinc-800/40 p-4 border border-zinc-855 rounded-lg">
                <label className="block text-xs font-semibold text-zinc-300 mb-3 font-sans">Mobile Hero Image</label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-20 rounded border border-zinc-700 overflow-hidden flex items-center justify-center bg-zinc-950">
                    {mobileHeroImage ? (
                      <img src={mobileHeroImage.url} alt="Mobile Hero" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="text-zinc-600 h-8 w-8" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget('mobileHero');
                        setMediaPickerOpen(true);
                      }}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-medium border border-zinc-750 transition-colors"
                    >
                      Select Image
                    </button>
                    {mobileHeroImage && (
                      <button
                        type="button"
                        onClick={() => setMobileHeroImage(null)}
                        className="text-[10px] text-red-400 hover:underline text-left font-sans"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="bg-zinc-800/20 p-4 border border-zinc-850 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-white font-sans">Product Gallery</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Showcase textures, close-ups, veneers, and sheets.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget('gallery');
                    setMediaPickerOpen(true);
                  }}
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                >
                  <Plus size={12} /> Add Images
                </button>
              </div>

              {gallery.length === 0 ? (
                <div className="border border-dashed border-zinc-850 rounded-lg p-8 text-center text-xs text-zinc-650">
                  No gallery images added yet. Click Add Images to open the media manager.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {gallery.map((img, index) => (
                    <div key={img._id} className="relative aspect-square border border-zinc-850 bg-zinc-950 rounded-lg group overflow-hidden">
                      <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-red-400 hover:text-red-300 rounded border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 3: FEATURES & SPECS */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            {/* Features Array */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <div>
                  <h4 className="text-sm font-semibold text-white font-sans">Product Features</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Define bullet highlights (e.g. Termite proof, E1 Standard) with icons.</p>
                </div>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-emerald-400 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                >
                  <Plus size={12} /> Add Feature
                </button>
              </div>

              {features.length === 0 ? (
                <div className="border border-dashed border-zinc-850 p-6 rounded-lg text-center text-xs text-zinc-650">
                  No features configured. Add features to showcase key characteristics.
                </div>
              ) : (
                <div className="space-y-3">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3 bg-zinc-855 p-3 rounded-lg border border-zinc-800">
                      <div className="w-24">
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Icon Name</label>
                        <input
                          type="text"
                          value={feature.icon}
                          onChange={(e) => updateFeature(idx, 'icon', e.target.value)}
                          placeholder="Leaf, Shield"
                          className="w-full rounded bg-zinc-805 border border-zinc-700 px-2 py-1 text-xs text-white"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                          placeholder="Feature Title (e.g. Glue Line Protection)"
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-semibold"
                        />
                        <input
                          type="text"
                          value={feature.description}
                          onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                          placeholder="Feature description summary..."
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications Array */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <div>
                  <h4 className="text-sm font-semibold text-white font-sans">Technical Specifications Table</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Configure property keys and values dynamically (e.g. Density | 720 kg/m³).</p>
                </div>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-emerald-400 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                >
                  <Plus size={12} /> Add Spec
                </button>
              </div>

              {specifications.length === 0 ? (
                <div className="border border-dashed border-zinc-850 p-6 rounded-lg text-center text-xs text-zinc-650">
                  No specs configured. Setup table entries for technical transparency.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 bg-zinc-850/30 p-2.5 rounded border border-zinc-800/80 items-center">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => updateSpecification(idx, 'key', e.target.value)}
                        placeholder="Key (e.g. Thickness)"
                        className="flex-1 rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-xs text-white font-medium"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpecification(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. 19mm)"
                        className="flex-1 rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecification(idx)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Benefits Array */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <div>
                  <h4 className="text-sm font-semibold text-white font-sans">Key Benefits List</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">List bullet points representing advantages.</p>
                </div>
                <button
                  type="button"
                  onClick={addBenefit}
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-emerald-400 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                >
                  <Plus size={12} /> Add Benefit
                </button>
              </div>

              {benefits.length === 0 ? (
                <div className="border border-dashed border-zinc-850 p-6 rounded-lg text-center text-xs text-zinc-650">
                  No benefits listed yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-zinc-500 text-xs font-bold font-mono">{idx + 1}.</span>
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => updateBenefit(idx, e.target.value)}
                        placeholder="e.g. Uniform thickness ensures perfect calibration on panel works"
                        className="flex-1 rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeBenefit(idx)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 4: APPLICATIONS & FAQS */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            {/* Applications List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <div>
                  <h4 className="text-sm font-semibold text-white font-sans">Applications / Where it belongs</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Link suggested space uses with visual elements.</p>
                </div>
                <button
                  type="button"
                  onClick={addApplication}
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-emerald-400 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                >
                  <Plus size={12} /> Add Space
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="border border-dashed border-zinc-850 p-6 rounded-lg text-center text-xs text-zinc-650">
                  No applications added. Configure where this plywood can be used.
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4 bg-zinc-850/30 p-4 border border-zinc-800 rounded-lg">
                      <div className="flex flex-col items-center justify-center border border-zinc-700 rounded bg-zinc-900 h-24 w-28 overflow-hidden flex-shrink-0 relative group">
                        {app.image ? (
                          <>
                            <img src={app.image.url} alt="App Image" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...applications];
                                updated[idx].image = null;
                                setApplications(updated);
                              }}
                              className="absolute top-1 right-1 p-1 bg-black/70 rounded text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={10} />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setMediaTarget('application');
                              setAppIndexTarget(idx);
                              setMediaPickerOpen(true);
                            }}
                            className="flex flex-col items-center text-zinc-500 hover:text-zinc-300 p-2 text-center"
                          >
                            <ImageIcon size={20} className="mb-1" />
                            <span className="text-[9px] font-semibold uppercase font-sans">Add Pic</span>
                          </button>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={app.title}
                          onChange={(e) => updateApplication(idx, 'title', e.target.value)}
                          placeholder="e.g. Modular Kitchen Structures"
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-semibold animate-none"
                        />
                        <textarea
                          rows={2}
                          value={app.description}
                          onChange={(e) => updateApplication(idx, 'description', e.target.value)}
                          placeholder="Describe the application suitability..."
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white resize-none"
                        />
                      </div>

                      <div className="flex justify-end items-end sm:items-center">
                        <button
                          type="button"
                          onClick={() => removeApplication(idx)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FAQs Accordion Builder */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <div>
                  <h4 className="text-sm font-semibold text-white font-sans">Product FAQs Accordion</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Build FAQ blocks that will render on this specific product page.</p>
                </div>
                <button
                  type="button"
                  onClick={addFaq}
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-emerald-400 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                >
                  <Plus size={12} /> Add FAQ
                </button>
              </div>

              {faqs.length === 0 ? (
                <div className="border border-dashed border-zinc-850 p-6 rounded-lg text-center text-xs text-zinc-650">
                  No FAQs set for this product.
                </div>
              ) : (
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-zinc-850/50 p-3 rounded-lg border border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center gap-3">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                          placeholder="Question (e.g. Is it waterproof?)"
                          className="flex-1 rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                        placeholder="Provide details..."
                        className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 5: SEO METADATA */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2 font-sans">Custom SEO Tags</h4>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-zinc-300 font-sans">SEO Title</label>
                    <span className={`text-[9px] ${seoTitleWarning ? 'text-red-400 font-bold' : 'text-zinc-500'}`}>
                      {seoTitle.length} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. Premium BWP Plywood | Elisa Green"
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-zinc-300 font-sans">Meta Description</label>
                    <span className={`text-[9px] ${seoDescWarning ? 'text-red-400 font-bold' : 'text-zinc-500'}`}>
                      {seoDescription.length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Provide keywords-optimized meta description summary..."
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 font-sans">Canonical URL</label>
                  <input
                    type="text"
                    value={seoCanonical}
                    onChange={(e) => setSeoCanonical(e.target.value)}
                    placeholder="e.g. https://elisadecor.com/products/elisa-green"
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
                  />
                </div>

                <div className="bg-zinc-800/40 p-4 border border-zinc-850 rounded-lg">
                  <label className="block text-xs font-semibold text-zinc-300 mb-3 font-sans">Custom Social OG Image</label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-32 rounded border border-zinc-700 overflow-hidden flex items-center justify-center bg-zinc-950">
                      {seoOgImage ? (
                        <img src={seoOgImage.url} alt="OG" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="text-zinc-650 h-6 w-6" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTarget('ogImage');
                          setMediaPickerOpen(true);
                        }}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-semibold border border-zinc-700 transition-colors"
                      >
                        Select OG Image
                      </button>
                      {seoOgImage && (
                        <button
                          type="button"
                          onClick={() => setSeoOgImage(null)}
                          className="text-[9px] text-red-400 hover:underline text-left font-sans animate-none"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 pt-2 font-sans">
                  <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seoNoIndex}
                      onChange={(e) => setSeoNoIndex(e.target.checked)}
                      className="rounded bg-zinc-800 border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    noindex (Exclude search result)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seoNoFollow}
                      onChange={(e) => setSeoNoFollow(e.target.checked)}
                      className="rounded bg-zinc-800 border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    nofollow (Don't follow links)
                  </label>
                </div>
              </div>

              {/* SEO PREVIEW PANEL */}
              <div className="space-y-6">
                <h4 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2 font-sans">SEO Previews</h4>

                {/* Google Snippet */}
                <div className="bg-zinc-950 p-5 rounded-lg border border-zinc-850 space-y-2">
                  <div className="flex items-center gap-1.5 text-zinc-550 text-[10px] font-bold tracking-wide uppercase font-sans">
                    <span>Google Search Result</span>
                    <Sparkles size={10} className="text-emerald-500" />
                  </div>
                  <div className="font-sans space-y-1 mt-1 text-left">
                    <span className="text-[11px] text-zinc-400 block truncate font-mono">
                      https://elisadecor.com › products › {slug || 'elisa-green'}
                    </span>
                    <span className="text-base text-blue-400 hover:underline font-medium block leading-snug font-serif">
                      {seoTitle || name || 'Product Title | Elisa Decor'}
                    </span>
                    <p className="text-[12px] text-zinc-350 leading-relaxed break-words">
                      {seoDescription ||
                        shortDescription ||
                        'No description entered yet. Add one to see how it looks here.'}
                    </p>
                  </div>
                </div>

                {/* Social share preview */}
                <div className="bg-zinc-950 rounded-lg border border-zinc-850 overflow-hidden text-left font-sans">
                  <div className="px-4 py-2 border-b border-zinc-850 text-zinc-500 text-[10px] font-semibold uppercase tracking-wider font-sans">
                    Social Card Share Preview
                  </div>
                  <div className="bg-zinc-900 border-b border-zinc-850 aspect-[1.91/1] flex items-center justify-center overflow-hidden">
                    {seoOgImage ? (
                      <img src={seoOgImage.url} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : heroImage ? (
                      <img src={heroImage.url} alt="OG Preview fallback" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-zinc-700 h-10 w-10" />
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-sans">
                      ELISADECOR.COM
                    </span>
                    <span className="text-sm font-semibold text-white block truncate leading-tight font-serif">
                      {seoOgTitle || seoTitle || name || 'Elisa Decor Plywood'}
                    </span>
                    <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2">
                      {seoOgDescription || seoDescription || shortDescription || 'Premium structural wood.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaTarget(null);
        }}
        onSelect={handleMediaSelect}
        title={
          mediaTarget === 'hero'
            ? 'Select Desktop Hero Image'
            : mediaTarget === 'mobileHero'
            ? 'Select Mobile Hero Image'
            : mediaTarget === 'ogImage'
            ? 'Select Social OG Share Image'
            : mediaTarget === 'gallery'
            ? 'Select Image for Gallery'
            : 'Select Application Image'
        }
      />
    </form>
  );
}
