import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { PrismaClient } from '@prisma/client'
import { sendWelcomeEmail } from '@/lib/email'
import { 
  getTemplateForBirthYear, 
  getAgeGroupCode, 
  isValidPositionKey,
  getPositionsForTemplate,
  normalizePositionKey,
  validatePositionForTemplate
} from '@/lib/squads/positions'
import { autoAssignUser } from "@/lib/squads/assign"

const prisma = new PrismaClient()

// Kayıt form şeması - Yeni pozisyon sistemi ile
const registerSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  birthYear: z.number().int().min(2006).max(2018, "Doğum yılı 2006-2018 arasında olmalıdır"),
  mainPositionKey: z.string().min(1, "Ana mevki seçimi gereklidir"),
  altPositionKey: z.string().optional(),
  country: z.string().min(1, "Ülke seçimi gereklidir"),
  city: z.string().min(1, "İl seçimi gereklidir"),
  district: z.string().min(1, "İlçe seçimi gereklidir"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  team: z.string().optional(),
  league: z.string().optional(),
  isMartyrRelative: z.boolean().default(false),
  martyrRelativeDocumentUrl: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, "Sözleşmeyi kabul etmelisiniz")
}).refine((data) => {
  // Doğum yılına göre pozisyon validasyonu
  try {
    const template = getTemplateForBirthYear(data.birthYear)
    const positions = getPositionsForTemplate(template)
    
    // Ana mevki kontrolü
    if (!isValidPositionKey(template, data.mainPositionKey)) {
      return false
    }
    
    // Yedek mevki kontrolü (varsa)
    if (data.altPositionKey && !isValidPositionKey(template, data.altPositionKey)) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}, {
  message: "Seçilen pozisyonlar doğum yılına uygun değil",
  path: ["mainPositionKey"]
}).refine((data) => {
  // Kaleci haricinde yedek mevki zorunlu
  if (data.mainPositionKey !== "KALECI" && !data.altPositionKey) {
    return false
  }
  return true
}, {
  message: "Kaleci haricinde yedek mevki seçimi zorunludur",
  path: ["altPositionKey"]
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Form validasyonu
    const validatedData = registerSchema.parse(body)
    
    // Template hesapla
    const template = getTemplateForBirthYear(validatedData.birthYear)
    
    // Pozisyon normalizasyonu ve STRICT validasyon
    let normalizedMainPosition: string
    let normalizedAltPosition: string | null = null
    
    try {
      normalizedMainPosition = normalizePositionKey(validatedData.mainPositionKey, template)
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        message: `POSITION_TEMPLATE_MISMATCH: ${error.message}`
      }, { status: 400 })
    }
    
    if (validatedData.altPositionKey) {
      try {
        normalizedAltPosition = normalizePositionKey(validatedData.altPositionKey, template)
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          message: `POSITION_TEMPLATE_MISMATCH: ${error.message}`
        }, { status: 400 })
      }
    }
    
    // STRICT template validasyonu
    if (!validatePositionForTemplate(normalizedMainPosition, template)) {
      return NextResponse.json({
        success: false,
        message: `POSITION_TEMPLATE_MISMATCH: ${normalizedMainPosition} bu template için geçerli değil (${template})`
      }, { status: 400 })
    }
    
    if (normalizedAltPosition && !validatePositionForTemplate(normalizedAltPosition, template)) {
      return NextResponse.json({
        success: false,
        message: `POSITION_TEMPLATE_MISMATCH: ${normalizedAltPosition} bu template için geçerli değil (${template})`
      }, { status: 400 })
    }
    
    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email
      }
    })
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Bu e-posta adresi zaten kullanılıyor"
      }, { status: 400 })
    }
    
    // Şifre hash'leme
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Kullanıcı ve profil oluşturma - Yeni sistem
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        isMartyrRelative: validatedData.isMartyrRelative,
        martyrRelativeDocumentUrl: validatedData.martyrRelativeDocumentUrl,
        role: "MEMBER",
        status: "PENDING", // Havale/EFT ödeme onayı bekleniyor
        memberProfile: {
          create: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            birthYear: validatedData.birthYear,
            mainPositionKey: normalizedMainPosition,
            altPositionKey: normalizedAltPosition,
            country: validatedData.country,
            city: validatedData.city,
            district: validatedData.district,
            phone: validatedData.phone,
            team: validatedData.team,
            league: validatedData.league
          }
        }
      }
    })

    // Kadro ataması ödeme onayından sonra yapılacak (admin panelden)
    // await autoAssignUser() - Şimdilik kaldırıldı
    
    // Hoş geldin email'i gönder (async, hata olursa da devam et)
    sendWelcomeEmail(
      validatedData.email, 
      validatedData.firstName, 
      validatedData.password,
      'http://localhost:3000/auth'
    ).catch(error => {
      console.error('❌ Welcome email gönderme hatası:', error)
    })
    
    // Şehit yakını ise direkt dashboard'a yönlendir (parent-info ve payment atla)
    // Değilse parent-info sayfasına yönlendir
    const redirectUrl = validatedData.isMartyrRelative 
      ? "/member/dashboard" 
      : "/auth/parent-info"
    
    return NextResponse.json({
      success: true,
      message: validatedData.isMartyrRelative 
        ? "Kayıt başarılı! Dashboard'a yönlendiriliyorsunuz." 
        : "Kayıt başarılı! Lütfen veli bilgilerini doldurun.",
      data: {
        userId: user.id,
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
    
    console.error("Register error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Kayıt işlemi sırasında bir hata oluştu",
      error: error instanceof Error ? error.stack : String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
