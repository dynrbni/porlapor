import type { MouseEvent } from 'react';
import { Building2, FileText, LayoutGrid, LogOut, X, Users, Tag, MapPin } from 'lucide-react';
import type { AuthUser } from '../services/authService';
import porlaporLogo from '../assets/porlapor_logo.png';

export type AdminSection = 'overview' | 'reports' | 'agencies' | 'users' | 'categories' | 'superadmin' | 'explore';

interface AdminSidebarProps {
  user: AuthUser | null;
  activeSection: AdminSection;
  onNavigate: (section: AdminSection) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems = [
  { id: 'overview' as const, label: 'Ringkasan', icon: LayoutGrid },
  { id: 'explore' as const, label: 'Jelajahi', icon: MapPin },
  { id: 'reports' as const, label: 'Laporan', icon: FileText },
  { id: 'agencies' as const, label: 'Instansi', icon: Building2 },
  { id: 'users' as const, label: 'Pengguna', icon: Users },
  { id: 'categories' as const, label: 'Kategori', icon: Tag },
];

export default function AdminSidebar({
  user,
  activeSection,
  onNavigate,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const userDisplayName = user?.nama || user?.name || 'Admin';
  const userRole = user?.role || 'ADMIN';
  const userInitial = userDisplayName.trim().charAt(0).toUpperCase() || 'A';

  const handleNavClick = (section: AdminSection) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onNavigate(section);
    onCloseMobile();
  };

  const renderSidebarContent = (compact = false) => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <img src={porlaporLogo} alt="PorLapor" className="h-12 w-auto" />
        </div>
        {compact && (
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-3">
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Navigasi
        </p>
        <nav className="space-y-2">
          {navItems.map((item) => {
            if (userRole === 'AGENCY' && (item.id === 'agencies' || item.id === 'users' || item.id === 'categories')) return null;
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.label}
                type="button"
                onClick={handleNavClick(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}

        </nav>
      </div>

      <div className="mt-auto border-t border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {userInitial}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">{userDisplayName}</p>
            <p className="text-xs text-slate-500">{userRole}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-72 lg:flex-col bg-white/90 text-slate-700 border-r border-slate-200 min-h-screen backdrop-blur">
        {renderSidebarContent()}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/30" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white text-slate-700 border-r border-slate-200 shadow-2xl">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
