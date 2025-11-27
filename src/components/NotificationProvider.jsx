import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

let idCounter = 0;

export const NotificationProvider = ({ children, timeout = 4000, max = 5 }) => {
  const [notifications, setNotifications] = useState([]);

  const remove = useCallback((id) => {
    setNotifications(n => n.filter(notif => notif.id !== id));
  }, []);

  const push = useCallback((type, message) => {
    setNotifications(n => {
      const next = [
        ...n,
        { id: ++idCounter, type, message, createdAt: Date.now() }
      ];
      // Limitar cantidad máxima
      return next.slice(-max);
    });
  }, [max]);

  const api = {
    success: (msg) => push('success', msg),
    error: (msg) => push('error', msg),
    info: (msg) => push('info', msg),
    remove
  };

  // Auto-remoción por timeout
  React.useEffect(() => {
    const intervals = notifications.map(notif => {
      const elapsed = Date.now() - notif.createdAt;
      const remaining = Math.max(timeout - elapsed, 800);
      return setTimeout(() => remove(notif.id), remaining);
    });
    return () => intervals.forEach(clearTimeout);
  }, [notifications, timeout, remove]);

  return (
    <NotificationContext.Provider value={api}>
      {children}
      <NotificationContainer notifications={notifications} remove={remove} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications debe usarse dentro de <NotificationProvider>');
    return ctx;
};

const NotificationContainer = ({ notifications, remove }) => {
  return (
    <div style={containerStyle}>
      {notifications.map(n => (
        <div key={n.id} style={{ ...itemStyle, ...typeStyles[n.type] }}>
          <div style={{ flex: 1 }}>{n.message}</div>
          <button
            style={closeBtnStyle}
            onClick={() => remove(n.id)}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// Estilos inline (puedes moverlos a CSS)
const containerStyle = {
  position: 'fixed',
  top: '1rem',
  right: '1rem',
  width: '320px',
  zIndex: 1500,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 0.9rem',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
  fontSize: '0.9rem',
  lineHeight: 1.3,
  color: '#fff',
  animation: 'fadeIn 0.25s ease',
  backdropFilter: 'blur(6px)',
};

const typeStyles = {
  success: { background: 'linear-gradient(135deg,#2e7d32,#43a047)' },
  error: { background: 'linear-gradient(135deg,#c62828,#e53935)' },
  info: { background: 'linear-gradient(135deg,#1565c0,#1e88e5)' },
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  fontSize: '1.1rem',
  cursor: 'pointer',
  lineHeight: 1,
};

