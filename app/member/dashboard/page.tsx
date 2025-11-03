"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Eye, 
  Users, 
  MessageCircle, 
  Trophy, 
  Play, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  Star,
  User,
  LogOut,
  Lock
} from "lucide-react"

// Video yükleme form şeması
const videoUploadSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().optional(),
  videoFile: z.any().optional()
})

type VideoUploadForm = z.infer<typeof videoUploadSchema>

// Kadro veri tipi - Yeni sistem
interface Squad {
  id: string
  name: string
  position: string
  positionKey: string
  number: number
  memberCount: number
  maxMembers: number
  whatsappLink?: string
  whatsappGroupName?: string
}

// İstatistik veri tipi
interface Stats {
  totalViews: number
  videoCount: number
  squadPosition: string
  joinDate: string
}

export default function MemberDashboard() {
  const router = useRouter()
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  // Video yükleme formu
  const uploadForm = useForm<VideoUploadForm>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      videoFile: undefined
    }
  })

  // Kullanıcı verilerini yükle
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch('/api/user/profile')
        const data = await response.json()
        
        if (data.success) {
          // Tüm Date objelerini string'e çevir
          const sanitizeData = (obj: any): any => {
            if (obj === null || obj === undefined) return obj
            if (obj instanceof Date) return obj.toISOString()
            if (Array.isArray(obj)) return obj.map(sanitizeData)
            if (typeof obj === 'object') {
              const sanitized: any = {}
              for (const key in obj) {
                sanitized[key] = sanitizeData(obj[key])
              }
              return sanitized
            }
            return obj
          }
          
          const cleanData = sanitizeData(data.data)
          setUserData(cleanData)
        }
      } catch (error) {
        console.error("User data load error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Boş istatistikler - gerçek veriler API'den gelecek
  const stats: Stats = userData?.stats ? {
    totalViews: userData.stats.totalViews || 0,
    videoCount: userData.stats.videoCount || 0,
    squadPosition: userData.stats.squadPosition || "Henüz Atanmadı",
    joinDate: userData.stats.joinDate || ""
  } : {
    totalViews: 0,
    videoCount: 0,
    squadPosition: "Henüz Atanmadı",
    joinDate: ""
  }

  const squad: Squad = userData?.squad || {
    id: "",
    name: "Henüz Atanmadı",
    position: userData?.squad?.position || "Henüz Atanmadı",
    positionKey: userData?.squad?.positionKey || "",
    number: userData?.squad?.number || 0,
    memberCount: userData?.squad?.memberCount || 0,
    maxMembers: userData?.squad?.maxMembers || 7,
    whatsappLink: userData?.squad?.whatsappLink,
    whatsappGroupName: userData?.squad?.whatsappGroupName
  }

  // Boş video listesi - gerçek veriler API'den gelecek
  const recentVideos: any[] = userData?.recentVideos || []

  // Çıkış yap fonksiyonu
  const handleLogout = () => {
    try {
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      document.cookie = 'admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      window.location.href = '/auth'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Video yükleme
  const onVideoUpload = async (data: VideoUploadForm) => {
    // Video dosyası kontrolü
    if (!data.videoFile) {
      alert("Lütfen bir video dosyası seçin")
      return
    }
    
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description || "")
      if (data.videoFile) {
        formData.append("videoFile", data.videoFile)
      }

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        alert("Video başarıyla yüklendi!")
        setIsUploadDialogOpen(false)
        uploadForm.reset()
        // Sayfayı yenile
        window.location.reload()
      } else {
        // Daha detaylı hata mesajı
        const errorMessage = result.message || "Video yükleme sırasında bir hata oluştu"
        alert(errorMessage)
        console.error("Video upload error response:", result)
      }
    } catch (error) {
      console.error("Video yükleme hatası:", error)
      alert("Video yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsUploading(false)
    }
  }

  // API zaten Türkçe pozisyon gönderiyor, direkt kullan
  const positionBadge = { 
    label: squad.position, 
    variant: "default" as const 
  }

  // Kullanıcı durumu kontrolü
  const isPendingPayment = userData?.user?.status === "PENDING"
  const isActive = userData?.user?.status === "ACTIVE" || userData?.user?.status === "PAID"

  // Loading state - veriler yüklenene kadar göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hoş geldiniz, {userData?.user?.firstName} {userData?.user?.lastName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Hesabınızı yönetin ve içeriklerinizi paylaşın.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Hesabım Butonu */}
          <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="default" className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2">
                <User className="h-5 w-5" />
                <span>Hesabım</span>
              </Button>
            </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Hesap Bilgilerim
                    </DialogTitle>
                    <DialogDescription>
                      Hesap bilgilerinizi görüntüleyin (Salt okunur)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm font-medium">E-posta:</span>
                      <span className="text-sm text-muted-foreground">{userData?.user?.email || 'Yükleniyor...'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm font-medium">Ad Soyad:</span>
                      <span className="text-sm text-muted-foreground">{userData?.user?.firstName} {userData?.user?.lastName}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm font-medium">Telefon:</span>
                      <span className="text-sm text-muted-foreground">{userData?.user?.phone || 'Yok'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm font-medium">Kadro:</span>
                      <Badge>{squad.name}</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">Pozisyon:</span>
                      <Badge>{squad.position}</Badge>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
      </div>

      {/* Ana İçerik */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon - İstatistikler ve Video Yükleme */}
          <div className="lg:col-span-2 space-y-6">
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Toplam İzlenme</CardTitle>
                  <Eye className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">
                    Toplam izlenme
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Video Sayısı</CardTitle>
                  <Play className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.videoCount}</div>
                  <p className="text-xs text-gray-600">
                    Aktif videolar
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Video Yükleme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Video Yükle
                </CardTitle>
                <CardDescription>
                  {isPendingPayment 
                    ? "Ödeme onayı sonrası video yükleme aktif olacak"
                    : "Yeni bir eğitim videosu paylaşın ve diğer üyelerle deneyimlerinizi paylaşın."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPendingPayment ? (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full bg-primary/10 border-4 border-primary/20 animate-spin" style={{ 
                          borderTopColor: 'currentColor',
                          borderRightColor: 'currentColor',
                          borderBottomColor: 'transparent',
                          borderLeftColor: 'transparent'
                        }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ödemeniz onaylandıktan sonra video yükleme özelliği aktif olacak
                    </p>
                  </div>
                ) : (
                  <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Yeni Video Yükle
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Video Yükle</DialogTitle>
                      <DialogDescription>
                        Video dosyanızı seçin ve bilgilerini girin.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={uploadForm.handleSubmit(onVideoUpload)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Başlık</Label>
                        <Input
                          id="title"
                          placeholder="Video başlığı"
                          {...uploadForm.register("title")}
                        />
                        {uploadForm.formState.errors.title && (
                          <p className="text-sm text-destructive">
                            {uploadForm.formState.errors.title.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
                        <Textarea
                          id="description"
                          placeholder="Video açıklaması"
                          {...uploadForm.register("description")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="videoFile">Video Dosyası</Label>
                        <Input
                          id="videoFile"
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              uploadForm.setValue("videoFile", file)
                            }
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          Maksimum dosya boyutu: 500MB
                        </p>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsUploadDialogOpen(false)}
                        >
                          İptal
                        </Button>
                        <Button type="submit" disabled={isUploading}>
                          {isUploading ? "Yükleniyor..." : "Yükle"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                )}
              </CardContent>
            </Card>

            {/* Son Videolar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Son Videolarım
                </CardTitle>
                <CardDescription>
                  Paylaştığınız videoların performansı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVideos.length > 0 ? (
                    recentVideos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{video.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {video.viewCount.toLocaleString()} izlenme
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {video.uploadDate || "Tarih yok"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Play className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Henüz video paylaşmadınız
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Kolon - Kadro Bilgisi ve WhatsApp */}
          <div className="space-y-6">
            {/* Kadro Bilgisi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kadro Bilgisi
                </CardTitle>
                <CardDescription>
                  Atandığınız kadro ve pozisyon bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPendingPayment ? (
                  <div className="text-center py-6">
                    <div className="relative inline-flex">
                      {/* Dönen simge */}
                      <div className="h-16 w-16 rounded-full bg-primary/10 border-4 border-primary/20 animate-spin">
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold mt-4 text-foreground">
                      Ödemeniz Gerçekleştiğinde Kadroya Atanacaksınız
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Havale/EFT ödemeniz onaylandıktan sonra (1-2 iş günü) 
                      otomatik olarak kadronuza atanacaksınız.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Atandığınız Mevki:</span>
                      <Badge variant="default">
                        {squad.position}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Forma Numarası:</span>
                      <Badge variant="outline">
                        #{squad.number}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Kadro:</span>
                      <span className="text-sm text-muted-foreground">
                        {squad.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Üye Sayısı:</span>
                      <span className="text-sm text-muted-foreground">
                        {squad.memberCount}/{squad.maxMembers}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Katılım Tarihi:</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.joinDate ? stats.joinDate.substring(0, 10) : "Tarih yok"}
                      </span>
                    </div>

                    {/* Kadro İlerleme Çubuğu */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Kadro Doluluk</span>
                        <span>{squad.memberCount > 0 ? Math.round((squad.memberCount / squad.maxMembers) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${squad.memberCount > 0 ? (squad.memberCount / squad.maxMembers) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* WhatsApp Grubu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Grubu
                </CardTitle>
                <CardDescription>
                  Kadronuzla iletişim kurun
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPendingPayment ? (
                  <div className="text-center py-4">
                    <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Ödeme onayından sonra WhatsApp grubu aktif olacak
                    </p>
                  </div>
                ) : squad.whatsappLink ? (
                  <div className="space-y-4">
                    <div className="text-sm">
                      <p className="font-medium">{squad.whatsappGroupName || "Kadro WhatsApp Grubu"}</p>
                      <p className="text-muted-foreground">
                        Kadronuzla iletişim kurun ve antrenmanları koordine edin.
                      </p>
                    </div>
                    <Button asChild className="w-full">
                      <a 
                        href={squad.whatsappLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp Grubuna Katıl
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      WhatsApp grubu henüz oluşturulmamış
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Admin tarafından grup linki eklenecek
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hızlı Erişim */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Hızlı Erişim
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/videos">
                      <Eye className="h-4 w-4 mr-2" />
                      Tüm Videolar
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/member/squads">
                      <Users className="h-4 w-4 mr-2" />
                      Kadroları Görüntüle
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/matches">
                      <Trophy className="h-4 w-4 mr-2" />
                      Maç Analizleri
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
