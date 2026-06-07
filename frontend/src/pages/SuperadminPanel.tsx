import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import { categoryService } from '../services/categoryService';
import type { Category } from '../services/categoryService';
import { userService } from '../services/userService';
import type { User } from '../services/userService';
import { getAgencies, createAgency, updateAgency, deleteAgency } from '../services/agencyService';
import type { Agency, CreateAgencyPayload } from '../services/agencyService';
import { reportService } from '../services/reportService';
import type { Report } from '../services/reportService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { Trash2, PlusCircle, UserPlus, Menu, X, Tag, Users, FileText, LogOut, Shield, Building2, Loader2 } from 'lucide-react';

type SuperadminSection = 'categories' | 'users' | 'reports' | 'agencies';

const SuperadminPanel = () => {
  const [user] = useState<AuthUser | null>(authService.getUser());
  const [activeSection, setActiveSection] = useState<SuperadminSection>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [agencyName, setAgencyName] = useState('');
  const [agencyDesc, setAgencyDesc] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyPassword, setAgencyPassword] = useState('');
  const [agencyPhone, setAgencyPhone] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [creatingAgency, setCreatingAgency] = useState(false);
  const [agencyError, setAgencyError] = useState('');
  const [agencySuccess, setAgencySuccess] = useState('');
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);

  const [loading, setLoading] = useState(true);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cats, ags, us, resp] = await Promise.all([
        categoryService.getAll(),
        getAgencies(),
        userService.getAll(),
        reportService.getAllReports(),
      ]);
      setCategories(cats);
      setAgencies(ags);
      setUsers(us);
      setReports(resp.data || []);
    } catch (e) {
      console.error('load data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);


  if (user?.role !== 'SUPERADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border bg-white p-8 max-w-md">
          <h2 className="text-lg font-semibold">Akses ditolak</h2>
          <p className="mt-2 text-sm text-slate-600">Halaman ini hanya untuk Superadmin.</p>
        </div>
      </div>
    );
  }

  
  const handleSaveAgency = async () => {
    if (!agencyName.trim()) {
      setAgencyError('Nama instansi wajib diisi.');
      return;
    }
    setCreatingAgency(true);
    setAgencyError('');
    setAgencySuccess('');
    try {
      const payload: CreateAgencyPayload = { name: agencyName.trim() };
      if (agencyDesc.trim()) payload.description = agencyDesc.trim();
      if (agencyEmail.trim()) payload.email = agencyEmail.trim();
      if (agencyPassword.trim()) payload.password = agencyPassword.trim();
      if (agencyPhone.trim()) payload.phone = agencyPhone.trim();
      if (agencyAddress.trim()) payload.address = agencyAddress.trim();

      if (editingAgency) {
        await updateAgency(editingAgency.id, payload);
        showToast('Instansi berhasil diperbarui.');
      } else {
        await createAgency(payload);
        showToast('Instansi berhasil ditambahkan.');
      }
      setAgencyName('');
      setAgencyDesc('');
      setAgencyEmail('');
      setAgencyPassword('');
      setAgencyPhone('');
      setAgencyAddress('');
      setEditingAgency(null);
      await fetchAll();
    } catch (e: any) {
      console.error('save agency', e);
      setAgencyError(e.response?.data?.message || 'Gagal menyimpan instansi.');
    } finally {
      setCreatingAgency(false);
    }
  };

  const handleStartEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setAgencyName(agency.name);
    setAgencyDesc(agency.description || '');
    setAgencyEmail(agency.email || '');
    setAgencyPhone(agency.phone || '');
    setAgencyAddress(agency.address || '');
    setAgencyPassword('');
    setAgencyError('');
    setAgencySuccess('');
  };

  const handleCancelEdit = () => {
    setEditingAgency(null);
    setAgencyName('');
    setAgencyDesc('');
    setAgencyEmail('');
    setAgencyPassword('');
    setAgencyPhone('');
    setAgencyAddress('');
    setAgencyError('');
    setAgencySuccess('');
  };

  const handleDeleteAgency = async (id: string) => {
    try {
      await deleteAgency(id);
      showToast('Instansi berhasil dihapus.');
      await fetchAll();
    } catch (e: any) {
      console.error('delete agency', e);
      showToast(e.response?.data?.message || 'Gagal menghapus instansi.', 'error');
    }
  };

  const handleCreateCategory = async () => {
    if (!catName.trim()) return;
    setCreatingCategory(true);
    try {
      await categoryService.create({ name: catName.trim(), description: catDesc.trim() });
      showToast('Kategori berhasil ditambahkan.');
      setCatName('');
      setCatDesc('');
      await fetchAll();
    } catch (e: any) {
      console.error('create category', e);
      showToast(e.response?.data?.message || 'Gagal menambahkan kategori.', 'error');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoryService.delete(id);
      showToast('Kategori berhasil dihapus.');
      await fetchAll();
    } catch (e: any) {
      console.error('delete category', e);
      showToast(e.response?.data?.message || 'Gagal menghapus kategori.', 'error');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      showToast('Pengguna berhasil dihapus.');
      await fetchAll();
    } catch (e: any) {
      console.error('delete user', e);
      showToast(e.response?.data?.message || 'Gagal menghapus pengguna.', 'error');
    }
  };

  const handlePromote = async (id: string) => {
    try {
      await userService.promote(id, 'ADMIN');
      showToast('Pengguna berhasil dipromosi.');
      await fetchAll();
    } catch (e: any) {
      console.error('promote user', e);
      showToast(e.response?.data?.message || 'Gagal mempromosi pengguna.', 'error');
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      await reportService.deleteReport(id);
      showToast('Laporan berhasil dihapus.');
      await fetchAll();
    } catch (e: any) {
      console.error('delete report', e);
      showToast(e.response?.data?.message || 'Gagal menghapus laporan.', 'error');
    }
  };

  const navItems = [
    { id: 'categories' as const, label: 'Kategori', icon: Tag },
    { id: 'users' as const, label: 'Pengguna', icon: Users },
    { id: 'agencies' as const, label: 'Instansi', icon: Building2 },
    { id: 'reports' as const, label: 'Laporan', icon: FileText },
  ];

  const renderSidebar = (compact = false) => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            P
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">PorLapor</p>
            <p className="text-xs text-slate-500">Superadmin</p>
          </div>
        </div>
        {compact && (
          <button
            onClick={() => setSidebarMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-3">
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Navigasi
        </p>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {user?.nama?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.nama || user?.name || 'Superadmin'}</p>
            <p className="text-xs text-slate-500">SUPERADMIN</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900 selection:bg-indigo-200/40 flex flex-row relative w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col bg-white/90 text-slate-700 border-r border-slate-200 min-h-screen backdrop-blur">
        {renderSidebar()}
      </aside>

      {/* Mobile Sidebar */}
      {sidebarMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setSidebarMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white text-slate-700 border-r border-slate-200 shadow-2xl">
            {renderSidebar(true)}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_55%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.08),_transparent_55%)]" />

        {/* Mobile Header */}
        <div className="lg:hidden bg-white/90 border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">Superadmin Panel</h2>
          <button
            onClick={() => setSidebarMobileOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-slate-900" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">PorLapor</p>
              <h1 className="text-3xl font-semibold text-slate-900">Superadmin Control Panel</h1>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            {activeSection === 'categories' && 'Kelola kategori laporan yang tersedia di sistem.'}
            {activeSection === 'users' && 'Kelola pengguna dan admin, promosi atau hapus akun.'}
            {activeSection === 'reports' && 'Hapus laporan yang bermasalah atau tidak sesuai.'}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 px-6 pb-8">
            
            {/* Agencies Section */}
            {activeSection === 'agencies' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{editingAgency ? 'Edit Instansi' : 'Buat Instansi Baru'}</h2>
                    {editingAgency && (
                      <button onClick={handleCancelEdit} className="text-sm text-slate-500 hover:text-slate-700 underline">
                        Batal
                      </button>
                    )}
                  </div>
                  {agencyError && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">{agencyError}</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Instansi *</label>
                      <input
                        value={agencyName}
                        onChange={e => setAgencyName(e.target.value)}
                        placeholder="Contoh: Dinas Pekerjaan Umum"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900/20"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi</label>
                      <textarea
                        value={agencyDesc}
                        onChange={e => setAgencyDesc(e.target.value)}
                        placeholder="Ringkasan tugas instansi"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900/20 resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={agencyEmail}
                        onChange={e => setAgencyEmail(e.target.value)}
                        placeholder="instansi@email.go.id"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Password (Untuk Login Admin)</label>
                      <input
                        type="text"
                        value={agencyPassword}
                        onChange={e => setAgencyPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Telepon</label>
                      <input
                        value={agencyPhone}
                        onChange={e => setAgencyPhone(e.target.value)}
                        placeholder="021-xxxxxxx"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat</label>
                      <input
                        value={agencyAddress}
                        onChange={e => setAgencyAddress(e.target.value)}
                        placeholder="Alamat kantor"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900/20"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex justify-end gap-3">
                      {editingAgency && (
                        <button
                          onClick={handleCancelEdit}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Batal
                        </button>
                      )}
                      <button
                        onClick={handleSaveAgency}
                        disabled={creatingAgency || !agencyName.trim()}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                      >
                        {creatingAgency ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                        {creatingAgency ? 'Menyimpan...' : editingAgency ? 'Simpan Perubahan' : 'Simpan Instansi'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold mb-4">Daftar Instansi</h2>
                  <div className="space-y-3">
                    {agencies.length > 0 ? (
                      agencies.map((agency) => (
                        <div
                          key={agency.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{agency.name}</p>
                              <p className="text-sm text-slate-600">{agency.email || '-'} • {agency.phone || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEdit(agency)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                            >
                              Edit
                            </button>
                            <ConfirmDialog
                              action="delete"
                              title="Hapus Instansi"
                              description={`Apakah kamu yakin ingin menghapus instansi "${agency.name}"? Semua data terkait akan dihapus.`}
                              onConfirm={() => handleDeleteAgency(agency.id)}
                            >
                              <button className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
                                <Trash2 className="w-4 h-4" />
                                Hapus
                              </button>
                            </ConfirmDialog>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-500">
                        Belum ada instansi.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Categories Section */}
            {activeSection === 'categories' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold mb-4">Buat Kategori Baru</h2>
                  <div className="space-y-3">
                    <input
                      value={catName}
                      onChange={e => setCatName(e.target.value)}
                      placeholder="Nama kategori"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                    />
                    <textarea
                      value={catDesc}
                      onChange={e => setCatDesc(e.target.value)}
                      placeholder="Deskripsi (opsional)"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/20 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleCreateCategory}
                      disabled={creatingCategory || !catName.trim()}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      <PlusCircle className="w-4 h-4" />
                      {creatingCategory ? 'Membuat...' : 'Buat Kategori'}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold mb-4">Daftar Kategori</h2>
                  <div className="space-y-3">
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{c.name}</p>
                            {c.description && <p className="text-sm text-slate-600 mt-1">{c.description}</p>}
                          </div>
                          <ConfirmDialog
                            action="delete"
                            title="Hapus Kategori"
                            description="Hapus kategori ini?"
                            onConfirm={() => handleDeleteCategory(c.id)}
                          >
                            <button
                              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4" />
                              Hapus
                            </button>
                          </ConfirmDialog>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-500">
                        Belum ada kategori.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Users Section */}
            {activeSection === 'users' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Manajemen Pengguna</h2>
                <div className="space-y-3">
                  {users.length > 0 ? (
                    users.map(u => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{u.name || u.nama || u.email || 'Unknown'}</p>
                          <p className="text-sm text-slate-600 truncate">{u.email} • {u.role || 'USER'}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {u.role !== 'ADMIN' && u.role !== 'SUPERADMIN' && u.role !== 'AGENCY' && (
                            <ConfirmDialog
                              action="promote"
                              title="Promosi Pengguna"
                              description="Promosikan user ini menjadi ADMIN?"
                              onConfirm={() => handlePromote(u.id)}
                            >
                              <button
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                              >
                                <UserPlus className="w-4 h-4" />
                                <span className="hidden sm:inline">Promosi</span>
                              </button>
                            </ConfirmDialog>
                          )}
                          <ConfirmDialog
                            action="delete"
                            title="Hapus Pengguna"
                            description="Hapus user ini?"
                            onConfirm={() => handleDeleteUser(u.id)}
                          >
                            <button
                              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Hapus</span>
                            </button>
                          </ConfirmDialog>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-500">
                      Belum ada pengguna.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reports Section */}
            {activeSection === 'reports' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Manajemen Laporan</h2>
                <div className="space-y-3">
                  {reports.length > 0 ? (
                    reports.map(r => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{r.title}</p>
                          <p className="text-sm text-slate-600 truncate">
                            {r.user?.name || r.user?.nama || r.user?.email || 'Unknown'} • {new Date(r.createdAt).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <ConfirmDialog
                          action="delete"
                          title="Hapus Laporan"
                          description="Hapus laporan ini?"
                          onConfirm={() => handleDeleteReport(r.id)}
                        >
                          <button
                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Hapus</span>
                          </button>
                        </ConfirmDialog>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-500">
                      Belum ada laporan.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperadminPanel;
