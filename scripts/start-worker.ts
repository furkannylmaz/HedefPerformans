// Worker Başlatma Sistemi
// Hedef Performans - Kadro Atama Sistemi

import { config } from 'dotenv'
import { Worker } from 'bullmq'
import { connection } from '@/lib/queue/connection'
import { assignQueueName } from '@/lib/queue/names'
import { processAssignJob } from '@/lib/queue/assign-queue'
import { SQUAD_CREATE, logSquadPolicy } from '@/config/squads'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

// .env dosyasını yükle
config()

/**
 * Git commit hash'ini al (veya fallback olarak timestamp)
 */
function getGitCommitHash(): string {
  // Önce env'den kontrol et
  if (process.env.GIT_COMMIT) {
    return process.env.GIT_COMMIT
  }
  
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
  } catch (error) {
    // Git yoksa build hash'i veya timestamp kullan
    try {
      const buildInfoPath = path.join(process.cwd(), '.next/build-info.json')
      if (fs.existsSync(buildInfoPath)) {
        const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf-8'))
        return buildInfo.hash || Date.now().toString(36)
      }
    } catch {}
    return Date.now().toString(36)
  }
}

/**
 * App version bilgilerini topla
 */
function getVersionStamp() {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  let appVersion = '0.0.0'
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    appVersion = packageJson.version
  } catch {}
  
  return {
    env: process.env.NODE_ENV || 'development',
    commitHash: getGitCommitHash(),
    appVersion
  }
}

/**
 * Worker oluşturma fonksiyonu
 */
function createAssignWorker(ageGroup: string, template: '7+1' | '10+1'): Worker {
  const queueName = assignQueueName(ageGroup, template)
  
  const worker = new Worker(queueName, processAssignJob, {
    connection,
    concurrency: 1, // Aynı queue için seri işlem
  })

  // Event listeners
  worker.on('ready', () => {
    console.log(`✅ Worker başlatıldı: ${queueName}`)
  })

  worker.on('completed', (job, result) => {
    console.log(`✅ Job tamamlandı: ${job.id}`, result)
  })

  worker.on('failed', (job, err) => {
    console.error(`❌ Job başarısız: ${job?.id}`, err.message)
  })

  worker.on('error', (err) => {
    console.error(`🚨 Worker hatası: ${queueName}`, err)
  })

  return worker
}

/**
 * Ana fonksiyon
 */
async function startWorkers() {
  const versionStamp = getVersionStamp()
  console.log(`🚀 Kadro Atama Worker'ları başlatılıyor...`)
  console.log(`📦 VERSION_STAMP: ${JSON.stringify(versionStamp)}`)
  logSquadPolicy()
  
  // Version stamp'i global olarak kaydet (worker'ların erişebilmesi için)
  globalThis.VERSION_STAMP = versionStamp
  
  const workers: Worker[] = []
  
  // Yaş grupları ve şablonları
  const ageGroups = [
    'U2014', 'U2015', 'U2016', 'U2017', 'U2018', // 7+1 şablonu
    'U2006', 'U2007', 'U2008', 'U2009', 'U2010', 'U2011', 'U2012', 'U2013' // 10+1 şablonu
  ]
  
  for (const ageGroup of ageGroups) {
    // Yaş grubuna göre şablon seç
    const template = ['U2014', 'U2015', 'U2016', 'U2017', 'U2018'].includes(ageGroup) ? '7+1' : '10+1'
    
    const worker = createAssignWorker(ageGroup, template)
    workers.push(worker)
  }
  
  console.log(`✅ ${workers.length} worker başarıyla başlatıldı`)
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Worker\'lar kapatılıyor...')
    await Promise.all(workers.map(worker => worker.close()))
    console.log('✅ Tüm worker\'lar kapatıldı')
    process.exit(0)
  })
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Worker\'lar kapatılıyor...')
    await Promise.all(workers.map(worker => worker.close()))
    console.log('✅ Tüm worker\'lar kapatıldı')
    process.exit(0)
  })
  
  // Worker'ları çalışır durumda tut
  console.log('🔄 Worker\'lar çalışıyor... (Ctrl+C ile durdurun)')
}

// Worker'ları başlat
startWorkers().catch((error) => {
  console.error('❌ Worker başlatma hatası:', error)
  process.exit(1)
})
