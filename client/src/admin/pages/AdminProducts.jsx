import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Eye, Archive, Box, Loader2, Info } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/SEO';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Fetch products failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleArchive = async (id, name) => {
    if (!confirm(`Are you sure you want to archive "${name}"? It will be hidden from the public website.`)) return;

    try {
      const res = await api.delete(`/admin/products/${id}`);
      if (res.data.success) {
        alert(`${name} has been archived successfully.`);
        fetchProducts();
      } else {
        alert(res.data.error || 'Failed to archive product.');
      }
    } catch (err) {
      console.error('Archive failed:', err);
      alert(err.response?.data?.error || 'Failed to archive product.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <SEO title="Products List | Elisa Decor Admin" noIndex={true} />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif">Products</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Create, edit, and publish the Elisa Decor product range.
          </p>
        </div>
        <div>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <PlusCircle size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-zinc-400 text-sm">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Info className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
          <h3 className="text-lg font-medium text-white font-serif">No products found</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
            Get started by adding your first product sheet. Use the Add Product button above.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Sort Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded bg-zinc-850 border border-zinc-700 overflow-hidden flex items-center justify-center">
                        {product.heroImage ? (
                          <img
                            src={product.heroImage.url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Box size={20} className="text-zinc-650" />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-white font-serif">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                      /products/{product.slug}
                    </td>

                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                      {product.productCode || '—'}
                    </td>

                    <td className="px-6 py-4 text-zinc-400">
                      {product.sortOrder}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          product.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : product.status === 'DRAFT'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 font-sans">
                        {product.status === 'PUBLISHED' && (
                          <Link
                            to={`/products/${product.slug}`}
                            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            title="View Live Page"
                          >
                            <Eye size={16} />
                          </Link>
                        )}
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Edit Details"
                        >
                          <Edit size={16} />
                        </Link>
                        {product.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => handleArchive(product._id, product.name)}
                            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Archive Product"
                          >
                            <Archive size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
