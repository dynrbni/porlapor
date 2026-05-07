import { Shield, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white block leading-tight">PorLapor</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-tight">Republik Indonesia</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Sistem Informasi Pengelolaan Pengaduan Pelayanan Publik Nasional. Layanan aspirasi dan pengaduan elektronik terintegrasi.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Tautan Penting</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Statistik Publik</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Pusat Bantuan</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Panduan Pengguna</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tanya Jawab (FAQ)</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Glosarium Khusus</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Kontak Resmi</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <span>Call Center: 147</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <span>bantuan@porlapor.go.id</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <span>Gedung Kementerian Pelayanan Publik Lt. 4, Jakarta Pusat 10110</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-700 text-sm text-center md:flex md:justify-between md:text-left">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} PorLapor - Sistem Pengaduan Masyarakat Terpadu. Hak Cipta Dilindungi.</p>
          <div className="flex justify-center gap-6">
             <span className="text-slate-500">Versi 2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
