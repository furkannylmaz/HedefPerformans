import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const search = searchParams.get('search') || ''
    const position = searchParams.get('position') || ''
    const paymentStatus = searchParams.get('paymentStatus') || ''
    const city = searchParams.get('city') || ''
    const ageRange = searchParams.get('ageRange') || ''

    const skip = (page - 1) * limit

    // Filtreleme koşulları
    const where: any = {}
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (position) {
      where.memberProfile = {
        mainPositionKey: position
      }
    }

    if (city) {
      where.memberProfile = {
        ...where.memberProfile,
        city: { contains: city, mode: 'insensitive' }
      }
    }

    // Yaş filtresi
    if (ageRange) {
      const currentYear = new Date().getFullYear()
      const age = parseInt(ageRange)
      const birthYear = currentYear - age
      
      where.memberProfile = {
        ...where.memberProfile,
        birthYear: birthYear
      }
    }

    // Kullanıcıları getir
    const users = await prisma.user.findMany({
      where,
      include: {
        memberProfile: true,
        squadAssignments: {
          include: {
            squad: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    // Toplam sayı
    const total = await prisma.user.count({ where })

    // Kullanıcıları formatla
    const formattedUsers = users.map(user => {
      const age = user.memberProfile?.birthYear 
        ? new Date().getFullYear() - user.memberProfile.birthYear
        : 0

      // Kadro bilgisi
      const squadAssignment = user.squadAssignments[0]
      const squadInfo = squadAssignment 
        ? `${squadAssignment.squad.ageGroupCode} ${squadAssignment.squad.template} ${squadAssignment.squad.instance}`
        : '-'

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        mainPosition: user.memberProfile?.mainPositionKey || 'UNKNOWN',
        altPosition: user.memberProfile?.altPositionKey || null,
        squadInfo,
        age,
        city: user.memberProfile?.city || '',
        paymentStatus: user.status === 'PAID' ? 'PAID' : 'PENDING', // Ödeme entegrasyonu yok - direkt user.status kullan
        paymentAmount: 0, // Ödeme entegrasyonu yok
        joinDate: user.createdAt,
        status: user.status
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + limit < total
        }
      }
    })

  } catch (error) {
    console.error("Users list error:", error)
    return NextResponse.json({
      success: false,
      message: "Kullanıcı listesi alınırken hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
