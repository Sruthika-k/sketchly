import { useRef, useEffect, useState, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

function CanvasBoard({ roomId = 'default-room' }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [prevPos, setPrevPos] = useState(null);

    const onDraw = useCallback((data) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(data.prevX, data.prevY);
        ctx.lineTo(data.x, data.y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    }, []);

    const onClear = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, []);

    const { sendDrawingEvent, sendClearEvent } = useWebSocket(roomId, { onDraw, onClear });

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 800;
        canvas.height = 600;
        
        // Ensure white background
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setPrevPos({ x: offsetX, y: offsetY });
    };

    const draw = (e) => {
        if (!isDrawing || !prevPos) return;

        const { offsetX, offsetY } = e.nativeEvent;

        // Draw locally
        onDraw({ prevX: prevPos.x, prevY: prevPos.y, x: offsetX, y: offsetY });

        // Send to remote
        sendDrawingEvent({ prevX: prevPos.x, prevY: prevPos.y, x: offsetX, y: offsetY });

        setPrevPos({ x: offsetX, y: offsetY });
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setPrevPos(null);
    };

    const clearBoard = () => {
        onClear();
        sendClearEvent();
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ border: '2px solid black', cursor: 'crosshair' }}
            />
            <br />
            <button onClick={clearBoard} style={{ marginTop: '10px', padding: '10px 20px' }}>
                Clear Board
            </button>
        </div>
    );
}

export default CanvasBoard;