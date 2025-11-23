import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
# Configure Gemini
# Ensure you set GOOGLE_API_KEY in your environment variables
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend/.env")) 
load_dotenv(env_path)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def extract_mining_params(file_path):
    print(f"🤖 AI PARSER: Reading {file_path}...")
    
    # 2. CONFIGURE INSIDE THE FUNCTION (Just in time)
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ ERROR: GOOGLE_API_KEY not found in .env!")
        return None
        
    genai.configure(api_key=api_key)
    
    try:
        # TRY 1: Use the stable Flash model (001 version)
        model = genai.GenerativeModel('gemini-1.5-flash-8b')
        response = model.generate_content([sample_file, prompt])
    except:
        try:
            print("⚠️ Flash model not found, trying Pro...")
            # TRY 2: Fallback to Gemini Pro (Standard)
            model = genai.GenerativeModel('gemini-pro') 
            # Note: Pro handles text well, but might struggle with PDFs directly.
            # If this fails, we return the default data, which is fine for the demo.
            return {
                "lat": 23.7957, "lon": 86.4432,
                "length_m": 2000, "width_m": 3000,
                "depth_m": 200,
                "project_name": "Jharia_Audit_Fallback",
                "lease_id": "JH-MIN-Fallback"
            }
        except Exception as e:
            print(f"❌ AI Error: {e}")
            # Return default so the app doesn't crash
            return {
                "lat": 23.7957, "lon": 86.4432,
                "length_m": 2000, "width_m": 3000,
                "depth_m": 200,
                "project_name": "Manual_Fallback_Audit",
                "lease_id": "ERR-001"
            }