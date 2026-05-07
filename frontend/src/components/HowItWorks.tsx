export default function HowItWorks() {
  const steps = [
    {
      id: '01',
      title: 'Submit Laporan',
      description: 'Lengkapi formulir dengan koordinat akurat dan foto bukti lapangan.',
    },
    {
      id: '02',
      title: 'Validasi Sistem',
      description: 'Admin memverifikasi laporan untuk mencegah duplikasi dan spam.',
    },
    {
      id: '03',
      title: 'Tinjauan Instansi',
      description: 'Disposisi otomatis ke dinas atau instansi yang bersangkutan.',
    },
    {
      id: '04',
      title: 'Resolusi Selesai',
      description: 'Tindakan lapangan dieksekusi. Pelapor menerima notifikasi hasil.',
    }
  ];

  return (
    <section id="cara-kerja" className="bg-[#f4f4f0] border-b-2 border-black">
      <div className="grid md:grid-cols-2">
        {/* Left Heavy Typography */}
        <div className="p-12 lg:p-24 border-b-2 md:border-b-0 md:border-r-2 border-black bg-white flex flex-col justify-center">
          <div className="w-12 h-2 bg-[#df3817] mb-8"></div>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-6">
            SOP <br/>Penanganan.
          </h2>
          <p className="text-lg font-medium leading-relaxed max-w-md border-l-4 border-black pl-6">
            Setiap aduan yang masuk dijamin transparansinya melalui sistem pelacakan terbuka. Tidak ada laporan yang diabaikan.
          </p>
        </div>

        {/* Right Grid Steps */}
        <div className="grid grid-rows-4">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`p-8 flex items-start gap-8 bg-[#f4f4f0] hover:bg-[#df3817] hover:text-white transition-colors group cursor-default ${index !== steps.length - 1 ? 'border-b-2 border-black' : ''}`}
            >
              <span className="text-5xl lg:text-7xl font-black tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">
                {step.id}
              </span>
              <div>
                <h4 className="text-xl font-bold uppercase tracking-wide mb-2">{step.title}</h4>
                <p className="font-medium opacity-80 leading-snug">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
