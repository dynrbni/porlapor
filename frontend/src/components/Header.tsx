import { Hexagon, LogIn, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 p-2 rounded-lg text-white">
             <Hexagon className="w-6 h-6" />
          </div>
          <div>
             <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none block">PorLapor</span>
             <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Aduan Masyarakat</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          <a href="#beranda" className="hover:text-teal-600 transition-colors">Beranda</a>
          <a href="#prosedur" className="hover:text-teal-600 transition-colors">Prosedur</a>
          <a href="#data" className="hover:text-teal-600 transition-colors">Data Terpadu</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors">
            <LogIn className="w-4 h-4" /> Masuk
          </button>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all shadow-sm">
            Daftar Akun
          </button>
          <button className="md:hidden text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>
    </header>
  );
}
