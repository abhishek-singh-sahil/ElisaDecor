import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Image as ImageIcon, X, Plus } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/SEO';
import MediaPickerModal from '../components/MediaPickerModal';

export default function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Media Picker control states
  const [pickerTarget, setPickerTarget] = useState(null); // 'coverImage' or 'gallery'
  const [pickerOpen, setPickerOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    coverImage: null,
    gallery: [],
    category: 'KITCHEN', // Default categories
    location: '',
    productsUsed: [],
    status: 'DRAFT',
    sortOrder: 0,
    seo: {
      title: '',
      description: '',
    },
  });

  // Fetch initial products (for checklist selection) & edit details if applicable
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const prodRes = await api.get('/admin/products');
        setProducts(prodRes.data.products || []);

        if (isEdit) {
          const res = await api.get(`/admin/projects/${id}`);
          if (res.data.success && res.data.project) {
            const proj = res.data.project;
            setForm({
              title: proj.title || '',
              slug: proj.slug || '',
              description: proj.description || '',
              coverImage: proj.coverImage || null,
              gallery: proj.gallery || [],
              category: proj.category || 'KITCHEN',
              location: proj.location || '',
              productsUsed: proj.productsUsed ? proj.productsUsed.map((p) => p._id || p) : [],
              status: proj.status || 'DRAFT',
              sortOrder: proj.sortOrder || 0,
              seo: {
                title: proj.seo?.title || '',
                description: proj.seo?.description || '',
              },
            });
          }
        }
      } catch (err) {
        console.error('Failed to load project form requirements:', err);
        setError('Failed to load required options or session context.');
      } finally {
        setFetching(false);
      }
    };
    loadInitialData();
  }, [id, isEdit]);

  // Handle simple input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-slugify on title changes (when creating new)
      if (name === 'title' && !isEdit) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  // Handle nested SEO changes
  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [name]: value,
      },
    }));
  };

  // Toggle products used checklist selection
  const handleProductToggle = (productId) => {
    setForm((prev) => {
      const current = prev.productsUsed;
      const updated = current.includes(productId)
        ? current.filter((pid) => pid !== productId)
        : [...current, productId];
      return { ...prev, productsUsed: updated };
    });
  };

  // Media Picker handlers
  const handleMediaSelect = (media) => {
    if (pickerTarget === 'coverImage') {
      setForm((prev) => ({ ...prev, coverImage: media }));
    } else if (pickerTarget === 'gallery') {
      // Avoid duplicate gallery additions
      setForm((prev) => {
        const alreadyIn = prev.gallery.some((m) => m._id === media._id);
        if (alreadyIn) return prev;
        return { ...prev, gallery: [...prev.gallery, media] };
      });
    }
    setPickerOpen(false);
  };

  const removeCoverImage = () => {
    setForm((prev) => ({ ...prev, coverImage: null }));
  };

  const removeGalleryImage = (mediaId) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((m) => m._id !== mediaId),
    }));
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Prepare payload
    const payload = {
      ...form,
      coverImage: form.coverImage?._id || null,
      gallery: form.gallery.map((m) => m._id),
    };

    try {
      const endpoint = isEdit ? `/admin/projects/${id}` : '/admin/projects';
      const method = isEdit ? 'put' : 'post';
      
      const res = await api[method](endpoint, payload);
      if (res.data.success) {
        navigate('/admin/projects');
      } else {
        setError(res.data.error || 'Failed to submit project details.');
      }
    } catch (err) {
      console.error('Project form submission failure:', err);
      setError(err.response?.data?.error || 'A connection issue occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-zinc-400">
        <Loader2 className="animate-spin text-emerald-500 mr-2" size={24} />
        Fetching project details...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <SEO title={isEdit ? 'Edit Project | Elisa Decor Admin' : 'New Project | Elisa Decor Admin'} noIndex={true} />

      <div className="flex items-center gap-3">
        <Link
          to="/admin/projects"
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">
            {isEdit ? 'Edit Project Showcase' : 'Add Project Showcase'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure metadata, locations, and linked products used in this installation gallery.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-zinc-300">
        {/* Core details */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-serif border-b border-zinc-800 pb-2">
            Project Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Luxury Modular Kitchen in Ahmedabad"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                placeholder="e.g. luxury-kitchen-ahmedabad"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Installation Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="KITCHEN">Kitchen Setting</option>
                <option value="WARDROBE">Wardrobe Setting</option>
                <option value="FURNITURE">Furniture & Console</option>
                <option value="COMMERCIAL">Commercial Lobby/Accents</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Project Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Ranchi, Jharkhand"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Case Study / Summary Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="Describe materials used, veneer highlights, and design specifications..."
            />
          </div>
        </div>

        {/* Media Block */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white font-serif border-b border-zinc-800 pb-2">
            Media Attachments
          </h3>

          {/* Cover image picker */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Cover Image (Landscape Preferred)
            </label>
            {form.coverImage ? (
              <div className="relative w-64 aspect-[16/10] rounded-lg overflow-hidden border border-zinc-800 group bg-zinc-950">
                <img
                  src={form.coverImage.url}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPickerTarget('coverImage');
                  setPickerOpen(true);
                }}
                className="flex flex-col items-center justify-center w-64 aspect-[16/10] rounded-lg border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-950 hover:bg-zinc-950/70 transition-all text-zinc-500 hover:text-zinc-300"
              >
                <ImageIcon size={28} className="mb-2" />
                <span className="text-xs">Pick Cover Image</span>
              </button>
            )}
          </div>

          {/* Gallery image picker */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Gallery Images
            </label>
            <div className="flex flex-wrap gap-4">
              {form.gallery.map((media) => (
                <div key={media._id} className="relative w-32 aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
                  <img
                    src={media.url}
                    alt="gallery-item"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(media._id)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setPickerTarget('gallery');
                  setPickerOpen(true);
                }}
                className="flex flex-col items-center justify-center w-32 aspect-square rounded-lg border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-950 hover:bg-zinc-950/70 transition-all text-zinc-500 hover:text-zinc-300"
              >
                <Plus size={24} className="mb-1" />
                <span className="text-[10px]">Add Photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Linked Products checklist */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-serif border-b border-zinc-800 pb-2">
            Linked Elisa Products
          </h3>
          <p className="text-xs text-zinc-400">
            Select the plywood grades or panel boards that were used in this installation:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {products.map((product) => {
              const isChecked = form.productsUsed.includes(product._id);
              return (
                <label
                  key={product._id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                    isChecked
                      ? 'bg-emerald-600/10 border-emerald-500/40 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleProductToggle(product._id)}
                    className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="text-xs font-semibold">{product.name}</p>
                    <p className="text-[9px] text-zinc-500 font-mono">{product.productCode}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Display Status & Sort Order */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-serif border-b border-zinc-800 pb-2">
            Publish Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Publishing Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="DRAFT">Draft (Internal Only)</option>
                <option value="PUBLISHED">Published (Public Website)</option>
                <option value="ARCHIVED">Archived (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Sort Order (Ascending)
              </label>
              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-serif border-b border-zinc-800 pb-2">
            SEO Fallbacks (Optional)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                SEO Meta Title
              </label>
              <input
                type="text"
                name="title"
                value={form.seo.title}
                onChange={handleSeoChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="Meta title fallback..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                SEO Meta Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={form.seo.description}
                onChange={handleSeoChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="Meta description fallback..."
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors shadow-md disabled:opacity-50"
          >
            {submitting && <Loader2 className="animate-spin" size={16} />}
            {isEdit ? 'Save Project Details' : 'Create Project'}
          </button>
          <Link
            to="/admin/projects"
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleMediaSelect}
        title={pickerTarget === 'coverImage' ? 'Select Cover Photo' : 'Add Photo to Gallery'}
      />
    </div>
  );
}
