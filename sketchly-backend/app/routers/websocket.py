from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.room_manager import room_manager
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    """
    WebSocket endpoint for real-time collaboration.
    
    Handles drawing events and broadcasts them to all users in the same room.
    
    Args:
        websocket: WebSocket connection instance
        room_id: Unique room identifier from URL path
    """
    await room_manager.connect(websocket, room_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            # Log event type for debugging
            event_type = data.get("type", "unknown")
            logger.debug(f"📨 Received {event_type} event in room {room_id}")
            
            # Broadcast to all users in room except sender
            await room_manager.broadcast(room_id, data, websocket)
            
    except WebSocketDisconnect:
        room_manager.disconnect(websocket, room_id)
        logger.info(f"🔌 WebSocket disconnected from room {room_id}")
        
    except Exception as e:
        logger.error(f"❗ WebSocket error in room {room_id}: {str(e)}")
        room_manager.disconnect(websocket, room_id)