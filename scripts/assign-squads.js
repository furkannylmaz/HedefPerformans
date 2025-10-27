const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function assignUsersToSquads() {
  console.log('🎯 Kadro atamaları yapılıyor...')
  
  // Tüm kullanıcıları al
  const users = await prisma.user.findMany({
    include: {
      memberProfile: true
    }
  })
  
  console.log(`📊 ${users.length} kullanıcı bulundu`)
  
  // Kadro atama fonksiyonunu import et
  const { autoAssignUser } = require('./lib/squads/assign')
  
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

assignUsersToSquads()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
