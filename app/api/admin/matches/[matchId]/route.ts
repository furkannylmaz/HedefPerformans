import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

// Admin yetkisi kontrolü
function isAdminAuthenticated(request: NextRequest): boolean {
  const adminCookie = request.cookies.get('admin_authenticated')
  return adminCookie?.value === 'true'
}

// Maç detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> | { matchId: string } }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const resolvedParams = await Promise.resolve(params)
    const match = await prisma.match.findUnique({
      where: { id: resolvedParams.matchId },
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
      }
    })

    if (!match) {
      return NextResponse.json({ success: false, message: 'Maç bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: { match }
    })
  } catch (error) {
    console.error('[AdminMatchDetail][GET] error', error)
    return NextResponse.json({ success: false, message: 'Maç yüklenirken bir hata oluştu' }, { status: 500 })
  }
}

// Maç verilerini güncelle (takım istatistikleri)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> | { matchId: string } }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const resolvedParams = await Promise.resolve(params)
    const body = await request.json()
    const {
      opponent,
      score,
      duration,
      ballPossession,
      totalShots,
      shotsOnTarget,
      shotsOffTarget,
      blockedShots,
      shotsOffPost,
      missedChances,
      opponentBoxTouches,
      corners,
      fouls,
      totalPasses,
      accuratePasses,
      duelsWon,
      ballRecoveries,
      aerialDuelsWon,
      interceptions,
      clearances,
      status
    } = body

    const match = await prisma.match.update({
      where: { id: resolvedParams.matchId },
      data: {
        opponent: opponent !== undefined ? opponent : undefined,
        score: score !== undefined ? score : undefined,
        duration: duration !== undefined ? duration : undefined,
        ballPossession: ballPossession !== undefined ? ballPossession : undefined,
        totalShots: totalShots !== undefined ? totalShots : undefined,
        shotsOnTarget: shotsOnTarget !== undefined ? shotsOnTarget : undefined,
        shotsOffTarget: shotsOffTarget !== undefined ? shotsOffTarget : undefined,
        blockedShots: blockedShots !== undefined ? blockedShots : undefined,
        shotsOffPost: shotsOffPost !== undefined ? shotsOffPost : undefined,
        missedChances: missedChances !== undefined ? missedChances : undefined,
        opponentBoxTouches: opponentBoxTouches !== undefined ? opponentBoxTouches : undefined,
        corners: corners !== undefined ? corners : undefined,
        fouls: fouls !== undefined ? fouls : undefined,
        totalPasses: totalPasses !== undefined ? totalPasses : undefined,
        accuratePasses: accuratePasses !== undefined ? accuratePasses : undefined,
        duelsWon: duelsWon !== undefined ? duelsWon : undefined,
        ballRecoveries: ballRecoveries !== undefined ? ballRecoveries : undefined,
        aerialDuelsWon: aerialDuelsWon !== undefined ? aerialDuelsWon : undefined,
        interceptions: interceptions !== undefined ? interceptions : undefined,
        clearances: clearances !== undefined ? clearances : undefined,
        status: status !== undefined ? status : undefined
      }
    })

    return NextResponse.json({
      success: true,
      data: { match }
    })
  } catch (error) {
    console.error('[AdminMatchDetail][PUT] error', error)
    return NextResponse.json({ success: false, message: 'Maç güncellenirken bir hata oluştu' }, { status: 500 })
  }
}

// Maçı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> | { matchId: string } }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const resolvedParams = await Promise.resolve(params)
    await prisma.match.delete({
      where: { id: resolvedParams.matchId }
    })

    return NextResponse.json({
      success: true,
      message: 'Maç başarıyla silindi'
    })
  } catch (error) {
    console.error('[AdminMatchDetail][DELETE] error', error)
    return NextResponse.json({ success: false, message: 'Maç silinirken bir hata oluştu' }, { status: 500 })
  }
}
