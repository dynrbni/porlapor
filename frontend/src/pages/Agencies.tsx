import React, { useEffect, useState } from 'react';
import { getAgencies } from '../services/agencyService';
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
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-aos="fade-up" data-aos-delay="200">
            {filteredAgencies.map((agency) => (
              <div
                key={agency.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {agency.name}
                  </h3>
                  {agency.phone && (
                    <p className="text-sm text-slate-600 mb-1">
                      <span className="font-medium">Telepon:</span> {agency.phone}
                    </p>
                  )}
                  {agency.address && (
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Alamat:</span> {agency.address}
                    </p>
                  )}
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
  );
};

export default Agencies;
