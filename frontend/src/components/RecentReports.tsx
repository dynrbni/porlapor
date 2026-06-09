import { useEffect, useState } from 'react';
import { reportService, type Report } from '../services/reportService';
import { MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecentReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await reportService.getAllReports();
        // Ambil maksimal 6 laporan terbaru
        setReports(response.data.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch recent reports', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Menunggu',
      PROCESSED: 'Diproses',
      RESOLVED: 'Selesai',
      REJECTED: 'Ditolak'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'PROCESSED': return 'bg-blue-100 text-blue-700';
      case 'RESOLVED': return 'bg-green-100 text-green-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="py-16 bg-white flex justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Laporan Terbaru
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Pantau berbagai laporan dan aspirasi yang baru saja disampaikan oleh masyarakat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <div 
              key={report.id} 
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
              onClick={() => navigate(`/laporan/${report.id}`)}
              title="Klik untuk melihat detail laporan"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                  {getStatusLabel(report.status)}
                </span>
                <span className="text-xs text-slate-500 font-medium font-mono">#{report.id}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {report.title}
              </h3>
              
              <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
                {report.description}
              </p>

              <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
                {report.address && (
                  <div className="flex items-start text-xs text-slate-500">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{report.address}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-[10px]">
                      {(report.user?.name || report.user?.nama || 'A')[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700">{report.user?.name || report.user?.nama || 'Anonim'}</span>
                  </div>
                  <span>{formatDate(report.createdAt)}</span>
                </div>
              </div>
              
              <div className="mt-5 pt-3 text-center">
                 <button className="text-blue-600 text-sm font-semibold group-hover:text-blue-700 flex items-center justify-center w-full">
                    <Search className="w-4 h-4 mr-1.5" />
                    Lihat Detail
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
