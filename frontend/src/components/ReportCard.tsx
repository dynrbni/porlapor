import { useNavigate } from 'react-router-dom';
import type { Report } from '../services/reportService';
import type { AuthUser } from '../services/authService';
import { reportService } from '../services/reportService';
import { Share2, ThumbsUp, MessageSquare, Repeat, Lock, CheckSquare, Globe, EyeOff, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ReportCardProps {
  report: Report;
  user: any;
  currentUser: AuthUser | null;
  onLikeToggle?: () => void;
}

export default function ReportCard({ report, user, currentUser, onLikeToggle }: ReportCardProps) {
  const navigate = useNavigate();
  const [liking, setLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      alert("Silakan login untuk memberikan dukungan");
      return;
    }
    setLiking(true);
    try {
      await reportService.toggleLike(report.id);
      if (onLikeToggle) onLikeToggle();
    } catch(err) {
      console.error(err);
    } finally {
      setLiking(false);
    }
  };

  const isLikedByMe = report.likes?.some(like => like.userId === currentUser?.id);
  const isMine = report.userId === currentUser?.id || currentUser?.role === 'ADMIN';

  return (
    <div className="bg-white p-5 hover:bg-slate-50 transition-colors cursor-pointer relative" onClick={() => navigate(`/dashboard/report/${report.id}`)}>
      {/* Header Info */}
      <div className="flex items-start gap-4 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
          <img src={user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'anon'}`} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 w-full overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-2 w-full text-sm">
            <h3 className="font-bold text-blue-600 truncate max-w-[200px] sm:max-w-xs">{user?.name || 'Pengguna'}</h3>
            <span className="text-slate-500 font-normal italic text-xs">(Anonim)</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded ml-1"><Lock className="w-3 h-3" /> Rahasia</span>
            <span className="text-[11px] text-slate-400 ml-auto whitespace-nowrap">{new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})} lalu</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500 mt-1">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Website</span>
            <span className="flex items-center gap-1 text-amber-600"><Repeat className="w-3 h-3" /> Ditanggapi oleh Pelapor</span>
          </div>
        </div>
      </div>

      <div className="text-xs font-medium text-slate-700 mb-3">
        Terdisposisi ke <span className="font-bold text-black">{report.category?.name || 'Instansi Terkait'}</span>
      </div>

      <h2 className="text-xl font-bold text-blue-700 mb-2 leading-tight">
        {report.title}
      </h2>

      <p className="text-slate-700 text-sm leading-relaxed mb-1 line-clamp-3">
        {report.description}
      </p>
      <button className="text-blue-600 text-sm hover:underline mb-4 font-medium" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/report/${report.id}`); }}>Selengkapnya</button>

      <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-5">
        <span className="flex items-center gap-1 tracking-wider"><span className="w-3 h-3 border border-slate-400 rounded-sm inline-flex items-center justify-center pt-[1px] opacity-80">R</span> {new Date(report.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')}</span>
        <span>|</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-400 rounded-sm opacity-60"></span> {report.category?.name?.toUpperCase()}</span>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 font-medium text-[13px] text-slate-600 pb-2" onClick={(e) => e.stopPropagation()}>
        <span className="text-slate-400 text-xs">#{report.id.substring(0,8).toUpperCase()}</span>
        
        {isMine && <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><CheckSquare className="w-4 h-4 text-blue-600" /> Tutup Laporan</button>}
        
        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><Repeat className="w-4 h-4 text-blue-600" /> Tindak Lanjut {report.officialNotes?.length || 0}</button>
        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><MessageSquare className="w-4 h-4 text-blue-600" /> Komentar {report.comments?.length || 0}</button>
        
        <button 
          disabled={liking}
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors ${isLikedByMe ? 'text-blue-700 font-bold' : 'hover:text-blue-600'}`}
        >
          <ThumbsUp className={`w-4 h-4 ${isLikedByMe ? 'text-blue-700 fill-blue-700' : 'text-blue-600'}`} /> 
          Dukung {report._count?.likes ? `(${report._count.likes})` : ''}
        </button>
        
        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><Share2 className="w-4 h-4 text-blue-600" /> Bagikan</button>
      </div>

      {isMine && report.status !== 'DONE' && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-3 pt-3 text-[13px] font-medium text-slate-600" onClick={(e) => e.stopPropagation()}>
          <button className="flex items-center gap-1.5 hover:text-red-600 transition-colors"><XCircle className="w-4 h-4 text-blue-600" /> Permohonan Hapus Laporan</button>
          <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><EyeOff className="w-4 h-4 text-blue-600" /> Publikasikan Laporan</button>
        </div>
      )}
    </div>
  );
}
