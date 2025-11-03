import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

// Dynamic route - build-time execution'ı önle
export const dynamic = 'force-dynamic'

// PUT - Slider güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, imageUrl, linkUrl, sort, isActive, side } = body

    const slider = await prisma.sliderItem.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(linkUrl !== undefined && { linkUrl }),
        ...(sort !== undefined && { sort }),
        ...(isActive !== undefined && { isActive }),
        ...(side !== undefined && { side })
      }
    })

    return NextResponse.json({
      success: true,
      data: { slider }
    })
  } catch (error) {
    console.error("[Sliders API] PUT Error:", error)
    
    // Detaylı error logging
    if (error instanceof Error) {
      console.error("[Sliders API] Error message:", error.message)
      console.error("[Sliders API] Error stack:", error.stack)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Slider güncellenirken hata oluştu",
        error: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Bilinmeyen hata')
          : undefined
      },
      { status: 500 }
    )
  }
}

// DELETE - Slider sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sliderItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: "Slider silindi"
    })
  } catch (error) {
    console.error("[Sliders API] DELETE Error:", error)
    
    // Detaylı error logging
    if (error instanceof Error) {
      console.error("[Sliders API] Error message:", error.message)
      console.error("[Sliders API] Error stack:", error.stack)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Slider silinirken hata oluştu",
        error: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Bilinmeyen hata')
          : undefined
      },
      { status: 500 }
    )
  }
}

