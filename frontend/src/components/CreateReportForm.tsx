import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { categoryService } from '../services/categoryService';
import type { Category } from '../services/categoryService';
import { getAgencies } from '../services/agencyService';
import type { Agency } from '../services/agencyService';
import LocationPicker from './LocationPicker';
import { Loader2 } from 'lucide-react';

export default function CreateReportForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [agencyId, setAgencyId] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
    getAgencies().then(setAgencies).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !categoryId || latitude === null || longitude === null) {
      setError('Mohon lengkapi semua field yang diwajibkan, termasuk memilih lokasi peta.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await reportService.createReport({
        title,
        description,
        categoryId,
        agencyId: agencyId || undefined,
        latitude,
        longitude,
        address
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat laporan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Buat Laporan Baru</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Laporan *</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            placeholder="Contoh: Jalan berlubang di M.H Thamrin"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi Lengkap *</label>
          <textarea
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-y"
            placeholder="Jelaskan kronologi atau detail masalah secara lengkap..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori *</label>
            <select
              required
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            >
              <option value="">Pilih Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Instansi Tujuan (Opsional)</label>
            <select
              value={agencyId}
              onChange={e => setAgencyId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            >
              <option value="">Pilih Instansi</option>
              {agencies.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Lokasi Kejadian *</label>
          <p className="text-xs text-slate-500 mb-3">Klik atau geser marker pada peta untuk menentukan lokasi dengan akurat.</p>
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <LocationPicker onLocationChange={(lat, lng, addr) => {
              setLatitude(lat);
              setLongitude(lng);
              setAddress(addr);
            }} />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 text-white animate-spin" />}
            Kirim Laporan
          </button>
        </div>
      </form>
    </div>
  );
}
