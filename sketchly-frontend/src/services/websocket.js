import { WS_URL, WS_EVENTS } from '../utils/constants';

/**
 * WebSocket service for real-time communication
 * Handles connection, reconnection, and message broadcasting
 */
class WebSocketService {
  constructor() {
    this.ws = null;
    this.roomId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    
    // Event callbacks
    this.onDrawCallback = null;
    this.onClearCallback = null;
    this.onConnectCallback = null;
    this.onDisconnectCallback = null;
  }

  /**
   * Connect to WebSocket server for a specific room
   * @param {string} roomId - Room identifier
   */
  connect(roomId) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('⚠️ WebSocket already connected');
      return;
    }

    this.roomId = roomId;
    const wsUrl = `${WS_URL}/ws/${roomId}`;
    
    console.log(`🔌 Connecting to: ${wsUrl}`);
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      this.onConnectCallback?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('❗ Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      this.onDisconnectCallback?.();
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('❗ WebSocket error:', error);
    };
  }

  /**
   * Handle incoming WebSocket messages
   * @param {Object} data - Message data
   */
  handleMessage(data) {
    const { type } = data;

    switch (type) {
      case WS_EVENTS.DRAW:
        this.onDrawCallback?.(data);
        break;
      case WS_EVENTS.CLEAR:
        this.onClearCallback?.();
        break;
      default:
        console.warn('⚠️ Unknown message type:', type);
    }
  }

  /**
   * Attempt to reconnect to WebSocket
   */
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (this.roomId) {
        this.connect(this.roomId);
      }
    }, delay);
  }

  /**
   * Send draw event to server
   * @param {number} x - Current X coordinate
   * @param {number} y - Current Y coordinate
   * @param {number} prevX - Previous X coordinate
   * @param {number} prevY - Previous Y coordinate
   */
  sendDrawEvent(x, y, prevX, prevY) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: WS_EVENTS.DRAW,
        x,
        y,
        prevX,
        prevY
      }));
    }
  }

  /**
   * Send clear event to server
   */
  sendClearEvent() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: WS_EVENTS.CLEAR
      }));
    }
  }

  /**
   * Register callback for draw events
   * @param {Function} callback - Function to call when draw event received
   */
  onDraw(callback) {
    this.onDrawCallback = callback;
  }

  /**
   * Register callback for clear events
   * @param {Function} callback - Function to call when clear event received
   */
  onClear(callback) {
    this.onClearCallback = callback;
  }

  /**
   * Register callback for connection established
   * @param {Function} callback - Function to call when connected
   */
  onConnect(callback) {
    this.onConnectCallback = callback;
  }

  /**
   * Register callback for disconnection
   * @param {Function} callback - Function to call when disconnected
   */
  onDisconnect(callback) {
    this.onDisconnectCallback = callback;
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.ws) {
      console.log('🔌 Manually disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
      this.roomId = null;
      this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
    }
  }

  /**
   * Check if WebSocket is currently connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const wsService = new WebSocketService();