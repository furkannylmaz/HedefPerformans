import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const sortBy = searchParams.get("sortBy") || "most_viewed"
    
    // Veritabanından videoları çek
    const videos = await prisma.video.findMany({
      include: {
        user: {
          include: {
            memberProfile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Formatlanmış video listesi
    const formattedVideos = videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      duration: video.duration,
      quality: video.quality,
      viewCount: video.viewCount,
      uploadDate: video.createdAt,
      user: {
        firstName: video.user.firstName,
        lastName: video.user.lastName,
        mainPosition: video.user.memberProfile?.mainPositionKey || video.user.memberProfile?.mainPosition || 'N/A'
      }
    }))
    
    // Sıralama
    let sortedVideos = [...formattedVideos]
    if (sortBy === "most_viewed") {
      sortedVideos.sort((a, b) => b.viewCount - a.viewCount)
    } else if (sortBy === "newest") {
      sortedVideos.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    }
    
    // Sayfalama
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedVideos = sortedVideos.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      data: {
        videos: paginatedVideos,
        pagination: {
          page,
          limit,
          total: formattedVideos.length,
          hasMore: endIndex < formattedVideos.length
        }
      }
    })
    
  } catch (error) {
    console.error("Videos fetch error:", error)
    return NextResponse.json({
      success: false,
      message: "Videolar yüklenirken bir hata oluştu",
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}
