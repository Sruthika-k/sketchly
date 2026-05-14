import logging
import sys
from app.config import settings

def setup_logger():
    """
    Configure application-wide logging.
    
    Sets log level from environment and formats output with timestamps.
    """
    # Get log level from settings
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    
    # Configure root logger
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Set specific loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    
    logger = logging.getLogger(__name__)
    logger.info(f"🚀 Logger initialized | Level: {settings.LOG_LEVEL}")

# Initialize on import
setup_logger()