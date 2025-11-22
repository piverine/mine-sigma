"use client"

import {
  Home,
  Shield,
  Map,
  BarChart3,
  AlertTriangle,
  Settings,
  LogOut,
  FileText,
  Bell,
  Users,
  Layers,
  Activity,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  // Main navigation items - shown to all users
  const mainNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: Map, label: "Map Viewer", href: "/officer" },
    { icon: Upload, label: "Upload Files", href: "/admin/uploads" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: FileText, label: "Reports", href: "/officer/reports" },
    { icon: Bell, label: "Alerts", href: "/admin/alerts" },
    { icon: Layers, label: "Zones", href: "/admin/zones" },
    { icon: Users, label: "Officers", href: "/admin/officers" },
    { icon: Activity, label: "Activity", href: "/admin/activity" },
  ]

  const NavButton = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
    const button = (
      <Link href={item.href} className="w-full">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-full h-12 rounded-lg transition-all duration-200",
            "hover:bg-emerald-500/10 hover:text-emerald-400",
            isActive && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
            !isActive && "text-slate-400"
          )}
        >
          <item.icon className="h-5 w-5" />
          {isOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
        </Button>
      </Link>
    )

    if (!isOpen) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-800 border-slate-700">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return button
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "bg-slate-950 border-r border-slate-800/50 transition-all duration-300 flex flex-col",
          isOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo/Brand Section */}
        <div className="h-16 border-b border-slate-800/50 flex items-center justify-center px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div>
                <h1 className="font-bold text-sm text-slate-100">Mine-Sigma</h1>
                <p className="text-xs text-slate-500">Satellite Intel</p>
              </div>
            )}
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href
              return <NavButton key={item.href} item={item} isActive={isActive} />
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800/50 space-y-1">
          {!isOpen ? (
            <>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-12 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href="/" className="w-full">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full h-12 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full h-12 justify-start rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              >
                <Settings className="h-5 w-5" />
                <span className="ml-3 text-sm font-medium">Settings</span>
              </Button>
              <Link href="/" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-start rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3 text-sm font-medium">Logout</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
