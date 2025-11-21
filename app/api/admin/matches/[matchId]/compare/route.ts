import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

// Admin yetkisi kontrolü
function isAdminAuthenticated(request: NextRequest): boolean {
  const adminCookie = request.cookies.get('admin_authenticated')
  return adminCookie?.value === 'true'
}

// İki oyuncuyu karşılaştır
export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const player1Id = searchParams.get('player1Id')
    const player2Id = searchParams.get('player2Id')

    if (!player1Id || !player2Id) {
      return NextResponse.json({ success: false, message: 'İki oyuncu ID\'si gerekli' }, { status: 400 })
    }

    // Her iki oyuncunun maç verilerini getir
    const [player1, player2] = await Promise.all([
      prisma.matchPlayer.findUnique({
        where: {
          matchId_userId: {
            matchId: params.matchId,
            userId: player1Id
          }
        },
        include: {
          user: {
            include: {
              memberProfile: true
            }
          },
          stats: true
        }
      }),
      prisma.matchPlayer.findUnique({
        where: {
          matchId_userId: {
            matchId: params.matchId,
            userId: player2Id
          }
        },
        include: {
          user: {
            include: {
              memberProfile: true
            }
          },
          stats: true
        }
      })
    ])

    if (!player1 || !player2) {
      return NextResponse.json({ success: false, message: 'Oyuncu bulunamadı' }, { status: 404 })
    }

    // Karşılaştırma verilerini hazırla
    const comparison = {
      player1: {
        id: player1.user.id,
        name: `${player1.user.firstName} ${player1.user.lastName}`,
        number: player1.user.memberProfile?.team || null,
        stats: player1.stats || {
          passes: 0,
          keyPasses: 0,
          shots: 0,
          blockedShots: 0,
          groundDuels: 0,
          aerialDuels: 0,
          ballRecoveries: 0,
          looseBallRecoveries: 0,
          interceptions: 0,
          dribbles: 0,
          saves: 0,
          foulsCommitted: 0
        }
      },
      player2: {
        id: player2.user.id,
        name: `${player2.user.firstName} ${player2.user.lastName}`,
        number: player2.user.memberProfile?.team || null,
        stats: player2.stats || {
          passes: 0,
          keyPasses: 0,
          shots: 0,
          blockedShots: 0,
          groundDuels: 0,
          aerialDuels: 0,
          ballRecoveries: 0,
          looseBallRecoveries: 0,
          interceptions: 0,
          dribbles: 0,
          saves: 0,
          foulsCommitted: 0
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: { comparison }
    })
  } catch (error) {
    console.error('[AdminMatchCompare][GET] error', error)
    return NextResponse.json({ success: false, message: 'Karşılaştırma yapılırken bir hata oluştu' }, { status: 500 })
  }
}

