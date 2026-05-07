import { Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-slate-900 leading-tight">PorLapor</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold leading-tight">Layanan Pengaduan Publik</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#beranda" className="text-slate-600 hover:text-blue-700 font-medium transition-colors">Beranda</a>
            <a href="#cara-kerja" className="text-slate-600 hover:text-blue-700 font-medium transition-colors">Cara Kerja</a>
            <a href="#statistik" className="text-slate-600 hover:text-blue-700 font-medium transition-colors">Statistik</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-slate-600 hover:text-blue-700 font-medium transition-colors hidden sm:block">
              Masuk
            </button>
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm">
              Daftar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
