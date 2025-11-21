import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

// Admin yetkisi kontrolü
function isAdminAuthenticated(request: NextRequest): boolean {
  const adminCookie = request.cookies.get('admin_authenticated')
  return adminCookie?.value === 'true'
}

// Oyuncu istatistiklerini güncelle veya oluştur
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string; playerId: string }> | { matchId: string; playerId: string } }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const resolvedParams = await Promise.resolve(params)
    const body = await request.json()
    const {
      position,
      minutes,
      passes,
      keyPasses,
      shots,
      blockedShots,
      groundDuels,
      aerialDuels,
      ballRecoveries,
      looseBallRecoveries,
      interceptions,
      dribbles,
      saves,
      foulsCommitted
    } = body

    // MatchPlayer'ı bul veya oluştur
    let matchPlayer = await prisma.matchPlayer.findUnique({
      where: {
        matchId_userId: {
          matchId: resolvedParams.matchId,
          userId: resolvedParams.playerId
        }
      }
    })

    if (!matchPlayer) {
      matchPlayer = await prisma.matchPlayer.create({
        data: {
          matchId: resolvedParams.matchId,
          userId: resolvedParams.playerId,
          position: position || null,
          minutes: minutes || 0
        }
      })
    } else if (matchPlayer) {
      // MatchPlayer'ı güncelle
      matchPlayer = await prisma.matchPlayer.update({
        where: { id: matchPlayer.id },
        data: {
          position: position !== undefined ? position : undefined,
          minutes: minutes !== undefined ? minutes : undefined
        }
      })
    }

    // İstatistikleri güncelle veya oluştur
    const stats = await prisma.matchPlayerStats.upsert({
      where: { matchPlayerId: matchPlayer.id },
      create: {
        matchPlayerId: matchPlayer.id,
        passes: passes || 0,
        keyPasses: keyPasses || 0,
        shots: shots || 0,
        blockedShots: blockedShots || 0,
        groundDuels: groundDuels || 0,
        aerialDuels: aerialDuels || 0,
        ballRecoveries: ballRecoveries || 0,
        looseBallRecoveries: looseBallRecoveries || 0,
        interceptions: interceptions || 0,
        dribbles: dribbles || 0,
        saves: saves || 0,
        foulsCommitted: foulsCommitted || 0
      },
      update: {
        passes: passes !== undefined ? passes : undefined,
        keyPasses: keyPasses !== undefined ? keyPasses : undefined,
        shots: shots !== undefined ? shots : undefined,
        blockedShots: blockedShots !== undefined ? blockedShots : undefined,
        groundDuels: groundDuels !== undefined ? groundDuels : undefined,
        aerialDuels: aerialDuels !== undefined ? aerialDuels : undefined,
        ballRecoveries: ballRecoveries !== undefined ? ballRecoveries : undefined,
        looseBallRecoveries: looseBallRecoveries !== undefined ? looseBallRecoveries : undefined,
        interceptions: interceptions !== undefined ? interceptions : undefined,
        dribbles: dribbles !== undefined ? dribbles : undefined,
        saves: saves !== undefined ? saves : undefined,
        foulsCommitted: foulsCommitted !== undefined ? foulsCommitted : undefined
      }
    })

    return NextResponse.json({
      success: true,
      data: { matchPlayer, stats }
    })
  } catch (error) {
    console.error('[AdminPlayerStats][PUT] error', error)
    return NextResponse.json({ success: false, message: 'İstatistikler güncellenirken bir hata oluştu' }, { status: 500 })
  }
}

