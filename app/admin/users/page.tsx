"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Search, 
  Download, 
  Filter,
  RefreshCw,
  CheckCircle,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import * as XLSX from 'xlsx'

// Quick links navigation
function AdminQuickLinks() {
  return (
    <div className="mb-6 overflow-x-auto scroll-smooth">
      <div className="flex gap-2 min-w-max">
        <Button asChild variant="default" size="sm" className="bg-neon-green text-black hover:bg-field-green font-bold">
          <Link href="/admin/users">Kullanıcı Yönetimi</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-neon-green text-[#111111] hover:bg-neon-green hover:text-black">
          <Link href="/admin/squads">Kadro Yönetimi</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-neon-green text-[#111111] hover:bg-neon-green hover:text-black">
          <Link href="/admin/sliders">Slider Yönetimi</Link>
        </Button>
      </div>
    </div>
  )
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  mainPosition: string
  altPosition: string | null
  squadInfo: string
  age: number
  city: string
  paymentStatus: "PAID" | "PENDING" | "FAILED"
  paymentAmount: number
  joinDate: Date
  status: "ACTIVE" | "PENDING" | "SUSPENDED"
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    position: "",
    paymentStatus: "",
    ageRange: "",
    city: ""
  })

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filters.position) params.append('position', filters.position)
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus)
      if (filters.city) params.append('city', filters.city)
      if (filters.ageRange) params.append('ageRange', filters.ageRange)
      
      const response = await fetch(`/api/users?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data.users)
      }
    } catch (error) {
      console.error("Users load error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReassign = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/reassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Kadro ataması yeniden yapıldı')
        loadUsers()
      } else {
        toast.error(data.message || 'Kadro ataması başarısız oldu')
      }
    } catch (error) {
      console.error('Reassign error:', error)
      toast.error('Kadro ataması sırasında bir hata oluştu')
    }
  }

  const handleApprovePayment = async (userId: string) => {
    if (!confirm('Bu kullanıcının ödemesini onaylamak istediğinizden emin misiniz? Sistem otomatik olarak kullanıcıyı kadroya atayacaktır.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/users/approve-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Ödeme onaylandı ve kadro ataması başlatıldı')
        loadUsers()
      } else {
        toast.error(data.message || 'Ödeme onayı başarısız oldu')
      }
    } catch (error) {
      console.error('Approve payment error:', error)
      toast.error('Ödeme onayı sırasında bir hata oluştu')
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`"${userName}" kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Kullanıcı başarıyla silindi')
        loadUsers()
      } else {
        toast.error(data.message || 'Kullanıcı silme başarısız oldu')
      }
    } catch (error) {
      console.error('Delete user error:', error)
      toast.error('Kullanıcı silinirken bir hata oluştu')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [searchTerm, filters])

  const filteredUsers = users

  const getPositionBadge = (position: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      KALECI: { label: "Kaleci", className: "bg-white text-gray-900 border" },
      SAG_DEF: { label: "Sağ Defans", className: "bg-sky-600 text-white" },
      SOL_DEF: { label: "Sol Defans", className: "bg-sky-600 text-white" },
      ORTA_SAHA: { label: "Orta Saha", className: "bg-amber-400 text-black" },
      FORVET: { label: "Forvet", className: "bg-red-600 text-white" },
      SAGBEK: { label: "Sağbek", className: "bg-sky-600 text-white" },
      SOLBEK: { label: "Solbek", className: "bg-sky-600 text-white" },
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

  const getPaymentBadge = (status: string) => {
    const badges = {
      PAID: { label: "Ödendi", variant: "default" as const },
      PENDING: { label: "Beklemede", variant: "secondary" as const },
      FAILED: { label: "Başarısız", variant: "destructive" as const }
    }
    return badges[status as keyof typeof badges] || { label: status, variant: "outline" as const }
  }

  const handleExport = async () => {
    try {
      // Filtrelenmiş veriyi al (API'den)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filters.position) params.append('position', filters.position)
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus)
      if (filters.city) params.append('city', filters.city)
      if (filters.ageRange) params.append('ageRange', filters.ageRange)
      
      const response = await fetch(`/api/users?${params.toString()}`)
      const data = await response.json()
      
      if (!data.success || !data.data.users || data.data.users.length === 0) {
        toast.error('Export edilecek kullanıcı bulunamadı')
        return
      }

      // Pozisyon map
      const positionMap: { [key: string]: string } = {
        'KALECI': 'Kaleci',
        'SAG_DEF': 'Sağ Defans',
        'SOL_DEF': 'Sol Defans',
        'SAGBEK': 'Sağbek',
        'SOLBEK': 'Solbek',
        'STOPER': 'Stoper',
        'SAG_STOPER': 'Sağ Stoper',
        'SOL_STOPER': 'Sol Stoper',
        'ONLIBERO': 'Önlibero',
        'ORTA': 'Orta Saha',
        'ORTA_8': 'Orta Saha (8)',
        'ORTA_10': 'Orta Saha (10)',
        'ORTA_SAHA': 'Orta Saha',
        'FORVET': 'Forvet',
        'SAG_KANAT': 'Sağ Kanat',
        'SOL_KANAT': 'Sol Kanat'
      }

      // Excel başlıkları
      const headers = [
        'Ad',
        'Soyad',
        'E-posta',
        'Telefon',
        'Ana Mevki',
        'Yedek Mevki',
        'Kadro',
        'Yaş',
        'Şehir',
        'Ödeme Durumu',
        'Durum',
        'Kayıt Tarihi'
      ]

      // Excel verileri
      const rows = data.data.users.map((user: User) => [
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        positionMap[user.mainPosition] || user.mainPosition,
        user.altPosition ? (positionMap[user.altPosition] || user.altPosition) : '-',
        user.squadInfo || '-',
        user.age.toString(),
        user.city,
        user.paymentStatus === 'PAID' ? 'Ödendi' : user.paymentStatus === 'PENDING' ? 'Beklemede' : 'Başarısız',
        user.status === 'PAID' || user.status === 'ACTIVE' ? 'Aktif' : user.status === 'PENDING' ? 'Beklemede' : 'Askıya Alındı',
        new Date(user.joinDate).toLocaleDateString('tr-TR')
      ])

      // Worksheet oluştur
      const worksheetData = [headers, ...rows]
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

      // Kolon genişliklerini ayarla
      worksheet['!cols'] = [
        { wch: 15 }, // Ad
        { wch: 15 }, // Soyad
        { wch: 25 }, // E-posta
        { wch: 15 }, // Telefon
        { wch: 15 }, // Ana Mevki
        { wch: 15 }, // Yedek Mevki
        { wch: 20 }, // Kadro
        { wch: 5 },  // Yaş
        { wch: 15 }, // Şehir
        { wch: 12 }, // Ödeme Durumu
        { wch: 10 }, // Durum
        { wch: 12 }  // Kayıt Tarihi
      ]

      // Workbook oluştur
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Kullanıcılar')

      // Dosya adı (tarih ve filtre bazlı)
      const dateStr = new Date().toISOString().slice(0, 10)
      let fileName = `hedef-performans-kullanicilar-${dateStr}.xlsx`
      
      // Filtre bilgisi ekle
      const filterParts = []
      if (searchTerm) filterParts.push('arama')
      if (filters.position) filterParts.push('mevki')
      if (filters.paymentStatus) filterParts.push('odeme')
      if (filters.city) filterParts.push('sehir')
      if (filters.ageRange) filterParts.push('yas')
      
      if (filterParts.length > 0) {
        fileName = `hedef-performans-kullanicilar-filtreli-${filterParts.join('-')}-${dateStr}.xlsx`
      }

      // Excel dosyasını indir
      XLSX.writeFile(workbook, fileName)

      toast.success(`${data.data.users.length} kullanıcı başarıyla Excel dosyası olarak export edildi`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export sırasında bir hata oluştu')
    }
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
                Kullanıcı Yönetimi
              </h1>
              <p className="text-[#111111]">
                Platform üyelerini yönetin ve ödeme durumlarını takip edin.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={handleExport} variant="outline" className="border-neon-green text-[#111111] hover:bg-neon-green hover:text-black font-bold">
                <Download className="h-4 w-4 mr-2" />
                Excel Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Links */}
        <div className="mb-6">
          <AdminQuickLinks />
        </div>

        {/* Filtreler */}
        <Card className="mb-6 bg-turf-card border-turf-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#111111]">
              <Filter className="h-5 w-5" />
              Filtreler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Arama</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Ad, soyad veya e-posta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Mevki</Label>
                <Select value={filters.position || undefined} onValueChange={(value) => setFilters(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KALECI">Kaleci</SelectItem>
                    <SelectItem value="SAG_DEF">Sağ Defans</SelectItem>
                    <SelectItem value="SOL_DEF">Sol Defans</SelectItem>
                    <SelectItem value="ORTA_SAHA">Orta Saha</SelectItem>
                    <SelectItem value="FORVET">Forvet</SelectItem>
                    <SelectItem value="SAGBEK">Sağbek</SelectItem>
                    <SelectItem value="SOLBEK">Solbek</SelectItem>
                    <SelectItem value="SAG_STOPER">Sağ Stoper</SelectItem>
                    <SelectItem value="SOL_STOPER">Sol Stoper</SelectItem>
                    <SelectItem value="ONLIBERO">Önlibero</SelectItem>
                    <SelectItem value="ORTA_8">Orta Saha 8</SelectItem>
                    <SelectItem value="ORTA_10">Orta Saha 10</SelectItem>
                    <SelectItem value="SAG_KANAT">Sağ Kanat</SelectItem>
                    <SelectItem value="SOL_KANAT">Sol Kanat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Ödeme Durumu</Label>
                <Select value={filters.paymentStatus || undefined} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAID">Ödendi</SelectItem>
                    <SelectItem value="PENDING">Beklemede</SelectItem>
                    <SelectItem value="FAILED">Başarısız</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Şehir</Label>
                <Input
                  id="city"
                  placeholder="Şehir ara..."
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ageRange">Yaş</Label>
                <Select value={filters.ageRange || undefined} onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 yaş</SelectItem>
                    <SelectItem value="8">8 yaş</SelectItem>
                    <SelectItem value="9">9 yaş</SelectItem>
                    <SelectItem value="10">10 yaş</SelectItem>
                    <SelectItem value="11">11 yaş</SelectItem>
                    <SelectItem value="12">12 yaş</SelectItem>
                    <SelectItem value="13">13 yaş</SelectItem>
                    <SelectItem value="14">14 yaş</SelectItem>
                    <SelectItem value="15">15 yaş</SelectItem>
                    <SelectItem value="16">16 yaş</SelectItem>
                    <SelectItem value="17">17 yaş</SelectItem>
                    <SelectItem value="18">18 yaş</SelectItem>
                    <SelectItem value="19">19 yaş</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kullanıcı Listesi */}
        <Card className="bg-turf-card border-turf-border">
          <CardHeader>
            <CardTitle className="text-[#111111]">Kullanıcılar ({filteredUsers.length})</CardTitle>
            <CardDescription className="text-[#111111]">
              Toplam {users.length} kullanıcıdan {filteredUsers.length} tanesi gösteriliyor
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-green mx-auto"></div>
                <p className="text-[#111111] mt-2">Kullanıcılar yükleniyor...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-turf-border">
                      <th className="text-left p-3 font-medium text-[#111111]">Kullanıcı</th>
                      <th className="text-left p-3 font-medium text-[#111111]">İletişim</th>
                      <th className="text-left p-3 font-medium text-[#111111]">Mevki</th>
                      <th className="text-left p-3 font-medium text-[#111111]">Yedek Mevki</th>
                      <th className="text-left p-3 font-medium text-[#111111]">Kadro</th>
                      <th className="text-left p-3 font-medium text-[#111111]">Yaş</th>
                      <th className="text-left p-3 font-medium text-[#111111]">Konum</th>
                      <th className="text-left p-3 font-medium text-[#111111]">Durum</th>
                      <th className="text-left p-3 font-medium text-[#111111]">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const positionBadge = getPositionBadge(user.mainPosition)
                      const paymentBadge = getPaymentBadge(user.paymentStatus)
                      
                      return (
                        <tr key={user.id} className="border-b border-turf-border hover:bg-turf-card">
                          <td className="p-3">
                            <div>
                              <div className="font-medium text-[#111111]">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-[#111111]">{user.phone}</div>
                          </td>
                          <td className="p-3">
                            <Badge className={positionBadge.className}>
                              {positionBadge.label}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {user.altPosition ? (
                              <Badge className={getPositionBadge(user.altPosition).className}>
                                {getPositionBadge(user.altPosition).label}
                              </Badge>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            {user.squadInfo === '-' || user.squadInfo === 'Henüz Atanmadı' ? (
                              <Badge variant="destructive" className="bg-error-red text-white">
                                Atama Yok
                              </Badge>
                            ) : (
                              <div className="text-sm font-medium text-[#111111]">{user.squadInfo}</div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-[#111111]">{user.age}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-[#111111]">{user.city}</div>
                          </td>
                          <td className="p-3">
                            <Badge className="bg-neon-green text-black">{user.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {user.paymentStatus === "PENDING" && (
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  onClick={() => handleApprovePayment(user.id)}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Ödemeyi Onayla
                                </Button>
                              )}
                              {user.squadInfo === '-' || user.squadInfo === 'Henüz Atanmadı' ? (
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  onClick={() => handleReassign(user.id)}
                                  className="bg-neon-green text-black hover:bg-field-green"
                                >
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Yeniden Ata
                                </Button>
                              ) : null}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                                className="border-red-500 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Sil
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
