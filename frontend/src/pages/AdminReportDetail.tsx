import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportService } from '../services/reportService';
import type { Report } from '../services/reportService';
import { getAgencies } from '../services/agencyService';
import type { Agency } from '../services/agencyService';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import AdminSidebar, { type AdminSection } from '../components/AdminSidebar';
import { ArrowLeft, Calendar, CheckCircle, Clock, Image as ImageIcon, Loader2, MapPin, ShieldAlert, Menu } from 'lucide-react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const statusOptions = [
  { value: 'PENDING', label: 'Menunggu' },
  { value: 'IN_REVIEW', label: 'Dalam Review' },
  { value: 'IN_PROGRESS', label: 'Diproses' },
  { value: 'RESOLVED', label: 'Selesai' },
  { value: 'REJECTED', label: 'Ditolak' },
];

export default function AdminReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState('');
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const sidebarSection: AdminSection = 'reports';

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAgencyId, setSelectedAgencyId] = useState('');
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportRes, agenciesRes] = await Promise.all([
          id ? reportService.getReportById(id) : Promise.resolve(null),
          getAgencies(),
        ]);

        if (reportRes?.data) {
          setReport(reportRes.data);
        }
        setAgencies(agenciesRes);
      } catch (err) {
        console.error('Failed to load report detail', err);
        setError('Gagal memuat detail laporan.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!report) return;
    setSelectedStatus(report.status || '');
    setSelectedAgencyId(report.agencyId || '');
  }, [report]);

  const currentAgencyName = useMemo(() => {
    if (!report?.agencyId) return 'Belum ditentukan';
    return agencies.find((agency) => agency.id === report.agencyId)?.name || 'Belum ditentukan';
  }, [agencies, report]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Menunggu
          </span>
        );
      case 'IN_REVIEW':
      case 'IN_PROGRESS':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Diproses
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Selesai
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Ditolak
          </span>
        );
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const handleUpdateReport = async () => {
    if (!id) return;
    setError('');
    setSaving(true);
    try {
      await reportService.updateReport(id, {
        status: selectedStatus,
        agencyId: selectedAgencyId || null,
      });
      const refreshed = await reportService.getReportById(id);
      setReport(refreshed.data);
    } catch (err: any) {
      console.error('Failed to update report', err);
      setError(err.response?.data?.message || 'Gagal memperbarui laporan.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id || !noteText.trim()) return;
    setError('');
    setSavingNote(true);
    try {
      const res = await reportService.addOfficialNote(id, noteText.trim());
      setReport((prev) =>
        prev
          ? {
              ...prev,
              officialNotes: [res.data, ...(prev.officialNotes || [])],
            }
          : prev
      );
      setNoteText('');
    } catch (err: any) {
      console.error('Failed to add official note', err);
      setError(err.response?.data?.message || 'Gagal menambahkan tanggapan resmi.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-200 flex flex-row relative w-full overflow-x-hidden">
      <AdminSidebar
        user={user}
        activeSection={sidebarSection}
        onNavigate={() => navigate('/admin')}
        onLogout={handleLogout}
        mobileOpen={sidebarMobileOpen}
        onCloseMobile={() => setSidebarMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
          <h2 className="font-bold text-slate-900">Report Detail</h2>
          <button
            onClick={() => setSidebarMobileOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard Admin
        </button>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : !report ? (
          <div className="text-center py-20 text-slate-500">Laporan tidak ditemukan.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">ID Laporan</p>
                    <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{report.title}</h1>
                    <p className="text-sm font-semibold text-slate-500 mt-1">{report.id}</p>
                  </div>
                  <div className="shrink-0 pt-1">{getStatusBadge(report.status)}</div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(report.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg">
                    {report.category?.name}
                  </span>
                </div>

                <div className="prose prose-slate max-w-none mb-8">
                  <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{report.description}</p>
                </div>

                {report.imageUrl && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-500" />
                      Foto Bukti
                    </h3>
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <img src={report.imageUrl} alt="Bukti Laporan" className="w-full max-h-[420px] object-cover" />
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 p-4 rounded-xl flex flex-col gap-4 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <MapPin className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">Lokasi Kejadian</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {report.address || `${report.latitude}, ${report.longitude}`}
                      </p>
                    </div>
                  </div>
                  <div className="h-52 w-full rounded-xl overflow-hidden border border-slate-200 z-0">
                    <MapContainer
                      center={[report.latitude, report.longitude]}
                      zoom={15}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[report.latitude, report.longitude]} />
                    </MapContainer>
                  </div>
                </div>
              </div>

              {(report.officialNotes?.length || 0) > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Tanggapan Resmi</h2>
                  <div className="space-y-4">
                    {report.officialNotes?.map((note) => (
                      <div key={note.id} className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            {note.author?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {note.author?.name}
                              <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded ml-2">
                                {note.author?.role || 'AGENCY'}
                              </span>
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(note.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-slate-700 text-sm whitespace-pre-wrap ml-11">{note.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
                  {error}
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Panel Aksi Admin</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status Laporan</label>
                    <select
                      value={selectedStatus}
                      onChange={(event) => setSelectedStatus(event.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                    >
                      <option value="" disabled>
                        Pilih status
                      </option>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Instansi Tujuan</label>
                    <select
                      value={selectedAgencyId}
                      onChange={(event) => setSelectedAgencyId(event.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                    >
                      <option value="">Belum ditentukan</option>
                      {agencies.map((agency) => (
                        <option key={agency.id} value={agency.id}>
                          {agency.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Instansi saat ini: {currentAgencyName}</p>
                  </div>

                  <button
                    onClick={handleUpdateReport}
                    disabled={saving || !selectedStatus}
                    className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Simpan Perubahan
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Tambah Tanggapan Resmi</h2>
                <p className="text-xs text-slate-500 mb-4">
                  Tanggapan resmi akan terlihat oleh pelapor dan menjadi catatan tindak lanjut.
                </p>

                <form onSubmit={handleAddNote} className="space-y-4">
                  <textarea
                    rows={5}
                    value={noteText}
                    onChange={(event) => setNoteText(event.target.value)}
                    placeholder="Tulis tanggapan resmi untuk laporan ini..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm resize-y"
                  />
                  <button
                    type="submit"
                    disabled={savingNote || !noteText.trim()}
                    className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {savingNote && <Loader2 className="w-4 h-4 animate-spin" />}
                    Kirim Tanggapan
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
