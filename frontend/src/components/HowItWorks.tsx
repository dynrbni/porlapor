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
    <section className="py-24 bg-slate-950 border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 flex flex-col items-center justify-center text-center gap-8">
          <div className="max-w-3xl mx-auto" data-aos="fade-up">
            <h2 className="text-4xl font-extrabold text-white tracking-tight lg:text-5xl">Mekanisme Penanganan</h2>
            <p className="text-lg text-slate-400 mt-6 font-medium leading-relaxed">
              Kami menerapkan standar resolusi transparan. Setiap tindak lanjut dari instansi tergabung tercatat dan dapat dipantau langsung oleh pelapor secara real-time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="group relative text-left" 
                data-aos="fade-up" 
                data-aos-delay={idx * 150}
              >
                <div className="mb-6 w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-4 mb-5 relative">
                   <div className="text-5xl lg:text-6xl font-black text-slate-800 tracking-tighter group-hover:text-slate-700 transition-colors">
                     {step.no}
                   </div>
                   <div className="h-0.5 w-12 bg-blue-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
