import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { reportService } from '../services/reportService';
import type { Report } from '../services/reportService';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, Image as ImageIcon, MapPin, MessageCircle, Send, ShieldAlert, Sparkles, User } from 'lucide-react';
import { getPhotoUrl } from '../services/authService';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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

type StatusBadge = {
  label: string;
  tone: string;
  icon: typeof Clock;
};

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const currentUser = authService.getUser();
        if (currentUser) {
          setUser(currentUser);
        }

        if (id) {
          const res = await reportService.getReportById(id);
          setReport(res.data);
        }
      } catch (error) {
        console.error('Failed to load report detail', error);
        setError('Laporan tidak ditemukan atau tidak dapat diakses');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    setSendingComment(true);
    try {
      const res = await reportService.addComment(id, commentText);
      if (report) {
        setReport({ ...report, comments: [...(report.comments || []), res.data] });
      }
      setCommentText('');
    } catch (error) {
      console.error('Failed to send comment', error);
      alert('Gagal mengirim komentar');
    } finally {
      setSendingComment(false);
    }
  };

  const getStatusBadge = (status: string): StatusBadge => {
    switch (status) {
      case 'PENDING':
        return { label: 'Menunggu', tone: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock };
      case 'IN_PROGRESS':
      case 'IN_REVIEW':
        return { label: 'Diproses', tone: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock };
      case 'RESOLVED':
        return { label: 'Selesai', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle };
      case 'REJECTED':
        return { label: 'Ditolak', tone: 'bg-red-50 text-red-700 border-red-200', icon: ShieldAlert };
      default:
        return { label: status, tone: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const reportStatus = report ? getStatusBadge(report.status) : null;
  const noteCount = report?.officialNotes?.length || 0;
  const commentCount = report?.comments?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">
      <Header />

      <main className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0))]" />

        <button
          onClick={() => navigate(user ? '/dashboard' : '/')}
          className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {user ? 'Kembali ke Dashboard' : 'Kembali ke Beranda'}
        </button>

        {error ? (
          <div className="mx-auto max-w-xl rounded-[2rem] border border-red-200 bg-red-50 px-8 py-16 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Error</p>
            <h1 className="mt-3 text-2xl font-semibold text-red-900">{error}</h1>
            <button
              onClick={() => navigate('/')}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-6 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : !report ? (
          <div className="mx-auto max-w-xl rounded-[2rem] border border-dashed border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Detail Laporan</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">Laporan tidak ditemukan</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">Laporan ini tidak tersedia atau kamu tidak punya akses untuk melihatnya.</p>
          </div>
        ) : (
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_360px] lg:items-start">
            <section className="space-y-6">
              <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                        Detail laporan warga
                      </div>
                      <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        {report.title}
                      </h1>
                    </div>

                    {reportStatus && (
                      <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${reportStatus.tone}`}>
                        <reportStatus.icon className="h-3.5 w-3.5" />
                        {reportStatus.label}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(report.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                      <FileText className="h-3.5 w-3.5" />
                      {report.category?.name || 'Umum'}
                    </span>
                  </div>
                </div>

                <div className="space-y-8 px-6 py-6 sm:px-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Kronologi</p>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:text-base">
                      {report.description}
                    </p>
                  </div>

                  {report.imageUrl && (
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <ImageIcon className="h-4 w-4 text-slate-500" />
                        Bukti foto
                      </div>
                      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                        <img src={report.imageUrl} alt="Bukti Laporan" className="max-h-[520px] w-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              </article>

              {noteCount > 0 && (
                <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Tindak Lanjut</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">Catatan resmi instansi</h2>
                  </div>

                  <div className="space-y-4 px-4 py-5 sm:px-6 sm:py-6">
                    {report.officialNotes?.map((note) => (
                      <div key={note.id} className="relative overflow-hidden rounded-[1.5rem] border border-blue-100 bg-blue-50/60 p-5">
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                        <div className="flex items-start gap-3">
                          {(() => {
                            const url = getPhotoUrl(note.author?.photoUrl);
                            return url ? (
                              <img src={url} alt="" className="h-10 w-10 shrink-0 rounded-2xl object-cover shadow-sm" />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-blue-700 shadow-sm">
                                {note.author?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                              </div>
                            );
                          })()}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">{note.author?.name || 'Admin'}</p>
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                                Instansi
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] font-medium text-slate-500">{formatDate(note.createdAt)}</p>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{note.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Diskusi</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">Komentar & tanya jawab</h2>
                </div>

                <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
                  {!report.comments || report.comments.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                      <MessageCircle className="mx-auto mb-3 h-5 w-5 text-slate-400" />
                      Belum ada diskusi untuk laporan ini.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {report.comments.map((c) => {
                        const isMine = c.author.id === user?.id;

                        return (
                          <div key={c.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse text-right' : ''}`}>
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold shadow-sm ${c.author.role === 'USER' ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white'}`}>
                              {c.author.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className={`flex max-w-[85%] flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="font-semibold text-slate-700">{isMine ? 'Anda' : c.author.name}</span>
                                {c.author.role !== 'USER' && (
                                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
                                    Admin
                                  </span>
                                )}
                                <span>{new Date(c.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className={`rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${isMine ? 'rounded-tr-sm bg-slate-900 text-white' : 'rounded-tl-sm bg-slate-100 text-slate-800'}`}>
                                {c.content}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-4">
                    {!user ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                        <p className="text-sm text-amber-900 font-medium mb-3">
                          Silakan login untuk memberikan komentar
                        </p>
                        <button
                          onClick={() => navigate('/login', { state: { from: `/laporan/${id}` } })}
                          className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          Login Sekarang
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSendComment} className="flex gap-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Tulis komentar singkat di sini..."
                          className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                        />
                        <button
                          type="submit"
                          disabled={sendingComment || !commentText.trim()}
                          className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Send className="h-5 w-5" />
                        </button>
                      </form>
                    )}
                    <p className="mt-2 text-[11px] text-slate-400">Komentar bersifat privat antara pelapor dan instansi terkait.</p>
                  </div>
                </div>
              </article>
            </section>

            <aside className="space-y-6 lg:sticky lg:top-6">
              <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Ringkasan</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">Info cepat laporan</h2>
                </div>

                <div className="space-y-3 px-6 py-6">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      <User className="h-3.5 w-3.5" /> Pelapor
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{report.user?.name || report.user?.nama || 'Anonim'}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      <MapPin className="h-3.5 w-3.5" /> Lokasi
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{report.address || `${report.latitude}, ${report.longitude}`}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      <Calendar className="h-3.5 w-3.5" /> Dibuat
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{formatDate(report.createdAt)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="rounded-2xl bg-slate-900 px-4 py-4 text-white">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Komentar</p>
                      <p className="mt-2 text-2xl font-semibold">{commentCount}</p>
                    </div>
                    <div className="rounded-2xl bg-blue-50 px-4 py-4 text-blue-700">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">Tindak lanjut</p>
                      <p className="mt-2 text-2xl font-semibold">{noteCount}</p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Lokasi Peta</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">Titik laporan</h2>
                </div>

                <div className="space-y-4 px-6 py-6">
                  <div className="h-56 overflow-hidden rounded-[1.5rem] border border-slate-200">
                    <MapContainer center={[report.latitude, report.longitude]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[report.latitude, report.longitude]} />
                    </MapContainer>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">Lokasi ini dipakai untuk membantu instansi memahami titik masalah dengan lebih cepat.</p>
                </div>
              </article>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}