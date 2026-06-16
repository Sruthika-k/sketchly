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
      // Show when not connected - this is needed to override any previous hide
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, [status]);

  if (!visible) return null;

  const getStatusConfig = () => {
    switch (status) {
      case CONNECTION_STATUS.CONNECTED:
        return { 
          color: '#00E5FF', 
          glow: 'rgba(0, 229, 255, 0.3)',
          text: 'Connected' 
        };
      case CONNECTION_STATUS.CONNECTING:
        return { 
          color: '#FFB800', 
          glow: 'rgba(255, 184, 0, 0.3)',
          text: 'Connecting...' 
        };
      case CONNECTION_STATUS.DISCONNECTED:
        return { 
          color: '#FF4757', 
          glow: 'rgba(255, 71, 87, 0.3)',
          text: 'Disconnected' 
        };
      default:
        return { 
          color: '#6B7280', 
          glow: 'rgba(107, 114, 128, 0.3)',
          text: 'Unknown' 
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        background: 'rgba(20, 20, 22, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '50px',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: config.color,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px ${config.glow}`,
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-in'
      }}
    >
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: config.color,
        boxShadow: `0 0 12px ${config.glow}`,
        animation: status === CONNECTION_STATUS.CONNECTING ? 'pulse 1.5s ease-in-out infinite' : 'none'
      }} />
      <span>{config.text}</span>
    </div>
  );
}

export default ConnectionStatus;
