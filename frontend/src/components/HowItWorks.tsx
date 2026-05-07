import { Edit3, CheckCircle2, Factory, ActivitySquare } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Tulis & Verifikasi',
      description: 'Laporan Anda divalidasi oleh sistem dan admin untuk memastikan keabsahan data.',
      icon: <Edit3 className="w-6 h-6 text-teal-600" />
    },
    {
      id: 2,
      title: 'Distribusi Instansi',
      description: 'Diteruskan otomatis melalui integrasi API ke instansi atau kementerian terkait.',
      icon: <Factory className="w-6 h-6 text-blue-600" />
    },
    {
      id: 3,
      title: 'Tindak Lanjut',
      description: 'Instansi melakukan investigasi lapangan dan memberikan status pembaharuan.',
      icon: <ActivitySquare className="w-6 h-6 text-amber-600" />
    },
    {
      id: 4,
      title: 'Resolusi Selesai',
      description: 'Warga menerima laporan hasil akhir dan dapat memberikan rating kepuasan.',
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />
    }
  ];

  return (
    <section id="prosedur" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-teal-600 font-bold tracking-widest text-sm uppercase mb-3">Mekanisme Kerja</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 tracking-tight">SOP Penanganan Terpadu</h3>
          <p className="text-lg text-slate-600 font-medium">
            Proses penyelesaian aduan dirancang untuk meminimalisir birokrasi dan mendahulukan eksekusi lapangan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-slate-200"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg ring-1 ring-slate-100 flex items-center justify-center mb-6 relative z-10 transition-transform hover:-translate-y-1 hover:shadow-xl">
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold border-4 border-white">
                  {step.id}
                </div>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
