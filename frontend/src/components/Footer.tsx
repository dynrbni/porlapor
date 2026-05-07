export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-[16px] border-[#df3817]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16 lg:py-24">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-5">
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              PRLPR.<br/>
              Sistem<br/>
              Aduan<br/>
              Publik.
            </h2>
            <div className="w-16 h-2 bg-white mb-8"></div>
            <p className="font-medium text-white/50 max-w-sm">
              Inisiatif keterbukaan data dan transparansi layanan masyarakat. Laporkan, pantau, dan selesaikan masalah publik bersama.
            </p>
          </div>

          <div className="lg:col-span-3">
             <h4 className="text-xs font-black uppercase tracking-widest text-[#df3817] mb-6">Navigasi Utama</h4>
             <ul className="space-y-4 font-bold uppercase tracking-wider text-sm">
               <li><a href="#" className="hover:text-[#df3817] transition-colors">Verifikasi NIK</a></li>
               <li><a href="#" className="hover:text-[#df3817] transition-colors">Database Laporan</a></li>
               <li><a href="#" className="hover:text-[#df3817] transition-colors">Dashboard Statistik</a></li>
               <li><a href="#" className="hover:text-[#df3817] transition-colors">Panduan Sistem</a></li>
             </ul>
          </div>

          <div className="lg:col-span-4">
             <h4 className="text-xs font-black uppercase tracking-widest text-[#df3817] mb-6">Titik Kontak</h4>
            <ul className="space-y-4 font-medium text-sm text-white/70">
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span className="uppercase tracking-widest text-xs font-bold text-white">Call Center</span>
                <span>1-4-7</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span className="uppercase tracking-widest text-xs font-bold text-white">Email</span>
                <span>info@porlapor.go.id</span>
              </li>
              <li className="flex flex-col gap-2 pt-2 text-xs uppercase tracking-widest leading-relaxed">
                <strong className="text-white">Alamat Operasional</strong>
                Gedung Kementerian Pelayanan Publik Lt. 4<br/>
                Kawasan Medan Merdeka, Jakarta Pusat 10110
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t-2 border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/50">
          <p>&copy; {new Date().getFullYear()} REPUBLIK INDONESIA — HAK CIPTA DILINDUNGI.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-white">Privasi</a>
             <a href="#" className="hover:text-white">Ketentuan</a>
             <span>V 2.5 — Editorial</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
