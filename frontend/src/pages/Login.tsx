import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      if (response.status === 'success') {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800">
      {/* Kolom Kiri: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Tombol Kembali / Logo (Mobile) */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="lg:hidden absolute top-6 right-6">
          <img src="src/assets/porlapor_logo.png" alt="PorLapor" className="h-8 w-auto" />
        </div>

        <div className="w-full max-w-sm mt-16 lg:mt-0">
          <div className="mb-10 lg:mb-12">
            <img src="src/assets/porlapor_logo.png" alt="PorLapor" className="h-12 w-auto mb-8 hidden lg:block" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Selamat Datang 👋</h1>
            <p className="text-slate-500 text-sm sm:text-base">Silakan masuk menggunakan akun PorLapor Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 flex gap-3 text-red-800 rounded-md">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="contoh@email.com"
                    className="block w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Masukkan password Anda"
                    className="block w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 focus:ring-2 appearance-none checked:bg-blue-600 checked:border-blue-600 transition-all" />
                  <svg className="absolute w-4 h-4 pointer-events-none text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 10 9 15 16 5" />
                  </svg>
                </div>
                <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Ingat saya</span>
              </label>
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                Lupa Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:shadow-none flex justify-center items-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk Sekarang'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 text-sm flex items-center gap-4 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
            belum punya akun?
          </div>

          <div className="mt-8">
            <Link 
              to="/register" 
              className="block w-full text-center py-3.5 px-4 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              Buat Akun Baru
            </Link>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Dekorasi/Gambar */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-blue-950">
        <img 
          src="src/assets/hero_bg.jpg" 
          alt="Latar Belakang PorLapor" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/60 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-12 xl:p-16">
          <div className="max-w-xl">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-white mb-6">
              Suara Anda Membawa <span className="text-blue-400 border-b-4 border-blue-400 pb-1">Perubahan</span>
            </h2>
            <p className="text-blue-100/80 text-lg leading-relaxed">
              Bergabunglah dengan ribuan masyarakat lainnya dalam menciptakan layanan publik yang lebih baik, transparan, dan terpercaya melalui platform PorLapor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
