import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Lock, Phone, CreditCard, MapPin,
  Calendar, AlertCircle, Loader, ArrowLeft, Eye, EyeOff,
  ChevronDown,
} from 'lucide-react';
import { authService } from '../services/authService';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ─── Types ────────────────────────────────────────────────────────────────────
type Gender = 'LAKI_LAKI' | 'PEREMPUAN' | '';

interface FormState {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  nik: string;
  address: string;
  birthDate: string;
  gender: Gender;
}

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Akun' },
  { id: 2, label: 'Identitas' },
  { id: 3, label: 'Selesai' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    nik: '',
    address: '',
    birthDate: '',
    gender: '',
  });

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 20,
    });
  }, []);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validateStep1 = (): boolean => {
    setError('');
    if (!form.name.trim()) { setError('Nama lengkap wajib diisi.'); return false; }
    if (!form.email.trim()) { setError('Alamat email wajib diisi.'); return false; }
    if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return false; }
    if (form.password !== form.passwordConfirm) { setError('Konfirmasi password tidak cocok.'); return false; }
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    setError('');
    setStep((s) => s + 1);
    setTimeout(() => AOS.refreshHard(), 50);
  };

  const goBack = () => {
    setError('');
    setStep((s) => s - 1);
    setTimeout(() => AOS.refreshHard(), 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError('Anda harus menyetujui syarat dan ketentuan.'); return; }
    setError('');
    setLoading(true);
    try {
      const response = await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        nik: form.nik || undefined,
        address: form.address || undefined,
        birthDate: form.birthDate || undefined,
        gender: (form.gender as Gender) || undefined,
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

  const inputCls =
    'block w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-400';

  const labelCls = 'block text-sm font-semibold text-slate-700 mb-2';

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800 overflow-hidden">

      {/* ── Kolom Kiri: Visual ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col">
        <img
          src="src/assets/hero_bg.jpg"
          alt="PorLapor"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-slate-900/75 to-slate-900" />

        {/* Decorative blobs */}
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-10 -left-10 w-72 h-72 rounded-full bg-indigo-400/10 blur-3xl" />

        {/* Logo di pojok atas panel foto */}
        <div className="relative z-10 p-12 xl:p-16">
          <img src="src/assets/porlapor_logo.png" alt="PorLapor" className="h-17 w-auto object-contain brightness-0 invert opacity-80 mt-[-20px] ml-[-20px]" />
        </div>

        {/* Main copy */}
        <div className="relative z-10 flex flex-col justify-end flex-1 px-12 pb-12 xl:px-16 xl:pb-16">
          <div className="max-w-lg" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-white mb-5">
              Jadilah Bagian dari{' '}
              <span className="text-blue-400">Solusi Publik</span>
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

      {/* ── Kolom Kanan: Form ── */}
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
          <div className="mb-5" data-aos="fade-up" data-aos-delay="50">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
              Buat Akun Baru
            </h1>
            <p className="text-slate-500 text-sm">
              Daftar gratis, mulai melaporkan masalah di sekitar Anda.
            </p>
          </div>

          {/* ── Step Indicator ── */}
          <div className="mb-5" data-aos="fade-up" data-aos-delay="80">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                      ${step > s.id
                        ? 'bg-blue-600 text-white'
                        : step === s.id
                          ? 'bg-blue-600 text-white ring-4 ring-blue-600/20'
                          : 'bg-slate-100 text-slate-400'}`}>
                      {step > s.id ? '✓' : s.id}
                    </div>
                    <span className={`text-xs font-semibold whitespace-nowrap ${step >= s.id ? 'text-blue-600' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px bg-slate-200 relative">
                      <div className={`absolute inset-y-0 left-0 bg-blue-600 transition-all duration-500 ${step > s.id ? 'w-full' : 'w-0'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Error Banner ── */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex gap-3 text-red-700 rounded-lg mb-5" data-aos="fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* ── STEP 1 — Data Akun ── */}
          {step === 1 && (
            <div className="space-y-5">

              <div data-aos="fade-up" data-aos-delay="100">
                <label htmlFor="name" className={labelCls}>
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-[18px] w-[18px] text-slate-400" />
                  </div>
                  <input id="name" type="text" value={form.name} onChange={set('name')} required placeholder="Nama sesuai KTP" className={inputCls} />
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="130">
                <label htmlFor="email" className={labelCls}>
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-[18px] w-[18px] text-slate-400" />
                  </div>
                  <input id="email" type="email" value={form.email} onChange={set('email')} required placeholder="contoh@email.com" className={inputCls} />
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="160">
                <label htmlFor="password" className={labelCls}>
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-[18px] w-[18px] text-slate-400" />
                  </div>
                  <input
                    id="password" type={showPassword ? 'text' : 'password'}
                    value={form.password} onChange={set('password')} required
                    placeholder="Min. 6 karakter"
                    className="block w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="190">
                <label htmlFor="passwordConfirm" className={labelCls}>
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-[18px] w-[18px] text-slate-400" />
                  </div>
                  <input
                    id="passwordConfirm" type={showConfirm ? 'text' : 'password'}
                    value={form.passwordConfirm} onChange={set('passwordConfirm')} required
                    placeholder="Ulangi password"
                    className="block w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                    aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}>
                    {showConfirm ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="220">
                <button type="button" onClick={goNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/25 text-sm">
                  Lanjut →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 — Data Identitas ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">

              <p className="text-sm text-slate-500" data-aos="fade-up">
                Semua field opsional — membantu verifikasi identitas Anda.
              </p>

              <div data-aos="fade-up" data-aos-delay="60">
                <label htmlFor="phone" className={labelCls}>Nomor Telepon</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-[18px] w-[18px] text-slate-400" />
                  </div>
                  <input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="08xxxxxxxxxx" className={inputCls} />
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="100">
                <label htmlFor="nik" className={labelCls}>NIK (KTP)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <CreditCard className="h-[18px] w-[18px] text-slate-400" />
                  </div>
                  <input id="nik" type="text" value={form.nik} onChange={set('nik')} maxLength={16} placeholder="16 digit NIK sesuai KTP" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div data-aos="fade-up" data-aos-delay="140">
                  <label htmlFor="birthDate" className={labelCls}>Tanggal Lahir</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Calendar className="h-[18px] w-[18px] text-slate-400" />
                    </div>
                    <input id="birthDate" type="date" value={form.birthDate} onChange={set('birthDate')} className={inputCls} />
                  </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="170">
                  <label htmlFor="gender" className={labelCls}>Jenis Kelamin</label>
                  <div className="relative">
                    <select id="gender" value={form.gender} onChange={set('gender')}
                      className="block w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all appearance-none cursor-pointer">
                      <option value="">-- Pilih --</option>
                      <option value="LAKI_LAKI">Laki-laki</option>
                      <option value="PEREMPUAN">Perempuan</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <ChevronDown className="h-[18px] w-[18px] text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="200">
                <label htmlFor="address" className={labelCls}>Alamat Lengkap</label>
                <div className="relative">
                  <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                    <MapPin className="h-[18px] w-[18px] text-slate-400" />
                  </div>
                  <textarea id="address" value={form.address} onChange={set('address')} rows={2}
                    placeholder="Jl. Contoh No. 1, Kelurahan, Kota"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-400 resize-none" />
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="220">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer flex-shrink-0" />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    Saya menyetujui{' '}
                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                      Syarat, Ketentuan &amp; Kebijakan Privasi
                    </a>.
                  </span>
                </label>
              </div>

              <div className="flex gap-3" data-aos="fade-up" data-aos-delay="260">
                <button type="button" onClick={goBack}
                  className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all">
                  ← Kembali
                </button>
                <button type="submit" disabled={loading}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-600/25 disabled:shadow-none flex justify-center items-center gap-2 transition-all">
                  {loading ? (
                    <><Loader className="w-4 h-4 animate-spin" />Memproses...</>
                  ) : 'Daftar Sekarang'}
                </button>
              </div>
            </form>
          )}

          {/* Divider + Login Link */}
          <div className="mt-7 flex items-center gap-4" data-aos="fade-up" data-aos-delay="280">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">Sudah Punya Akun?</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div data-aos="fade-up" data-aos-delay="300" className="mt-5">
            <Link to="/login"
              className="block w-full text-center py-3.5 px-4 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all">
              Masuk di Sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}