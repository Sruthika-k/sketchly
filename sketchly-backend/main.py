from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import websocket
from app.utils import logger  # This initializes logging
import logging

logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Sketchly API",
    description="Real-time collaborative whiteboard backend",
    version="1.0.0",
    docs_url="/docs" if settings.ENV == "development" else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(websocket.router)

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "message": "Sketchly Backend Running 🚀",
        "version": "1.0.0",
        "environment": settings.ENV
    }

@app.get("/health")
def health_check():
    """Detailed health check with room stats"""
    from app.services.room_manager import room_manager
    
    return {
        "status": "healthy",
        "environment": settings.ENV,
        "active_rooms": room_manager.get_total_rooms()
    }

@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    logger.info(f"🚀 Sketchly Backend Starting...")
    logger.info(f"📍 Environment: {settings.ENV}")
    logger.info(f"🌐 CORS Origins: {settings.cors_origins_list}")
    logger.info(f"🔌 WebSocket endpoint: /ws/{{room_id}}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENV == "development",
        log_level=settings.LOG_LEVEL.lower()
    )