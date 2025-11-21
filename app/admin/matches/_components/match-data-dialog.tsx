"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

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
  players: Array<{
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
  }>
}

interface MatchDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  match: Match
  onUpdate: () => void
}

export function MatchDataDialog({
  open,
  onOpenChange,
  match,
  onUpdate
}: MatchDataDialogProps) {
  const [teamStats, setTeamStats] = useState({
    opponent: match.opponent || "",
    score: match.score || "",
    duration: match.duration || 0,
    ballPossession: match.ballPossession || 0,
    totalShots: match.totalShots || 0,
    shotsOnTarget: match.shotsOnTarget || 0,
    shotsOffTarget: match.shotsOffTarget || 0,
    blockedShots: match.blockedShots || 0,
    shotsOffPost: match.shotsOffPost || 0,
    missedChances: match.missedChances || 0,
    opponentBoxTouches: match.opponentBoxTouches || 0,
    corners: match.corners || 0,
    fouls: match.fouls || 0,
    totalPasses: match.totalPasses || 0,
    accuratePasses: match.accuratePasses || 0,
    duelsWon: match.duelsWon || 0,
    ballRecoveries: match.ballRecoveries || 0,
    aerialDuelsWon: match.aerialDuelsWon || 0,
    interceptions: match.interceptions || 0,
    clearances: match.clearances || 0,
    status: match.status
  })

  const [playerStats, setPlayerStats] = useState<Record<string, {
    position?: string
    minutes?: number
    passes?: number
    keyPasses?: number
    shots?: number
    blockedShots?: number
    groundDuels?: number
    aerialDuels?: number
    ballRecoveries?: number
    looseBallRecoveries?: number
    interceptions?: number
    dribbles?: number
    saves?: number
    foulsCommitted?: number
  }>>({})

  useEffect(() => {
    if (match) {
      const stats: Record<string, any> = {}
      match.players.forEach((player) => {
        stats[player.userId] = {
          position: player.position || "",
          minutes: player.minutes || 0,
          passes: player.stats?.passes || 0,
          keyPasses: player.stats?.keyPasses || 0,
          shots: player.stats?.shots || 0,
          blockedShots: player.stats?.blockedShots || 0,
          groundDuels: player.stats?.groundDuels || 0,
          aerialDuels: player.stats?.aerialDuels || 0,
          ballRecoveries: player.stats?.ballRecoveries || 0,
          looseBallRecoveries: player.stats?.looseBallRecoveries || 0,
          interceptions: player.stats?.interceptions || 0,
          dribbles: player.stats?.dribbles || 0,
          saves: player.stats?.saves || 0,
          foulsCommitted: player.stats?.foulsCommitted || 0
        }
      })
      setPlayerStats(stats)
    }
  }, [match])

  const handleSaveTeamStats = async () => {
    try {
      const response = await fetch(`/api/admin/matches/${match.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamStats)
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Takım istatistikleri güncellendi')
        onUpdate()
      } else {
        toast.error(data.message || 'Güncelleme başarısız')
      }
    } catch (error) {
      console.error("Update team stats error:", error)
      toast.error("Güncelleme sırasında hata oluştu")
    }
  }

  const handleSavePlayerStats = async (userId: string) => {
    try {
      const stats = playerStats[userId]
      const response = await fetch(`/api/admin/matches/${match.id}/players/${userId}/stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Oyuncu istatistikleri güncellendi')
        onUpdate()
      } else {
        toast.error(data.message || 'Güncelleme başarısız')
      }
    } catch (error) {
      console.error("Update player stats error:", error)
      toast.error("Güncelleme sırasında hata oluştu")
    }
  }

  const updatePlayerStat = (userId: string, field: string, value: number | string) => {
    setPlayerStats(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Maç Verileri - {new Date(match.date).toLocaleDateString('tr-TR')}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="team">Takım İstatistikleri</TabsTrigger>
            <TabsTrigger value="players">Oyuncu İstatistikleri</TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Rakip</Label>
                <Input
                  value={teamStats.opponent}
                  onChange={(e) => setTeamStats({ ...teamStats, opponent: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Skor</Label>
                <Input
                  value={teamStats.score}
                  onChange={(e) => setTeamStats({ ...teamStats, score: e.target.value })}
                  placeholder="3-1"
                />
              </div>
              <div className="space-y-2">
                <Label>Süre (dk)</Label>
                <Input
                  type="number"
                  value={teamStats.duration}
                  onChange={(e) => setTeamStats({ ...teamStats, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Topla Oynama (%)</Label>
                <Input
                  type="number"
                  value={teamStats.ballPossession}
                  onChange={(e) => setTeamStats({ ...teamStats, ballPossession: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Toplam Şut</Label>
                <Input
                  type="number"
                  value={teamStats.totalShots}
                  onChange={(e) => setTeamStats({ ...teamStats, totalShots: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>İsabetli Şut</Label>
                <Input
                  type="number"
                  value={teamStats.shotsOnTarget}
                  onChange={(e) => setTeamStats({ ...teamStats, shotsOnTarget: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>İsabetsiz Şut</Label>
                <Input
                  type="number"
                  value={teamStats.shotsOffTarget}
                  onChange={(e) => setTeamStats({ ...teamStats, shotsOffTarget: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Engellenen Şut</Label>
                <Input
                  type="number"
                  value={teamStats.blockedShots}
                  onChange={(e) => setTeamStats({ ...teamStats, blockedShots: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Direkten Dönen</Label>
                <Input
                  type="number"
                  value={teamStats.shotsOffPost}
                  onChange={(e) => setTeamStats({ ...teamStats, shotsOffPost: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Kaçan Net Pozisyon</Label>
                <Input
                  type="number"
                  value={teamStats.missedChances}
                  onChange={(e) => setTeamStats({ ...teamStats, missedChances: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Rakip Ceza Sahası Buluş</Label>
                <Input
                  type="number"
                  value={teamStats.opponentBoxTouches}
                  onChange={(e) => setTeamStats({ ...teamStats, opponentBoxTouches: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Korner</Label>
                <Input
                  type="number"
                  value={teamStats.corners}
                  onChange={(e) => setTeamStats({ ...teamStats, corners: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fauller</Label>
                <Input
                  type="number"
                  value={teamStats.fouls}
                  onChange={(e) => setTeamStats({ ...teamStats, fouls: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Toplam Pas</Label>
                <Input
                  type="number"
                  value={teamStats.totalPasses}
                  onChange={(e) => setTeamStats({ ...teamStats, totalPasses: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>İsabetli Pas</Label>
                <Input
                  type="number"
                  value={teamStats.accuratePasses}
                  onChange={(e) => setTeamStats({ ...teamStats, accuratePasses: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Kazanılan İkili Mücadele</Label>
                <Input
                  type="number"
                  value={teamStats.duelsWon}
                  onChange={(e) => setTeamStats({ ...teamStats, duelsWon: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Başarılı Top Kazanma</Label>
                <Input
                  type="number"
                  value={teamStats.ballRecoveries}
                  onChange={(e) => setTeamStats({ ...teamStats, ballRecoveries: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Kazanılan Hava Topu</Label>
                <Input
                  type="number"
                  value={teamStats.aerialDuelsWon}
                  onChange={(e) => setTeamStats({ ...teamStats, aerialDuelsWon: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Pas Arası</Label>
                <Input
                  type="number"
                  value={teamStats.interceptions}
                  onChange={(e) => setTeamStats({ ...teamStats, interceptions: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Uzaklaştırma</Label>
                <Input
                  type="number"
                  value={teamStats.clearances}
                  onChange={(e) => setTeamStats({ ...teamStats, clearances: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <Button onClick={handleSaveTeamStats} className="w-full bg-orange-600 hover:bg-orange-700">
              Takım İstatistiklerini Kaydet
            </Button>
          </TabsContent>

          <TabsContent value="players" className="space-y-4">
            <div className="space-y-6">
              {match.players.map((player) => {
                const stats = playerStats[player.userId] || {}
                return (
                  <div key={player.userId} className="border rounded-lg p-4 space-y-4">
                    <div className="font-semibold text-lg">
                      {player.user.firstName} {player.user.lastName}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Pozisyon</Label>
                        <Input
                          value={stats.position || ""}
                          onChange={(e) => updatePlayerStat(player.userId, 'position', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Süre (dk)</Label>
                        <Input
                          type="number"
                          value={stats.minutes || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'minutes', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pas</Label>
                        <Input
                          type="number"
                          value={stats.passes || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'passes', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Kilit Pas</Label>
                        <Input
                          type="number"
                          value={stats.keyPasses || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'keyPasses', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Şut</Label>
                        <Input
                          type="number"
                          value={stats.shots || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'shots', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Engellenen Şut</Label>
                        <Input
                          type="number"
                          value={stats.blockedShots || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'blockedShots', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Yerde İkili Mücadele</Label>
                        <Input
                          type="number"
                          value={stats.groundDuels || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'groundDuels', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hava Topu Mücadele</Label>
                        <Input
                          type="number"
                          value={stats.aerialDuels || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'aerialDuels', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Top Kazanma</Label>
                        <Input
                          type="number"
                          value={stats.ballRecoveries || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'ballRecoveries', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Sahipsiz Top Kazanma</Label>
                        <Input
                          type="number"
                          value={stats.looseBallRecoveries || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'looseBallRecoveries', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pas Arası</Label>
                        <Input
                          type="number"
                          value={stats.interceptions || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'interceptions', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Çalım</Label>
                        <Input
                          type="number"
                          value={stats.dribbles || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'dribbles', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Kurtarış</Label>
                        <Input
                          type="number"
                          value={stats.saves || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'saves', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Yaptığı Fauller</Label>
                        <Input
                          type="number"
                          value={stats.foulsCommitted || 0}
                          onChange={(e) => updatePlayerStat(player.userId, 'foulsCommitted', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSavePlayerStats(player.userId)}
                      className="w-full"
                      variant="outline"
                    >
                      Kaydet
                    </Button>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

