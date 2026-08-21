import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Mail,
  Image as ImageIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  FolderKanban,
} from 'lucide-react';
import api from '../../api/axios';

export default function AdminSidebar({ adminName, adminEmail, onProfileClick }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Enquiries', href: '/admin/enquiries', icon: Mail },
    { name: 'Products', href: '/admin/products', icon: Box },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { name: 'Homepage Builder', href: '/admin/homepage', icon: HomeIcon },
    { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800 text-zinc-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
        <Link to="/admin" className="text-xl font-bold tracking-tight text-white font-serif">
          ELISA DECOR
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto font-sans">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-600/10 text-emerald-400 border-l-4 border-emerald-500 pl-3'
                  : 'hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 font-sans">
        <button
          onClick={onProfileClick}
          className="w-full text-left px-4 py-3 mb-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col focus:outline-none"
        >
          <p className="text-sm font-semibold text-white truncate">{adminName}</p>
          <p className="text-xs text-zinc-500 truncate font-mono">{adminEmail}</p>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800 text-white fixed top-0 w-full z-45">
        <span className="text-lg font-bold tracking-tight font-serif">ELISA DECOR</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1 rounded-md text-zinc-400 hover:text-white focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        <SidebarContent />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity"
        />
      )}

      {/* Mobile Sidebar (Slide Over) */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
}
