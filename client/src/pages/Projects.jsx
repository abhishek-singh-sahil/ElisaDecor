import { useState, useEffect } from 'react';
import { Loader2, FolderKanban } from 'lucide-react';
import api from '../api/axios';
import SEO from '../components/SEO';

export default function Projects() {
  const [filter, setFilter] = useState('ALL');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error('Failed to fetch projects database records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredItems = filter === 'ALL'
    ? projects
    : projects.filter((i) => i.category === filter);

  return (
    <div className="bg-bg-warm min-h-screen pt-[72px] pb-24 fade-in">
      <SEO
        title="Applications Gallery | Real-World Elisa Plywood Work"
        description="See how Elisa Decor calibrated plywood panels form the structural backbone of modular kitchens, wardrobes, offices, and custom furniture."
        canonical="/projects"
      />

      {/* 1. Header Banner */}
      <section className="bg-primary-dark text-white py-16 px-6 md:px-8 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-forest/15 to-primary-dark/40 opacity-20" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-bold tracking-widest text-brass uppercase block">PORTFOLIO</span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
            Applications Gallery
          </h1>
          <p className="text-sm md:text-base text-zinc-350 max-w-xl mx-auto leading-relaxed">
            See how Elisa Decor calibrated plywood panels form the structural backbone of luxury homes, kitchens, and offices.
          </p>
        </div>
      </section>

      {/* 2. Filter Category Buttons */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 flex flex-wrap gap-2 justify-center">
        {[
          { label: 'Show All', val: 'ALL' },
          { label: 'Modular Kitchens', val: 'KITCHEN' },
          { label: 'Wardrobes', val: 'WARDROBE' },
          { label: 'Bespoke Furniture', val: 'FURNITURE' },
          { label: 'Commercial Spaces', val: 'COMMERCIAL' },
        ].map((btn) => (
          <button
            key={btn.val}
            onClick={() => setFilter(btn.val)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border ${
              filter === btn.val
                ? 'bg-forest text-bg-warm border-forest shadow-sm'
                : 'bg-bg-warm text-zinc-650 border-sand hover:border-zinc-550'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 3. Grid showcase */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 className="animate-spin text-accent mr-2" size={24} />
          Loading gallery showcases...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-20 text-zinc-500 space-y-2">
          <FolderKanban className="mx-auto text-zinc-350" size={36} />
          <p className="font-serif text-lg text-primary-dark">No gallery items published</p>
          <p className="text-xs">Check back soon to explore our verified plywood installation showcases.</p>
        </div>
      ) : (
        <section className="max-w-7xl mx-auto px-6 md:px-8 pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group bg-bg-warm border border-sand/60 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[4/3] bg-zinc-200 overflow-hidden relative">
                {item.coverImage ? (
                  <img
                    src={item.coverImage.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-350"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-100 text-xs">
                    No image uploaded
                  </div>
                )}
                <span className="absolute top-4 left-4 text-[9px] font-bold font-mono tracking-widest bg-primary-dark/80 text-brass px-3 py-1 rounded uppercase">
                  {item.category || 'GENERAL'}
                </span>
              </div>
              
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-serif text-primary-dark leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-4">
                    {item.description}
                  </p>
                </div>
                {item.location && (
                  <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase pt-2">
                    Location: {item.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
