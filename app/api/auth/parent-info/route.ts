import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Veli bilgi form şeması
const parentInfoSchema = z.object({
  userId: z.string().min(1, "Kullanıcı ID gereklidir"),
  parentOccupationGroup: z.string().min(1, "Veli meslek grubu seçimi gereklidir"),
  parentPhone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  participationCity: z.string().min(1, "Seçmelere katılacağınız şehir seçimi gereklidir"),
  kvkkAccepted: z.boolean().refine(val => val === true, "KVKK onayı gereklidir"),
  infoFormAccepted: z.boolean().refine(val => val === true, "Ön Bilgilendirme Formu onayı gereklidir"),
  healthConsentAccepted: z.boolean().refine(val => val === true, "Sağlık Onam Formu onayı gereklidir"),
  salesContractAccepted: z.boolean().refine(val => val === true, "Mesafeli Satış Sözleşmesi onayı gereklidir"),
  playedInClubBefore: z.boolean()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Form validasyonu
    const validatedData = parentInfoSchema.parse(body)
    
    // Kullanıcıyı kontrol et
    const user = await prisma.user.findUnique({
      where: {
        id: validatedData.userId
      }
    })
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı bulunamadı"
      }, { status: 404 })
    }
    
    // Kullanıcının şehit yakını olup olmadığını kontrol et
    const userWithMartyrStatus = await prisma.user.findUnique({
      where: {
        id: validatedData.userId
      },
      select: {
        isMartyrRelative: true
      }
    })
    
    // Veli bilgilerini kaydet veya güncelle
    const parentInfo = await prisma.parentInfo.upsert({
      where: {
        userId: validatedData.userId
      },
      update: {
        parentOccupationGroup: validatedData.parentOccupationGroup,
        parentPhone: validatedData.parentPhone,
        participationCity: validatedData.participationCity,
        kvkkAccepted: validatedData.kvkkAccepted,
        infoFormAccepted: validatedData.infoFormAccepted,
        healthConsentAccepted: validatedData.healthConsentAccepted,
        salesContractAccepted: validatedData.salesContractAccepted,
        playedInClubBefore: validatedData.playedInClubBefore
      },
      create: {
        userId: validatedData.userId,
        parentOccupationGroup: validatedData.parentOccupationGroup,
        parentPhone: validatedData.parentPhone,
        participationCity: validatedData.participationCity,
        kvkkAccepted: validatedData.kvkkAccepted,
        infoFormAccepted: validatedData.infoFormAccepted,
        healthConsentAccepted: validatedData.healthConsentAccepted,
        salesContractAccepted: validatedData.salesContractAccepted,
        playedInClubBefore: validatedData.playedInClubBefore
      }
    })
    
    // Şehit yakını ise direkt dashboard'a yönlendir, değilse payment-method'a
    const redirectUrl = userWithMartyrStatus?.isMartyrRelative 
      ? "/member/dashboard" 
      : "/checkout/payment-method"
    
    return NextResponse.json({
      success: true,
      message: "Veli bilgileri başarıyla kaydedildi",
      data: {
        parentInfo,
        redirectUrl
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Form validasyon hatası",
        errors: error.errors
      }, { status: 400 })
    }
    
    console.error("Parent info error:", error)
    return NextResponse.json({
      success: false,
      message: "Veli bilgileri kaydedilirken bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

