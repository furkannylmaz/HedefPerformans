const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

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

async function assignUsersToSquads() {
  console.log('🎯 Kadro atamaları yapılıyor...')
  
  const users = await prisma.user.findMany({
    include: {
      memberProfile: true
    }
  })
  
  console.log(`📊 ${users.length} kullanıcı bulundu`)
  
  for (const user of users) {
    try {
      if (user.memberProfile) {
        console.log(`🎯 ${user.memberProfile.firstName} ${user.memberProfile.lastName} kadroya atanıyor...`)
        
        const assignment = await autoAssignUser({
          userId: user.id,
          birthYear: user.memberProfile.birthYear,
          mainPositionKey: user.memberProfile.mainPositionKey,
          altPositionKey: user.memberProfile.altPositionKey
        })
        
        console.log(`✅ ${user.memberProfile.firstName} ${user.memberProfile.lastName} kadroya atandı: ${assignment.positionKey}`)
      }
      
    } catch (error) {
      console.error(`❌ ${user.firstName} ${user.lastName} kadroya atanırken hata:`, error.message)
    }
  }
  
  console.log('\n📊 Özet:')
  const totalUsers = await prisma.user.count()
  const totalSquads = await prisma.squad.count()
  const totalAssignments = await prisma.squadAssignment.count()
  
  console.log(`👥 Toplam kullanıcı: ${totalUsers}`)
  console.log(`🏟️ Toplam kadro: ${totalSquads}`)
  console.log(`🎯 Toplam atama: ${totalAssignments}`)
  
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

assignUsersToSquads()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
