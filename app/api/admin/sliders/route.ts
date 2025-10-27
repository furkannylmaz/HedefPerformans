import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    console.error("Slider list error:", error)
    return NextResponse.json(
      { success: false, message: "Slider listesi yüklenirken hata oluştu" },
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
    console.error("Slider create error:", error)
    return NextResponse.json(
      { success: false, message: "Slider eklenirken hata oluştu" },
      { status: 500 }
    )
  }
}

