import { Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f4f4f0] border-b-2 border-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-[72px]">
          <div className="flex items-center gap-3">
            <div className="bg-[#df3817] p-2 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl uppercase tracking-tighter text-black leading-none">PRLPR.</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-1 pl-12">
            <a href="#beranda" className="px-5 py-2 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">BERANDA</a>
            <a href="#cara-kerja" className="px-5 py-2 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">Mekanisme</a>
            <a href="#statistik" className="px-5 py-2 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">Data Publik</a>
          </nav>

          <div className="flex items-center gap-2">
            <button className="px-6 py-2.5 font-bold text-xs uppercase tracking-widest bg-transparent hover:bg-black hover:text-white transition-colors hidden sm:block border-2 border-transparent hover:border-black">
              Log in
            </button>
            <button className="bg-black text-white px-6 py-2.5 font-bold text-xs uppercase tracking-widest hover:bg-[#df3817] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 border-2 border-black">
              Buat Akun Baru
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
