// Health Check Endpoint
// Production ortamında environment variables ve servis durumunu kontrol eder

import { NextResponse } from 'next/server'
import { validateEnvironmentVariables, logEnvironmentStatus } from '@/lib/env-validator'
import { testDatabaseConnection } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    checks: {
      database: 'unknown',
      cloudinary: 'unknown',
      envVars: 'unknown'
    },
    details: {
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Missing',
      cloudinaryConfig: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
        apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
      }
    }
  }

  try {
    // Environment variables kontrolü
    logEnvironmentStatus()
    const envCheck = validateEnvironmentVariables()
    health.checks.envVars = envCheck.isValid ? 'ok' : 'failed'
    
    // Database connection test
    if (process.env.DATABASE_URL) {
      try {
        const dbConnected = await testDatabaseConnection()
        health.checks.database = dbConnected ? 'ok' : 'failed'
      } catch (error) {
        console.error('[Health Check] Database test error:', error)
        health.checks.database = 'error'
      }
    } else {
      health.checks.database = 'missing_url'
    }

    // Cloudinary config kontrolü
    const hasCloudinary = 
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    health.checks.cloudinary = hasCloudinary ? 'ok' : 'missing'

    // Genel durum
    const allOk = 
      health.checks.database === 'ok' &&
      health.checks.cloudinary === 'ok' &&
      health.checks.envVars === 'ok'
    
    health.status = allOk ? 'ok' : 'degraded'

    return NextResponse.json(health, { 
      status: allOk ? 200 : 503 
    })
  } catch (error) {
    console.error('[Health Check] Error:', error)
    health.status = 'error'
    return NextResponse.json(health, { status: 500 })
  }
}

