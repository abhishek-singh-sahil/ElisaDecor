import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Box, Image as ImageIcon, PlusCircle, ExternalLink, Calendar, UserCheck, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/SEO';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/auth/dashboard');
        setMetrics(res.data.metrics);
        setRecentEnquiries(res.data.recentEnquiries || []);
      } catch (err) {
        console.error('Failed to fetch dashboard metrics:', err);
        setError('Failed to load dashboard summaries.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-zinc-400">
        <Loader2 className="animate-spin text-emerald-500 mr-2" size={24} />
        Loading dashboard insights...
      </div>
    );
  }

  const cards = [
    { name: 'Total Enquiries', value: metrics?.totalEnquiries || 0, icon: Mail, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'New Enquiries', value: metrics?.newEnquiries || 0, icon: Mail, color: 'text-amber-500 bg-amber-500/10' },
    { name: 'In Progress', value: metrics?.inProgressEnquiries || 0, icon: UserCheck, color: 'text-purple-500 bg-purple-500/10' },
    { name: 'Total Products', value: metrics?.totalProducts || 0, icon: Box, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Media Library Assets', value: metrics?.totalMedia || 0, icon: ImageIcon, color: 'text-pink-500 bg-pink-500/10' },
  ];

  return (
    <div className="space-y-8 font-sans">
      <SEO title="Admin Dashboard | Elisa Decor" noIndex={true} />
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-serif">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Welcome to the Elisa Decor administrative console. Here is your overview.
        </p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500/50 p-4 rounded-xl text-center text-red-200">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{card.name}</span>
                <span className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action panel & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between lg:col-span-1">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 font-serif">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/admin/products"
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white transition-colors text-sm"
              >
                <span className="flex items-center gap-2">
                  <Box size={16} className="text-emerald-400" />
                  Manage Products
                </span>
                <PlusCircle size={16} />
              </Link>
              <Link
                to="/admin/enquiries"
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white transition-colors text-sm"
              >
                <span className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-400" />
                  View Enquiries
                </span>
                <ExternalLink size={16} />
              </Link>
              <Link
                to="/admin/media"
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white transition-colors text-sm"
              >
                <span className="flex items-center gap-2">
                  <ImageIcon size={16} className="text-pink-400" />
                  Upload Media
                </span>
                <PlusCircle size={16} />
              </Link>
              <Link
                to="/admin/homepage"
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white transition-colors text-sm"
              >
                <span className="flex items-center gap-2">
                  <HomeIcon className="text-amber-400 h-4 w-4" />
                  Homepage Builder
                </span>
                <ExternalLink size={16} />
              </Link>
            </div>
          </div>
          <div className="pt-6 mt-6 border-t border-zinc-800">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
            >
              View Live Website <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white font-serif">Recent Enquiries</h3>
            <Link to="/admin/enquiries" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
              View All
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-sm">
              No enquiries logged yet.
            </div>
          ) : (
            <div className="space-y-4">
              {recentEnquiries.map((enquiry) => (
                <div
                  key={enquiry._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/30 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{enquiry.name}</p>
                    <p className="text-xs text-zinc-400">
                      Enquired about:{' '}
                      <span className="text-zinc-200 font-medium">
                        {enquiry.productNameSnapshot || 'General Enquiry'}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <Calendar size={10} />
                      {new Date(enquiry.createdAt).toLocaleDateString()} at{' '}
                      {new Date(enquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        enquiry.status === 'NEW'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : enquiry.status === 'CLOSED'
                          ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const HomeIcon = ({ className, size = 16 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
};
