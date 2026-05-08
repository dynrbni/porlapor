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
      data-aos="fade-down"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-1' 
          : 'bg-white/0 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20 transition-all duration-500">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              PorLapor
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['Beranda', 'Tentang Sistem', 'Statistik', 'Instansi'].map((item, i) => (
              <a 
                key={item}
                href="#" 
                className={`text-sm font-medium transition-colors ${
                  i === 0 
                    ? 'text-teal-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Action */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Daftar
            </button>
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Masuk
            </button>
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
             <Menu className="w-5 h-5" />
          </button>

        </div>
      </div>
    </header>
  );
}
