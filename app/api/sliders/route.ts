import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Slider verilerini çek
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const side = searchParams.get("side") // LEFT veya RIGHT

    const where: any = {
      isActive: true
    }

    if (side) {
      where.side = side
    }

    const sliders = await prisma.sliderItem.findMany({
      where,
      orderBy: {
        sort: "asc"
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        sliders
      }
    })
  } catch (error) {
    console.error("Slider fetch error:", error)
    return NextResponse.json(
      { success: false, message: "Slider verileri yüklenirken hata oluştu" },
      { status: 500 }
    )
  }
}

