import { useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import { reportService } from '../services/reportService';
import { createAgency, getAgencies } from '../services/agencyService';
import type { Agency, CreateAgencyPayload } from '../services/agencyService';
import type { Report } from '../services/reportService';
import { categoryService } from '../services/categoryService';
import type { Category } from '../services/categoryService';
import { userService } from '../services/userService';
import type { User } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { Activity, Building2, CheckCircle2, Clock, Inbox, ArrowRight, Loader2, Search, Menu, X, Users, Tag, Trash2, UserPlus, MapPin, User as UserIcon } from 'lucide-react';
import { getPhotoUrl } from '../services/authService';
import AdminSidebar, { type AdminSection } from '../components/AdminSidebar';
import AdminReportDetailPanel from '../components/AdminReportDetailPanel';
import AdminAgencySummaryChart from '../components/AdminAgencySummaryChart';
import AdminReportTrendChart from '../components/AdminReportTrendChart';
import AdminExploreMap from '../components/AdminExploreMap';

type Tab = 'semua' | 'pending' | 'proses' | 'selesai' | 'ditolak';

const AdminDashboard = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [activeTab, setActiveTab] = useState<Tab>('semua');
  const [agencyQuery, setAgencyQuery] = useState('');
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [agencyModalOpen, setAgencyModalOpen] = useState(false);
  const [agencyLoading, setAgencyLoading] = useState(false);
  const [agencyError, setAgencyError] = useState('');
  const [agencySuccess, setAgencySuccess] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [agencyForm, setAgencyForm] = useState({
    name: '',
    description: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    photoUrl: '',
  });
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalRole, setUserModalRole] = useState<'USER' | 'ADMIN'>('USER');
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '' });
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

      // Fetch all data independently so one failure doesn't block others
      const [reportsResult, agenciesResult, usersResult, categoriesResult] = await Promise.allSettled([
        reportService.getAllReports(),
        getAgencies(),
        userService.getAll(),
        categoryService.getAll(),
      ]);

      if (reportsResult.status === 'fulfilled') {
        const data = Array.isArray(reportsResult.value) ? reportsResult.value : reportsResult.value.data;
        if (data) setReports(data);
      } else {
        console.error('Failed to fetch reports:', reportsResult.reason);
      }

      if (agenciesResult.status === 'fulfilled') {
        setAgencies(agenciesResult.value);
      } else {
        console.error('Failed to fetch agencies:', agenciesResult.reason);
      }

      if (usersResult.status === 'fulfilled') {
        setUsers(usersResult.value);
      } else {
        console.error('Failed to fetch users:', usersResult.reason);
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value);
      } else {
        console.error('Failed to fetch categories:', categoriesResult.reason);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndReports();
  }, [navigate]);

  const showOverview = activeSection === 'overview';
  const showExplore = activeSection === 'explore';
  const showReports = activeSection === 'reports';
  const showAgencies = activeSection === 'agencies';
  const showUsers = activeSection === 'users';
  const showCategories = activeSection === 'categories';
  const isSuperAdmin = user?.role === 'SUPERADMIN';
  const sectionTitle = activeSection === 'reports' ? 'Panel Laporan' : activeSection === 'agencies' ? 'Panel Instansi' : activeSection === 'users' ? 'Manajemen Pengguna' : activeSection === 'categories' ? 'Manajemen Kategori' : activeSection === 'explore' ? 'Jelajahi Laporan' : 'Ringkasan';
  const sectionSubtitle = activeSection === 'explore'
    ? 'Lihat semua laporan di peta interaktif.'
    : activeSection === 'reports'
    ? 'Pantau dan tindak lanjuti laporan masyarakat.'
    : activeSection === 'agencies'
    ? 'Kelola instansi yang menangani laporan.'
    : activeSection === 'users'
    ? isSuperAdmin ? 'Kelola semua pengguna dan admin.' : 'Kelola pengguna biasa.'
    : activeSection === 'categories'
    ? 'Kelola kategori laporan yang tersedia di sistem.'
    : 'Pantau performa laporan, instansi, dan aktivitas terbaru secara real-time.';

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
  const totalUsers = users.length;
  const totalCategories = categories.length;
  const adminUsers = users.filter((item) => item.role === 'ADMIN').length;
  const activeCategories = categories.filter((item) => item.isActive).length;

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

  const topAgencyStats = agencyStats.slice(0, 5);
  const agencyChartData = topAgencyStats.map((agency) => ({
    name: agency.name,
    pending: agency.pending,
    inProgress: agency.inProgress,
    resolved: agency.resolved,
    rejected: agency.rejected,
    total: agency.total,
  }));

  const recentReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [reports]);

  const reportTimeline = useMemo(() => {
    const formatKey = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const days = 7;
    const today = new Date();
    const items = Array.from({ length: days }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - 1 - index));
      return {
        key: formatKey(date),
        label: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        total: 0,
      };
    });

    const map = new Map(items.map((item) => [item.key, item]));
    reports.forEach((report) => {
      const date = new Date(report.createdAt);
      const key = formatKey(date);
      const entry = map.get(key);
      if (entry) entry.total += 1;
    });

    return items.map(({ label, total }) => ({ label, total }));
  }, [reports]);

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
      password: '',
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
      if (agencyForm.password.trim()) payload.password = agencyForm.password.trim();
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

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setCategoryError('Nama kategori wajib diisi.');
      return;
    }

    setCategoryLoading(true);
    setCategoryError('');
    setCategorySuccess('');

    try {
      await categoryService.create({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || undefined,
      });
      setCategorySuccess('Kategori berhasil ditambahkan.');
      setCategoryForm({ name: '', description: '' });
      await fetchUserAndReports();
    } catch (err: any) {
      console.error('Failed to create category', err);
      setCategoryError(err.response?.data?.message || 'Gagal menambahkan kategori.');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus kategori ini?')) return;

    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setCategorySuccess('Kategori berhasil dihapus.');
    } catch (err: any) {
      console.error('Failed to delete category', err);
      setCategoryError(err.response?.data?.message || 'Gagal menghapus kategori.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus pengguna ini?')) return;

    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setCategorySuccess('Pengguna berhasil dihapus.');
    } catch (err: any) {
      console.error('Failed to delete user', err);
      setCategoryError(err.response?.data?.message || 'Gagal menghapus pengguna.');
    }
  };

  const handlePromoteUser = async (id: string) => {
    if (!window.confirm('Promosi pengguna ini menjadi ADMIN?')) return;

    try {
      await userService.promote(id, 'ADMIN');
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: 'ADMIN' } : u))
      );
      setCategorySuccess('Pengguna berhasil dipromosi.');
    } catch (err: any) {
      console.error('Failed to promote user', err);
      setCategoryError(err.response?.data?.message || 'Gagal mempromosi pengguna.');
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus laporan ini?')) return;
    try {
      await reportService.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      setCategorySuccess('Laporan berhasil dihapus.');
    } catch (err: any) {
      console.error('Failed to delete report', err);
      setCategoryError(err.response?.data?.message || 'Gagal menghapus laporan.');
    }
  };

  const handleCreateUser = async (payload: { name: string; email: string; password: string; role: string }): Promise<boolean> => {
    try {
      await userService.createUser(payload);
      const updated = await userService.getAll();
      setUsers(updated);
      setCategorySuccess(payload.role === 'ADMIN' ? 'Admin berhasil ditambahkan.' : 'Pengguna berhasil ditambahkan.');
      return true;
    } catch (err: any) {
      console.error('Failed to create user', err);
      setCategoryError(err.response?.data?.message || 'Gagal menambahkan pengguna.');
      return false;
    }
  };

  return (
    <div className="h-screen bg-[#f7f8fb] text-slate-900 selection:bg-indigo-200/40 flex flex-row relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_55%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.08),_transparent_55%)]" />
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
        mobileOpen={sidebarMobileOpen}
        onCloseMobile={() => setSidebarMobileOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/90 border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">Admin Dashboard</h2>
          <button
            onClick={() => setSidebarMobileOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Dashboard Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{isSuperAdmin ? 'PorLapor Super Admin' : 'PorLapor Admin'}</p>
              <h1 className="text-3xl font-semibold text-slate-900">
                {showOverview ? 'Dashboard Ringkasan' : sectionTitle}
              </h1>
              <p className="text-sm text-slate-500">
                {showOverview
                  ? 'Pantau performa laporan, instansi, dan aktivitas terbaru secara real-time.'
                  : sectionSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">

            </div>
          </div>

          {showOverview && (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Laporan</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900">{totalReports}</h3>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Inbox className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Perlu Tinjauan</p>
                      <h3 className="mt-2 text-2xl font-semibold text-amber-700">{pendingReports}</h3>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Sedang Diproses</p>
                      <h3 className="mt-2 text-2xl font-semibold text-blue-700">{inProgressReports}</h3>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Activity className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Laporan Selesai</p>
                      <h3 className="mt-2 text-2xl font-semibold text-emerald-700">{doneReports}</h3>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-7">
                <div className="lg:col-span-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tren Laporan</p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900">Performa 7 Hari Terakhir</h2>
                      <p className="text-sm text-slate-500">Jumlah laporan masuk per hari.</p>
                    </div>
                    <span className="text-xs text-slate-400">Update otomatis</span>
                  </div>
                  <div className="mt-5">
                    <AdminReportTrendChart data={reportTimeline} />
                  </div>
                </div>

                <div className="lg:col-span-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Aktivitas Terbaru</p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900">Laporan Masuk</h2>
                    </div>
                    <button
                      onClick={() => setActiveSection('reports')}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Lihat semua
                    </button>
                  </div>
                  <div className="mt-5 space-y-4">
                    {recentReports.length > 0 ? (
                      recentReports.map((report) => (
                        <div key={report.id} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                          <div>
                            <p className="text-sm font-semibold text-slate-800 line-clamp-1">{report.title}</p>
                            <p className="text-xs text-slate-500">
                              {(report.user?.name || report.user?.nama || 'Anonim')} •{' '}
                              {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          {getStatusBadge(report.status)}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">Belum ada laporan terbaru.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ringkasan Instansi</p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900">Distribusi Laporan</h2>
                      <p className="text-sm text-slate-500">Top {Math.min(agencyStats.length, 5)} instansi berdasarkan total laporan.</p>
                    </div>
                    <span className="text-xs text-slate-400">Update otomatis</span>
                  </div>
                  {agencyChartData.length > 0 ? (
                    <div className="mt-5">
                      <AdminAgencySummaryChart
                        className="rounded-md border border-slate-200 bg-white p-4"
                        data={agencyChartData}
                      />
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-slate-400">Belum ada laporan yang tercatat untuk instansi.</p>
                  )}
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Top Instansi</p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900">Performa Teratas</h2>
                    </div>
                    <span className="text-xs text-slate-400">Top {Math.min(topAgencyStats.length, 5)}</span>
                  </div>
                  <div className="mt-5 space-y-4">
                    {topAgencyStats.length > 0 ? (
                      topAgencyStats.map((agency) => (
                        <div key={agency.id} className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 line-clamp-1">{agency.name}</p>
                            <p className="text-xs text-slate-500">Menunggu {agency.pending} • Proses {agency.inProgress} • Selesai {agency.resolved}</p>
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{agency.total}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">Belum ada instansi aktif.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        {(showOverview || showExplore || showReports || showAgencies || showUsers || showCategories) && (
        <main className="flex-1 px-6 pb-16">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Explore Section */}
              {showExplore && (
              <section id="explore" className="space-y-4">
                <AdminExploreMap
                  reports={reports}
                  onSelectReport={setSelectedReportId}
                  getStatusBadge={getStatusBadge}
                />
              </section>
              )}

              {/* Reports Section */}
              {showReports && (
              <section id="reports" className="space-y-4">
                <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 shadow-sm">
                  {(['semua', 'pending', 'proses', 'selesai', 'ditolak'] as Tab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`min-w-[90px] px-4 py-2 text-sm font-medium rounded-sm transition-all capitalize ${activeTab === tab ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
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
                                    {(() => {
                                      const url = getPhotoUrl(report.user?.photoUrl);
                                      return url ? (
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                                          {report.user?.name?.charAt(0)?.toUpperCase() || report.user?.nama?.charAt(0)?.toUpperCase() || <UserIcon className="w-4 h-4" />}
                                        </div>
                                      );
                                    })()}
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
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => setSelectedReportId(report.id)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                                    title="Lihat Detail"
                                  >
                                    <ArrowRight className="w-5 h-5" />
                                  </button>
                                  {isSuperAdmin && (
                                    <button
                                      onClick={() => handleDeleteReport(report.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                                      title="Hapus laporan"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  )}
                                </div>
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
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={agencyQuery}
                      onChange={(event) => setAgencyQuery(event.target.value)}
                      placeholder="Cari instansi..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-md bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-colors text-sm"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setAgencyModalOpen(true);
                      setAgencyError('');
                      setAgencySuccess('');
                    }}
                    className="whitespace-nowrap px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-semibold transition-colors"
                  >
                    Tambah Instansi
                  </button>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
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

              {/* Users Section */}
              {showUsers && (
              <section id="users" className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Total</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{totalUsers}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Admin</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{adminUsers}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:col-span-1 col-span-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Akun Aktif</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{totalUsers - adminUsers}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        setUserForm({ name: '', email: '', password: '' });
                        setUserModalRole('ADMIN');
                        setCategoryError('');
                        setCategorySuccess('');
                        setUserModalOpen(true);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-semibold transition-colors"
                    >
                      Tambah Admin
                    </button>
                  )}
                </div>

                {/* User Create Modal */}
                {userModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">
                          {userModalRole === 'ADMIN' ? 'Tambah Admin Baru' : 'Tambah Pengguna Baru'}
                        </h3>
                        <button onClick={() => setUserModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {categoryError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                          {categoryError}
                        </div>
                      )}
                      {categorySuccess && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-3 mb-4">
                          {categorySuccess}
                        </div>
                      )}
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const ok = await handleCreateUser({ ...userForm, role: userModalRole });
                          if (ok) setUserModalOpen(false);
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Nama *</label>
                          <input
                            type="text"
                            required
                            value={userForm.name}
                            onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                          <input
                            type="email"
                            required
                            value={userForm.email}
                            onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Password *</label>
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={userForm.password}
                            onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setUserModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
                          >
                            {userModalRole === 'ADMIN' ? 'Tambah Admin' : 'Tambah Pengguna'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                          <th className="p-4 min-w-[200px]">Nama</th>
                          <th className="p-4 min-w-[180px]">Email</th>
                          <th className="p-4 min-w-[120px]">Role</th>
                          <th className="p-4 min-w-[160px]">Telepon</th>
                          <th className="p-4">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
                                  {(() => {
                                    const url = getPhotoUrl(u.photoUrl);
                                    return url ? (
                                      <img src={url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                                        {(u.name || u.nama || 'U').charAt(0).toUpperCase()}
                                      </div>
                                    );
                                  })()}
                                </div>
                                <p className="text-sm font-semibold text-slate-900">{u.name || u.nama || 'N/A'}</p>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-slate-600">{u.email}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                u.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                u.role === 'ADMIN' || u.role === 'AGENCY' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                'bg-slate-100 text-slate-800 border border-slate-200'
                              }`}>{u.role}</span>
                            </td>
                            <td className="p-4 text-sm text-slate-600">{u.phone || '-'}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {isSuperAdmin && u.role !== 'ADMIN' && u.role !== 'SUPERADMIN' && u.role !== 'AGENCY' && (
                                  <button
                                    onClick={() => handlePromoteUser(u.id)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Promosi ke ADMIN"
                                  >
                                    <UserPlus className="w-4 h-4" />
                                  </button>
                                )}
                                {(isSuperAdmin || u.role === 'USER' || (!u.role)) && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Hapus pengguna"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {users.length === 0 && (
                    <div className="p-10 text-center text-slate-500">
                      Belum ada pengguna terdaftar.
                    </div>
                  )}
                </div>
              </section>
              )}

              {/* Categories Section */}
              {showCategories && (
              <section id="categories" className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Total</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{totalCategories}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Aktif</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{activeCategories}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:col-span-1 col-span-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Nonaktif</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{totalCategories - activeCategories}</p>
                  </div>
                </div>

                {/* Add Category Form */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-slate-900">Tambah Kategori Baru</h3>
                  {categoryError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                      {categoryError}
                    </div>
                  )}
                  {categorySuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-3">
                      {categorySuccess}
                    </div>
                  )}
                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Kategori *</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Contoh: Jalan Rusak"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi</label>
                      <textarea
                        rows={2}
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Deskripsi kategori laporan..."
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setCategoryForm({ name: '', description: '' })}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        disabled={categoryLoading}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {categoryLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Simpan Kategori
                      </button>
                    </div>
                  </form>
                </div>

                {/* Categories List */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                          <th className="p-4 min-w-[200px]">Nama Kategori</th>
                          <th className="p-4 min-w-[300px]">Deskripsi</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {categories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                  <Tag className="w-4 h-4 text-slate-500" />
                                </div>
                                <p className="text-sm font-semibold text-slate-900">{cat.name}</p>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-slate-600 line-clamp-2">{cat.description || '-'}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                cat.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
                              }`}>{cat.isActive ? 'Aktif' : 'Nonaktif'}</span>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Hapus kategori"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {categories.length === 0 && (
                    <div className="p-10 text-center text-slate-500">
                      Belum ada kategori yang terdaftar.
                    </div>
                  )}
                </div>
              </section>
              )}
            </div>
          )}
        </main>
        )}
      </div>

      {selectedReportId && (
        <AdminReportDetailPanel
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
          onUpdated={fetchUserAndReports}
        />
      )}

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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password (Untuk Login Admin)</label>
                  <input
                    type="text"
                    value={agencyForm.password}
                    onChange={(event) => setAgencyForm((prev) => ({ ...prev, password: event.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                    placeholder="Password minimal 6 karakter"
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
