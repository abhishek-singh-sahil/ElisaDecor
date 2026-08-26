import { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import {
  Mail, ShieldCheck, ChevronRight, CheckCircle, Loader2,
  Download, Leaf, Droplets, ArrowRight, Award, Star,
  Layers, Wrench, Shield, Zap
} from 'lucide-react';
import api from '../api/axios';
import ProductGallery from '../components/ProductGallery';
import SEO, { getProductSchema, getBreadcrumbSchema, getFAQSchema } from '../components/SEO';

// Icon name → Lucide component map (for CMS-driven feature icons)
const ICON_MAP = {
  Droplets, Shield, ShieldCheck, Leaf, Wrench, Layers, Zap, Star, Award,
  Grid: Layers, Sparkles: Star, Sliders: Wrench, FlaskConical: Zap,
};

function FeatureIcon({ iconName, size = 20, className = '' }) {
  const Comp = ICON_MAP[iconName] || ShieldCheck;
  return <Comp size={size} className={className} />;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { settings, products: allProducts = [], openEnquiry } = useOutletContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const prodRes = await api.get(`/products/${slug}`);
        setProduct(prodRes.data.product);
      } catch (err) {
        console.error('Failed to load product detail:', err);
        setError(err.response?.data?.error || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const getProductFallbackName = (s) => {
    if (!s) return 'Product';
    return s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Related products (other published products, excluding current)
  const relatedProducts = allProducts.filter(
    (p) => p.slug !== (product?.slug || slug) && p.status === 'PUBLISHED'
  ).slice(0, 2);

  const fallbackName = getProductFallbackName(slug);
  // Build full SEO-friendly H1 title for the product
  const getProductSEOH1 = (p) => {
    if (!p) return fallbackName;
    const name = p.name;
    const cert = p.certifications || '';
    if (name === 'Elisa Green') return 'Elisa Green Premium Plywood';
    if (name === 'Elisa Club 710') return 'Elisa Club 710 Marine Grade Plywood';
    if (name === 'Decor Club Prime') return 'Decor Club Prime Premium Marine-Grade Plywood';
    return `${name} Premium Plywood`;
  };

  const seoTitle = product?.seo?.title || `${getProductSEOH1(product)} | Elisa Decor`;
  const seoDesc = product?.seo?.description || product?.shortDescription || '';
  const seoOgTitle = product?.seo?.ogTitle || product?.name || fallbackName;
  const seoOgDesc = product?.seo?.ogDescription || product?.shortDescription || seoDesc;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product?.name || fallbackName, url: `/products/${slug}` },
  ];

  const combinedSchema = product
    ? [
        getProductSchema(product),
        getBreadcrumbSchema(breadcrumbs),
        ...(product.faqs?.length > 0 ? [getFAQSchema(product.faqs)] : []),
      ]
    : null;

  return (
    <div className="bg-bg-warm min-h-screen pt-[72px] fade-in">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`/products/${slug}`}
        ogTitle={seoOgTitle}
        ogDescription={seoOgDesc}
        ogImage={product?.seo?.ogImage?.url || product?.heroImage?.url}
        schemas={combinedSchema}
        type="article"
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[80vh] text-zinc-500">
          <Loader2 className="animate-spin text-accent mr-2" size={24} />
          Loading product details...
        </div>
      ) : error || !product ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-zinc-500 text-center p-6 space-y-4">
          <h3 className="text-xl font-serif">Plywood Specification Not Found</h3>
          <p className="text-sm max-w-xs mx-auto">The page you requested does not exist or may have been archived.</p>
          <Link to="/" className="px-4 py-2 bg-forest text-bg-warm rounded text-xs font-semibold uppercase tracking-wider">
            Return Home
          </Link>
        </div>
      ) : (
        <>
          {/* ── SECTION 1: FULL-WIDTH PRODUCT HERO ─────────────────────────────── */}
          <section className="relative min-h-[80svh] md:h-[100svh] flex items-center overflow-hidden bg-primary-dark">
            {/* Background hero image */}
            {(product.heroImage || product.mobileHeroImage) ? (
              <div className="absolute inset-0">
                <picture className="absolute inset-0 block w-full h-full">
                  {product.mobileHeroImage && (
                    <source media="(max-width: 768px)" srcSet={product.mobileHeroImage.url} />
                  )}
                  <img
                    src={product.heroImage?.url || product.mobileHeroImage?.url}
                    alt={`${product.name} premium plywood`}
                    className="w-full h-full object-cover object-center opacity-45"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/45 to-transparent md:bg-gradient-to-r md:from-primary-dark/75 md:via-primary-dark/55 md:to-primary-dark/15" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-forest opacity-90" />
            )}

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full pt-28 pb-16 md:py-20">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-semibold text-zinc-450 uppercase tracking-wider mb-6 md:mb-8">
                <Link to="/" className="hover:text-brass transition-colors">Home</Link>
                <ChevronRight size={10} className="text-zinc-550" />
                <Link to="/products" className="hover:text-brass transition-colors">Products</Link>
                <ChevronRight size={10} className="text-zinc-550" />
                <span className="text-brass">{product.name}</span>
              </nav>

              <div className="max-w-2xl space-y-5 md:space-y-6">
                <span className="text-[10px] font-bold tracking-widest text-brass uppercase block">
                  ELISA DECOR
                </span>

                {/* H1 */}
                <h1 className="text-4xl md:text-6xl font-bold font-serif text-white leading-tight tracking-tight">
                  {product.heroTitle || getProductSEOH1(product)}
                </h1>

                {/* Positioning statement */}
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-lg">
                  {product.shortDescription}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                  {product.warranty && (
                    <span className="inline-flex items-center gap-1.5 bg-brass/20 border border-brass/40 text-brass text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                      <Award size={11} /> {product.warranty} WARRANTY
                    </span>
                  )}
                  {product.certifications && (
                    <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-zinc-200 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                      <ShieldCheck size={11} /> {product.certifications}
                    </span>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => openEnquiry(product.slug)}
                    className="inline-flex items-center justify-center gap-2 bg-brass hover:bg-accent text-white font-bold py-4 px-8 rounded text-xs uppercase tracking-widest transition-colors shadow-lg cursor-pointer w-full sm:w-auto"
                  >
                    <Mail size={14} /> Enquire Now
                  </button>
                  {product.specifications?.length > 0 && (
                    <button
                      onClick={() => document.getElementById('tech-specs')?.scrollIntoView({ behavior: 'smooth' })}
                      className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-bold py-4 px-6 rounded text-xs border border-white/30 uppercase tracking-widest transition-colors cursor-pointer w-full sm:w-auto"
                    >
                      Explore Specifications <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 2: PRODUCT OVERVIEW ────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
              {/* Left: Gallery */}
              <div className="lg:col-span-5">
                <ProductGallery gallery={product.gallery} heroImage={product.heroImage} />
              </div>

              {/* Right: Overview + Specs */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold tracking-widest text-accent uppercase block">PRODUCT OVERVIEW</span>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary-dark leading-tight">
                    {product.name} — Engineered for Strength & Longevity
                  </h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {product.longDescription || product.shortDescription}
                  </p>
                </div>

                {/* Quick spec badges */}
                {product.productCode && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full uppercase">
                      CODE: {product.productCode}
                    </span>
                  </div>
                )}

                {/* Technical Specs Table */}
                {product.specifications?.length > 0 && (
                  <div id="tech-specs" className="bg-sand/15 border border-sand/50 rounded-xl overflow-hidden scroll-mt-28">
                    <div className="px-5 py-4 border-b border-sand/50 bg-sand/20">
                      <h3 className="text-sm font-bold font-serif tracking-wider text-primary-dark uppercase">
                        Core Specifications
                      </h3>
                    </div>
                    <table className="w-full text-left text-xs border-collapse">
                      <tbody>
                        {product.specifications.map((spec, idx) => (
                          <tr
                            key={idx}
                            className={`border-b border-sand/30 ${idx % 2 === 0 ? 'bg-sand/5' : 'bg-transparent'}`}
                          >
                            <td className="px-5 py-3.5 font-semibold text-primary-dark border-r border-sand/20 w-[38%]">
                              {spec.key}
                            </td>
                            <td className="px-5 py-3.5 text-zinc-650">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── SECTION 3: KEY BENEFITS ─────────────────────────────────────────── */}
          {product.benefits?.length > 0 && (
            <section className="bg-primary-dark py-20 px-6 md:px-8">
              <div className="max-w-7xl mx-auto space-y-10">
                <div className="text-center space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-brass uppercase block">THE ELISA ADVANTAGE</span>
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">
                    Why Choose {product.name}?
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {product.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-colors">
                      <CheckCircle size={16} className="text-brass flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-200 leading-relaxed">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── SECTION 4: FEATURES (PERFORMANCE ATTRIBUTES) ────────────────────── */}
          {product.features?.length > 0 && (
            <section className="py-20 px-6 md:px-8 bg-bg-warm">
              <div className="max-w-7xl mx-auto space-y-10">
                <div className="text-center space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-accent uppercase block">KEY PERFORMANCE ATTRIBUTES</span>
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-dark">
                    Engineered for Every Environment
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {product.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-sand/60 rounded-xl p-6 space-y-4 hover:shadow-lg hover:border-accent/30 transition-all duration-300 text-center"
                    >
                      <div className="mx-auto h-12 w-12 rounded-full bg-forest/10 flex items-center justify-center text-forest">
                        <FeatureIcon iconName={feat.icon} size={22} />
                      </div>
                      <h4 className="font-bold text-sm text-primary-dark font-serif leading-tight">
                        {feat.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{feat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── SECTION 5: APPLICATIONS ─────────────────────────────────────────── */}
          {product.applications?.length > 0 && (
            <section className="py-20 px-6 md:px-8 bg-sand/20 border-t border-sand/40">
              <div className="max-w-7xl mx-auto space-y-10">
                <div className="text-center space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-accent uppercase block">WHERE IT EXCELS</span>
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-dark">
                    Ideal Application Settings
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {product.applications.map((app, idx) => (
                    <div key={idx} className="bg-bg-warm border border-sand/50 rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300">
                      <div className="aspect-[4/3] bg-zinc-200 overflow-hidden">
                        {app.image ? (
                          <img
                            src={app.image.url}
                            alt={app.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs bg-sand/30">
                            {app.title}
                          </div>
                        )}
                      </div>
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-sm text-primary-dark font-serif">{app.title}</h4>
                        <p className="text-xs text-zinc-600 leading-relaxed">{app.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── SECTION 6: TECHNOLOGY / PROCESS ─────────────────────────────────── */}
          <section className="py-20 px-6 md:px-8 bg-primary-dark text-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                <div className="space-y-6">
                  <span className="text-[10px] font-bold tracking-widest text-brass uppercase block">MANUFACTURING TECHNOLOGY</span>
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-white leading-tight">
                    Built on Advanced Engineering
                  </h2>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {product.name} is manufactured using precision-controlled processes that ensure every sheet meets strict dimensional and structural standards. From timber selection to final calibration, each step is designed for consistency and longevity.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      { icon: 'Layers', label: 'Quad-Core Press Technology', desc: 'Multi-layered high-pressure bonding for dimensional stability' },
                      { icon: 'Shield', label: 'Vacuum Pressure Treatment', desc: 'Deep chemical impregnation against pests and moisture' },
                      { icon: 'Droplets', label: '100% Calibrated Surface', desc: 'Zero undulations or core gaps across all thickness ranges' },
                      { icon: 'Leaf', label: 'Sustainable Sourcing', desc: 'Responsible plantation timber with E0/E1 emission compliance' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-brass/20 flex items-center justify-center flex-shrink-0">
                          <FeatureIcon iconName={item.icon} size={14} className="text-brass" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white">{item.label}</p>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {product.heroImage && (
                    <div className="aspect-[4/3] rounded-xl overflow-hidden">
                      <img
                        src={product.heroImage.url}
                        alt={`${product.name} manufacturing`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {product.gallery?.[1] && !product.heroImage && (
                    <div className="aspect-[4/3] rounded-xl overflow-hidden">
                      <img
                        src={product.gallery[1].url}
                        alt={`${product.name} process`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 7: WARRANTY ──────────────────────────────────────────────── */}
          {product.warranty && (
            <section className="py-16 px-6 md:px-8 bg-bg-warm border-t border-sand/50">
              <div className="max-w-5xl mx-auto">
                <div className="bg-white border border-sand/60 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0 text-center">
                    <div className="h-24 w-24 mx-auto rounded-full bg-brass/15 border-2 border-brass/40 flex flex-col items-center justify-center">
                      <Award size={28} className="text-brass" />
                      <span className="text-lg font-bold text-primary-dark font-serif leading-none mt-1">
                        {product.warranty.replace(' Years', '')}
                      </span>
                      <span className="text-[9px] font-bold text-brass uppercase tracking-wider">Years</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-center md:text-left">
                    <span className="text-[10px] font-bold tracking-widest text-accent uppercase block">MANUFACTURER WARRANTY</span>
                    <h2 className="text-2xl font-bold font-serif text-primary-dark">
                      {product.warranty} Manufacturer Warranty
                    </h2>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {product.name} comes backed by a {product.warranty} manufacturer warranty against manufacturing defects under normal usage. The warranty is valid from the date of purchase and is applicable for manufacturing defects only.
                    </p>
                    <ul className="text-xs text-zinc-500 space-y-1 pt-1">
                      <li className="flex items-center gap-2"><CheckCircle size={11} className="text-forest flex-shrink-0" /> Proof of purchase (invoice) is mandatory</li>
                      <li className="flex items-center gap-2"><CheckCircle size={11} className="text-forest flex-shrink-0" /> Not valid for damages due to mishandling or improper storage</li>
                      <li className="flex items-center gap-2"><CheckCircle size={11} className="text-forest flex-shrink-0" /> Company liability is limited to replacement of product only</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── SECTION 8: CERTIFICATIONS ────────────────────────────────────────── */}
          {product.certifications && (
            <section className="py-16 px-6 md:px-8 bg-sand/20 border-t border-sand/40">
              <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-accent uppercase block">STANDARDS & CERTIFICATION</span>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary-dark">
                    Tested. Certified. Trusted.
                  </h2>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {product.certifications.split(',').map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white border border-sand/60 rounded-xl px-6 py-4 shadow-sm">
                      <div className="h-10 w-10 rounded-full bg-forest/10 flex items-center justify-center">
                        <ShieldCheck size={18} className="text-forest" />
                      </div>
                      <span className="text-sm font-bold text-primary-dark font-serif">{cert.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── SECTION 9: PRODUCT GALLERY ───────────────────────────────────────── */}
          {product.gallery?.length > 1 && (
            <section className="py-16 px-6 md:px-8 bg-bg-warm border-t border-sand/40">
              <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-accent uppercase block">PRODUCT GALLERY</span>
                  <h2 className="text-2xl font-bold font-serif text-primary-dark">Visual Showcase</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.gallery.slice(0, 8).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-sand/30 group">
                      <img
                        src={img.url}
                        alt={img.altText || `${product.name} gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── SECTION 10: DOWNLOAD / BROCHURE CTA ─────────────────────────────── */}
          {/* Placeholder: show when a brochure URL is configured in CMS (product.brochureUrl) */}
          {product.brochureUrl && (
            <section className="py-12 px-6 md:px-8 bg-sand/30 border-t border-sand/40">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h3 className="text-xl font-bold font-serif text-primary-dark">Download Product Information</h3>
                <p className="text-sm text-zinc-600">Get the complete technical datasheet and brochure for {product.name}.</p>
                <a
                  href={product.brochureUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-forest hover:bg-primary-dark text-white font-bold py-3 px-8 rounded text-xs uppercase tracking-wider transition-colors"
                >
                  <Download size={14} /> Download Technical Sheet
                </a>
              </div>
            </section>
          )}

          {/* ── SECTION 11: FAQ ──────────────────────────────────────────────────── */}
          {product.faqs?.length > 0 && (
            <section className="py-20 px-6 md:px-8 bg-bg-warm border-t border-sand/40">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-accent uppercase block">FREQUENTLY ASKED QUESTIONS</span>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary-dark">
                    Common Questions About {product.name}
                  </h2>
                </div>
                <div className="space-y-3">
                  {product.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-sand/60 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                        className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none group"
                      >
                        <span className="font-bold text-sm text-primary-dark font-serif pr-4 group-hover:text-accent transition-colors">
                          {faq.question}
                        </span>
                        <span className={`text-zinc-400 text-xl font-light flex-shrink-0 transition-transform duration-200 ${openFaqIdx === idx ? 'rotate-45' : ''}`}>+</span>
                      </button>
                      {openFaqIdx === idx && (
                        <div className="px-6 pb-5 text-sm text-zinc-600 leading-relaxed border-t border-sand/40 pt-4">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── SECTION 12: ENQUIRY CTA BANNER ──────────────────────────────────── */}
          <section className="bg-forest py-20 px-6 md:px-8 text-white text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <span className="text-[10px] font-bold tracking-widest text-brass uppercase block">GET IN TOUCH</span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif leading-tight">
                Ready to Specify {product.name}?
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-xl mx-auto">
                Talk to our team for tailored product consultations, dealer coordinates, and custom thickness availability. We respond to all serious enquiries promptly.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <button
                  onClick={() => openEnquiry(product.slug)}
                  className="inline-flex items-center gap-2 bg-brass hover:bg-accent text-white font-bold py-4 px-10 rounded text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
                >
                  <Mail size={14} /> Enquire Now
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white font-bold py-4 px-8 rounded text-xs border border-white/30 uppercase tracking-wider transition-colors"
                >
                  Contact Us <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </section>

          {/* ── SECTION 13: RELATED PRODUCTS ────────────────────────────────────── */}
          {relatedProducts.length > 0 && (
            <section className="py-20 px-6 md:px-8 bg-bg-warm border-t border-sand/40">
              <div className="max-w-7xl mx-auto space-y-10">
                <div className="text-center space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-accent uppercase block">ELISA DECOR FAMILY</span>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-primary-dark">
                    Explore Related Products
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {relatedProducts.map((rp) => (
                    <Link
                      key={rp._id}
                      to={`/products/${rp.slug}`}
                      className="group flex gap-5 bg-white border border-sand/60 hover:border-accent/40 rounded-xl p-5 transition-all hover:shadow-lg"
                    >
                      <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-sand/30">
                        {rp.heroImage ? (
                          <img
                            src={rp.heroImage.url}
                            alt={rp.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : rp.logo ? (
                          <img src={rp.logo.url} alt={rp.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="w-full h-full bg-sand/40 flex items-center justify-center text-zinc-400 text-[10px]">No img</div>
                        )}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        {rp.warranty && (
                          <span className="text-[9px] font-bold text-brass bg-brass/10 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                            {rp.warranty} Warranty
                          </span>
                        )}
                        <h4 className="font-bold text-sm text-primary-dark font-serif group-hover:text-accent transition-colors">
                          {rp.name}
                        </h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">{rp.shortDescription}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-forest uppercase tracking-wider group-hover:text-accent transition-colors">
                          View Product <ArrowRight size={10} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
