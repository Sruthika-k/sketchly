import { useState, useEffect } from 'react';
import { CONNECTION_STATUS } from '../utils/constants';

function ConnectionStatus({ status }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 3 seconds when connected
    if (status === CONNECTION_STATUS.CONNECTED) {
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [status]);

  if (!visible) return null;

  const getStatusConfig = () => {
    switch (status) {
      case CONNECTION_STATUS.CONNECTED:
        return { color: '#22c55e', text: 'Connected', dot: '🟢' };
      case CONNECTION_STATUS.CONNECTING:
        return { color: '#eab308', text: 'Connecting...', dot: '🟡' };
      case CONNECTION_STATUS.DISCONNECTED:
        return { color: '#ef4444', text: 'Disconnected', dot: '🔴' };
      default:
        return { color: '#6b7280', text: 'Unknown', dot: '⚪' };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        background: '#fff',
        border: `2px solid ${config.color}`,
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: config.color,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-in'
      }}
    >
      <span>{config.dot}</span>
      <span>{config.text}</span>
    </div>
  );
}

export default ConnectionStatus;