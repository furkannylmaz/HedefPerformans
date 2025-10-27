// Script: Create 5 More Test Users
// Hedef Performans - 5 Kullanıcı Oluştur ve Atamaları Tetikle

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { autoAssignUser } from '../lib/squads/assign'

const prisma = new PrismaClient()

async function createUsers() {
  console.log('👥 5 kullanıcı oluşturuluyor...\n')
  
  try {
    const passwordHash = await bcrypt.hash('Password123!', 12)
    
    const users = [
      // 1. STOPER, ORTA
      { firstName: 'Test', lastName: 'User1', email: 'testuser1@example.com', phone: '+905551234561', main: 'STOPER', alt: 'ORTA' },
      // 2. ORTA, SAG_DEF
      { firstName: 'Test', lastName: 'User2', email: 'testuser2@example.com', phone: '+905551234562', main: 'ORTA', alt: 'SAG_DEF' },
      // 3. SAG_DEF, KALECI
      { firstName: 'Test', lastName: 'User3', email: 'testuser3@example.com', phone: '+905551234563', main: 'SAG_DEF', alt: 'KALECI' },
      // 4. KALECI, STOPER
      { firstName: 'Test', lastName: 'User4', email: 'testuser4@example.com', phone: '+905551234564', main: 'KALECI', alt: 'STOPER' },
      // 5. ORTA, SAG_DEF
      { firstName: 'Test', lastName: 'User5', email: 'testuser5@example.com', phone: '+905551234565', main: 'ORTA', alt: 'SAG_DEF' },
    ]
    
    for (let i = 0; i < users.length; i++) {
      const userData = users[i]
      console.log(`${i + 1}. ${userData.firstName} ${userData.lastName} (${userData.main}/${userData.alt})`)
      
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          role: 'MEMBER',
          status: 'ACTIVE',
          memberProfile: {
            create: {
              firstName: userData.firstName,
              lastName: userData.lastName,
              birthYear: 2016,
              mainPositionKey: userData.main,
              altPositionKey: userData.alt,
              country: 'TR',
              city: 'Istanbul',
              district: 'Kadıköy',
              phone: userData.phone,
            },
          },
          payments: {
            create: {
              amount: 499,
              currency: 'TRY',
              status: 'PAID',
            },
          },
        },
      })
      
      console.log(`   ✅ Oluşturuldu: ${user.id}`)
      
      // Şimdi atama yap
      try {
        const assignment = await autoAssignUser({
          userId: user.id,
          birthYear: 2016,
          mainPositionKey: userData.main,
          altPositionKey: userData.alt
        })
        
        console.log(`   ⚽ Atama: ${assignment.positionKey} #${assignment.number}`)
      } catch (error: any) {
        console.log(`   ⚠️  Atama hatası: ${error.message}`)
      }
      
      console.log('')
      
      // Kısa gecikme
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log('✅ Tüm kullanıcılar oluşturuldu ve atamaları yapıldı!')
    
  } catch (error: any) {
    console.error('❌ Hata:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createUsers()

