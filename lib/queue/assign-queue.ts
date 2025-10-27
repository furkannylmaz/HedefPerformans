// BullMQ Job Processor - Kadro Atama
// Hedef Performans - Kadro Atama Sistemi

import { Job } from 'bullmq'
import { autoAssignUser } from '../squads/assign'

// Job data interface
export interface AssignJobData {
  userId: string
  birthYear: number
  mainPositionKey: string
  altPositionKey?: string
}

// Version stamp interface
interface VersionStamp {
  env: string
  commitHash: string
  appVersion: string
}

// Global type tanımı
declare global {
  var VERSION_STAMP: VersionStamp | undefined
}

/**
 * Worker processor - Job işleme
 * Sadece autoAssignUser çağırır, redis/queue işlemleri yok
 */
export async function processAssignJob(job: Job<AssignJobData>) {
  const { userId, birthYear, mainPositionKey, altPositionKey } = job.data
  
  // Version stamp logla
  const versionStamp = globalThis.VERSION_STAMP || { env: 'unknown', commitHash: 'unknown', appVersion: '0.0.0' }
  console.log(`🔄 [ASSIGN-DEBUG] VERSION_STAMP: ${JSON.stringify(versionStamp)}`)
  
  // ASSIGN_ENABLED kontrolü
  const assignEnabled = process.env.ASSIGN_ENABLED !== 'false'
  
  if (!assignEnabled) {
    console.log(`🔴 ASSIGN_PAUSED: Kadro atama devre dışı (ASSIGN_ENABLED=false) - userId: ${userId}`)
    return {
      success: false,
      paused: true,
      message: 'Kadro atama devre dışı bırakıldı'
    }
  }
  
  console.log(`🔄 Atama job'u başlatıldı: ${userId}`)
  
  try {
    // Atama işlemini gerçekleştir
    const assignment = await autoAssignUser({
      userId,
      birthYear,
      mainPositionKey,
      altPositionKey
    })

    console.log(`✅ Atama job'u tamamlandı: ${userId} → ${assignment.id}`)
    
    return {
      success: true,
      assignmentId: assignment.id,
      squadId: assignment.squadId,
      positionKey: assignment.positionKey,
      number: assignment.number
    }
    
  } catch (error: any) {
    console.error(`❌ Atama job'u hatası: ${userId}`, error.message)
    throw error
  }
}