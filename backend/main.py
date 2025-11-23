from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# 🚨 CHANGE: Direct import because files are in the same folder
from routers import router 

load_dotenv()

app = FastAPI()

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

# 2. MOUNT PUBLIC FOLDER (For serving Zips/PDFs)
# Since main.py is in 'backend/', we create 'backend/public'
public_path = os.path.join(os.path.dirname(__file__), "public")
os.makedirs(public_path, exist_ok=True)

app.mount("/static", StaticFiles(directory=public_path), name="static")

# 3. INCLUDE ROUTER
app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Satellite Audit Backend Online"}