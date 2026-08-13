import { useState, useEffect } from 'react';
import {
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import MediaPickerModal from '../components/MediaPickerModal';
import api from '../../api/axios';
import SEO from '../../components/SEO';

export default function AdminHomepage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homepage, setHomepage] = useState(null);
  
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null); // { sectionIdx, field, subIndex }
  const [activeSectionIdx, setActiveSectionIdx] = useState(null);

  const fetchHomepage = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/homepage');
      if (res.data?.homepage) {
        const sorted = res.data.homepage.sections.sort((a, b) => a.order - b.order);
        setHomepage({ ...res.data.homepage, sections: sorted });
        if (sorted.length > 0) setActiveSectionIdx(0);
      }
    } catch (err) {
      console.error('Fetch homepage failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepage();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const reordered = homepage.sections.map((sec, idx) => ({
        ...sec,
        order: idx + 1,
      }));

      const res = await api.patch('/admin/homepage', {
        sections: reordered,
        seo: homepage.seo,
      });

      if (res.data.success) {
        alert('Homepage configuration saved successfully!');
        fetchHomepage();
      } else {
        alert(res.data.error || 'Failed to save settings.');
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('Save operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (idx) => {
    const updated = [...homepage.sections];
    updated[idx].enabled = !updated[idx].enabled;
    setHomepage({ ...homepage, sections: updated });
  };

  const moveSection = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === homepage.sections.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...homepage.sections];
    
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    setHomepage({ ...homepage, sections: updated });
    setActiveSectionIdx(targetIdx);
  };

  const openMediaPicker = (sectionIdx, field, subIndex = null) => {
    setMediaTarget({ sectionIdx, field, subIndex });
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (asset) => {
    if (!mediaTarget) return;
    const { sectionIdx, field, subIndex } = mediaTarget;
    const updated = [...homepage.sections];
    const section = updated[sectionIdx];

    if (subIndex !== null) {
      section.content[field][subIndex].image = asset.url;
    } else {
      section.content[field] = asset.url;
    }

    setHomepage({ ...homepage, sections: updated });
    setMediaPickerOpen(false);
  };

  const updateSectionField = (sectionIdx, field, val) => {
    const updated = [...homepage.sections];
    updated[sectionIdx].content[field] = val;
    setHomepage({ ...homepage, sections: updated });
  };

  const updateArrayItem = (sectionIdx, field, subIdx, key, val) => {
    const updated = [...homepage.sections];
    updated[sectionIdx].content[field][subIdx][key] = val;
    setHomepage({ ...homepage, sections: updated });
  };

  const removeArrayItem = (sectionIdx, field, subIdx) => {
    const updated = [...homepage.sections];
    updated[sectionIdx].content[field] = updated[sectionIdx].content[field].filter((_, i) => i !== subIdx);
    setHomepage({ ...homepage, sections: updated });
  };

  const addArrayItem = (sectionIdx, field, itemTemplate) => {
    const updated = [...homepage.sections];
    updated[sectionIdx].content[field] = [...updated[sectionIdx].content[field], itemTemplate];
    setHomepage({ ...homepage, sections: updated });
  };

  const activeSection = activeSectionIdx !== null ? homepage?.sections[activeSectionIdx] : null;

  return (
    <div className="space-y-6 font-sans text-left">
      <SEO title="Homepage Builder | Elisa Decor Admin" noIndex={true} />
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif">Homepage Builder</h1>
          <p className="text-sm text-zinc-400 mt-1">Configure layout order, content text blocks, and visuals.</p>
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
          {saving ? 'Saving Layout...' : 'Save Settings'}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-zinc-400 text-sm">Loading layout configuration...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Sections List & Reordering */}
          <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white mb-2 font-serif">Sections Order & Visibility</h3>
            <div className="space-y-2">
              {homepage.sections.map((section, idx) => (
                <div
                  key={section.type}
                  onClick={() => setActiveSectionIdx(idx)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    activeSectionIdx === idx
                      ? 'bg-zinc-800 border-emerald-500/50 text-white'
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(idx);
                      }}
                      className={`p-1 rounded hover:bg-zinc-700 transition-colors ${
                        section.enabled ? 'text-emerald-400' : 'text-zinc-600'
                      }`}
                      title={section.enabled ? 'Disable Section' : 'Enable Section'}
                    >
                      {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <span className="font-bold text-xs uppercase tracking-wider bg-zinc-950 px-2 py-0.5 rounded text-zinc-400 font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold">{section.type}</span>
                  </div>

                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => moveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(idx, 'down')}
                      disabled={idx === homepage.sections.length - 1}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 mt-4 space-y-3">
              <h4 className="text-sm font-semibold text-white font-serif">Homepage SEO Metadata</h4>
              <div>
                <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">SEO Title</label>
                <input
                  type="text"
                  value={homepage.seo?.title || ''}
                  onChange={(e) => setHomepage({ ...homepage, seo: { ...homepage.seo, title: e.target.value } })}
                  placeholder="SEO Title"
                  className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Meta Description</label>
                <textarea
                  rows={2}
                  value={homepage.seo?.description || ''}
                  onChange={(e) => setHomepage({ ...homepage, seo: { ...homepage.seo, description: e.target.value } })}
                  placeholder="Meta Description"
                  className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white resize-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Active Section Content Editor */}
          <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            {activeSection ? (
              <div className="space-y-6">
                <div className="border-b border-zinc-805 pb-3">
                  <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                    <Edit2 size={16} className="text-emerald-500" />
                    Configure: {activeSection.type} Section
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Customize content parameters for rendering.</p>
                </div>

                {/* 1. HERO SECTION */}
                {activeSection.type === 'Hero' && (
                  <div className="space-y-6">
                    {activeSection.content.slides?.map((slide, slideIdx) => (
                      <div key={slideIdx} className="bg-zinc-850/50 p-4 border border-zinc-800 rounded-lg space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                          <span className="text-xs font-bold text-zinc-400">Slide {slideIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem(activeSectionIdx, 'slides', slideIdx)}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                          >
                            <Trash2 size={12} /> Remove Slide
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
                            <input
                              type="text"
                              value={slide.eyebrow || ''}
                              onChange={(e) => updateArrayItem(activeSectionIdx, 'slides', slideIdx, 'eyebrow', e.target.value)}
                              className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Title</label>
                            <input
                              type="text"
                              value={slide.title || ''}
                              onChange={(e) => updateArrayItem(activeSectionIdx, 'slides', slideIdx, 'title', e.target.value)}
                              className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Subtitle</label>
                          <input
                            type="text"
                            value={slide.subtitle || ''}
                            onChange={(e) => updateArrayItem(activeSectionIdx, 'slides', slideIdx, 'subtitle', e.target.value)}
                            className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Description</label>
                          <textarea
                            rows={2}
                            value={slide.description || ''}
                            onChange={(e) => updateArrayItem(activeSectionIdx, 'slides', slideIdx, 'description', e.target.value)}
                            className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">CTA Text</label>
                            <input
                              type="text"
                              value={slide.ctaText1 || ''}
                              onChange={(e) => updateArrayItem(activeSectionIdx, 'slides', slideIdx, 'ctaText1', e.target.value)}
                              className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">CTA Link</label>
                            <input
                              type="text"
                              value={slide.ctaUrl1 || ''}
                              onChange={(e) => updateArrayItem(activeSectionIdx, 'slides', slideIdx, 'ctaUrl1', e.target.value)}
                              className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-zinc-900 p-3 rounded border border-zinc-800 flex items-center justify-between">
                            <span className="text-[10px] text-zinc-400 font-medium">Desktop Image</span>
                            <button
                              type="button"
                              onClick={() => openMediaPicker(activeSectionIdx, 'slides', slideIdx)}
                              className="p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-semibold border border-zinc-750 transition-colors"
                            >
                              Choose
                            </button>
                          </div>
                          <div className="text-[9px] text-zinc-500 font-mono flex items-center truncate break-all">
                            {slide.image || 'No image linked'}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem(activeSectionIdx, 'slides', { title: 'New Slide', subtitle: '', eyebrow: 'ELISA DECOR', description: '', image: '', ctaText1: 'Explore', ctaUrl1: '/' })}
                      className="w-full flex items-center justify-center gap-1 py-2 bg-zinc-805 hover:bg-zinc-750 border border-zinc-700 rounded-lg text-xs font-semibold text-zinc-350 hover:text-white transition-colors"
                    >
                      <Plus size={12} /> Add Hero Slide
                    </button>
                  </div>
                )}

                {/* 2. ABOUT SECTION */}
                {activeSection.type === 'About' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
                        <input
                          type="text"
                          value={activeSection.content.eyebrow || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'eyebrow', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Heading</label>
                        <input
                          type="text"
                          value={activeSection.content.heading || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'heading', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Paragraph 1</label>
                      <textarea
                        rows={3}
                        value={activeSection.content.description1 || ''}
                        onChange={(e) => updateSectionField(activeSectionIdx, 'description1', e.target.value)}
                        className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Paragraph 2</label>
                      <textarea
                        rows={3}
                        value={activeSection.content.description2 || ''}
                        onChange={(e) => updateSectionField(activeSectionIdx, 'description2', e.target.value)}
                        className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">CTA Label</label>
                        <input
                          type="text"
                          value={activeSection.content.ctaText || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'ctaText', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">CTA Link</label>
                        <input
                          type="text"
                          value={activeSection.content.ctaUrl || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'ctaUrl', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Left Image (Asymmetric Tall)</label>
                        <div className="bg-zinc-850/50 p-3 rounded border border-zinc-800 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => openMediaPicker(activeSectionIdx, 'imageLeft')}
                            className="p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-semibold border border-zinc-750 transition-colors"
                          >
                            Choose Left
                          </button>
                          <span className="text-[9px] text-zinc-500 font-mono truncate max-w-[120px]">
                            {activeSection.content.imageLeft ? 'Linked' : 'No image'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Right Image (Asymmetric Wide)</label>
                        <div className="bg-zinc-850/50 p-3 rounded border border-zinc-800 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => openMediaPicker(activeSectionIdx, 'imageRight')}
                            className="p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-semibold border border-zinc-750 transition-colors"
                          >
                            Choose Right
                          </button>
                          <span className="text-[9px] text-zinc-500 font-mono truncate max-w-[120px]">
                            {activeSection.content.imageRight ? 'Linked' : 'No image'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. PRODUCTS SECTION */}
                {activeSection.type === 'Products' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
                      <input
                        type="text"
                        value={activeSection.content.eyebrow || ''}
                        onChange={(e) => updateSectionField(activeSectionIdx, 'eyebrow', e.target.value)}
                        className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Heading</label>
                      <input
                        type="text"
                        value={activeSection.content.heading || ''}
                        onChange={(e) => updateSectionField(activeSectionIdx, 'heading', e.target.value)}
                        className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-semibold"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 bg-zinc-800/40 p-3 rounded border border-zinc-800">
                      Note: The products listed in this section dynamically load from the Products database. Setup catalog sheets under Products tab.
                    </p>
                  </div>
                )}

                {/* 4. WHY CHOOSE US SECTION */}
                {activeSection.type === 'WhyChooseUs' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
                        <input
                          type="text"
                          value={activeSection.content.eyebrow || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'eyebrow', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Heading</label>
                        <input
                          type="text"
                          value={activeSection.content.heading || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'heading', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-zinc-300">USP Items</label>
                      {activeSection.content.items?.map((item, idx) => (
                        <div key={idx} className="bg-zinc-850/50 p-3 border border-zinc-800 rounded-lg space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1">
                              <label className="block text-[9px] text-zinc-500 mb-0.5">Icon (Lucide)</label>
                              <input
                                type="text"
                                value={item.icon || ''}
                                onChange={(e) => updateArrayItem(activeSectionIdx, 'items', idx, 'icon', e.target.value)}
                                className="w-full rounded bg-zinc-805 border border-zinc-700 px-2 py-1 text-xs text-white"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[9px] text-zinc-500 mb-0.5">Title</label>
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => updateArrayItem(activeSectionIdx, 'items', idx, 'title', e.target.value)}
                                className="w-full rounded bg-zinc-805 border border-zinc-700 px-2 py-1 text-xs text-white font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] text-zinc-500 mb-0.5">Description</label>
                            <input
                              type="text"
                              value={item.description || ''}
                              onChange={(e) => updateArrayItem(activeSectionIdx, 'items', idx, 'description', e.target.value)}
                              className="w-full rounded bg-zinc-805 border border-zinc-700 px-2 py-1 text-xs text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. APPLICATIONS SECTION */}
                {activeSection.type === 'Applications' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
                        <input
                          type="text"
                          value={activeSection.content.eyebrow || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'eyebrow', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Heading</label>
                        <input
                          type="text"
                          value={activeSection.content.heading || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'heading', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-zinc-805 pb-1">
                        <label className="block text-xs font-semibold text-zinc-300">Application Items</label>
                        <button
                          type="button"
                          onClick={() => addArrayItem(activeSectionIdx, 'items', { title: 'New Application', category: 'General', image: '' })}
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Plus size={10} /> Add Item
                        </button>
                      </div>

                      {activeSection.content.items?.map((item, idx) => (
                        <div key={idx} className="bg-zinc-850/50 p-3 border border-zinc-800 rounded-lg flex flex-col sm:flex-row gap-3">
                          <div className="w-20 h-16 bg-zinc-900 border border-zinc-750 flex items-center justify-center rounded overflow-hidden flex-shrink-0 cursor-pointer relative group">
                            {item.image ? (
                              <>
                                <img src={item.image} alt="app" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => updateArrayItem(activeSectionIdx, 'items', idx, 'image', '')}
                                  className="absolute top-0.5 right-0.5 p-0.5 bg-black/75 rounded text-red-400 opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openMediaPicker(activeSectionIdx, 'items', idx)}
                                className="flex flex-col items-center text-zinc-500 hover:text-zinc-300"
                              >
                                <ImageIcon size={16} />
                                <span className="text-[8px] font-semibold tracking-wider font-sans">SELECT</span>
                              </button>
                            )}
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => updateArrayItem(activeSectionIdx, 'items', idx, 'title', e.target.value)}
                                placeholder="Space Title"
                                className="w-full rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-xs text-white font-semibold"
                              />
                              <input
                                type="text"
                                value={item.category || ''}
                                onChange={(e) => updateArrayItem(activeSectionIdx, 'items', idx, 'category', e.target.value)}
                                placeholder="Category/Zone"
                                className="w-full rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => removeArrayItem(activeSectionIdx, 'items', idx)}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. TIMELINE PROCESS SECTION */}
                {activeSection.type === 'Process' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
                        <input
                          type="text"
                          value={activeSection.content.eyebrow || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'eyebrow', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Heading</label>
                        <input
                          type="text"
                          value={activeSection.content.heading || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'heading', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-zinc-300">Process Steps</label>
                      {activeSection.content.steps?.map((step, idx) => (
                        <div key={idx} className="bg-zinc-850/50 p-3 border border-zinc-800 rounded-lg space-y-2">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={step.number || ''}
                              onChange={(e) => updateArrayItem(activeSectionIdx, 'steps', idx, 'number', e.target.value)}
                              placeholder="01"
                              className="w-12 text-center rounded bg-zinc-805 border border-zinc-700 px-2 py-1 text-xs text-white font-bold"
                            />
                            <input
                              type="text"
                              value={step.title || ''}
                              onChange={(e) => updateArrayItem(activeSectionIdx, 'steps', idx, 'title', e.target.value)}
                              placeholder="Step Title"
                              className="flex-1 rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-xs text-white font-semibold"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={step.description || ''}
                            onChange={(e) => updateArrayItem(activeSectionIdx, 'steps', idx, 'description', e.target.value)}
                            placeholder="Step details..."
                            className="w-full rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-xs text-white resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. FAQ SECTION */}
                {activeSection.type === 'FAQ' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
                        <input
                          type="text"
                          value={activeSection.content.eyebrow || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'eyebrow', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Heading</label>
                        <input
                          type="text"
                          value={activeSection.content.heading || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'heading', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-zinc-805 pb-1">
                        <label className="block text-xs font-semibold text-zinc-300">FAQ List Accordion</label>
                        <button
                          type="button"
                          onClick={() => addArrayItem(activeSectionIdx, 'faqItems', { question: 'New Question', answer: 'Provide details.' })}
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Plus size={10} /> Add Q&A
                        </button>
                      </div>

                      {activeSection.content.faqItems?.map((faq, idx) => (
                        <div key={idx} className="bg-zinc-850/50 p-3 border border-zinc-800 rounded-lg space-y-2">
                          <div className="flex gap-2 items-center justify-between">
                            <input
                              type="text"
                              value={faq.question || ''}
                              onChange={(e) => updateArrayItem(activeSectionIdx, 'faqItems', idx, 'question', e.target.value)}
                              placeholder="Question"
                              className="flex-1 rounded bg-zinc-805 border border-zinc-700 px-2.5 py-1 text-xs text-white font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem(activeSectionIdx, 'faqItems', idx)}
                              className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={faq.answer || ''}
                            onChange={(e) => updateArrayItem(activeSectionIdx, 'faqItems', idx, 'answer', e.target.value)}
                            placeholder="Answer details..."
                            className="w-full rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-xs text-white resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. CTA SECTION */}
                {activeSection.type === 'CTA' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Heading</label>
                      <input
                        type="text"
                        value={activeSection.content.heading || ''}
                        onChange={(e) => updateSectionField(activeSectionIdx, 'heading', e.target.value)}
                        className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Subtitle</label>
                      <input
                        type="text"
                        value={activeSection.content.subtitle || ''}
                        onChange={(e) => updateSectionField(activeSectionIdx, 'subtitle', e.target.value)}
                        className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Primary CTA Label</label>
                        <input
                          type="text"
                          value={activeSection.content.primaryCtaText || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'primaryCtaText', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Primary CTA Link</label>
                        <input
                          type="text"
                          value={activeSection.content.primaryCtaUrl || ''}
                          onChange={(e) => updateSectionField(activeSectionIdx, 'primaryCtaUrl', e.target.value)}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-20 text-zinc-500 text-sm">
                Select a section from the left sidebar to edit its content.
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
