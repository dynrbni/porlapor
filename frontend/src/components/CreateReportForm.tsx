import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { categoryService } from '../services/categoryService';
import type { Category } from '../services/categoryService';
import { getAgencies } from '../services/agencyService';
import type { Agency } from '../services/agencyService';
import LocationPicker from './LocationPicker';
import { useToast } from './Toast';
import { FileText, Loader2, Paperclip, Building2, PencilLine } from 'lucide-react';

export default function CreateReportForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [agencyId, setAgencyId] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

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
        address,
        ...(imageUrl && { imageUrl })
      });
      showToast('Laporan berhasil dibuat.');
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat laporan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="h-4 w-4 text-slate-500" />
              Judul Laporan *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
              placeholder="Contoh: Jalan berlubang di depan halte M.H. Thamrin"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <PencilLine className="h-4 w-4 text-slate-500" />
              Deskripsi Lengkap *
            </label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white resize-y"
              placeholder="Ceritakan kejadian dengan singkat tapi cukup detail untuk diproses."
            />
          </div>

          <input
            type="hidden"
            aria-hidden="true"
            tabIndex={-1}
            value=""
            readOnly
          />

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              Kategori *
            </label>
            <select
              required
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-slate-400 focus:bg-white"
            >
              <option value="">Pilih Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 className="h-4 w-4 text-slate-500" />
              Instansi Tujuan <span className="font-medium text-slate-400">(opsional)</span>
            </label>
            <select
              value={agencyId}
              onChange={e => setAgencyId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-slate-400 focus:bg-white"
            >
              <option value="">Pilih Instansi</option>
              {agencies.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Lokasi Kejadian *</label>
            <p className="text-xs text-slate-500">Klik peta untuk pin lokasi. Alamat akan terisi otomatis setelah titik dipilih.</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <LocationPicker onLocationChange={(lat, lng, addr) => {
              setLatitude(lat);
              setLongitude(lng);
              setAddress(addr);
            }} />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Paperclip className="h-4 w-4 text-slate-500" />
            Foto / Bukti Kejadian <span className="font-medium text-slate-400">(opsional)</span>
          </label>
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
            <input 
              type="file" 
              accept="image/*" 
              className="text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 file:shadow-sm hover:file:bg-slate-100"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImageUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="h-16 w-16 rounded-2xl border border-slate-200 object-cover shadow-sm" />
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 text-white animate-spin" />}
            Kirim Laporan
          </button>
        </div>
      </form>
    </div>
  );
}
