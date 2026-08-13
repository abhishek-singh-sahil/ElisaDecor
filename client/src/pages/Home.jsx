import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, ShieldCheck, ArrowUpRight, Loader2 } from 'lucide-react';
import api from '../api/axios';
import HeroSlider from '../components/HeroSlider';
import SEO, { getOrganizationSchema } from '../components/SEO';

export default function Home() {
  const [homepage, setHomepage] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hpRes, prodRes] = await Promise.all([
          api.get('/homepage'),
          api.get('/products'),
        ]);
        setHomepage(hpRes.data.homepage);
        setProducts(prodRes.data.products || []);
      } catch (err) {
        console.error('Home page load failed:', err);
        setError('Failed to load page content. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-zinc-500">
        <Loader2 className="animate-spin text-accent mr-2" size={24} />
        Loading beautiful craftsmanship...
      </div>
    );
  }

  if (error || !homepage) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-zinc-500 text-center p-6">
        <div>
          <p className="text-lg font-serif mb-4">Elisa Decor is preparing premium materials.</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-forest text-bg-warm rounded text-xs font-semibold uppercase tracking-wider">
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const activeSections = homepage.sections
    ?.filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order) || [];

  return (
    <div className="space-y-0">
      <SEO
        title={homepage.seo?.title}
        description={homepage.seo?.description}
        canonical="/"
        ogTitle={homepage.seo?.ogTitle}
        ogDescription={homepage.seo?.ogDescription}
        ogImage={homepage.seo?.ogImage?.url}
        schema={getOrganizationSchema(homepage)}
      />

      {activeSections.map((section, idx) => {
        const content = section.content || {};
        const settings = section.settings || {};

        switch (section.type) {
          case 'Hero':
            return (
              <HeroSlider
                key={idx}
                slides={content.slides || []}
                settings={settings}
                products={products}
              />
            );

          case 'About':
            return (
              <section key={idx} className="py-24 px-6 md:px-8 bg-bg-warm">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    {content.eyebrow && (
                      <span className="text-xs font-bold tracking-widest text-accent uppercase block">
                        {content.eyebrow}
                      </span>
                    )}
                    {content.heading && (
                      <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary-dark tracking-tight leading-tight">
                        {content.heading}
                      </h2>
                    )}
                    <div className="space-y-4 text-zinc-650 text-sm md:text-base leading-relaxed">
                      {content.description1 && <p>{content.description1}</p>}
                      {content.description2 && <p>{content.description2}</p>}
                    </div>
                    {content.ctaText && (
                      <div className="pt-2">
                        <Link
                          to={content.ctaUrl || '/about'}
                          className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark border-b border-accent pb-1 hover:text-accent transition-colors"
                        >
                          {content.ctaText} <ArrowRight size={16} />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-5 grid grid-cols-12 gap-4 relative">
                    <div className="col-span-8 rounded overflow-hidden shadow-md aspect-[3/4] bg-zinc-200">
                      {content.imageLeft && (
                        <img
                          src={content.imageLeft}
                          alt="Architectural space layout"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="col-span-6 absolute -bottom-10 right-0 rounded overflow-hidden shadow-lg aspect-square w-[75%] border-4 border-bg-warm bg-zinc-200">
                      {content.imageRight && (
                        <img
                          src={content.imageRight}
                          alt="Hardwood panel details"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );

          case 'Products':
            return (
              <section key={idx} className="py-24 px-6 md:px-8 bg-sand/20 border-y border-sand/40">
                <div className="max-w-7xl mx-auto space-y-16">
                  <div className="max-w-3xl space-y-4">
                    {content.eyebrow && (
                      <span className="text-xs font-bold tracking-widest text-accent uppercase block">
                        {content.eyebrow}
                      </span>
                    )}
                    {content.heading && (
                      <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary-dark tracking-tight">
                        {content.heading}
                      </h2>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {products.map((product, pIdx) => (
                      <div
                        key={product._id}
                        className="group flex flex-col justify-between bg-bg-warm border border-sand/60 hover:border-accent/40 rounded overflow-hidden hover:shadow-xl transition-all duration-300 relative"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative">
                          {product.heroImage ? (
                            <img
                              src={product.heroImage.url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              No image uploaded.
                            </div>
                          )}
                          <span className="absolute top-4 left-4 text-xs font-bold font-mono tracking-widest bg-primary-dark/85 text-brass px-3 py-1 rounded-full uppercase">
                            0{pIdx + 1}
                          </span>
                        </div>

                        <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            {product.productCode && settings.showProductCode && (
                              <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase block">
                                CODE: {product.productCode}
                              </span>
                            )}
                            <h3 className="text-2xl font-bold font-serif text-primary-dark group-hover:text-accent transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-zinc-650 leading-relaxed line-clamp-3">
                              {product.shortDescription}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-sand/40 flex justify-between items-center">
                            <Link
                              to={`/products/${product.slug}`}
                              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-dark hover:text-accent transition-colors"
                            >
                              Explore Product <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'WhyChooseUs':
            return (
              <section key={idx} className="py-24 px-6 md:px-8 bg-bg-warm">
                <div className="max-w-7xl mx-auto space-y-16">
                  <div className="text-center max-w-3xl mx-auto space-y-4">
                    {content.eyebrow && (
                      <span className="text-xs font-bold tracking-widest text-accent uppercase block">
                        {content.eyebrow}
                      </span>
                    )}
                    {content.heading && (
                      <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary-dark tracking-tight">
                        {content.heading}
                      </h2>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {content.items?.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="bg-sand/15 p-8 border border-sand/40 rounded-lg text-center space-y-4 hover:bg-sand/30 transition-colors"
                      >
                        <div className="mx-auto h-12 w-12 rounded-full bg-forest/10 flex items-center justify-center text-forest">
                          <ShieldCheck size={24} />
                        </div>
                        <h4 className="text-lg font-bold font-serif text-primary-dark">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-650 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'Applications':
            return (
              <section key={idx} className="py-24 px-6 md:px-8 bg-primary-dark text-bg-warm border-y border-forest">
                <div className="max-w-7xl mx-auto space-y-16">
                  <div className="max-w-3xl space-y-4">
                    {content.eyebrow && (
                      <span className="text-xs font-bold tracking-widest text-brass uppercase block">
                        {content.eyebrow}
                      </span>
                    )}
                    {content.heading && (
                      <h2 className="text-3xl md:text-5xl font-bold font-serif text-white tracking-tight">
                        {content.heading}
                      </h2>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {content.items?.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col justify-end"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-50"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/30 to-transparent" />
                        <div className="relative z-10 p-6 space-y-1">
                          <span className="text-[10px] font-bold text-brass tracking-widest uppercase block">
                            {item.category}
                          </span>
                          <h4 className="text-xl font-bold font-serif text-white">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'Storytelling':
            return (
              <section key={idx} className="py-24 px-6 md:px-8 bg-bg-warm">
                <div className="max-w-7xl mx-auto space-y-16">
                  <div className="max-w-3xl space-y-4">
                    {content.eyebrow && (
                      <span className="text-xs font-bold tracking-widest text-accent uppercase block">
                        {content.eyebrow}
                      </span>
                    )}
                    {content.heading && (
                      <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary-dark tracking-tight">
                        {content.heading}
                      </h2>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {content.steps?.map((step, stepIdx) => (
                      <div key={stepIdx} className="space-y-4 group">
                        <div className="aspect-[4/3] rounded overflow-hidden border border-sand bg-zinc-200 relative">
                          {step.image && (
                            <img
                              src={step.image}
                              alt={step.label}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                              loading="lazy"
                            />
                          )}
                          <span className="absolute bottom-3 left-3 text-[10px] font-bold font-mono tracking-widest bg-primary-dark text-brass px-2.5 py-0.5 rounded uppercase">
                            Step 0{stepIdx + 1}
                          </span>
                        </div>
                        <div className="space-y-1 text-left">
                          <h4 className="text-md font-bold text-primary-dark uppercase font-serif tracking-wider">
                            {step.label}
                          </h4>
                          <p className="text-xs text-zinc-650 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'Process':
            return (
              <section key={idx} className="py-24 px-6 md:px-8 bg-sand/10 border-t border-sand/30">
                <div className="max-w-7xl mx-auto space-y-16">
                  <div className="max-w-3xl space-y-4">
                    {content.eyebrow && (
                      <span className="text-xs font-bold tracking-widest text-accent uppercase block">
                        {content.eyebrow}
                      </span>
                    )}
                    {content.heading && (
                      <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary-dark tracking-tight">
                        {content.heading}
                      </h2>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative before:absolute before:top-4 before:left-0 before:w-full before:h-0.5 before:bg-sand/40 before:hidden before:md:block">
                    {content.steps?.map((step, stepIdx) => (
                      <div key={stepIdx} className="space-y-3 relative">
                        <div className="h-8 w-8 rounded-full bg-bg-warm border-2 border-accent flex items-center justify-center text-xs font-bold text-primary-dark z-10 relative select-none">
                          {step.number || `0${stepIdx + 1}`}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold font-serif text-primary-dark">
                            {step.title}
                          </h4>
                          <p className="text-xs text-zinc-650 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'FAQ':
            return (
              <section key={idx} className="py-24 px-6 md:px-8 bg-bg-warm border-t border-sand/40">
                <div className="max-w-4xl mx-auto space-y-12">
                  <div className="text-center space-y-4">
                    {content.eyebrow && (
                      <span className="text-xs font-bold tracking-widest text-accent uppercase block">
                        {content.eyebrow}
                      </span>
                    )}
                    {content.heading && (
                      <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary-dark tracking-tight">
                        {content.heading}
                      </h2>
                    )}
                  </div>

                  <div className="space-y-4 divide-y divide-sand/50">
                    {content.faqItems?.map((faq, faqIdx) => (
                      <details
                        key={faqIdx}
                        className="group pt-4 outline-none cursor-pointer text-left"
                      >
                        <summary className="flex justify-between items-center font-bold text-sm md:text-base text-primary-dark hover:text-accent font-serif tracking-wide focus:outline-none list-none">
                          <span>{faq.question}</span>
                          <span className="text-zinc-400 group-open:rotate-180 transition-transform font-sans text-lg font-normal font-bold">
                            +
                          </span>
                        </summary>
                        <p className="text-xs md:text-sm text-zinc-650 leading-relaxed mt-3 pt-1 pl-1 cursor-text select-text whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'CTA':
            return (
              <section
                key={idx}
                className="relative py-24 px-6 md:px-8 bg-primary-dark text-bg-warm overflow-hidden flex items-center justify-center text-center"
              >
                {content.bgImage && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
                    style={{ backgroundImage: `url('${content.bgImage}')` }}
                  />
                )}

                <div className="relative z-10 max-w-3xl space-y-6">
                  {content.heading && (
                    <h2 className="text-3xl md:text-5xl font-bold font-serif leading-tight">
                      {content.heading}
                    </h2>
                  )}
                  {content.subtitle && (
                    <p className="text-sm md:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed">
                      {content.subtitle}
                    </p>
                  )}

                  {content.primaryCtaText && (
                    <div className="pt-2">
                      <Link
                        to={content.primaryCtaUrl || '/contact'}
                        className="inline-block px-8 py-3.5 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-lg"
                      >
                        {content.primaryCtaText}
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
