// Admin - WhatsApp Grup Linki Yönetimi API
// Hedef Performans - Kadro Atama Sistemi

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// WhatsApp link şeması
const whatsappLinkSchema = z.object({
  inviteUrl: z.string().url("Geçerli bir URL giriniz"),
  groupName: z.string().min(1, "Grup adı gereklidir")
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { squadId: string } }
) {
  try {
    const body = await request.json()
    const validatedData = whatsappLinkSchema.parse(body)

    // Kadro kontrolü
    const squad = await prisma.squad.findUnique({
      where: { id: params.squadId }
    })

    if (!squad) {
      return NextResponse.json({
        success: false,
        message: "Kadro bulunamadı"
      }, { status: 404 })
    }

    // WhatsApp grup kaydını güncelle veya oluştur
    const whatsappGroup = await prisma.whatsAppGroup.upsert({
      where: { squadId: params.squadId },
      update: {
        inviteLink: validatedData.inviteUrl,
        groupName: validatedData.groupName,
        isActive: true
      },
      create: {
        squadId: params.squadId,
        inviteLink: validatedData.inviteUrl,
        groupName: validatedData.groupName,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "WhatsApp grup linki güncellendi",
      data: {
        groupId: whatsappGroup.id,
        groupName: whatsappGroup.groupName,
        inviteUrl: whatsappGroup.inviteLink
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validasyon hatası",
        errors: error.errors
      }, { status: 400 })
    }

    console.error("WhatsApp link güncelleme hatası:", error)
    return NextResponse.json({
      success: false,
      message: "WhatsApp link güncelleme sırasında bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { squadId: string } }
) {
  try {
    // WhatsApp grup kaydını sil
    await prisma.whatsAppGroup.delete({
      where: { squadId: params.squadId }
    })

    return NextResponse.json({
      success: true,
      message: "WhatsApp grup linki silindi"
    })

  } catch (error) {
    console.error("WhatsApp link silme hatası:", error)
    return NextResponse.json({
      success: false,
      message: "WhatsApp link silme sırasında bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
