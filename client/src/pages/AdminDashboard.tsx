import { useState } from 'react';
import { useAppSelector } from '../hooks/useAppStore';
import { alertApi } from '../services/api';

const quickActions = [
  { label: 'Manage Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'from-blue-500 to-cyan-500' },
  { label: 'View Resources', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'from-emerald-500 to-teal-500' },
  { label: 'Manage Shelters', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'from-purple-500 to-indigo-500' },
  { label: 'View Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'from-amber-500 to-orange-500' },
];

const AdminDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    priority: 'medium',
  });
  const [alertError, setAlertError] = useState('');
  const [alertSuccess, setAlertSuccess] = useState('');

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertError('');
    setAlertSuccess('');

    try {
      await alertApi.create(alertForm);
      setAlertSuccess('Alert created and broadcasted successfully');
      setAlertForm({ title: '', message: '', priority: 'medium' });
      setShowCreateAlert(false);
    } catch (err: any) {
      setAlertError(err.response?.data?.message || 'Failed to create alert');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">
          Welcome, <span className="text-gray-700 font-medium">{user?.name}</span>. Manage system settings and emergency alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Emergency Alerts</h2>
              <button
                onClick={() => setShowCreateAlert(!showCreateAlert)}
                className="btn-danger text-sm py-2"
              >
                {showCreateAlert ? 'Cancel' : 'New Alert'}
              </button>
            </div>

            {showCreateAlert && (
              <form onSubmit={handleCreateAlert} className="space-y-4 mb-6 p-5 bg-red-50/30 rounded-xl border border-red-100/50">
                {alertError && (
                  <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{alertError}</span>
                  </div>
                )}
                {alertSuccess && (
                  <div className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/60 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{alertSuccess}</span>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                  <input
                    type="text"
                    required
                    value={alertForm.title}
                    onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                    className="glass-input"
                    placeholder="Alert title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={3}
                    value={alertForm.message}
                    onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                    className="glass-input"
                    placeholder="Alert message content"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                  <select
                    value={alertForm.priority}
                    onChange={(e) => setAlertForm({ ...alertForm, priority: e.target.value })}
                    className="glass-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <button type="submit" className="btn-danger w-full">
                  Broadcast Alert
                </button>
              </form>
            )}

            <p className="text-sm text-gray-400">
              Create and broadcast emergency alerts to all users or specific roles in real-time.
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                className="p-5 bg-gray-50/50 hover:bg-gray-100/50 rounded-xl text-left transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
