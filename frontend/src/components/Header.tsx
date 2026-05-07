export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[--color-paper] brutal-border border-l-0 border-r-0 border-t-0 h-16 sm:h-20 flex items-center">
      <div className="w-full flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-2xl sm:text-3xl tracking-tight uppercase">PorLapor<span className="text-[--color-brand]">.</span></span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#beranda" className="font-display font-bold uppercase text-sm tracking-widest hover:text-[--color-brand] transition-colors">Beranda</a>
          <a href="#cara-kerja" className="font-display font-bold uppercase text-sm tracking-widest hover:text-[--color-brand] transition-colors">Cara Kerja</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="font-display font-bold uppercase text-sm tracking-widest hover:text-[--color-brand] transition-colors hidden sm:block">
            Masuk
          </button>
          <button className="bg-[--color-brand] text-[--color-paper] font-display font-bold uppercase px-6 py-2 tracking-widest brutal-border brutal-shadow text-sm">
            Daftar
          </button>
        </div>
      </div>
    </header>
  );
}
