import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { squadId } = body

    if (!squadId) {
      return NextResponse.json({
        success: false,
        message: "Kadro ID'si gereklidir"
      }, { status: 400 })
    }

    // Kadroyu kontrol et
    const squad = await prisma.squad.findUnique({
      where: { id: squadId },
      include: {
        assignments: true,
        whatsAppGroup: true
      }
    })

    if (!squad) {
      return NextResponse.json({
        success: false,
        message: "Kadro bulunamadı"
      }, { status: 404 })
    }

    // Kadronun boş olup olmadığını kontrol et
    if (squad.assignments.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Bu kadroda üyeler var. Önce üyeleri başka kadroya taşıyın veya silin."
      }, { status: 400 })
    }

    // Kadroyu sil (cascade delete sayesinde ilgili kayıtlar da silinir)
    await prisma.$transaction(async (tx) => {
      // WhatsApp grubu varsa sil
      if (squad.whatsAppGroup) {
        await tx.whatsAppGroup.delete({
          where: { id: squad.whatsAppGroup.id }
        })
      }

      // Squad'ı sil
      await tx.squad.delete({
        where: { id: squadId }
      })
    })

    return NextResponse.json({
      success: true,
      message: "Boş kadro başarıyla silindi"
    })

  } catch (error: any) {
    console.error('Delete squad error:', error)
    
    return NextResponse.json({
      success: false,
      message: error.message || "Kadro silme sırasında bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

