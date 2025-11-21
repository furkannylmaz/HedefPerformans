"use client"

import { useState, useEffect } from "react"
import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

interface Match {
  id: string
  date: string
  opponent: string | null
  score: string | null
  duration: number
  squad: {
    id: string
    name: string
    ageGroupCode: string
  }
  position: string | null
  minutes: number
  stats: {
    passes: number
    keyPasses: number
    shots: number
    blockedShots: number
    groundDuels: number
    aerialDuels: number
    ballRecoveries: number
    looseBallRecoveries: number
    interceptions: number
    dribbles: number
    saves: number
    foulsCommitted: number
  } | null
}

export default function MemberMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/matches')
      const data = await response.json()
      if (data.success) {
        setMatches(data.data.matches || [])
      } else {
        toast.error(data.message || 'Maçlar yüklenemedi')
      }
    } catch (error) {
      console.error("Matches load error:", error)
      toast.error("Maç listesi yüklenirken hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatSummary = (stats: Match['stats']) => {
    if (!stats) return "Veri yok"
    const statsList = []
    if (stats.passes > 0) statsList.push(`${stats.passes} Pas`)
    if (stats.shots > 0) statsList.push(`${stats.shots} Şut`)
    if (stats.dribbles > 0) statsList.push(`${stats.dribbles} Çalım`)
    if (stats.ballRecoveries > 0) statsList.push(`${stats.ballRecoveries} Top Kazanma`)
    return statsList.length > 0 ? statsList.join(', ') : "Veri yok"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-red-600" />
          Maç Verilerim
        </h1>
        <p className="text-gray-600 mt-1">
          Oynadığınız maçların detaylı istatistiklerini görüntüleyin.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      ) : matches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Henüz maç verisi bulunmamaktadır.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {formatDate(match.date)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {match.squad.name} {match.opponent && `vs ${match.opponent}`}
                      {match.score && ` - ${match.score}`}
                    </p>
                  </div>
                  <Link href={`/member/matches/${match.id}`}>
                    <Button variant="outline" size="sm">
                      Detayları Gör
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Pozisyon:</span>
                    <span className="ml-2 font-medium">{match.position || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Süre:</span>
                    <span className="ml-2 font-medium">{match.minutes} dk</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pas:</span>
                    <span className="ml-2 font-medium">{match.stats?.passes || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Şut:</span>
                    <span className="ml-2 font-medium">{match.stats?.shots || 0}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Özet:</span> {getStatSummary(match.stats)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

