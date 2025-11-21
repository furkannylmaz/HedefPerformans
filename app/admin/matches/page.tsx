"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, Edit, BarChart3, Trash2, Play, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { CreateMatchDialog } from "./_components/create-match-dialog"
import { MatchDataDialog } from "./_components/match-data-dialog"
import { PlayerCompareDialog } from "./_components/player-compare-dialog"

interface Squad {
  id: string
  name: string
  ageGroupCode: string
  template: string
  instance: string
}

interface MatchPlayer {
  id: string
  userId: string
  position: string | null
  minutes: number
  user: {
    id: string
    firstName: string
    lastName: string
    memberProfile: {
      mainPositionKey: string
    } | null
  }
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

interface Match {
  id: string
  date: string
  opponent: string | null
  score: string | null
  duration: number
  status: string
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
  squad: Squad
  players: MatchPlayer[]
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [squads, setSquads] = useState<Squad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false)
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false)

  useEffect(() => {
    loadSquads()
    loadMatches()
  }, [])

  const loadSquads = async () => {
    try {
      const response = await fetch('/api/squads')
      const data = await response.json()
      if (data.success) {
        setSquads(data.data.squads || [])
      }
    } catch (error) {
      console.error("Squads load error:", error)
    }
  }

  const loadMatches = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/matches')
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

  const handleCreateMatch = async (matchData: { squadId: string; date: string; opponentSquadId?: string | null; opponent?: string | null; playerIds?: string[] }) => {
    try {
      const response = await fetch('/api/admin/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData)
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Maç başarıyla oluşturuldu')
        setIsCreateDialogOpen(false)
        loadMatches()
      } else {
        toast.error(data.message || 'Maç oluşturulamadı')
      }
    } catch (error) {
      console.error("Create match error:", error)
      toast.error("Maç oluşturulurken hata oluştu")
    }
  }

  const handleOpenDataDialog = (match: Match) => {
    setSelectedMatch(match)
    setIsDataDialogOpen(true)
  }

  const handleOpenCompareDialog = (match: Match) => {
    setSelectedMatch(match)
    setIsCompareDialogOpen(true)
  }

  const handleUpdateStatus = async (matchId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/matches/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await response.json()
      if (data.success) {
        toast.success(`Maç durumu ${newStatus === 'IN_PROGRESS' ? 'başlatıldı' : 'tamamlandı'}`)
        loadMatches()
      } else {
        toast.error(data.message || 'Durum güncellenemedi')
      }
    } catch (error) {
      console.error("Update status error:", error)
      toast.error("Durum güncellenirken hata oluştu")
    }
  }

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm('Bu maçı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return
    }
    try {
      const response = await fetch(`/api/admin/matches/${matchId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Maç başarıyla silindi')
        loadMatches()
      } else {
        toast.error(data.message || 'Maç silinemedi')
      }
    } catch (error) {
      console.error("Delete match error:", error)
      toast.error("Maç silinirken hata oluştu")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const calculatePassPercentage = (match: Match) => {
    if (match.totalPasses === 0) return 0
    return Math.round((match.accuratePasses / match.totalPasses) * 100)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-red-600" />
          Maç Yönetimi
        </h1>
        <p className="text-gray-600 mt-1">
          Maçları oluşturun, verileri girin ve oyuncuları karşılaştırın.
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-orange-600 text-white hover:bg-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Maç Başlat
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      ) : matches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Henüz maç bulunmamaktadır.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Maç Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Tarih</th>
                    <th className="text-left p-3 font-semibold">Takım</th>
                    <th className="text-left p-3 font-semibold">Rakip</th>
                    <th className="text-left p-3 font-semibold">Skor</th>
                    <th className="text-left p-3 font-semibold">Pas %</th>
                    <th className="text-left p-3 font-semibold">İkili Müc.</th>
                    <th className="text-left p-3 font-semibold">Durum</th>
                    <th className="text-left p-3 font-semibold">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr key={match.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{formatDate(match.date)}</td>
                      <td className="p-3">{match.squad.name}</td>
                      <td className="p-3">{match.opponent || '-'}</td>
                      <td className="p-3">{match.score || '-'}</td>
                      <td className="p-3">{calculatePassPercentage(match)}%</td>
                      <td className="p-3">{match.duelsWon}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          match.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          match.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {match.status === 'COMPLETED' ? 'Tamamlandı' :
                           match.status === 'IN_PROGRESS' ? 'Devam Ediyor' :
                           'Beklemede'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {match.status === 'PENDING' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                              onClick={() => handleUpdateStatus(match.id, 'IN_PROGRESS')}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Başlat
                            </Button>
                          )}
                          {match.status === 'IN_PROGRESS' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-50 text-green-600 hover:bg-green-100"
                              onClick={() => handleUpdateStatus(match.id, 'COMPLETED')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Tamamla
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDataDialog(match)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Veri Gir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenCompareDialog(match)}
                            disabled={!match.players || match.players.length < 2}
                          >
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Karşılaştır
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 text-red-600 hover:bg-red-100"
                            onClick={() => handleDeleteMatch(match.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Sil
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <CreateMatchDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        squads={squads}
        onCreate={handleCreateMatch}
      />

      {selectedMatch && (
        <>
          <MatchDataDialog
            open={isDataDialogOpen}
            onOpenChange={setIsDataDialogOpen}
            match={selectedMatch}
            onUpdate={loadMatches}
          />
          <PlayerCompareDialog
            open={isCompareDialogOpen}
            onOpenChange={setIsCompareDialogOpen}
            match={selectedMatch}
          />
        </>
      )}
    </div>
  )
}

