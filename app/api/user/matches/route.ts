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

// Kullanıcının maçlarını getir
export async function GET(request: NextRequest) {
  const userId = getUserFromToken(request)
  
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Giriş yapmalısınız' }, { status: 401 })
  }

  try {
    // Kullanıcının oynadığı maçları getir
    const matchPlayers = await prisma.matchPlayer.findMany({
      where: { userId },
      include: {
        match: {
          include: {
            squad: {
              select: {
                id: true,
                name: true,
                ageGroupCode: true
              }
            }
          }
        },
        stats: true
      },
      orderBy: {
        match: {
          date: 'desc'
        }
      }
    })

    // Maçları formatla
    const matches = matchPlayers.map(mp => ({
      id: mp.match.id,
      date: mp.match.date,
      opponent: mp.match.opponent,
      score: mp.match.score,
      duration: mp.match.duration,
      squad: mp.match.squad,
      position: mp.position,
      minutes: mp.minutes,
      stats: mp.stats
    }))

    return NextResponse.json({
      success: true,
      data: { matches }
    })
  } catch (error) {
    console.error('[UserMatches][GET] error', error)
    return NextResponse.json({ success: false, message: 'Maçlar yüklenirken bir hata oluştu' }, { status: 500 })
  }
}

