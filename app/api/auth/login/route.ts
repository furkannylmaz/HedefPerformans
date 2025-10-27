import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Giriş form şeması
const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Form validasyonu
    const validatedData = loginSchema.parse(body)
    
    // Veritabanından kullanıcı bulma
    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email
      },
      include: {
        memberProfile: true
      }
    })
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "E-posta veya şifre hatalı"
      }, { status: 401 })
    }
    
    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "E-posta veya şifre hatalı"
      }, { status: 401 })
    }
    
    // Kullanıcı durumu kontrolü - Sadece BLOCKED ve DELETED engellensin
    // PENDING, PAID, ACTIVE hepsi giriş yapabilsin
    if (user.status === "BLOCKED" || user.status === "DELETED") {
      return NextResponse.json({
        success: false,
        message: "Hesabınız aktif değil."
      }, { status: 403 })
    }
    
    // TODO: NextAuth session oluşturma
    // Session cookie'si set edilecek
    
    return NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          memberProfile: user.memberProfile
        },
        redirectUrl: user.role === "ADMIN" ? "/admin/users" : "/member/dashboard"
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
    
    console.error("Login error:", error)
    return NextResponse.json({
      success: false,
      message: "Giriş işlemi sırasında bir hata oluştu"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
