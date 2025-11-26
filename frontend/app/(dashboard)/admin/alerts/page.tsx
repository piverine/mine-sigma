"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Filter, Download, AlertTriangle, CheckCircle, Clock, MapPin, Zap, TrendingUp, Send, Archive } from "lucide-react"

const alerts = [
    {
        id: 1,
        name: "Jharia Coal Block 4",
        district: "Dhanbad",
        severity: "High",
        status: "Pending",
        detectedDate: "2024-01-15",
        type: "Illegal Excavation",
        location: "23.79°N, 86.43°E",
        confidence: 98,
        description: "Unauthorized excavation detected in restricted zone",
    },
    {
        id: 2,
        name: "Keonjhar Iron Mine",
        district: "Keonjhar",
        severity: "High",
        status: "Under Review",
        detectedDate: "2024-01-14",
        type: "Encroachment",
        location: "21.65°N, 85.24°E",
        confidence: 95,
        description: "Mining activity outside lease boundary detected",
    },
    {
        id: 3,
        name: "Bailadila Sector 14",
        district: "Dantewada",
        severity: "Medium",
        status: "Pending",
        detectedDate: "2024-01-13",
        type: "Vegetation Loss",
        location: "19.85°N, 81.35°E",
        confidence: 87,
        description: "Significant vegetation loss in monitored area",
    },
    {
        id: 4,
        name: "Talcher Coalfield East",
        district: "Angul",
        severity: "High",
        status: "Resolved",
        detectedDate: "2024-01-12",
        type: "Illegal Excavation",
        location: "20.95°N, 84.78°E",
        confidence: 92,
        description: "Unauthorized mining equipment detected",
    },
    {
        id: 5,
        name: "Korba West Mine",
        district: "Korba",
        severity: "Low",
        status: "Pending",
        detectedDate: "2024-01-11",
        type: "Vehicle Movement",
        location: "22.35°N, 82.65°E",
        confidence: 76,
        description: "Unusual vehicle movement in restricted area",
    },
    {
        id: 6,
        name: "Barbil Iron Ore Sector 2",
        district: "Keonjhar",
        severity: "Medium",
        status: "Under Review",
        detectedDate: "2024-01-10",
        type: "Encroachment",
        location: "21.72°N, 85.28°E",
        confidence: 84,
        description: "Boundary violation detected at sector boundary",
    },
    {
        id: 7,
        name: "Singareni Block 3",
        district: "Kothagudem",
        severity: "High",
        status: "Pending",
        detectedDate: "2024-01-09",
        type: "Illegal Excavation",
        location: "17.45°N, 80.12°E",
        confidence: 96,
        description: "Active illegal mining operation detected",
    },
    {
        id: 8,
        name: "Neyveli Lignite Mine",
        district: "Cuddalore",
        severity: "Low",
        status: "Resolved",
        detectedDate: "2024-01-08",
        type: "Vegetation Loss",
        location: "12.23°N, 79.45°E",
        confidence: 72,
        description: "Minor vegetation disturbance detected",
    },
]

const getSeverityColor = (severity: string) => {
    switch(severity) {
        case "High":
            return "bg-red-500/20 text-red-300 border-red-500/30"
        case "Medium":
            return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
        case "Low":
            return "bg-blue-500/20 text-blue-300 border-blue-500/30"
        default:
            return "bg-slate-500/20 text-slate-300 border-slate-500/30"
    }
}

const getStatusColor = (status: string) => {
    switch(status) {
        case "Pending":
            return "bg-orange-500/20 text-orange-300 border-orange-500/30"
        case "Under Review":
            return "bg-blue-500/20 text-blue-300 border-blue-500/30"
        case "Resolved":
            return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        default:
            return "bg-slate-500/20 text-slate-300 border-slate-500/30"
    }
}

