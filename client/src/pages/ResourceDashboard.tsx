import { useState, useEffect } from 'react';
import { resourceApi } from '../services/api';
import { Resource } from '../types';

const ResourceDashboard = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const params: Record<string, string> | undefined = filter ? { status: filter } : undefined;
        const res = await resourceApi.getAll(params);
        setResources(res.data.data);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-400">Loading resources...</p>
        </div>
      </div>
    );
  }

  const totalByStatus = (status: string) =>
    resources.filter((r) => r.status === status).reduce((sum, r) => sum + r.quantity, 0);

  const stats = [
    { label: 'Available', value: totalByStatus('available'), color: 'text-emerald-600' },
    { label: 'In Transit', value: totalByStatus('in_transit'), color: 'text-blue-600' },
    { label: 'Deployed', value: totalByStatus('deployed'), color: 'text-indigo-600' },
    { label: 'Depleted', value: totalByStatus('depleted'), color: 'text-gray-500' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="page-title">Resource Tracking</h1>
          <p className="page-subtitle">Manage and monitor emergency resources</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="glass-input w-44"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="in_transit">In Transit</option>
          <option value="deployed">Deployed</option>
          <option value="depleted">Depleted</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-4 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {resources.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-gray-400 text-sm">No resources tracked yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((resource, i) => (
            <div
              key={resource._id}
              className="glass-card-hover p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    resource.status === 'available' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                    resource.status === 'in_transit' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                    resource.status === 'deployed' ? 'bg-gradient-to-br from-indigo-500 to-purple-500' :
                    'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                    <span className="text-xs text-gray-400">{resource.type}</span>
                  </div>
                </div>
                <span className={`badge ${
                  resource.status === 'available' ? 'badge-green' :
                  resource.status === 'in_transit' ? 'badge-blue' :
                  resource.status === 'deployed' ? 'badge-yellow' : 'badge-gray'
                }`}>
                  {resource.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-4 pt-3 border-t border-gray-100/50">
                <span className="text-gray-500">Quantity</span>
                <span className="font-semibold text-gray-900">{resource.quantity} {resource.unit}</span>
              </div>
              {resource.allocatedTo && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Allocated to</span>
                  <span className="text-gray-700">{resource.allocatedTo}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceDashboard;
