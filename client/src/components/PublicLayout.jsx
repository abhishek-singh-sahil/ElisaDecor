import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import api from '../api/axios';

export default function PublicLayout() {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          api.get('/settings'),
          api.get('/products'),
        ]);
        setSettings(settingsRes.data.settings || null);
        setProducts(productsRes.data.products || []);
      } catch (err) {
        console.error('Failed to load public layout requirements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLayoutData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-warm text-zinc-650">
        <Loader2 className="animate-spin text-accent mr-2" size={32} />
        Loading Brand Space...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-warm flex flex-col">
      <Header settings={settings} products={products} />
      <main className="flex-grow">
        <Outlet context={{ settings, products }} />
      </main>
      <Footer settings={settings} products={products} />
    </div>
  );
}
