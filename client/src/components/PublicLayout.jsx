import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import EnquiryModal from './EnquiryModal';
import api from '../api/axios';

export default function PublicLayout() {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryProductSlug, setEnquiryProductSlug] = useState('');

  const openEnquiry = (slug = '') => {
    setEnquiryProductSlug(slug);
    setEnquiryModalOpen(true);
  };

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

  useEffect(() => {
    if (settings?.favicon?.url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.favicon.url;
    }
  }, [settings]);

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
      <Header settings={settings} products={products} openEnquiry={openEnquiry} />
      <main className="flex-grow">
        <Outlet context={{ settings, products, openEnquiry }} />
      </main>
      <Footer settings={settings} products={products} />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        products={products}
        initialProductSlug={enquiryProductSlug}
        settings={settings}
      />
    </div>
  );
}
