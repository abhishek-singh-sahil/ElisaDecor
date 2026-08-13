import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/SEO';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data?.user) {
          navigate('/admin');
        }
      } catch (err) {
        // No session active
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        navigate('/admin');
      } else {
        setError(response.data.error || 'Invalid credentials');
      }
    } catch (err) {
      if (err.message === 'Network Error' || !err.response) {
        setError('Cannot connect to the backend server. Please verify it is running on port 5000.');
      } else {
        setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4 py-12 sm:px-6 lg:px-8">
      <SEO title="Admin Login | Elisa Decor" noIndex={true} />
      <div className="w-full max-w-md space-y-8 bg-zinc-800 p-8 rounded-xl shadow-2xl border border-zinc-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white font-serif">
            ELISA DECOR
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-sans">
            Administrative Control Panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-900/50 p-4 border border-red-500/50">
              <p className="text-sm text-red-200 text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-zinc-300">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-zinc-450 focus:border-zinc-550 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm"
                placeholder="admin@elisadecor.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-zinc-600 bg-zinc-700 px-3 py-2 pr-10 text-white placeholder-zinc-455 focus:border-zinc-555 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-emerald-600 py-2.5 px-4 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin -ml-1 mr-2" size={18} />
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
