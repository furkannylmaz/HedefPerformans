import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PrismaClient } from '@prisma/client'
import { minioClient, ensureBucketExists, getVideoUrl, getThumbnailUrl, BUCKET_NAME } from '@/lib/minio'

const prisma = new PrismaClient()

// Video yükleme şeması
const videoUploadSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().optional(),
  // videoFile: File - bu frontend'de ayrı işlenecek
})

export async function POST(request: NextRequest) {
  try {
    // TODO: Authentication kontrolü
    // Kullanıcının giriş yapmış ve ACTIVE durumda olduğunu kontrol et
    
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const videoFile = formData.get("videoFile") as File
    
    // Form validasyonu
    const validatedData = videoUploadSchema.parse({
      title,
      description
    })
    
    // Dosya kontrolü
    if (!videoFile) {
      return NextResponse.json({
        success: false,
        message: "Video dosyası gereklidir"
      }, { status: 400 })
    }
    
    // Dosya boyutu kontrolü (500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (videoFile.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: "Video dosyası çok büyük. Maksimum 500MB olmalıdır."
      }, { status: 400 })
    }
    
    // Dosya tipi kontrolü
    if (!videoFile.type.startsWith("video/")) {
      return NextResponse.json({
        success: false,
        message: "Sadece video dosyaları yüklenebilir"
      }, { status: 400 })
    }
    
    // MinIO bucket'ını kontrol et
    await ensureBucketExists()
    
    // Dosya adını oluştur
    const timestamp = Date.now()
    const fileExtension = videoFile.name.split('.').pop() || 'mp4'
    const videoFileName = `videos/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`
    const thumbnailFileName = `thumbnails/${timestamp}-${Math.random().toString(36).substring(7)}.jpg`
    
    // Dosyayı MinIO'ya yükle
    const buffer = Buffer.from(await videoFile.arrayBuffer())
    await minioClient.putObject(BUCKET_NAME, videoFileName, buffer, {
      'Content-Type': videoFile.type,
      'Content-Length': videoFile.size.toString()
    })
    
    // Geçici olarak ilk aktif kullanıcıyı al
    const user = await prisma.user.findFirst({
      where: { status: 'ACTIVE' }
    })
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı bulunamadı"
      }, { status: 404 })
    }
    
    // Video kaydını veritabanına ekle
    const video = await prisma.video.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || "",
        videoUrl: getVideoUrl(videoFileName),
        thumbnailUrl: getThumbnailUrl(thumbnailFileName),
        duration: 0, // TODO: Video süresini hesapla
        quality: videoFile.size > 100 * 1024 * 1024 ? "FHD_1080P" : "HD_720P", // Boyuta göre kalite
        viewCount: 0,
        userId: user.id
      }
    })
    
    return NextResponse.json({
      success: true,
      message: "Video başarıyla yüklendi",
      data: {
        videoId: video.id,
        videoUrl: video.videoUrl
      }
    })
    
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Form validasyon hatası",
        errors: error.errors
      }, { status: 400 })
    }
    
    console.error("Video upload error:", error)
    
    // MinIO bağlantı hatası kontrolü
    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('ECONNREFUSED')) {
      return NextResponse.json({
        success: false,
        message: "MinIO sunucusu çalışmıyor. Lütfen MinIO servisini başlatın."
      }, { status: 503 })
    }
    
    // Genel hata
    return NextResponse.json({
      success: false,
      message: error?.message || "Video yükleme sırasında bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
