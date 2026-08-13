import { useState } from 'react';
import SEO from '../components/SEO';

export default function Projects() {
  const [filter, setFilter] = useState('ALL');

  const galleryItems = [
    {
      title: 'Premium Modular Kitchen',
      category: 'KITCHEN',
      img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
      description: 'Elisa Club 710 marine grade plywood structure, laminated with high-gloss acrylic veneer. Waterproof protection under sink cabinet environments.',
    },
    {
      title: 'Luxury Walk-in Wardrobe',
      category: 'WARDROBE',
      img: 'https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=600&q=80',
      description: 'Wardrobe carcass built using Elisa Green BWR calibrated boards, finished with warm wood veneer paneling.',
    },
    {
      title: 'Bespoke Living Room Console',
      category: 'FURNITURE',
      img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
      description: 'Sleek entertainment console engineered with zero-gap core plywood sheets, supporting exotic marble overlays.',
    },
    {
      title: 'Executive Conference Room partitions',
      category: 'COMMERCIAL',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      description: 'Acoustic wall panel frames built using E1 low emission Elisa plywood, ensuring a safe indoor working environment.',
    },
    {
      title: 'Custom Bed Frame & Headboard',
      category: 'FURNITURE',
      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
      description: 'Durable bedroom platform bed frame assembled with 19mm hardwood core plywood sheets, offering excellent joint support.',
    },
    {
      title: 'Contemporary Office Lobby paneling',
      category: 'COMMERCIAL',
      img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
      description: 'Asymmetric vertical wall accents fabricated using lightweight calibrated panels, resisting moisture warping.',
    },
  ];

  const filteredItems = filter === 'ALL' ? galleryItems : galleryItems.filter((i) => i.category === filter);

  return (
    <div className="bg-bg-warm min-h-screen pt-[72px] pb-24 fade-in">
      <SEO
        title="Applications Gallery | Real-World Elisa Plywood Work"
        description="See how Elisa Decor calibrated plywood panels form the structural backbone of modular kitchens, wardrobes, offices, and custom furniture."
        canonical="/projects"
      />

      {/* 1. Header Banner */}
      <section className="bg-primary-dark text-white py-16 px-6 md:px-8 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=80')] bg-cover opacity-15 mix-blend-overlay" />
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
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="group bg-bg-warm border border-sand/60 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="aspect-[4/3] bg-zinc-200 overflow-hidden relative">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-350"
                loading="lazy"
              />
              <span className="absolute top-4 left-4 text-[9px] font-bold font-mono tracking-widest bg-primary-dark/80 text-brass px-3 py-1 rounded uppercase">
                {item.category}
              </span>
            </div>
            
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-serif text-primary-dark">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-655 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
