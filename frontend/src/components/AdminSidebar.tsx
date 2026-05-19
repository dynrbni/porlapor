import type { MouseEvent } from 'react';
import { Building2, FileText, LayoutGrid, LogOut, Plus, X } from 'lucide-react';
import type { AuthUser } from '../services/authService';

export type AdminSection = 'overview' | 'reports' | 'agencies';

interface AdminSidebarProps {
  user: AuthUser | null;
  activeSection: AdminSection;
  onNavigate: (section: AdminSection) => void;
  onLogout: () => void;
  onAddAgency?: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems = [
  { id: 'overview' as const, label: 'Ringkasan', icon: LayoutGrid },
  { id: 'reports' as const, label: 'Laporan', icon: FileText },
  { id: 'agencies' as const, label: 'Instansi', icon: Building2 },
];

export default function AdminSidebar({
  user,
  activeSection,
  onNavigate,
  onLogout,
  onAddAgency,
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
          <img
            src="/src/assets/porlapor_logo.png"
            alt="PorLapor"
            className="h-15 w-auto object-contain brightness-0 invert ml-6"
          />
        </div>
        {compact && (
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-3">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.label}
                type="button"
                onClick={handleNavClick(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-indigo-600/20 text-white border border-indigo-500/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {onAddAgency && (
          <button
            onClick={() => {
              onAddAgency();
              onCloseMobile();
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/50 bg-indigo-600/20 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-600/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Instansi
          </button>
        )}
      </div>

      <div className="mt-auto border-t border-slate-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            {userInitial}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{userDisplayName}</p>
            <p className="text-xs text-slate-400">{userRole}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-72 lg:flex-col bg-slate-950 text-slate-200 border-r border-slate-800 min-h-screen">
        {renderSidebarContent()}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/70" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-slate-950 text-slate-200 border-r border-slate-800 shadow-xl">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
