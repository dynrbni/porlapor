import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      {/* Newsletter / Action Banner */}
      <div className="border-b border-white/10">
        <div data-aos="fade-up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
           <h3 className="text-xl font-bold text-white tracking-tight">Perlu bantuan lebih lanjut? Konsultasikan masalah Anda.</h3>
           <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg text-sm font-bold transition-colors cursor-pointer">
              Pusat Panduan & FAQ
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div data-aos="fade-up" data-aos-delay="100" className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="PorLapor" className="h-8 w-auto brightness-0 invert" />
              <span className="font-extrabold text-xl text-white tracking-tight leading-none block">PorLapor</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Platform CivicTech integrasi layanan masyarakat. Mewujudkan pemerintahan yang bersih, responsif, dan berbasis data real-time.
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="200" className="md:col-span-3 md:col-start-6">
             <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Ruang Lingkup</h4>
             <ul className="space-y-3 text-sm text-slate-400 font-medium">
               <li><a href="#" className="hover:text-blue-400 transition-colors">Statistik Penyelesaian</a></li>
               <li><a href="#" className="hover:text-blue-400 transition-colors">Daftar Instansi</a></li>
               <li><a href="#" className="hover:text-blue-400 transition-colors">Kebijakan Privasi Data</a></li>
               <li><a href="#" className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</a></li>
             </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="300" className="md:col-span-4">
             <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Kontak Resmi</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-500 mt-0.5" />
                <span>Hotline: 1-400-LAPOR</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-500 mt-0.5" />
                <span>halo@porlapor.go.id</span>
              </li>
              <li className="flex items-start gap-3 border-t border-white/10 pt-4">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Jl. Jenderal Sudirman No.1, RT.1/RW.3, Gelora, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10270</span>
              </li>
            </ul>
          </div>
          
        </div>
      </div>

      <div className="bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
           <p>&copy; {new Date().getFullYear()} PorLapor Indonesia.</p>
           <div className="flex items-center gap-2">
               #KoalisiIndonesiaMaju
           </div>
        </div>
      </div>
    </footer>
  );
}
