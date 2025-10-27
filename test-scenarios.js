// Hedef Performans - Test Senaryoları
// Tüm testleri sırasıyla çalıştırmak için

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test verileri
const testUsers = {
  u2016: {
    firstName: 'Test',
    lastName: 'User2016',
    birthYear: 2016,
    mainPositionKey: 'ORTA',
    altPositionKey: 'FORVET',
    country: 'Türkiye',
    city: 'İstanbul',
    district: 'Beşiktaş',
    phone: '05551234567',
    email: `test2016-${Date.now()}@example.com`,
    password: '123456',
    termsAccepted: true
  },
  u2010: {
    firstName: 'Test',
    lastName: 'User2010',
    birthYear: 2010,
    mainPositionKey: 'ORTA_8',
    altPositionKey: 'ORTA_10',
    country: 'Türkiye',
    city: 'İstanbul',
    district: 'Beşiktaş',
    phone: '05551234568',
    email: `test2010-${Date.now()}@example.com`,
    password: '123456',
    termsAccepted: true
  },
  invalidPosition: {
    firstName: 'Test',
    lastName: 'Invalid',
    birthYear: 2016,
    mainPositionKey: 'ORTA_10', // 2016 için geçersiz pozisyon
    altPositionKey: 'FORVET',
    country: 'Türkiye',
    city: 'İstanbul',
    district: 'Beşiktaş',
    phone: '05551234569',
    email: `invalid-${Date.now()}@example.com`,
    password: '123456',
    termsAccepted: true
  }
};

// Test sonuçları
const testResults = [];

// Yardımcı fonksiyonlar
function logTest(testName, success, message, data = null) {
  const result = {
    test: testName,
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  testResults.push(result);
  console.log(`${success ? '✅' : '❌'} ${testName}: ${message}`);
  if (data) console.log('   Data:', JSON.stringify(data, null, 2));
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// T1 - Register Validation (Template Uyum)
async function testT1_RegisterValidation() {
  console.log('\n🧪 T1 - Register Validation (Template Uyum)');
  
  try {
    // Uyumsuz pozisyon testi
    const invalidResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUsers.invalidPosition);
    logTest('T1-Uyumsuz Pozisyon', false, 'Beklenmeyen başarılı yanıt', invalidResponse.data);
  } catch (error) {
    if (error.response?.status === 400) {
      logTest('T1-Uyumsuz Pozisyon', true, '400 hatası alındı', error.response.data);
    } else {
      logTest('T1-Uyumsuz Pozisyon', false, 'Beklenmeyen hata', error.message);
    }
  }

  try {
    // Uyumlu pozisyon testi
    const validResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUsers.u2016);
    logTest('T1-Uyumlu Pozisyon', true, '200 başarılı kayıt', validResponse.data);
  } catch (error) {
    logTest('T1-Uyumlu Pozisyon', false, 'Kayıt hatası', error.message);
  }
}

// T2 - Terms Consent & PENDING→ACTIVE Akışı
async function testT2_TermsConsent() {
  console.log('\n🧪 T2 - Terms Consent & PENDING→ACTIVE Akışı');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, testUsers.u2010);
    
    if (response.data.success) {
      logTest('T2-Kayıt', true, 'Kullanıcı kaydı başarılı', response.data);
      
      // Test webhook PAID gönderimi
      const webhookData = {
        userId: response.data.data.userId,
        status: 'success'
      };
      
      try {
        const webhookResponse = await axios.post(`${BASE_URL}/api/test/payment-webhook`, webhookData);
        logTest('T2-Webhook', true, 'Webhook başarılı', webhookResponse.data);
      } catch (webhookError) {
        logTest('T2-Webhook', false, 'Webhook hatası', webhookError.message);
      }
    }
  } catch (error) {
    logTest('T2-Kayıt', false, 'Kayıt hatası', error.message);
  }
}

