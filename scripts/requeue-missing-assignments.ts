// Script: QUEUE-ACTIVE-USERS-WITHOUT-ASSIGN
// Hedef Performans - Atamasız Kullanıcıları Yeniden Kuyruğa Ekle

import { PrismaClient } from '@prisma/client'
import { Queue } from 'bullmq'
import Redis from 'ioredis'
import { assignQueueName } from '../lib/queue/names'

const prisma = new PrismaClient()

// Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
})

async function requeueMissingAssignments() {
  console.log('🔄 Atamasız kullanıcıları yeniden kuyruğa ekliyorum...\n')
  
  try {
    // 1. U2016 7+1 için ACTIVE kullanıcıları al
    const users = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        memberProfile: {
          birthYear: 2016
        }
      },
      include: {
        memberProfile: true,
        squadAssignments: {
          include: {
            squad: true
          }
        }
      }
    })
    
    console.log(`📊 Toplam ${users.length} ACTIVE kullanıcı bulundu\n`)
    
    // 2. Atamasız kullanıcıları filtrele
    const usersWithoutAssignment = users.filter(user => {
      // U2016 için atama yok mu?
      const hasU2016Assignment = user.squadAssignments.some(assignment => 
        assignment.ageGroupCode === 'U2016'
      )
      return !hasU2016Assignment
    })
    
    console.log(`⚠️  ${usersWithoutAssignment.length} kullanıcı atamasız bulundu\n`)
    
    if (usersWithoutAssignment.length === 0) {
      console.log('✅ Tüm kullanıcılar zaten atanmış!')
      return
    }
    
    // 3. Her bir atamasız kullanıcı için job ekle
    let queuedCount = 0
    let errorCount = 0
    
    for (const user of usersWithoutAssignment) {
      try {
        if (!user.memberProfile) {
          console.log(`⚠️  ${user.firstName} ${user.lastName} - Profil yok, atlanıyor`)
          errorCount++
          continue
        }
        
        const { birthYear, mainPositionKey, altPositionKey } = user.memberProfile
        
        // Yaş grubu ve şablon belirleme
        const ageGroupCode = `U${birthYear}`
        const template = birthYear >= 2014 && birthYear <= 2018 ? '7+1' : '10+1'
        
        // Queue oluştur
        const queueName = assignQueueName(ageGroupCode, template)
        const queue = new Queue(queueName, { connection: redis })
        
        // Job data
        const jobData = {
          userId: user.id,
          birthYear,
          mainPositionKey,
          altPositionKey: altPositionKey || undefined
        }
        
        // Job ekle
        await queue.add('assign-user', jobData, {
          jobId: `assign-${user.id}-${Date.now()}`,
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        })
        
        console.log(`✅ Kuyruğa eklendi: ${user.firstName} ${user.lastName} (${user.email.substring(0, 10)}...) → ${queueName}`)
        queuedCount++
        
        // Queue'yu kapat
        await queue.close()
        
      } catch (error: any) {
        console.error(`❌ Hata: ${user.firstName} ${user.lastName} - ${error.message}`)
        errorCount++
      }
    }
    
    console.log('\n📊 Özet:')
    console.log(`   Toplam kullanıcı: ${users.length}`)
    console.log(`   Atamasız: ${usersWithoutAssignment.length}`)
    console.log(`   Kuyruklanan: ${queuedCount}`)
    console.log(`   Hatalı: ${errorCount}`)
    
  } catch (error: any) {
    console.error('❌ Hata:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
    await redis.quit()
  }
}

requeueMissingAssignments()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })

