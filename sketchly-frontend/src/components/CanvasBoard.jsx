import { useRef, useEffect, useState } from 'react';
import { CANVAS_CONFIG } from '../utils/constants';

function CanvasBoard({ onDraw, onClear, onRemoteDraw, onRemoteClear, onRemoteHistory }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Initialize canvas with full viewport size
  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = CANVAS_CONFIG.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
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

  // Handle remote history events
  useEffect(() => {
    if (onRemoteHistory) {
      const handleHistory = (strokes) => {
        strokes.forEach(s => drawLine(s.prevX, s.prevY, s.x, s.y));
      };
      onRemoteHistory(handleHistory);
    }
  }, [onRemoteHistory]);

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
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{
        display: 'block',
        cursor: 'crosshair'
      }}
    />
  );
}

export default CanvasBoard;