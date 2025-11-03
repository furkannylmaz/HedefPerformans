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
  Trophy, 
  Search, 
  Filter, 
  Calendar,
  Eye,
  Clock,
  Star
} from "lucide-react"

// Maç analizi veri tipi
interface AdminMatch {
  id: string
  title: string
  description?: string
  thumbnailUrl?: string
  videoUrl: string
  duration?: number
  viewCount: number
  quality: string
  createdAt: Date
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<AdminMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    sortBy: "newest"
  })

  useEffect(() => {
    const loadMatches = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/matches')
        const data = await response.json()
        
        if (data.success) {
          setMatches(data.data.matches)
        }
      } catch (error) {
        console.error("Matches load error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMatches()
  }, [])

  // Filtreleme
  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  // Sıralama
  const sortedMatches = [...filteredMatches].sort((a, b) => {
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <Trophy className="h-8 w-8 text-red-600" />
          Maç Analizleri
        </h1>
        <p className="text-gray-600">
          Profesyonel maç analizleri ve teknik incelemeler.
        </p>
      </div>

      {/* Filtreler */}
      <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtreler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium">Arama</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Maç analizi başlığı veya açıklama..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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

      {/* Maç Analizi Listesi */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Maç Analizleri ({sortedMatches.length})</CardTitle>
          <CardDescription className="text-gray-600">
            Toplam {matches.length} analizden {sortedMatches.length} tanesi gösteriliyor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : sortedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMatches.map((match) => (
                <VideoCard
                  key={match.id}
                  video={{
                    id: match.id,
                    title: match.title,
                    description: match.description,
                    thumbnailUrl: match.thumbnailUrl,
                    videoUrl: match.videoUrl,
                    duration: match.duration,
                    viewCount: match.viewCount,
                    quality: (match.quality === 'FHD_1080P' || match.quality === 'HD_720P') ? match.quality : 'HD_720P',
                    createdAt: match.createdAt,
                    user: {
                      firstName: "Admin",
                      lastName: "Analiz",
                      mainPosition: "COACH"
                    }
                  }}
                  showUserInfo={false}
                  isAdminContent={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "Maç analizi bulunamadı" : "Henüz maç analizi yok"}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? "Arama kriterlerinize uygun maç analizi bulunamadı. Filtreleri değiştirmeyi deneyin."
                  : "Henüz profesyonel maç analizi paylaşılmamış."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
