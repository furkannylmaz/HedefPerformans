// Script: Create Test User 7
// Hedef Performans - Test User 7: ORTA/SAG_DEF (2016)

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { autoAssignUser } from '../lib/squads/assign'

const prisma = new PrismaClient()

async function createUser7() {
  console.log('👥 Test User 7 oluşturuluyor...\n')
  
  try {
    const passwordHash = await bcrypt.hash('Password123!', 12)
    
    // Test User 7 - ORTA, SAG_DEF
    const user = await prisma.user.create({
      data: {
        email: 'testuser7@example.com',
        password: passwordHash,
        firstName: 'Test',
        lastName: 'User7',
        phone: '+905551234567',
        role: 'MEMBER',
        status: 'ACTIVE',
        memberProfile: {
          create: {
            firstName: 'Test',
            lastName: 'User7',
            birthYear: 2016,
            mainPositionKey: 'ORTA',
            altPositionKey: 'SAG_DEF',
            country: 'TR',
            city: 'Istanbul',
            district: 'Kadıköy',
            phone: '+905551234567',
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
    
    console.log(`✅ Test User 7 oluşturuldu: ${user.id}`)
    
    // Şimdi atama yap
    try {
      const assignment = await autoAssignUser({
        userId: user.id,
        birthYear: 2016,
        mainPositionKey: 'ORTA',
        altPositionKey: 'SAG_DEF'
      })
      
      console.log(`✅ Atama: ${assignment.positionKey} #${assignment.number}`)
    } catch (error: any) {
      console.log(`❌ Atama hatası: ${error.message}`)
    }
    
    console.log('\n✅ Test User 7 oluşturuldu ve atandı!')
    
  } catch (error: any) {
    console.error('❌ Hata:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createUser7()

