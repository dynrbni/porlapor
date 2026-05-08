export default function HowItWorks() {
  const steps = [
    {
      no: "01",
      title: "Pencatatan",
      desc: "Tuliskan rincian keluhan atau aspirasi. Lengkapi detail kronologi dan lokasi untuk memudahkan proses."
    },
    {
      no: "02",
      title: "Verifikasi",
      desc: "Tim verifikator memvalidasi kelengkapan berkas selambatnya 3 hari kerja sebelum diteruskan."
    },
    {
      no: "03",
      title: "Tindak Lanjut",
      desc: "Instansi terkait memberikan respon dan menyelesaikan pengaduan sesuai wewenangnya."
    },
    {
      no: "04",
      title: "Status Selesai",
      desc: "Laporan ditutup. Pemohon diberikan akses untuk menilai kinerja tim penyelidik."
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight lg:text-5xl">Mekanisme Penanganan</h2>
            <p className="text-lg text-slate-500 mt-6 font-medium leading-relaxed">
              Kami menerapkan standar resolusi transparan. Setiap tindak lanjut dari instansi tergabung tercatat dan dapat dipantau langsung oleh pelapor secara real-time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {steps.map((step, idx) => (
            <div key={idx} className="group relative">
              <div className="flex items-center gap-4 mb-6 relative">
                 <div className="text-5xl lg:text-6xl font-black text-slate-100 tracking-tighter group-hover:text-teal-50 transition-colors">
                   {step.no}
                 </div>
                 <div className="h-0.5 w-12 bg-teal-500 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
