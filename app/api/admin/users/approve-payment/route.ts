import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { Queue } from 'bullmq'
import { assignQueueName } from '@/lib/queue/names'
import { connection } from '@/lib/queue/connection'
import { sendPaymentApprovedEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "userId gereklidir"
      }, { status: 400 })
    }

    // Kullanıcıyı ve profili bul
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
      }, { status: 404 })
    }

    // Transaction ile durumu güncelle
    await prisma.$transaction(async (tx) => {
      // User status'ü PAID yap
      await tx.user.update({
        where: { id: userId },
        data: { status: 'PAID' }
      })

      // Payment durumunu güncelle
      if (user.payments.length > 0) {
        await tx.payment.update({
          where: { id: user.payments[0].id },
          data: {
            status: 'PAID',
            paidAt: new Date()
          }
        })
      } else {
        // Payment kaydı yoksa oluştur
        await tx.payment.create({
          data: {
            userId: user.id,
            amount: 499.00,
            currency: 'TRY',
            status: 'PAID',
            paidAt: new Date()
          }
        })
      }
    })

    // Kadro ataması için background job başlat
    const assignEnabled = process.env.ASSIGN_ENABLED !== 'false'
    
    console.log(`🔍 [APPROVE-PAYMENT] Debug: userId=${userId}, birthYear=${user.memberProfile.birthYear}`)
    console.log(`🔍 [APPROVE-PAYMENT] Debug: mainPositionKey=${user.memberProfile.mainPositionKey}, altPositionKey=${user.memberProfile.altPositionKey}`)
    console.log(`🔍 [APPROVE-PAYMENT] Debug: ASSIGN_ENABLED=${assignEnabled}`)
    
    if (!assignEnabled) {
      console.log(`🔴 ASSIGN_PAUSED: Kadro atama devre dışı - userId: ${userId}`)
    } else {
      try {
        const { birthYear, mainPositionKey, altPositionKey } = user.memberProfile
        
        // Yaş grubu ve şablon belirleme
        const ageGroupCode = `U${birthYear}`
        const template = birthYear >= 2014 && birthYear <= 2018 ? '7+1' : '10+1'
        
        console.log(`🔍 [APPROVE-PAYMENT] Computed: ageGroupCode=${ageGroupCode}, template=${template}`)
        
        // Queue oluştur
        const queueName = assignQueueName(ageGroupCode, template)
        console.log(`🔍 [APPROVE-PAYMENT] Queue name: ${queueName}`)
        const queue = new Queue(queueName, { connection })
        
        // Job data
        const jobData = {
          userId: user.id,
          birthYear,
          mainPositionKey,
          altPositionKey: altPositionKey || undefined
        }
        
        console.log(`🔍 [APPROVE-PAYMENT] Job data:`, JSON.stringify(jobData))
        
        // Job ekle
        const job = await queue.add('assign-user', jobData, {
          jobId: `assign-${user.id}-${Date.now()}`,
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        })
        
        console.log(`✅ [APPROVE-PAYMENT] Kadro atama job'u başlatıldı: ${userId} → ${queueName}, jobId=${job.id}`)
        
        // Queue'yu kapat
        await queue.close()
        
      } catch (error: any) {
        console.error('❌ [APPROVE-PAYMENT] Kadro atama job hatası:', error)
        console.error('❌ Error stack:', error.stack)
        // Job hatası olsa bile ödeme onayı devam etsin
      }
    }

    // Email gönder
    try {
      await sendPaymentApprovedEmail(user.email, user.firstName)
      console.log(`✅ [APPROVE-PAYMENT] Email sent to: ${user.email}`)
    } catch (error) {
      console.error('❌ [APPROVE-PAYMENT] Email error:', error)
      // Email hatası olsa bile devam et
    }

    // Prisma'yı kapat - transaction tamamlandı
    await prisma.$disconnect()
    console.log(`✅ [APPROVE-PAYMENT] Response gönderiliyor...`)

    return NextResponse.json({
      success: true,
      message: "Ödeme onaylandı ve kadro ataması başlatıldı"
    })

  } catch (error) {
    console.error("Approve payment error:", error)
    await prisma.$disconnect()
    return NextResponse.json({
      success: false,
      message: "Ödeme onayı sırasında bir hata oluştu"
    }, { status: 500 })
  }
}

