"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Share2, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const reports = [
    {
        id: "RPT-2024-001",
        title: "Jharia Block 4 Encroachment Analysis",
        date: "2024-01-15",
        author: "System AI",
        type: "Automated",
        status: "Finalized",
        size: "2.4 MB",
    },
    {
        id: "RPT-2024-002",
        title: "Keonjhar Sector 2 Field Inspection",
        date: "2024-01-14",
        author: "Rajesh Kumar",
        type: "Field Visit",
        status: "Under Review",
        size: "1.8 MB",
    },
    {
        id: "RPT-2024-003",
        title: "Monthly Compliance Summary - Dec 2023",
        date: "2024-01-01",
        author: "Admin",
        type: "Summary",
        status: "Finalized",
        size: "5.1 MB",
    },
    {
        id: "RPT-2024-004",
        title: "Bailadila Vegetation Loss Assessment",
        date: "2023-12-28",
        author: "System AI",
        type: "Automated",
        status: "Finalized",
        size: "3.2 MB",
    },
    {
        id: "RPT-2024-005",
        title: "Singareni Water Quality Audit",
        date: "2023-12-25",
        author: "Priya Singh",
        type: "Audit",
        status: "Draft",
        size: "0.9 MB",
    },
]

export default function ReportsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Documentation</h1>
                    <p className="text-muted-foreground">Access and manage inspection reports and AI analysis summaries</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate New Report
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search reports..." className="pl-8 bg-slate-900 border-slate-800" />
                </div>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{report.id}</TableCell>
                                    <TableCell className="font-medium">{report.title}</TableCell>
                                    <TableCell>{report.date}</TableCell>
                                    <TableCell>{report.type}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                report.status === "Finalized"
                                                    ? "default"
                                                    : report.status === "Draft"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                        >
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{report.size}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" title="Download">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" title="Share">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
