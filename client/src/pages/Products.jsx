import { Link, useOutletContext } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Products() {
  const { products } = useOutletContext();
  const publishedProducts = products?.filter((p) => p.status === 'PUBLISHED') || [];

  return (
    <div className="bg-bg-warm min-h-screen pt-[72px] pb-24 fade-in">
      <SEO
        title="Our Products | Premium Calibrated Plywood Range"
        description="Browse Elisa Decor's full collection of calibrated plywood sheets: Elisa Green BWR, Elisa Club 710 BWP Marine-grade, and Elisa Premium panel boards."
        canonical="/products"
      />

      {/* 1. Header Banner */}
      <section className="bg-primary-dark text-white py-16 px-6 md:px-8 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-forest/15 to-primary-dark/40 opacity-20" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-bold tracking-widest text-brass uppercase block">ELISA DECOR RANGE</span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
            Our Architectural Wood Solutions
          </h1>
          <p className="text-sm md:text-base text-zinc-350 max-w-xl mx-auto leading-relaxed">
            Precision engineered, beautifully calibrated, and BWP/BWR grade wood materials built for luxury interiors.
          </p>
        </div>
      </section>

      {/* 2. Grid list */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedProducts.map((product) => (
            <div
              key={product._id}
              className="group flex flex-col justify-between bg-bg-warm border border-sand/60 hover:border-accent/40 rounded overflow-hidden hover:shadow-xl transition-all duration-300 relative"
            >
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative">
                  {product.heroImage ? (
                    <img
                      src={product.heroImage.url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                      No image uploaded
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  {product.productCode && (
                    <span className="text-[9px] font-bold font-mono tracking-wider text-accent bg-accent/5 px-2.5 py-0.5 rounded-full uppercase inline-block">
                      CODE: {product.productCode}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-primary-dark font-serif">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                    {product.shortDescription}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/products/${product.slug}`}
                  className="block text-center w-full bg-forest hover:bg-primary-dark text-bg-warm font-bold py-2.5 rounded text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}

          {publishedProducts.length === 0 && (
            <div className="col-span-full text-center py-20 text-zinc-500">
              <p className="font-serif text-lg">No products are currently available.</p>
              <p className="text-xs mt-1">Please check back later or contact our support team.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
