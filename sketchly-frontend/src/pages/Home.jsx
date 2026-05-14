import { useNavigate } from 'react-router-dom';
import { generateRoomId } from '../utils/roomId';

function Home() {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = generateRoomId();
    navigate(`/room/${roomId}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        background: '#fff',
        padding: '60px 40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0 0 10px 0',
          color: '#1f2937',
          fontWeight: '800'
        }}>
          ✨ Sketchly
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Real-time collaborative whiteboard
          <br />
          <span style={{ fontSize: '14px' }}>Draw together, create together</span>
        </p>
        
        <button
          onClick={createRoom}
          style={{
            padding: '16px 48px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          Create New Room
        </button>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <p style={{ margin: 0 }}>
            💡 <strong>How it works:</strong>
          </p>
          <p style={{ margin: '10px 0 0 0', lineHeight: '1.6' }}>
            Create a room and share the link with others. Everyone in the room can draw together in real-time.
          </p>
        </div>
      </div>

      <footer style={{
        marginTop: '40px',
        color: '#fff',
        fontSize: '14px',
        opacity: 0.8
      }}>
        Built with FastAPI + React + WebSockets
      </footer>
    </div>
  );
}

export default Home;