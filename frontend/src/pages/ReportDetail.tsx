import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { reportService } from '../services/reportService';
import type { Report, OfficialNote, Comment } from '../services/reportService';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Clock, Send, ShieldAlert } from 'lucide-react';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const currentUser = authService.getUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        setUser(currentUser);
        
        if (id) {
          const res = await reportService.getReportById(id);
          setReport(res.data);
        }
      } catch (error) {
        console.error('Failed to load report detail', error);
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
      console.error('Lengkap', error);
      alert('Gagal mengirim komentar');
    } finally {
      setSendingComment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3"/> Menunggu</span>;
      case 'IN_PROGRESS':
      case 'IN_REVIEW':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3"/> Diproses</span>;
      case 'DONE':
      case 'RESOLVED':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Selesai</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Ditolak</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200">
      <Header />
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </button>

        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
           </div>
        ) : !report ? (
           <div className="text-center py-20 text-slate-500">Laporan tidak ditemukan / Anda tidak memiliki akses.</div>
        ) : (
          <div className="space-y-8">
            {/* Report Header & Content */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-extrabold text-slate-900 leading-tight flex-1">{report.title}</h1>
                <div className="shrink-0 pt-1">
                  {getStatusBadge(report.status)}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-6">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {new Date(report.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg">{report.category?.name}</span>
              </div>

              <div className="prose prose-slate max-w-none mb-8">
                <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{report.description}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3 border border-slate-100">
                 <div className="bg-white p-2 rounded-lg shadow-sm">
                   <MapPin className="w-5 h-5 text-red-500" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-slate-900 text-sm mb-1">Lokasi Kejadian</h3>
                   <p className="text-slate-600 text-sm leading-relaxed">{report.address || `${report.latitude}, ${report.longitude}`}</p>
                 </div>
              </div>
            </div>

            {/* Tindak Lanjut dari Admin (Official Notes) */}
            {(report.officialNotes?.length > 0) && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 px-2">Tindak Lanjut Instansi</h2>
                <div className="space-y-4">
                  {report.officialNotes.map((note) => (
                    <div key={note.id} className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          {note.author?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{note.author?.name} <span className="text-xs font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded ml-2">Admin {note.author?.role !== 'ADMIN' ? note.author.role : ''}</span></p>
                          <p className="text-xs text-slate-500">{new Date(note.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="text-slate-700 text-sm whitespace-pre-wrap ml-11">
                        {note.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments / Diskusi Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 px-2">Komentar & Diskusi</h2>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-6">
                
                {/* List Komentar */}
                <div className="space-y-5">
                  {!report.comments || report.comments.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm italic py-4">Belum ada diskusi untuk laporan ini.</p>
                  ) : (
                    report.comments.map(c => (
                      <div key={c.id} className={`flex gap-3 ${c.author.id === user?.id ? 'flex-row-reverse text-right' : ''}`}>
                         <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${c.author.role === 'USER' ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white'}`}>
                            {c.author.name?.charAt(0).toUpperCase()}
                         </div>
                         <div className={`flex flex-col ${c.author.id === user?.id ? 'items-end' : 'items-start'} max-w-[80%]`}>
                            <div className="flex items-baseline gap-2 mb-1">
                               <span className="text-xs font-semibold text-slate-700">{c.author.id === user?.id ? 'Anda' : c.author.name}</span>
                               {c.author.role !== 'USER' && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1 rounded border border-blue-100">Admin</span>}
                               <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm ${c.author.id === user?.id ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                               {c.content}
                            </div>
                         </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Form Input Komentar */}
                <div className="pt-4 border-t border-slate-100">
                  <form onSubmit={handleSendComment} className="flex gap-2">
                    <input 
                      type="text" 
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Balas admin atau tulis komentar..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                    />
                    <button 
                      type="submit" 
                      disabled={sendingComment || !commentText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                  <p className="text-[10px] text-slate-400 mt-2 ml-1">Komentar bersifat privat khusus antara pelapor dan instansi terkait.</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
