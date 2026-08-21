import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import SuperAdminSettingsModal from './SuperAdminSettingsModal';
import api from '../../api/axios';

export default function AdminLayout() {
  const [admin, setAdmin] = useState({ name: 'Admin', email: '' });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data?.user) {
          setAdmin({
            name: res.data.user.name,
            email: res.data.user.email,
          });
        }
      } catch (err) {
        console.error('Failed to get session context:', err);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    const fetchSettingsFavicon = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.settings?.favicon?.url) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.href = res.data.settings.favicon.url;
        }
      } catch (err) {
        console.error('Failed to load settings for favicon:', err);
      }
    };
    fetchSettingsFavicon();
  }, []);

  const handleProfileUpdate = (updatedUser) => {
    setAdmin({
      name: updatedUser.name,
      email: updatedUser.email,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row font-sans">
      <AdminSidebar
        adminName={admin.name}
        adminEmail={admin.email}
        onProfileClick={() => setIsProfileOpen(true)}
      />
      
      {/* Content wrapper */}
      <div className="flex-1 lg:pl-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
        <main className="flex-grow p-6 md:p-8 bg-zinc-950 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Super Admin Settings Modal */}
      <SuperAdminSettingsModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        adminName={admin.name}
        adminEmail={admin.email}
        onUpdateSuccess={handleProfileUpdate}
      />
    </div>
  );
}
