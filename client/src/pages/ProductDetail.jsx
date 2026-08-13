import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Mail, ShieldCheck, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import ProductGallery from '../components/ProductGallery';
import EnquiryModal from '../components/EnquiryModal';
import SEO, { getProductSchema } from '../components/SEO';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useOutletContext();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch specific product by slug
        const prodRes = await api.get(`/products/${slug}`);
        setProduct(prodRes.data.product);

        // Fetch all published products for switcher indices
        const allRes = await api.get('/products');
        setAllProducts(allRes.data.products || []);
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
    return s
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Switcher Indices Resolving
  const currentIdx = allProducts.findIndex((p) => p.slug === (product?.slug || slug));
  const prevProduct = currentIdx !== -1 ? allProducts[(currentIdx - 1 + allProducts.length) % allProducts.length] : null;
  const nextProduct = currentIdx !== -1 ? allProducts[(currentIdx + 1) % allProducts.length] : null;

  const fallbackName = getProductFallbackName(slug);
  const seoTitle = product?.seo?.title || (product ? `${product.name} Plywood | Elisa Decor` : `${fallbackName} Plywood | Elisa Decor`);
  const seoDesc = product?.seo?.description || product?.shortDescription || `Experience premium craftsmanship with ${fallbackName} by Elisa Decor. High density, waterproof hardwood wood sheet solutions.`;
  const seoOgTitle = product?.seo?.ogTitle || product?.name || fallbackName;
  const seoOgDesc = product?.seo?.ogDescription || product?.shortDescription || seoDesc;

  return (
    <div className="bg-bg-warm min-h-screen pt-[72px] pb-24 fade-in">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`/products/${slug}`}
        ogTitle={seoOgTitle}
        ogDescription={seoOgDesc}
        ogImage={product?.heroImage?.url}
        schema={product ? getProductSchema(product) : null}
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
          {/* 1. Breadcrumbs */}
          <div className="bg-sand/10 border-b border-sand/40 py-4 px-6 md:px-8">
            <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-zinc-550">
              <Link to="/" className="hover:text-primary-dark transition-colors">HOME</Link>
              <ChevronRight size={12} className="text-zinc-400" />
              <span className="text-zinc-400 uppercase">PRODUCTS</span>
              <ChevronRight size={12} className="text-zinc-400" />
              <span className="text-primary-dark font-bold uppercase">{product.name}</span>
            </div>
          </div>

      {/* 2. Main Product Info Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: Gallery & FAQs */}
        <div className="lg:col-span-5 space-y-8">
          <ProductGallery gallery={product.gallery} heroImage={product.heroImage} />

          {product.faqs?.length > 0 && (
            <div className="bg-sand/10 border border-sand/50 rounded-lg p-6 space-y-4">
              <h4 className="text-base font-bold font-serif text-primary-dark border-b border-sand pb-2">
                Frequently Asked Questions
              </h4>
              <div className="space-y-4 divide-y divide-sand/40">
                {product.faqs.map((faq, idx) => (
                  <details key={idx} className="group pt-4 outline-none cursor-pointer text-left">
                    <summary className="flex justify-between items-center font-bold text-xs md:text-sm text-primary-dark hover:text-accent font-serif tracking-wide focus:outline-none list-none">
                      <span>{faq.question}</span>
                      <span className="text-zinc-400 group-open:rotate-180 transition-transform font-sans text-sm font-normal">+</span>
                    </summary>
                    <p className="text-[11px] md:text-xs text-zinc-650 leading-relaxed mt-2 pt-1 pl-1 cursor-text select-text whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Specs & Features */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            {product.productCode && (
              <span className="text-[10px] font-bold font-mono tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full uppercase inline-block">
                CODE: {product.productCode}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-primary-dark tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-sm md:text-base text-zinc-650 leading-relaxed select-text">
              {product.longDescription || product.shortDescription}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-forest hover:bg-primary-dark text-bg-warm font-bold py-3.5 px-8 rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              <Mail size={14} />
              Enquire About {product.name}
            </button>
          </div>

          {/* Technical Specs Table */}
          {product.specifications?.length > 0 && (
            <div className="bg-sand/15 border border-sand/40 rounded-lg overflow-hidden space-y-3 p-6">
              <h4 className="text-sm font-bold font-serif tracking-wider text-primary-dark uppercase border-l-2 border-accent pl-2">
                Technical Specifications
              </h4>
              <div className="border border-sand/40 rounded overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    {product.specifications.map((spec, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-sand/30 ${
                          idx % 2 === 0 ? 'bg-sand/5' : 'bg-transparent'
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-primary-dark border-r border-sand/20 w-1/3">
                          {spec.key}
                        </td>
                        <td className="px-4 py-3 text-zinc-650 select-text">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Features Highlights */}
          {product.features?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold font-serif tracking-wider text-primary-dark uppercase border-l-2 border-accent pl-2">
                Features & Shield Protection
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex gap-3 bg-bg-warm p-4 border border-sand/40 rounded-lg shadow-sm">
                    <div className="h-9 w-9 rounded-full bg-forest/10 flex items-center justify-center text-forest flex-shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-xs md:text-sm text-primary-dark leading-tight">
                        {feat.title}
                      </h5>
                      <p className="text-[11px] text-zinc-600 leading-normal">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Applications */}
      {product.applications?.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-8 mt-20 space-y-8">
          <h3 className="text-2xl font-bold font-serif text-primary-dark text-center border-b border-sand pb-4">
            Suggested Application Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {product.applications.map((app, idx) => (
              <div key={idx} className="bg-bg-warm border border-sand/40 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] bg-zinc-200 overflow-hidden relative">
                  {app.image ? (
                    <img
                      src={app.image.url}
                      alt={app.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-350"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-450 text-xs">
                      No application photo
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-1 text-left">
                  <h4 className="font-bold text-sm md:text-base text-primary-dark font-serif">
                    {app.title}
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                    {app.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Benefits advantages */}
      {product.benefits?.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 md:px-8 mt-20 p-8 bg-forest text-bg-warm rounded-xl border border-zinc-800 space-y-6 text-left">
          <h3 className="text-xl md:text-2xl font-bold font-serif text-brass text-center">
            The Elisa Advantage
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                <CheckCircle size={16} className="text-brass flex-shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-200 leading-relaxed font-semibold">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Switcher Navigation */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 mt-24 border-t border-sand pt-8 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-primary-dark">
        {prevProduct ? (
          <Link to={`/products/${prevProduct.slug}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
            ← Previous: {prevProduct.name}
          </Link>
        ) : (
          <span className="text-zinc-300">← Previous</span>
        )}

        <Link
          to="/"
          className="px-4 py-2 bg-sand/20 hover:bg-sand/40 border border-sand rounded transition-colors text-zinc-600 hover:text-primary-dark"
        >
          All Products
        </Link>

        {nextProduct ? (
          <Link to={`/products/${nextProduct.slug}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
            Next: {nextProduct.name} →
          </Link>
        ) : (
          <span className="text-zinc-300">Next →</span>
        )}
      </div>

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        products={allProducts}
        initialProductSlug={product.slug}
        settings={settings}
      />
      </>
      )}
    </div>
  );
}
