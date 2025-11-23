import os
import ee
import geemap
import rasterio
import numpy as np
from scipy.ndimage import zoom, median_filter, center_of_mass
import plotly.graph_objects as go
from fpdf import FPDF
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
import zipfile

# Inside ai_engine/audit_engine.py

def initialize_gee():
    try:
        # 1. Locate Key File
        # Go up from 'ai_engine' -> 'backend' -> 'serviceAccountKey.json'
        key_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend/serviceAccountKey.json"))
        
        if os.path.exists(key_path):
            # 2. Read Project ID from the JSON file
            import json
            with open(key_path) as f:
                key_data = json.load(f)
                project_id = key_data.get("project_id") # e.g., "mining-solver"
            
            # 3. Authenticate using that specific Project ID
            credentials = ee.ServiceAccountCredentials(
                key_data.get("client_email"), 
                key_file=key_path
            )
            ee.Initialize(credentials, project=project_id)
            print(f"✅ GEE: Authenticated as {project_id}")
        else:
            # Fallback
            ee.Authenticate()
            ee.Initialize()
    except Exception as e:
        print(f"❌ GEE Auth Error: {e}")

def run_audit_pipeline(params, output_base_path="public"):
    # Unpack Parameters
    lat = params['lat']
    lon = params['lon']
    length_m = params['length_m']
    width_m = params['width_m']
    project_name = params['project_name']

    print(f"🚀 ENGINE: Processing {project_name}...")
    initialize_gee()

    # --- 1. SETUP PATHS ---
    safe_name = project_name.replace(" ", "_")
    task_dir = os.path.join(output_base_path, f"audit_{safe_name}")
    os.makedirs(task_dir, exist_ok=True)

    DEM_FILE = os.path.join(task_dir, "dem.tif")
    SAT_FILE = os.path.join(task_dir, "sat.tif")
    HTML_FILE = os.path.join(task_dir, f"{safe_name}_3D_Model.html")
    PNG_FILE = os.path.join(task_dir, f"{safe_name}_Evidence_Map.png")
    PDF_FILE = os.path.join(task_dir, f"{safe_name}_Report.pdf")
    # Zip goes one level up so it contains the folder content cleanly if needed, 
    # or we zip the specific files. Let's zip the specific files to a single archive.
    ZIP_FILE = os.path.join(output_base_path, f"{safe_name}_Audit_Package.zip")

    # --- 2. DOWNLOAD DATA ---
    buffer_size = max(length_m, width_m) * 3.0
    roi = ee.Geometry.Point([lon, lat]).buffer(buffer_size).bounds()

    if os.path.exists(DEM_FILE): os.remove(DEM_FILE)
    geemap.ee_export_image(
        ee.Image("USGS/SRTMGL1_003").clip(roi),
        filename=DEM_FILE, scale=30, region=roi, crs='EPSG:3857', file_per_band=False
    )

    if os.path.exists(SAT_FILE): os.remove(SAT_FILE)
    s2 = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
          .filterBounds(roi).sort('CLOUDY_PIXEL_PERCENTAGE')
          .first().select(['B4', 'B8']))
    geemap.ee_export_image(
        s2.clip(roi), filename=SAT_FILE, scale=30, region=roi, crs='EPSG:3857', file_per_band=False
    )

    # --- 3. PROCESSING ---
    with rasterio.open(SAT_FILE) as src:
        red = src.read(1).astype(float)
        nir = src.read(2).astype(float)
        ndvi = (nir - red) / (nir + red + 1e-5)
        mine_mask = np.zeros_like(ndvi)
        mine_mask[ndvi < 0.2] = 1
        mine_mask = median_filter(mine_mask, size=5)

    with rasterio.open(DEM_FILE) as src:
        elevation = src.read(1)
        elevation = np.where(elevation < -100, np.min(elevation[elevation > -100]), elevation)
        res_x = src.transform[0]
        res_y = -src.transform[4]

    DOWNSAMPLE = 0.5
    z = zoom(elevation, DOWNSAMPLE, order=1)
    mine_m = zoom(mine_mask, DOWNSAMPLE, order=0)
    
    min_r, min_c = min(z.shape[0], mine_m.shape[0]), min(z.shape[1], mine_m.shape[1])
    z = z[:min_r, :min_c]
    mine_m = mine_m[:min_r, :min_c]

    # --- 4. COORDINATES & BOUNDARY ---
    eff_res_x = res_x / DOWNSAMPLE
    eff_res_y = res_y / DOWNSAMPLE
    
    px_width = int(width_m / eff_res_x)
    px_length = int(length_m / eff_res_y)

    # Center on Mine
    if np.sum(mine_m) > 0:
        cy, cx = center_of_mass(mine_m)
        cy, cx = int(cy), int(cx)
    else:
        rows, cols = z.shape
        cy, cx = rows//2, cols//2

    r_start = cy - (px_length // 2)
    r_end   = cy + (px_length // 2)
    c_start = cx - (px_width // 2)
    c_end   = cx + (px_width // 2)

    rows, cols = z.shape
    r_start, r_end = max(0, r_start), min(rows, r_end)
    c_start, c_end = max(0, c_start), min(cols, c_end)

    legal_m = np.zeros_like(z)
    legal_m[r_start:r_end, c_start:c_end] = 1

    # --- 5. COLOR LOGIC (The Perfect Logic) ---
    plot_values = np.zeros_like(z)
    z_norm = (z - np.min(z)) / (np.max(z) - np.min(z) + 1e-5)

    # Base Green
    plot_values = z_norm * 0.8 
    # Tint Legal
    plot_values[legal_m == 1] += 0.2 
    # Legal Mine (Black)
    plot_values[(mine_m == 1) & (legal_m == 1)] = 2.0 
    # Illegal Mine (Red)
    illegal_mask_final = (mine_m == 1) & (legal_m == 0)
    plot_values[illegal_mask_final] = 3.0 

    # Stats
    pixel_area_ha = (eff_res_x * eff_res_y) / 10000.0
    legal_ha = np.sum((mine_m == 1) & (legal_m == 1)) * pixel_area_ha
    illegal_ha = np.sum(illegal_mask_final) * pixel_area_ha
    
    stats = {"legal_ha": legal_ha, "illegal_ha": illegal_ha}

    # --- 6. GENERATE FILES ---
    
    # HTML
    custom_colorscale = [
        [0.0, 'rgb(34, 139, 34)'], [0.3, 'rgb(139, 69, 19)'], [0.35, 'rgb(139, 69, 19)'], 
        [0.3501, 'rgb(100, 120, 100)'], [0.5, 'rgb(100, 120, 100)'],
        [0.5001, 'rgb(10, 10, 20)'], [0.8, 'rgb(10, 10, 20)'],
        [0.8001, 'rgb(255, 0, 0)'], [1.0, 'rgb(255, 0, 0)']
    ]
    fig = go.Figure(data=[go.Surface(z=z, surfacecolor=plot_values, cmin=0, cmax=3, colorscale=custom_colorscale, showscale=False)])
    
    z_top = np.max(z) + 50
    x_b = [c_start, c_end, c_end, c_start, c_start]
    y_b = [r_start, r_start, r_end, r_end, r_start]
    fig.add_trace(go.Scatter3d(x=x_b, y=y_b, z=[z_top]*5, mode='lines', line=dict(color='#00FF00', width=6), name="Authorized Limit"))
    
    fig.update_layout(title=f"Audit: {project_name}", template="plotly_dark")
    fig.write_html(HTML_FILE)

    # PNG
    mpl_colors = np.array([
        [34/255, 139/255, 34/255, 1], [100/255, 120/255, 100/255, 1], 
        [10/255, 10/255, 20/255, 1], [255/255, 0, 0, 1]
    ])
    mpl_data = np.zeros_like(plot_values, dtype=int)
    mpl_data[plot_values <= 0.8] = 0
    mpl_data[plot_values == 1.2] = 1
    mpl_data[plot_values == 2.0] = 2
    mpl_data[plot_values == 3.0] = 3
    
    plt.figure(figsize=(10, 10))
    plt.imshow(mpl_data, cmap=ListedColormap(mpl_colors))
    plt.plot(x_b, y_b, 'lime', linewidth=3)
    plt.axis('off')
    plt.savefig(PNG_FILE, bbox_inches='tight', dpi=150)
    plt.close()

    # PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, 'Mining Compliance Audit Report', 0, 1, 'C')
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f"Project: {project_name}", 0, 1)
    pdf.cell(0, 10, f"Authorized: {legal_ha:.2f} Ha | Illegal: {illegal_ha:.2f} Ha", 0, 1)
    pdf.image(PNG_FILE, x=10, w=190)
    pdf.output(PDF_FILE)

    # Zip
    with zipfile.ZipFile(ZIP_FILE, 'w') as z:
        z.write(HTML_FILE, os.path.basename(HTML_FILE))
        z.write(PNG_FILE, os.path.basename(PNG_FILE))
        z.write(PDF_FILE, os.path.basename(PDF_FILE))
    
    return ZIP_FILE