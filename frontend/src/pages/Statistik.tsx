import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getStats, type ReportStats, type Report } from '../services/reportService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileText, Building2, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  IN_REVIEW: '#8B5CF6',
  IN_PROGRESS: '#3B82F6',
  RESOLVED: '#10B981',
  REJECTED: '#EF4444',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Menunggu',
  IN_REVIEW: 'Ditinjau',
  IN_PROGRESS: 'Diproses',
  RESOLVED: 'Selesai',
  REJECTED: 'Ditolak',
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-700';
    case 'IN_REVIEW': return 'bg-purple-100 text-purple-700';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
    case 'RESOLVED': return 'bg-green-100 text-green-700';
    case 'REJECTED': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusLabel = (status: string) => STATUS_LABELS[status] || status;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const Statistik: React.FC = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.refresh();
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const summaryCards = [
    { icon: FileText, label: 'Total Laporan', value: stats?.totalReports ?? 0, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Building2, label: 'Instansi Aktif', value: stats?.totalAgencies ?? 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Users, label: 'Pengguna Terdaftar', value: stats?.totalUsers ?? 0, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const pieData = (stats?.reportsByStatus ?? []).map((s) => ({
    name: getStatusLabel(s.status),
    value: s.count,
    color: STATUS_COLORS[s.status] || '#94A3B8',
  }));

  const barData = (stats?.reportsByAgency ?? []).map((a) => ({
    name: a.agencyName.length > 16 ? a.agencyName.slice(0, 16) + '...' : a.agencyName,
    count: a.count,
  }));

  const lineData = stats?.dailyReports ?? [];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 z-10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/60 via-slate-50/80 to-transparent pointer-events-none"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <h1 data-aos="fade-up" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Statistik <span className="text-blue-600">Laporan.</span>
          </h1>
          <p data-aos="fade-up" data-aos-delay="100" className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
            Pantau perkembangan laporan masyarakat secara transparan dan lihat instansi mana yang paling banyak menangani laporan.
          </p>
        </div>

        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
          <div className="w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 pointer-events-none">
          <div className="w-[30rem] h-[30rem] bg-blue-200/30 rounded-full blur-3xl"></div>
        </div>
      </section>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : stats ? (
        <>
          {/* Summary Cards */}
          <section className="pb-12 -mt-4 relative z-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {summaryCards.map((card, i) => (
                  <div
                    key={card.label}
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-all"
                  >
                    <div className={`w-14 h-14 rounded-xl ${card.bg} flex items-center justify-center`}>
                      <card.icon className={`w-7 h-7 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <section className="pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart: Reports by Agency */}
                <div
                  data-aos="fade-up"
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Laporan per Instansi</h3>
                  <p className="text-sm text-slate-500 mb-6">Instansi dengan laporan terbanyak</p>
                  {barData.length === 0 ? (
                    <div className="h-56 flex items-center justify-center text-slate-400 text-sm">Belum ada data</div>
                  ) : (
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                          <Tooltip
                            contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                          />
                          <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Pie Chart: Reports by Status */}
                <div
                  data-aos="fade-up"
                  data-aos-delay="100"
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Status Laporan</h3>
                  <p className="text-sm text-slate-500 mb-6">Distribusi status laporan saat ini</p>
                  {pieData.length === 0 ? (
                    <div className="h-56 flex items-center justify-center text-slate-400 text-sm">Belum ada data</div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="h-56 w-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                              {pieData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2">
                        {pieData.map((entry) => (
                          <div key={entry.name} className="flex items-center gap-3 text-sm">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-600">{entry.name}</span>
                            <span className="font-semibold text-slate-900 ml-auto">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Line Chart: Daily Reports */}
              <div
                data-aos="fade-up"
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-8"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-1">Tren Laporan Harian</h3>
                <p className="text-sm text-slate-500 mb-6">Jumlah laporan masuk per hari (30 hari terakhir)</p>
                {lineData.length === 0 ? (
                  <div className="h-56 flex items-center justify-center text-slate-400 text-sm">Belum ada data</div>
                ) : (
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ top: 10, right: 12, left: 0, bottom: 10 }}>
                        <CartesianGrid vertical={false} stroke="#E2E8F0" />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: '#94A3B8', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(val: string) => {
                            const d = new Date(val + 'T00:00:00');
                            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                          }}
                        />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                          labelFormatter={(label: string) => {
                            const d = new Date(label + 'T00:00:00');
                            return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                          }}
                        />
                        <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} dot={{ r: 3, fill: '#6366F1' }} activeDot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Recent Reports */}
          <section className="pb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 data-aos="fade-up" className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
                Laporan Terbaru
              </h2>
              {stats.recentReports.length === 0 ? (
                <div className="text-center text-slate-400 py-16 bg-white rounded-2xl border border-slate-100" data-aos="fade-up">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">Belum ada laporan</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.recentReports.map((report, i) => (
                    <div
                      key={report.id}
                      data-aos="fade-up"
                      data-aos-delay={(i % 6) * 50}
                      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
                      onClick={() => navigate(`/laporan/${report.id}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusLabel(report.status)}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">#{report.id}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </h3>

                      <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-2">
                        {report.description}
                      </p>

                      <div className="mt-auto space-y-2 pt-3 border-t border-slate-100">
                        {report.address && (
                          <div className="flex items-start text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{report.address}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span className="font-medium text-slate-700">
                            {report.user?.name || report.user?.nama || 'Anonim'}
                          </span>
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center text-slate-500">
            <p className="text-lg font-semibold">Gagal memuat statistik</p>
            <p className="text-sm mt-1">Silakan coba lagi nanti</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Statistik;
