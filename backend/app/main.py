from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .db import startup_event
import os

# Import routers
from .auth_router import router as auth_router
from .officer_router import router as officer_router
from .aoi_router import router as aoi_router
from .imagery_router import router as imagery_router
from .quantitative_analysis import router as analysis_router

# Import models to ensure they are registered with SQLAlchemy
from .models import *

def create_app():
    # Create FastAPI app
    app = FastAPI(
        title="Mine-Sigma API",
        description="Backend API for Mine-Sigma application",
        version="1.0.0"
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, replace with your frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(officer_router, prefix="/api/officer", tags=["Officer"])
    app.include_router(aoi_router, prefix="/api/aoi", tags=["Areas of Interest"])
    app.include_router(imagery_router, prefix="/api/imagery", tags=["Imagery"])
    app.include_router(analysis_router, prefix="/api/analysis", tags=["Analysis"])

    # Add startup event
    @app.on_event("startup")
    async def on_startup():
        await startup_event()

    # Health check endpoint
    @app.get("/api/health")
    async def health_check():
        return {"status": "ok", "database": "connected"}

    return app

# Create the application
app = create_app()
