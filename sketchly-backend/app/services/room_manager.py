from typing import Dict, List
from fastapi import WebSocket
import logging

logger = logging.getLogger(__name__)

class RoomManager:
    """
    Manages WebSocket connections organized by room IDs.
    Provides room isolation and message broadcasting.
    """
    
    def __init__(self):
        # Format: { "room_id": [websocket1, websocket2, ...] }
        self.rooms: Dict[str, List[WebSocket]] = {}
        self.canvas_state: Dict[str, List[dict]] = {}  # Store strokes per room
    
    async def connect(self, websocket: WebSocket, room_id: str) -> None:
        """
        Accept WebSocket connection and add to room.
        
        Args:
            websocket: WebSocket connection instance
            room_id: Unique room identifier
        """
        await websocket.accept()
        
        if room_id not in self.rooms:
            self.rooms[room_id] = []
            logger.info(f"📦 Room {room_id} created")
        
        self.rooms[room_id].append(websocket)
        logger.info(f"✅ User joined room {room_id} | Total users: {len(self.rooms[room_id])}")
    
    def disconnect(self, websocket: WebSocket, room_id: str) -> None:
        """
        Remove WebSocket connection from room.
        
        Args:
            websocket: WebSocket connection instance
            room_id: Room identifier
        """
        if room_id in self.rooms:
            self.rooms[room_id].remove(websocket)
            logger.info(f"❌ User left room {room_id} | Remaining: {len(self.rooms[room_id])}")
            
            # Clean up empty rooms
            if len(self.rooms[room_id]) == 0:
                del self.rooms[room_id]
                if room_id in self.canvas_state:
                    del self.canvas_state[room_id]
                logger.info(f"🗑️  Room {room_id} deleted (empty)")
    
    async def broadcast(self, room_id: str, message: dict, sender: WebSocket) -> None:
        """
        Broadcast message to all connections in room except sender.
        
        Args:
            room_id: Target room identifier
            message: Message data to broadcast
            sender: WebSocket that sent the original message
        """
        if room_id not in self.rooms:
            logger.warning(f"⚠️  Attempted broadcast to non-existent room: {room_id}")
            return
        
        # Send to all connections except sender
        for connection in self.rooms[room_id]:
            if connection != sender:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"❗ Error broadcasting to connection: {str(e)}")
    
    def get_room_size(self, room_id: str) -> int:
        """
        Get number of active connections in a room.
        
        Args:
            room_id: Room identifier
            
        Returns:
            Number of active connections
        """
        return len(self.rooms.get(room_id, []))
    
    def get_total_rooms(self) -> int:
        """Get total number of active rooms"""
        return len(self.rooms)
    
    def add_stroke(self, room_id: str, stroke: dict):
        """Store stroke in room history"""
        if room_id not in self.canvas_state:
            self.canvas_state[room_id] = []
        self.canvas_state[room_id].append(stroke)
    
    def get_canvas_state(self, room_id: str) -> List[dict]:
        """Get all strokes for a room"""
        return self.canvas_state.get(room_id, [])
    
    def clear_canvas_state(self, room_id: str):
        """Clear room history"""
        self.canvas_state[room_id] = []

# Singleton instance
room_manager = RoomManager()
