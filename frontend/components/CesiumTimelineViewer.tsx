"use client";

import { useEffect, useRef, useState } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { Loader2 } from "lucide-react";

interface CesiumTimelineViewerProps {
    imageUrl: string;
    bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    } | null;
    date: string;
}

export default function CesiumTimelineViewer({ imageUrl, bounds, date }: CesiumTimelineViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const imageryLayerRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isViewerReady, setIsViewerReady] = useState(false);

    // Initialize Cesium Viewer
    useEffect(() => {
        if (!containerRef.current) return;

        // @ts-ignore
        window.CESIUM_BASE_URL = "/cesium";

        let isMounted = true;

        import("cesium").then(async (Cesium) => {
            if (!isMounted || !containerRef.current) return;

            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MmNhYjc1YS05OTVjLTRlMzQtODgzNi1mYWIyZjJjM2UzNjAiLCJpZCI6MzYyMDY0LCJpYXQiOjE3NjM2MTg4ODh9.L9wtc_GcBna4XVzrB1BejWHEj9Sm_o0KMAB4b9HL6zw";

            // Initialize Viewer
            const viewer = new Cesium.Viewer(containerRef.current, {
                terrainProvider: undefined, // Will set async
                animation: false,
                timeline: false,
                baseLayerPicker: false,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                navigationHelpButton: false,
                selectionIndicator: false,
                infoBox: false,
                fullscreenButton: false,
                creditContainer: document.createElement("div"), // Hide credits
            });

            // Enhance 3D effects
            viewer.scene.globe.depthTestAgainstTerrain = true;
            (viewer.scene.globe as any).terrainExaggeration = 3.0; // Increase exaggeration
            (viewer.scene.globe as any).verticalExaggeration = 3.0; // For newer Cesium versions
            viewer.scene.globe.enableLighting = true;

            // Set time for good shadows (10 AM)
            const now = new Date();
            now.setHours(10, 0, 0, 0);
            viewer.clock.currentTime = Cesium.JulianDate.fromDate(now);

            // Add World Terrain
            try {
                const terrain = await Cesium.Terrain.fromWorldTerrain({
                    requestWaterMask: true,
                    requestVertexNormals: true
                });
                viewer.scene.setTerrain(terrain);
            } catch (error) {
                console.error("Failed to load world terrain:", error);
            }

            // Add OSM Buildings
            try {
                const buildings = await Cesium.createOsmBuildingsAsync();
                viewer.scene.primitives.add(buildings);
            } catch (error) {
                console.error("Failed to load OSM buildings:", error);
            }

            viewerRef.current = viewer;
            setIsLoading(false);
            setIsViewerReady(true);
        });

        return () => {
            isMounted = false;
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, []);

    // Track previous bounds to prevent unnecessary camera moves
    const prevBoundsRef = useRef<string>("");
    const hasFlownRef = useRef<boolean>(false);

    // Update Image Layer when URL changes
    useEffect(() => {
        if (!isViewerReady || !viewerRef.current || !imageUrl || !bounds) return;

        import("cesium").then((Cesium) => {
            const viewer = viewerRef.current;

            // Remove existing layer
            if (imageryLayerRef.current) {
                viewer.imageryLayers.remove(imageryLayerRef.current);
                imageryLayerRef.current = null;
            }

            // Create new provider
            const provider = new Cesium.SingleTileImageryProvider({
                url: imageUrl,
                rectangle: Cesium.Rectangle.fromDegrees(
                    bounds.west,
                    bounds.south,
                    bounds.east,
                    bounds.north
                ),
                tileWidth: 1024,
                tileHeight: 1024,
            });

            // Add layer
            imageryLayerRef.current = viewer.imageryLayers.addImageryProvider(provider);
            imageryLayerRef.current.alpha = 0.8;
        });
    }, [imageUrl, bounds, isViewerReady]);

    // Fly to bounds ONLY when bounds change significantly or first load
    useEffect(() => {
        if (!isViewerReady || !viewerRef.current || !bounds) return;

        const boundsKey = JSON.stringify(bounds);

        // If we have already flown and bounds haven't changed, do nothing
        if (hasFlownRef.current && prevBoundsRef.current === boundsKey) return;

        prevBoundsRef.current = boundsKey;
        hasFlownRef.current = true;

        import("cesium").then((Cesium) => {
            const viewer = viewerRef.current;

            viewer.camera.flyTo({
                destination: Cesium.Rectangle.fromDegrees(
                    bounds.west,
                    bounds.south,
                    bounds.east,
                    bounds.north
                ),
                orientation: {
                    heading: Cesium.Math.toRadians(0.0),
                    pitch: Cesium.Math.toRadians(-15.0), // Near horizon view
                    roll: 0.0,
                },
                duration: 1.5,
            });
        });
    }, [bounds, isViewerReady]);

    return (
        <div className="relative w-full h-full">
            <div ref={containerRef} className="absolute inset-0 w-full h-full" />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        <span className="text-sm text-slate-300">Initializing 3D World...</span>
                    </div>
                </div>
            )}

            {/* Date Overlay */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-lg z-10">
                <p className="text-xs text-slate-400">Visualization Date</p>
                <p className="text-lg font-bold text-emerald-400 font-mono">{date}</p>
            </div>
        </div>
    );
}
