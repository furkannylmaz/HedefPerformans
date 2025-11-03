import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

// DATABASE_URL runtime kontrolü
function validateDatabaseUrl(): void {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('[Prisma] DATABASE_URL is missing!')
    throw new Error('DATABASE_URL environment variable is required. Please set it in your environment variables.')
  }

  // PostgreSQL URL format kontrolü
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    console.warn('[Prisma] DATABASE_URL does not start with postgresql:// or postgres://')
  }

  console.log('[Prisma] DATABASE_URL is set:', {
    protocol: databaseUrl.split('://')[0],
    hasHost: databaseUrl.includes('@'),
    length: databaseUrl.length
  })
}

// Runtime'da validate et
if (typeof window === 'undefined') {
  // Server-side only
  try {
    validateDatabaseUrl()
  } catch (error) {
    console.error('[Prisma] Database URL validation failed:', error)
    // Production'da hata fırlatma, sadece logla
    if (process.env.NODE_ENV === 'development') {
      throw error
    }
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

// Connection test function (optional, runtime'da çağrılabilir)
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('[Prisma] Database connection test successful')
    return true
  } catch (error) {
    console.error('[Prisma] Database connection test failed:', error)
    return false
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

