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
          <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-ink-muted">Loading resources...</p>
        </div>
      </div>
    );
  }

  const totalByStatus = (status: string) =>
    resources.filter((r) => r.status === status).reduce((sum, r) => sum + r.quantity, 0);

  const stats = [
    { label: 'Available', value: totalByStatus('available'), color: 'text-success-hover' },
    { label: 'In Transit', value: totalByStatus('in_transit'), color: 'text-accent' },
    { label: 'Deployed', value: totalByStatus('deployed'), color: 'text-warning-hover' },
    { label: 'Depleted', value: totalByStatus('depleted'), color: 'text-ink-muted' },
  ];

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success';
      case 'in_transit': return 'bg-accent';
      case 'deployed': return 'bg-warning';
      default: return 'bg-ink-muted';
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Resource Tracking</h1>
          <p className="page-subtitle">Manage and monitor emergency resources</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input w-44"
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
          <div key={i} className="card p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-ink-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      {resources.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-ink-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-ink-muted text-sm">No resources tracked yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((resource) => (
            <div
              key={resource._id}
              className="card-hover p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-btn ${getStatusBg(resource.status)} flex items-center justify-center`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">{resource.name}</h3>
                    <span className="text-xs text-ink-muted">{resource.type}</span>
                  </div>
                </div>
                <span className={`badge ${
                  resource.status === 'available' ? 'badge-success' :
                  resource.status === 'in_transit' ? 'badge-accent' :
                  resource.status === 'deployed' ? 'badge-warning' : 'bg-surface-subtle text-ink-muted'
                }`}>
                  {resource.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-4 pt-3 border-t border-surface-border">
                <span className="text-ink-secondary">Quantity</span>
                <span className="font-semibold text-ink">{resource.quantity} {resource.unit}</span>
              </div>
              {resource.allocatedTo && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-ink-secondary">Allocated to</span>
                  <span className="text-ink">{resource.allocatedTo}</span>
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
