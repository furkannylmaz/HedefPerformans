// Test - Mock Payment Webhook
// Hedef Performans - Kadro Atama Sistemi

import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { Queue } from 'bullmq'
import { assignQueueName } from '@/lib/queue/names'
import { connection } from '@/lib/queue/connection'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, status = 'success' } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "userId gereklidir"
      }, { status: 400 })
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberProfile: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı bulunamadı"
      }, { status: 404 })
    }

    if (!user.memberProfile) {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı profili bulunamadı"
      }, { status: 400 })
    }

    if (status === 'success') {
      // Ödeme başarılı - Kullanıcıyı ACTIVE yap
      await prisma.user.update({
        where: { id: userId },
        data: { status: 'ACTIVE' }
      })

      // Payment kaydını güncelle
      if (user.payments.length > 0) {
        await prisma.payment.update({
          where: { id: user.payments[0].id },
          data: {
            status: 'PAID',
            paidAt: new Date()
          }
        })
      }

      // Kadro ataması için background job başlat
      const assignEnabled = process.env.ASSIGN_ENABLED !== 'false'
      
      if (!assignEnabled) {
        console.log(`🔴 ASSIGN_PAUSED: Kadro atama devre dışı (ASSIGN_ENABLED=false) - userId: ${userId}`)
      } else {
        try {
          const { birthYear, mainPositionKey, altPositionKey } = user.memberProfile
          
          // Yaş grubu ve şablon belirleme
          const ageGroupCode = `U${birthYear}`
          const template = birthYear >= 2014 && birthYear <= 2018 ? '7+1' : '10+1'
          
          // Queue oluştur
          const queueName = assignQueueName(ageGroupCode, template)
          const queue = new Queue(queueName, { connection })
          
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
          
          console.log(`✅ Test: Kadro atama job'u başlatıldı: ${userId} → ${queueName}`)
          
          // Queue'yu kapat
          await queue.close()
          
        } catch (error) {
          console.error('❌ Test: Kadro atama job başlatma hatası:', error)
        }
      }

      return NextResponse.json({
        success: true,
        message: "Test ödeme başarılı - Kadro atama job'u başlatıldı",
        data: {
          userId,
          status: 'ACTIVE',
          birthYear: user.memberProfile.birthYear,
          mainPosition: user.memberProfile.mainPositionKey,
          altPosition: user.memberProfile.altPositionKey
        }
      })
    } else {
      // Ödeme başarısız
      if (user.payments.length > 0) {
        await prisma.payment.update({
          where: { id: user.payments[0].id },
          data: {
            status: 'FAILED',
            failureReason: 'Test payment failed'
          }
        })
      }

      return NextResponse.json({
        success: false,
        message: "Test ödeme başarısız"
      })
    }

  } catch (error) {
    console.error("Test webhook error:", error)
    return NextResponse.json({
      success: false,
      message: "Test webhook işlemi sırasında bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
