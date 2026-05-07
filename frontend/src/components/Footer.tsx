export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-2xl text-white tracking-tight">PorLapor</span>
            <p className="text-gray-400 mt-2 text-sm">Layanan Aspirasi dan Pengaduan Online Rakyat.</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition">Bantuan</a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} PorLapor. All rights reserved. Hubungi 1500-111 (Bebas Pulsa).
        </div>
      </div>
    </footer>
  );
}
