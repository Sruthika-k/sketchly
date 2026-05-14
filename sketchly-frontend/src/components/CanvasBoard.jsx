import { useRef, useEffect, useState } from 'react';
import { CANVAS_CONFIG } from '../utils/constants';

function CanvasBoard({ onDraw, onClear, onRemoteDraw, onRemoteClear }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_CONFIG.width;
    canvas.height = CANVAS_CONFIG.height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = CANVAS_CONFIG.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Handle remote draw events
  useEffect(() => {
    if (onRemoteDraw) {
      const handleRemoteDraw = (data) => {
        drawLine(data.prevX, data.prevY, data.x, data.y);
      };
      onRemoteDraw(handleRemoteDraw);
    }
  }, [onRemoteDraw]);

  // Handle remote clear events
  useEffect(() => {
    if (onRemoteClear) {
      const handleRemoteClear = () => {
        clearCanvas();
      };
      onRemoteClear(handleRemoteClear);
    }
  }, [onRemoteClear]);

  const drawLine = (x1, y1, x2, y2) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = CANVAS_CONFIG.strokeColor;
    ctx.lineWidth = CANVAS_CONFIG.strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const pos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    setLastPos(pos);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    
    // Draw locally
    drawLine(lastPos.x, lastPos.y, x, y);
    
    // Send to server
    if (onDraw) {
      onDraw(x, y, lastPos.x, lastPos.y);
    }
    
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = CANVAS_CONFIG.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleClearClick = () => {
    clearCanvas();
    if (onClear) {
      onClear();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          cursor: 'crosshair',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      />
      <br />
      <button
        onClick={handleClearClick}
        style={{
          marginTop: '15px',
          padding: '12px 24px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = '#333'}
        onMouseLeave={(e) => e.target.style.background = '#000'}
      >
        Clear Board
      </button>
    </div>
  );
}

export default CanvasBoard;