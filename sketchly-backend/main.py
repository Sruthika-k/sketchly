from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections per room
# Format: { "room_id": [websocket1, websocket2, ...] }
rooms: Dict[str, List[WebSocket]] = {}

@app.get("/")
def read_root():
    return {"message": "Sketchly Backend Running 🚀"}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    
    # Add user to room
    if room_id not in rooms:
        rooms[room_id] = []
    rooms[room_id].append(websocket)
    
    print(f"✅ User joined room: {room_id} (total: {len(rooms[room_id])})")
    
    try:
        while True:
            # Receive message from user
            data = await websocket.receive_json()
            
            # Broadcast to everyone in the room EXCEPT sender
            for connection in rooms[room_id]:
                if connection != websocket:
                    await connection.send_json(data)
                    
    except WebSocketDisconnect:
        # Remove user from room
        rooms[room_id].remove(websocket)
        print(f"❌ User left room: {room_id} (remaining: {len(rooms[room_id])})")
        
        # Clean up empty rooms
        if len(rooms[room_id]) == 0:
            del rooms[room_id]