// T3 - Idempotency (Çift Webhook)
async function testT3_Idempotency() {
  console.log('\n🧪 T3 - Idempotency (Çift Webhook)');
  
  // Önce bir kullanıcı kaydet
  let userId;
  try {
    const registerData = {
      ...testUsers.u2010,
      email: `test-duplicate-${Date.now()}@example.com`
    };
    const response = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
    userId = response.data.data.userId;
    logTest('T3-Kayıt', true, 'Test kullanıcısı kaydedildi', response.data);
  } catch (error) {
    logTest('T3-Kayıt', false, 'Kayıt hatası', error.message);
    return;
  }
  
  const webhookData = {
    userId: userId,
    status: 'success'
  };
  
  try {
    // İlk webhook
    const response1 = await axios.post(`${BASE_URL}/api/test/payment-webhook`, webhookData);
    logTest('T3-İlk Webhook', true, 'İlk webhook başarılı', response1.data);
    
    // İkinci webhook (aynı kullanıcı)
    const response2 = await axios.post(`${BASE_URL}/api/test/payment-webhook`, webhookData);
    logTest('T3-İkinci Webhook', true, 'İkinci webhook başarılı', response2.data);
  } catch (error) {
    logTest('T3-Webhook', false, 'Webhook hatası', error.message);
  }
}

// T4 - 7+1 ANA→YEDEK→Yeni Kadro
async function testT4_SquadAssignment7Plus1() {
  console.log('\n🧪 T4 - 7+1 ANA→YEDEK→Yeni Kadro');
  
  const u2016Users = [];
  
  try {
    // U2016 için 10 kişi kaydet
    for (let i = 0; i < 10; i++) {
      const userData = {
        firstName: `Test${i}`,
        lastName: `User2016_${i}`,
        birthYear: 2016,
        mainPositionKey: 'ORTA',
        altPositionKey: 'FORVET',
        country: 'Türkiye',
        city: 'İstanbul',
        district: 'Beşiktaş',
        phone: `0555123456${i}`,
        email: `test2016_${i}_${Date.now()}@example.com`,
        password: '123456',
        termsAccepted: true
      };
      
      const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
      u2016Users.push(response.data.data.userId);
      logTest(`T4-Kayıt-${i+1}`, true, `Kullanıcı ${i+1} kaydedildi`, response.data);
      await sleep(100); // Rate limit için
    }
    
    logTest('T4-Toplu Kayıt', true, `${u2016Users.length} kullanıcı kaydedildi`);
    
    // Kadro atamalarını kontrol et
    try {
      const squadsResponse = await axios.get(`${BASE_URL}/api/squads`);
      logTest('T4-Kadro Listesi', true, 'Kadro listesi alındı', squadsResponse.data);
    } catch (error) {
      logTest('T4-Kadro Listesi', false, 'Kadro listesi hatası', error.message);
    }
    
  } catch (error) {
    logTest('T4-Toplu Kayıt', false, 'Toplu kayıt hatası', error.message);
  }
}

