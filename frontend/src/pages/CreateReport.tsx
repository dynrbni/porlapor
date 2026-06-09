import Header from '../components/Header';
import CreateReportForm from '../components/CreateReportForm';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, MapPin, ShieldCheck } from 'lucide-react';

export default function CreateReport() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: FileText,
      title: 'Tulis seperlunya',
      desc: 'Jelaskan kejadian dengan singkat, jelas, dan pakai fakta yang penting saja.',
    },
    {
      icon: MapPin,
      title: 'Tandai lokasi',
      desc: 'Pilih titik yang paling dekat dengan lokasi masalah supaya instansi lebih cepat paham.',
    },
    {
      icon: ShieldCheck,
      title: 'Lampirkan bukti',
      desc: 'Kalau ada foto, unggah secukupnya supaya laporan terlihat lebih kuat.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">
      <Header />
      
      <main className="relative px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <button 
            onClick={() => navigate('/dashboard')}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
          </button>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_360px] lg:items-start">
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Buat Laporan</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Isi laporan dengan rapi, singkat, dan jelas.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Semakin jelas judul, lokasi, dan deskripsinya, semakin gampang laporan kamu diproses. Nggak perlu bertele-tele.
                </p>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <CreateReportForm onSuccess={() => navigate('/dashboard')} />
              </div>
            </section>

            <aside className="space-y-6 lg:sticky lg:top-6">
              <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Panduan Singkat</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">Biar laporan enak dibaca</h2>
                </div>

                <div className="space-y-4 px-6 py-6">
                  {steps.map((step) => {
                    const Icon = step.icon;

                    return (
                      <div key={step.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                          <Icon className="h-5 w-5 text-slate-700" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900 text-white shadow-sm">
                <div className="px-6 py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Catatan</p>
                  <h2 className="mt-1 text-lg font-semibold">Kalau bisa, pakai detail yang bisa diverifikasi.</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Tulis lokasi, waktu kejadian, dan dampak yang terlihat. Kalau ada lampiran foto, itu bantu banget.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
