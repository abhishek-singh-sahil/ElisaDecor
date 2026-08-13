import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Veneer Selection & Grading',
      desc: 'We select premium hardwood veneers sourced from sustainable plantations. Every veneer is dried to a balanced 8-12% moisture index to prevent natural expansion and internal delamination.',
    },
    {
      num: '02',
      title: 'Glue Line Treatment (PF/MUF)',
      desc: 'Layers are coated with un-extended synthetic resins (Phenol Formaldehyde for waterproof BWP Club 710, Melamine Urea Formaldehyde for BWR Elisa Green) combined with termite-defense chemical additives.',
    },
    {
      num: '03',
      title: 'Multi-Stage Hydraulic Hot Press',
      desc: 'The structured layers undergo hydraulic hot pressing under high temperature and mechanical pressure, bonding them into a solid, core-gap-free panel structure.',
    },
    {
      num: '04',
      title: 'Precision Calibration & Sanding',
      desc: 'Calibrated sanders refine sheet face surfaces. This ensures perfect decimal-level thickness uniformities, which is critical for smooth laminate and veneer overlays.',
    },
    {
      num: '05',
      title: 'Quality Verification Test',
      desc: 'Sheets from each batch are subjected to strict tests: boiling water immersion (72 hours for Club 710 BWP), glue adhesion checks, and dimension calibration checks before stamping.',
    },
  ];

  return (
    <div className="bg-bg-warm min-h-screen pb-24 fade-in">
      <SEO
        title="Our Manufacturing Process | Calibrated Craftsmanship"
        description="Explore the Elisa Decor manufacturing workflow. Multi-stage hot pressing, vacuum-pressure chemical termite defense, and calibration tests."
        canonical="/process"
      />

      {/* 1. Header Banner */}
      <section className="bg-primary-dark text-white py-20 px-6 md:px-8 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80')] bg-cover opacity-15 mix-blend-overlay" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-bold tracking-widest text-brass uppercase block">VERIFIED METRIC</span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
            Our Calibrated Process
          </h1>
          <p className="text-sm md:text-base text-zinc-350 max-w-xl mx-auto leading-relaxed">
            Every Elisa Decor sheet undergoes a multi-stage quality assurance process ensuring complete durability and zero core gaps.
          </p>
        </div>
      </section>

      {/* 2. Timeline steps */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 py-20 space-y-12">
        <div className="space-y-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row gap-6 md:gap-12 items-start bg-bg-warm border border-sand/50 p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow relative"
            >
              <span className="text-4xl md:text-6xl font-extrabold text-stroke-brass tracking-wider font-serif md:w-20 select-none">
                {step.num}
              </span>

              <div className="flex-1 space-y-3">
                <h3 className="text-xl md:text-2xl font-bold font-serif text-primary-dark flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-accent" />
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-zinc-650 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Final call to action */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 text-center space-y-6">
        <h3 className="text-xl md:text-2xl font-bold font-serif text-primary-dark">
          Experience the strength of calibrated plywood panels
        </h3>
        <p className="text-xs text-zinc-600 max-w-lg mx-auto leading-relaxed">
          Request sample coordinates to experience our veneer thickness and calibrate structural densities first-hand.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest hover:bg-primary-dark text-bg-warm font-bold text-xs uppercase tracking-wider rounded transition-colors shadow"
          >
            Enquire Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
