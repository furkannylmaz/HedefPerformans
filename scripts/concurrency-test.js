const { PrismaClient } = require('@prisma/client')
const axios = require('axios')

const prisma = new PrismaClient()

// Test için 5 kullanıcı oluştur (aynı pozisyonu hedefleyen)
const testUsers = [
  { firstName: 'Concurrent', lastName: 'Test1', email: 'concurrent-test1@hp-test.com', phone: '+90 555 500 0001', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA' },
  { firstName: 'Concurrent', lastName: 'Test2', email: 'concurrent-test2@hp-test.com', phone: '+90 555 500 0002', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA' },
  { firstName: 'Concurrent', lastName: 'Test3', email: 'concurrent-test3@hp-test.com', phone: '+90 555 500 0003', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA' },
  { firstName: 'Concurrent', lastName: 'Test4', email: 'concurrent-test4@hp-test.com', phone: '+90 555 500 0004', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA' },
  { firstName: 'Concurrent', lastName: 'Test5', email: 'concurrent-test5@hp-test.com', phone: '+90 555 500 0005', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA' }
]

async function createTestUsers() {
  console.log('🚀 Concurrent test kullanıcıları oluşturuluyor...')
  
  const userIds = []
  
  for (const userData of testUsers) {
    try {
      console.log(`📝 ${userData.firstName} ${userData.lastName} oluşturuluyor...`)
      
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: '$2a$10$dummy.hash.for.testing', // Dummy hash
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          role: 'MEMBER',
          status: 'PENDING', // Başlangıçta PENDING
          memberProfile: {
            create: {
              firstName: userData.firstName,
              lastName: userData.lastName,
              birthYear: userData.birthYear,
              mainPositionKey: userData.mainPosition,
              altPositionKey: userData.altPosition,
              country: 'Türkiye',
              city: 'İstanbul',
              district: 'Maltepe',
              phone: userData.phone,
              team: 'Test Team',
              league: 'U9'
            }
          },
          payments: {
            create: {
              amount: 1000,
              currency: 'TRY',
              status: 'PENDING',
              paytrOrderId: `test-order-${userData.email}-${Date.now()}`
            }
          }
        }
      })
      
      userIds.push(user.id)
      console.log(`✅ ${userData.firstName} ${userData.lastName} oluşturuldu (ID: ${user.id})`)
      
    } catch (error) {
      console.error(`❌ ${userData.firstName} ${userData.lastName} oluşturulurken hata:`, error.message)
    }
  }
  
  return userIds
}

async function sendConcurrentWebhooks(userIds) {
  console.log('\n🎯 Eş zamanlı webhook testi başlatılıyor...')
  console.log(`📊 ${userIds.length} kullanıcı için aynı anda webhook gönderilecek`)
  
  const webhookPromises = userIds.map(async (userId, index) => {
    try {
      console.log(`🚀 Webhook ${index + 1} gönderiliyor: ${userId}`)
      
      const response = await axios.post('http://localhost:3000/api/test/payment-webhook', {
        userId: userId,
        status: 'success'
      }, {
        timeout: 10000 // 10 saniye timeout
      })
      
      console.log(`✅ Webhook ${index + 1} başarılı:`, response.data)
      return { success: true, userId, response: response.data }
      
    } catch (error) {
      console.error(`❌ Webhook ${index + 1} hatası:`, error.message)
      return { success: false, userId, error: error.message }
    }
  })
  
  // Tüm webhook'ları aynı anda gönder
  const results = await Promise.all(webhookPromises)
  
  console.log('\n📊 Webhook Sonuçları:')
  results.forEach((result, index) => {
    if (result.success) {
      console.log(`✅ Webhook ${index + 1}: ${result.userId} - Başarılı`)
    } else {
      console.log(`❌ Webhook ${index + 1}: ${result.userId} - Hata: ${result.error}`)
    }
  })
  
  return results
}

async function checkAssignments(userIds) {
  console.log('\n🔍 Atama durumları kontrol ediliyor...')
  
  for (const userId of userIds) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          memberProfile: true,
          squadAssignments: {
            include: {
              squad: true
            }
          }
        }
      })
      
      if (user) {
        console.log(`\n👤 ${user.firstName} ${user.lastName} (${user.email}):`)
        console.log(`   Status: ${user.status}`)
        
        if (user.squadAssignments.length > 0) {
          const assignment = user.squadAssignments[0]
          console.log(`   ✅ Atanmış: ${assignment.squad.name} - ${assignment.positionKey}`)
        } else {
          console.log(`   ⏳ Atama bekliyor...`)
        }
      }
      
    } catch (error) {
      console.error(`❌ ${userId} kontrol hatası:`, error.message)
    }
  }
}

async function checkSquadStatus() {
  console.log('\n🏟️ Kadro durumları kontrol ediliyor...')
  
  const squads = await prisma.squad.findMany({
    where: {
      ageGroupCode: 'U2016',
      template: '7+1'
    },
    include: {
      assignments: {
        include: {
          user: {
            include: {
              memberProfile: true
            }
          }
        }
      }
    },
    orderBy: { instance: 'asc' }
  })
  
  squads.forEach(squad => {
    console.log(`\n📋 ${squad.name}:`)
    squad.assignments.forEach(assignment => {
      const profile = assignment.user.memberProfile
      console.log(`   ${assignment.positionKey} - ${profile.firstName} ${profile.lastName}`)
    })
  })
}

async function runConcurrencyTest() {
  try {
    console.log('🧪 EŞ ZAMANLI YÜK TESTİ BAŞLATIYOR')
    console.log('=' .repeat(50))
    
    // 1. Test kullanıcılarını oluştur
    const userIds = await createTestUsers()
    
    if (userIds.length === 0) {
      console.log('❌ Test kullanıcıları oluşturulamadı')
      return
    }
    
    // 2. Kısa bir bekleme (kullanıcıların oluşması için)
    console.log('\n⏳ 2 saniye bekleniyor...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 3. Eş zamanlı webhook'ları gönder
    const webhookResults = await sendConcurrentWebhooks(userIds)
    
    // 4. Kısa bir bekleme (job'ların işlenmesi için)
    console.log('\n⏳ 5 saniye bekleniyor (job işleme için)...')
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // 5. Atama durumlarını kontrol et
    await checkAssignments(userIds)
    
    // 6. Kadro durumlarını kontrol et
    await checkSquadStatus()
    
    console.log('\n🎉 EŞ ZAMANLI YÜK TESTİ TAMAMLANDI')
    console.log('=' .repeat(50))
    
  } catch (error) {
    console.error('❌ Test hatası:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Test'i çalıştır
runConcurrencyTest()
