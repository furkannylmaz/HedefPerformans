"use client"

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
    uploadDate: Date
    user: {
      firstName: string
      lastName: string
      mainPosition: string
    }
  }
}

export function VideoPlayerModal({ isOpen, onClose, video }: VideoPlayerModalProps) {
  const formatDate = (date: Date) => {
    try {
      return new Date(date).toLocaleDateString("tr-TR")
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
          <div className="aspect-video w-full">
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
              preload="metadata"
            >
              Tarayıcınız video etiketini desteklemiyor.
            </video>
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
              <span>{formatDate(video.uploadDate)}</span>
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
