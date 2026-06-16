import { useEffect, useRef, useCallback } from 'react';
import { WS_URL } from '../utils/constants';

export const useWebSocket = (roomId, { onDraw, onClear }) => {
    const ws = useRef(null);

    useEffect(() => {
        let reconnectTimeout = null;
        let isMounted = true;

        const connect = () => {
            const wsUrl = `${WS_URL}/ws/${roomId}`;
            ws.current = new WebSocket(wsUrl);

            ws.current.onopen = () => {
                console.log('Connected to WebSocket');
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'draw' && onDraw) {
                        onDraw(data);
                    } else if (data.type === 'clear' && onClear) {
                        onClear();
                    }
                } catch (error) {
                    console.error('Failed to parse websocket message', error);
                }
            };

            ws.current.onclose = () => {
                console.log('WebSocket disconnected. Reconnecting in 3s...');
                if (isMounted) {
                    reconnectTimeout = setTimeout(connect, 3000);
                }
            };

            ws.current.onerror = (err) => {
                console.error('WebSocket error:', err);
                ws.current?.close();
            };
        };

        connect();

        return () => {
            isMounted = false;
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (ws.current) {
                // Remove onclose handler so it doesn't trigger reconnect when explicitly unmounting
                ws.current.onclose = null;
                ws.current.close();
            }
        };
    }, [roomId, onDraw, onClear]);

    const sendDrawingEvent = useCallback((data) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'draw', ...data }));
        }
    }, []);

    const sendClearEvent = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'clear' }));
        }
    }, []);

    return { sendDrawingEvent, sendClearEvent };
};
