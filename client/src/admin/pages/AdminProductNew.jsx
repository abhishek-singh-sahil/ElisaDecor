import ProductForm from '../components/ProductForm';
import SEO from '../../components/SEO';

export default function AdminProductNew() {
  return (
    <div className="space-y-6">
      <SEO title="Add New Product | Elisa Decor Admin" noIndex={true} />
      <ProductForm isEdit={false} />
    </div>
  );
}
