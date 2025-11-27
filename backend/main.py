from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn

# Load environment variables
load_dotenv()

# Import our application factory
from app.main import create_app

# Create the FastAPI application
app = create_app()

# 1. CORS (Allow Frontend)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
public_path = os.path.join(os.path.dirname(__file__), "public")
os.makedirs(public_path, exist_ok=True)
app.mount("/static", StaticFiles(directory=public_path), name="static")

# Import router
from routers import router 

# 3. INCLUDE ROUTER
app.include_router(router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Satellite Audit Backend Online"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)