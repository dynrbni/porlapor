import { Camera, ArrowRight, ShieldCheck } from 'lucide-react';
import LocationPicker from './LocationPicker';

export default function Hero() {
  return (
    <section id="beranda" className="pt-24 pb-20 lg:pt-32 lg:pb-32 px-4 sm:px-8 border-b-2 border-black">
      <div className="max-w-[1400px] mx-auto relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Typographic Left Content */}
        <div className="lg:col-span-6 flex flex-col justify-center h-full">
          <div className="inline-flex items-center justify-self-start gap-2 px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-8">
            <ShieldCheck className="w-4 h-4" />
            Layanan Resmi
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-bold text-black leading-[1.05] mb-8 uppercase">
            Laporkan.<br />
            Kawal.<br />
            Tuntaskan.
          </h1>
          
          <p className="text-xl text-zinc-700 mb-10 leading-relaxed font-medium bg-white p-6 border-sharp shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Akses langsung ke instansi terkait untuk setiap masalah fasilitas, infrastruktur, atau layanan yang Anda temui. Transparansi data terjamin.
          </p>

          <div className="grid grid-cols-2 gap-4 border-t-2 border-black pt-8">
            <div>
              <div className="text-4xl font-black mb-1 text-[#df3817]">24/7</div>
              <div className="text-sm font-bold uppercase tracking-wider text-black">Akses Pelaporan</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-1 text-[#df3817]">100%</div>
              <div className="text-sm font-bold uppercase tracking-wider text-black">Data Diverifikasi</div>
            </div>
          </div>
        </div>

        {/* Brutal/Editorial Form */}
        <div className="lg:col-span-6 lg:mt-8">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col">
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg uppercase tracking-wider">Formulir Pengaduan</h3>
              <span className="text-xs bg-[#df3817] px-2 py-1 font-bold">LIVE</span>
            </div>
            
            <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Judul Laporan</label>
                <input 
                  type="text" 
                  placeholder="Misal: Jalan Berlubang di Sudirman" 
                  className="w-full border-sharp bg-[#f4f4f0] px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-0 rounded-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Kategori Laporan</label>
                <select className="w-full border-sharp bg-[#f4f4f0] px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-0 rounded-none appearance-none">
                  <option value="">-- Pilih Instansi/Kategori --</option>
                  <option value="infrastruktur">Infrastruktur & Pekerjaan Umum</option>
                  <option value="pelayanan">Pelayanan Administrasi</option>
                  <option value="keamanan">Ketertiban Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Titik Lokasi (Koordinat & Alamat)</label>
                {/* Embedded Map Picker */}
                <LocationPicker onLocationChange={() => {}} />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Deskripsi Detail</label>
                <textarea 
                  rows={4}
                  placeholder="Uraikan kronologi atau detail masalah secara lengkap..." 
                  className="w-full border-sharp bg-[#f4f4f0] px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-0 rounded-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Bukti Foto</label>
                <div className="w-full border-sharp border-dashed bg-[#f4f4f0] hover:bg-white cursor-pointer transition-colors p-6 flex flex-col items-center justify-center group">
                  <Camera className="w-8 h-8 mb-2 group-hover:text-[#df3817]" />
                  <span className="text-sm font-bold underline decoration-2 underline-offset-4">Unggah Gambar (Wajib)</span>
                  <span className="text-xs mt-1 text-zinc-500">Maks. 5MB, format JPG/PNG/WEBP</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-black mt-6">
                <button 
                  type="button"
                  className="w-full flex items-center justify-between bg-[#df3817] hover:bg-black text-white px-6 py-4 font-black uppercase tracking-widest text-sm transition-colors group"
                >
                  <span>Verifikasi & Kirim</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
                <p className="text-center text-xs font-bold text-zinc-500 mt-4 uppercase">
                  Diperlukan Autentikasi NIK / Akun
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
