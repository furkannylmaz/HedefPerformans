import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Cookie'den kullanıcı ID'sini al
    const authToken = request.cookies.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json({
        success: false,
        message: "Giriş yapmalısınız"
      }, { status: 401 })
    }

    // Token'dan kullanıcı ID'sini çıkart (basit decode)
    let userId: string
    try {
      // JSON format: {"userId": "xxx"}
      const decoded = JSON.parse(authToken)
      userId = decoded.userId
      
      if (!userId) {
        throw new Error('User ID not found')
      }
    } catch {
      return NextResponse.json({
        success: false,
        message: "Geçersiz token"
      }, { status: 401 })
    }
    
    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        memberProfile: true,
        videos: true,
        squadAssignments: {
          include: {
            squad: {
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
                whatsappGroup: true
              }
            }
          }
        }
      }
    })

    console.log("User found:", user ? "User exists" : "User not found")

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı bulunamadı"
      }, { status: 404 })
    }

    // İstatistikleri hesapla
    const totalViews = user.videos.reduce((sum, video) => sum + video.viewCount, 0)
    const videoCount = user.videos.length
    
    // Kadro bilgisi - Yeni sistem
    const squadAssignment = user.squadAssignments[0]
    
    // Pozisyon çevirisi - TAM LISTE (7+1 ve 10+1 tüm pozisyonlar)
    const positionMap: { [key: string]: string } = {
      // 7+1 Pozisyonları
      'KALECI': 'Kaleci',
      'SAG_DEF': 'Sağ Defans',
      'STOPER': 'Stoper',
      'SOL_DEF': 'Sol Defans',
      'ORTA': 'Orta Saha',
      'SAG_KANAT': 'Sağ Kanat',
      'SOL_KANAT': 'Sol Kanat',
      'FORVET': 'Forvet',
      
      // 10+1 Pozisyonları
      'SAGBEK': 'Sağ Bek',
      'SAG_STOPER': 'Sağ Stoper',
      'SOL_STOPER': 'Sol Stoper',
      'SOLBEK': 'Sol Bek',
      'ONLIBERO': 'Ön Libero',
      'ORTA_8': 'Orta Saha (8)',
      'ORTA_10': 'Orta Saha (10)'
    }
    
    const squad = squadAssignment ? {
      id: squadAssignment.squad.id,
      name: squadAssignment.squad.name,
      position: positionMap[squadAssignment.positionKey] || squadAssignment.positionKey,
      positionKey: squadAssignment.positionKey,
      number: squadAssignment.number,
      memberCount: squadAssignment.squad.assignments.length,
      maxMembers: squadAssignment.squad.template === '7+1' ? 8 : 11,
      whatsappLink: squadAssignment.squad.whatsappGroup?.inviteLink || undefined,
      whatsappGroupName: squadAssignment.squad.whatsappGroup?.groupName || undefined
    } : {
      id: "",
      name: "Ataman Hazırlanıyor...",
      position: "Bekleniyor",
      positionKey: "",
      number: 0,
      memberCount: 0,
      maxMembers: 0,
      whatsappLink: undefined,
      whatsappGroupName: undefined
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          status: user.status,
          createdAt: user.createdAt.toISOString(),
          memberProfile: user.memberProfile ? {
            ...user.memberProfile,
            createdAt: user.memberProfile.createdAt.toISOString(),
            updatedAt: user.memberProfile.updatedAt.toISOString()
          } : null
        },
        stats: {
          totalViews,
          videoCount,
          squadPosition: squad.name,
          joinDate: user.createdAt.toISOString()
        },
        squad,
        recentVideos: user.videos.slice(0, 5).map(video => ({
          id: video.id,
          title: video.title,
          viewCount: video.viewCount,
          uploadDate: video.createdAt.toISOString()
        }))
      }
    })

  } catch (error) {
    console.error("User profile error:", error)
    return NextResponse.json({
      success: false,
      message: "Profil bilgileri alınırken hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
