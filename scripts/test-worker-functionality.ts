// Worker Fonksiyonalite Testi
// Hedef Performans - Kadro Atama Sistemi

import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

// .env dosyasını yükle
config()

const prisma = new PrismaClient()

async function testWorkerFunctionality() {
  try {
    console.log('🧪 Worker Fonksiyonalite Testi')
    console.log('=' .repeat(40))
    
    // Unique email üret
    const uniqueEmail = `worker-test+${Date.now()}@hp-test.com`
    console.log(`📧 Unique email: ${uniqueEmail}`)
    
    // 1. Test kullanıcısı oluştur
    console.log('📝 Test kullanıcısı oluşturuluyor...')
    const user = await prisma.user.create({
      data: {
        email: uniqueEmail,
        password: '$2a$10$dummy.hash.for.testing',
        firstName: 'Worker',
        lastName: 'Test',
        phone: '+90 555 700 0001',
        role: 'MEMBER',
        status: 'PENDING',
        memberProfile: {
          create: {
            firstName: 'Worker',
            lastName: 'Test',
            birthYear: 2016,
            mainPositionKey: 'KALECI',
            altPositionKey: 'ORTA',
            country: 'Türkiye',
            city: 'İstanbul',
            district: 'Maltepe',
            phone: '+90 555 700 0001',
            team: 'Test Team',
            league: 'U9'
          }
        },
        payments: {
          create: {
            amount: 1000,
            currency: 'TRY',
            status: 'PENDING',
            paytrOrderId: `test-worker-${Date.now()}`
          }
        }
      }
    })
    
    console.log(`✅ Test kullanıcısı oluşturuldu: ${user.id}`)
    
    // 2. Webhook gönder
    console.log('\n🎯 Webhook gönderiliyor...')
    const response = await axios.post('http://localhost:3000/api/test/payment-webhook', {
      userId: user.id,
      status: 'success'
    })
    
    console.log('✅ Webhook başarılı:', response.data)
    
    // 3. 5-10 saniye poll ile SquadAssignment kontrol et
    console.log('\n🔍 SquadAssignment kontrol ediliyor...')
    let assignmentFound = false
    let attempts = 0
    const maxAttempts = 10
    
    while (!assignmentFound && attempts < maxAttempts) {
      attempts++
      console.log(`   Deneme ${attempts}/${maxAttempts}...`)
      
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          memberProfile: true,
          squadAssignments: {
            include: {
              squad: true
            }
          }
        }
      })
      
      if (updatedUser && updatedUser.squadAssignments.length > 0) {
        assignmentFound = true
        const assignment = updatedUser.squadAssignments[0]
        
        console.log('\n🎉 ASSIGN RESULT:')
        console.log('=' .repeat(40))
        console.log(`👤 ${updatedUser.firstName} ${updatedUser.lastName}:`)
        console.log(`   Status: ${updatedUser.status}`)
        console.log(`   ✅ Atanmış: ${assignment.squad.name} - ${assignment.positionKey}`)
        console.log(`   📊 Squad ID: ${assignment.squadId}`)
        console.log(`   🔢 Number: ${assignment.number}`)
        console.log('=' .repeat(40))
        console.log('\n🎉 Worker\'lar çalışıyor!')
        break
      }
      
      // 1 saniye bekle
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    if (!assignmentFound) {
      console.log('\n❌ ASSIGN RESULT:')
      console.log('=' .repeat(40))
      console.log('⏳ Atama bulunamadı!')
      console.log('❌ Worker\'lar çalışmıyor!')
      console.log('=' .repeat(40))
    }
    
  } catch (error: any) {
    if (error.message?.includes('Unique constraint failed on the fields: (`email`)')) {
      console.log('⚠️ Email zaten var, yeni email ile tekrar deneniyor...')
      await testWorkerFunctionality()
    } else {
      console.error('❌ Test hatası:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Test'i çalıştır
testWorkerFunctionality()
