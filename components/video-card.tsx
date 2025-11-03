"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { VideoPlayerModal } from "./video-player-modal"

// Video kartı bileşeni - hem üye videoları hem admin maçları için
interface VideoCardProps {
  video: {
    id: string
    title: string
    description?: string
    thumbnailUrl?: string
    videoUrl: string
    duration?: number
    quality: "HD_720P" | "FHD_1080P"
    viewCount: number
    createdAt: Date | string
    user: {
      firstName: string
      lastName: string
      mainPosition: string
    }
  }
  showUserInfo?: boolean
  isAdminContent?: boolean
  className?: string
}

export function VideoCard({
  video,
  showUserInfo = true,
  isAdminContent = false,
  className
}: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleVideoClick = () => {
    if (video.videoUrl && video.videoUrl.trim() !== '' && !video.videoUrl.startsWith('temp-')) {
      setIsModalOpen(true)
    } else {
      alert('Video henüz hazır değil. Video URL\'i mevcut değil.')
    }
  }
  const formatDuration = (seconds?: number) => {
    if (!seconds) return ""
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return "Tarih yok"
      return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(dateObj)
    } catch {
      return "Tarih yok"
    }
  }

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <>
      <div className={cn("group cursor-pointer", className)} onClick={handleVideoClick}>
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {video.thumbnailUrl && !video.thumbnailUrl.startsWith('temp-') ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-primary text-4xl mb-2">▶</div>
                <div className="text-primary font-medium text-sm">{video.title}</div>
              </div>
            </div>
          )}
          
          {/* Kalite etiketi */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.quality === "FHD_1080P" ? "1080p" : "720p"}
          </div>
          
          {/* Süre */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
          
          {/* Admin içerik etiketi */}
          {isAdminContent && (
            <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
              Admin
            </div>
          )}
        </div>
        
        <div className="mt-3 space-y-1">
          <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          
          {video.description && (
            <p className="text-xs text-muted-foreground">
              {video.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {showUserInfo ? (
              <span>{video.user.firstName} {video.user.lastName}</span>
            ) : (
              <span>Admin Analiz</span>
            )}
            <div className="flex items-center gap-2">
              <span>{formatViewCount(video.viewCount)} izlenme</span>
              <span>•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        video={video}
      />
    </>
  )
}
