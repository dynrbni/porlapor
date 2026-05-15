import React, { useEffect, useState } from 'react';
import { getAgencies } from '../services/agencyService';
import Header from '../components/Header';
import type { Agency } from '../services/agencyService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Search, Building2, Phone, MapPin } from 'lucide-react';

const Agencies: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.refresh();
    const fetchAgencies = async () => {
      try {
        const data = await getAgencies();
        setAgencies(data);
      } catch (error) {
        console.error('Failed to fetch agencies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, []);

  const filteredAgencies = agencies.filter((agency) =>
    agency.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (agency.address && agency.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200 flex flex-col relative">
      <Header />
      
      {/* Redesigned Hero Section for Agencies */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-12 z-10">
        {/* Background Gradients similar to landing */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/60 via-slate-50/80 to-transparent pointer-events-none"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <h1 data-aos="fade-up" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Instansi <span className="text-blue-600">Pemerintah.</span>
          </h1>
          <p data-aos="fade-up" data-aos-delay="100" className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
            Temukan instansi tempat Anda dapat mengirimkan laporan, aspirasi, atau pengaduan secara langsung.
          </p>

          <div data-aos="fade-up" data-aos-delay="200" className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama instansi atau lokasi..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-2xl font-medium text-slate-900 transition-all shadow-sm shadow-slate-100 placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Editorial aesthetic blurs and decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
          <div className="w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 pointer-events-none">
          <div className="w-[30rem] h-[30rem] bg-blue-200/30 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Main Content / List per instansi */}
      <section className="pb-24 pt-4 lg:pt-8 w-full z-20 flex-1 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {loading ? (
            <div className="text-center text-slate-500 py-12" data-aos="fade-up">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-medium text-lg">Memuat data instansi...</p>
            </div>
          ) : filteredAgencies.length > 0 ? (
            filteredAgencies.map((agency, index) => (
              <div
                key={agency.id}
                data-aos="fade-up"
                data-aos-delay={(index % 4) * 50}
                className="flex flex-col sm:flex-row items-stretch bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300 group"
              >
                {/* Image Section */}
                <div className="w-full sm:w-64 h-48 sm:h-auto bg-slate-100/80 flex-shrink-0 relative overflow-hidden border-r border-slate-100/50">
                  {agency.photoUrl ? (
                    <>
                      <img 
                        src={agency.photoUrl} 
                        alt={agency.name} 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="image-fallback hidden w-full h-full flex flex-col gap-2 items-center justify-center text-slate-400 bg-slate-200/50">
                        <Building2 className="w-10 h-10 opacity-50" />
                        <span className="text-sm font-medium">Gambar Rusak</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-slate-400 bg-slate-100/50">
                      <Building2 className="w-10 h-10 opacity-50" />
                      <span className="text-sm font-medium">Tanpa Foto</span>
                    </div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-slate-900/5 pointer-events-none"></div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors">
                        {agency.name}
                      </h3>
                      <div className="space-y-3">
                        {agency.phone && (
                          <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Phone className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-sm">{agency.phone}</span>
                          </div>
                        )}
                        {agency.address && (
                          <div className="flex items-start gap-3 text-slate-600">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <MapPin className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm leading-relaxed max-w-xl">{agency.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Optional Action Button (Lihat Laporan dll) */}
                    <div className="hidden lg:block ml-6">
                      <button className="whitespace-nowrap px-6 py-2.5 bg-white border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                        Laporkan Sesuatu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 py-16 bg-white rounded-3xl border border-slate-100 shadow-sm" data-aos="fade-up">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-xl font-semibold mb-2">Instansi tidak ditemukan</p>
              <p className="text-slate-500 max-w-md mx-auto">Kami tidak dapat menemukan nama atau lokasi instansi yang cocok dengan kata kunci "{searchQuery}".</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Agencies;
