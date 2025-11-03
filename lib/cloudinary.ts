// Cloudinary Upload Service
// Hedef Performans - Cloudinary Image Upload

import { v2 as cloudinary } from 'cloudinary'

// Cloudinary configuration - Environment variables'dan oku
function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  // Environment variable validation
  if (!cloudName) {
    console.error('[Cloudinary] CLOUDINARY_CLOUD_NAME is missing!')
    throw new Error('Cloudinary cloud name is not configured. Please set CLOUDINARY_CLOUD_NAME environment variable.')
  }

  if (!apiKey) {
    console.error('[Cloudinary] CLOUDINARY_API_KEY is missing!')
    throw new Error('Cloudinary API key is not configured. Please set CLOUDINARY_API_KEY environment variable.')
  }

  if (!apiSecret) {
    console.error('[Cloudinary] CLOUDINARY_API_SECRET is missing!')
    throw new Error('Cloudinary API secret is not configured. Please set CLOUDINARY_API_SECRET environment variable.')
  }

  console.log('[Cloudinary] Configuration loaded:', {
    cloudName,
    apiKey: apiKey.substring(0, 4) + '...', // API key'in sadece ilk 4 karakterini logla
    apiSecretSet: !!apiSecret
  })

  return {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  }
}

// Cloudinary client'ı initialize et
try {
  const config = getCloudinaryConfig()
  cloudinary.config(config)
  console.log('[Cloudinary] Client initialized successfully')
} catch (error) {
  console.error('[Cloudinary] Initialization error:', error)
  // Runtime'da hata olsa bile çalışmaya devam et, ama upload'lar başarısız olacak
}

export interface UploadResult {
  url: string
  publicId: string
  width?: number
  height?: number
}

/**
 * Image upload to Cloudinary
 */
export async function uploadImage(
  file: File | Buffer,
  folder: string = 'hedef-performans',
  options?: {
    resourceType?: 'image' | 'video' | 'raw' | 'auto'
    transformation?: any[]
  }
): Promise<UploadResult> {
  try {
    // Environment variables kontrolü
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      const missing = []
      if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME')
      if (!apiKey) missing.push('CLOUDINARY_API_KEY')
      if (!apiSecret) missing.push('CLOUDINARY_API_SECRET')
      
      const errorMsg = `[Cloudinary Upload] Missing environment variables: ${missing.join(', ')}`
      console.error(errorMsg)
      throw new Error(errorMsg)
    }

    console.log('[Cloudinary Upload] Starting upload...', {
      folder,
      resourceType: options?.resourceType || 'image',
      hasFile: !!file
    })

    // File'ı buffer'a çevir
    let buffer: Buffer
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } else {
      buffer = file
    }

    // Upload options
    const uploadOptions: {
      folder: string
      resource_type: 'image' | 'video' | 'raw' | 'auto'
      overwrite: boolean
      invalidate: boolean
      transformation?: unknown[]
    } = {
      folder: folder,
      resource_type: options?.resourceType || 'auto',
      overwrite: false,
      invalidate: true,
    }

    if (options?.transformation) {
      uploadOptions.transformation = options.transformation
    }

    // Base64 string'e çevir (Cloudinary upload için)
    const base64String = buffer.toString('base64')
    const dataURI = `data:${options?.resourceType === 'video' ? 'video' : 'image'}/auto;base64,${base64String}`

    // Cloudinary'e yükle - Promise-based API kullan
    const result = await cloudinary.uploader.upload(
      dataURI,
      uploadOptions
    )

    if (!result) {
      throw new Error('Upload failed: No result returned')
    }

    console.log('[Cloudinary Upload] Upload successful:', {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    }
  } catch (error) {
    console.error('[Cloudinary Upload] Error:', error)
    
    // Detaylı error logging
    if (error instanceof Error) {
      console.error('[Cloudinary Upload] Error message:', error.message)
      console.error('[Cloudinary Upload] Error stack:', error.stack)
    }
    
    throw error
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
    console.log('[Cloudinary] Image deleted:', publicId)
  } catch (error) {
    console.error('[Cloudinary] Delete error:', error)
    throw error
  }
}

