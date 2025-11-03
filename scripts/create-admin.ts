// Production Admin Kullanıcı Oluşturma Script'i
// Hedef Performans - İlk Admin Kullanıcısını Oluşturur

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  console.log('👤 Admin kullanıcısı oluşturuluyor...\n')

  // Admin bilgileri
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hedefperformans.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
  const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin'
  const adminLastName = process.env.ADMIN_LAST_NAME || 'User'

  try {
    // Mevcut admin var mı kontrol et
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      console.log(`⚠️  Bu email zaten kullanılıyor: ${adminEmail}`)
      console.log('Admin kullanıcısı oluşturulmadı.')
      return
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // Admin kullanıcısını oluştur
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: adminFirstName,
        lastName: adminLastName,
        phone: '+905551234567',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    })

    console.log('✅ Admin kullanıcısı başarıyla oluşturuldu!')
    console.log('\n📋 Admin Bilgileri:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Şifre: ${adminPassword}`)
    console.log(`   İsim: ${adminFirstName} ${adminLastName}`)
    console.log(`   ID: ${admin.id}`)
    console.log('\n⚠️  ÖNEMLİ: Bu bilgileri güvenli bir yerde saklayın!')
    console.log('⚠️  İlk girişten sonra mutlaka şifreyi değiştirin!')

  } catch (error) {
    console.error('❌ Admin oluşturma hatası:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Script çalıştır
createAdmin()
  .then(() => {
    console.log('\n✅ Script başarıyla tamamlandı!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script hatası:', error)
    process.exit(1)
  })

