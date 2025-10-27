import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı ID'si gereklidir"
      }, { status: 400 })
    }

    // Kullanıcıyı sil (cascade delete sayesinde ilgili kayıtlar da silinir)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: "Kullanıcı başarıyla silindi"
    })

  } catch (error: any) {
    console.error('Delete user error:', error)
    
    // Foreign key constraint hatası
    if (error.code === 'P2003') {
      return NextResponse.json({
        success: false,
        message: "Bu kullanıcıya bağlı kayıtlar olduğu için silinemez"
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: "Kullanıcı silinirken bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

