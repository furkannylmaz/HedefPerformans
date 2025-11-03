// Admin Kadro Board Komponenti
// Hedef Performans - Kadro Atama Sistemi

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserPlus, MessageCircle, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface SquadSlot {
  positionKey: string
  number: number
  isOccupied: boolean
  user: {
    id: string
    firstName: string
    lastName: string
    mainPosition: string
  } | null
}

interface Squad {
  id: string
  ageGroupCode: string
  template: string
  instance: string
  name: string
  totalSlots: number
  occupiedSlots: number
  occupancyRate: number
  slots: SquadSlot[]
  whatsappGroup: {
    id: string
    groupName: string
    inviteUrl: string
    isActive: boolean
  } | null
}

interface SquadsBoardProps {
  ageGroupCode?: string
  template?: string
}

export function SquadsBoard({ ageGroupCode, template }: SquadsBoardProps) {
  const [squads, setSquads] = useState<Squad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isWhatsappDialogOpen, setIsWhatsappDialogOpen] = useState(false)
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SquadSlot | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [whatsappUrl, setWhatsappUrl] = useState("")
  const [whatsappGroupName, setWhatsappGroupName] = useState("")

  // Kadroları yükle
  useEffect(() => {
    loadSquads()
  }, [ageGroupCode, template])

  const loadSquads = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (ageGroupCode) params.append('ageGroupCode', ageGroupCode)
      if (template) params.append('template', template)

      const response = await fetch(`/api/squads?${params}`)
      const data = await response.json()

      if (data.success) {
        setSquads(data.data.squads || [])
      } else {
        console.error("Squads load error:", data.message || data.error)
        toast.error(data.message || 'Kadrolar yüklenemedi')
        setSquads([])
      }
    } catch (error) {
      console.error("Squads load error:", error)
      toast.error("Kadro listesi yüklenirken hata oluştu")
      setSquads([])
    } finally {
      setIsLoading(false)
    }
  }

  // Kullanıcıları yükle
  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()

      if (data.success) {
        setUsers(data.data.users.filter((user: any) => user.status === 'ACTIVE'))
      }
    } catch (error) {
      toast.error("Kullanıcı listesi yüklenirken hata oluştu")
    }
  }

  // Manuel atama
  const handleManualAssign = async () => {
    if (!selectedSquad || !selectedSlot || !selectedUser) return

    try {
      const response = await fetch('/api/admin/squads/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser,
          squadId: selectedSquad.id,
          positionKey: selectedSlot.positionKey,
          number: selectedSlot.number
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Kullanıcı başarıyla atandı")
        setIsAssignDialogOpen(false)
        loadSquads()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Atama işlemi sırasında hata oluştu")
    }
  }

  // WhatsApp link güncelleme
  const handleWhatsappUpdate = async () => {
    if (!selectedSquad || !whatsappUrl || !whatsappGroupName) return

    try {
      const response = await fetch(`/api/admin/whatsapp/${selectedSquad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteUrl: whatsappUrl,
          groupName: whatsappGroupName
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success("WhatsApp linki güncellendi")
        setIsWhatsappDialogOpen(false)
        loadSquads()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("WhatsApp link güncelleme sırasında hata oluştu")
    }
  }

  // Yeniden atama
  const handleReassign = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/reassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Yeniden atama job'u başlatıldı")
        setTimeout(() => loadSquads(), 2000) // 2 saniye sonra yenile
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Yeniden atama sırasında hata oluştu")
    }
  }

  // Boş kadroyu sil
  const handleDeleteSquad = async (squadId: string, squadName: string) => {
    if (!confirm(`"${squadName}" adlı boş kadroyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/squads/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ squadId })
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Boş kadro başarıyla silindi")
        loadSquads()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Kadro silme sırasında hata oluştu")
    }
  }

  // Slot tıklama
  const handleSlotClick = (squad: Squad, slot: SquadSlot) => {
    if (slot.isOccupied) return // Dolu slot'a tıklanamaz

    setSelectedSquad(squad)
    setSelectedSlot(slot)
    setIsAssignDialogOpen(true)
    loadUsers()
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(8)].map((_, j) => (
                  <div key={j} className="h-3 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Kadro Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {squads.map((squad) => (
          <Card key={squad.id} className="relative bg-turf-card border-turf-border shadow-inner">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-[#111111] font-bold">⚽ {squad.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-neon-green text-black font-bold">
                    %{squad.occupancyRate}
                  </Badge>
                  {squad.occupiedSlots === 0 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSquad(squad.id, squad.name)}
                      className="h-7 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#111111]">
                <Users className="h-4 w-4" />
                {squad.occupiedSlots}/{squad.totalSlots} üye
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Slot Grid */}
              <div className="grid grid-cols-2 gap-2">
                {squad.slots.map((slot) => (
                  <div
                    key={`${slot.positionKey}-${slot.number}`}
                    className={`p-2 rounded-full border-2 text-xs cursor-pointer transition-all font-medium ${
                      slot.isOccupied
                        ? 'border-[#16a34a] bg-[#b0ffb0] text-black hover:bg-[#9fff9f]'
                        : 'border-[#16a34a]/50 bg-white text-[#16a34a] hover:bg-turf-card hover:border-[#16a34a]'
                    }`}
                    onClick={() => handleSlotClick(squad, slot)}
                  >
                    <div className="text-center font-bold text-black">#{slot.number}</div>
                    <div className="text-xs opacity-75 text-center">
                      {slot.positionKey.replace('_', ' ')}
                    </div>
                    {slot.isOccupied && slot.user && (
                      <div className="mt-1 text-xs font-medium text-center truncate text-black">
                        {slot.user.firstName}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* WhatsApp Link */}
              <div className="flex items-center justify-between pt-2 border-t border-turf-border">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-neon-green" />
                  <span className="text-sm text-[#111111]">
                    {squad.whatsappGroup ? 'WhatsApp Aktif' : 'WhatsApp Yok'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neon-green text-[#111111] hover:bg-neon-green hover:text-black font-bold"
                  onClick={() => {
                    setSelectedSquad(squad)
                    setWhatsappUrl(squad.whatsappGroup?.inviteUrl || '')
                    setWhatsappGroupName(squad.whatsappGroup?.groupName || '')
                    setIsWhatsappDialogOpen(true)
                  }}
                >
                  Düzenle
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Manuel Atama Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="bg-turf-card border-turf-border">
          <DialogHeader>
            <DialogTitle className="text-[#111111]">Kullanıcı Ata</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#111111]">Kadro</Label>
              <div className="text-sm text-[#111111]">
                {selectedSquad?.name} - #{selectedSlot?.number} {selectedSlot?.positionKey}
              </div>
            </div>
            <div>
              <Label htmlFor="user" className="text-[#111111]">Kullanıcı Seç</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Kullanıcı seçin" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.memberProfile?.mainPositionKey || 'N/A'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)} className="border-turf-border text-[#111111] hover:bg-neon-green hover:text-black">
                İptal
              </Button>
              <Button onClick={handleManualAssign} disabled={!selectedUser} className="bg-neon-green text-black hover:bg-field-green font-bold">
                Ata
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Dialog */}
      <Dialog open={isWhatsappDialogOpen} onOpenChange={setIsWhatsappDialogOpen}>
        <DialogContent className="bg-turf-card border-turf-border">
          <DialogHeader>
            <DialogTitle className="text-[#111111]">WhatsApp Grup Linki</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName" className="text-[#111111]">Grup Adı</Label>
              <Input
                id="groupName"
                value={whatsappGroupName}
                onChange={(e) => setWhatsappGroupName(e.target.value)}
                placeholder="Kadro WhatsApp Grubu"
                className="bg-white border-turf-border text-[#111111]"
              />
            </div>
            <div>
              <Label htmlFor="inviteUrl" className="text-[#111111]">Davet Linki</Label>
              <Input
                id="inviteUrl"
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="bg-white border-turf-border text-[#111111]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsWhatsappDialogOpen(false)} className="border-turf-border text-[#111111] hover:bg-neon-green hover:text-black">
                İptal
              </Button>
              <Button onClick={handleWhatsappUpdate} disabled={!whatsappUrl || !whatsappGroupName} className="bg-neon-green text-black hover:bg-field-green font-bold">
                Kaydet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
