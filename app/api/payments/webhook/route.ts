import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PrismaClient } from '@prisma/client'
import { Queue } from 'bullmq'
import { assignQueueName } from '@/lib/queue/names'
import { connection } from '@/lib/queue/connection'
import crypto from 'crypto'

const prisma = new PrismaClient()

// PayTR webhook şeması
const paytrWebhookSchema = z.object({
  merchant_oid: z.string(),
  status: z.enum(["success", "failed"]),
  total_amount: z.string(),
  hash: z.string(),
  // Diğer PayTR webhook alanları...
})

/**
 * PayTR hash doğrulaması
 */
function verifyPaytrHash(data: any, hash: string): boolean {
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT
  if (!merchantSalt) {
    console.error('PAYTR_MERCHANT_SALT environment variable not set')
    return false
  }

  const hashString = `${data.merchant_oid}${merchantSalt}${data.status}${data.total_amount}`
  const calculatedHash = crypto.createHash('sha256').update(hashString).digest('base64')
  
  return calculatedHash === hash
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // PayTR webhook validasyonu
    const validatedData = paytrWebhookSchema.parse(body)
    
    // PayTR hash doğrulaması
    if (!verifyPaytrHash(validatedData, validatedData.hash)) {
      console.error('PayTR hash doğrulaması başarısız')
      return NextResponse.json({
        success: false,
        message: "Hash doğrulaması başarısız"
      }, { status: 400 })
    }
    
    // Payment kaydını bul
    const payment = await prisma.payment.findFirst({
      where: {
        paytrOrderId: validatedData.merchant_oid
      },
      include: {
        user: {
          include: {
            memberProfile: true
          }
        }
      }
    })

    if (!payment) {
      console.error('Payment kaydı bulunamadı:', validatedData.merchant_oid)
      return NextResponse.json({
        success: false,
        message: "Payment kaydı bulunamadı"
      }, { status: 404 })
    }

    if (validatedData.status === "success") {
      // Ödeme başarılı - Kullanıcıyı ACTIVE yap ve kadro ataması başlat
      await prisma.$transaction(async (tx) => {
        // Payment durumunu güncelle
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'PAID',
            paidAt: new Date()
          }
        })

        // Kullanıcı durumunu ACTIVE yap
        await tx.user.update({
          where: { id: payment.userId },
          data: {
            status: 'ACTIVE'
          }
        })
      })

      // Kadro ataması için background job başlat
      if (payment.user.memberProfile) {
        try {
          const { birthYear, mainPositionKey, altPositionKey } = payment.user.memberProfile
          
          // Yaş grubu ve şablon belirleme
          const ageGroupCode = `U${birthYear}`
          const template = birthYear >= 2014 && birthYear <= 2018 ? '7+1' : '10+1'
          
          // Queue oluştur
          const queueName = assignQueueName(ageGroupCode, template)
          const queue = new Queue(queueName, { connection })
          
          // Job data
          const jobData = {
            userId: payment.userId,
            birthYear,
            mainPositionKey,
            altPositionKey: altPositionKey || undefined
          }
          
          // Job ekle
          await queue.add('assign-user', jobData, {
            jobId: `assign-${payment.userId}-${Date.now()}`,
            removeOnComplete: 100,
            removeOnFail: 50,
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          })
          
          console.log(`✅ Kadro atama job'u başlatıldı: ${payment.userId} → ${queueName}`)
          
          // Queue'yu kapat
          await queue.close()
          
        } catch (error) {
          console.error('❌ Kadro atama job başlatma hatası:', error)
          // Job hatası ödeme işlemini etkilemez
        }
      }

      console.log("Payment successful:", validatedData.merchant_oid)
      
      return NextResponse.json({
        success: true,
        message: "Ödeme başarılı",
        redirectUrl: "/checkout/success"
      })
    } else {
      // Ödeme başarısız
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failureReason: 'PayTR webhook failed'
        }
      })

      console.log("Payment failed:", validatedData.merchant_oid)
      
      return NextResponse.json({
        success: false,
        message: "Ödeme başarısız",
        redirectUrl: "/checkout/failure"
      })
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Webhook validasyon hatası",
        errors: error.errors
      }, { status: 400 })
    }
    
    console.error("PayTR webhook error:", error)
    return NextResponse.json({
      success: false,
      message: "Webhook işlemi sırasında bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
