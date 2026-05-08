import { Menu } from 'lucide-react';
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? 'px-4 py-4 md:px-8' : 'px-0 py-0'
      }`}
    >
      <div className={`mx-auto flex justify-between items-center transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'max-w-6xl rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-3 px-6' 
          : 'max-w-7xl bg-transparent py-5 px-4 sm:px-6 lg:px-8 border-b border-transparent'
      }`}>
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="src/assets/porlapor_logo.png" alt="PorLapor" className="h-12 w-auto object-contain" />
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-9">
            {['Beranda', 'Tentang Sistem', 'Statistik', 'Instansi'].map((item, i) => (
              <a 
                key={item}
                href="#" 
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  i === 0 
                    ? 'text-blue-700 bg-blue-50/80' 
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
              Buat Akun
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