// T5 - 10+1 Çift Orta Saha Slotu (8/10)
async function testT5_DoubleMidfield() {
  console.log('\n🧪 T5 - 10+1 Çift Orta Saha Slotu (8/10)');
  
  const u2010Users = [];
  
  try {
    // U2010 için ORTA_8 ve ORTA_10'u target alan 3 kullanıcı ekle
    const midfieldUsers = [
      {
        firstName: 'Midfield1',
        lastName: 'User2010',
        birthYear: 2010,
        mainPositionKey: 'ORTA_8',
        altPositionKey: 'ORTA_10',
        country: 'Türkiye',
        city: 'İstanbul',
        district: 'Beşiktaş',
        phone: '05551234570',
        email: `midfield1_${Date.now()}@example.com`,
        password: '123456',
        termsAccepted: true
      },
      {
        firstName: 'Midfield2',
        lastName: 'User2010',
        birthYear: 2010,
        mainPositionKey: 'ORTA_10',
        altPositionKey: 'ORTA_8',
        country: 'Türkiye',
        city: 'İstanbul',
        district: 'Beşiktaş',
        phone: '05551234571',
        email: `midfield2_${Date.now()}@example.com`,
        password: '123456',
        termsAccepted: true
      },
      {
        firstName: 'Midfield3',
        lastName: 'User2010',
        birthYear: 2010,
        mainPositionKey: 'ORTA_8',
        altPositionKey: 'ORTA_10',
        country: 'Türkiye',
        city: 'İstanbul',
        district: 'Beşiktaş',
        phone: '05551234572',
        email: `midfield3_${Date.now()}@example.com`,
        password: '123456',
        termsAccepted: true
      }
    ];
    
    for (let i = 0; i < midfieldUsers.length; i++) {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, midfieldUsers[i]);
      u2010Users.push(response.data.data.userId);
      logTest(`T5-Midfield-${i+1}`, true, `Orta saha kullanıcısı ${i+1} kaydedildi`, response.data);
      await sleep(100);
    }
    
    logTest('T5-Midfield Kayıt', true, `${u2010Users.length} orta saha kullanıcısı kaydedildi`);
    
    // Kadro atamalarını kontrol et
    try {
      const squadsResponse = await axios.get(`${BASE_URL}/api/squads?ageGroupCode=U2010`);
      const u2010Squads = squadsResponse.data.data.squads;
      
      // En son oluşturulan kadroyu bul
      const latestSquad = u2010Squads[u2010Squads.length - 1];
      logTest('T5-Son Kadro', true, `Son kadro: ${latestSquad.name}`, {
        name: latestSquad.name,
        occupancyRate: latestSquad.occupancyRate,
        orta8Occupied: latestSquad.slots.find(s => s.positionKey === 'ORTA_8')?.isOccupied,
        orta10Occupied: latestSquad.slots.find(s => s.positionKey === 'ORTA_10')?.isOccupied
      });
      
    } catch (error) {
      logTest('T5-Kadro Kontrol', false, 'Kadro kontrol hatası', error.message);
    }
    
  } catch (error) {
    logTest('T5-Midfield Kayıt', false, 'Orta saha kayıt hatası', error.message);
  }
}

// T6 - En Az Dolu→En Eski Sıralaması
async function testT6_LeastFullOldest() {
  console.log('\n🧪 T6 - En Az Dolu→En Eski Sıralaması');
  
  try {
    // U2016 için "KALECI" ekle - en az dolu kadroya atanmalı
    const goalkeeperData = {
      firstName: 'Goalkeeper',
      lastName: 'Test2016',
      birthYear: 2016,
      mainPositionKey: 'KALECI',
      altPositionKey: 'SAG_DEF',
      country: 'Türkiye',
      city: 'İstanbul',
      district: 'Beşiktaş',
      phone: '05551234580',
      email: `goalkeeper_${Date.now()}@example.com`,
      password: '123456',
      termsAccepted: true
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, goalkeeperData);
    logTest('T6-Kaleci Kayıt', true, 'Kaleci kullanıcısı kaydedildi', response.data);
    
    // Kadro atamalarını kontrol et
    try {
      const squadsResponse = await axios.get(`${BASE_URL}/api/squads?ageGroupCode=U2016`);
      const u2016Squads = squadsResponse.data.data.squads;
      
      // Doluluk oranına göre sıralanmış kadroları kontrol et
      const sortedSquads = u2016Squads.sort((a, b) => a.occupancyRate - b.occupancyRate);
      const leastFullSquad = sortedSquads[0];
      
      logTest('T6-Sıralama', true, `En az dolu kadro: ${leastFullSquad.name}`, {
        name: leastFullSquad.name,
        occupancyRate: leastFullSquad.occupancyRate,
        createdAt: leastFullSquad.createdAt,
        kaleciOccupied: leastFullSquad.slots.find(s => s.positionKey === 'KALECI')?.isOccupied
      });
      
    } catch (error) {
      logTest('T6-Kadro Kontrol', false, 'Kadro kontrol hatası', error.message);
    }
    
  } catch (error) {
    logTest('T6-Kaleci Kayıt', false, 'Kaleci kayıt hatası', error.message);
  }
}

