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
      
      {/* Red Hero Profile Banner */}
      <div className="w-full bg-[#c8203f] pt-28 pb-10 px-4 sm:px-6 relative overflow-hidden" 
           style={{ backgroundImage: "linear-gradient(45deg, #c8203f 0%, #a41731 100%)" }}>
        {/* Background Patterns (mock) */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                 <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 40 0 0 Z" fill="none" stroke="white" strokeWidth="1"/>
                 </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10 w-full">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shrink-0 shadow-lg">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'anon'}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left text-white mt-2 md:mt-0">
             <h1 className="text-2xl sm:text-3xl font-semibold mb-2">{user?.name || 'Pengguna'}</h1>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-8 md:gap-12 mt-4 md:mt-0 text-white">
             <div className="text-center">
                <div className="text-2xl font-bold">{reports.filter(r => r.user?.id === user?.id).length || 1}</div>
                <div className="text-xs uppercase tracking-wider font-semibold opacity-80">laporan</div>
             </div>
             <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs uppercase tracking-wider font-semibold opacity-80">mengikuti</div>
             </div>
             <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs uppercase tracking-wider font-semibold opacity-80">pengikut</div>
             </div>
             <button className="px-6 py-2 border-2 border-white/80 hover:bg-white hover:text-[#c8203f] rounded transition-colors text-sm font-bold uppercase ml-0 md:ml-4 tracking-wider">
               Ubah
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
              <div className="flex bg-white shadow-sm rounded-t-xl w-full border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('semua')}
                  className={`py-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'semua' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  Semua
                  {activeTab === 'semua' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
                </button>
                <button
                  onClick={() => setActiveTab('belum')}
                  className={`py-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'belum' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  Belum
                  {activeTab === 'belum' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
                </button>
                <button
                  onClick={() => setActiveTab('proses')}
                  className={`py-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'proses' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  Proses
                  {activeTab === 'proses' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
                </button>
                <button
                  onClick={() => setActiveTab('selesai')}
                  className={`py-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'selesai' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  Selesai
                  {activeTab === 'selesai' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
                </button>
              </div>

              <div className="bg-white border-x border-b border-slate-200 rounded-b-xl shadow-sm pb-2">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, idx) => (
                    <div key={report.id} className={idx !== 0 ? 'border-t border-slate-100' : ''}>
                      <ReportCard report={report} user={report.user || user} currentUser={user} onLikeToggle={fetchUserAndReports} />
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm py-16">
                    Tidak ada laporan pada kategori ini.
                  </div>
                )}
                <div className="p-4 text-center text-slate-500 text-sm border-t border-slate-100">
                  There are no more pages left to load.
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
