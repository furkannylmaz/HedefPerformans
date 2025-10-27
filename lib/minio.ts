import { Client } from 'minio'

// MinIO client konfigürasyonu
export const minioClient = new Client({
  endPoint: 'localhost',
  port: 9002,
  useSSL: false, // Development için false
  accessKey: 'minioadmin',
  secretKey: 'minioadmin123',
})

// Bucket adı
export const BUCKET_NAME = 'hedef-performans-videos'

// Bucket'ı oluştur (yoksa)
export async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME)
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
      console.log(`Bucket '${BUCKET_NAME}' oluşturuldu`)
    }
  } catch (error) {
    console.error('Bucket oluşturma hatası:', error)
  }
}

// Video URL'i oluştur
export function getVideoUrl(objectName: string): string {
  return `http://localhost:9002/hedef-performans-videos/${objectName}`
}

// Thumbnail URL'i oluştur
export function getThumbnailUrl(objectName: string): string {
  return `http://localhost:9002/hedef-performans-videos/thumbnails/${objectName}`
}
