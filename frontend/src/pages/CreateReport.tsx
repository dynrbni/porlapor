import Header from '../components/Header';
import CreateReportForm from '../components/CreateReportForm';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CreateReport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200">
      <Header />
      
      <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6 w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </button>

        <CreateReportForm onSuccess={() => navigate('/dashboard')} />
      </main>
    </div>
  );
}
