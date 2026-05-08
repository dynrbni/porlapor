import { Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
               <span className="text-white font-black text-sm">PR</span>
             </div>
             <span className="font-extrabold text-2xl tracking-tighter text-slate-900">PorLapor</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors">Beranda</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Tentang Sistem</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Statistik</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Instansi</a>
          </nav>

          {/* Action */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2">
              Daftar
            </button>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer">
              Masuk
            </button>
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden p-2 text-slate-600">
             <Menu className="w-6 h-6" />
          </button>

        </div>
      </div>
    </header>
  );
}
