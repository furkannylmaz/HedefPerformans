import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    console.error("Slider update error:", error)
    return NextResponse.json(
      { success: false, message: "Slider güncellenirken hata oluştu" },
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
    console.error("Slider delete error:", error)
    return NextResponse.json(
      { success: false, message: "Slider silinirken hata oluştu" },
      { status: 500 }
    )
  }
}