const AlertCard = ({ alert }: any) => (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all group">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-lg ${
                    alert.severity === "High" ? "bg-red-500/20" :
                    alert.severity === "Medium" ? "bg-yellow-500/20" :
                    "bg-blue-500/20"
                }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                        alert.severity === "High" ? "text-red-400" :
                        alert.severity === "Medium" ? "text-yellow-400" :
                        "text-blue-400"
                    }`} />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-white">{alert.name}</p>
                    <p className="text-sm text-slate-400 mt-1">{alert.description}</p>
                </div>
            </div>
            <Badge className={`${getSeverityColor(alert.severity)} border`}>
                {alert.severity}
            </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>{alert.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
                <Zap className="w-4 h-4" />
                <span>{alert.confidence}% Confidence</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{alert.detectedDate}</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(alert.status)} border text-xs`}>
                    {alert.status}
                </Badge>
            </div>
        </div>

        <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30">
                <Eye className="w-4 h-4 mr-2" />
                View Details
            </Button>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-blue-400">
                <Send className="w-4 h-4" />
            </Button>
        </div>
    </div>
)

export default function AlertsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
    const [filterSeverity, setFilterSeverity] = useState<string | null>(null)

    const highAlerts = alerts.filter(a => a.severity === "High").length
    const mediumAlerts = alerts.filter(a => a.severity === "Medium").length
    const lowAlerts = alerts.filter(a => a.severity === "Low").length
    const pendingAlerts = alerts.filter(a => a.status === "Pending").length

    const filteredAlerts = filterSeverity
        ? alerts.filter(a => a.severity === filterSeverity)
        : alerts

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent mb-2">
                            Alerts & Incidents
                        </h1>
                        <p className="text-slate-400 text-lg">Manage and respond to detected illegal mining activities</p>
                    </div>
                    <div className="flex gap-2">
                        <Button className="bg-slate-800 hover:bg-slate-700 text-slate-300">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">High Severity</p>
                        <p className="text-3xl font-bold text-red-400">{highAlerts}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Medium Severity</p>
                        <p className="text-3xl font-bold text-yellow-400">{mediumAlerts}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Low Severity</p>
                        <p className="text-3xl font-bold text-blue-400">{lowAlerts}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-1">Pending Action</p>
                        <p className="text-3xl font-bold text-orange-400">{pendingAlerts}</p>
                    </div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 mb-8">
                <Button
                    onClick={() => setFilterSeverity(null)}
                    className={`${
                        filterSeverity === null
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                >
                    All Alerts
                </Button>
                <Button
                    onClick={() => setFilterSeverity("High")}
                    className={`${
                        filterSeverity === "High"
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                >
                    High
                </Button>
                <Button
                    onClick={() => setFilterSeverity("Medium")}
                    className={`${
                        filterSeverity === "Medium"
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                >
                    Medium
                </Button>
                <Button
                    onClick={() => setFilterSeverity("Low")}
                    className={`${
                        filterSeverity === "Low"
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                >
                    Low
                </Button>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                ))}
            </div>

            {/* Table View */}
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-emerald-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-800/50 border-b border-slate-700/50">
                            <TableRow>
                                <TableHead className="text-slate-300 font-semibold">Mine Name</TableHead>
                                <TableHead className="text-slate-300 font-semibold">Type</TableHead>
                                <TableHead className="text-slate-300 font-semibold">Severity</TableHead>
                                <TableHead className="text-slate-300 font-semibold">Status</TableHead>
                                <TableHead className="text-slate-300 font-semibold">Confidence</TableHead>
                                <TableHead className="text-slate-300 font-semibold">Date</TableHead>
                                <TableHead className="text-right text-slate-300 font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAlerts.map((alert) => (
                                <TableRow key={alert.id} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors">
                                    <TableCell className="font-semibold text-white">{alert.name}</TableCell>
                                    <TableCell className="text-slate-300">{alert.type}</TableCell>
                                    <TableCell>
                                        <Badge className={`${getSeverityColor(alert.severity)} border`}>
                                            {alert.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusColor(alert.status)} border`}>
                                            {alert.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden w-16">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full"
                                                    style={{ width: `${alert.confidence}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-slate-400">{alert.confidence}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-400">{alert.detectedDate}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" className="text-emerald-400 hover:bg-emerald-500/10">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/10">
                                                <Send className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-300">
                                                <Archive className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
