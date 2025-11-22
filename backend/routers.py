from fastapi import APIRouter, HTTPException
from database import db
from models import ItemCreate, ItemResponse
from pydantic import BaseModel
import sys
import os

# Add parent directory to path to import from ai_engine and app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.gee_service import get_satellite_data
from ai_engine.inference import analyze_image

router = APIRouter()
COLLECTION_NAME = "items" 
ANALYSIS_COLLECTION = "analysisData"

class AnalyzeRequest(BaseModel):
    lat: float
    lon: float
    mineName: str
    district: str

@router.post("/analyze")
async def analyze_mine(request: AnalyzeRequest):
    try:
        # 1. Fetch Data from GEE
        dem_path, sat_path = get_satellite_data(request.lat, request.lon)
        
        # 2. Run Inference
        results = analyze_image(dem_path, sat_path)
        
        # 3. Combine with request data
        final_data = {
            "mineName": request.mineName,
            "district": request.district,
            **results
        }
        
        # 4. Save to Firestore
        # We'll use a fixed ID for the demo to easily retrieve it in the frontend
        # In a real app, you'd use unique IDs
        db.collection(ANALYSIS_COLLECTION).document("latest_analysis").set(final_data)
        
        return final_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/items/", response_model=ItemResponse)
async def create_item(item: ItemCreate):
    try:
        # Add data to Firestore
        doc_ref = db.collection(COLLECTION_NAME).document()
        doc_ref.set(item.dict())
        return {**item.dict(), "id": doc_ref.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/items/{item_id}", response_model=ItemResponse)
async def read_item(item_id: str):
    doc_ref = db.collection(COLLECTION_NAME).document(item_id)
    doc = doc_ref.get()

    if doc.exists:
        return {**doc.to_dict(), "id": doc.id}
    else:
        raise HTTPException(status_code=404, detail="Item not found")

@router.get("/items/")
async def read_all_items():
    docs = db.collection(COLLECTION_NAME).stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs]

@router.get("/analysis/latest")
async def get_latest_analysis():
    try:
        doc_ref = db.collection(ANALYSIS_COLLECTION).document("latest_analysis")
        doc = doc_ref.get()

        if doc.exists:
            return {**doc.to_dict(), "id": doc.id}
        else:
            raise HTTPException(status_code=404, detail="No analysis found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))