import { ArrowRight, Search, Calendar, MapPin, Tag, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import { reportService, type Report } from '../services/reportService';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Hero() {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  const handleCreateReport = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/buat-laporan' } });
    } else {
      navigate('/buat-laporan');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setError('Masukkan ID laporan');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await reportService.getReportById(searchId);
      setSearchResult(data.data);
    } catch (err) {
      setError('Laporan tidak ditemukan');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'IN_REVIEW':  return 'Menunggu Ditinjau';
      case 'IN_PROGRESS': return 'Sedang Diproses';
      case 'RESOLVED':   return 'Selesai';
      case 'REJECTED':   return 'Ditolak';
      default:           return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'IN_REVIEW':  return { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100'   };
      case 'IN_PROGRESS': return { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700',    badge: 'bg-blue-100'    };
      case 'RESOLVED':   return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100' };
      case 'REJECTED':   return { bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     badge: 'bg-red-100'     };
      default:           return { bg: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-700',   badge: 'bg-slate-100'   };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'IN_REVIEW':  return <Clock className="w-5 h-5" />;
      case 'IN_PROGRESS': return <AlertCircle className="w-5 h-5" />;
      case 'RESOLVED':   return <CheckCircle2 className="w-5 h-5" />;
      case 'REJECTED':   return <AlertCircle className="w-5 h-5" />;
      default:           return <FileText className="w-5 h-5" />;
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'IN_REVIEW':  return 33;
      case 'IN_PROGRESS': return 66;
      case 'RESOLVED':   return 100;
      default:           return 0;
    }
  };

  const colors = searchResult ? getStatusColor(searchResult.status) : { bg: '', border: '', text: '', badge: '' };

  return (
    <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-40 overflow-hidden bg-white flex items-center">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="src/assets/hero_bg.jpg"
          alt="City aerial view"
          className="w-full h-full object-cover"
        />
        {/* overlay putih ringan */}
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
        {/* gradient utama atas-ke-bawah */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/30 to-white" />
      </div>

      {/* Konten */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto space-y-8">

          <h1 data-aos="fade-up" className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Layanan Pengaduan Publik{' '}
            <span className="text-blue-600">Terbuka & Transparan.</span>
          </h1>

          <p data-aos="fade-up" data-aos-delay="100" className="text-lg sm:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Sampaikan laporan, aspirasi, permintaan, informasi, maupun pengaduan langsung kepada instansi berwenang. Semua laporan diproses secara transparan dan rahasia.
          </p>

          <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleCreateReport}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Tulis Laporan Baru
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <form onSubmit={handleSearch} className="w-full sm:w-auto relative flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Lacak ID Laporan..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-xl font-medium text-slate-900 transition-all shadow-sm placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl font-bold transition-all"
              >
                {loading ? '...' : 'Cari'}
              </button>
            </form>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {searchResult && (
            <div className={`max-w-2xl mx-auto border-2 rounded-xl p-6 space-y-4 ${colors.border} ${colors.bg} text-left`}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${colors.badge}`}>{getStatusIcon(searchResult.status)}</div>
                  <span className={`text-sm font-bold ${colors.text}`}>{getStatusLabel(searchResult.status)}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 line-clamp-2">{searchResult.title}</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Progress</span>
                  <span className={`font-bold ${colors.text}`}>{getProgressPercentage(searchResult.status)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      searchResult.status.toUpperCase() === 'REJECTED'   ? 'bg-red-500'
                      : searchResult.status.toUpperCase() === 'RESOLVED'  ? 'bg-emerald-500'
                      : searchResult.status.toUpperCase() === 'IN_PROGRESS' ? 'bg-blue-500'
                      : 'bg-amber-500'
                    }`}
                    style={{ width: `${getProgressPercentage(searchResult.status)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700 uppercase">Tahapan</p>
                <div className="flex items-center justify-between gap-2">
                  {[
                    { label: 'Menunggu', icon: Clock, active: ['PENDING','IN_REVIEW','IN_PROGRESS','RESOLVED'], color: 'bg-amber-100 text-amber-700' },
                    { label: 'Proses',   icon: AlertCircle, active: ['IN_PROGRESS','RESOLVED'], color: 'bg-blue-100 text-blue-700' },
                    { label: 'Selesai',  icon: CheckCircle2, active: ['RESOLVED'], color: 'bg-emerald-100 text-emerald-700' },
                  ].map((s, i, arr) => {
                    const Icon = s.icon;
                    const isActive = s.active.includes(searchResult.status.toUpperCase());
                    return (
                      <>
                        <div key={s.label} className="flex-1 text-center text-xs">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${isActive ? s.color : 'bg-slate-200 text-slate-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-slate-700">{s.label}</span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className={`flex-1 h-0.5 rounded-full ${arr[i+1].active.includes(searchResult.status.toUpperCase()) ? 'bg-blue-500' : 'bg-slate-200'}`} />
                        )}
                      </>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-current border-opacity-10">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">ID</p>
                  <p className="text-xs font-mono text-slate-900 mt-1 break-all">{searchResult.id}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-500 uppercase">Tanggal</p>
                  </div>
                  <p className="text-xs text-slate-900 mt-1">{new Date(searchResult.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                {searchResult.category && (
                  <div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-500 uppercase">Kategori</p>
                    </div>
                    <p className="text-xs text-slate-900 mt-1">{searchResult.category.name}</p>
                  </div>
                )}
                {searchResult.address && (
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-500 uppercase">Lokasi</p>
                    </div>
                    <p className="text-xs text-slate-900 mt-1 line-clamp-1">{searchResult.address}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate(`/laporan/${searchResult.id}`)}
                className="mt-4 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-2"
              >
                Lihat Detail Lengkap
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

    </section>
  );
}