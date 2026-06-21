import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { fetchAlerts, markAlertRead, addAlert } from '../store/alertSlice';
import { getSocket } from '../services/socket';
import { Alert } from '../types';

const NotificationBell = () => {
  const dispatch = useAppDispatch();
  const { alerts, unreadCount } = useAppSelector((state) => state.alerts);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewAlert = (alert: Alert) => {
      dispatch(addAlert(alert));
    };

    socket.on('new-alert', handleNewAlert);
    return () => {
      socket.off('new-alert', handleNewAlert);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = (alertId: string) => {
    dispatch(markAlertRead(alertId));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-xl transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full shadow-md shadow-red-500/30 animate-scale-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 glass rounded-2xl shadow-2xl shadow-blue-900/10 border border-white/30 overflow-hidden animate-scale-in">
          <div className="p-4 border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="badge-red">{unreadCount} new</span>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100/50">
            {alerts.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm text-gray-400">No alerts yet</p>
              </div>
            ) : (
              alerts.map((alert) => {
                const isUnread = !alert.readBy?.some(
                  (r) => r.user === localStorage.getItem('userId')
                );
                return (
                  <button
                    key={alert._id}
                    onClick={() => handleMarkRead(alert._id)}
                    className={`w-full text-left p-4 transition-all duration-200 hover:bg-blue-50/30 ${
                      isUnread ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        alert.priority === 'urgent' ? 'bg-red-500' :
                        alert.priority === 'high' ? 'bg-orange-500' :
                        alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{alert.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{alert.message}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs text-gray-400">
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                          <span className={`badge ${
                            alert.priority === 'urgent' ? 'badge-red' :
                            alert.priority === 'high' ? 'badge-orange' :
                            alert.priority === 'medium' ? 'badge-yellow' : 'badge-blue'
                          }`}>
                            {alert.priority}
                          </span>
                        </div>
                      </div>
                      {isUnread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 animate-pulse-soft" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
