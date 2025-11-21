"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface MatchDetail {
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
  teamStats: {
    ballPossession: number | null
    totalShots: number
    shotsOnTarget: number
    shotsOffTarget: number
    blockedShots: number
    shotsOffPost: number
    missedChances: number
    opponentBoxTouches: number
    corners: number
    fouls: number
    totalPasses: number
    accuratePasses: number
    duelsWon: number
    ballRecoveries: number
    aerialDuelsWon: number
    interceptions: number
    clearances: number
  }
}

export default function MatchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [match, setMatch] = useState<MatchDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.matchId) {
      loadMatch()
    }
  }, [params.matchId])

  const loadMatch = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/user/matches/${params.matchId}`)
      const data = await response.json()
      if (data.success) {
        setMatch(data.data.match)
      } else {
        toast.error(data.message || 'Maç yüklenemedi')
        router.push('/member/matches')
      }
    } catch (error) {
      console.error("Match load error:", error)
      toast.error("Maç yüklenirken hata oluştu")
      router.push('/member/matches')
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

  const calculatePassPercentage = () => {
    if (!match?.teamStats.totalPasses) return 0
    return Math.round((match.teamStats.accuratePasses / match.teamStats.totalPasses) * 100)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!match) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push('/member/matches')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Geri Dön
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Bireysel Maç Raporu
        </h1>
        <div className="mt-2 text-gray-600">
          <p className="font-semibold">
            {formatDate(match.date)} | Rakip: {match.opponent || '-'} | 
            Skor: {match.score || '-'} | Süre: {match.minutes} dk | 
            Mevki: {match.position || '-'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Takım İstatistikleri */}
        <Card>
          <CardHeader>
            <CardTitle>Takım İstatistikleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Topla Oynama</p>
                <p className="text-lg font-semibold">{match.teamStats.ballPossession || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Şut</p>
                <p className="text-lg font-semibold">{match.teamStats.totalShots}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">İsabetli Şut</p>
                <p className="text-lg font-semibold">{match.teamStats.shotsOnTarget}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pas %</p>
                <p className="text-lg font-semibold">{calculatePassPercentage()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bireysel İstatistikler */}
        <Card>
          <CardHeader>
            <CardTitle>Maç İstatistikleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.passes || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Pas</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.keyPasses || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Kilit Pas</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.shots || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Şut</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.blockedShots || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Engellenen Şut</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.groundDuels || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Yerde İkili Mücadele</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.aerialDuels || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Hava Topu Mücadele</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.ballRecoveries || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Top Kazanma</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.looseBallRecoveries || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Sahipsiz Top Kazanma</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.interceptions || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Pas Arası</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.dribbles || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Çalım</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.saves || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Kurtarış</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{match.stats?.foulsCommitted || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Yaptığı Fauller</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

