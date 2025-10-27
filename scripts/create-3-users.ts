// Script: Create 3 Test Users
// Hedef Performans - Sıralı 3 Kullanıcı Oluştur

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createUsers() {
  console.log('👥 3 kullanıcı oluşturuluyor...\n')
  
  try {
    const passwordHash = await bcrypt.hash('Password123!', 12)
    
    // 1. Mahmut Kahveci - 2016 - STOPER, SAG_DEF
    console.log('1️⃣ Mahmut Kahveci oluşturuluyor...')
    const user1 = await prisma.user.create({
      data: {
        email: 'mahmut.kahveci@example.com',
        password: passwordHash,
        firstName: 'Mahmut',
        lastName: 'Kahveci',
        phone: '+905551111111',
        role: 'MEMBER',
        status: 'ACTIVE',
        memberProfile: {
          create: {
            firstName: 'Mahmut',
            lastName: 'Kahveci',
            birthYear: 2016,
            mainPositionKey: 'STOPER',
            altPositionKey: 'SAG_DEF',
            country: 'TR',
            city: 'Istanbul',
            district: 'Kadıköy',
            phone: '+905551111111',
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
    console.log(`✅ Mahmut Kahveci oluşturuldu: ${user1.id}`)
    
    // 2. Cihan Sisman - 2016 - SAG_DEF, SOL_DEF
    console.log('\n2️⃣ Cihan Sisman oluşturuluyor...')
    const user2 = await prisma.user.create({
      data: {
        email: 'cihan.sisman@example.com',
        password: passwordHash,
        firstName: 'Cihan',
        lastName: 'Sisman',
        phone: '+905552222222',
        role: 'MEMBER',
        status: 'ACTIVE',
        memberProfile: {
          create: {
            firstName: 'Cihan',
            lastName: 'Sisman',
            birthYear: 2016,
            mainPositionKey: 'SAG_DEF',
            altPositionKey: 'SOL_DEF',
            country: 'TR',
            city: 'Istanbul',
            district: 'Beşiktaş',
            phone: '+905552222222',
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
    console.log(`✅ Cihan Sisman oluşturuldu: ${user2.id}`)
    
    // 3. Furkan Yılmaz - 2016 - SAG_DEF, STOPER
    console.log('\n3️⃣ Furkan Yılmaz oluşturuluyor...')
    const user3 = await prisma.user.create({
      data: {
        email: 'furkan.yilmaz@example.com',
        password: passwordHash,
        firstName: 'Furkan',
        lastName: 'Yılmaz',
        phone: '+905553333333',
        role: 'MEMBER',
        status: 'ACTIVE',
        memberProfile: {
          create: {
            firstName: 'Furkan',
            lastName: 'Yılmaz',
            birthYear: 2016,
            mainPositionKey: 'SAG_DEF',
            altPositionKey: 'STOPER',
            country: 'TR',
            city: 'Istanbul',
            district: 'Şişli',
            phone: '+905553333333',
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
    console.log(`✅ Furkan Yılmaz oluşturuldu: ${user3.id}`)
    
    console.log('\n📊 Özet:')
    console.log(`   ✅ 3 kullanıcı oluşturuldu`)
    console.log(`   👤 Mahmut Kahveci: STOPER/SAG_DEF`)
    console.log(`   👤 Cihan Sisman: SAG_DEF/SOL_DEF`)
    console.log(`   👤 Furkan Yılmaz: SAG_DEF/STOPER`)
    console.log('\n⚠️  Şimdi /api/auth/register endpoint\'lerini kullanarak kadro atamalarını tetikleyin')
    
  } catch (error: any) {
    console.error('❌ Hata:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createUsers()

