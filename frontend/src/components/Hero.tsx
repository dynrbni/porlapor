import { useState } from 'react';
import LocationPicker from './LocationPicker';
import { Send, Image as ImageIcon, MapPin } from 'lucide-react';

export default function Hero() {
  const [type, setType] = useState('pengaduan');

  return (
    <section className="relative overflow-hidden bg-slate-50 pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNjYmQ1ZTEiLz48L3N2Zz4=')] opacity-50"></div>
      
      {/* Modern Gradient Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/60 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Column */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Layanan Publik Terpadu
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Ruang <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Aspirasi</span> & <br/>
              Pengaduan Rakyat
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Sistem integrasi pelaporan masalah fasilitas kota, administrasi, dan layanan masyarakat. Diproses langsung oleh instansi terkait secara transparan dan akuntabel.
            </p>

            <div className="flex items-center gap-8 py-6 border-y border-slate-200">
              <div>
                <p className="text-3xl font-bold text-slate-900">48 Jam</p>
                <p className="text-sm font-medium text-slate-500">Batas Respon Resmi</p>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div>
                <p className="text-3xl font-bold text-slate-900">100%</p>
                <p className="text-sm font-medium text-slate-500">Transparansi Data</p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="relative">
            {/* The floating card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 overflow-hidden">
              <div className="p-6 md:p-8">
                
                {/* Custom Segmented Control for Type */}
                <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                  {['pengaduan', 'aspirasi', 'info'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                        type === t 
                          ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200/50' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {t === 'info' ? 'Informasi' : t}
                    </button>
                  ))}
                </div>

                <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Apa permasalahan yang Anda temui?" 
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                    
                    <textarea 
                      rows={3} 
                      placeholder="Jelaskan detail kronologi, lokasi spesifik, dan pihak yang terlibat..." 
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none placeholder:text-slate-400"
                    ></textarea>

                    <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-600 appearance-none">
                      <option value="">Pilih Instansi / Kategori Tujuan</option>
                      <option value="pu">Pekerjaan Umum & Tata Ruang</option>
                      <option value="dukcapil">Kependudukan & Pencatatan Sipil</option>
                      <option value="dishub">Dinas Perhubungan</option>
                    </select>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Map Picker Context */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <div className="px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" /> Titik Lokasi
                        </div>
                        <LocationPicker onLocationChange={() => {}} />
                      </div>

                      {/* File Upload */}
                      <div className="border border-slate-200 border-dashed rounded-xl bg-slate-50 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-slate-100 transition-colors group">
                        <div className="bg-white p-2 rounded-full shadow-sm ring-1 ring-slate-200 mb-2 group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-5 h-5 text-teal-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">Lampirkan Bukti</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Foto / PDF Maks 5MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-600/20">
                      <Send className="w-4 h-4" />
                      Kirim Laporan
                    </button>
                    <p className="text-center text-xs font-medium text-slate-400 mt-4">
                      Dengan mengirimkan laporan, Anda menyetujui <a href="#" className="text-teal-600 hover:underline">Syarat & Ketentuan</a> berlaku.
                    </p>
                  </div>
                </form>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
