"use client"

import { SquadsBoard } from "@/components/admin/squads-board"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Filter, RefreshCw } from "lucide-react"
import Link from "next/link"

// Quick links
function AdminQuickLinks() {
  return (
    <div className="mb-6 overflow-x-auto scroll-smooth">
      <div className="flex gap-2 min-w-max">
        <Button asChild variant="outline" size="sm" className="border-neon-green text-[#111111] hover:bg-neon-green hover:text-black">
          <Link href="/admin/users">Kullanıcı Yönetimi</Link>
        </Button>
        <Button asChild variant="default" size="sm" className="bg-neon-green text-black hover:bg-field-green font-bold">
          <Link href="/admin/squads">Kadro Yönetimi</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-neon-green text-[#111111] hover:bg-neon-green hover:text-black">
          <Link href="/admin/sliders">Slider Yönetimi</Link>
        </Button>
      </div>
    </div>
  )
}

export default function AdminSquadsPage() {
  const handleRefresh = async () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-turf-bg">
      {/* Header */}
      <div className="border-b border-turf-border bg-turf-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#111111] flex items-center gap-2">
                <Users className="h-8 w-8" />
                Kadro Yönetimi
              </h1>
              <p className="text-[#111111]">
                Yaş grubu tabanlı kadro sistemini yönetin ve otomatik atamaları kontrol edin.
              </p>
            </div>
            <Button onClick={handleRefresh} className="bg-neon-green text-black hover:bg-field-green font-bold">
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </Button>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Links */}
        <div className="mb-6">
          <AdminQuickLinks />
        </div>

        <SquadsBoard />
      </div>
    </div>
  )
}

