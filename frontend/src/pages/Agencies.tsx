import React, { useEffect, useState } from 'react';
import { getAgencies } from '../services/agencyService';
import Header from '../components/Header';
import type { Agency } from '../services/agencyService';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Agencies: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.refresh();
    const fetchAgencies = async () => {
      try {
        const data = await getAgencies();
        setAgencies(data);
      } catch (error) {
        console.error('Failed to fetch agencies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, []);

  const filteredAgencies = agencies.filter((agency) =>
    agency.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (agency.address && agency.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-28 pb-12 flex items-start justify-center">
        <div className="max-w-6xl w-full px-6 lg:px-8">
        <div className="text-center mb-10" data-aos="fade-up">
          <h1 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
            Daftar Instansi Terdaftar
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
            Temukan instansi pemerintah terkait untuk pelaporan Anda.
          </p>
        </div>

        <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
          <input
            type="text"
            placeholder="Cari nama instansi atau alamat..."
            className="w-full max-w-lg mx-auto block px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-10" data-aos="fade-up">
            <p>Memuat data instansi...</p>
          </div>
        ) : filteredAgencies.length > 0 ? (
          <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
            {filteredAgencies.map((agency) => (
              <div
                key={agency.id}
                className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-40 h-40 bg-gray-100 flex-shrink-0">
                  {agency.photoUrl ? (
                    <img src={agency.photoUrl} alt={agency.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No image</div>
                  )}
                </div>
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {agency.name}
                  </h3>
                  <div className="text-sm text-slate-600">
                    {agency.phone && (
                      <p className="mb-1">
                        <span className="font-medium">Telepon:</span> {agency.phone}
                      </p>
                    )}
                    {agency.address && (
                      <p>
                        <span className="font-medium">Alamat:</span> {agency.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-10" data-aos="fade-up">
            <p>Tidak ada instansi yang cocok dengan pencarian Anda.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Agencies;
