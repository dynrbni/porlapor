import { FileText, ChevronRight, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section id="beranda" className="relative bg-white pt-16 pb-24 overflow-hidden border-b border-slate-200">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-slate-50 rounded-l-[100px] -z-10 hidden lg:block"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Portal Resmi Pengaduan Terintegrasi
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
              Layanan Aspirasi & <br/>
              <span className="text-blue-700">Pengaduan Rakyat</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Sampaikan laporan masalah fasilitas umum, keamanan, dan pelayanan publik di sekitar Anda. Terhubung langsung dengan instansi berwenang untuk penanganan yang transparan dan akuntabel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
                <FileText className="w-5 h-5" />
                Buat Pengaduan
              </button>
              <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 px-8 py-3.5 rounded-lg font-semibold transition-all shadow-sm">
                Lacak Status
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 relative z-10">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Status Laporan Terkini</h3>
                <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">Lihat Semua</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { id: '#L-2983', title: 'Jalan Rusak di Merdeka', status: 'Selesai', date: '2 Jam lalu', color: 'text-green-700 bg-green-50 border-green-100' },
                  { id: '#L-2984', title: 'Lampu PJU Padam', status: 'Proses', date: '5 Jam lalu', color: 'text-amber-700 bg-amber-50 border-amber-100' },
                  { id: '#L-2985', title: 'Tumpukan Sampah', status: 'Selesai', date: '1 Hari lalu', color: 'text-green-700 bg-green-50 border-green-100' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-3 rounded-lg hidden sm:block">
                        <FileText className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{item.title}</h4>
                        <span className="text-sm text-slate-500">{item.id} &bull; {item.date}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decorative metric */}
            <div className="absolute -right-4 lg:-right-8 -bottom-6 bg-blue-900 rounded-2xl p-6 text-white shadow-xl max-w-xs z-20">
              <div className="flex items-center gap-4">
                <div className="bg-blue-800 p-3 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-blue-300" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm font-medium">Tingkat Penanganan</p>
                  <p className="text-3xl font-bold">92.4%</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
