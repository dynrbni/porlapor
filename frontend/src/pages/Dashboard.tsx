import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import { reportService } from '../services/reportService';
import type { Report } from '../services/reportService';
import { Link, useNavigate } from 'react-router-dom';
import ReportCard from '../components/ReportCard';
import Header from '../components/Header';
import { Activity, ArrowRight, CheckCircle2, Clock3, Inbox, LayoutDashboard, MapPin, Sparkles, User } from 'lucide-react';
import { getPhotoUrl } from '../services/authService';

type Tab = 'semua' | 'belum' | 'proses' | 'selesai';

const Dashboard = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('semua');
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  const fetchUserAndReports = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getUser();
      if (!currentUser) {
        setUser(null);
        setReports([]);
        return;
      }
      setUser(currentUser);

      const response = await reportService.getUserReports(currentUser.id);
      const data = Array.isArray(response) ? response : response.data;
      if (data) {
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndReports();
  }, []);

  const filteredReports = reports.filter(r => {
    switch(activeTab) {
      case 'belum': return r.status === 'PENDING' || r.status === 'IN_REVIEW';
      case 'proses': return r.status === 'IN_PROGRESS';
      case 'selesai': return r.status === 'RESOLVED';
      default: return true;
    }
  });

  const myReports = reports.filter(r => r.user?.id === user?.id);
  const totalMyReports = myReports.length;
  const inProgressMyReports = myReports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'PENDING' || r.status === 'IN_REVIEW').length;
  const doneMyReports = myReports.filter(r => r.status === 'RESOLVED').length;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' || user?.role === 'AGENCY';
  const sortedMyReports = [...myReports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const recentMyReports = sortedMyReports.slice(0, 3);

  const dashboardTabs: Array<{ key: Tab; label: string; count: number }> = [
    { key: 'semua', label: 'Semua', count: totalMyReports },
    { key: 'belum', label: 'Menunggu', count: myReports.filter(r => r.status === 'PENDING' || r.status === 'IN_REVIEW').length },
    { key: 'proses', label: 'Proses', count: myReports.filter(r => r.status === 'IN_PROGRESS').length },
    { key: 'selesai', label: 'Selesai', count: doneMyReports },
  ];

  const statusBreakdown = [
    {
      label: 'Menunggu',
      count: myReports.filter(r => r.status === 'PENDING' || r.status === 'IN_REVIEW').length,
      tone: 'bg-amber-500',
    },
    {
      label: 'Diproses',
      count: myReports.filter(r => r.status === 'IN_PROGRESS').length,
      tone: 'bg-blue-500',
    },
    {
      label: 'Selesai',
      count: doneMyReports,
      tone: 'bg-emerald-500',
    },
  ];

  const quickStats = [
    {
      label: 'Total laporan',
      value: totalMyReports,
      icon: Inbox,
      tone: 'text-blue-700 bg-blue-50 border-blue-100',
    },
    {
      label: 'Sedang diproses',
      value: inProgressMyReports,
      icon: Activity,
      tone: 'text-amber-700 bg-amber-50 border-amber-100',
    },
    {
      label: 'Selesai',
      value: doneMyReports,
      icon: CheckCircle2,
      tone: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    },
  ];

  const totalStatus = Math.max(totalMyReports, 1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200 flex flex-col relative w-full overflow-x-hidden">
      <Header />
      <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0))] pointer-events-none" />

      <main className="relative flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-28 sm:pt-32 pb-8 text-left">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="w-full space-y-6 sm:space-y-8">
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_320px] lg:items-end">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    Dashboard Warga
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                      {(() => {
                        const url = getPhotoUrl(user?.photoUrl);
                        return url ? (
                          <img src={url} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-slate-400">
                            {user?.nama?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="space-y-1">
                      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Halo, {user?.nama || 'Pengguna'}.
                      </h1>
                      <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                        Ini ringkasan laporan kamu di PorLapor. Fokus ke status terbaru, laporan yang masih jalan, dan hal penting yang perlu ditindaklanjuti.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      {totalMyReports} laporan tercatat
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                      <Clock3 className="h-3.5 w-3.5" />
                      {inProgressMyReports} sedang diproses
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {doneMyReports} selesai
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                  <button
                    onClick={() => navigate('/buat-laporan')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
                  >
                    + Buat Laporan Baru
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-100"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
                  >
                    Keluar
                  </button>
                </div>
              </div>

              <div className="grid gap-3 border-t border-slate-100 px-6 py-5 sm:grid-cols-3 sm:px-8">
                {quickStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div key={stat.label} className={`flex items-center justify-between rounded-2xl border p-4 ${stat.tone}`}>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_360px] lg:items-start">
              <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Laporan Saya</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">Daftar laporan terbaru</h2>
                  </div>

                  <div className="inline-flex w-full rounded-2xl bg-slate-100 p-1 sm:w-auto">
                    {dashboardTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 rounded-xl px-4 py-2 text-sm font-bold transition-all sm:flex-none ${activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {tab.label}
                          <span className={`rounded-full px-2 py-0.5 text-[11px] ${activeTab === tab.key ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/80 text-slate-500'}`}>
                            {tab.count}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-5 sm:px-6">
                  {filteredReports.length > 0 ? (
                    <div className="space-y-5">
                      {filteredReports.map((report) => (
                        <ReportCard
                          key={report.id}
                          report={report}
                          user={report.user || user}
                          currentUser={user}
                          onLikeToggle={fetchUserAndReports}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-8 py-16 text-center text-slate-500">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                        <Inbox className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">Belum ada data di filter ini</h3>
                      <p className="text-sm text-slate-500">Coba pindah tab atau buat laporan baru kalau memang belum ada kiriman masuk.</p>
                    </div>
                  )}
                </div>
              </section>

              <aside className="space-y-6 lg:sticky lg:top-6">
                <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Profil Singkat</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">Akun kamu</h2>
                  </div>

                  <div className="space-y-5 px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        {(() => {
                          const url = getPhotoUrl(user?.photoUrl);
                          return url ? (
                            <img src={url} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xl font-bold text-slate-400">
                              {user?.nama?.charAt(0)?.toUpperCase() || <User className="w-6 h-6" />}
                            </div>
                          );
                        })()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{user?.nama || 'Pengguna'}</p>
                        <p className="text-xs text-slate-500">{user?.email || 'Akun aktif'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Total', value: totalMyReports },
                        { label: 'Proses', value: inProgressMyReports },
                        { label: 'Selesai', value: doneMyReports },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-4 text-center">
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                          <p className="mt-1 text-xl font-bold text-slate-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Status Cepat</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">Sebaran laporan</h2>
                  </div>

                  <div className="space-y-4 px-6 py-6">
                    {statusBreakdown.map((item) => {
                      const percent = (item.count / totalStatus) * 100;

                      return (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-700">{item.label}</span>
                            <span className="font-bold text-slate-900">{item.count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100">
                            <div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Aktivitas Terbaru</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">3 laporan terakhir</h2>
                  </div>

                  <div className="space-y-3 px-6 py-5">
                    {recentMyReports.length > 0 ? recentMyReports.map((report) => (
                      <Link
                        key={report.id}
                        to={`/dashboard/report/${report.id}`}
                        className="block rounded-2xl border border-slate-200 px-4 py-3 transition-colors hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">{report.title}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="truncate">{report.address || `${report.latitude}, ${report.longitude}`}</span>
                            </div>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                            {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </Link>
                    )) : (
                      <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
                        Belum ada laporan untuk ditampilkan di sini.
                      </div>
                    )}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
