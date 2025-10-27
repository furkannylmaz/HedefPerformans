import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PrismaClient } from '@prisma/client'
import { minioClient, ensureBucketExists, getVideoUrl, getThumbnailUrl, BUCKET_NAME } from '@/lib/minio'

const prisma = new PrismaClient()

// Video yükleme şeması
const videoUploadSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
  console.log("📹 [VIDEO-UPLOAD] Request received")
  
  try {
    // Authentication: Cookie'den kullanıcı bilgisini al
    const authTokenCookie = request.cookies.get('auth_token')
    
    if (!authTokenCookie) {
      return NextResponse.json({
        success: false,
        message: "Oturum açmanız gerekiyor"
      }, { status: 401 })
    }

    let userId: string
    try {
      const decoded = JSON.parse(authTokenCookie.value)
      userId = decoded.userId
      console.log("📹 [VIDEO-UPLOAD] User ID from cookie:", userId)
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "Geçersiz oturum"
      }, { status: 401 })
    }

    // Kullanıcıyı kontrol et
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı bulunamadı"
      }, { status: 404 })
    }

    console.log("📹 [VIDEO-UPLOAD] User status:", user.status)

    // Sadece PAID ve ACTIVE kullanıcılar video yükleyebilir
    // PENDING kullanıcılar ödeme onayı bekledikleri için video yükleyemez
    if (user.status !== 'PAID' && user.status !== 'ACTIVE') {
      return NextResponse.json({
        success: false,
        message: "Ödeme işleminizi tamamlayın. Hesabınız onaylanınca video yükleyebilirsiniz."
      }, { status: 403 })
    }

    console.log("📹 [VIDEO-UPLOAD] Processing request for user:", userId)
    
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
        userId: userId
      }
    })
    
    console.log("📹 [VIDEO-UPLOAD] Video created:", video.id)
    
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

