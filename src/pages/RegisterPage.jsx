import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm]       = useState({ name: '', email: '', password: '', terms: false });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!form.terms) {
      setError('You must agree to the Terms of Service.');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/feed', { replace: true });
    } catch (err) {
      if (err.errors) {
        const map = {};
        err.errors.forEach((e) => { map[e.field] = e.message; });
        setFieldErrors(map);
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] font-[Plus_Jakarta_Sans,sans-serif] text-slate-900 antialiased">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-6 md:px-20 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Logo />
        <div className="hidden md:flex gap-6 items-center">
          <span className="text-sm font-medium text-slate-600 hover:text-[#137fec] transition-colors cursor-pointer">Features</span>
          <span className="text-sm font-medium text-slate-600 hover:text-[#137fec] transition-colors cursor-pointer">Safety</span>
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-[#137fec] border border-[#137fec]/20 bg-[#137fec]/5 rounded-lg hover:bg-[#137fec]/10 transition-all">
            Log In
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-12 items-center">

          {/* Left promo panel */}
          <div className="hidden lg:flex flex-col gap-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-[#137fec] uppercase bg-[#137fec]/10 rounded-full">New Generation</span>
              <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900">
                Connect with the <span className="text-[#137fec]">world</span> around you.
              </h1>
              <p className="text-lg text-slate-600 max-w-md">
                Join millions of people sharing their stories, discovering new trends, and building meaningful connections.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="material-symbols-outlined text-[#137fec] mb-2 block">groups</span>
                <h3 className="font-bold text-slate-900">Communities</h3>
                <p className="text-sm text-slate-500">Find your niche and vibe.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="material-symbols-outlined text-[#137fec] mb-2 block">security</span>
                <h3 className="font-bold text-slate-900">Privacy First</h3>
                <p className="text-sm text-slate-500">Your data, your control.</p>
              </div>
            </div>
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#137fec] to-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[80px] opacity-30">diversity_3</span>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-lg">Where stories come alive</p>
            </div>
          </div>

          {/* Register form */}
          <div className="w-full max-w-[480px] mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Create Account</h2>
              <p className="text-slate-500">Join our community today and start sharing.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] transition-all outline-none ${fieldErrors.name ? 'border-red-400' : 'border-slate-200'}`}
                    placeholder="Enter your name"
                  />
                </div>
                {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] transition-all outline-none ${fieldErrors.email ? 'border-red-400' : 'border-slate-200'}`}
                    placeholder="name@example.com"
                  />
                </div>
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                  <input
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border rounded-xl text-slate-900 focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] transition-all outline-none ${fieldErrors.password ? 'border-red-400' : 'border-slate-200'}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#137fec] transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">{showPwd ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {fieldErrors.password
                  ? <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                  : <p className="mt-1 text-[11px] text-slate-500">Minimum 6 characters.</p>}
              </div>

              {/* Terms */}
              <div className="flex items-center gap-2 py-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={form.terms}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-[#137fec] focus:ring-[#137fec]"
                />
                <label htmlFor="terms" className="text-xs text-slate-500">
                  I agree to the{' '}
                  <span className="text-[#137fec] font-semibold cursor-pointer hover:underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-[#137fec] font-semibold cursor-pointer hover:underline">Privacy Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#137fec] hover:bg-[#137fec]/90 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#137fec]/25 active:scale-[0.98]"
              >
                {loading ? 'Creating account…' : 'Create My Account'}
              </button>
            </form>

            {/* Bottom */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#137fec] font-bold hover:underline">Log In</Link>
                </p>
                <div className="flex items-center w-full gap-4">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or sign up with</span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.25.81-.59z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-xs font-semibold">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-xs font-semibold">Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 md:px-20 py-8 text-center">
        <p className="text-xs text-slate-400">© 2024 SocialMedia Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RegisterPage;
