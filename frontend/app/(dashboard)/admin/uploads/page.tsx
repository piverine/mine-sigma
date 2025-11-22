"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Image, FileSpreadsheet, Download, Trash2, Eye } from "lucide-react"

// Mock data for uploaded files
const mockUploadedFiles = [
    {
        id: 1,
        name: "satellite_image_zone_4.jpg",
        type: "image/jpeg",
        size: 2500000,
        uploadedBy: "Officer John Doe",
        uploadedAt: "2024-01-20 14:30",
        category: "Satellite Imagery",
    },
    {
        id: 2,
        name: "mining_report_jan_2024.pdf",
        type: "application/pdf",
        size: 1200000,
        uploadedBy: "Admin Sarah Smith",
        uploadedAt: "2024-01-19 10:15",
        category: "Reports",
    },
    {
        id: 3,
        name: "site_inspection_data.csv",
        type: "text/csv",
        size: 450000,
        uploadedBy: "Officer Mike Johnson",
        uploadedAt: "2024-01-18 16:45",
        category: "Data Files",
    },
]

export default function UploadsPage() {
    const [files, setFiles] = useState<File[]>([])

    const handleFilesSelected = (selectedFiles: File[]) => {
        setFiles(selectedFiles)
        console.log("Files selected:", selectedFiles)
    }

    const handleSubmit = (files: File[]) => {
        console.log("Submitting files:", files)
        alert(`✅ ${files.length} file(s) submitted successfully!`)
        // Here you would upload files to your backend API
    }

    const handleView = (file: File) => {
        console.log("Viewing file:", file.name)
        // Open file in new window or show preview modal
        const url = URL.createObjectURL(file)
        window.open(url, '_blank')
    }

    const handleDelete = (fileId: string) => {
        console.log("Deleting file:", fileId)
        alert(`🗑️ File deleted!`)
        // Here you would delete the file
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
    }

    const getFileIcon = (type: string) => {
        if (type.includes("image")) return Image
        if (type.includes("spreadsheet") || type.includes("csv")) return FileSpreadsheet
        return FileText
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">File Uploads</h1>
                    <p className="text-muted-foreground">
                        Upload and manage satellite imagery, reports, and documents
                    </p>
                </div>
                <Badge variant="outline" className="text-xs">
                    {mockUploadedFiles.length} files uploaded
                </Badge>
            </div>

            {/* Upload Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Upload New Files</CardTitle>
                    <CardDescription>
                        Drag and drop files or click to browse. Supports all file formats up to 100MB
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUpload
                        onFilesSelected={handleFilesSelected}
                        onSubmit={handleSubmit}
                        onView={handleView}
                        onDelete={handleDelete}
                        maxSize={100}
                        multiple={true}
                    />
                </CardContent>
            </Card>

            {/* Recently Uploaded Files */}
            <Card>
                <CardHeader>
                    <CardTitle>Recently Uploaded Files</CardTitle>
                    <CardDescription>View and manage all uploaded files</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUploadedFiles.map((file) => {
                                const FileIcon = getFileIcon(file.type)
                                return (
                                    <TableRow key={file.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <FileIcon className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <span className="truncate max-w-xs">{file.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-xs">
                                                {file.type.split("/")[1].toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-400">{formatFileSize(file.size)}</TableCell>
                                        <TableCell className="text-slate-400">{file.uploadedBy}</TableCell>
                                        <TableCell className="text-slate-400">{file.uploadedAt}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{file.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
