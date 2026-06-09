import { useNavigate } from 'react-router-dom';
import type { Report } from '../services/reportService';
import type { AuthUser } from '../services/authService';
import { reportService } from '../services/reportService';
import { MessageCircle, ThumbsUp, ArrowRight, Image as ImageIcon, MapPin, Calendar, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './Toast';

interface ReportCardProps {
  report: Report;
  user: any;
  currentUser: AuthUser | null;
  onLikeToggle?: () => void;
}

export default function ReportCard({ report, currentUser, onLikeToggle }: ReportCardProps) {
  const navigate = useNavigate();
  const [liking, setLiking] = useState(false);
  const { showToast } = useToast();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      showToast('Silakan login untuk memberikan dukungan.', 'warning');
      return;
    }
    setLiking(true);
    try {
      const res = await reportService.toggleLike(report.id);
      showToast(res.liked ? 'Laporan didukung.' : 'Dukungan dibatalkan.');
      if (onLikeToggle) onLikeToggle();
    } catch(err) {
      console.error(err);
      showToast('Gagal mengubah dukungan.', 'error');
    } finally {
      setLiking(false);
    }
  };

  const isLikedByMe = report.likes?.some(like => like.userId === currentUser?.id);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'IN_REVIEW':
        return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-3.5 h-3.5" />, text: 'Menunggu' };
      case 'IN_PROGRESS':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Clock className="w-3.5 h-3.5" />, text: 'Sedang Diproses' };
      case 'RESOLVED':
        return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: 'Selesai' };
      case 'REJECTED':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: <ShieldAlert className="w-3.5 h-3.5" />, text: 'Ditolak' };
      default:
        return { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: null, text: status };
    }
  };

  const statusInfo = getStatusDisplay(report.status);

  return (
    <div 
      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full" 
      onClick={() => navigate(`/dashboard/report/${report.id}`)}
    >
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 ${statusInfo.color}`}>
          {statusInfo.icon}
          {statusInfo.text}
        </div>
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
          {report.category?.name?.toUpperCase() || 'UMUM'}
        </span>
      </div>

      <h2 className="text-xl font-extrabold text-slate-900 mb-2 leading-snug line-clamp-2">
        {report.title}
      </h2>

      <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
        {report.description}
      </p>

      {report.imageUrl && (
        <div className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 w-fit px-2.5 py-1 rounded-md">
          <ImageIcon className="w-3.5 h-3.5" /> Ada Lampiran Foto
        </div>
      )}

      <div className="flex flex-col gap-2 mb-6">
         <div className="flex items-start gap-2 text-xs font-medium text-slate-500">
           <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
           <span className="line-clamp-1">{report.address || `${report.latitude}, ${report.longitude}`}</span>
         </div>
         <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
           <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
           <span>{new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
         </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            disabled={liking}
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors py-1 px-2 rounded-lg -ml-2 ${isLikedByMe ? 'text-blue-700 bg-blue-50 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-semibold'}`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLikedByMe ? 'fill-blue-700' : ''}`} /> 
            {report._count?.likes || 0}
          </button>
          
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 py-1">
            <MessageCircle className="w-4 h-4" /> 
            {report.comments?.length || 0}
          </div>
        </div>

        <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors group">
           Detail <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
