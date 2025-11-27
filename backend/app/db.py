from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
import os
from .database import Base, engine

async def init_db():
    """Initialize database connection and create tables."""
    # Import all models to register them with SQLAlchemy
    from .models import (
        User, 
        Alert, 
        Complaint,
        UserRole,
        AlertStatus,
        AlertSeverity,
        ComplaintStatus
    )
    
    # Create all tables
    async with engine.begin() as conn:
        # Drop all tables (for development only!)
        # await conn.run_sync(Base.metadata.drop_all)
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

# This will be called when the application starts
async def startup_event():
    """Initialize the database when the application starts."""
    await init_db()
