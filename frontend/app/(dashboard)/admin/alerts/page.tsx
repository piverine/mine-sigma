"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Filter, Download } from "lucide-react"

const alerts = [
    {
        id: 1,
        name: "Jharia Coal Block 4",
        district: "Dhanbad",
        severity: "High",
        status: "Pending",
        detectedDate: "2024-01-15",
        type: "Illegal Excavation",
    },
    {
        id: 2,
        name: "Keonjhar Iron Mine",
        district: "Keonjhar",
        severity: "High",
        status: "Under Review",
        detectedDate: "2024-01-14",
        type: "Encroachment",
    },
    {
        id: 3,
        name: "Bailadila Sector 14",
        district: "Dantewada",
        severity: "Medium",
        status: "Pending",
        detectedDate: "2024-01-13",
        type: "Vegetation Loss",
    },
    {
        id: 4,
        name: "Talcher Coalfield East",
        district: "Angul",
        severity: "High",
        status: "Resolved",
        detectedDate: "2024-01-12",
        type: "Illegal Excavation",
    },
    {
        id: 5,
        name: "Korba West Mine",
        district: "Korba",
        severity: "Low",
        status: "Pending",
        detectedDate: "2024-01-11",
        type: "Vehicle Movement",
    },
    {
        id: 6,
        name: "Barbil Iron Ore Sector 2",
        district: "Keonjhar",
        severity: "Medium",
        status: "Under Review",
        detectedDate: "2024-01-10",
        type: "Encroachment",
    },
    {
        id: 7,
        name: "Singareni Block 3",
        district: "Kothagudem",
        severity: "High",
        status: "Pending",
        detectedDate: "2024-01-09",
        type: "Illegal Excavation",
    },
    {
        id: 8,
        name: "Neyveli Lignite Mine",
        district: "Cuddalore",
        severity: "Low",
        status: "Resolved",
        detectedDate: "2024-01-08",
        type: "Vegetation Loss",
    },
]

export default function AlertsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Alerts & Incidents</h1>
                    <p className="text-muted-foreground">Manage and respond to detected illegal mining activities</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Detections</CardTitle>
                    <CardDescription>List of all AI-detected anomalies requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mine Name</TableHead>
                                <TableHead>District</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alerts.map((alert) => (
                                <TableRow key={alert.id}>
                                    <TableCell className="font-medium">{alert.name}</TableCell>
                                    <TableCell>{alert.district}</TableCell>
                                    <TableCell>{alert.type}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                alert.severity === "High"
                                                    ? "destructive"
                                                    : alert.severity === "Medium"
                                                        ? "default"
                                                        : "secondary"
                                            }
                                        >
                                            {alert.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{alert.status}</Badge>
                                    </TableCell>
                                    <TableCell>{alert.detectedDate}</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="ghost">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
