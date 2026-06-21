import { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppStore';
import { volunteerApi, taskApi } from '../services/api';
import { VolunteerTask, TaskStatus } from '../types';

const VolunteerDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const res = await volunteerApi.getTasks(user.id);
        setTasks(res.data.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  const updateStatus = async (taskId: string, status: string) => {
    try {
      await taskApi.updateStatus(taskId, status);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: status as TaskStatus } : t))
      );
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const tasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status);

  const statusCounts = [
    { status: 'pending', label: 'Pending', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
    { status: 'accepted', label: 'Accepted', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
    { status: 'in_progress', label: 'In Progress', color: 'bg-indigo-500', textColor: 'text-indigo-700', bgColor: 'bg-indigo-50' },
    { status: 'completed', label: 'Completed', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title">Volunteer Dashboard</h1>
        <p className="page-subtitle">
          Welcome, <span className="text-gray-700 font-medium">{user?.name}</span>. Here are your assigned tasks.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statusCounts.map((sc) => (
          <div key={sc.status} className="glass-card p-4 text-center animate-slide-up">
            <p className={`text-2xl font-bold ${sc.textColor}`}>{tasksByStatus(sc.status).length}</p>
            <p className="text-sm text-gray-500">{sc.label}</p>
          </div>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-400 text-sm">No tasks assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task, i) => (
            <div
              key={task._id}
              className="glass-card-hover p-6 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`badge ${
                      task.status === 'completed' ? 'badge-green' :
                      task.status === 'in_progress' ? 'badge-blue' :
                      task.status === 'accepted' ? 'badge-yellow' : 'badge-gray'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`badge ${
                      task.priority === 'urgent' ? 'badge-red' :
                      task.priority === 'high' ? 'badge-orange' :
                      task.priority === 'medium' ? 'badge-yellow' : 'badge-blue'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-gray-600">{task.description}</p>
                  {task.progressUpdates && task.progressUpdates.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {task.progressUpdates.map((update, j) => (
                        <div key={j} className="flex items-start space-x-2 text-sm text-gray-500 bg-gray-50/50 rounded-lg p-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                          <span>{update.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                {task.status === 'pending' && (
                  <button onClick={() => updateStatus(task._id, 'accepted')} className="btn-primary text-sm py-2">
                    Accept Task
                  </button>
                )}
                {task.status === 'accepted' && (
                  <button onClick={() => updateStatus(task._id, 'in_progress')} className="btn-primary text-sm py-2">
                    Start Working
                  </button>
                )}
                {task.status === 'in_progress' && (
                  <button onClick={() => updateStatus(task._id, 'completed')} className="btn-success text-sm py-2">
                    Mark Complete
                  </button>
                )}
                {(task.status === 'completed' || task.status === 'cancelled') && (
                  <span className="text-sm text-gray-400 italic">No actions available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
