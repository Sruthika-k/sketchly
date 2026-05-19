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
    # Send existing canvas state to new user
    history = room_manager.get_canvas_state(room_id)
    if history:
        await websocket.send_json({"type": "history", "strokes": history})
    
    while True:
        data = await websocket.receive_json()
        
        # Store draw events
        if data.get("type") == "draw":
            room_manager.add_stroke(room_id, data)
        elif data.get("type") == "clear":
            room_manager.clear_canvas_state(room_id)
        
        await room_manager.broadcast(room_id, data, websocket)  
             
    except WebSocketDisconnect:
        room_manager.disconnect(websocket, room_id)
        logger.info(f"🔌 WebSocket disconnected from room {room_id}")
        
    except Exception as e:
        logger.error(f"❗ WebSocket error in room {room_id}: {str(e)}")
        room_manager.disconnect(websocket, room_id)