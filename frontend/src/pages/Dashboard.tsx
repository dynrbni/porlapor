import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import { reportService } from '../services/reportService';
import type { Report } from '../services/reportService';
import { useNavigate } from 'react-router-dom';
import ReportCard from '../components/ReportCard';
import { Activity, CheckCircle2, Inbox } from 'lucide-react';

type Tab = 'semua' | 'belum' | 'proses' | 'selesai';

const Dashboard = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('semua');
  const navigate = useNavigate();

  const fetchUserAndReports = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getUser();
      if (!currentUser) {
        setUser(null);
        setReports([]);
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

  const filteredReports = reports.filter(r => {
    switch(activeTab) {
      case 'belum': return r.status === 'PENDING' || r.status === 'IN_REVIEW';
      case 'proses': return r.status === 'IN_PROGRESS';
      case 'selesai': return r.status === 'RESOLVED';
      default: return true;
    }
  });

  const myReports = reports.filter(r => r.user?.id === user?.id);
  const totalMyReports = myReports.length;
  const inProgressMyReports = myReports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'PENDING' || r.status === 'IN_REVIEW').length;
  const doneMyReports = myReports.filter(r => r.status === 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200 flex flex-col relative w-full overflow-x-hidden">
      <Header />
      
      {/* Modern Dashboard Header */}
      <div className="w-full bg-white border-b border-slate-200 pt-28 pb-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden shadow-inner border border-blue-50">
                 <img src={user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nama || 'anon'}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                 <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang, {user?.nama || 'Pengguna'}!</h1>
                 <p className="text-slate-500 text-sm mt-1">Ini adalah ringkasan aktivitas laporan Anda di PorLapor.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/buat-laporan')}
                className="px-5 py-2.5 bg-blue-600 border border-transparent text-white hover:bg-blue-700 rounded-xl transition-colors text-sm font-semibold shadow-sm"
              >
                + Buat Laporan
              </button>
              <button className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors text-sm font-semibold shadow-sm hidden md:block">
                Pengaturan
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Total Laporan Saya</p>
                 <h3 className="text-3xl font-extrabold text-blue-700">{totalMyReports}</h3>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center">
                 <Inbox className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Sedang Diproses</p>
                 <h3 className="text-3xl font-extrabold text-amber-700">{inProgressMyReports}</h3>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-amber-100 flex items-center justify-center">
                 <Activity className="w-6 h-6 text-amber-600" />
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Laporan Selesai</p>
                 <h3 className="text-3xl font-extrabold text-emerald-700">{doneMyReports}</h3>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center">
                 <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full py-10 text-left">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <h2 className="text-xl font-bold text-slate-900">Laporan Saya</h2>
              
              {/* Refined Segmented Control Tabs */}
              <div className="flex bg-slate-200/60 p-1.5 rounded-xl w-full md:w-auto">
                <button
                  onClick={() => setActiveTab('semua')}
                  className={`flex-1 md:px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'semua' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActiveTab('belum')}
                  className={`flex-1 md:px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'belum' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  Menunggu
                </button>
                <button
                  onClick={() => setActiveTab('proses')}
                  className={`flex-1 md:px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'proses' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  Proses
                </button>
                <button
                  onClick={() => setActiveTab('selesai')}
                  className={`flex-1 md:px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'selesai' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  Selesai
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} user={report.user || user} currentUser={user} onLikeToggle={fetchUserAndReports} />
                ))
              ) : (
                <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-500">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Sedang Kosong</h3>
                  <p className="text-sm text-slate-500">Tidak ada laporan yang sesuai dengan kriteria filter saat ini.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
