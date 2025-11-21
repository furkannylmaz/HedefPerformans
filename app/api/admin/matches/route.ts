import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

// Admin yetkisi kontrolü
function isAdminAuthenticated(request: NextRequest): boolean {
  const adminCookie = request.cookies.get('admin_authenticated')
  return adminCookie?.value === 'true'
}

// Maç listesi
export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const squadId = searchParams.get('squadId')

    const matches = await prisma.match.findMany({
      where: squadId ? { squadId } : undefined,
      include: {
        squad: {
          select: {
            id: true,
            name: true,
            ageGroupCode: true,
            template: true,
            instance: true
          }
        },
        players: {
          include: {
            user: {
              include: {
                memberProfile: true
              }
            },
            stats: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: { matches }
    })
  } catch (error) {
    console.error('[AdminMatches][GET] error', error)
    return NextResponse.json({ success: false, message: 'Maçlar yüklenirken bir hata oluştu' }, { status: 500 })
  }
}

// Yeni maç oluştur
export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { squadId, date, opponentSquadId, opponent, playerIds } = body

    if (!squadId || !date) {
      return NextResponse.json({ success: false, message: 'Takım ve tarih zorunludur' }, { status: 400 })
    }

    // Rakip takım adını belirle
    let opponentName = opponent || null
    if (opponentSquadId) {
      const opponentSquad = await prisma.squad.findUnique({
        where: { id: opponentSquadId },
        select: { name: true }
      })
      if (opponentSquad) {
        opponentName = opponentSquad.name
      }
    }

    // Maçı oluştur
    const match = await prisma.match.create({
      data: {
        squadId,
        date: new Date(date),
        opponent: opponentName,
        status: 'PENDING'
      }
    })

    // Oyuncuları ekle
    if (playerIds && Array.isArray(playerIds) && playerIds.length > 0) {
      await Promise.all(
        playerIds.map((userId: string) =>
          prisma.matchPlayer.create({
            data: {
              matchId: match.id,
              userId
            }
          })
        )
      )
    }

    return NextResponse.json({
      success: true,
      data: { match }
    })
  } catch (error) {
    console.error('[AdminMatches][POST] error', error)
    return NextResponse.json({ success: false, message: 'Maç oluşturulurken bir hata oluştu' }, { status: 500 })
  }
}

