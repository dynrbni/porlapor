import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Loader, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Konfirmasi password tidak cocok dengan password.');
      return;
    }

    if (password.length < 6) {
      setError('Password harus minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        nama,
        email,
        password,
        passwordConfirm,
      });
      if (response.status === 'success') {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800">
      {/* Kolom Kanan: Dekorasi/Gambar (di sini dipindah ke kiri agar bervariasi asimetris, atau tetap di kanan) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-blue-950 flex-col justify-between">
        <img 
          src="src/assets/hero_bg.jpg" 
          alt="Latar Belakang PorLapor" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/80 to-blue-900/40"></div>
        
        <div className="relative z-10 p-12 xl:p-16 w-full flex-1 flex flex-col justify-end">
          <div className="max-w-xl">
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight text-white mb-6">
              Jadilah Bagian dari <span className="text-blue-400">Solusi Publik</span>
            </h2>
            <ul className="space-y-4 mb-8 text-blue-100">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <span className="leading-relaxed">Pantau langsung status laporan Anda secara real-time dan transparan.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <span className="leading-relaxed">Identitas dijamin aman dan diproses oleh instansi terkait.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <span className="leading-relaxed">Mendukung kemajuan pelayanan publik di masa depan.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Kolom Kiri/Kanan: Form */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto">
        {/* Tombol Kembali / Logo (Mobile) */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Beranda</span>
          </Link>
        </div>

        <div className="lg:hidden absolute top-6 right-6">
          <img src="src/assets/porlapor_logo.png" alt="PorLapor" className="h-8 w-auto" />
        </div>

        <div className="w-full max-w-md mt-16 lg:mt-6">
          <div className="mb-8 lg:mb-10 lg:text-center">
            <img src="src/assets/porlapor_logo.png" alt="PorLapor" className="h-10 w-auto mb-6 hidden lg:inline-block" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Buat Akun Baru</h1>
            <p className="text-slate-500 text-sm sm:text-base">Daftar secara gratis untuk mulai melaporkan masalah di sekitar Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 flex gap-3 text-red-800 rounded-md">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-slate-700 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  placeholder="Ketik nama lengkap Anda"
                  className="block w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min. 6 Karakter"
                    className="block w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <span className="text-xs font-semibold">Sembunyikan</span> : <span className="text-xs font-semibold">Lihat</span>}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="passwordConfirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    placeholder="Ulangi Password"
                    className="block w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <span className="text-xs font-semibold">Sembunyikan</span> : <span className="text-xs font-semibold">Lihat</span>}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input type="checkbox" required className="peer w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 focus:ring-2 appearance-none checked:bg-blue-600 checked:border-blue-600 transition-all" />
                  <svg className="absolute w-4 h-4 pointer-events-none text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 10 9 15 16 5" />
                  </svg>
                </div>
                <span className="text-slate-600 text-sm leading-relaxed">
                  Saya setuju dengan{' '}
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    Syarat, Ketentuan & Kebijakan Privasi
                  </a>{' '}
                  yang berlaku.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:shadow-none flex justify-center items-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Daftar Akun Sekarang'
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-8">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
