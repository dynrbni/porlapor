import { Menu, Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 py-4 md:px-8 md:py-6`}
    >
      <div className={`max-w-6xl mx-auto rounded-2xl flex justify-between items-center transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-3 px-6' 
          : 'bg-white/50 backdrop-blur-md border border-white/20 py-4 px-6 md:px-8'
      }`}>
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="bg-gradient-to-tr from-teal-600 to-teal-400 p-2 rounded-xl shadow-sm">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
              PorLapor
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {['Beranda', 'Tentang Sistem', 'Statistik', 'Instansi'].map((item, i) => (
              <a 
                key={item}
                href="#" 
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  i === 0 
                    ? 'text-teal-700 bg-teal-50/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Action */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100/50 transition-all">
              Masuk
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer">
              Daftar Sekarang
            </button>
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
             <Menu className="w-5 h-5" />
          </button>

        </div>
    </header>
  );
}
