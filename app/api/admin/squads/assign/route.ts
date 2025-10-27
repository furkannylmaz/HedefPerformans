// Admin - Manuel Kadro Atama API
// Hedef Performans - Kadro Atama Sistemi

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PrismaClient } from '@prisma/client'
import { assignUserToSlotTx } from '@/lib/squads/assign'
import { 
  normalizePositionKey, 
  validatePositionForTemplate,
  getTemplateForBirthYear
} from '@/lib/squads/positions'

const prisma = new PrismaClient()

// Manuel atama şeması
const manualAssignSchema = z.object({
  userId: z.string().min(1, "Kullanıcı ID gereklidir"),
  squadId: z.string().min(1, "Kadro ID gereklidir"),
  positionKey: z.string().min(1, "Pozisyon gereklidir"),
  number: z.number().int().positive("Forma numarası pozitif olmalıdır")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = manualAssignSchema.parse(body)

    // Kullanıcı ve kadro kontrolü
    const [user, squad] = await Promise.all([
      prisma.user.findUnique({
        where: { id: validatedData.userId },
        include: { memberProfile: true }
      }),
      prisma.squad.findUnique({
        where: { id: validatedData.squadId },
        include: { assignments: true }
      })
    ])

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı bulunamadı"
      }, { status: 404 })
    }

    if (!squad) {
      return NextResponse.json({
        success: false,
        message: "Kadro bulunamadı"
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

    // Template ve pozisyon normalizasyonu
    const template = getTemplateForBirthYear(user.memberProfile.birthYear)
    let normalizedPosition: string
    
    try {
      normalizedPosition = normalizePositionKey(validatedData.positionKey, template)
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        message: `POSITION_TEMPLATE_MISMATCH: ${error.message}`
      }, { status: 400 })
    }

    // STRICT template validasyonu
    if (!validatePositionForTemplate(normalizedPosition, template)) {
      return NextResponse.json({
        success: false,
        message: `POSITION_TEMPLATE_MISMATCH: ${normalizedPosition} bu template için geçerli değil (${template})`
      }, { status: 400 })
    }

    // Forma numarası kontrolü
    const existingAssignment = squad.assignments.find(
      assignment => assignment.number === validatedData.number
    )

    if (existingAssignment) {
      return NextResponse.json({
        success: false,
        message: `Forma numarası ${validatedData.number} zaten kullanımda`
      }, { status: 400 })
    }

    // Manuel atama işlemi
    const assignment = await assignUserToSlotTx({
      userId: validatedData.userId,
      squadId: validatedData.squadId,
      positionKey: normalizedPosition,
      number: validatedData.number,
      source: 'MANUAL'
    })

    return NextResponse.json({
      success: true,
      message: "Kullanıcı başarıyla kadroya atandı",
      data: {
        assignmentId: assignment.id,
        squadName: squad.name,
        position: normalizedPosition,
        number: validatedData.number
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

    console.error("Manuel atama hatası:", error)
    return NextResponse.json({
      success: false,
      message: "Atama işlemi sırasında bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