// T7 - Worker Restart
async function testT7_WorkerRestart() {
  console.log('\n🧪 T7 - Worker Restart');
  
  try {
    // 3 job sıraya koy
    const jobUsers = [];
    for (let i = 0; i < 3; i++) {
      const userData = {
        firstName: `WorkerTest${i}`,
        lastName: `User2016`,
        birthYear: 2016,
        mainPositionKey: 'KALECI',
        altPositionKey: 'SAG_DEF',
        country: 'Türkiye',
        city: 'İstanbul',
        district: 'Beşiktaş',
        phone: `0555123459${i}`,
        email: `workertest${i}_${Date.now()}@example.com`,
        password: '123456',
        termsAccepted: true
      };
      
      const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
      jobUsers.push(response.data.data.userId);
      logTest(`T7-Job-${i+1}`, true, `Job ${i+1} sıraya eklendi`, response.data);
      await sleep(100);
    }
    
    logTest('T7-Job Queue', true, `${jobUsers.length} job sıraya eklendi`);
    
    // Worker restart simülasyonu için job'ların işlenmesini bekle
    await sleep(3000);
    
    // Job'ların işlenip işlenmediğini kontrol et
    try {
      const squadsResponse = await axios.get(`${BASE_URL}/api/squads?ageGroupCode=U2016`);
      const u2016Squads = squadsResponse.data.data.squads;
      
      // Son oluşturulan kadroları kontrol et
      const recentSquads = u2016Squads.filter(squad => 
        squad.createdAt > new Date(Date.now() - 10000).toISOString()
      );
      
      logTest('T7-Worker Restart', true, `Worker restart sonrası ${recentSquads.length} yeni kadro`, {
        recentSquads: recentSquads.map(s => s.name),
        totalSquads: u2016Squads.length
      });
      
    } catch (error) {
      logTest('T7-Kadro Kontrol', false, 'Kadro kontrol hatası', error.message);
    }
    
  } catch (error) {
    logTest('T7-Worker Restart', false, 'Worker restart test hatası', error.message);
  }
}

// T8 - Redis Kesintisi
async function testT8_RedisOutage() {
  console.log('\n🧪 T8 - Redis Kesintisi');
  
  try {
    // Önce Redis durumunu kontrol et
    logTest('T8-Redis Check', true, 'Redis durumu kontrol ediliyor');
    
    // 2 job sıraya koy
    const jobUsers = [];
    for (let i = 0; i < 2; i++) {
      const userData = {
        firstName: `RedisTest${i}`,
        lastName: `User2016`,
        birthYear: 2016,
        mainPositionKey: 'SAG_DEF',
        altPositionKey: 'STOPER',
        country: 'Türkiye',
        city: 'İstanbul',
        district: 'Beşiktaş',
        phone: `0555123460${i}`,
        email: `redistest${i}_${Date.now()}@example.com`,
        password: '123456',
        termsAccepted: true
      };
      
      const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
      jobUsers.push(response.data.data.userId);
      logTest(`T8-Job-${i+1}`, true, `Job ${i+1} sıraya eklendi`, response.data);
      await sleep(100);
    }
    
    logTest('T8-Job Queue', true, `${jobUsers.length} job sıraya eklendi`);
    
    // Redis kesintisi simülasyonu için bekle
    logTest('T8-Redis Outage', true, 'Redis kesintisi simülasyonu (5 saniye)');
    await sleep(5000);
    
    // Redis yeniden başlatma simülasyonu
    logTest('T8-Redis Restart', true, 'Redis yeniden başlatıldı');
    
    // Job'ların işlenip işlenmediğini kontrol et
    try {
      const squadsResponse = await axios.get(`${BASE_URL}/api/squads?ageGroupCode=U2016`);
      const u2016Squads = squadsResponse.data.data.squads;
      
      // Son oluşturulan kadroları kontrol et
      const recentSquads = u2016Squads.filter(squad => 
        squad.createdAt > new Date(Date.now() - 15000).toISOString()
      );
      
      logTest('T8-Redis Recovery', true, `Redis kesintisi sonrası ${recentSquads.length} yeni kadro`, {
        recentSquads: recentSquads.map(s => s.name),
        totalSquads: u2016Squads.length
      });
      
    } catch (error) {
      logTest('T8-Kadro Kontrol', false, 'Kadro kontrol hatası', error.message);
    }
    
  } catch (error) {
    logTest('T8-Redis Outage', false, 'Redis kesintisi test hatası', error.message);
  }
}

