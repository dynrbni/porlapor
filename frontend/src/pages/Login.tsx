import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 20,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.token || response.message) {
        const user = authService.getUser();
        if (user?.role === 'SUPERADMIN') {
          navigate('/admin');
        } else if (user?.role === 'ADMIN') {
          navigate('/admin');
        } else if (user?.role === 'AGENCY') {
          navigate('/agency');
        } else {
          navigate('/dashboard');
        }
        window.location.reload(); 
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800 overflow-hidden">

      {/* ── Kolom Kiri: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">

        {/* Tombol Kembali */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8" data-aos="fade-down">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Beranda</span>
          </Link>
        </div>

        <div className="w-full max-w-sm mt-16 lg:mt-0">

          {/* Header — tanpa logo */}
          <div className="mb-10" data-aos="fade-up" data-aos-delay="50">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
              Selamat Datang 👋
            </h1>
            <p className="text-slate-500 text-sm">
              Masuk menggunakan akun PorLapor Anda untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 flex gap-3 text-red-700 rounded-lg" data-aos="fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email */}
            <div data-aos="fade-up" data-aos-delay="100">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-[18px] w-[18px] text-slate-400" />
                </div>
                <input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required placeholder="contoh@email.com"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div data-aos="fade-up" data-aos-delay="150">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px] text-slate-400" />
                </div>
                <input
                  id="password" type={showPassword ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required placeholder="Masukkan password Anda"
                  className="block w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div data-aos="fade-up" data-aos-delay="180">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer" />
                <span className="text-sm text-slate-600">Ingat saya</span>
              </label>
            </div>

            {/* Submit */}
            <div data-aos="fade-up" data-aos-delay="210">
              <button
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/25 disabled:shadow-none flex justify-center items-center gap-2 text-sm"
              >
                {loading ? (
                  <><Loader className="w-4 h-4 animate-spin" />Memproses...</>
                ) : 'Masuk Sekarang'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-7 flex items-center gap-4" data-aos="fade-up" data-aos-delay="240">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">Belum Memiliki Akun?</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Register Link */}
          <div data-aos="fade-up" data-aos-delay="270" className="mt-5">
            <Link
              to="/register"
              className="block w-full text-center py-3.5 px-4 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all"
            >
              Buat Akun Baru
            </Link>
          </div>
        </div>
      </div>

      {/* ── Kolom Kanan: Visual ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col">
        <img
          src="src/assets/hero_bg.jpg"
          alt="PorLapor"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/70 to-slate-900" />

        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />

        {/* Logo di pojok atas panel foto */}
        <div className="relative z-10 p-12 xl:p-16">
          <img src="src/assets/porlapor_logo.png" alt="PorLapor" className="h-17 w-auto object-contain brightness-0 invert opacity-80 mt-[-20px]" />
        </div>

        {/* Main copy */}
        <div className="relative z-10 flex flex-col justify-end flex-1 px-12 pb-12 xl:px-16 xl:pb-16">
          <div className="max-w-lg" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-white mb-5">
              Suara Anda Membawa{' '}
              <span className="text-blue-400">Perubahan</span>
            </h2>
            <p className="text-blue-100/70 text-base leading-relaxed mb-8 font-medium">
              Bergabunglah dengan ribuan masyarakat dalam menciptakan layanan publik yang lebih
              baik, transparan, dan terpercaya melalui PorLapor.
            </p>
            <p className="text-blue-200/40 text-xs">
              &copy; {new Date().getFullYear()} PorLapor. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}