const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// U2016 ek test kullanıcıları (U2016-25 ile U2016-44 arası)
const additionalU2016Users = [
  { id: 'U2016-25', firstName: 'Enes', lastName: 'Korkut', email: 'u2016-25@hp2-test.com', phone: '+90 555 420 0025', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-26', firstName: 'Serhat', lastName: 'Demir', email: 'u2016-26@hp2-test.com', phone: '+90 555 420 0026', birthYear: 2016, mainPosition: 'SAG_DEF', altPosition: 'SOL_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-27', firstName: 'Doğan', lastName: 'Akın', email: 'u2016-27@hp2-test.com', phone: '+90 555 420 0027', birthYear: 2016, mainPosition: 'STOPER', altPosition: 'SAG_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-28', firstName: 'Arif', lastName: 'Çetin', email: 'u2016-28@hp2-test.com', phone: '+90 555 420 0028', birthYear: 2016, mainPosition: 'SOL_DEF', altPosition: 'STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-29', firstName: 'Murat', lastName: 'İpek', email: 'u2016-29@hp2-test.com', phone: '+90 555 420 0029', birthYear: 2016, mainPosition: 'ORTA', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-30', firstName: 'Efe', lastName: 'Karaca', email: 'u2016-30@hp2-test.com', phone: '+90 555 420 0030', birthYear: 2016, mainPosition: 'SAG_KANAT', altPosition: 'FORVET', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-31', firstName: 'Utku', lastName: 'Sezgin', email: 'u2016-31@hp2-test.com', phone: '+90 555 420 0031', birthYear: 2016, mainPosition: 'SOL_KANAT', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-32', firstName: 'Arda', lastName: 'Tamer', email: 'u2016-32@hp2-test.com', phone: '+90 555 420 0032', birthYear: 2016, mainPosition: 'FORVET', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-33', firstName: 'Batıkan', lastName: 'Er', email: 'u2016-33@hp2-test.com', phone: '+90 555 420 0033', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-34', firstName: 'Onur', lastName: 'Kaan', email: 'u2016-34@hp2-test.com', phone: '+90 555 420 0034', birthYear: 2016, mainPosition: 'SAG_DEF', altPosition: 'SOL_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-35', firstName: 'Bekir', lastName: 'Altun', email: 'u2016-35@hp2-test.com', phone: '+90 555 420 0035', birthYear: 2016, mainPosition: 'STOPER', altPosition: 'SAG_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-36', firstName: 'Sarp', lastName: 'Yalın', email: 'u2016-36@hp2-test.com', phone: '+90 555 420 0036', birthYear: 2016, mainPosition: 'SOL_DEF', altPosition: 'STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-37', firstName: 'Kıvanç', lastName: 'Erel', email: 'u2016-37@hp2-test.com', phone: '+90 555 420 0037', birthYear: 2016, mainPosition: 'ORTA', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-38', firstName: 'Eymen', lastName: 'Uçar', email: 'u2016-38@hp2-test.com', phone: '+90 555 420 0038', birthYear: 2016, mainPosition: 'SAG_KANAT', altPosition: 'FORVET', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-39', firstName: 'Bora', lastName: 'Özen', email: 'u2016-39@hp2-test.com', phone: '+90 555 420 0039', birthYear: 2016, mainPosition: 'SOL_KANAT', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-40', firstName: 'Selim', lastName: 'Vural', email: 'u2016-40@hp2-test.com', phone: '+90 555 420 0040', birthYear: 2016, mainPosition: 'FORVET', altPosition: 'SAG_KANAT', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-41', firstName: 'Erdem', lastName: 'Soylu', email: 'u2016-41@hp2-test.com', phone: '+90 555 420 0041', birthYear: 2016, mainPosition: 'KALECI', altPosition: 'ORTA', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-42', firstName: 'Cemal', lastName: 'Dinç', email: 'u2016-42@hp2-test.com', phone: '+90 555 420 0042', birthYear: 2016, mainPosition: 'SAG_DEF', altPosition: 'SOL_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-43', firstName: 'İlker', lastName: 'Arı', email: 'u2016-43@hp2-test.com', phone: '+90 555 420 0043', birthYear: 2016, mainPosition: 'STOPER', altPosition: 'SAG_DEF', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' },
  { id: 'U2016-44', firstName: 'Akın', lastName: 'Doğu', email: 'u2016-44@hp2-test.com', phone: '+90 555 420 0044', birthYear: 2016, mainPosition: 'SOL_DEF', altPosition: 'STOPER', country: 'Türkiye', city: 'İstanbul', district: 'Maltepe', team: 'Hedef SK', league: 'U9', password: 'Test!12345' }
]

async function addAdditionalU2016Users() {
  console.log('🚀 U2016 ek test kullanıcıları ekleniyor...')
  
  for (const userData of additionalU2016Users) {
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
  for (const userData of additionalU2016Users) {
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

addAdditionalU2016Users()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
