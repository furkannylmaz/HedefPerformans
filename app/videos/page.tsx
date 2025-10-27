"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { VideoCard } from "@/components/video-card"
import { VideoCardSkeleton } from "@/components/video-skeleton"
import { 
  Play, 
  Search, 
  Filter, 
  Calendar,
  Eye,
  Clock,
  Users
} from "lucide-react"

// Video veri tipi
interface Video {
  id: string
  title: string
  description?: string
  thumbnailUrl?: string
  videoUrl: string
  duration?: number
  viewCount: number
  quality: string
  createdAt: Date
  user: {
    firstName: string
    lastName: string
    mainPosition: string
  }
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    position: "",
    sortBy: "newest"
  })

  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/videos')
        const data = await response.json()
        
        if (data.success) {
          setVideos(data.data.videos)
        }
      } catch (error) {
        console.error("Videos load error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadVideos()
  }, [])

  // Filtreleme
  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${video.user.firstName} ${video.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPosition = !filters.position || video.user.mainPosition === filters.position
    
    return matchesSearch && matchesPosition
  })

  // Sıralama
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    try {
      switch (filters.sortBy) {
        case "newest":
          const timeB = new Date(b.createdAt).getTime()
          const timeA = new Date(a.createdAt).getTime()
          if (isNaN(timeA) || isNaN(timeB)) return 0
          return timeB - timeA
        case "oldest":
          const timeA2 = new Date(a.createdAt).getTime()
          const timeB2 = new Date(b.createdAt).getTime()
          if (isNaN(timeA2) || isNaN(timeB2)) return 0
          return timeA2 - timeB2
        case "mostViewed":
          return b.viewCount - a.viewCount
        case "leastViewed":
          return a.viewCount - b.viewCount
        default:
          return 0
      }
    } catch {
      return 0
    }
  })

  // Mevki rozetleri
  const getPositionBadge = (position: string) => {
    const badges: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      KALECI: { label: "Kaleci", variant: "default" },
      SAG_DEF: { label: "Sağ Defans", variant: "secondary" },
      SOL_DEF: { label: "Sol Defans", variant: "secondary" },
      ORTA_SAHA: { label: "Orta Saha", variant: "outline" },
      FORVET: { label: "Forvet", variant: "destructive" },
      SAGBEK: { label: "Sağbek", variant: "secondary" },
      SOLBEK: { label: "Solbek", variant: "secondary" },
      STOPER: { label: "Stoper", variant: "secondary" },
      SAG_STOPER: { label: "Sağ Stoper", variant: "secondary" },
      SOL_STOPER: { label: "Sol Stoper", variant: "secondary" },
      ONLIBERO: { label: "Önlibero", variant: "secondary" },
      ORTA_8: { label: "Orta Saha 8", variant: "outline" },
      ORTA_10: { label: "Orta Saha 10", variant: "outline" },
      SAG_KANAT: { label: "Sağ Kanat", variant: "destructive" },
      SOL_KANAT: { label: "Sol Kanat", variant: "destructive" }
    }
    return badges[position] || { label: position, variant: "outline" }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Play className="h-8 w-8" />
                Üye Videoları
              </h1>
              <p className="text-muted-foreground">
                Platform üyelerinin paylaştığı eğitim videolarını izleyin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-8">
        {/* Filtreler */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtreler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium">Arama</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Video başlığı, açıklama veya üye adı..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">Mevki</label>
                <Select value={filters.position || undefined} onValueChange={(value) => setFilters(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KALECI">Kaleci</SelectItem>
                    <SelectItem value="SAG_DEF">Sağ Defans</SelectItem>
                    <SelectItem value="SOL_DEF">Sol Defans</SelectItem>
                    <SelectItem value="SAGBEK">Sağbek</SelectItem>
                    <SelectItem value="SOLBEK">Solbek</SelectItem>
                    <SelectItem value="STOPER">Stoper</SelectItem>
                    <SelectItem value="SAG_STOPER">Sağ Stoper</SelectItem>
                    <SelectItem value="SOL_STOPER">Sol Stoper</SelectItem>
                    <SelectItem value="ONLIBERO">Önlibero</SelectItem>
                    <SelectItem value="ORTA_SAHA">Orta Saha</SelectItem>
                    <SelectItem value="ORTA_8">Orta Saha 8</SelectItem>
                    <SelectItem value="ORTA_10">Orta Saha 10</SelectItem>
                    <SelectItem value="FORVET">Forvet</SelectItem>
                    <SelectItem value="SAG_KANAT">Sağ Kanat</SelectItem>
                    <SelectItem value="SOL_KANAT">Sol Kanat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="sort" className="text-sm font-medium">Sıralama</label>
                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">En Yeni</SelectItem>
                    <SelectItem value="oldest">En Eski</SelectItem>
                    <SelectItem value="mostViewed">En Çok İzlenen</SelectItem>
                    <SelectItem value="leastViewed">En Az İzlenen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Listesi */}
        <Card>
          <CardHeader>
            <CardTitle>Videolar ({sortedVideos.length})</CardTitle>
            <CardDescription>
              Toplam {videos.length} videodan {sortedVideos.length} tanesi gösteriliyor
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VideoCardSkeleton key={i} />
                ))}
              </div>
            ) : sortedVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedVideos.map((video) => {
                  const positionBadge = getPositionBadge(video.user.mainPosition)
                  
                  return (
                    <VideoCard
                      key={video.id}
                      video={{
                        id: video.id,
                        title: video.title,
                        description: video.description,
                        thumbnailUrl: video.thumbnailUrl,
                        videoUrl: video.videoUrl,
                        duration: video.duration,
                        viewCount: video.viewCount,
                        quality: video.quality,
                        createdAt: video.createdAt,
                        user: {
                          firstName: video.user.firstName,
                          lastName: video.user.lastName,
                          mainPosition: video.user.mainPosition
                        }
                      }}
                      showUserInfo={true}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchTerm || filters.position ? "Video bulunamadı" : "Henüz video yok"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || filters.position 
                    ? "Arama kriterlerinize uygun video bulunamadı. Filtreleri değiştirmeyi deneyin."
                    : "Platform üyeleri henüz video paylaşmamış."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
