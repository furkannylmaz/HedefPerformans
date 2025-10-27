const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// U2010 test kullanıcıları
const u2010Users = [
  { id: 'U2010-01', firstName: 'Mert', lastName: 'Yıldız', email: 'u2010-01@hp-test.com', phone: '+90 555 410 0001', birthYear: 2010, mainPosition: 'KALECI', altPosition: 'SAG_STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-02', firstName: 'Baran', lastName: 'Şen', email: 'u2010-02@hp-test.com', phone: '+90 555 410 0002', birthYear: 2010, mainPosition: 'SAGBEK', altPosition: 'SOLBEK', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-03', firstName: 'Caner', lastName: 'Polat', email: 'u2010-03@hp-test.com', phone: '+90 555 410 0003', birthYear: 2010, mainPosition: 'SAG_STOPER', altPosition: 'SOL_STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-04', firstName: 'Serkan', lastName: 'Koç', email: 'u2010-04@hp-test.com', phone: '+90 555 410 0004', birthYear: 2010, mainPosition: 'SOL_STOPER', altPosition: 'SAG_STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-05', firstName: 'Yunus', lastName: 'Aksoy', email: 'u2010-05@hp-test.com', phone: '+90 555 410 0005', birthYear: 2010, mainPosition: 'SOLBEK', altPosition: 'SAGBEK', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-06', firstName: 'Talha', lastName: 'Güler', email: 'u2010-06@hp-test.com', phone: '+90 555 410 0006', birthYear: 2010, mainPosition: 'ONLIBERO', altPosition: 'ORTA_8', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-07', firstName: 'Furkan', lastName: 'Sezer', email: 'u2010-07@hp-test.com', phone: '+90 555 410 0007', birthYear: 2010, mainPosition: 'ORTA_8', altPosition: 'ORTA_10', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-08', firstName: 'Hakan', lastName: 'Yurt', email: 'u2010-08@hp-test.com', phone: '+90 555 410 0008', birthYear: 2010, mainPosition: 'ORTA_10', altPosition: 'ORTA_8', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-09', firstName: 'Tolga', lastName: 'Demirtaş', email: 'u2010-09@hp-test.com', phone: '+90 555 410 0009', birthYear: 2010, mainPosition: 'SAG_KANAT', altPosition: 'FORVET', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-10', firstName: 'Umut', lastName: 'Yalçın', email: 'u2010-10@hp-test.com', phone: '+90 555 410 0010', birthYear: 2010, mainPosition: 'SOL_KANAT', altPosition: 'ORTA_10', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-11', firstName: 'Berk', lastName: 'Tan', email: 'u2010-11@hp-test.com', phone: '+90 555 410 0011', birthYear: 2010, mainPosition: 'FORVET', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-12', firstName: 'Kaan', lastName: 'Özdemir', email: 'u2010-12@hp-test.com', phone: '+90 555 410 0012', birthYear: 2010, mainPosition: 'KALECI', altPosition: 'SAG_STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-13', firstName: 'Emirhan', lastName: 'Ata', email: 'u2010-13@hp-test.com', phone: '+90 555 410 0013', birthYear: 2010, mainPosition: 'SAGBEK', altPosition: 'SOLBEK', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-14', firstName: 'Yiğit', lastName: 'Kara', email: 'u2010-14@hp-test.com', phone: '+90 555 410 0014', birthYear: 2010, mainPosition: 'SAG_STOPER', altPosition: 'SOL_STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-15', firstName: 'Halil', lastName: 'Demir', email: 'u2010-15@hp-test.com', phone: '+90 555 410 0015', birthYear: 2010, mainPosition: 'SOL_STOPER', altPosition: 'SAG_STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-16', firstName: 'Alp', lastName: 'Can', email: 'u2010-16@hp-test.com', phone: '+90 555 410 0016', birthYear: 2010, mainPosition: 'SOLBEK', altPosition: 'SAGBEK', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-17', firstName: 'Deniz', lastName: 'Korkmaz', email: 'u2010-17@hp-test.com', phone: '+90 555 410 0017', birthYear: 2010, mainPosition: 'ONLIBERO', altPosition: 'ORTA_10', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-18', firstName: 'Batuhan', lastName: 'Sarı', email: 'u2010-18@hp-test.com', phone: '+90 555 410 0018', birthYear: 2010, mainPosition: 'ORTA_8', altPosition: 'ORTA_10', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-19', firstName: 'Yunus', lastName: 'Çiftçi', email: 'u2010-19@hp-test.com', phone: '+90 555 410 0019', birthYear: 2010, mainPosition: 'ORTA_10', altPosition: 'ONLIBERO', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-20', firstName: 'Sami', lastName: 'Uçar', email: 'u2010-20@hp-test.com', phone: '+90 555 410 0020', birthYear: 2010, mainPosition: 'SAG_KANAT', altPosition: 'SOL_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-21', firstName: 'Oğuz', lastName: 'Mete', email: 'u2010-21@hp-test.com', phone: '+90 555 410 0021', birthYear: 2010, mainPosition: 'SOL_KANAT', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' },
  { id: 'U2010-22', firstName: 'Onur', lastName: 'Çetin', email: 'u2010-22@hp-test.com', phone: '+90 555 410 0022', birthYear: 2010, mainPosition: 'FORVET', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Pendik Gençlik', league: 'U14', password: 'Test!12345' }
]

async function addU2010Users() {
  console.log('🚀 U2010 test kullanıcıları ekleniyor...')
  
  for (const userData of u2010Users) {
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
          status: 'PAID',
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
  
  // Kadro atama fonksiyonlarını doğrudan buraya kopyalayalım
  const { getPositionsForTemplate, getNumberForPosition } = require('./positions')

  function getTemplateForBirthYear(birthYear) {
    if (birthYear >= 2014 && birthYear <= 2018) {
      return '7+1'
    } else if (birthYear >= 2006 && birthYear <= 2013) {
      return '10+1'
    }
    throw new Error(`Desteklenmeyen doğum yılı: ${birthYear}`)
  }

  function getAgeGroupCode(birthYear) {
    return `U${birthYear}`
  }

  async function listSquadsByAgeGroupAndTemplate(ageGroupCode, template) {
    const squads = await prisma.squad.findMany({
      where: {
        ageGroupCode,
        template
      },
      include: {
        assignments: true,
        _count: {
          select: { assignments: true }
        }
      },
      orderBy: [
        { createdAt: 'asc' },
        { instance: 'asc' }
      ]
    })

    const totalSlots = getPositionsForTemplate(template).length
    
    return squads.sort((a, b) => {
      const aOccupancyRate = a._count.assignments / totalSlots
      const bOccupancyRate = b._count.assignments / totalSlots
      
      if (aOccupancyRate !== bOccupancyRate) {
        return aOccupancyRate - bOccupancyRate
      }
      
      if (a.createdAt.getTime() !== b.createdAt.getTime()) {
        return a.createdAt.getTime() - b.createdAt.getTime()
      }
      
      return a.instance.localeCompare(b.instance)
    })
  }

  function findEmptySlot(squad, positionKey) {
    const template = squad.template
    const positions = getPositionsForTemplate(template)
    const position = positions.find(p => p.positionKey === positionKey)
    
    if (!position) return null

    const existingAssignment = squad.assignments.find(
      (assignment) => assignment.positionKey === positionKey
    )

    return existingAssignment ? null : position.number
  }

  async function createNewSquadInstance(ageGroupCode, template) {
    const existingSquads = await prisma.squad.findMany({
      where: { ageGroupCode, template },
      select: { instance: true }
    })

    const instances = existingSquads.map(s => s.instance).sort()
    let nextInstance = 'A'
    
    if (instances.length > 0) {
      const lastInstance = instances[instances.length - 1]
      nextInstance = String.fromCharCode(lastInstance.charCodeAt(0) + 1)
    }

    const name = `${ageGroupCode} ${template} ${nextInstance}`

    const squad = await prisma.squad.create({
      data: {
        ageGroupCode,
        template,
        instance: nextInstance,
        name
      }
    })

    return squad
  }

  async function assignUserToSlotTx(params) {
    return await prisma.$transaction(async (tx) => {
      try {
        const squad = await tx.squad.findUnique({
          where: { id: params.squadId },
          select: { ageGroupCode: true }
        })

        if (!squad) {
          throw new Error('Squad bulunamadı')
        }

        const assignment = await tx.squadAssignment.create({
          data: {
            squadId: params.squadId,
            userId: params.userId,
            ageGroupCode: squad.ageGroupCode,
            positionKey: params.positionKey,
            number: params.number,
            source: params.source
          }
        })

        return assignment
      } catch (error) {
        if (error.code === 'P2002') {
          throw new Error('SLOT_OCCUPIED')
        }
        throw error
      }
    })
  }

  async function autoAssignUser(params) {
    const { userId, birthYear, mainPositionKey, altPositionKey } = params
    
    const template = getTemplateForBirthYear(birthYear)
    const ageGroupCode = getAgeGroupCode(birthYear)

    console.log(`[ASSIGN-DEBUG] Input: {userId: ${userId}, birthYear: ${birthYear}, mainPositionKey: ${mainPositionKey}, altPositionKey: ${altPositionKey}}`)
    console.log(`[ASSIGN-DEBUG] Computed: {ageGroupCode: ${ageGroupCode}, template: ${template}}`)

    const existingAssignment = await prisma.squadAssignment.findFirst({
      where: {
        userId,
        ageGroupCode
      },
      include: {
        squad: true
      }
    })

    if (existingAssignment) {
      console.log(`[ASSIGN-DEBUG] Kullanıcı ${userId} zaten ${ageGroupCode} yaş grubunda atanmış`)
      return existingAssignment
    }

    const squads = await listSquadsByAgeGroupAndTemplate(ageGroupCode, template)
    
    console.log(`[ASSIGN-DEBUG] Squad listesi (${squads.length} kadro):`)
    squads.forEach((squad, index) => {
      const filledCount = squad._count.assignments
      const totalSlots = getPositionsForTemplate(template).length
      console.log(`[ASSIGN-DEBUG] ${index + 1}. ${squad.name} (${squad.instance}) - ${filledCount}/${totalSlots} slots - Created: ${squad.createdAt.toISOString()}`)
    })

    for (const squad of squads) {
      const mainAvailable = findEmptySlot(squad, mainPositionKey) !== null
      const altAvailable = altPositionKey ? findEmptySlot(squad, altPositionKey) !== null : false
      console.log(`[ASSIGN-DEBUG] ${squad.name}: main slot available? ${mainAvailable}, alt slot available? ${altAvailable}`)
      
      const mainEmptySlot = findEmptySlot(squad, mainPositionKey)
      if (mainEmptySlot) {
        try {
          const assignment = await assignUserToSlotTx({
            userId,
            squadId: squad.id,
            positionKey: mainPositionKey,
            number: mainEmptySlot,
            source: 'AUTO'
          })
          console.log(`[ASSIGN-DEBUG] REASON: 'MAIN' - ANA mevki ataması: ${userId} → ${squad.name} (${mainPositionKey})`)
          return assignment
        } catch (error) {
          if (error.message === 'SLOT_OCCUPIED') {
            continue
          }
          throw error
        }
      }
      
      if (altPositionKey) {
        const altEmptySlot = findEmptySlot(squad, altPositionKey)
        if (altEmptySlot) {
          try {
            const assignment = await assignUserToSlotTx({
              userId,
              squadId: squad.id,
              positionKey: altPositionKey,
              number: altEmptySlot,
              source: 'AUTO'
            })
            console.log(`[ASSIGN-DEBUG] REASON: 'ALT' - YEDEK mevki ataması: ${userId} → ${squad.name} (${altPositionKey})`)
            return assignment
          } catch (error) {
            if (error.message === 'SLOT_OCCUPIED') {
              continue
            }
            throw error
          }
        }
      }
    }

    console.log(`[ASSIGN-DEBUG] REASON: 'NEW_SQUAD' - Hiçbir kadroda slot bulunamadı, yeni kadro oluşturuluyor`)
    const newSquad = await createNewSquadInstance(ageGroupCode, template)
    const mainPositionNumber = getNumberForPosition(template, mainPositionKey)
    
    if (!mainPositionNumber) {
      throw new Error(`Geçersiz pozisyon: ${mainPositionKey}`)
    }

    const assignment = await assignUserToSlotTx({
      userId,
      squadId: newSquad.id,
      positionKey: mainPositionKey,
      number: mainPositionNumber,
      source: 'AUTO'
    })

    console.log(`[ASSIGN-DEBUG] REASON: 'NEW_SQUAD' - Yeni kadro ataması: ${userId} → ${newSquad.name} (${mainPositionKey})`)
    return assignment
  }
  
  // Kadro atamalarını yap
  for (const userData of u2010Users) {
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

addU2010Users()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
