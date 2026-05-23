import { useState } from 'react';
import { reportService, type Report } from '../services/reportService';
import { Search, Calendar, MapPin, Tag, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';

export default function ReportTracker() {
  const [reportId, setReportId] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportId.trim()) {
      setError('Masukkan ID laporan');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await reportService.getReportById(reportId);
      setReport(data.data);
    } catch (err) {
      setError('Laporan tidak ditemukan atau ID tidak valid');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'IN_REVIEW':
        return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100' };
      case 'IN_PROGRESS':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100' };
      case 'RESOLVED':
        return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100' };
      case 'REJECTED':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100' };
      default:
        return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', badge: 'bg-slate-100' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'IN_REVIEW':
        return 'Menunggu Ditinjau';
      case 'IN_PROGRESS':
        return 'Sedang Diproses';
      case 'RESOLVED':
        return 'Selesai';
      case 'REJECTED':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'IN_REVIEW':
        return <Clock className="w-5 h-5" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="w-5 h-5" />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'REJECTED':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'IN_REVIEW':
        return 33;
      case 'IN_PROGRESS':
        return 66;
      case 'RESOLVED':
        return 100;
      case 'REJECTED':
        return 0;
      default:
        return 0;
    }
  };

  const colors = report ? getStatusColor(report.status) : { bg: '', border: '', text: '', badge: '' };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Lacak Laporan Kamu
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Masukkan ID laporan untuk melihat perkembangan dan status terbaru dari laporan kamu
          </p>
        </div>

        {/* Search Form */}
        <div className="flex justify-center">
          <form onSubmit={handleSearch} className="w-full max-w-md">
            <div className="relative flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  placeholder="Masukkan ID laporan (contoh: 550e8400-e29b-41d4-a716-446655440000)"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                {loading ? 'Mencari...' : 'Cari'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Report Details */}
        {report && (
          <div className={`max-w-2xl mx-auto border-2 rounded-xl p-6 sm:p-8 space-y-6 ${colors.border} ${colors.bg}`}>
            {/* Status Badge and Title */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${colors.badge}`}>
                  {getStatusIcon(report.status)}
                </div>
                <div>
                  <span className={`text-sm font-bold ${colors.text}`}>
                    {getStatusLabel(report.status)}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Status Laporan
                  </p>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 line-clamp-2">
                {report.title}
              </h3>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700">Progress Laporan</span>
                <span className={`font-bold ${colors.text}`}>{getProgressPercentage(report.status)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    report.status.toUpperCase() === 'REJECTED'
                      ? 'bg-red-500'
                      : report.status.toUpperCase() === 'RESOLVED'
                        ? 'bg-emerald-500'
                        : report.status.toUpperCase() === 'IN_PROGRESS'
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                  }`}
                  style={{ width: `${getProgressPercentage(report.status)}%` }}
                />
              </div>
            </div>

            {/* Timeline/Stages */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Tahapan Laporan</p>
              <div className="flex items-center justify-between gap-3">
                {/* Menunggu */}
                <div className="flex-1 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      ['PENDING', 'IN_REVIEW', 'IN_PROGRESS', 'RESOLVED'].includes(
                        report.status.toUpperCase()
                      )
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Menunggu</span>
                </div>

                {/* Connector 1 */}
                <div
                  className={`flex-1 h-1 rounded-full mb-8 ${
                    ['IN_PROGRESS', 'RESOLVED'].includes(report.status.toUpperCase())
                      ? 'bg-blue-500'
                      : 'bg-slate-200'
                  }`}
                />

                {/* Diproses */}
                <div className="flex-1 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      ['IN_PROGRESS', 'RESOLVED'].includes(report.status.toUpperCase())
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Diproses</span>
                </div>

                {/* Connector 2 */}
                <div
                  className={`flex-1 h-1 rounded-full mb-8 ${
                    report.status.toUpperCase() === 'RESOLVED' ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />

                {/* Selesai */}
                <div className="flex-1 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      report.status.toUpperCase() === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Selesai</span>
                </div>
              </div>
            </div>

            {/* Report Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              {/* ID */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Laporan</p>
                <p className="text-sm font-mono text-slate-900 mt-1 break-all">{report.id}</p>
              </div>

              {/* Tanggal */}
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal Laporan</p>
                </div>
                <p className="text-sm text-slate-900 mt-1">
                  {new Date(report.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Kategori */}
              {report.category && (
                <div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</p>
                  </div>
                  <p className="text-sm text-slate-900 mt-1">{report.category.name}</p>
                </div>
              )}

              {/* Alamat */}
              {report.address && (
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lokasi</p>
                  </div>
                  <p className="text-sm text-slate-900 mt-1">{report.address}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deskripsi Laporan</p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                {report.description}
              </p>
            </div>

            {/* Image */}
            {report.imageUrl && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Bukti Laporan</p>
                <img
                  src={report.imageUrl}
                  alt="Bukti laporan"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Official Notes */}
            {report.officialNotes && report.officialNotes.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catatan Instansi</p>
                <div className="space-y-2">
                  {report.officialNotes.map((note) => (
                    <div key={note.id} className="bg-white rounded-lg p-3 border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">
                        {new Date(note.createdAt).toLocaleDateString('id-ID')} • {note.author.nama || note.author.name}
                      </p>
                      <p className="text-sm text-slate-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!report && !loading && !error && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 text-sm">Belum ada pencarian. Masukkan ID laporan di atas untuk memulai.</p>
          </div>
        )}
      </div>
    </section>
  );
}
