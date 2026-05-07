export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'TULISKAN LAPORAN',
      desc: 'Sertakan foto, kronologi, dan lokasi secara detail. Identitas Anda bisa disembunyikan.',
      bg: 'bg-white'
    },
    {
      step: '02',
      title: 'VERIFIKASI ADMIN',
      desc: 'Laporan dicek kebenarannya. Tidak ada ruang untuk spam atau berita palsu.',
      bg: 'bg-[#dbfe87]' // neon chartreuse
    },
    {
      step: '03',
      title: 'EKSEKUSI SEGERA',
      desc: 'Instansi terkait langsung meluncur ke lapangan dan membawa solusi nyata.',
      bg: 'bg-[--color-brand]'
    }
  ];

  return (
    <section id="cara-kerja" className="py-24 px-4 sm:px-8 bg-[--color-paper]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <h2 className="font-display font-black text-5xl sm:text-7xl uppercase leading-none max-w-2xl text-balance">
          Mekanisme <br/>
          <span className="text-[--color-brand] border-b-8 border-[--color-ink]">Anti Lambat.</span>
        </h2>
        <p className="max-w-md text-xl font-medium border-l-4 border-[--color-ink] pl-4">
          Kami memotong rantai birokrasi. 3 langkah mudah untuk menyelesaikan masalah di sekitar Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 brutal-border border-b-0 md:border-b-2">
        {steps.map((s, idx) => (
          <div key={idx} className={`relative p-8 sm:p-12 border-b-2 md:border-b-0 md:border-r-2 last:border-r-0 border-[--color-ink] ${s.bg} flex flex-col group transition-colors hover:bg-gray-100 ${s.bg === 'bg-[--color-brand]' ? 'hover:bg-red-700 text-white' : ''}`}>
            <span className={`font-display font-black text-6xl mb-12 opacity-80 ${s.bg === 'bg-[--color-brand]' ? 'text-white' : 'text-gray-300 group-hover:text-gray-400'}`}>
              {s.step}
            </span>
            <div className="mt-auto">
              <h3 className="font-display font-extrabold text-3xl uppercase mb-4 leading-tight">
                {s.title}
              </h3>
              <p className={`text-lg font-medium ${s.bg === 'bg-[--color-brand]' ? 'text-white' : 'text-gray-800'}`}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
