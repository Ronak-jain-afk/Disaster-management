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
        className="relative p-2 text-ink-muted hover:text-ink hover:bg-surface-subtle rounded-btn transition-all duration-200"
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
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-danger rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 card shadow-elevated overflow-hidden">
          <div className="p-4 border-b border-surface-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Notifications</h3>
              {unreadCount > 0 && (
                <span className="badge-danger">{unreadCount} new</span>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-surface-border">
            {alerts.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-ink-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm text-ink-muted">No alerts yet</p>
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
                    className={`w-full text-left p-4 transition-all duration-200 hover:bg-surface-subtle ${
                      isUnread ? 'bg-accent-subtle' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        alert.priority === 'urgent' ? 'bg-danger' :
                        alert.priority === 'high' ? 'bg-warning' :
                        alert.priority === 'medium' ? 'bg-warning' : 'bg-accent'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{alert.title}</p>
                        <p className="text-xs text-ink-secondary mt-0.5 line-clamp-2">{alert.message}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs text-ink-muted">
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                          <span className={`badge ${
                            alert.priority === 'urgent' ? 'badge-danger' :
                            alert.priority === 'high' ? 'badge-warning' :
                            alert.priority === 'medium' ? 'badge-warning' : 'badge-accent'
                          }`}>
                            {alert.priority}
                          </span>
                        </div>
                      </div>
                      {isUnread && (
                        <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1.5" />
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
