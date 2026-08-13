import { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  X,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/SEO';

export default function AdminMedia({ onSelect, selectMode = false }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  
  const [altText, setAltText] = useState('');
  const [assetTitle, setAssetTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/admin/media?page=${page}&limit=18&search=${encodeURIComponent(
          search
        )}&type=${typeFilter}`
      );
      setMedia(res.data.media || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Fetch media failed:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleTypeFilterChange = (val) => {
    setTypeFilter(val);
    setPage(1);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'elisadecor');

        const res = await api.post('/admin/media', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!res.data.success) {
          alert(`Failed to upload ${file.name}: ${res.data.error}`);
        }
      }
      setPage(1);
      fetchMedia();
    } catch (err) {
      console.error('Upload failed:', err);
      alert(err.response?.data?.error || 'Upload process failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const selectAsset = (asset) => {
    if (selectMode) {
      onSelect(asset);
      return;
    }
    setSelectedAsset(asset);
    setAltText(asset.altText || '');
    setAssetTitle(asset.title || '');
    setCaption(asset.caption || '');
  };

  const handleUpdateMetadata = async () => {
    if (!selectedAsset) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/admin/media/${selectedAsset._id}`, {
        altText,
        title: assetTitle,
        caption,
      });
      if (res.data.success) {
        setMedia(media.map((item) => (item._id === selectedAsset._id ? res.data.media : item)));
        setSelectedAsset(res.data.media);
        alert('Metadata updated successfully.');
      } else {
        alert(res.data.error || 'Failed to update metadata.');
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert(err.response?.data?.error || 'Failed to save changes.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAsset = async () => {
    if (!selectedAsset) return;
    if (!confirm(`Are you sure you want to delete "${selectedAsset.filename}"? This action cannot be undone.`)) return;

    setUpdating(true);
    try {
      const res = await api.delete(`/admin/media/${selectedAsset._id}`);
      if (res.data.success) {
        setSelectedAsset(null);
        fetchMedia();
      } else {
        alert(res.data.error || 'Failed to delete asset.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.error || 'Failed to delete asset.');
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (url, id) => {
    const absoluteUrl = url.startsWith('/') ? window.location.origin + url : url;
    navigator.clipboard.writeText(absoluteUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      <SEO title="Media Library | Elisa Decor Admin" noIndex={true} />
      
      {!selectMode && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif">Media Library</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Upload, optimize, and manage visual assets for pages and products.
          </p>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search assets..."
                value={search}
                onChange={handleSearchChange}
                className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-450 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="flex bg-zinc-805 p-1 rounded-lg border border-zinc-700">
              <button
                onClick={() => handleTypeFilterChange('')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  typeFilter === '' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleTypeFilterChange('image')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  typeFilter === 'image' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => handleTypeFilterChange('document')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  typeFilter === 'document' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Docs
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto flex justify-end">
            <label className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium">
              {uploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Upload size={16} />
              )}
              {uploading ? 'Uploading...' : 'Upload Media'}
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
            <p className="text-zinc-400 text-sm">Loading assets...</p>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
            <Info className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
            <h3 className="text-lg font-medium text-white font-serif">No assets found</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
              Upload images (JPEG, PNG, WebP) or catalog documents (PDFs) to start building your content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((item) => {
              const isImage = item.mimeType?.startsWith('image/');
              return (
                <div
                  key={item._id}
                  onClick={() => selectAsset(item)}
                  className={`group relative aspect-square rounded-lg overflow-hidden border bg-zinc-950 cursor-pointer flex flex-col justify-between ${
                    selectedAsset?._id === item._id
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex-1 flex items-center justify-center overflow-hidden bg-zinc-900">
                    {isImage ? (
                      <img
                        src={item.url}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center p-3 text-center">
                        <FileText size={32} className="text-zinc-500 mb-1" />
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                          {item.mimeType?.split('/')[1] || 'PDF'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="px-2 py-1.5 bg-zinc-900 border-t border-zinc-805 text-[10px] text-zinc-400 truncate w-full">
                    {item.filename}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(item.url, item._id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-black/70 border border-zinc-700 hover:bg-black/90 text-zinc-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy link"
                  >
                    {copiedId === item._id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-800 mt-6 pt-4 text-sm text-zinc-400">
            <div>
              Showing Page <span className="font-medium text-white">{page}</span> of{' '}
              <span className="font-medium text-white">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs transition-colors"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedAsset && !selectMode && (
        <>
          <div
            onClick={() => setSelectedAsset(null)}
            className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-zinc-900 border-l border-zinc-800 p-6 shadow-2xl z-50 overflow-y-auto flex flex-col justify-between text-zinc-200">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                <h3 className="text-lg font-bold text-white font-serif">Asset Details</h3>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 rounded-md text-zinc-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="aspect-video bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-800 mb-4">
                {selectedAsset.mimeType?.startsWith('image/') ? (
                  <img
                    src={selectedAsset.url}
                    alt={selectedAsset.altText}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                    <FileText size={48} className="text-zinc-500 mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {selectedAsset.mimeType}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs border-b border-zinc-800 pb-4 mb-4 text-zinc-400">
                <div>
                  <span className="font-semibold text-zinc-300">File Name:</span>{' '}
                  <span className="break-all">{selectedAsset.filename}</span>
                </div>
                <div>
                  <span className="font-semibold text-zinc-300">Size:</span>{' '}
                  {(selectedAsset.size / 1024).toFixed(1)} KB
                </div>
                {selectedAsset.width && (
                  <div>
                    <span className="font-semibold text-zinc-300">Dimensions:</span>{' '}
                    {selectedAsset.width} × {selectedAsset.height} px
                  </div>
                )}
                <div>
                  <span className="font-semibold text-zinc-300">Uploaded At:</span>{' '}
                  {new Date(selectedAsset.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center justify-between bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 mt-2">
                  <span className="truncate mr-2 font-mono text-[10px]">
                    {selectedAsset.url}
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedAsset.url, 'modal')}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                    title="Copy URL"
                  >
                    {copiedId === 'modal' ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Alt Text (SEO description)
                  </label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="e.g. Elisa Decor BWR plywood panel in modular kitchen cabinet"
                    className="w-full rounded bg-zinc-800 border border-zinc-705 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Describe what the image shows for screen readers and search engines.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={assetTitle}
                    onChange={(e) => setAssetTitle(e.target.value)}
                    placeholder="Image Title"
                    className="w-full rounded bg-zinc-800 border border-zinc-705 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Caption
                  </label>
                  <textarea
                    rows={2}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Image Caption"
                    className="w-full rounded bg-zinc-800 border border-zinc-705 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleUpdateMetadata}
                disabled={updating}
                className="flex-1 flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
              >
                {updating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleDeleteAsset}
                disabled={updating}
                className="flex items-center justify-center border border-red-500/30 text-red-400 hover:bg-red-500/10 p-2 rounded transition-colors disabled:opacity-50"
                title="Delete Asset"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
