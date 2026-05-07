import { Edit, Search, Activity, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Tulis Laporan',
      description: 'Sampaikan keluhan dengan jelas, sertakan lokasi dan lampiran foto pendukung.',
      icon: <Edit className="w-7 h-7 text-blue-700" />,
    },
    {
      id: 2,
      title: 'Verifikasi Laporan',
      description: 'Laporan diverifikasi oleh admin dan diteruskan ke instansi yang berwenang.',
      icon: <Search className="w-7 h-7 text-amber-600" />,
    },
    {
      id: 3,
      title: 'Tindak Lanjut',
      description: 'Instansi melakukan investigasi dan memberikan solusi atas laporan Anda.',
      icon: <Activity className="w-7 h-7 text-indigo-600" />,
    },
    {
      id: 4,
      title: 'Selesai',
      description: 'Laporan ditutup. Masyarakat dapat memantau proses secara transparan.',
      icon: <CheckCircle className="w-7 h-7 text-green-600" />,
    }
  ];

  return (
    <section id="cara-kerja" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-sm font-bold tracking-widest text-blue-700 uppercase mb-3">SOP Pelayanan</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Prosedur Pengaduan</h3>
          <p className="text-lg text-slate-600">
            Penanganan setiap laporan masyarakat dilakukan dengan mekanisme yang terukur dan dapat dipertanggungjawabkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[36px] left-[12.5%] right-[12.5%] h-0.5 bg-slate-200"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center">
              <div className="hidden md:block absolute top-[36px] -translate-y-1/2 left-[calc(50%+2.5rem)] right-[-50%] h-0.5 bg-slate-200 z-0"></div>
              
              <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm relative z-10">
                {step.icon}
                <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border border-white">
                  {step.id}
                </div>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
              <p className="text-center text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Trust Banner */}
        <div className="mt-24 bg-blue-900 rounded-[2rem] p-8 sm:p-12 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <ShieldIcon className="w-64 h-64 text-white" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
             <div>
               <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Kerahasiaan Identitas Dijamin</h3>
               <p className="text-blue-200 text-lg max-w-xl leading-relaxed">Kami menerapkan standar keamanan data terkini untuk melindungi privasi Pelapor sesuai dengan ketentuan perundang-undangan.</p>
             </div>
             <button className="bg-white text-blue-900 hover:bg-slate-50 px-8 py-3.5 rounded-lg font-bold transition shadow-sm shrink-0">
                Baca Kebijakan Privasi
             </button>
           </div>
        </div>
      </div>
    </section>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M11.43 1.051a1.5 1.5 0 0 1 1.14 0l6.93 2.97a1.5 1.5 0 0 1 .9 1.38V9c0 5.4-3.3 10.4-8.08 12.8a1.5 1.5 0 0 1-1.44 0C6.1 19.4 2.8 14.4 2.8 9V5.4a1.5 1.5 0 0 1 .9-1.38l6.93-2.97ZM12 19.8c3.8-2 6.5-6.2 6.5-10.8V6.23l-6.5-2.79-6.5 2.79V9c0 4.6 2.7 8.8 6.5 10.8Z" clipRule="evenodd" />
    </svg>
  )
}
