import { FileText, ClipboardCheck, Wrench, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      no: "01",
      title: "Pencatatan",
      desc: "Tuliskan rincian keluhan atau aspirasi. Lengkapi detail kronologi dan lokasi untuk memudahkan proses.",
      icon: FileText
    },
    {
      no: "02",
      title: "Verifikasi",
      desc: "Tim verifikator memvalidasi kelengkapan berkas selambatnya 3 hari kerja sebelum diteruskan.",
      icon: ClipboardCheck
    },
    {
      no: "03",
      title: "Tindak Lanjut",
      desc: "Instansi terkait memberikan respon dan menyelesaikan pengaduan sesuai wewenangnya.",
      icon: Wrench
    },
    {
      no: "04",
      title: "Status Selesai",
      desc: "Laporan ditutup. Pemohon diberikan akses untuk menilai kinerja tim penyelidik.",
      icon: CheckCircle2
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl" data-aos="fade-right">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight lg:text-5xl">
              Mekanisme Penanganan
            </h2>
            <p className="text-lg text-slate-500 mt-6 font-medium leading-relaxed">
              Kami menerapkan standar resolusi transparan. Setiap tindak lanjut dari instansi tergabung
              tercatat dan dapat dipantau langsung oleh pelapor secara real-time.
            </p>
          </div>
        </div>

        {/* ── Desktop: grid 4 kolom ── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group relative"
                data-aos="fade-up"
                data-aos-delay={idx * 150}
              >
                <div className="mb-6 w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="text-5xl lg:text-6xl font-black text-slate-100 tracking-tighter group-hover:text-blue-100 transition-colors">
                    {step.no}
                  </div>
                  <div className="h-0.5 w-12 bg-blue-500 rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* ── Mobile: vertical timeline ── */}
        <div className="md:hidden flex flex-col">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <div key={idx} className="flex gap-5" data-aos="fade-up" data-aos-delay={idx * 100}>

                {/* Kolom kiri: dot + garis */}
                <div className="flex flex-col items-center flex-shrink-0">
                  {/* Icon circle */}
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  {/* Connector line */}
                  {!isLast && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-200 to-blue-50 mt-3 mb-3 rounded-full min-h-[40px]" />
                  )}
                </div>

                {/* Kolom kanan: konten */}
                <div className={`pb-10 ${isLast ? '' : ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-black text-slate-100 tracking-tighter leading-none">
                      {step.no}
                    </span>
                    <div className="h-0.5 w-8 bg-blue-500 rounded-full" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5 tracking-tight">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}