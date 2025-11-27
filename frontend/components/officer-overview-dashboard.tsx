"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ClipboardList, Flag, Users, ArrowRight, Clock, MapPin } from "lucide-react"
import { getOfficerOverview } from "@/lib/api"

interface OfficerAssignedAlert {
  id: string
  mine_name: string
  district: string
  severity: string
  status: string
  due_in_hours: number
}

interface OfficerSiteVisit {
  id: string
  site_name: string
  district: string
  scheduled_for: string
  priority: string
}

interface OfficerAaiFlag {
  id: string
  mine_name: string
  flag_type: string
  confidence_percent: number
  detected_at: string
}

interface CitizenComplaint {
  id: string
  category: string
  location: string
  submitted_at: string
  status: string
}

interface OfficerOverviewData {
  assigned_alerts: OfficerAssignedAlert[]
  pending_site_visits: OfficerSiteVisit[]
  recent_aai_flags: OfficerAaiFlag[]
  citizen_complaints: CitizenComplaint[]
}

export function OfficerOverviewDashboard() {
  const [data, setData] = useState<OfficerOverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const res = await getOfficerOverview()
        if (!mounted) return
        setData(res)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message ?? "Failed to load officer overview")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const assignedAlerts = data?.assigned_alerts ?? []
  const pendingSiteVisits = data?.pending_site_visits ?? []
  const recentAaiFlags = data?.recent_aai_flags ?? []
  const citizenComplaints = data?.citizen_complaints ?? []

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Officer Operations Overview</h1>
        <p className="text-muted-foreground max-w-2xl">
          Daily summary of alerts, site visits, AI intelligence and citizen complaints assigned to you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Assigned Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedAlerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-cyan-400" />
              Pending Site Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSiteVisits.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Flag className="w-4 h-4 text-emerald-400" />
              Recent AAI Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAaiFlags.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Citizen Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citizenComplaints.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Alerts */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Assigned Alerts
              </CardTitle>
              <CardDescription>Alerts that require your action or review.</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-200">
              Priority Queue
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-md border border-amber-500/40 bg-slate-950/40 px-3 py-2 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-200">{alert.id}</span>
                    <Badge
                      className="text-[10px] px-1.5 py-0.5 border-amber-500/40 bg-amber-500/10 text-amber-200"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-slate-50 mt-1">{alert.mine}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {alert.location}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{alert.status}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Due in {alert.dueIn}
                  </span>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    View Details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
            {assignedAlerts.length === 0 && (
              <p className="text-xs text-slate-400">No alerts currently assigned.</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Site Visits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-cyan-400" />
                Pending Site Visits
              </CardTitle>
              <CardDescription>Upcoming field inspections to be conducted.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingSiteVisits.map((visit) => (
              <div
                key={visit.id}
                className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 flex items-start justify-between gap-3"
              >
                <div>
                  <span className="text-xs font-mono text-slate-400">{visit.id}</span>
                  <p className="text-sm font-semibold text-slate-50 mt-1">{visit.site}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {visit.district}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Scheduled: {visit.scheduledFor}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    className={
                      visit.priority === "High"
                        ? "bg-red-500/20 text-red-300 border-red-500/40"
                        : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                    }
                  >
                    {visit.priority} Priority
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    View Brief
                  </Button>
                </div>
              </div>
            ))}
            {pendingSiteVisits.length === 0 && (
              <p className="text-xs text-slate-400">No pending site visits.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent AAI Flags */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Flag className="w-4 h-4 text-emerald-400" />
                Recent AAI Flags
              </CardTitle>
              <CardDescription>Latest AI Assistance & Intelligence detections.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAaiFlags.map((flag) => (
              <div
                key={flag.id}
                className="rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 flex items-start justify-between gap-3"
              >
                <div>
                  <span className="text-xs font-mono text-emerald-200">{flag.id}</span>
                  <p className="text-sm font-semibold text-slate-50 mt-1">{flag.mine}</p>
                  <p className="text-xs text-slate-300 mt-1">{flag.flagType}</p>
                  <p className="text-xs text-slate-400 mt-1">{flag.detected}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-emerald-200">{flag.confidence}% confidence</span>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    Open in AAI
                  </Button>
                </div>
              </div>
            ))}
            {recentAaiFlags.length === 0 && (
              <p className="text-xs text-slate-400">No recent AI flags.</p>
            )}
          </CardContent>
        </Card>

        {/* Citizen Portal Complaints */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Citizen Complaints (Blockchain Secured)
              </CardTitle>
              <CardDescription>Complaints submitted via citizen portal and anchored on-chain.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {citizenComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="rounded-md border border-purple-500/30 bg-purple-500/5 px-3 py-2 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-purple-200">{complaint.id}</span>
                    <Badge className="text-[10px] px-1.5 py-0.5 bg-slate-950/60 border-slate-700 text-slate-200">
                      Citizen Portal
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-slate-50 mt-1">{complaint.category}</p>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {complaint.location}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Submitted: {complaint.submittedAt}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    className={
                      complaint.status === "New"
                        ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/40"
                        : "bg-yellow-500/20 text-yellow-200 border-yellow-500/40"
                    }
                  >
                    {complaint.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    View Dossier
                  </Button>
                </div>
              </div>
            ))}
            {citizenComplaints.length === 0 && (
              <p className="text-xs text-slate-400">No citizen complaints assigned yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
