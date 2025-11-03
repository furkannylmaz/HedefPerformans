import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Dosya bulunamadı" },
        { status: 400 }
      )
    }

    // Dosya boyutu kontrolü (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "Dosya çok büyük. Maksimum 10MB olmalıdır." },
        { status: 400 }
      )
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Sadece PDF, JPEG ve PNG dosyaları yüklenebilir" },
        { status: 400 }
      )
    }

    // Dosyayı oku
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Dosya adını oluştur
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'pdf'
    const fileName = `martyr-document-${timestamp}.${extension}`

    // Public klasörü oluştur (yoksa)
    const publicDir = join(process.cwd(), 'public', 'documents', 'martyr-relatives')
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    // Dosyayı kaydet
    const filePath = join(publicDir, fileName)
    await writeFile(filePath, buffer)

    // URL'i döndür
    const fileUrl = `/documents/martyr-relatives/${fileName}`

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl
      }
    })
  } catch (error) {
    console.error("Document upload error:", error)
    return NextResponse.json(
      { success: false, message: "Dosya yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

