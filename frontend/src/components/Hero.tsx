import { ArrowRight, Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 min-h-[90vh] flex items-center">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop" 
          alt="City aerial view" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-slate-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">
         
          
          <h1 data-aos="fade-up" className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Layanan Pengaduan Publik <span className="text-teal-600">Terbuka & Transparan.</span>
          </h1>
          
          <p data-aos="fade-up" data-aos-delay="100" className="text-lg sm:text-xl text-slate-600 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
            Sampaikan aspirasi, permintaan, informasi, maupun pengaduan langsung kepada instansi berwenang. Semua laporan diproses secara transparan dan rahasia.
          </p>
          
          <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-teal-500/25 flex items-center justify-center gap-2 group cursor-pointer">
              Tulis Laporan Baru
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="w-full sm:w-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Lacak ID Laporan..." 
                className="w-full sm:w-72 pl-12 pr-4 py-4 bg-white border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none rounded-xl font-medium text-slate-900 transition-all shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Editorial aesthetic blurs and decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
        <div className="w-96 h-96 bg-teal-200/40 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 pointer-events-none">
        <div className="w-[30rem] h-[30rem] bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>
      
      {/* Background Grid Pattern (Subtle) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
    </section>
  );
}
