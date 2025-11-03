"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  video: {
    id: string
    title: string
    description?: string
    videoUrl: string
    thumbnailUrl?: string
    duration?: number
    quality: string
    viewCount: number
    createdAt?: Date | string
    uploadDate?: Date | string
    user: {
      firstName: string
      lastName: string
      mainPosition: string
    }
  }
}

export function VideoPlayerModal({ isOpen, onClose, video }: VideoPlayerModalProps) {
  const [videoSrc, setVideoSrc] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && video.videoUrl) {
      // MinIO URL'i ise proxy üzerinden stream et
      if (video.videoUrl.includes('localhost:9002') || video.videoUrl.includes('minio')) {
        setVideoSrc(`/api/videos/${video.id}/stream`)
      } else {
        // Diğer URL'ler (external, YouTube vb.) doğrudan kullan
        setVideoSrc(video.videoUrl)
      }
      setLoading(false)
      setError(null)
    } else if (isOpen) {
      setError('Video URL\'i bulunamadı')
      setLoading(false)
    }
  }, [isOpen, video.videoUrl, video.id])

  const formatDate = (date?: Date | string) => {
    if (!date) return "Tarih bilinmiyor"
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return "Tarih bilinmiyor"
      return dateObj.toLocaleDateString("tr-TR")
    } catch {
      return "Tarih bilinmiyor"
    }
  }

  // Pozisyon çevirisi
  const positionMap: { [key: string]: string } = {
    'GOALKEEPER': 'Kaleci',
    'DEFENDER': 'Defans',
    'MIDFIELDER': 'Orta Saha',
    'FORWARD': 'Forvet',
    'WINGER': 'Kanat'
  }

  const getPositionText = (position: string) => {
    return positionMap[position] || position
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] w-full h-auto max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-semibold">{video.title}</DialogTitle>
        </DialogHeader>
        
        {/* Video Player - Proper aspect ratio */}
        <div className="relative w-full bg-black">
          <div className="aspect-video w-full flex items-center justify-center">
            {loading ? (
              <div className="text-white p-8 text-center">
                <p className="text-lg mb-2">Video yükleniyor...</p>
              </div>
            ) : error ? (
              <div className="text-white p-8 text-center">
                <p className="text-lg mb-2 text-red-400">Hata: {error}</p>
                <p className="text-sm text-gray-400">Video URL: {video.videoUrl}</p>
              </div>
            ) : videoSrc ? (
              <video
                key={video.id}
                src={videoSrc}
                controls
                autoPlay
                className="w-full h-full object-contain"
                preload="auto"
                playsInline
                onError={(e) => {
                  console.error("Video yükleme hatası:", e)
                  const target = e.target as HTMLVideoElement
                  if (target) {
                    setError(`Video yüklenemedi. HTTP Status: ${target.error?.code || 'Unknown'}`)
                    console.error("Video error details:", {
                      networkState: target.networkState,
                      readyState: target.readyState,
                      error: target.error,
                      src: videoSrc,
                      originalUrl: video.videoUrl
                    })
                  }
                }}
                onLoadStart={() => {
                  console.log("Video yüklemeye başladı:", videoSrc)
                }}
                onCanPlay={() => {
                  console.log("Video oynatılabilir durumda")
                  setError(null)
                }}
              >
                Tarayıcınız video etiketini desteklemiyor.
              </video>
            ) : (
              <div className="text-white p-8 text-center">
                <p className="text-lg mb-2">Video hazırlanıyor...</p>
                <p className="text-sm text-gray-400">Video URL'i henüz mevcut değil.</p>
                <p className="text-xs text-gray-500 mt-2">Original URL: {video.videoUrl}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Video Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Yükleyen: {video.user.firstName} {video.user.lastName} ({getPositionText(video.user.mainPosition)})
            </span>
            <div className="flex items-center gap-2">
              <span>{video.viewCount} izlenme</span>
              <span>•</span>
              <span>{formatDate(video.uploadDate || video.createdAt)}</span>
              <span>•</span>
              <span>{video.quality === "FHD_1080P" ? "1080p" : "720p"}</span>
            </div>
          </div>
          {video.description && (
            <p className="text-sm text-muted-foreground">{video.description}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
