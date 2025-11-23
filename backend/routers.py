from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
import shutil
import os
import sys

# --- 🚨 PATH FIX: Point to Root Folder ---
# Go up 1 level (from 'backend' to 'root') to find 'ai_engine'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

try:
    from ai_engine.gemini_parser import extract_mining_params
    from ai_engine.audit_engine import run_audit_pipeline
except ImportError as e:
    print(f"⚠️ Import Error: {e} (Check if ai_engine folder exists in root)")
    # Mock for safety
    def extract_mining_params(p): return {}
    def run_audit_pipeline(p, output_base_path): return "error.zip"

router = APIRouter()

# GLOBAL STATE (For Dashboard)
last_analysis_result = {
    "status": "waiting",
    "message": "No analysis run yet."
}

@router.post("/analyze-mine")
async def analyze_mine(file: UploadFile = File(...)):
    global last_analysis_result
    try:
        # 1. Save Uploaded File Locally
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Run Gemini
        print("📡 SERVER: Calling Gemini...")
        params = extract_mining_params(temp_path)
        
        # 3. Run Audit Engine
        # Save to 'backend/public'
        public_dir = os.path.join(os.path.dirname(__file__), "public")
        os.makedirs(public_dir, exist_ok=True)
        
        zip_path = run_audit_pipeline(params, output_base_path=public_dir)
        
        # Cleanup Input
        if os.path.exists(temp_path): os.remove(temp_path)

        # 4. UPDATE DASHBOARD DATA
        safe_name = params.get('project_name', 'Project').replace(" ", "_")
        
        # Construct Local URLs (Assuming backend runs on port 8000)
        base_url = "http://127.0.0.1:8000/static"
        
        last_analysis_result = {
            "status": "success",
            "project": params.get('project_name'),
            "location": f"{params.get('lat')}, {params.get('lon')}",
            "compliance": "Analysis Complete", 
            "urls": {
                "model_3d": f"{base_url}/audit_{safe_name}/3D_Model.html",
                "map_2d": f"{base_url}/audit_{safe_name}/Evidence_Map.png",
                "report": f"{base_url}/audit_{safe_name}/Audit_Report.pdf",
                "download": f"{base_url}/{os.path.basename(zip_path)}"
            }
        }

        return JSONResponse(content=last_analysis_result)

    except Exception as e:
        print(f"❌ ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/analysis/latest")
async def get_latest_analysis():
    return JSONResponse(content=last_analysis_result)

@router.get("/api/items/")
async def get_items():
    return [{"id": 1, "name": "Jharia Mine"}, {"id": 2, "name": "Korba Mine"}]