"""
AOI (Area of Interest) router.
Provides endpoints to create, upload, list and manage AOIs based on polygons/KML/GeoJSON/Shapefile.
"""

from fastapi import APIRouter, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Dict, List

from app.schemas import (
    AOIRequest, AOIResponse, BoundingBox, SearchLocation, ErrorResponse
)
from app.services.geospatial_service import get_geospatial_service

router = APIRouter(prefix="/api/aoi", tags=["aoi"])

geospatial_service = get_geospatial_service()


@router.post("/create", response_model=AOIResponse, responses={400: {"model": ErrorResponse}})
async def create_aoi(aoi_request: AOIRequest):
    """Create a new Area of Interest from geometry."""
    try:
        aoi_id, aoi_feature = geospatial_service.create_aoi_from_geometry(
            aoi_request.geometry.dict(),
            aoi_request.properties.dict() if aoi_request.properties else None,
        )

        bbox_dict = geospatial_service.get_bounding_box(aoi_feature["geometry"])

        return AOIResponse(
            id=aoi_id,
            feature={
                "geometry": aoi_feature["geometry"],
                "properties": aoi_feature["properties"],
            },
            bounding_box=BoundingBox(**bbox_dict),
            status="created",
            message="AOI created successfully",
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}",
        )


@router.post("/upload", response_model=AOIResponse, responses={400: {"model": ErrorResponse}})
async def upload_aoi_file(file: UploadFile = File(...)):
    """Upload and process a geospatial file (KML, GeoJSON, or Shapefile ZIP)."""

    allowed_extensions = [".kml", ".geojson", ".json", ".zip"]
    if not any(file.filename.lower().endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}",
        )

    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 10MB limit",
        )

    try:
        aoi_id, aoi_feature = geospatial_service.process_uploaded_file(
            content, file.filename
        )

        bbox_dict = geospatial_service.get_bounding_box(aoi_feature["geometry"])

        return AOIResponse(
            id=aoi_id,
            feature={
                "geometry": aoi_feature["geometry"],
                "properties": aoi_feature["properties"],
            },
            bounding_box=BoundingBox(**bbox_dict),
            status="created",
            message=f"AOI created from {file.filename}",
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file: {str(e)}",
        )


@router.get("/{aoi_id}", response_model=AOIResponse, responses={404: {"model": ErrorResponse}})
async def get_aoi(aoi_id: str):
    """Retrieve an AOI by its ID."""
    aoi_feature = geospatial_service.get_aoi(aoi_id)

    if not aoi_feature:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"AOI with ID {aoi_id} not found",
        )

    bbox_dict = geospatial_service.get_bounding_box(aoi_feature["geometry"])

    return AOIResponse(
        id=aoi_id,
        feature={
            "geometry": aoi_feature["geometry"],
            "properties": aoi_feature["properties"],
        },
        bounding_box=BoundingBox(**bbox_dict),
        status="retrieved",
        message="AOI retrieved successfully",
    )


@router.get("/", response_model=Dict[str, AOIResponse])
async def list_aois():
    """List all stored AOIs."""
    aois = geospatial_service.list_aois()

    result: Dict[str, AOIResponse] = {}
    for aoi_id, aoi_feature in aois.items():
        bbox_dict = geospatial_service.get_bounding_box(aoi_feature["geometry"])
        result[aoi_id] = AOIResponse(
            id=aoi_id,
            feature={
                "geometry": aoi_feature["geometry"],
                "properties": aoi_feature["properties"],
            },
            bounding_box=BoundingBox(**bbox_dict),
            status="stored",
            message=None,
        )

    return result


@router.delete("/{aoi_id}")
async def delete_aoi(aoi_id: str):
    """Delete an AOI by its ID."""
    success = geospatial_service.delete_aoi(aoi_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"AOI with ID {aoi_id} not found",
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": f"AOI {aoi_id} deleted successfully"},
    )


@router.get("/search/location", response_model=List[SearchLocation])
async def search_location(query: str) -> List[SearchLocation]:
    """Search for geographic locations by name.

    NOTE: Currently returns a mock response. In production you can
    integrate with Nominatim, Google Geocoding API, or Mapbox.
    """

    mock_results = [
        SearchLocation(
            name=f"Location: {query}",
            coordinates={"latitude": 40.7128, "longitude": -74.0060},
            country="Mock Country",
            admin_area="Mock State",
        )
    ]

    return mock_results