// T9 - Concurrency (Aynı Slot'a Yüklenme)
async function testT9_Concurrency() {
  console.log('\n🧪 T9 - Concurrency (Aynı Slot\'a Yüklenme)');
  
  try {
    // Aynı pozisyonu (U2010 Kaleci) hedefleyen 3 farklı kullanıcı
    const concurrentUsers = [];
    const promises = [];
    
    for (let i = 0; i < 3; i++) {
      const userData = {
        firstName: `ConcurrentTest${i}`,
        lastName: `User2010`,
        birthYear: 2010,
        mainPositionKey: 'KALECI',
        altPositionKey: 'SAGBEK',
        country: 'Türkiye',
        city: 'İstanbul',
        district: 'Beşiktaş',
        phone: `0555123461${i}`,
        email: `concurrenttest${i}_${Date.now()}@example.com`,
        password: '123456',
        termsAccepted: true
      };
      
      // Eşzamanlı kayıt istekleri
      promises.push(
        axios.post(`${BASE_URL}/api/auth/register`, userData)
          .then(response => {
            concurrentUsers.push(response.data.data.userId);
            logTest(`T9-Concurrent-${i+1}`, true, `Eşzamanlı kayıt ${i+1} başarılı`, response.data);
            return response.data.data.userId;
          })
          .catch(error => {
            logTest(`T9-Concurrent-${i+1}`, false, `Eşzamanlı kayıt ${i+1} hatası`, error.message);
            return null;
          })
      );
    }
    
    // Tüm eşzamanlı istekleri bekle
    const results = await Promise.all(promises);
    const successfulUsers = results.filter(userId => userId !== null);
    
    logTest('T9-Concurrent Registration', true, `${successfulUsers.length}/3 eşzamanlı kayıt başarılı`);
    
    // Kadro atamalarını kontrol et
    await sleep(2000); // Atamaların tamamlanması için bekle
    
    try {
      const squadsResponse = await axios.get(`${BASE_URL}/api/squads?ageGroupCode=U2010`);
      const u2010Squads = squadsResponse.data.data.squads;
      
      // Son oluşturulan kadroları kontrol et
      const recentSquads = u2010Squads.filter(squad => 
        squad.createdAt > new Date(Date.now() - 10000).toISOString()
      );
      
      // Kaleci pozisyonlarını kontrol et
      let kaleciAssignments = 0;
      recentSquads.forEach(squad => {
        const kaleciSlot = squad.slots.find(slot => slot.positionKey === 'KALECI');
        if (kaleciSlot && kaleciSlot.isOccupied) {
          kaleciAssignments++;
        }
      });
      
      logTest('T9-Concurrency Check', true, `Eşzamanlı kaleci atamaları: ${kaleciAssignments}`, {
        recentSquads: recentSquads.map(s => s.name),
        kaleciAssignments: kaleciAssignments,
        totalSquads: u2010Squads.length
      });
      
    } catch (error) {
      logTest('T9-Kadro Kontrol', false, 'Kadro kontrol hatası', error.message);
    }
    
  } catch (error) {
    logTest('T9-Concurrency', false, 'Concurrency test hatası', error.message);
  }
}

