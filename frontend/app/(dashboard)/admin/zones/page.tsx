"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Map, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const zones = [
    {
        id: 1,
        name: "Jharia Coal Field",
        district: "Dhanbad",
        state: "Jharkhand",
        area: "450 km²",
        riskLevel: "Critical",
        status: "Active Monitoring",
        lastScan: "2 hours ago",
    },
    {
        id: 2,
        name: "Keonjhar Iron Belt",
        district: "Keonjhar",
        state: "Odisha",
        area: "320 km²",
        riskLevel: "High",
        status: "Active Monitoring",
        lastScan: "4 hours ago",
    },
    {
        id: 3,
        name: "Bailadila Iron Ore",
        district: "Dantewada",
        state: "Chhattisgarh",
        area: "280 km²",
        riskLevel: "Medium",
        status: "Active Monitoring",
        lastScan: "1 hour ago",
    },
    {
        id: 4,
        name: "Singareni Collieries",
        district: "Kothagudem",
        state: "Telangana",
        area: "510 km²",
        riskLevel: "Low",
        status: "Maintenance",
        lastScan: "1 day ago",
    },
    {
        id: 5,
        name: "Kolar Gold Fields",
        district: "Kolar",
        state: "Karnataka",
        area: "120 km²",
        riskLevel: "Low",
        status: "Inactive",
        lastScan: "1 week ago",
    },
    {
        id: 6,
        name: "Kudremukh Iron Ore",
        district: "Chikmagalur",
        state: "Karnataka",
        area: "180 km²",
        riskLevel: "Medium",
        status: "Active Monitoring",
        lastScan: "5 hours ago",
    },
]

export default function ZonesPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Monitored Zones</h1>
                    <p className="text-muted-foreground">Overview of all mining zones under satellite surveillance</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Zone
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search zones..." className="pl-8 bg-slate-900 border-slate-800" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map((zone) => (
                    <Card key={zone.id} className="hover:border-emerald-500/50 transition-colors cursor-pointer">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                                    <CardDescription>{zone.district}, {zone.state}</CardDescription>
                                </div>
                                <Badge
                                    variant={
                                        zone.riskLevel === "Critical"
                                            ? "destructive"
                                            : zone.riskLevel === "High"
                                                ? "destructive" // Use destructive for high too or create custom
                                                : zone.riskLevel === "Medium"
                                                    ? "default"
                                                    : "secondary"
                                    }
                                >
                                    {zone.riskLevel} Risk
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Area:</span>
                                    <span className="font-medium">{zone.area}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className={zone.status === "Active Monitoring" ? "text-emerald-500" : "text-slate-400"}>
                                        {zone.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Last Scan:</span>
                                    <span>{zone.lastScan}</span>
                                </div>
                                <div className="pt-2">
                                    <Button variant="secondary" className="w-full">
                                        <Map className="mr-2 h-4 w-4" />
                                        View on Map
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
