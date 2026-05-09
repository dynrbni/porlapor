import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled ? 'px-4 py-2 md:px-8 md:py-3' : 'px-0 py-0'
        }`}
      >
        <div className={`mx-auto flex justify-between items-center transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'max-w-6xl rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-100 shadow-md py-1.5 px-5'
            : 'max-w-7xl bg-transparent py-5 px-4 sm:px-6 lg:px-8 border-b border-transparent'
        }`}>

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="src/assets/porlapor_logo.png"
              alt="PorLapor"
              className="h-14 w-auto object-contain transition-all duration-500"
            />
          </div>

          {/* Nav — desktop */}
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

          {/* Actions — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100/50 transition-all"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Buat Akun
            </Link>
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Dropdown — mobile */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="mx-4 mt-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-lg overflow-hidden">
            <nav className="flex flex-col p-3 gap-1">
              {['Beranda', 'Tentang Sistem', 'Statistik', 'Instansi'].map((item, i) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    i === 0
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-2 p-3 pt-0">
              <div className="h-px bg-slate-100 mb-1" />
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="text-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                Buat Akun
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}