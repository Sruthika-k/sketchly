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
      background: '#0A0A0C',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dot grid overlay */}
      <div className="dot-grid" />
      
      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        background: 'rgba(20, 20, 22, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '80px 60px',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: '520px',
        width: '100%',
        margin: '20px'
      }}>
        <h1 style={{
          fontSize: '64px',
          margin: '0 0 8px 0',
          color: '#ffffff',
          fontWeight: '300',
          letterSpacing: '-2px',
          textTransform: 'lowercase'
        }}>
          sketchly
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '48px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: '500'
        }}>
          Collaborative Whiteboard
        </p>
        
        <button
          onClick={createRoom}
          style={{
            padding: '18px 56px',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#0A0A0C',
            background: '#00E5FF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)',
            transition: 'all 0.3s ease',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.15)';
          }}
        >
          Create Room
        </button>

        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '12px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.5px',
          lineHeight: '1.8',
          border: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <p style={{ margin: 0, fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
            How it works
          </p>
          <p style={{ margin: 0 }}>
            Create a room and share the link. Everyone in the room can draw together in real-time.
          </p>
        </div>
      </div>

      <footer style={{
        position: 'relative',
        zIndex: 1,
        marginTop: '48px',
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: '11px',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}>
        Built with FastAPI · React · WebSockets
      </footer>
    </div>
  );
}

export default Home;