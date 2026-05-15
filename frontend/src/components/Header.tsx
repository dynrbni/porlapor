import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  // Inisial untuk avatar sementara, menggunakan field `nama` bukan `name` karena ini dari backend
  const userInitials = user?.nama
    ? user.nama
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload(); // Refresh state agar ter-update
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  // Click outside listener untuk profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="flex-[1_1_0%] flex items-center gap-3 cursor-pointer">
            <img
              src="src/assets/porlapor_logo.png"
              alt="PorLapor"
              className="h-14 w-auto object-contain transition-all duration-500"
            />
          </div>

          {/* Nav — desktop */}
          <nav className="hidden md:flex flex-[1_1_0%] justify-center items-center gap-1">
            {[
              { name: 'Beranda', path: '/' },
              { name: 'Statistik', path: '/statistik' },
              { name: 'Instansi', path: '/instansi' }
            ].map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions — desktop */}
          <div className="hidden md:flex flex-[1_1_0%] justify-end items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {userInitials}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Desktop */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-200 origin-top-right ${
                    profileDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.nama || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <span>Profil Saya</span>
                    </Link>
                    <div className="h-px bg-slate-100 my-1 mx-2" />
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
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
              {[
                { name: 'Beranda', path: '/' },
                { name: 'Statistik', path: '/statistik' },
                { name: 'Instansi', path: '/instansi' }
              ].map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2 p-3 pt-0">
              <div className="h-px bg-slate-100 mb-1" />
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 mb-1">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {userInitials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800">{user?.nama || 'User'}</span>
                      <span className="text-xs text-slate-500">{user?.email || ''}</span>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="text-left px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
                  >
                    Profil Saya
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}