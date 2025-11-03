import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { minioClient, BUCKET_NAME } from '@/lib/minio'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id

    // Video kaydını bul
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { videoUrl: true }
    })

    if (!video || !video.videoUrl) {
      return NextResponse.json(
        { success: false, message: 'Video bulunamadı' },
        { status: 404 }
      )
    }

    // MinIO URL'inden object name'i çıkar
    // Format: http://localhost:9002/hedef-performans-videos/videos/...
    let objectName = ''
    try {
      const url = new URL(video.videoUrl)
      // Pathname'den bucket name'i kaldır: /hedef-performans-videos/videos/filename.mp4 -> videos/filename.mp4
      objectName = url.pathname.startsWith(`/${BUCKET_NAME}/`)
        ? url.pathname.replace(`/${BUCKET_NAME}/`, '')
        : url.pathname.replace(/^\//, '')
    } catch (error) {
      // URL parse edilemezse, direkt object name olarak kullan
      console.warn('[VIDEO-STREAM] URL parse hatası, direkt object name kullanılıyor:', video.videoUrl)
      objectName = video.videoUrl.replace(`http://localhost:9002/${BUCKET_NAME}/`, '')
        .replace(`http://localhost:9002/`, '')
    }
    
    if (!objectName || objectName.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Video object name bulunamadı', videoUrl: video.videoUrl },
        { status: 400 }
      )
    }
    
    console.log('[VIDEO-STREAM] Video ID:', videoId, 'Object Name:', objectName)

    try {
      // MinIO'dan video stream al
      const dataStream = await minioClient.getObject(BUCKET_NAME, objectName)
      
      // Content-Type belirle (varsayılan mp4)
      const contentType = 'video/mp4'
      
      // Buffer'a dönüştür (basit yöntem)
      const chunks: Buffer[] = []
      for await (const chunk of dataStream) {
        chunks.push(Buffer.from(chunk))
      }
      const videoBuffer = Buffer.concat(chunks)
      
      // Range header kontrolü (video seeking için)
      const range = request.headers.get('range')
      
      if (range) {
        // Range isteği varsa (video seeking)
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : videoBuffer.length - 1
        const chunksize = end - start + 1
        const chunk = videoBuffer.slice(start, end + 1)
        
        return new NextResponse(chunk, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${videoBuffer.length}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize.toString(),
            'Content-Type': contentType,
          },
        })
      }
      
      // Tam video döndür
      return new NextResponse(videoBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': videoBuffer.length.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch (minioError) {
      console.error('[VIDEO-STREAM] MinIO error:', minioError)
      return NextResponse.json(
        { success: false, message: 'Video stream hatası', error: minioError instanceof Error ? minioError.message : 'Bilinmeyen hata' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[VIDEO-STREAM] Error:', error)
    return NextResponse.json(
      { success: false, message: 'Video yüklenirken hata oluştu', error: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    )
  }
}

