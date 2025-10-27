const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Test kullanıcıları
const testUsers = [
  { id: 'U2016-01', firstName: 'Ali', lastName: 'Yılmaz', email: 'u2016-01@hp-test.com', phone: '+90 555 400 0001', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-02', firstName: 'Ahmet', lastName: 'Demir', email: 'u2016-02@hp-test.com', phone: '+90 555 400 0002', birthYear: 2016, mainPosition: 'SAG_DEF', altPosition: 'SOL_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-03', firstName: 'Mehmet', lastName: 'Kaya', email: 'u2016-03@hp-test.com', phone: '+90 555 400 0003', birthYear: 2016, mainPosition: 'STOPER', altPosition: 'SAG_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-04', firstName: 'Hasan', lastName: 'Çelik', email: 'u2016-04@hp-test.com', phone: '+90 555 400 0004', birthYear: 2016, mainPosition: 'SOL_DEF', altPosition: 'STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-05', firstName: 'Burak', lastName: 'Aydın', email: 'u2016-05@hp-test.com', phone: '+90 555 400 0005', birthYear: 2016, mainPosition: 'ORTA', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-06', firstName: 'Kerem', lastName: 'Arslan', email: 'u2016-06@hp-test.com', phone: '+90 555 400 0006', birthYear: 2016, mainPosition: 'SAG_KANAT', altPosition: 'FORVET', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-07', firstName: 'Can', lastName: 'Korkmaz', email: 'u2016-07@hp-test.com', phone: '+90 555 400 0007', birthYear: 2016, mainPosition: 'SOL_KANAT', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-08', firstName: 'Emir', lastName: 'Öztürk', email: 'u2016-08@hp-test.com', phone: '+90 555 400 0008', birthYear: 2016, mainPosition: 'FORVET', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-09', firstName: 'Musa', lastName: 'Koç', email: 'u2016-09@hp-test.com', phone: '+90 555 400 0009', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-10', firstName: 'Okan', lastName: 'Baş', email: 'u2016-10@hp-test.com', phone: '+90 555 400 0010', birthYear: 2016, mainPosition: 'SAG_DEF', altPosition: 'SOL_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-11', firstName: 'Cem', lastName: 'Özkan', email: 'u2016-11@hp-test.com', phone: '+90 555 400 0011', birthYear: 2016, mainPosition: 'STOPER', altPosition: 'SAG_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-12', firstName: 'Hasan', lastName: 'Erel', email: 'u2016-12@hp-test.com', phone: '+90 555 400 0012', birthYear: 2016, mainPosition: 'SOL_DEF', altPosition: 'STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-13', firstName: 'Rıza', lastName: 'Yıldırım', email: 'u2016-13@hp-test.com', phone: '+90 555 400 0013', birthYear: 2016, mainPosition: 'ORTA', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-14', firstName: 'Eren', lastName: 'Şahin', email: 'u2016-14@hp-test.com', phone: '+90 555 400 0014', birthYear: 2016, mainPosition: 'SAG_KANAT', altPosition: 'FORVET', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-15', firstName: 'Mahir', lastName: 'Bulut', email: 'u2016-15@hp-test.com', phone: '+90 555 400 0015', birthYear: 2016, mainPosition: 'SOL_KANAT', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-16', firstName: 'Tuna', lastName: 'Sezer', email: 'u2016-16@hp-test.com', phone: '+90 555 400 0016', birthYear: 2016, mainPosition: 'FORVET', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-17', firstName: 'Yasin', lastName: 'Kurt', email: 'u2016-17@hp-test.com', phone: '+90 555 400 0017', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-18', firstName: 'Alperen', lastName: 'Koç', email: 'u2016-18@hp-test.com', phone: '+90 555 400 0018', birthYear: 2016, mainPosition: 'SAG_DEF', altPosition: 'SOL_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-19', firstName: 'Selçuk', lastName: 'Erdem', email: 'u2016-19@hp-test.com', phone: '+90 555 400 0019', birthYear: 2016, mainPosition: 'STOPER', altPosition: 'SAG_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-20', firstName: 'Orhun', lastName: 'Yalçın', email: 'u2016-20@hp-test.com', phone: '+90 555 400 0020', birthYear: 2016, mainPosition: 'SOL_DEF', altPosition: 'STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-21', firstName: 'Hakkı', lastName: 'Öz', email: 'u2016-21@hp-test.com', phone: '+90 555 400 0021', birthYear: 2016, mainPosition: 'ORTA', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-22', firstName: 'Görkem', lastName: 'Tan', email: 'u2016-22@hp-test.com', phone: '+90 555 400 0022', birthYear: 2016, mainPosition: 'SAG_KANAT', altPosition: 'FORVET', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-23', firstName: 'Serdar', lastName: 'Akın', email: 'u2016-23@hp-test.com', phone: '+90 555 400 0023', birthYear: 2016, mainPosition: 'SOL_KANAT', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-24', firstName: 'Eray', lastName: 'Sezgin', email: 'u2016-24@hp-test.com', phone: '+90 555 400 0024', birthYear: 2016, mainPosition: 'FORVET', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' }
]

async function addTestUsers() {
  console.log('🚀 Test kullanıcıları ekleniyor...')
  
  for (const userData of testUsers) {
    try {
      console.log(`📝 ${userData.id} - ${userData.firstName} ${userData.lastName} ekleniyor...`)
      
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      
      // Kullanıcıyı oluştur
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          role: 'MEMBER',
          status: 'PAID', // Ödeme yapılmış olarak işaretle
          memberProfile: {
            create: {
              firstName: userData.firstName,
              lastName: userData.lastName,
              birthYear: userData.birthYear,
              mainPositionKey: userData.mainPosition,
              altPositionKey: userData.altPosition,
              country: userData.country,
              city: userData.city,
              district: userData.district,
              phone: userData.phone,
              team: userData.team,
              league: userData.league
            }
          }
        }
      })
      
      console.log(`✅ ${userData.id} - ${userData.firstName} ${userData.lastName} başarıyla eklendi (ID: ${user.id})`)
      
    } catch (error) {
      console.error(`❌ ${userData.id} - ${userData.firstName} ${userData.lastName} eklenirken hata:`, error.message)
    }
  }
  
  console.log('\n🎯 Kadro atamaları yapılıyor...')
  
  // Kadro atamalarını yap
  const { autoAssignUser } = require('./lib/squads/assign')
  
  for (const userData of testUsers) {
    try {
      // Kullanıcıyı bul
      const user = await prisma.user.findUnique({
        where: { email: userData.email }
      })
      
      if (user) {
        console.log(`🎯 ${userData.id} - ${userData.firstName} ${userData.lastName} kadroya atanıyor...`)
        
        const assignment = await autoAssignUser({
          userId: user.id,
          birthYear: userData.birthYear,
          mainPositionKey: userData.mainPosition,
          altPositionKey: userData.altPosition
        })
        
        console.log(`✅ ${userData.id} - ${userData.firstName} ${userData.lastName} kadroya atandı: ${assignment.positionKey}`)
      }
      
    } catch (error) {
      console.error(`❌ ${userData.id} - ${userData.firstName} ${userData.lastName} kadroya atanırken hata:`, error.message)
    }
  }
  
  console.log('\n📊 Özet:')
  const totalUsers = await prisma.user.count()
  const totalSquads = await prisma.squad.count()
  const totalAssignments = await prisma.squadAssignment.count()
  
  console.log(`👥 Toplam kullanıcı: ${totalUsers}`)
  console.log(`🏟️ Toplam kadro: ${totalSquads}`)
  console.log(`🎯 Toplam atama: ${totalAssignments}`)
  
  // Kadro detaylarını göster
  const squads = await prisma.squad.findMany({
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
    }
  })
  
  console.log('\n🏟️ Kadro Detayları:')
  squads.forEach(squad => {
    console.log(`\n📋 ${squad.name}:`)
    squad.assignments.forEach(assignment => {
      const profile = assignment.user.memberProfile
      console.log(`  ${assignment.positionKey} - ${profile.firstName} ${profile.lastName}`)
    })
  })
}

addTestUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
