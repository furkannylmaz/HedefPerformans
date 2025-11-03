import { NextResponse } from 'next/server'
import { minioClient, BUCKET_NAME, ensureBucketExists } from '@/lib/minio'

export async function GET() {
  try {
    // Bucket'ın var olduğundan emin ol
    await ensureBucketExists()
    
    // Bucket'ı listele
    const exists = await minioClient.bucketExists(BUCKET_NAME)
    
    if (!exists) {
      return NextResponse.json({
        success: false,
        message: `Bucket '${BUCKET_NAME}' bulunamadı`
      }, { status: 404 })
    }
    
    // Bucket içindeki object'leri listele
    const objects: string[] = []
    const stream = minioClient.listObjects(BUCKET_NAME, '', true)
    
    for await (const obj of stream) {
      if (obj.name) {
        objects.push(obj.name)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'MinIO bağlantısı başarılı',
      data: {
        bucket: BUCKET_NAME,
        objectCount: objects.length,
        objects: objects.slice(0, 10) // İlk 10 object'i göster
      }
    })
  } catch (error) {
    console.error('[MINIO-TEST] Error:', error)
    return NextResponse.json({
      success: false,
      message: 'MinIO bağlantı hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

