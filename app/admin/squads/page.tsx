"use client"

import { SquadsBoard } from "@/components/admin/squads-board"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, RefreshCw } from "lucide-react"

export default function AdminSquadsPage() {
  const handleRefresh = async () => {
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-red-600" />
            Kadro Yönetimi
          </h1>
          <p className="text-gray-600 mt-1">
            Yaş grubu tabanlı kadro sistemini yönetin ve otomatik atamaları kontrol edin.
          </p>
        </div>
        <Button onClick={handleRefresh} className="bg-red-600 text-white hover:bg-red-700 font-semibold">
          <RefreshCw className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>

      <SquadsBoard />
    </div>
  )
}

