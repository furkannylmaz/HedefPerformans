"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, Calendar
} from "lucide-react"
import Link from "next/link"

interface Squad {
  id: string
  name: string
  ageGroupCode: string
  template: string
  instance: string
  createdAt: Date
  totalSlots: number
  occupiedSlots: number
  slots: Array<{
    positionKey: string
    number: number
    isOccupied: boolean
    user: {
      id: string
      firstName: string
      lastName: string
      mainPosition: string
    } | null
  }>
}

export default function MemberSquadsPage() {
  const [squad, setSquad] = useState<Squad | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserSquad()
  }, [])

  const loadUserSquad = async () => {
    setIsLoading(true)
    try {
      // Önce kullanıcı profilini çek (kadro bilgisi için)
      const profileResponse = await fetch('/api/user/profile')
      const profileData = await profileResponse.json()
      
      if (profileData.success && profileData.data.squad && profileData.data.squad.id) {
        // Kullanıcının kadrosu varsa, o kadroyu detaylı olarak çek
        const squadId = profileData.data.squad.id
        
        // Tüm kadroları çek ve kullanıcının kadrosunu bul
        const squadsResponse = await fetch('/api/squads')
        const squadsData = await squadsResponse.json()
        
        if (squadsData.success) {
          const userSquad = squadsData.data.squads.find((s: Squad) => s.id === squadId)
          if (userSquad) {
            setSquad(userSquad)
          }
        }
      }
    } catch (error) {
      console.error("User squad load error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPositionBadge = (position: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      KALECI: { label: "Kaleci", className: "bg-white text-gray-900 border" },
      SAG_DEF: { label: "Sağ Defans", className: "bg-sky-600 text-white" },
      SOL_DEF: { label: "Sol Defans", className: "bg-sky-600 text-white" },
      ORTA_SAHA: { label: "Orta Saha", className: "bg-amber-400 text-black" },
      FORVET: { label: "Forvet", className: "bg-red-600 text-white" },
      SAGBEK: { label: "Sağbek", className: "bg-sky-600 text-white" },
      SOLBEK: { label: "Solbek", className: "bg-sky-600 text-white" },
      STOPER: { label: "Stoper", className: "bg-sky-600 text-white" },
      SAG_STOPER: { label: "Sağ Stoper", className: "bg-sky-600 text-white" },
      SOL_STOPER: { label: "Sol Stoper", className: "bg-sky-600 text-white" },
      ONLIBERO: { label: "Önlibero", className: "bg-gray-600 text-white" },
      ORTA_8: { label: "Orta Saha 8", className: "bg-amber-400 text-black" },
      ORTA_10: { label: "Orta Saha 10", className: "bg-amber-400 text-black" },
      SAG_KANAT: { label: "Sağ Kanat", className: "bg-green-500 text-white" },
      SOL_KANAT: { label: "Sol Kanat", className: "bg-green-500 text-white" }
    }
    return badges[position] || { label: position, className: "bg-gray-200 text-gray-800" }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <Users className="h-8 w-8 text-red-600" />
            Kadrom
          </h1>
          <p className="text-gray-600">
            Dahil olduğunuz kadroyu görüntüleyin.
          </p>
        </div>
      </div>

      {/* Kadro Kartı */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <Card className="bg-white border-gray-200 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ) : squad ? (
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center justify-between">
                <span>{squad.name}</span>
                <Badge variant="outline" className="bg-red-600 text-white border-red-600">
                  {squad.occupiedSlots}/{squad.totalSlots}
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(squad.createdAt).toLocaleDateString('tr-TR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900 mb-3">
                  Kadro Üyeleri:
                </div>
                {squad.occupiedSlots > 0 ? (
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {squad.slots
                      .filter(slot => slot.isOccupied && slot.user)
                      .map((slot) => {
                        const positionBadge = getPositionBadge(slot.positionKey)
                        return (
                          <div key={`${squad.id}-${slot.positionKey}`} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                            <div className="flex items-center gap-2">
                              <Badge className={positionBadge.className}>
                                {positionBadge.label}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                #{slot.number}
                              </span>
                            </div>
                            {slot.user && (
                              <span className="text-sm text-gray-600">
                                {slot.user.firstName} {slot.user.lastName}
                              </span>
                            )}
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Henüz üye yok
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Henüz kadroya atanmadınız
            </h3>
            <p className="text-gray-600">
              Kadro atamanız tamamlandığında burada görüntülenecektir.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

