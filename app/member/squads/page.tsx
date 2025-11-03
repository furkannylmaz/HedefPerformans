"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Users, Filter,
  Calendar
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
  const [squads, setSquads] = useState<Squad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("all")
  const [ageGroups, setAgeGroups] = useState<string[]>([])

  useEffect(() => {
    loadAgeGroups()
  }, [])

  useEffect(() => {
    loadSquads()
  }, [selectedAgeGroup])

  const loadAgeGroups = async () => {
    try {
      const response = await fetch('/api/squads?availableAgeGroups=true')
      const data = await response.json()
      if (data.success) {
        setAgeGroups(data.data.ageGroups)
      }
    } catch (error) {
      console.error("Age groups load error:", error)
    }
  }

  const loadSquads = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedAgeGroup && selectedAgeGroup !== "all") {
        params.append('ageGroupCode', selectedAgeGroup)
      }
      
      const response = await fetch(`/api/squads?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setSquads(data.data.squads)
      }
    } catch (error) {
      console.error("Squads load error:", error)
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
            Kadrolar
          </h1>
          <p className="text-gray-600">
            Tüm kadroları görüntüleyin ve yaş grubuna göre filtreleyin.
          </p>
        </div>
      </div>

      {/* Filtreler */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Filter className="h-5 w-5 text-red-600" />
            Filtreler
          </CardTitle>
        </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label htmlFor="ageGroup" className="text-sm font-medium">Yaş Grubu</label>
              <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Tüm Yaş Grupları" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {ageGroups.map((ageGroup) => (
                    <SelectItem key={ageGroup} value={ageGroup}>
                      {ageGroup}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Kadro Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-white border-gray-200 animate-pulse">
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
            ))
          ) : squads.length > 0 ? (
            squads.map((squad) => {
              const occupiedSlots = squad.occupiedSlots
              const totalSlots = squad.totalSlots
              
              return (
                <Card key={squad.id} className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center justify-between">
                      <span>{squad.name}</span>
                      <Badge variant="outline" className="bg-red-600 text-white border-red-600">
                        {occupiedSlots}/{totalSlots}
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
                      {occupiedSlots > 0 ? (
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
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Kadro bulunamadı
              </h3>
              <p className="text-gray-600">
                Seçilen filtrelerde kadro bulunamadı.
              </p>
            </div>
          )}
        </div>
    </div>
  )
}

