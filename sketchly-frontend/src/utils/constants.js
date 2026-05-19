/**
 * Application-wide constants
 */

export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const CANVAS_CONFIG = {
  width: window.innerWidth,
  height: window.innerHeight,
  strokeColor: '#00E5FF',
  strokeWidth: 2,
  backgroundColor: '#0A0A0C'
};

export const WS_EVENTS = {
  DRAW: 'draw',
  CLEAR: 'clear'
};

export const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting'
};