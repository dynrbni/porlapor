import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import { reportService } from '../services/reportService';
import type { Report } from '../services/reportService';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle2, Clock, Inbox, ShieldAlert, ArrowRight } from 'lucide-react';

type Tab = 'semua' | 'pending' | 'proses' | 'selesai' | 'ditolak';

const AdminDashboard = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('semua');
  const navigate = useNavigate();

  const fetchUserAndReports = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getUser();
      if (currentUser) setUser(currentUser);
      
      const response = await reportService.getAllReports();
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

  const filteredReports = reports.filter(r => {
    switch(activeTab) {
      case 'pending': return r.status === 'PENDING' || r.status === 'IN_REVIEW';
      case 'proses': return r.status === 'IN_PROGRESS';
      case 'selesai': return r.status === 'RESOLVED';
      case 'ditolak': return r.status === 'REJECTED';
      default: return true;
    }
  });

  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'PENDING' || r.status === 'IN_REVIEW').length;
  const inProgressReports = reports.filter(r => r.status === 'IN_PROGRESS').length;
  const doneReports = reports.filter(r => r.status === 'RESOLVED').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'IN_REVIEW':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Menunggu</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Diproses</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Selesai</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 border border-red-200">Ditolak</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-200 flex flex-col relative w-full overflow-x-hidden">
      <Header />
      
      {/* Admin Dashboard Header */}
      <div className="w-full bg-slate-900 border-b border-slate-800 pt-28 pb-8 px-4 sm:px-6 relative z-10 text-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-indigo-900 overflow-hidden shadow-inner border-2 border-indigo-500">
                 <img src={user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nama || 'admin'}`} alt="Admin Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                 <h1 className="text-3xl font-extrabold tracking-tight">Admin Control Panel</h1>
                 <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4 text-indigo-400" />
                   Anda masuk sebagai {user?.role === 'SUPERADMIN' ? 'Super Admin' : 'Admin'}
                 </p>
              </div>
            </div>
            
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors text-sm font-semibold shadow-sm border border-indigo-400">
              Kelola Admin
            </button>
          </div>

          {/* Admin Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-slate-400 mb-1">Total Laporan</p>
                 <h3 className="text-3xl font-extrabold text-white">{totalReports}</h3>
              </div>
              <div className="w-12 h-12 bg-slate-700 rounded-xl shadow-sm border border-slate-600 flex items-center justify-center">
                 <Inbox className="w-6 h-6 text-slate-300" />
              </div>
            </div>

            <div className="bg-amber-900/20 border border-amber-800/50 p-5 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-amber-500 mb-1">Perlu Tinjauan</p>
                 <h3 className="text-3xl font-extrabold text-amber-400">{pendingReports}</h3>
              </div>
              <div className="w-12 h-12 bg-amber-900/50 rounded-xl shadow-sm border border-amber-700 flex items-center justify-center">
                 <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-800/50 p-5 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-blue-500 mb-1">Sedang Diproses</p>
                 <h3 className="text-3xl font-extrabold text-blue-400">{inProgressReports}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-900/50 rounded-xl shadow-sm border border-blue-700 flex items-center justify-center">
                 <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-800/50 p-5 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-emerald-500 mb-1">Laporan Selesai</p>
                 <h3 className="text-3xl font-extrabold text-emerald-400">{doneReports}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-900/50 rounded-xl shadow-sm border border-emerald-700 flex items-center justify-center">
                 <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-10 text-left">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-extrabold text-slate-900">Daftar Laporan Masyarakat</h2>
              
              <div className="flex bg-slate-200/60 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto">
                {(['semua', 'pending', 'proses', 'selesai', 'ditolak'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[90px] md:px-5 py-2 text-sm font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="p-4">ID Laporan</th>
                      <th className="p-4 min-w-[200px]">Pelapor</th>
                      <th className="p-4 min-w-[300px]">Judul Info</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 text-sm font-semibold text-slate-700">
                            {report.id}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                <img src={report.user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${report.user?.id || 'anon'}`} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{report.user?.name || report.user?.nama || 'Anonim'}</p>
                                <p className="text-xs text-slate-500">{report.user?.email || '-'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{report.title}</p>
                            <p className="text-xs font-semibold text-indigo-600 mt-0.5">{report.category?.name || 'UMUM'}</p>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(report.status)}
                          </td>
                          <td className="p-4 text-sm font-medium text-slate-600">
                            {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => navigate(`/admin/report/${report.id}`)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                              title="Lihat Detail"
                            >
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Inbox className="w-8 h-8 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 mb-1">Data Kosong</h3>
                          <p className="text-sm text-slate-500">Tidak ada laporan yang ditemukan untuk status "{activeTab}".</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
