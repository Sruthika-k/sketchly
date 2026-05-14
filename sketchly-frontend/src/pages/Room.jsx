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
      minHeight: '100vh',
      background: '#f3f4f6',
      padding: '20px'
    }}>
      <ConnectionStatus status={connectionStatus} />

      {/* Header */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto 30px auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            margin: '0 0 5px 0',
            color: '#1f2937',
            fontWeight: '800'
          }}>
            ✨ Sketchly
          </h1>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Room: <span style={{
              fontFamily: 'monospace',
              background: '#e5e7eb',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: '600'
            }}>{roomId}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleCopyLink}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#fff',
              background: copied ? '#22c55e' : '#667eea',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              if (!copied) e.target.style.background = '#5568d3';
            }}
            onMouseLeave={(e) => {
              if (!copied) e.target.style.background = '#667eea';
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              background: '#fff',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f9fafb';
              e.target.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff';
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            🏠 Home
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <CanvasBoard
          onDraw={handleDraw}
          onClear={handleClear}
          onRemoteDraw={(callback) => wsService.onDraw(callback)}
          onRemoteClear={(callback) => wsService.onClear(callback)}
        />
      </div>

      {/* Instructions */}
      <div style={{
        maxWidth: '900px',
        margin: '30px auto 0 auto',
        padding: '20px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '18px',
          color: '#1f2937',
          fontWeight: '600'
        }}>
          💡 How to collaborate:
        </h3>
        <ol style={{
          margin: 0,
          paddingLeft: '20px',
          color: '#6b7280',
          lineHeight: '1.8'
        }}>
          <li>Click "Copy Link" and share with others</li>
          <li>Everyone who opens the link joins this room</li>
          <li>Draw together in real-time!</li>
          <li>Note: New users will see a blank canvas (no history sync yet)</li>
        </ol>
      </div>
    </div>
  );
}

export default Room;