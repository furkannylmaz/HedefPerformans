"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Match {
  id: string
  players: Array<{
    id: string
    userId: string
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

interface PlayerCompareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  match: Match
}

interface ComparisonData {
  player1: {
    id: string
    name: string
    stats: Record<string, number>
  } | null
  player2: {
    id: string
    name: string
    stats: Record<string, number>
  } | null
}

export function PlayerCompareDialog({
  open,
  onOpenChange,
  match
}: PlayerCompareDialogProps) {
  const [player1Id, setPlayer1Id] = useState<string>("")
  const [player2Id, setPlayer2Id] = useState<string>("")
  const [comparison, setComparison] = useState<ComparisonData>({
    player1: null,
    player2: null
  })

  useEffect(() => {
    if (player1Id && player2Id && player1Id !== player2Id) {
      loadComparison()
    } else {
      setComparison({ player1: null, player2: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player1Id, player2Id])

  const loadComparison = async () => {
    try {
      const response = await fetch(
        `/api/admin/matches/${match.id}/compare?player1Id=${player1Id}&player2Id=${player2Id}`
      )
      const data = await response.json()
      if (data.success) {
        setComparison(data.data.comparison)
      } else {
        toast.error(data.message || 'Karşılaştırma yüklenemedi')
      }
    } catch (error) {
      console.error("Comparison load error:", error)
      toast.error("Karşılaştırma yüklenirken hata oluştu")
    }
  }

  const getStatValue = (player: { stats?: Record<string, number> } | null, stat: string) => {
    if (!player || !player.stats) return 0
    return player.stats[stat] || 0
  }

  const stats = [
    { key: 'passes', label: 'Pas' },
    { key: 'keyPasses', label: 'Kilit Pas' },
    { key: 'shots', label: 'Şut' },
    { key: 'blockedShots', label: 'Engellenen Şut' },
    { key: 'groundDuels', label: 'Yerde İkili Mücadele' },
    { key: 'aerialDuels', label: 'Hava Topu Mücadele' },
    { key: 'ballRecoveries', label: 'Top Kazanma' },
    { key: 'looseBallRecoveries', label: 'Sahipsiz Top Kazanma' },
    { key: 'interceptions', label: 'Pas Arası' },
    { key: 'dribbles', label: 'Çalım' },
    { key: 'saves', label: 'Kurtarış' },
    { key: 'foulsCommitted', label: 'Yaptığı Fauller' }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Oyuncu Karşılaştırma</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Oyuncu 1</Label>
              <Select value={player1Id} onValueChange={setPlayer1Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Oyuncu seçin" />
                </SelectTrigger>
                <SelectContent>
                  {match.players.map((player) => (
                    <SelectItem key={player.user.id} value={player.user.id}>
                      {player.user.firstName} {player.user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Oyuncu 2</Label>
              <Select value={player2Id} onValueChange={setPlayer2Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Oyuncu seçin" />
                </SelectTrigger>
                <SelectContent>
                  {match.players.map((player) => (
                    <SelectItem key={player.user.id} value={player.user.id}>
                      {player.user.firstName} {player.user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {comparison.player1 && comparison.player2 && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 mb-4 font-semibold border-b pb-2">
                  <div>İstatistik</div>
                  <div className="text-center text-blue-600">{comparison.player1.name}</div>
                  <div className="text-center text-pink-600">{comparison.player2.name}</div>
                </div>
                {stats.map((stat) => {
                  const value1 = getStatValue(comparison.player1, stat.key)
                  const value2 = getStatValue(comparison.player2, stat.key)
                  const winner = value1 > value2 ? 1 : value2 > value1 ? 2 : 0
                  return (
                    <div
                      key={stat.key}
                      className={`grid grid-cols-3 gap-4 py-2 border-b ${
                        winner === 1 ? 'bg-blue-50' : winner === 2 ? 'bg-pink-50' : ''
                      }`}
                    >
                      <div>{stat.label}</div>
                      <div className="text-center">{value1}</div>
                      <div className="text-center">{value2}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

