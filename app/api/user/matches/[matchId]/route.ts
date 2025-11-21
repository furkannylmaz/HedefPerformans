import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

// Kullanıcı yetkisi kontrolü
function getUserFromToken(request: NextRequest): string | null {
  const authToken = request.cookies.get('auth_token')?.value
  if (!authToken) return null
  
  try {
    const decoded = JSON.parse(authToken)
    return decoded.userId || null
  } catch {
    return null
  }
}

// Maç detayını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  const userId = getUserFromToken(request)
  
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Giriş yapmalısınız' }, { status: 401 })
  }

  try {
    // Kullanıcının bu maçta oynadığını kontrol et
    const matchPlayer = await prisma.matchPlayer.findUnique({
      where: {
        matchId_userId: {
          matchId: params.matchId,
          userId: userId
        }
      },
      include: {
        match: {
          include: {
            squad: {
              select: {
                id: true,
                name: true,
                ageGroupCode: true
              }
            },
            players: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        },
        stats: true
      }
    })

    if (!matchPlayer) {
      return NextResponse.json({ success: false, message: 'Maç bulunamadı veya erişim yetkiniz yok' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        match: {
          id: matchPlayer.match.id,
          date: matchPlayer.match.date,
          opponent: matchPlayer.match.opponent,
          score: matchPlayer.match.score,
          duration: matchPlayer.match.duration,
          squad: matchPlayer.match.squad,
          position: matchPlayer.position,
          minutes: matchPlayer.minutes,
          stats: matchPlayer.stats,
          teamStats: {
            ballPossession: matchPlayer.match.ballPossession,
            totalShots: matchPlayer.match.totalShots,
            shotsOnTarget: matchPlayer.match.shotsOnTarget,
            shotsOffTarget: matchPlayer.match.shotsOffTarget,
            blockedShots: matchPlayer.match.blockedShots,
            shotsOffPost: matchPlayer.match.shotsOffPost,
            missedChances: matchPlayer.match.missedChances,
            opponentBoxTouches: matchPlayer.match.opponentBoxTouches,
            corners: matchPlayer.match.corners,
            fouls: matchPlayer.match.fouls,
            totalPasses: matchPlayer.match.totalPasses,
            accuratePasses: matchPlayer.match.accuratePasses,
            duelsWon: matchPlayer.match.duelsWon,
            ballRecoveries: matchPlayer.match.ballRecoveries,
            aerialDuelsWon: matchPlayer.match.aerialDuelsWon,
            interceptions: matchPlayer.match.interceptions,
            clearances: matchPlayer.match.clearances
          }
        }
      }
    })
  } catch (error) {
    console.error('[UserMatchDetail][GET] error', error)
    return NextResponse.json({ success: false, message: 'Maç yüklenirken bir hata oluştu' }, { status: 500 })
  }
}

