import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { categoryService } from '../services/categoryService';
import type { Category } from '../services/categoryService';
import { userService } from '../services/userService';
import type { User } from '../services/userService';
import { reportService } from '../services/reportService';
import type { Report } from '../services/reportService';
import { Trash2, PlusCircle, UserPlus } from 'lucide-react';

const SuperadminPanel = () => {
  const [user] = useState(authService.getUser());
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const cats = await categoryService.getAll();
      setCategories(cats);
    } catch (e) {
      console.error('load categories', e);
    }
    try {
      const us = await userService.getAll();
      setUsers(us);
    } catch (e) {
      console.error('load users', e);
    }
    try {
      const resp = await reportService.getAllReports();
      setReports(resp.data || []);
    } catch (e) {
      console.error('load reports', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (user?.role !== 'SUPERADMIN') {
    return (
      <div className="min-h-screen px-6 py-10">
        <div className="max-w-4xl mx-auto rounded-2xl border bg-white p-8">
          <h2 className="text-lg font-semibold">Akses ditolak</h2>
          <p className="mt-2 text-sm text-slate-600">Halaman ini hanya dapat diakses oleh Superadmin.</p>
        </div>
      </div>
    );
  }

  const handleCreateCategory = async () => {
    if (!catName.trim()) return;
    setCreatingCategory(true);
    try {
      await categoryService.create({ name: catName.trim(), description: catDesc.trim() });
      setCatName('');
      setCatDesc('');
      await fetchAll();
    } catch (e) {
      console.error('create category', e);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Hapus kategori ini?')) return;
    try {
      await categoryService.delete(id);
      await fetchAll();
    } catch (e) {
      console.error('delete category', e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Hapus user ini?')) return;
    try {
      await userService.deleteUser(id);
      await fetchAll();
    } catch (e) {
      console.error('delete user', e);
    }
  };

  const handlePromote = async (id: string) => {
    if (!confirm('Promosikan user ini menjadi ADMIN?')) return;
    try {
      await userService.promote(id, 'ADMIN');
      await fetchAll();
    } catch (e) {
      console.error('promote user', e);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm('Hapus laporan ini?')) return;
    try {
      await reportService.deleteReport(id);
      await fetchAll();
    } catch (e) {
      console.error('delete report', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Superadmin Panel</h1>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="font-semibold">Buat Kategori</h3>
            <p className="text-sm text-slate-500">Tambahkan kategori laporan baru.</p>

            <div className="mt-4 space-y-3">
              <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Nama kategori" className="w-full rounded-lg border px-3 py-2" />
              <textarea value={catDesc} onChange={e => setCatDesc(e.target.value)} placeholder="Deskripsi (opsional)" className="w-full rounded-lg border px-3 py-2" />
              <div className="flex items-center gap-3">
                <button onClick={handleCreateCategory} disabled={creatingCategory} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                  <PlusCircle className="w-4 h-4" />
                  Buat Kategori
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold">Daftar Kategori</h4>
              <div className="mt-3 space-y-2">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-sm text-slate-500">{c.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDeleteCategory(c.id)} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-semibold">Manajemen User</h3>
              <p className="text-sm text-slate-500">Lihat semua user, promosi, atau hapus akun.</p>

              <div className="mt-4 space-y-2">
                {loading ? <div>Loading...</div> : users.map(u => (
                  <div key={u.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div>
                      <div className="font-semibold">{u.name || u.nama || u.email}</div>
                      <div className="text-sm text-slate-500">{u.email} • {u.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => handlePromote(u.id)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                          <UserPlus className="w-4 h-4" /> Promosi
                        </button>
                      )}
                      <button onClick={() => handleDeleteUser(u.id)} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-semibold">Manajemen Laporan</h3>
              <p className="text-sm text-slate-500">Hapus laporan yang bermasalah.</p>

              <div className="mt-4 space-y-2">
                {loading ? <div>Loading...</div> : reports.map(r => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div>
                      <div className="font-semibold">{r.title}</div>
                      <div className="text-sm text-slate-500">{r.user?.name || r.user?.nama || r.user?.email} • {new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDeleteReport(r.id)} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SuperadminPanel;
