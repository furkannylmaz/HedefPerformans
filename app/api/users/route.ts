import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

// Dynamic route - build-time execution'ı önle
export const dynamic = 'force-dynamic'

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
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } }
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
        city: { contains: city }
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

    // Ödeme durumu filtresi
    if (paymentStatus) {
      if (paymentStatus === 'PAID') {
        where.status = 'ACTIVE'
      } else if (paymentStatus === 'PENDING') {
        where.status = 'PENDING'
      } else if (paymentStatus === 'FAILED') {
        where.status = 'SUSPENDED'
      }
    }

    // Kullanıcıları getir
    const users = await prisma.user.findMany({
      where,
      include: {
        memberProfile: true,
        parentInfo: true,
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
        status: user.status,
        parentInfo: user.parentInfo,
        isMartyrRelative: user.isMartyrRelative,
        martyrRelativeDocumentUrl: user.martyrRelativeDocumentUrl
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
    console.error("[Users API] Error:", error)
    
    // Detaylı error logging
    if (error instanceof Error) {
      console.error("[Users API] Error message:", error.message)
      console.error("[Users API] Error stack:", error.stack)
      
      // Database connection error
      if (error.message.includes('DATABASE_URL') || error.message.includes('connect')) {
        console.error("[Users API] Database connection error detected")
        return NextResponse.json({
          success: false,
          message: "Veritabanı bağlantı hatası. Lütfen yöneticiye bildirin.",
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({
      success: false,
      message: "Kullanıcı listesi alınırken hata oluştu",
      error: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Bilinmeyen hata')
        : undefined
    }, { status: 500 })
  }
}
