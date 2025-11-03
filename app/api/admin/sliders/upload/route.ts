import { NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary"
import { validateEnvironmentVariables, logEnvironmentStatus } from "@/lib/env-validator"

// Dynamic route - build-time execution'ı önle
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('[Upload] Request received')
  
  try {
    // Environment variables kontrolü
    logEnvironmentStatus()
    const envCheck = validateEnvironmentVariables()
    
    if (!envCheck.isValid) {
      console.error('[Upload] Missing environment variables:', envCheck.missing)
      return NextResponse.json(
        { 
          success: false, 
          message: "Sunucu yapılandırma hatası. Lütfen yöneticiye bildirin.",
          error: process.env.NODE_ENV === 'development' 
            ? `Missing: ${envCheck.missing.join(', ')}` 
            : undefined
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error('[Upload] No file provided')
      return NextResponse.json(
        { success: false, message: "Dosya bulunamadı" },
        { status: 400 }
      )
    }

    console.log('[Upload] File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.error('[Upload] File too large:', file.size)
      return NextResponse.json(
        { success: false, message: "Dosya çok büyük. Maksimum 5MB olmalıdır." },
        { status: 400 }
      )
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.error('[Upload] Invalid file type:', file.type)
      return NextResponse.json(
        { success: false, message: "Sadece görsel dosyaları (JPEG, PNG, GIF, WebP) yüklenebilir" },
        { status: 400 }
      )
    }

    // Cloudinary'e yükle
    console.log('[Upload] Uploading to Cloudinary...')
    const uploadResult = await uploadImage(file, 'hedef-performans/sliders', {
      resourceType: 'image'
    })

    console.log('[Upload] Upload successful:', uploadResult.url)

    return NextResponse.json({
      success: true,
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height
      }
    })
  } catch (error) {
    console.error('[Upload Error]', error)
    
    // Detaylı error logging
    if (error instanceof Error) {
      console.error('[Upload Error] Message:', error.message)
      console.error('[Upload Error] Stack:', error.stack)
      
      // Cloudinary configuration error
      if (error.message.includes('Cloudinary')) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Görsel yükleme servisi yapılandırılmamış. Lütfen yöneticiye bildirin.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Fotoğraf yükleme sırasında bir hata oluştu",
        error: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined
      },
      { status: 500 }
    )
  }
}

