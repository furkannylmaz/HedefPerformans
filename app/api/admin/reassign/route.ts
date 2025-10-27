// Admin - Yeniden Atama API
// Hedef Performans - Kadro Atama Sistemi

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PrismaClient } from '@prisma/client'
import { enqueueAssignJob } from '@/lib/queue/assign-queue'

const prisma = new PrismaClient()

// Yeniden atama şeması
const reassignSchema = z.object({
  userId: z.string().min(1, "Kullanıcı ID gereklidir")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = reassignSchema.parse(body)

    // Kullanıcı bilgilerini getir
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      include: {
        memberProfile: true,
        squadAssignments: {
          include: {
            squad: true
          }
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

    if (user.status !== 'ACTIVE') {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı aktif değil"
      }, { status: 400 })
    }

    // Mevcut atamaları sil
    if (user.squadAssignments.length > 0) {
      await prisma.squadAssignment.deleteMany({
        where: { userId: validatedData.userId }
      })
    }

    // Yeniden atama job'u başlat
    await enqueueAssignJob({
      userId: validatedData.userId,
      birthYear: user.memberProfile.birthYear,
      mainPositionKey: user.memberProfile.mainPositionKey,
      altPositionKey: user.memberProfile.altPositionKey || undefined
    })

    return NextResponse.json({
      success: true,
      message: "Yeniden atama job'u başlatıldı",
      data: {
        userId: validatedData.userId,
        birthYear: user.memberProfile.birthYear,
        mainPosition: user.memberProfile.mainPositionKey,
        altPosition: user.memberProfile.altPositionKey
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validasyon hatası",
        errors: error.errors
      }, { status: 400 })
    }

    console.error("Yeniden atama hatası:", error)
    return NextResponse.json({
      success: false,
      message: "Yeniden atama işlemi sırasında bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
