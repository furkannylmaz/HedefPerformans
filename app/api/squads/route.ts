// Kadro Listesi API - Yeni sistem
// Hedef Performans - Kadro Atama Sistemi

import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'
import { getPositionsForTemplate } from '@/lib/squads/positions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ageGroupCode = searchParams.get("ageGroupCode")
    const template = searchParams.get("template")
    const availableAgeGroups = searchParams.get("availableAgeGroups")

    // Mevcut yaş gruplarını getir
    if (availableAgeGroups === "true") {
      const existingAgeGroups = await prisma.squad.findMany({
        select: {
          ageGroupCode: true
        },
        distinct: ['ageGroupCode'],
        orderBy: {
          ageGroupCode: 'desc'
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          ageGroups: existingAgeGroups.map(squad => squad.ageGroupCode)
        }
      })
    }

    // Tüm kadroları getir
    const squads = await prisma.squad.findMany({
      where: {
        ...(ageGroupCode && { ageGroupCode }),
        ...(template && { template })
      },
      include: {
        assignments: {
          include: {
            user: {
              include: {
                memberProfile: true
              }
            }
          }
        },
        whatsappGroup: true,
        _count: {
          select: { assignments: true }
        }
      },
      orderBy: [
        { ageGroupCode: 'asc' },
        { template: 'asc' },
        { instance: 'asc' }
      ]
    })

    // Kadro bilgilerini formatla
    const formattedSquads = squads.map(squad => {
      const templatePositions = getPositionsForTemplate(squad.template as any)
      const totalSlots = templatePositions.length
      const occupiedSlots = squad.assignments.length
      const occupancyRate = (occupiedSlots / totalSlots) * 100

      // Slot bilgilerini oluştur
      const slots = templatePositions.map(position => {
        const assignment = squad.assignments.find(
          assignment => assignment.positionKey === position.positionKey
        )

        return {
          positionKey: position.positionKey,
          number: position.number,
          isOccupied: !!assignment,
          user: assignment ? {
            id: assignment.user.id,
            firstName: assignment.user.firstName,
            lastName: assignment.user.lastName,
            mainPosition: assignment.user.memberProfile?.mainPositionKey || 'N/A'
          } : null
        }
      })

      return {
        id: squad.id,
        ageGroupCode: squad.ageGroupCode,
        template: squad.template,
        instance: squad.instance,
        name: squad.name,
        createdAt: squad.createdAt,
        totalSlots,
        occupiedSlots,
        occupancyRate: Math.round(occupancyRate),
        slots,
        whatsappGroup: squad.whatsappGroup ? {
          id: squad.whatsappGroup.id,
          groupName: squad.whatsappGroup.groupName,
          inviteUrl: squad.whatsappGroup.inviteUrl,
          isActive: squad.whatsappGroup.isActive
        } : null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        squads: formattedSquads,
        total: formattedSquads.length
      }
    })

  } catch (error) {
    console.error("Kadro listesi hatası:", error)
    return NextResponse.json({
      success: false,
      message: "Kadro listesi yüklenirken bir hata oluştu",
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}