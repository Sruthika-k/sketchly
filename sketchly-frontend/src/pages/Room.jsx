import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CanvasBoard from '../components/CanvasBoard';
import ConnectionStatus from '../components/ConnectionStatus';
import { wsService } from '../services/websocket';
import { isValidRoomId, copyRoomLink } from '../utils/roomId';
import { CONNECTION_STATUS } from '../utils/constants';

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.CONNECTING);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Validate room ID
    if (!isValidRoomId(roomId)) {
      alert('Invalid room ID. Redirecting to home...');
      navigate('/');
      return;
    }

    // Connect to WebSocket
    wsService.connect(roomId);

    // Setup connection callbacks
    wsService.onConnect(() => {
      setConnectionStatus(CONNECTION_STATUS.CONNECTED);
    });

    wsService.onDisconnect(() => {
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    });

    // Cleanup on unmount
    return () => {
      wsService.disconnect();
    };
  }, [roomId, navigate]);

  const handleDraw = (x, y, prevX, prevY) => {
    wsService.sendDrawEvent(x, y, prevX, prevY);
  };

  const handleClear = () => {
    wsService.sendClearEvent();
  };

  const handleCopyLink = async () => {
    const success = await copyRoomLink(roomId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('Failed to copy link. Please copy manually from URL bar.');
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#0A0A0C'
    }}>
      {/* Dot grid overlay */}
      <div className="dot-grid" />
      
      <ConnectionStatus status={connectionStatus} />

      {/* Top-left floating menu - Room info */}
      <div style={{
        position: 'fixed',
        top: '24px',
        left: '24px',
        zIndex: 100,
        background: 'rgba(20, 20, 22, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '16px 24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <p style={{
            margin: 0,
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.4)',
            fontWeight: '500'
          }}>
            Room
          </p>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#ffffff',
            fontWeight: '600',
            letterSpacing: '1px'
          }}>
            {roomId}
          </p>
        </div>
      </div>

      {/* Top-right floating menu - Actions */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={handleCopyLink}
          style={{
            padding: '12px 20px',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: copied ? '#0A0A0C' : 'rgba(255, 255, 255, 0.7)',
            background: copied ? '#00E5FF' : 'rgba(20, 20, 22, 0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.target.style.background = 'rgba(20, 20, 22, 0.4)';
              e.target.style.color = 'rgba(255, 255, 255, 0.7)';
            }
          }}
        >
          {copied ? 'Copied' : 'Copy Link'}
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 20px',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.7)',
            background: 'rgba(20, 20, 22, 0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(20, 20, 22, 0.4)';
            e.target.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
        >
          Exit
        </button>
      </div>

      {/* Edge-to-edge Canvas */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <CanvasBoard
          onDraw={handleDraw}
          onClear={handleClear}
          onRemoteDraw={(callback) => wsService.onDraw(callback)}
          onRemoteClear={(callback) => wsService.onClear(callback)}
          onRemoteHistory={(callback) => wsService.onHistory(callback)}
        />
      </div>

      {/* Bottom-center floating toolbar */}
      <div style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        background: 'rgba(20, 20, 22, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '50px',
        padding: '12px 24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <button
          onClick={handleClear}
          style={{
            padding: '10px 24px',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.7)',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.target.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.target.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default Room;