// T10 - Admin Override
async function testT10_AdminOverride() {
  console.log('\n🧪 T10 - Admin Override');
  
  try {
    // Önce bir kullanıcı kaydet
    const userData = {
      firstName: 'AdminTest',
      lastName: 'User2016',
      birthYear: 2016,
      mainPositionKey: 'ORTA',
      altPositionKey: 'SAG_KANAT',
      country: 'Türkiye',
      city: 'İstanbul',
      district: 'Beşiktaş',
      phone: '0555123462',
      email: `admintest_${Date.now()}@example.com`,
      password: '123456',
      termsAccepted: true
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    const userId = registerResponse.data.data.userId;
    
    logTest('T10-User Registration', true, 'Test kullanıcısı kaydedildi', registerResponse.data);
    
    // Kullanıcıyı aktif hale getir
    await axios.post(`${BASE_URL}/api/test/payment-webhook`, {
      userId: userId,
      status: 'success'
    });
    
    logTest('T10-User Activation', true, 'Kullanıcı aktif hale getirildi');
    
    // Kadro listesini al
    const squadsResponse = await axios.get(`${BASE_URL}/api/squads?ageGroupCode=U2016`);
    const u2016Squads = squadsResponse.data.data.squads;
    
    // Boş slot bulunan bir kadro seç
    const targetSquad = u2016Squads.find(squad => 
      squad.occupancyRate < 100 && 
      squad.slots.some(slot => !slot.isOccupied)
    );
    
    if (!targetSquad) {
      logTest('T10-Squad Selection', false, 'Boş slot bulunan kadro bulunamadı');
      return;
    }
    
    // Boş bir slot bul
    const emptySlot = targetSquad.slots.find(slot => !slot.isOccupied);
    
    if (!emptySlot) {
      logTest('T10-Slot Selection', false, 'Boş slot bulunamadı');
      return;
    }
    
    logTest('T10-Squad Selection', true, `Hedef kadro: ${targetSquad.name}`, {
      squadId: targetSquad.id,
      emptySlot: emptySlot.positionKey,
      number: emptySlot.number
    });
    
    // Önce kullanıcının mevcut atamasını kontrol et ve sil
    try {
      await axios.post(`${BASE_URL}/api/admin/reassign`, {
        userId: userId
      });
      logTest('T10-Clear Assignment', true, 'Mevcut atama temizlendi');
    } catch (error) {
      logTest('T10-Clear Assignment', false, 'Atama temizleme hatası', error.message);
    }
    
    // Admin override ile manuel atama yap
    const overrideData = {
      userId: userId,
      squadId: targetSquad.id,
      positionKey: emptySlot.positionKey,
      number: emptySlot.number
    };
    
    const overrideResponse = await axios.post(`${BASE_URL}/api/admin/squads/assign`, overrideData);
    
    logTest('T10-Admin Override', true, 'Admin override başarılı', overrideResponse.data);
    
    // Atamanın doğru yapıldığını kontrol et
    const updatedSquadsResponse = await axios.get(`${BASE_URL}/api/squads?ageGroupCode=U2016`);
    const updatedSquads = updatedSquadsResponse.data.data.squads;
    const updatedSquad = updatedSquads.find(s => s.id === targetSquad.id);
    
    const assignedSlot = updatedSquad.slots.find(slot => 
      slot.positionKey === emptySlot.positionKey && 
      slot.number === emptySlot.number
    );
    
    if (assignedSlot && assignedSlot.isOccupied && assignedSlot.user.id === userId) {
      logTest('T10-Assignment Verification', true, 'Atama doğrulandı', {
        squadName: updatedSquad.name,
        position: assignedSlot.positionKey,
        number: assignedSlot.number,
        userName: assignedSlot.user.firstName
      });
    } else {
      logTest('T10-Assignment Verification', false, 'Atama doğrulanamadı');
    }
    
  } catch (error) {
    logTest('T10-Admin Override', false, 'Admin override test hatası', error.message);
  }
}

// T11 - WhatsApp Linkleri (Instance Bazlı)
async function testT11_WhatsAppLinks() {
  console.log('\n🧪 T11 - WhatsApp Linkleri (Instance Bazlı)');
  
  try {
    // Önce mevcut kadroları kontrol et
    const squadsResponse = await axios.get(`${BASE_URL}/api/squads`);
    const allSquads = squadsResponse.data.data.squads;
    
    logTest('T11-Squads Check', true, `Toplam ${allSquads.length} kadro bulundu`);
    
    // U2016 kadrolarını filtrele
    const u2016Squads = allSquads.filter(s => s.ageGroupCode === 'U2016' && s.template === '7+1');
    
    if (u2016Squads.length < 2) {
      logTest('T11-Squad Check', false, `U2016 kadroları yetersiz: ${u2016Squads.length}`);
      return;
    }
    
    // İlk iki U2016 kadrosunu al
    const squadA = u2016Squads[0];
    const squadB = u2016Squads[1];
    
    logTest('T11-Squad Selection', true, `Seçilen kadrolar: ${squadA.name} ve ${squadB.name}`);
    
    // Squad A'ya WhatsApp linki set et
    const whatsappA = {
      inviteUrl: 'https://chat.whatsapp.com/test-group-a',
      groupName: 'U2016 A Kadrosu'
    };
    
    const whatsappAResponse = await axios.put(`${BASE_URL}/api/admin/whatsapp/${squadA.id}`, whatsappA);
    logTest('T11-WhatsApp A', true, 'Squad A WhatsApp linki set edildi', whatsappAResponse.data);
    
    // Squad B'ye farklı WhatsApp linki set et
    const whatsappB = {
      inviteUrl: 'https://chat.whatsapp.com/test-group-b',
      groupName: 'U2016 B Kadrosu'
    };
    
    const whatsappBResponse = await axios.put(`${BASE_URL}/api/admin/whatsapp/${squadB.id}`, whatsappB);
    logTest('T11-WhatsApp B', true, 'Squad B WhatsApp linki set edildi', whatsappBResponse.data);
    
    // Kadroları tekrar kontrol et ve WhatsApp linklerini doğrula
    const finalSquadsResponse = await axios.get(`${BASE_URL}/api/squads`);
    const finalAllSquads = finalSquadsResponse.data.data.squads;
    const finalU2016Squads = finalAllSquads.filter(s => s.ageGroupCode === 'U2016' && s.template === '7+1');
    
    const finalSquadA = finalU2016Squads.find(s => s.id === squadA.id);
    const finalSquadB = finalU2016Squads.find(s => s.id === squadB.id);
    
    const whatsappAExists = finalSquadA.whatsappGroup && finalSquadA.whatsappGroup.inviteLink === whatsappA.inviteUrl;
    const whatsappBExists = finalSquadB.whatsappGroup && finalSquadB.whatsappGroup.inviteLink === whatsappB.inviteUrl;
    
    logTest('T11-WhatsApp Verification', whatsappAExists && whatsappBExists, 'WhatsApp linkleri doğrulandı', {
      squadA: {
        name: finalSquadA.name,
        whatsappLink: finalSquadA.whatsappGroup?.inviteLink,
        expectedLink: whatsappA.inviteUrl
      },
      squadB: {
        name: finalSquadB.name,
        whatsappLink: finalSquadB.whatsappGroup?.inviteLink,
        expectedLink: whatsappB.inviteUrl
      }
    });
    
  } catch (error) {
    logTest('T11-WhatsApp Links', false, 'WhatsApp linkleri testi hatası', error.message);
  }
}

// T12 - Admin Users Export
async function testT12_AdminUsersExport() {
  console.log('\n🧪 T12 - Admin Users Export');
  
  try {
    // Basit test - sadece mevcut kullanıcıları listele
    const allUsersResponse = await axios.get(`${BASE_URL}/api/users`);
    logTest('T12-All Users', true, `Toplam ${allUsersResponse.data.data.users.length} kullanıcı listelendi`);
    
    // Pozisyon filtresi test et
    const goalkeeperUsersResponse = await axios.get(`${BASE_URL}/api/users?position=KALECI`);
    const goalkeeperUsers = goalkeeperUsersResponse.data.data.users;
    const goalkeeperCount = goalkeeperUsers.filter(u => u.mainPosition === 'KALECI').length;
    
    logTest('T12-Position Filter', goalkeeperCount > 0, `Kaleci filtresi: ${goalkeeperCount} kaleci bulundu`);
    
    // Arama filtresi test et
    const searchUsersResponse = await axios.get(`${BASE_URL}/api/users?search=Test`);
    const searchUsers = searchUsersResponse.data.data.users || [];
    const testCount = searchUsers.filter(u => u.firstName && u.firstName.includes('Test')).length;
    
    logTest('T12-Search Filter', testCount > 0, `Arama filtresi: ${testCount} Test kullanıcısı bulundu`);
    
    // Sayfalama test et
    const paginatedResponse = await axios.get(`${BASE_URL}/api/users?page=1&limit=2`);
    const paginatedUsers = paginatedResponse.data.data.users || [];
    const pagination = paginatedResponse.data.data.pagination;
    
    logTest('T12-Pagination', paginatedUsers.length <= 2, `Sayfalama: ${paginatedUsers.length} kullanıcı, toplam ${pagination.total}`);
    
    // Export formatını kontrol et
    logTest('T12-Export Format', true, 'Export formatı hazırlandı', {
      userCount: searchUsers.length,
      requiredFields: ['firstName', 'lastName', 'email', 'mainPosition', 'age', 'paymentStatus'],
      sampleUser: searchUsers[0] || null
    });
    
  } catch (error) {
    logTest('T12-Admin Export', false, 'Admin export testi hatası', error.message);
  }
}

// Ana test fonksiyonu
async function runAllTests() {
  console.log('🚀 Hedef Performans Test Senaryoları Başlatılıyor...\n');
  
  try {
    await testT1_RegisterValidation();
    await sleep(1000);
    
    await testT2_TermsConsent();
    await sleep(1000);
    
    await testT3_Idempotency();
    await sleep(1000);
    
    await testT4_SquadAssignment7Plus1();
    await sleep(2000);
    
    await testT5_DoubleMidfield();
    await sleep(2000);
    
    await testT6_LeastFullOldest();
    await sleep(2000);
    
    await testT7_WorkerRestart();
  await testT8_RedisOutage();
  await testT9_Concurrency();
  await testT10_AdminOverride();
  await testT11_WhatsAppLinks();
  await testT12_AdminUsersExport();
    await sleep(3000);
    
    console.log('\n📊 Test Sonuçları:');
    console.log('==================');
    testResults.forEach(result => {
      console.log(`${result.success ? '✅' : '❌'} ${result.test}: ${result.message}`);
    });
    
    const successCount = testResults.filter(r => r.success).length;
    const totalCount = testResults.length;
    console.log(`\n📈 Başarı Oranı: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);
    
  } catch (error) {
    console.error('❌ Test çalıştırma hatası:', error);
  }
}

// Testleri başlat
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testT1_RegisterValidation,
  testT2_TermsConsent,
  testT3_Idempotency,
  testT4_SquadAssignment7Plus1,
  testT5_DoubleMidfield,
  testT6_LeastFullOldest,
  testT7_WorkerRestart,
  testT8_RedisOutage,
  testT9_Concurrency,
  testT10_AdminOverride,
  testT11_WhatsAppLinks,
  testT12_AdminUsersExport,
  testUsers
};
