export default function Hero() {
  return (
    <section id="beranda" className="relative flex flex-col pt-10 sm:pt-20 px-4 sm:px-8 border-b-2 border-dashed border-[--color-ink]">
      <div className="flex flex-col lg:flex-row items-stretch border-b-2 border-[--color-ink]">
        
        {/* Left Content */}
        <div className="flex-1 py-12 lg:py-24 lg:pr-12 flex flex-col justify-center border-b-2 lg:border-b-0 lg:border-r-2 border-[--color-ink]">
          <div className="inline-flex max-w-max border-2 border-[--color-ink] px-3 py-1 bg-[--color-brand] text-white font-display font-bold uppercase text-xs tracking-widest mb-8">
            Layanan Aduan Publik
          </div>
          
          <h1 className="font-display font-black text-6xl sm:text-7xl lg:text-[7rem] leading-[0.9] uppercase tracking-tighter mb-8 text-balance">
            Suara <br/>
            Kalian <br/>
            <span className="text-[--color-brand]">Senjata</span> Kita.
          </h1>
          
          <p className="text-xl sm:text-2xl font-medium max-w-xl leading-relaxed mb-10 border-l-4 border-[--color-brand] pl-6 text-gray-800">
            Sistem pengaduan modern untuk melaporkan masalah kota tanpa birokrasi berbelit. Tajam, cepat, terpantau.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="bg-[--color-brand] text-white font-display font-bold uppercase tracking-widest px-8 py-4 brutal-border brutal-shadow text-lg flex items-center justify-between group">
              <span>Lapor Sekarang</span>
              <span className="ml-4 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="bg-transparent text-[--color-ink] font-display font-bold uppercase tracking-widest px-8 py-4 brutal-border brutal-shadow text-lg transition-colors hover:bg-gray-100">
              Lacak Pengaduan
            </button>
          </div>
        </div>

        {/* Right / Visual Aside */}
        <div className="lg:w-[40%] flex flex-col bg-gray-100 relative overflow-hidden">
          {/* Abstract Grid / Shapes */}
          <div className="absolute inset-0 pattern-grid opacity-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          
          <div className="flex-1 p-8 flex flex-col justify-end">
            <div className="bg-white p-6 brutal-border brutal-shadow mb-6 rotate-[-2deg]">
              <div className="flex justify-between items-center mb-4 border-b-2 border-gray-200 pb-4">
                <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Aduan Masuk #1042</span>
                <span className="bg-red-100 text-red-700 px-2 py-1 text-[10px] font-bold uppercase">Pending</span>
              </div>
              <h3 className="font-display font-bold text-xl mb-2 uppercase">Jalan Berlubang di Margonda</h3>
              <p className="text-sm font-medium text-gray-600">Pelapor dirahasiakan &bull; 2 jam yang lalu</p>
            </div>

            <div className="bg-[--color-brand] text-white p-6 brutal-border brutal-shadow rotate-[1deg] translate-x-4">
              <div className="flex justify-between items-center mb-4 border-b-2 border-white/20 pb-4">
                <span className="font-bold text-xs uppercase tracking-wider text-white/70">Aduan Masuk #1041</span>
                <span className="bg-white text-[--color-brand] px-2 py-1 text-[10px] font-bold uppercase">Selesai</span>
              </div>
              <h3 className="font-display font-bold text-xl mb-2 uppercase">Lampu Jalan Padam</h3>
              <p className="text-sm font-medium text-white/80">Pelapor dirahasiakan &bull; 1 hari yang lalu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Footer of Hero */}
      <div className="py-4 border-b-2 border-[--color-ink] bg-black text-white w-full overflow-hidden absolute bottom-0 left-0">
        <div className="marquee-container">
          <div className="marquee-content font-display font-black text-2xl uppercase tracking-widest flex gap-12 px-6">
            <span>&bull; LAPORKAN KEJANGGALAN</span>
            <span>&bull; PANTAU STATUS 24/7</span>
            <span>&bull; RAHASIA DIJAMIN</span>
            <span>&bull; BUKAN SEKADAR JANJI</span>
            <span>&bull; LAPORKAN KEJANGGALAN</span>
            <span>&bull; PANTAU STATUS 24/7</span>
            <span>&bull; RAHASIA DIJAMIN</span>
            <span>&bull; BUKAN SEKADAR JANJI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
