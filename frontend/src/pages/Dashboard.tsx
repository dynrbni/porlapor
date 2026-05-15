import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
import { reportService } from '../services/reportService';
import type { Report } from '../services/reportService';
import { useNavigate } from 'react-router-dom';
import ReportCard from '../components/ReportCard';

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
      case 'belum': return r.status === 'PENDING' || r.status === 'IN_REVIEW';
      case 'proses': return r.status === 'IN_PROGRESS';
      case 'selesai': return r.status === 'DONE' || r.status === 'RESOLVED';
      default: return true;
    }
  });

  return (
    <div className="min-h-screen bg-[#f3f4f6] selection:bg-blue-200 flex flex-col relative w-full overflow-x-hidden">
      <Header />
      
      {/* Soft Blue Hero Profile Banner (PorLapor Style) */}
      <div className="w-full bg-blue-600 pt-32 pb-12 px-4 sm:px-6 relative overflow-hidden" 
           style={{ backgroundImage: "linear-gradient(to right, #2563eb, #1e40af)" }}>
        {/* Background Patterns (cleaner, less intrusive) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                 <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="white"/>
                 </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
           </svg>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10 w-full">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white/20 bg-slate-200 overflow-hidden shrink-0 shadow-xl">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'anon'}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left text-white mt-2 md:mt-0">
             <h1 className="text-3xl font-extrabold mb-1 tracking-tight">{user?.name || 'Pengguna'}</h1>
             <p className="text-blue-100 text-sm font-medium">Bergabung sejak {new Date().getFullYear()}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-6 mt-6 md:mt-0 text-white">
             <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-center">
                <div className="text-3xl font-extrabold">{reports.filter(r => r.user?.id === user?.id).length || 0}</div>
                <div className="text-xs uppercase tracking-wider font-semibold opacity-90 mt-1">Total Laporan</div>
             </div>
             
             <button className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-sm font-bold shadow-sm">
               Edit Profil
             </button>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full py-8 text-left">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full mb-8">
                <button
                  onClick={() => setActiveTab('semua')}
                  className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all ${activeTab === 'semua' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-blue-600 hover:bg-white/50'}`}
                >
                  Semua Laporan
                </button>
                <button
                  onClick={() => setActiveTab('belum')}
                  className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all ${activeTab === 'belum' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-blue-600 hover:bg-white/50'}`}
                >
                  Menunggu
                </button>
                <button
                  onClick={() => setActiveTab('proses')}
                  className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all ${activeTab === 'proses' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-blue-600 hover:bg-white/50'}`}
                >
                  Sedang Diproses
                </button>
                <button
                  onClick={() => setActiveTab('selesai')}
                  className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all ${activeTab === 'selesai' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-blue-600 hover:bg-white/50'}`}
                >
                  Selesai
                </button>
              </div>

              <div className="bg-transparent space-y-6">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, idx) => (
                    <div key={report.id} className="bg-white border text-left border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                      <ReportCard report={report} user={report.user || user} currentUser={user} onLikeToggle={fetchUserAndReports} />
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center text-slate-500 text-sm py-16">
                    Tidak ada laporan pada kategori ini.
                  </div>
                )}
                <div className="p-4 text-center text-slate-400 text-sm font-medium">
                  Tidak ada laporan lain untuk ditampilkan.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
