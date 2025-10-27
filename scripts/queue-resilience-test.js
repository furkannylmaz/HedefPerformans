const { PrismaClient } = require('@prisma/client')
const axios = require('axios')
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)
const prisma = new PrismaClient()

// Test için kullanıcı oluştur
async function createTestUser() {
  console.log('🚀 Queue dayanıklılık testi için kullanıcı oluşturuluyor...')
  
  try {
    const user = await prisma.user.create({
      data: {
        email: `queue-resilience-test+${Date.now()}@hp-test.com`,
        password: '$2a$10$dummy.hash.for.testing',
        firstName: 'Queue',
        lastName: 'Resilience',
        phone: '+90 555 600 0001',
        role: 'MEMBER',
        status: 'PENDING',
        memberProfile: {
          create: {
            firstName: 'Queue',
            lastName: 'Resilience',
            birthYear: 2016,
            mainPositionKey: 'KALECI',
            altPositionKey: 'ORTA',
            country: 'Türkiye',
            city: 'İstanbul',
            district: 'Maltepe',
            phone: '+90 555 600 0001',
            team: 'Test Team',
            league: 'U9'
          }
        },
        payments: {
          create: {
            amount: 1000,
            currency: 'TRY',
            status: 'PENDING',
            paytrOrderId: `test-queue-resilience-${Date.now()}`
          }
        }
      }
    })
    
    console.log(`✅ Test kullanıcısı oluşturuldu: ${user.id}`)
    return user.id
    
  } catch (error) {
    console.error('❌ Test kullanıcısı oluşturulurken hata:', error.message)
    return null
  }
}

// Webhook gönder
async function sendWebhook(userId) {
  console.log(`🎯 Webhook gönderiliyor: ${userId}`)
  
  try {
    const response = await axios.post('http://localhost:3000/api/test/payment-webhook', {
      userId: userId,
      status: 'success'
    }, {
      timeout: 10000
    })
    
    console.log(`✅ Webhook başarılı:`, response.data)
    return true
    
  } catch (error) {
    console.error(`❌ Webhook hatası:`, error.message)
    return false
  }
}

// Redis'i durdur
async function stopRedis() {
  console.log('🛑 Redis durduruluyor...')
  
  try {
    await execAsync('docker stop hedef_performans_redis')
    console.log('✅ Redis durduruldu')
    return true
  } catch (error) {
    console.error('❌ Redis durdurma hatası:', error.message)
    return false
  }
}

// Redis'i başlat
async function startRedis() {
  console.log('🚀 Redis başlatılıyor...')
  
  try {
    await execAsync('docker start hedef_performans_redis')
    console.log('✅ Redis başlatıldı')
    
    // Redis'in tamamen başlaması için bekle
    console.log('⏳ Redis başlaması için 3 saniye bekleniyor...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    return true
  } catch (error) {
    console.error('❌ Redis başlatma hatası:', error.message)
    return false
  }
}

// Kullanıcı atama durumunu kontrol et
async function checkUserAssignment(userId) {
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
      console.log(`\n👤 ${user.firstName} ${user.lastName}:`)
      console.log(`   Status: ${user.status}`)
      
      if (user.squadAssignments.length > 0) {
        const assignment = user.squadAssignments[0]
        console.log(`   ✅ Atanmış: ${assignment.squad.name} - ${assignment.positionKey}`)
        return true
      } else {
        console.log(`   ⏳ Atama bekliyor...`)
        return false
      }
    }
    
    return false
  } catch (error) {
    console.error(`❌ Atama kontrol hatası:`, error.message)
    return false
  }
}

// Queue durumunu kontrol et
async function checkQueueStatus() {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/queue-status')
    console.log('📊 Queue durumu:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Queue durumu kontrol hatası:', error.message)
    return null
  }
}

// Ana test fonksiyonu
async function runQueueResilienceTest() {
  try {
    console.log('🧪 QUEUE DAYANIKLILIK TESTİ BAŞLATIYOR')
    console.log('=' .repeat(60))
    
    // 1. Test kullanıcısını oluştur
    const userId = await createTestUser()
    if (!userId) {
      console.log('❌ Test kullanıcısı oluşturulamadı')
      return
    }
    
    // 2. Webhook gönder (job queue'ya eklenecek)
    console.log('\n📤 1. ADIM: Webhook gönderiliyor...')
    const webhookSuccess = await sendWebhook(userId)
    if (!webhookSuccess) {
      console.log('❌ Webhook gönderilemedi')
      return
    }
    
    // 3. Kısa bekleme (job'un queue'ya eklenmesi için)
    console.log('\n⏳ 2 saniye bekleniyor (job queue\'ya eklenmesi için)...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 4. Queue durumunu kontrol et
    console.log('\n📊 2. ADIM: Queue durumu kontrol ediliyor...')
    await checkQueueStatus()
    
    // 5. Redis'i durdur
    console.log('\n🛑 3. ADIM: Redis durduruluyor...')
    const redisStopped = await stopRedis()
    if (!redisStopped) {
      console.log('❌ Redis durdurulamadı')
      return
    }
    
    // 6. 10 saniye bekle
    console.log('\n⏳ 4. ADIM: 10 saniye bekleniyor (Redis kapalı)...')
    for (let i = 10; i > 0; i--) {
      console.log(`   ${i} saniye kaldı...`)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // 7. Redis'i tekrar başlat
    console.log('\n🚀 5. ADIM: Redis tekrar başlatılıyor...')
    const redisStarted = await startRedis()
    if (!redisStarted) {
      console.log('❌ Redis başlatılamadı')
      return
    }
    
    // 8. Job'ların yeniden işlenmesi için bekle
    console.log('\n⏳ 6. ADIM: Job\'ların yeniden işlenmesi için 10 saniye bekleniyor...')
    for (let i = 10; i > 0; i--) {
      console.log(`   ${i} saniye kaldı...`)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // 9. Atama durumunu kontrol et
    console.log('\n🔍 7. ADIM: Atama durumu kontrol ediliyor...')
    const isAssigned = await checkUserAssignment(userId)
    
    // 10. Queue durumunu tekrar kontrol et
    console.log('\n📊 8. ADIM: Queue durumu tekrar kontrol ediliyor...')
    await checkQueueStatus()
    
    // 11. Test sonucu
    console.log('\n🎯 TEST SONUCU:')
    console.log('=' .repeat(60))
    
    if (isAssigned) {
      console.log('✅ BAŞARILI: Job Redis yeniden başlatıldıktan sonra işlendi!')
      console.log('✅ Queue dayanıklılığı test edildi ve başarılı!')
    } else {
      console.log('❌ BAŞARISIZ: Job Redis yeniden başlatıldıktan sonra işlenmedi!')
      console.log('❌ Queue dayanıklılığında sorun var!')
    }
    
    console.log('\n🎉 QUEUE DAYANIKLILIK TESTİ TAMAMLANDI')
    console.log('=' .repeat(60))
    
  } catch (error) {
    console.error('❌ Test hatası:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Test'i çalıştır
runQueueResilienceTest()
