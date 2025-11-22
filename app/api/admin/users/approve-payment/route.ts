import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { Queue } from 'bullmq'
import { assignQueueName } from '@/lib/queue/names'
import { connection } from '@/lib/queue/connection'
import { autoAssignUser } from '@/lib/squads/assign'
import { getSiteInfo } from '@/lib/site-settings'

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
      // User status'ü ACTIVE yap - ödeme onaylandığında kullanıcı aktif olmalı
      await tx.user.update({
        where: { id: userId },
        data: { status: 'ACTIVE' }
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
        // Site bilgilerinden ödeme tutarını çek
        const siteInfo = await getSiteInfo()
        const paymentAmount = siteInfo.bankInfo?.amount 
          ? parseFloat(siteInfo.bankInfo.amount.replace(',', '.')) 
          : 499.00
        
        await tx.payment.create({
          data: {
            userId: user.id,
            amount: paymentAmount,
            currency: 'TRY',
            status: 'PAID',
            paidAt: new Date()
          }
        })
      }
    })

    // Kadro ataması - Direkt olarak yap (synchronous)
    const assignEnabled = process.env.ASSIGN_ENABLED !== 'false'
    
    console.log(`🔍 [APPROVE-PAYMENT] Debug: userId=${userId}, birthYear=${user.memberProfile.birthYear}`)
    console.log(`🔍 [APPROVE-PAYMENT] Debug: mainPositionKey=${user.memberProfile.mainPositionKey}, altPositionKey=${user.memberProfile.altPositionKey}`)
    console.log(`🔍 [APPROVE-PAYMENT] Debug: ASSIGN_ENABLED=${assignEnabled}`)
    
    let assignmentResult = null
    let assignmentError = null
    const { birthYear, mainPositionKey, altPositionKey } = user.memberProfile
    
    if (!assignEnabled) {
      console.log(`🔴 ASSIGN_PAUSED: Kadro atama devre dışı - userId: ${userId}`)
    } else {
      try {
        
        console.log(`🔄 [APPROVE-PAYMENT] Kadro ataması başlatılıyor...`)
        
        // Direkt olarak atama yap
        assignmentResult = await autoAssignUser({
          userId: user.id,
          birthYear,
          mainPositionKey,
          altPositionKey: altPositionKey || undefined
        })
        
        console.log(`✅ [APPROVE-PAYMENT] Kadro ataması başarılı: ${userId} → ${assignmentResult.squadId}, pozisyon: ${assignmentResult.positionKey}, numara: ${assignmentResult.number}`)
        
      } catch (error: any) {
        assignmentError = error
        console.error('❌ [APPROVE-PAYMENT] Kadro atama hatası:', error.message)
        console.error('❌ Error stack:', error.stack)
        
        // Eğer kullanıcı zaten atanmışsa, bu bir hata değil
        if (error.message?.includes('USER_ALREADY_ASSIGNED') || error.message?.includes('zaten')) {
          console.log(`ℹ️ [APPROVE-PAYMENT] Kullanıcı zaten atanmış, bu normal`)
          // Kullanıcının mevcut atamasını bul
          const existingAssignment = await prisma.squadAssignment.findFirst({
            where: { userId: user.id },
            include: { squad: true }
          })
          if (existingAssignment) {
            assignmentResult = existingAssignment
          }
        } else {
          // Diğer hatalar için queue'ya ekle (yedek olarak)
          try {
            const ageGroupCode = `U${birthYear}`
            const template = birthYear >= 2014 && birthYear <= 2018 ? '7+1' : '10+1'
            
            const queueName = assignQueueName(ageGroupCode, template)
            const queue = new Queue(queueName, { connection })
            
            const jobData = {
              userId: user.id,
              birthYear,
              mainPositionKey,
              altPositionKey: altPositionKey || undefined
            }
            
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
            
            console.log(`⚠️ [APPROVE-PAYMENT] Direkt atama başarısız, queue'ya eklendi: ${userId} → ${queueName}, jobId=${job.id}`)
            
            await queue.close()
          } catch (queueError: any) {
            console.error('❌ [APPROVE-PAYMENT] Queue\'ya ekleme hatası:', queueError)
          }
        }
      }
    }

    // Prisma'yı kapat
    await prisma.$disconnect()
    
    console.log(`✅ [APPROVE-PAYMENT] Response gönderiliyor...`)

    // Response mesajı
    let message = "Ödeme onaylandı"
    if (assignmentResult) {
      message += " ve kadro ataması yapıldı"
    } else if (assignmentError && assignmentError.message?.includes('USER_ALREADY_ASSIGNED')) {
      message += " (kullanıcı zaten kadroya atanmış)"
    } else if (assignEnabled) {
      message += " ve kadro ataması queue'ya eklendi"
    }

    return NextResponse.json({
      success: true,
      message,
      assignment: assignmentResult ? {
        squadId: assignmentResult.squadId,
        positionKey: assignmentResult.positionKey,
        number: assignmentResult.number
      } : null
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