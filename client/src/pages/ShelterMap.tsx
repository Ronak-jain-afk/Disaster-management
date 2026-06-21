import { useState, useEffect } from 'react';
import { shelterApi } from '../services/api';
import { Shelter } from '../types';

const ShelterMap = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await shelterApi.getAll();
        setShelters(res.data.data);
      } catch (err) {
        console.error('Failed to fetch shelters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelters();
  }, []);

  const filtered = filter ? shelters.filter((s) => s.type === filter) : shelters;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'from-red-500 to-rose-500';
      case 'shelter': return 'from-blue-500 to-cyan-500';
      case 'distribution_center': return 'from-emerald-500 to-teal-500';
      default: return 'from-gray-500 to-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hospital': return 'Hospital';
      case 'shelter': return 'Shelter';
      case 'distribution_center': return 'Distribution Center';
      default: return type;
    }
  };

  const getOccupancyPercent = (shelter: Shelter) => {
    return Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-400">Loading shelters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="page-title">Relief Centers</h1>
          <p className="page-subtitle">Find nearby shelters, hospitals, and distribution centers</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="glass-input w-48"
        >
          <option value="">All Types</option>
          <option value="shelter">Shelters</option>
          <option value="hospital">Hospitals</option>
          <option value="distribution_center">Distribution Centers</option>
        </select>
      </div>

      <div className="glass-card p-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl h-64 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-gray-400 text-sm">Interactive map will render here with shelter markers</p>
            <p className="text-gray-300 text-xs mt-1">
              Add Google Maps API key in your .env to enable maps
            </p>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-400 text-sm">No shelters found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((shelter, i) => (
            <div
              key={shelter._id}
              className="glass-card-hover p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getTypeColor(shelter.type)} flex items-center justify-center shadow-lg`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{shelter.name}</h3>
                  <span className="text-xs text-gray-400">{getTypeLabel(shelter.type)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 flex items-start space-x-1">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{shelter.address}</span>
              </p>
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Capacity</span>
                  <span className="font-medium">{shelter.currentOccupancy} / {shelter.capacity}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      getOccupancyPercent(shelter) > 90 ? 'bg-red-500' :
                      getOccupancyPercent(shelter) > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${getOccupancyPercent(shelter)}%` }}
                  />
                </div>
              </div>
              {shelter.contactPhone && (
                <p className="text-sm text-gray-400 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{shelter.contactPhone}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShelterMap;
