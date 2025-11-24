"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Layers, Play, Loader2, ChevronRight, Download, Eye, Mountain, TrendingDown, ExternalLink, Map, Maximize2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export function AuditOfficerDashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"map" | "3d" | "2d">("map")
  const [layers, setLayers] = useState({
    optical: true,
    sar: false,
    ndvi: true,
    leaseBoundary: true,
  })
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  // Fetch latest analysis results on component mount
  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/analysis/latest")
        const data = await response.json()
        if (data.status === "success") {
          setAnalysisResult(data)
          setShowResults(true)
        }
      } catch (error) {
        console.error("Failed to fetch analysis results:", error)
      }
    }
    fetchLatestAnalysis()
  }, [])

  const handleAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 3000)
  }

  const analysisData = analysisResult ? {
    mineName: analysisResult.project || "Jharia Coal Block 4",
    district: "Dhanbad",
    depth: "45m",
    volume: "12,500 m³",
    encroachment: analysisResult.stats?.illegal_ha ? Math.round((analysisResult.stats.illegal_ha / (analysisResult.stats.illegal_ha + analysisResult.stats.legal_ha)) * 100) : 68,
    status: "Illegal Activity Detected",
    legalHa: analysisResult.stats?.legal_ha || 0,
    illegalHa: analysisResult.stats?.illegal_ha || 0,
  } : {
    mineName: "Jharia Coal Block 4",
    district: "Dhanbad",
    depth: "45m",
    volume: "12,500 m³",
    encroachment: 68,
    status: "Illegal Activity Detected",
    legalHa: 0,
    illegalHa: 0,
  }

  return (
    <div className="h-full flex flex-col lg:flex-row">

      {/* Center Viewer - Map and 3D Satellite Data */}
      <div className="flex-1 relative bg-slate-950 flex flex-col w-full">
        {/* Tab Navigation */}
        <div className="w-full bg-slate-900 border-b border-slate-800 flex">
          <button
            onClick={() => setActiveTab("map")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent",
              activeTab === "map"
                ? "border-emerald-500 text-emerald-500"
                : "text-slate-400 hover:text-slate-300"
            )}
          >
            <Map className="h-4 w-4" />
            Map View
          </button>
          <button
            onClick={() => setActiveTab("3d")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent",
              activeTab === "3d"
                ? "border-emerald-500 text-emerald-500"
                : "text-slate-400 hover:text-slate-300"
            )}
          >
            <Mountain className="h-4 w-4" />
            3D Satellite Data
          </button>
          <button
            onClick={() => setActiveTab("2d")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent",
              activeTab === "2d"
                ? "border-emerald-500 text-emerald-500"
                : "text-slate-400 hover:text-slate-300"
            )}
          >
            <Eye className="h-4 w-4" />
            2D Visualization
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 relative">
          {/* Map View */}
          {activeTab === "map" && (
            <iframe
              src="http://localhost:3000/map"
              className="w-full h-full border-0"
              title="Cesium Map View"
            />
          )}

          {/* 3D Satellite Data */}
          {activeTab === "3d" && (
            analysisResult?.urls?.model_3d ? (
              <iframe
                src={analysisResult.urls.model_3d}
                className="w-full h-full border-0"
                title="3D Satellite Model"
              />
            ) : (
              <div className="w-full h-full relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "50px 50px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <Mountain className="h-16 w-16 mx-auto text-emerald-500/30" />
                    <div>
                      <h3 className="text-xl font-semibold text-slate-400">3D Satellite Data</h3>
                      <p className="text-sm text-slate-500 mt-2">Interactive 3D visualization of terrain and mining activity</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* 2D Visualization */}
          {activeTab === "2d" && (
            analysisResult?.urls?.map_2d ? (
              <div className="w-full h-full relative bg-slate-950 flex items-center justify-center p-4">
                <img
                  src={analysisResult.urls.map_2d}
                  alt="2D Evidence Map"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            ) : (
              <div className="w-full h-full relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "50px 50px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <Eye className="h-16 w-16 mx-auto text-emerald-500/30" />
                    <div>
                      <h3 className="text-xl font-semibold text-slate-400">2D Evidence Map</h3>
                      <p className="text-sm text-slate-500 mt-2">Color-coded mining activity visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                  AI Analysis in Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing satellite data...</span>
                    <span className="text-foreground">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="text-xs text-muted-foreground">Analyzing {analysisData.mineName}</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Right Results Panel */}
      {showResults && (
        <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-l border-slate-800 p-4 space-y-4 overflow-auto max-h-screen">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Analysis Results</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowResults(false)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Card className="border-rose-500/50 bg-rose-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-rose-500 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Status: {analysisData.status}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Mining Depth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">{analysisData.depth}</div>
              <p className="text-xs text-muted-foreground mt-1">Below surface level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Excavated Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{analysisData.volume}</div>
              <p className="text-xs text-muted-foreground mt-1">Cubic meters removed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Mining Area Analysis</CardTitle>
              <CardDescription>Legal vs Illegal mining areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Legal Area:</span>
                  <span className="font-semibold text-emerald-500">{analysisData.legalHa.toFixed(2)} Ha</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Illegal Area:</span>
                  <span className="font-semibold text-rose-500">{analysisData.illegalHa.toFixed(2)} Ha</span>
                </div>
              </div>
              {analysisData.encroachment > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-rose-500">{analysisData.encroachment}%</span>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <Progress value={analysisData.encroachment} className="h-2 [&>div]:bg-rose-500" />
                  <p className="text-xs text-muted-foreground">
                    Significant illegal mining detected outside authorized zone
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Reports Section */}
          {analysisResult?.urls?.report && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  PDF Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-slate-950 rounded-lg p-3 border border-slate-700">
                  <p className="text-xs text-muted-foreground mb-2">Mining Compliance Audit Report</p>
                  <Button className="w-full justify-center" size="sm" asChild>
                    <a href={analysisResult.urls.report} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-3 w-3" />
                      Download PDF
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!analysisResult && (
                <>
                  <Button className="w-full justify-start" variant="secondary" onClick={() => setReportDialogOpen(true)}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Historical Data
                  </Button>
                </>
              )}
              {analysisResult && (
                <Button className="w-full justify-start" variant="secondary" onClick={() => setReportDialogOpen(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Report Details
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Analysis Report</DialogTitle>
            <DialogDescription>Detailed findings for {analysisData.mineName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Site:</span>
                <span className="font-medium">{analysisData.mineName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">District:</span>
                <span className="font-medium">{analysisData.district}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Legal Area:</span>
                <span className="font-medium text-emerald-500">{analysisData.legalHa.toFixed(2)} Ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Illegal Area:</span>
                <span className="font-medium text-rose-500">{analysisData.illegalHa.toFixed(2)} Ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Encroachment:</span>
                <span className="font-medium text-rose-500">{analysisData.encroachment}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="destructive" className="text-xs">
                  Illegal Activity
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Close
            </Button>
            {analysisResult?.urls?.report && (
              <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <a href={analysisResult.urls.report} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
