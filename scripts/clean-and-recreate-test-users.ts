// Script: Clean and Recreate Test Users
// Hedef Performans - Aynı Pozisyonda Test Kullanıcıları

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function cleanAndRecreate() {
  console.log('🧹 Tüm üyeleri temizliyorum...')
  
  // Tüm atamaları, profilleri, ödemeleri ve kullanıcıları sil
  await prisma.squadAssignment.deleteMany()
  await prisma.memberProfile.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.termsConsent.deleteMany()
  await prisma.user.deleteMany()
  await prisma.squad.deleteMany()
  
  console.log('✅ Tüm veriler temizlendi\n')
  
  console.log('🌱 19 yeni kullanıcı ekleniyor (hepsi KALECI + ORTA pozisyonu)...\n')
  
  const birthYear = 2016
  const mainPositionKey = 'KALECI'
  const altPositionKey = 'ORTA'
  
  for (let i = 1; i <= 19; i++) {
    const firstName = `TestUser${i}`
    const lastName = `Soyad${i}`
    const email = `testuser${i}@example.com`
    const passwordHash = await bcrypt.hash('Password123!', 12)
    
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          firstName,
          lastName,
          phone: `+90555100${i}`,
          role: 'MEMBER',
          status: 'ACTIVE',
          memberProfile: {
            create: {
              firstName,
              lastName,
              birthYear,
              mainPositionKey,
              altPositionKey,
              country: 'TR',
              city: 'Istanbul',
              district: 'Kadıköy',
              phone: `+90555100${i}`,
            }
          },
          payments: {
            create: {
              amount: 499,
              currency: 'TRY',
              status: 'PAID',
            }
          }
        }
      })
      
      console.log(`✅ ${i}. Kullanıcı oluşturuldu: ${email} (${mainPositionKey}/${altPositionKey})`)
    } catch (error: any) {
      console.error(`❌ ${i}. Kullanıcı oluşturulurken hata: ${error.message}`)
    }
  }
  
  console.log('\n✅ Tüm kullanıcılar oluşturuldu!')
  console.log('\n📊 Kullanıcı Özeti:')
  console.log('- Toplam: 19 kullanıcı')
  console.log('- Doğum Yılı: 2016 (U2016)')
  console.log('- Ana Mevki: KALECI')
  console.log('- Yedek Mevki: ORTA')
  
  await prisma.$disconnect()
}

cleanAndRecreate()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })

