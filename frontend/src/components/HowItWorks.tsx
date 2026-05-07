import { Edit3, Settings, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Tulis Laporan',
      description: 'Lengkapi form aduan dengan detail yang jelas beserta foto pendukung kejadian.',
      icon: <Edit3 className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      id: 2,
      title: 'Proses Verifikasi',
      description: 'Admin akan memeriksa kelengkapan laporan sebelum diteruskan ke instansi berwenang.',
      icon: <Settings className="w-8 h-8 text-orange-600" />,
      color: 'bg-orange-50',
    },
    {
      id: 3,
      title: 'Tindak Lanjut & Selesai',
      description: 'Instansi terkait akan menindaklanjuti keluhan Anda sampai masalah teratasi.',
      icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
    }
  ];

  return (
    <section id="cara-kerja" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Bagaimana Cara Kerjanya?</h2>
          <p className="text-lg text-gray-600">
            Sistem pengaduan yang mudah, transparan, dan dapat dipantau oleh setiap warga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line hidden on mobile */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-0.5 bg-gray-200 -z-10"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center">
              <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center mb-6 shadow-sm border border-white relative z-10 rotate-3 transition-transform hover:rotate-6`}>
                <div className="-rotate-3">
                  {step.icon}
                </div>
              </div>
              <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-4">
                <span className="text-6xl font-black text-gray-100">{step.id}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 z-10">{step.title}</h3>
              <p className="text-center text-gray-600 z-10 leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center bg-blue-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 opacity-10">
              <svg width="404" height="404" fill="none" viewBox="0 0 404 404"><defs><pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" fill="currentColor"></rect></pattern></defs><rect width="404" height="404" fill="url(#pattern)"></rect></svg>
           </div>
           <div className="relative z-10">
             <h3 className="text-3xl font-bold mb-4">Ribuan Masalah Sudah Terselesaikan</h3>
             <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Bergabung dengan masyarakat lainnya membangun lingkungan yang lebih baik. Laporkan masalah Anda sekarang.</p>
             <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition shadow-lg">
                Daftar & Mulai Melapor
             </button>
           </div>
        </div>
      </div>
    </section>
  );
}
