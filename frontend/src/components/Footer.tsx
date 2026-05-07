export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-8 px-4 sm:px-8 border-t-4 border-[--color-ink]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-2 border-white/20 pb-16 mb-8 gap-12">
        <div className="max-w-md">
          <h2 className="font-display font-black text-4xl uppercase mb-6 leading-none">
            Jangan diam. <br /> Ambil tindakan.
          </h2>
          <button className="bg-[#dbfe87] text-black font-display font-bold uppercase tracking-widest px-8 py-4 brutal-border brutal-shadow text-lg border-white hover:bg-white transition-colors">
            Mulai Pengaduan
          </button>
        </div>

        <div className="flex flex-wrap gap-12 font-display font-bold uppercase tracking-wider text-sm">
          <div className="flex flex-col gap-4">
            <span className="text-gray-500 mb-2">Navigasi</span>
            <a href="#beranda" className="hover:text-[#dbfe87] transition-colors">Beranda</a>
            <a href="#cara-kerja" className="hover:text-[#dbfe87] transition-colors">Cara Kerja</a>
            <a href="#" className="hover:text-[#dbfe87] transition-colors">Statistik</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-gray-500 mb-2">Penting</span>
            <a href="#" className="hover:text-[#dbfe87] transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-[#dbfe87] transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-[#dbfe87] transition-colors">Bantuan (FAQ)</a>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
        <span>&copy; {new Date().getFullYear()} PorLapor Team</span>
        <span>Aesthetic Redesign by AI</span>
        <span>Call 1500-111 (Siaga 24 Jam)</span>
      </div>

      {/* Massive Logo at the bottom */}
      <div className="w-full mt-12 overflow-hidden flex justify-center">
        <span className="font-display font-black uppercase text-[15vw] leading-none text-white/5 whitespace-nowrap pointer-events-none selction:bg-transparent">
          PORLAPOR.
        </span>
      </div>
    </footer>
  );
}
