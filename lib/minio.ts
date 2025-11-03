import { Client } from 'minio'

// MinIO client konfigürasyonu - Environment variables'dan oku
const getMinioConfig = () => {
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost'
  const port = parseInt(process.env.MINIO_PORT || '9002', 10)
  const useSSL = process.env.MINIO_USE_SSL === 'true' || process.env.NODE_ENV === 'production'
  const accessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin'
  const secretKey = process.env.MINIO_SECRET_KEY || 'minioadmin123'

  return {
    endPoint: endpoint,
    port: port,
    useSSL: useSSL,
    accessKey: accessKey,
    secretKey: secretKey,
  }
}

export const minioClient = new Client(getMinioConfig())

// Bucket adı
export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'hedef-performans-videos'

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
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost'
  const port = process.env.MINIO_PORT || '9002'
  const useSSL = process.env.MINIO_USE_SSL === 'true' || process.env.NODE_ENV === 'production'
  const protocol = useSSL ? 'https' : 'http'
  
  // Cloudflare R2 veya AWS S3 gibi external storage kullanıyorsak
  const publicUrl = process.env.MINIO_PUBLIC_URL
  if (publicUrl) {
    // Object name zaten bucket path içeriyorsa direkt döndür
    if (objectName.startsWith(BUCKET_NAME)) {
      return `${publicUrl}/${objectName}`
    }
    // Object name sadece dosya path'i ise bucket ekle
    return `${publicUrl}/${BUCKET_NAME}/${objectName}`
  }
  
  // Local MinIO için
  const baseUrl = `${protocol}://${endpoint}${port !== '443' && port !== '80' ? `:${port}` : ''}`
  if (objectName.startsWith(BUCKET_NAME)) {
    return `${baseUrl}/${objectName}`
  }
  return `${baseUrl}/${BUCKET_NAME}/${objectName}`
}

// Thumbnail URL'i oluştur
export function getThumbnailUrl(objectName: string): string {
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost'
  const port = process.env.MINIO_PORT || '9002'
  const useSSL = process.env.MINIO_USE_SSL === 'true' || process.env.NODE_ENV === 'production'
  const protocol = useSSL ? 'https' : 'http'
  
  // Cloudflare R2 veya AWS S3 gibi external storage kullanıyorsak
  const publicUrl = process.env.MINIO_PUBLIC_URL
  if (publicUrl) {
    return `${publicUrl}/${BUCKET_NAME}/thumbnails/${objectName}`
  }
  
  // Local MinIO için
  const baseUrl = `${protocol}://${endpoint}${port !== '443' && port !== '80' ? `:${port}` : ''}`
  return `${baseUrl}/${BUCKET_NAME}/thumbnails/${objectName}`
}
