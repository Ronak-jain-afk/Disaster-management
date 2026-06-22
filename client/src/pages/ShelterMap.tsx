import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { shelterApi } from '../services/api';
import { Shelter } from '../types';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getTypeBg = (type: string) => {
  switch (type) {
    case 'hospital': return 'bg-danger';
    case 'shelter': return 'bg-accent';
    case 'distribution_center': return 'bg-success';
    default: return 'bg-ink-muted';
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

const ShelterMap = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

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

  const center: [number, number] = filtered.length > 0
    ? [filtered[0].location.coordinates[1], filtered[0].location.coordinates[0]]
    : [20.5937, 78.9629];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-ink-muted">Loading shelters...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Relief Centers</h1>
          <p className="page-subtitle">Find nearby shelters, hospitals, and distribution centers</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input w-48"
        >
          <option value="">All Types</option>
          <option value="shelter">Shelters</option>
          <option value="hospital">Hospitals</option>
          <option value="distribution_center">Distribution Centers</option>
        </select>
      </div>

      <div className="card p-6 mb-8">
        <div className="rounded-btn overflow-hidden" style={{ height: '450px', minHeight: '450px' }}>
          <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((shelter) => (
              <Marker
                key={shelter._id}
                position={[shelter.location.coordinates[1], shelter.location.coordinates[0]]}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{shelter.name}</p>
                    <p className="text-ink-muted text-xs">{getTypeLabel(shelter.type)}</p>
                    <p className="text-ink-secondary mt-1">{shelter.address}</p>
                    <p className="mt-1">
                      Occupancy: {shelter.currentOccupancy}/{shelter.capacity}
                      ({getOccupancyPercent(shelter)}%)
                    </p>
                    {shelter.contactPhone && (
                      <p className="text-ink-muted text-xs mt-1">{shelter.contactPhone}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-ink-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-ink-muted text-sm">No shelters found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((shelter) => (
            <div
              key={shelter._id}
              className="card-hover p-5"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-btn ${getTypeBg(shelter.type)} flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{shelter.name}</h3>
                  <span className="text-xs text-ink-muted">{getTypeLabel(shelter.type)}</span>
                </div>
              </div>
              <p className="text-sm text-ink-secondary mb-4 flex items-start space-x-1">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{shelter.address}</span>
              </p>
              <div className="mb-3">
                <div className="flex justify-between text-sm text-ink-secondary mb-1.5">
                  <span>Capacity</span>
                  <span className="font-medium">{shelter.currentOccupancy} / {shelter.capacity}</span>
                </div>
                <div className="w-full bg-surface-border rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      getOccupancyPercent(shelter) > 90 ? 'bg-danger' :
                      getOccupancyPercent(shelter) > 60 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${getOccupancyPercent(shelter)}%` }}
                  />
                </div>
              </div>
              {shelter.contactPhone && (
                <p className="text-sm text-ink-muted flex items-center space-x-1">
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
