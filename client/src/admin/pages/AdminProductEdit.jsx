import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import api from '../../api/axios';
import SEO from '../../components/SEO';

export default function AdminProductEdit() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/admin/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        } else {
          setError(res.data.error || 'Failed to fetch product details.');
        }
      } catch (err) {
        console.error('Failed to fetch product edit details:', err);
        setError(err.response?.data?.error || 'Product not found or access denied.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-zinc-400">
        <Loader2 className="animate-spin text-emerald-500 mr-2" size={24} />
        Loading product information...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6 font-sans">
        <SEO title="Error Edit Product | Elisa Decor Admin" noIndex={true} />
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-white font-serif">Product Not Found</h1>
        </div>
        <div className="bg-red-900/50 border border-red-500/50 p-4 rounded-xl text-center text-red-200">
          {error || 'The requested product data was not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEO title={`Edit Product: ${product.name} | Elisa Decor Admin`} noIndex={true} />
      <ProductForm initialData={product} isEdit={true} id={id} />
    </div>
  );
}
