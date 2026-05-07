import { Megaphone } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Megaphone className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">PorLapor</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#beranda" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Beranda</a>
            <a href="#cara-kerja" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Cara Kerja</a>
            <a href="#statistik" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Statistik</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors hidden sm:block">
              Masuk
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow">
              Daftar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
