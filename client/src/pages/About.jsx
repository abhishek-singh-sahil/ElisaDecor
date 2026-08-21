import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, Trees, HeartHandshake, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/axios';
import SEO from '../components/SEO';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data.settings);
      } catch (err) {
        console.error('Failed to load site settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-zinc-500">
        <Loader2 className="animate-spin text-accent mr-2" size={24} />
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-bg-warm min-h-screen pt-[72px] pb-24 fade-in">
      <SEO
        title="About Us | Premium Plywood Craftsmanship"
        description="Learn about Elisa Decor - our heritage, quality standards, hardwood core calibration, and vision to shape beautiful, warp-free architectural spaces."
        canonical="/about"
      />

      {/* 1. Header Banner */}
      <section className="bg-primary-dark text-white py-20 px-6 md:px-8 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-forest/15 to-primary-dark/40 opacity-20" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-bold tracking-widest text-brass uppercase block">CRAFT & CALIBRATION</span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
            About {settings?.brandName || 'Elisa Decor'}
          </h1>
          <p className="text-sm md:text-base text-zinc-350 max-w-xl mx-auto leading-relaxed">
            Discover the design philosophy, manufacturing calibration standards, and core values that drive our plywood craftsmanship.
          </p>
        </div>
      </section>

      {/* 2. Story block */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold tracking-widest text-accent uppercase block">OUR MISSION</span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-dark tracking-tight">
            Engineering structural longevity for modern premium interiors.
          </h2>
          <div className="space-y-4 text-zinc-650 text-sm leading-relaxed">
            <p>
              At {settings?.brandName || 'Elisa Decor'}, we believe that the beauty of any interior space rests on its structural foundation. Plywood is not just a building block; it is the silent skeleton of modular kitchens, designer wardrobes, vanity units, and custom joinery.
            </p>
            <p>
              We source high-density hardwood core veneers from sustainable plantation reserves. Through advanced multi-stage calibration, hydraulic pressing at controlled temperatures, and vacuum-pressure chemical preservatives, we manufacture plywood panels that are guaranteed warp-free, borer-proof, and termite-resistant.
            </p>
            <p>
              Our collaboration with leading architects, developers, and premium contractors is built on absolute transparency and verified quality performance benchmarks.
            </p>
          </div>
        </div>

        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-sand bg-zinc-200 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80"
            alt="Elisa Decor calibration core veneers"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="bg-sand/15 border-y border-sand/40 py-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-widest text-accent uppercase block">HOW WE WORK</span>
            <h3 className="text-2xl md:text-3xl font-bold font-serif text-primary-dark">
              Our Core Pillars & Quality Guidelines
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Calibration Integrity', desc: 'Uniform thickness across every square inch prevents gaps during high-end veneer laminations.', icon: Award },
              { title: 'Preservative Infusion', desc: 'Vacuum-pressure chemical treatment ensures lifelong immunity against termite and borer attack.', icon: Compass },
              { title: 'Responsibly Sourced', desc: 'We only source plantation timber veneers, ensuring natural resource sustainability.', icon: Trees },
              { title: 'Transparent Support', desc: 'We verify our BWP/BWR test certificates, backing claims with real data for complete trust.', icon: HeartHandshake },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-bg-warm p-6 border border-sand/50 rounded-lg space-y-4 hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 bg-forest/10 rounded-full flex items-center justify-center text-forest">
                    <Icon size={20} />
                  </div>
                  <h4 className="font-bold text-sm md:text-base text-primary-dark font-serif uppercase tracking-wide">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Quality Statement Callout */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 py-20 text-center space-y-6">
        <h3 className="text-xl md:text-3xl font-bold font-serif text-primary-dark italic leading-snug">
          "Plywood engineered to endure, crafting spaces that speak elegance."
        </h3>
        <p className="text-xs text-zinc-550 tracking-widest uppercase font-bold">— ELISA DECOR QUALITY CHARTER</p>
        <div className="pt-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest hover:bg-primary-dark text-bg-warm font-bold text-xs uppercase tracking-wider rounded transition-colors shadow"
          >
            Discuss A Project <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
