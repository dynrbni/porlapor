import { Menu, X, LogOut, ChevronDown, LayoutDashboard, Shield, User } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService, getPhotoUrl } from '../services/authService';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

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
    window.location.reload(); 
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

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
              src="/src/assets/porlapor_logo.png"
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
              <>
              <NotificationBell />
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                >
                  {user?.photoUrl ? (
                    <img
                      src={getPhotoUrl(user.photoUrl) || ''}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-sm ${user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' || user?.role === 'AGENCY' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                      {userInitials}
                    </div>
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Desktop */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-200 origin-top-right ${
                    profileDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className={`px-4 py-3 border-b border-slate-100 ${user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' || user?.role === 'AGENCY' ? 'bg-indigo-50/50' : 'bg-slate-50/50'}`}>
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.nama || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                    {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' || user?.role === 'AGENCY') && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded">ADMIN</span>
                    )}
                  </div>
                  <div className="p-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard Saya</span>
                    </Link>
                    {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' || user?.role === 'AGENCY') && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
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
              </>
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
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm md:hidden pt-20">
          <nav className="flex flex-col p-4 gap-2">
            {[
              { name: 'Beranda', path: '/' },
              { name: 'Statistik', path: '/statistik' },
              { name: 'Instansi', path: '/instansi' },
            ].map((item) => (
               <Link
                 key={item.name}
                 to={item.path}
                 onClick={() => setMobileOpen(false)}
                 className="px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
               >
                 {item.name}
               </Link>
            ))}
            
            <div className="h-px bg-slate-200 my-2" />
            
            {isAuthenticated ? (
               <>
                 <Link
                   to="/dashboard"
                   onClick={() => setMobileOpen(false)}
                   className="px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl flex items-center gap-2"
                 >
                   <LayoutDashboard className="w-5 h-5" /> Dashboard Saya
                 </Link>
                 {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' || user?.role === 'AGENCY') && (
                   <Link
                     to="/admin"
                     onClick={() => setMobileOpen(false)}
                     className="px-4 py-3 text-base font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl flex items-center gap-2"
                   >
                     <Shield className="w-5 h-5" /> Admin Panel
                   </Link>
                 )}
                 <button
                   onClick={() => {
                     setMobileOpen(false);
                     handleLogout();
                   }}
                   className="px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 rounded-xl text-left flex items-center gap-2"
                 >
                   <LogOut className="w-5 h-5" /> Keluar
                 </button>
               </>
            ) : (
               <div className="flex flex-col gap-2 mt-4">
                 <Link
                   to="/login"
                   onClick={() => setMobileOpen(false)}
                   className="w-full py-3 px-4 text-center text-slate-700 font-semibold border border-slate-200 rounded-xl"
                 >
                   Masuk
                 </Link>
                 <Link
                   to="/register"
                   onClick={() => setMobileOpen(false)}
                   className="w-full py-3 px-4 text-center text-white bg-blue-600 font-semibold rounded-xl"
                 >
                   Buat Akun Baru
                 </Link>
               </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
