"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Layers, Play, Loader2, ChevronRight, Download, Eye, Mountain, TrendingDown, ExternalLink } from "lucide-react"
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
      {/* Left Control Panel */}
      <div className="w-full lg:w-80 bg-slate-900 border-b lg:border-r border-slate-800 p-4 space-y-4 overflow-auto">
        <div>
          <h2 className="text-xl font-bold mb-1">Audit Cockpit</h2>
          <p className="text-sm text-muted-foreground">Analysis and monitoring tools</p>
        </div>

        {/* Site Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Selected Site</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-lg font-semibold">{analysisData.mineName}</div>
            <Badge variant="outline">{analysisData.district}</Badge>
          </CardContent>
        </Card>

        {/* Date Range */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">From</Label>
              <div className="text-sm bg-slate-950 p-2 rounded border border-slate-800">2024-01-01</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">To</Label>
              <div className="text-sm bg-slate-950 p-2 rounded border border-slate-800">2024-01-15</div>
            </div>
          </CardContent>
        </Card>

        {/* Layer Toggles */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Map Layers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="optical" className="text-sm">
                Optical Imagery
              </Label>
              <Switch
                id="optical"
                checked={layers.optical}
                onCheckedChange={(checked) => setLayers({ ...layers, optical: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sar" className="text-sm">
                SAR Data
              </Label>
              <Switch
                id="sar"
                checked={layers.sar}
                onCheckedChange={(checked) => setLayers({ ...layers, sar: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ndvi" className="text-sm">
                NDVI Analysis
              </Label>
              <Switch
                id="ndvi"
                checked={layers.ndvi}
                onCheckedChange={(checked) => setLayers({ ...layers, ndvi: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lease" className="text-sm">
                Lease Boundary
              </Label>
              <Switch
                id="lease"
                checked={layers.leaseBoundary}
                onCheckedChange={(checked) => setLayers({ ...layers, leaseBoundary: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Detection Button */}
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run AI Detection
            </>
          )}
        </Button>
      </div>

      {/* Center Map Viewer */}
      <div className="flex-1 relative bg-slate-950">
        {/* Map Placeholder */}
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
                <h3 className="text-xl font-semibold text-slate-400">3D Globe Viewer</h3>
                <p className="text-sm text-slate-500 mt-2">Cesium-powered satellite imagery visualization</p>
              </div>
              {layers.leaseBoundary && (
                <div className="inline-block">
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-500">
                    Lease Boundary Active
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="bg-slate-900/80 backdrop-blur">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
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
        <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-l border-slate-800 p-4 space-y-4 overflow-auto">
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

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysisResult?.urls?.model_3d && (
                <Button className="w-full justify-start" variant="secondary" asChild>
                  <a href={analysisResult.urls.model_3d} target="_blank" rel="noopener noreferrer">
                    <Mountain className="mr-2 h-4 w-4" />
                    View 3D Model
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </a>
                </Button>
              )}
              {analysisResult?.urls?.map_2d && (
                <Button className="w-full justify-start" variant="secondary" asChild>
                  <a href={analysisResult.urls.map_2d} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    View Evidence Map
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </a>
                </Button>
              )}
              {analysisResult?.urls?.report && (
                <Button className="w-full justify-start" variant="secondary" asChild>
                  <a href={analysisResult.urls.report} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Report
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </a>
                </Button>
              )}
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
              Cancel
            </Button>
            {analysisResult?.urls?.report ? (
              <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <a href={analysisResult.urls.report} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Report
                </a>
              </Button>
            ) : (
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
