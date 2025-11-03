import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

// Dynamic route - build-time execution'ı önle
export const dynamic = 'force-dynamic'

// GET - Tüm slider'ları listele
export async function GET() {
  try {
    const sliders = await prisma.sliderItem.findMany({
      orderBy: [
        { side: "asc" },
        { sort: "asc" }
      ]
    })

    return NextResponse.json({
      success: true,
      data: { sliders }
    })
  } catch (error) {
    console.error("[Sliders API] GET Error:", error)
    
    // Detaylı error logging
    if (error instanceof Error) {
      console.error("[Sliders API] Error message:", error.message)
      console.error("[Sliders API] Error stack:", error.stack)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Slider listesi yüklenirken hata oluştu",
        error: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Bilinmeyen hata')
          : undefined
      },
      { status: 500 }
    )
  }
}

// POST - Yeni slider ekle
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { side, title, imageUrl, linkUrl, sort, isActive } = body

    if (!side || !imageUrl) {
      return NextResponse.json(
        { success: false, message: "Side ve imageUrl gerekli" },
        { status: 400 }
      )
    }

    const slider = await prisma.sliderItem.create({
      data: {
        side,
        title,
        imageUrl,
        linkUrl,
        sort: sort || 0,
        isActive: isActive !== false
      }
    })

    return NextResponse.json({
      success: true,
      data: { slider }
    })
  } catch (error) {
    console.error("[Sliders API] POST Error:", error)
    
    // Detaylı error logging
    if (error instanceof Error) {
      console.error("[Sliders API] Error message:", error.message)
      console.error("[Sliders API] Error stack:", error.stack)
      
      // Database connection error
      if (error.message.includes('DATABASE_URL') || error.message.includes('connect')) {
        console.error("[Sliders API] Database connection error detected")
        return NextResponse.json(
          { 
            success: false, 
            message: "Veritabanı bağlantı hatası. Lütfen yöneticiye bildirin.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Slider eklenirken hata oluştu",
        error: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Bilinmeyen hata')
          : undefined
      },
      { status: 500 }
    )
  }
}

