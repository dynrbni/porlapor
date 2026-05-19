import { useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import { reportService } from '../services/reportService';
import { createAgency, getAgencies } from '../services/agencyService';
import type { Agency, CreateAgencyPayload } from '../services/agencyService';
import type { Report } from '../services/reportService';
import { useNavigate } from 'react-router-dom';
import { Activity, Building2, CheckCircle2, Clock, Inbox, ShieldAlert, ArrowRight, Loader2, Search, Menu, X } from 'lucide-react';
import AdminSidebar, { type AdminSection } from '../components/AdminSidebar';

type Tab = 'semua' | 'pending' | 'proses' | 'selesai' | 'ditolak';

const AdminDashboard = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [activeTab, setActiveTab] = useState<Tab>('semua');
  const [agencyQuery, setAgencyQuery] = useState('');
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [agencyModalOpen, setAgencyModalOpen] = useState(false);
  const [agencyLoading, setAgencyLoading] = useState(false);
  const [agencyError, setAgencyError] = useState('');
  const [agencySuccess, setAgencySuccess] = useState('');
  const [agencyForm, setAgencyForm] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    photoUrl: '',
  });
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
      if (currentUser) setUser(currentUser);
      
      const [reportsResponse, agenciesResponse] = await Promise.all([
        reportService.getAllReports(),
        getAgencies(),
      ]);
      const data = Array.isArray(reportsResponse) ? reportsResponse : reportsResponse.data;
      if (data) {
        setReports(data);
      }
      setAgencies(agenciesResponse);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndReports();
  }, [navigate]);

  const showOverview = activeSection === 'overview';
  const showReports = activeSection === 'overview' || activeSection === 'reports';
  const showAgencies = activeSection === 'overview' || activeSection === 'agencies';
  const sectionTitle = activeSection === 'reports' ? 'Panel Laporan' : 'Panel Instansi';
  const sectionSubtitle = activeSection === 'reports'
    ? 'Pantau dan tindak lanjuti laporan masyarakat.'
    : 'Kelola instansi yang menangani laporan.';

  const filteredReports = reports.filter(r => {
    switch(activeTab) {
      case 'pending': return r.status === 'PENDING' || r.status === 'IN_REVIEW';
      case 'proses': return r.status === 'IN_PROGRESS';
      case 'selesai': return r.status === 'RESOLVED';
      case 'ditolak': return r.status === 'REJECTED';
      default: return true;
    }
  });

  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'PENDING' || r.status === 'IN_REVIEW').length;
  const inProgressReports = reports.filter(r => r.status === 'IN_PROGRESS').length;
  const doneReports = reports.filter(r => r.status === 'RESOLVED').length;

  const agencyStats = useMemo(() => {
    const agencyNameById = new Map<string, string>();
    agencies.forEach((agency) => {
      agencyNameById.set(agency.id, agency.name);
    });

    const stats = new Map<string, {
      id: string;
      name: string;
      total: number;
      pending: number;
      inProgress: number;
      resolved: number;
      rejected: number;
    }>();

    reports.forEach((report) => {
      const agencyId = report.agencyId || 'unassigned';
      const name = agencyId === 'unassigned'
        ? 'Belum Ditentukan'
        : agencyNameById.get(agencyId) || 'Instansi Tidak Dikenal';

      if (!stats.has(agencyId)) {
        stats.set(agencyId, {
          id: agencyId,
          name,
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          rejected: 0,
        });
      }

      const entry = stats.get(agencyId);
      if (!entry) return;

      entry.total += 1;
      if (report.status === 'PENDING' || report.status === 'IN_REVIEW') entry.pending += 1;
      if (report.status === 'IN_PROGRESS') entry.inProgress += 1;
      if (report.status === 'RESOLVED') entry.resolved += 1;
      if (report.status === 'REJECTED') entry.rejected += 1;
    });

    return Array.from(stats.values()).sort((a, b) => b.total - a.total);
  }, [reports, agencies]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'IN_REVIEW':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Menunggu</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Diproses</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Selesai</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 border border-red-200">Ditolak</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">{status}</span>;
    }
  };

  const resetAgencyForm = () => {
    setAgencyForm({
      name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      photoUrl: '',
    });
  };

  const handleCreateAgency = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!agencyForm.name.trim()) {
      setAgencyError('Nama instansi wajib diisi.');
      return;
    }

    setAgencyLoading(true);
    setAgencyError('');
    setAgencySuccess('');

    try {
      const payload: CreateAgencyPayload = {
        name: agencyForm.name.trim(),
      };
      if (agencyForm.description.trim()) payload.description = agencyForm.description.trim();
      if (agencyForm.email.trim()) payload.email = agencyForm.email.trim();
      if (agencyForm.phone.trim()) payload.phone = agencyForm.phone.trim();
      if (agencyForm.address.trim()) payload.address = agencyForm.address.trim();
      if (agencyForm.photoUrl.trim()) {
        payload.photoUrl = agencyForm.photoUrl.trim();
        payload.photoSource = 'URL';
      }

      const created = await createAgency(payload);
      setAgencySuccess('Instansi berhasil ditambahkan.');
      if (created.data) {
        setAgencies((prev) => [created.data, ...prev]);
      }
      resetAgencyForm();
    } catch (err: any) {
      console.error('Failed to create agency', err);
      setAgencyError(err.response?.data?.message || 'Gagal menambahkan instansi.');
    } finally {
      setAgencyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-200 flex flex-row relative w-full overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
        onAddAgency={() => {
          setAgencyModalOpen(true);
          setAgencyError('');
          setAgencySuccess('');
        }}
        mobileOpen={sidebarMobileOpen}
        onCloseMobile={() => setSidebarMobileOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
          <h2 className="font-bold text-slate-900">Admin Dashboard</h2>
          <button
            onClick={() => setSidebarMobileOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Dashboard Header */}
        {showOverview ? (
          <div id="overview" className="w-full bg-slate-900 border-b border-slate-800 pt-10 pb-8 px-4 sm:px-6 relative z-10 text-white">
            <div className="max-w-6xl mx-auto w-full">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-indigo-900 overflow-hidden shadow-inner border-2 border-indigo-500">
                     <img src={user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nama || 'admin'}`} alt="Admin Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h1 className="text-3xl font-extrabold tracking-tight">Admin Control Panel</h1>
                     <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                       <ShieldAlert className="w-4 h-4 text-indigo-400" />
                       Anda masuk sebagai {user?.role === 'SUPERADMIN' ? 'Super Admin' : 'Admin'}
                     </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                     <p className="text-sm font-medium text-slate-400 mb-1">Total Laporan</p>
                     <h3 className="text-3xl font-extrabold text-white">{totalReports}</h3>
                  </div>
                  <div className="w-12 h-12 bg-slate-700 rounded-xl shadow-sm border border-slate-600 flex items-center justify-center">
                     <Inbox className="w-6 h-6 text-slate-300" />
                  </div>
                </div>

                <div className="bg-amber-900/20 border border-amber-800/50 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                     <p className="text-sm font-medium text-amber-500 mb-1">Perlu Tinjauan</p>
                     <h3 className="text-3xl font-extrabold text-amber-400">{pendingReports}</h3>
                  </div>
                  <div className="w-12 h-12 bg-amber-900/50 rounded-xl shadow-sm border border-amber-700 flex items-center justify-center">
                     <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-800/50 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                     <p className="text-sm font-medium text-blue-500 mb-1">Sedang Diproses</p>
                     <h3 className="text-3xl font-extrabold text-blue-400">{inProgressReports}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-900/50 rounded-xl shadow-sm border border-blue-700 flex items-center justify-center">
                     <Activity className="w-6 h-6 text-blue-500" />
                  </div>
                </div>

                <div className="bg-emerald-900/20 border border-emerald-800/50 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                     <p className="text-sm font-medium text-emerald-500 mb-1">Laporan Selesai</p>
                     <h3 className="text-3xl font-extrabold text-emerald-400">{doneReports}</h3>
                  </div>
                  <div className="w-12 h-12 bg-emerald-900/50 rounded-xl shadow-sm border border-emerald-700 flex items-center justify-center">
                     <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200">Ringkasan Instansi</h2>
                  <span className="text-xs text-slate-400">Top {Math.min(agencyStats.length, 5)}</span>
                </div>
                {agencyStats.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {agencyStats.slice(0, 5).map((agency) => (
                      <div key={agency.id} className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-semibold text-slate-100">{agency.name}</p>
                          <span className="text-xs font-bold text-slate-300">{agency.total} laporan</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium">
                          <span className="text-amber-300">Menunggu {agency.pending}</span>
                          <span className="text-blue-300">Proses {agency.inProgress}</span>
                          <span className="text-emerald-300">Selesai {agency.resolved}</span>
                          <span className="text-red-300">Ditolak {agency.rejected}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">Belum ada laporan yang tercatat untuk instansi.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-8 relative z-10 text-white">
            <div className="max-w-6xl mx-auto w-full">
              <h1 className="text-2xl font-extrabold tracking-tight">{sectionTitle}</h1>
              <p className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                {sectionSubtitle}
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full py-10">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Reports Section */}
              {showReports && (
              <section id="reports" className="space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Panel Laporan</h2>
                    <p className="text-sm text-slate-500">Pantau dan tindak lanjuti laporan masyarakat.</p>
                  </div>

                  <div className="flex bg-slate-200/60 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto">
                    {(['semua', 'pending', 'proses', 'selesai', 'ditolak'] as Tab[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 min-w-[90px] md:px-5 py-2 text-sm font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                          <th className="p-4">ID Laporan</th>
                          <th className="p-4 min-w-[200px]">Pelapor</th>
                          <th className="p-4 min-w-[300px]">Judul Info</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Tanggal</th>
                          <th className="p-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredReports.length > 0 ? (
                          filteredReports.map((report) => (
                            <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 text-sm font-semibold text-slate-700">
                                {report.id}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                    <img
                                      src={report.user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${report.user?.id || 'anon'}`}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">{report.user?.name || report.user?.nama || 'Anonim'}</p>
                                    <p className="text-xs text-slate-500">{report.user?.email || '-'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="text-sm font-bold text-slate-900 line-clamp-1">{report.title}</p>
                                <p className="text-xs font-semibold text-indigo-600 mt-0.5">{report.category?.name || 'UMUM'}</p>
                              </td>
                              <td className="p-4">
                                {getStatusBadge(report.status)}
                              </td>
                              <td className="p-4 text-sm font-medium text-slate-600">
                                {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => navigate(`/admin/report/${report.id}`)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                                  title="Lihat Detail"
                                >
                                  <ArrowRight className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-12 text-center">
                              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Inbox className="w-8 h-8 text-slate-400" />
                              </div>
                              <h3 className="text-lg font-bold text-slate-800 mb-1">Data Kosong</h3>
                              <p className="text-sm text-slate-500">Tidak ada laporan yang ditemukan untuk status "{activeTab}".</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
              )}

              {/* Agencies Section */}
              {showAgencies && (
              <section id="agencies" className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Panel Instansi</h2>
                    <p className="text-sm text-slate-500">Lihat daftar instansi yang menangani laporan.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={agencyQuery}
                        onChange={(event) => setAgencyQuery(event.target.value)}
                        placeholder="Cari instansi..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setAgencyModalOpen(true);
                        setAgencyError('');
                        setAgencySuccess('');
                      }}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
                    >
                      Tambah Instansi
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                          <th className="p-4 min-w-[200px]">Nama Instansi</th>
                          <th className="p-4 min-w-[160px]">Email</th>
                          <th className="p-4 min-w-[140px]">Telepon</th>
                          <th className="p-4 min-w-[260px]">Alamat</th>
                          <th className="p-4">Dibuat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {agencies
                          .filter((agency) => {
                            const query = agencyQuery.trim().toLowerCase();
                            if (!query) return true;
                            return (
                              agency.name.toLowerCase().includes(query) ||
                              (agency.address || '').toLowerCase().includes(query) ||
                              (agency.email || '').toLowerCase().includes(query) ||
                              (agency.phone || '').toLowerCase().includes(query)
                            );
                          })
                          .map((agency) => (
                            <tr key={agency.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-slate-500" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">{agency.name}</p>
                                    {agency.description && (
                                      <p className="text-xs text-slate-500 line-clamp-1">{agency.description}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm text-slate-600">{agency.email || '-'}</td>
                              <td className="p-4 text-sm text-slate-600">{agency.phone || '-'}</td>
                              <td className="p-4 text-sm text-slate-600">{agency.address || '-'}</td>
                              <td className="p-4 text-sm text-slate-600">
                                {new Date(agency.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {agencies.length === 0 && (
                    <div className="p-10 text-center text-slate-500">
                      Belum ada instansi yang terdaftar.
                    </div>
                  )}
                </div>
              </section>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Agency Modal */}
      {agencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Tambah Instansi</h2>
                <p className="text-xs text-slate-500">Lengkapi data instansi yang akan menerima laporan.</p>
              </div>
              <button
                onClick={() => {
                  setAgencyModalOpen(false);
                  setAgencyError('');
                  setAgencySuccess('');
                }}
                className="p-1 text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgency} className="px-6 py-5 space-y-4">
              {agencyError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
                  {agencyError}
                </div>
              )}
              {agencySuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl p-3">
                  {agencySuccess}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Instansi *</label>
                <input
                  type="text"
                  value={agencyForm.name}
                  onChange={(event) => setAgencyForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                  placeholder="Contoh: Dinas Pekerjaan Umum"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi</label>
                <textarea
                  rows={3}
                  value={agencyForm.description}
                  onChange={(event) => setAgencyForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                  placeholder="Ringkasan tugas instansi..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={agencyForm.email}
                    onChange={(event) => setAgencyForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                    placeholder="instansi@email.go.id"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Telepon</label>
                  <input
                    type="text"
                    value={agencyForm.phone}
                    onChange={(event) => setAgencyForm((prev) => ({ ...prev, phone: event.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                    placeholder="021-xxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat</label>
                <input
                  type="text"
                  value={agencyForm.address}
                  onChange={(event) => setAgencyForm((prev) => ({ ...prev, address: event.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                  placeholder="Alamat kantor instansi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">URL Foto Instansi (Opsional)</label>
                <input
                  type="url"
                  value={agencyForm.photoUrl}
                  onChange={(event) => setAgencyForm((prev) => ({ ...prev, photoUrl: event.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAgencyModalOpen(false);
                    setAgencyError('');
                    setAgencySuccess('');
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={agencyLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {agencyLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Instansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
