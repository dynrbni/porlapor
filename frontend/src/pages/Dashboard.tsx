import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import { reportService } from '../services/reportService';
import type { Report } from '../services/reportService';
import { useNavigate } from 'react-router-dom';
import CreateReportForm from '../components/CreateReportForm';
import { PlusCircle, List } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const navigate = useNavigate();

  const fetchUserAndReports = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      
      const response = await reportService.getUserReports(currentUser.id);
      const data = Array.isArray(response) ? response : response.data;
      if (data) {
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndReports();
  }, [navigate]);

  // Pisahkan laporan berdasarkan status (Misal status 'DONE' atau 'COMPLETED' bisa dianggap selesai)
  // Anda dapat menyesuaikan enum dari status laporan 
  const inProgressReports = reports.filter(r => r.status !== 'DONE' && r.status !== 'REJECTED');
  const completedReports = reports.filter(r => r.status === 'DONE');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Menunggu</span>;
      case 'IN_PROGRESS':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Diproses</span>;
      case 'DONE':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Selesai</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Ditolak</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200 flex flex-col relative">
      <Header />
      
      <main className="flex-1 pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {user && (
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Halo, {user.nama}</h1>
            <p className="text-slate-600">Pantau perkembangan laporan pengaduan dan aspirasi Anda di sini.</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
        {/* Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl w-full sm:w-fit mb-8 max-w-sm">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List className="w-4 h-4" />
            Laporan Saya
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'create' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <PlusCircle className="w-4 h-4" />
            Buat Baru
          </button>
        </div>

        {activeTab === 'create' ? (
          <CreateReportForm onSuccess={() => {
            setActiveTab('list');
            fetchUserAndReports();
          }} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kolom Kiri: Laporan Aktif/Diproses */}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                Sedang Diproses
              </h2>
              <div className="space-y-4">
                {inProgressReports.length > 0 ? (
                  inProgressReports.map((report) => (
                    <div key={report.id} className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-slate-900">{report.title}</h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{report.description}</p>
                      <div className="text-xs text-slate-400">
                        {new Date(report.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-8">Tidak ada laporan yang sedang diproses.</p>
                )}
              </div>
            </div>

            {/* Kolom Kanan: Laporan Selesai */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                Riwayat Selesai
              </h2>
              <div className="space-y-4">
                {completedReports.length > 0 ? (
                  completedReports.map((report) => (
                    <div key={report.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-slate-700">{report.title}</h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{report.description}</p>
                      <div className="text-xs text-slate-400">
                        Selesai pada {new Date(report.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-8">Belum ada riwayat laporan yang selesai.</p>
                )}
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
