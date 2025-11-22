"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight, Activity, Globe, Lock } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur fixed w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="font-bold text-xl tracking-tight">Mine-Sigma</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link href="#features" className="hover:text-emerald-500 transition-colors">
              Features
            </Link>
            <Link href="#about" className="hover:text-emerald-500 transition-colors">
              About
            </Link>
            <Link href="#contact" className="hover:text-emerald-500 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                Admin Login
              </Button>
            </Link>
            <Link href="/officer">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950" />
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium mb-8 animate-fade-in">
            <Activity className="w-4 h-4" />
            <span>Live Satellite Monitoring System</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Advanced Mining Intelligence & Oversight
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Leverage AI-powered satellite imagery to detect illegal mining activities, monitor compliance, and ensure
            sustainable resource extraction in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/officer">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 text-lg">
                Launch Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 h-12 px-8 text-lg">
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl blur opacity-20" />
          <div className="relative rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="aspect-video bg-slate-950 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-black/50 backdrop-blur border border-white/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Satellite Feed Active
                  </div>
                  <div className="bg-black/50 backdrop-blur border border-white/10 px-4 py-2 rounded-lg text-sm">
                    Lat: 23.79° N, Long: 86.43° E
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-950 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Monitoring Suite</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Equipped with state-of-the-art tools for complete oversight of mining operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <Globe className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Satellite Integration</h3>
              <p className="text-slate-400 leading-relaxed">
                Real-time access to multi-spectral satellite imagery for precise terrain analysis and change detection.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Anomaly Detection</h3>
              <p className="text-slate-400 leading-relaxed">
                Automated identification of illegal mining patterns, encroachment, and unauthorized vegetation clearing.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Lock className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Reporting</h3>
              <p className="text-slate-400 leading-relaxed">
                Encrypted reporting channels for officers to document findings and initiate regulatory actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-slate-200">Mine-Sigma</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact Support</a>
          </div>
          <p>© 2024 Mine-Sigma Intelligence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
