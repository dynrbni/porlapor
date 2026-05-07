import { ArrowRight, ShieldCheck, Zap, Clock } from 'lucide-react';

export default function Hero() {
  return (
    <section id="beranda" className="relative pt-20 pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-white" />
      <div className="absolute right-0 top-20 -z-10 opacity-20">
        <div className="w-[500px] h-[500px] bg-blue-400 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            Layanan Pengaduan Masyarakat Terpadu
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Suara Anda <span className="text-blue-600">Solusi Kita</span> Bersama
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Sampaikan laporan masalah fasilitas umum, keamanan, dan pelayanan publik di sekitar Anda. Kami pastikan setiap laporan ditindaklanjuti.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50">
              Buat Laporan Sekarang
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-semibold transition-all shadow-sm">
              Lacak Laporan
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm">
            <div className="bg-blue-100 p-3 rounded-2xl mb-4 text-blue-600">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Respons Cepat</h3>
            <p className="text-gray-600 text-sm">Laporan langsung diteruskan ke instansi terkait</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm">
            <div className="bg-green-100 p-3 rounded-2xl mb-4 text-green-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Terpercaya</h3>
            <p className="text-gray-600 text-sm">Privasi dan data diri pelapor dijamin aman</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm">
            <div className="bg-orange-100 p-3 rounded-2xl mb-4 text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Pantau 24/7</h3>
            <p className="text-gray-600 text-sm">Tetap terhubung dengan progres laporan Anda</p>
          </div>
        </div>
      </div>
    </section>
  );
}
