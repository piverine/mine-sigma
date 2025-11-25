"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, AlertTriangle, CheckCircle, Clock, BarChart3, PieChart, LineChart, MapPin, Users, FileText } from "lucide-react"

const analyticsData = {
  totalAnalyses: 1247,
  legalMiningArea: 5234.5,
  illegalMiningArea: 1823.4,
  complianceRate: 74.2,
  alertsGenerated: 89,
  reportsGenerated: 156,
  activeMonitoring: 23,
}

const monthlyTrends = [
  { month: "Jan", analyses: 85, alerts: 12, reports: 18 },
  { month: "Feb", analyses: 92, alerts: 15, reports: 22 },
  { month: "Mar", analyses: 78, alerts: 10, reports: 16 },
  { month: "Apr", analyses: 105, alerts: 18, reports: 25 },
  { month: "May", analyses: 98, alerts: 14, reports: 21 },
  { month: "Jun", analyses: 112, alerts: 20, reports: 28 },
]

const miningLocations = [
  { name: "Jharia Coal Block", area: 2450, status: "Active", compliance: 82 },
  { name: "Keonjhar Sector", area: 1890, status: "Active", compliance: 71 },
  { name: "Bailadila Zone", area: 1650, status: "Monitoring", compliance: 68 },
  { name: "Singareni Region", area: 1244, status: "Active", compliance: 79 },
]

const recentAlerts = [
  { id: 1, location: "Jharia Block 4", type: "Encroachment", severity: "High", time: "2 hours ago" },
  { id: 2, location: "Keonjhar Sector 2", type: "Illegal Activity", severity: "Critical", time: "4 hours ago" },
  { id: 3, location: "Bailadila Zone", type: "Vegetation Loss", severity: "Medium", time: "6 hours ago" },
  { id: 4, location: "Singareni Region", type: "Boundary Violation", severity: "High", time: "8 hours ago" },
]

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-semibold ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-slate-400 text-sm mb-1">{label}</p>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
)

const AlertItem = ({ alert }: any) => (
  <div className="flex items-start gap-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:bg-slate-800/50 transition-colors">
    <div className={`p-2 rounded-lg ${
      alert.severity === "Critical" ? "bg-red-500/20" :
      alert.severity === "High" ? "bg-orange-500/20" :
      "bg-yellow-500/20"
    }`}>
      <AlertTriangle className={`w-5 h-5 ${
        alert.severity === "Critical" ? "text-red-400" :
        alert.severity === "High" ? "text-orange-400" :
        "text-yellow-400"
      }`} />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-white">{alert.location}</p>
        <Badge className={`${
          alert.severity === "Critical" ? "bg-red-500/20 text-red-300 border-red-500/30" :
          alert.severity === "High" ? "bg-orange-500/20 text-orange-300 border-orange-500/30" :
          "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
        } border`}>
          {alert.severity}
        </Badge>
      </div>
      <p className="text-sm text-slate-400 mb-1">{alert.type}</p>
      <p className="text-xs text-slate-500">{alert.time}</p>
    </div>
  </div>
)

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-2">
              Analytics & Insights
            </h1>
            <p className="text-slate-400 text-lg">Real-time mining activity monitoring and compliance analytics</p>
          </div>
          <div className="flex gap-2">
            {["1m", "3m", "6m", "1y"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`${
                  timeRange === range
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                } transition-all`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Activity}
          label="Total Analyses"
          value={analyticsData.totalAnalyses.toLocaleString()}
          trend={12}
          color="bg-emerald-500/20"
        />
        <StatCard
          icon={CheckCircle}
          label="Legal Mining Area"
          value={`${analyticsData.legalMiningArea.toLocaleString()} Ha`}
          trend={5}
          color="bg-cyan-500/20"
        />
        <StatCard
          icon={AlertTriangle}
          label="Illegal Mining Area"
          value={`${analyticsData.illegalMiningArea.toLocaleString()} Ha`}
          trend={-8}
          color="bg-red-500/20"
        />
        <StatCard
          icon={BarChart3}
          label="Compliance Rate"
          value={`${analyticsData.complianceRate}%`}
          trend={3}
          color="bg-blue-500/20"
        />
        <StatCard
          icon={AlertTriangle}
          label="Alerts Generated"
          value={analyticsData.alertsGenerated}
          trend={15}
          color="bg-orange-500/20"
        />
        <StatCard
          icon={FileText}
          label="Reports Generated"
          value={analyticsData.reportsGenerated}
          trend={22}
          color="bg-purple-500/20"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trends */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Monthly Trends</h3>
              <p className="text-sm text-slate-400 mt-1">Analyses, alerts, and reports over time</p>
            </div>
            <LineChart className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-4">
            {monthlyTrends.map((trend) => (
              <div key={trend.month} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{trend.month}</span>
                  <span className="text-white font-semibold">{trend.analyses} analyses</span>
                </div>
                <div className="flex gap-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 rounded-full"
                    style={{ width: `${(trend.analyses / 112) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mining Locations */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Mining Locations</h3>
              <p className="text-sm text-slate-400 mt-1">Active monitoring sites and compliance status</p>
            </div>
            <MapPin className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="space-y-3">
            {miningLocations.map((location) => (
              <div key={location.name} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-emerald-500/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white">{location.name}</p>
                    <p className="text-sm text-slate-400">{location.area} Ha</p>
                  </div>
                  <Badge className={`${
                    location.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  } border`}>
                    {location.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full"
                      style={{ width: `${location.compliance}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">{location.compliance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Recent Alerts</h3>
            <p className="text-sm text-slate-400 mt-1">Latest mining activity alerts and violations</p>
          </div>
          <AlertTriangle className="w-6 h-6 text-orange-400" />
        </div>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">📊 Active Monitoring</p>
          <p className="text-2xl font-bold text-emerald-400">{analyticsData.activeMonitoring} Sites</p>
          <p className="text-xs text-slate-500 mt-1">Real-time satellite monitoring</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">⚡ Processing Speed</p>
          <p className="text-2xl font-bold text-cyan-400">2.3s</p>
          <p className="text-xs text-slate-500 mt-1">Average analysis time</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">✓ System Uptime</p>
          <p className="text-2xl font-bold text-purple-400">99.8%</p>
          <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
        </div>
      </div>
    </div>
  )
}
