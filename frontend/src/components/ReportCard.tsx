import { useNavigate } from 'react-router-dom';
import type { Report } from '../services/reportService';
import type { AuthUser } from '../services/authService';
import { Share2, ThumbsUp, MessageSquare, Repeat, Lock, CheckSquare, Globe, EyeOff, XCircle } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  user: AuthUser | null;
}

export default function ReportCard({ report, user }: ReportCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-5 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow cursor-pointer relative" onClick={() => navigate(`/dashboard/report/${report.id}`)}>
      {/* Header Info */}
      <div className="flex items-start gap-4 mb-3">
        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'anon'}`} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-800 text-base">{user?.name || 'Pengguna'} <span className="text-slate-500 font-normal italic">(Anonim)</span></h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded"><Lock className="w-3 h-3" /> Rahasia</span>
            <span className="text-xs text-slate-400 ml-auto">{new Date(report.createdAt).toLocaleDateString('id-ID', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1 flex-wrap">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Website</span>
            <span className="flex items-center gap-1 text-amber-600"><Repeat className="w-3 h-3" /> Ditindaklanjuti oleh Instansi</span>
            <span className="border border-slate-300 px-2 py-0.5 rounded text-slate-600">Selesai otomatis dalam 6 hari</span>
          </div>
        </div>
      </div>

      <div className="text-sm font-medium text-slate-700 mb-3">
        Terdisposisi ke <span className="font-bold text-black">{report.category?.name || 'Instansi Terkait'}</span>
      </div>

      <h2 className="text-xl font-bold text-blue-700 hover:text-blue-800 mb-2 leading-tight">
        {report.title}
      </h2>

      <p className="text-slate-700 text-sm leading-relaxed mb-1 line-clamp-3">
        {report.description}
      </p>
      <button className="text-blue-600 text-sm hover:underline mb-4 font-medium" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/report/${report.id}`); }}>Selengkapnya</button>

      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-5">
        <span>{new Date(report.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')}</span>
        <span>|</span>
        <span className="flex items-center gap-1">{report.category?.name?.toUpperCase()}</span>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-slate-100 text-sm font-medium text-slate-600" onClick={(e) => e.stopPropagation()}>
        <span className="text-slate-400">#{report.id.substring(0,8).toUpperCase()}</span>
        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><CheckSquare className="w-4 h-4 text-blue-600" /> Tutup Laporan</button>
        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><Repeat className="w-4 h-4 text-blue-600" /> Tindak Lanjut {report.officialNotes?.length || 0}</button>
        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><MessageSquare className="w-4 h-4 text-blue-600" /> Komentar {report.comments?.length || 0}</button>
        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><ThumbsUp className="w-4 h-4 text-blue-600" /> Dukung</button>
        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><Share2 className="w-4 h-4 text-blue-600" /> Bagikan</button>
      </div>

      {report.status !== 'DONE' && (
        <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-slate-100 text-sm font-medium text-slate-600" onClick={(e) => e.stopPropagation()}>
          <button className="flex items-center gap-1.5 hover:text-red-600 transition-colors"><XCircle className="w-4 h-4 text-blue-600" /> Permohonan Hapus Laporan</button>
          <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><EyeOff className="w-4 h-4 text-blue-600" /> Publikasikan Laporan</button>
        </div>
      )}
    </div>
  );
}
