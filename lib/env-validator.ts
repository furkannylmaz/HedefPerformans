// Environment Variables Validator
// Hedef Performans - Runtime Environment Check

export interface EnvValidationResult {
  isValid: boolean
  missing: string[]
  warnings: string[]
}

/**
 * Validates required environment variables at runtime
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const missing: string[] = []
  const warnings: string[] = []

  // Required for database
  if (!process.env.DATABASE_URL) {
    missing.push('DATABASE_URL')
  } else {
    // Validate DATABASE_URL format
    if (!process.env.DATABASE_URL.startsWith('postgresql://') && 
        !process.env.DATABASE_URL.startsWith('postgres://')) {
      warnings.push('DATABASE_URL should start with postgresql:// or postgres://')
    }
  }

  // Required for Cloudinary
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    missing.push('CLOUDINARY_CLOUD_NAME')
  }
  if (!process.env.CLOUDINARY_API_KEY) {
    missing.push('CLOUDINARY_API_KEY')
  }
  if (!process.env.CLOUDINARY_API_SECRET) {
    missing.push('CLOUDINARY_API_SECRET')
  }

  // Optional but recommended
  if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'production') {
    warnings.push('NEXTAUTH_SECRET is missing in production')
  }

  if (missing.length > 0) {
    console.error('[Env Validator] Missing required environment variables:', missing)
  }

  if (warnings.length > 0) {
    console.warn('[Env Validator] Warnings:', warnings)
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings
  }
}

/**
 * Logs environment variable status (without exposing secrets)
 */
export function logEnvironmentStatus(): void {
  console.log('[Env Status] Environment Variables Check:')
  console.log('[Env Status] DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Missing')
  console.log('[Env Status] CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing')
  console.log('[Env Status] CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing')
  console.log('[Env Status] CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing')
  console.log('[Env Status] NODE_ENV:', process.env.NODE_ENV || 'not set')
  console.log('[Env Status] NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'not set')
}

