"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Edit2, Trash2, Mail, Phone, MapPin, Shield } from "lucide-react"

interface User {
    id: number
    name: string
    email: string
    phone: string
    role: "Admin" | "Officer"
    status: "Active" | "Inactive"
    location: string
    joinedDate: string
}

interface UserFormProps {
    formData: {
        name: string
        email: string
        phone: string
        role: "Admin" | "Officer"
        status: "Active" | "Inactive"
        location: string
        password: string
        confirmPassword: string
    }
    setFormData: React.Dispatch<React.SetStateAction<any>>
    onSubmit: () => void
    onCancel: () => void
    isEdit?: boolean
}

// Mock data for users
const mockUsers: User[] = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@minesigma.com",
        phone: "+91 98765 43210",
        role: "Officer",
        status: "Active",
        location: "Jharia Coalfield",
        joinedDate: "2023-05-15",
    },
    {
        id: 2,
        name: "Sarah Smith",
        email: "sarah.smith@minesigma.com",
        phone: "+91 98765 43211",
        role: "Admin",
        status: "Active",
        location: "Head Office",
        joinedDate: "2022-08-20",
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@minesigma.com",
        phone: "+91 98765 43212",
        role: "Officer",
        status: "Active",
        location: "Raniganj Coalfield",
        joinedDate: "2023-11-10",
    },
    {
        id: 4,
        name: "Emily Brown",
        email: "emily.brown@minesigma.com",
        phone: "+91 98765 43213",
        role: "Officer",
        status: "Inactive",
        location: "Bokaro Coalfield",
        joinedDate: "2023-02-28",
    },
]

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>(mockUsers)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Officer" as "Admin" | "Officer",
        status: "Active" as "Active" | "Inactive",
        location: "",
        password: "",
        confirmPassword: "",
    })

    const handleAddUser = () => {
        const newUser: User = {
            id: users.length + 1,
            ...formData,
            joinedDate: new Date().toISOString().split('T')[0],
        }
        setUsers([...users, newUser])
        setIsAddDialogOpen(false)
        resetForm()
        alert(`✅ User ${newUser.name} added successfully!`)
    }

    const handleEditUser = (user: User) => {
        setEditingUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            location: user.location,
            password: "",
            confirmPassword: "",
        })
    }

    const handleUpdateUser = () => {
        if (!editingUser) return
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u))
        setEditingUser(null)
        resetForm()
        alert(`✅ User updated successfully!`)
    }

    const handleDeleteUser = (userId: number) => {
        if (confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(u => u.id !== userId))
            alert(`🗑️ User deleted successfully!`)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            role: "Officer",
            status: "Active",
            location: "",
            password: "",
            confirmPassword: "",
        })
    }

    const activeUsers = users.filter(u => u.status === "Active").length
    const officers = users.filter(u => u.role === "Officer").length

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage system users, roles, and permissions
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add New User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Create a new user account for the system
                            </DialogDescription>
                        </DialogHeader>
                        <UserForm
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleAddUser}
                            onCancel={() => { setIsAddDialogOpen(false); resetForm(); }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-400">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">{activeUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-400">Officers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{officers}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>View and manage all system users</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-200">{user.name}</div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === "Admin" ? "default" : "secondary"}
                                            className={user.role === "Admin" ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : ""}
                                        >
                                            <Shield className="w-3 h-3 mr-1" />
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm space-y-1">
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <Phone className="w-3 h-3" />
                                                <span>{user.phone}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                                            <MapPin className="w-3 h-3" />
                                            <span>{user.location}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.status === "Active" ? "default" : "secondary"}
                                            className={user.status === "Active"
                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                                            }
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400">{user.joinedDate}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 hover:text-emerald-400"
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit User</DialogTitle>
                                                        <DialogDescription>
                                                            Update user information and permissions
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <UserForm
                                                        formData={formData}
                                                        setFormData={setFormData}
                                                        onSubmit={handleUpdateUser}
                                                        onCancel={() => { setEditingUser(null); resetForm(); }}
                                                        isEdit
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
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

// User Form Component
function UserForm({ formData, setFormData, onSubmit, onCancel, isEdit }: UserFormProps) {
    const passwordsMatch = formData.password === formData.confirmPassword
    const showPasswordError = formData.confirmPassword !== undefined && formData.confirmPassword.length > 0 && !passwordsMatch

    const handleSubmit = () => {
        if (!isEdit) {
            if (!formData.password || formData.password.length < 6) {
                alert("⚠️ Password must be at least 6 characters long")
                return
            }
            if (!passwordsMatch) {
                alert("⚠️ Passwords do not match")
                return
            }
        }
        onSubmit()
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-slate-950 border-slate-800"
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-slate-950 border-slate-800"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-slate-950 border-slate-800"
                        placeholder="+91 98765 43210"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="bg-slate-950 border-slate-800"
                        placeholder="Jharia Coalfield"
                    />
                </div>
            </div>

            {!isEdit && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password || ''}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-slate-950 border-slate-800"
                            placeholder="••••••••"
                        />
                        {formData.password && formData.password.length > 0 && formData.password.length < 6 && (
                            <p className="text-xs text-amber-400">Password must be at least 6 characters</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword || ''}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={`bg-slate-950 border-slate-800 ${showPasswordError ? 'border-rose-500' : ''}`}
                            placeholder="••••••••"
                        />
                        {showPasswordError && (
                            <p className="text-xs text-rose-400">Passwords do not match</p>
                        )}
                        {passwordsMatch && formData.confirmPassword && formData.confirmPassword.length > 0 && (
                            <p className="text-xs text-emerald-400">✓ Passwords match</p>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                        <SelectTrigger className="bg-slate-950 border-slate-800">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-950 border-slate-800">
                            <SelectItem value="Officer">Officer</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger className="bg-slate-950 border-slate-800">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-950 border-slate-800">
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
                    {isEdit ? "Update User" : "Add User"}
                </Button>
            </div>
        </div>
    )
}
