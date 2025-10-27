// Clean and Reset Test Users
// Hedef Performans - Kadro Atama Sistemi

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Cleaning all users, squads, and assignments...')
  
  // 1. Tüm atamaları sil
  const deletedAssignments = await prisma.squadAssignment.deleteMany({})
  console.log(`✅ Deleted ${deletedAssignments.count} assignments`)
  
  // 2. Tüm kadroları sil
  const deletedSquads = await prisma.squad.deleteMany({})
  console.log(`✅ Deleted ${deletedSquads.count} squads`)
  
  // 3. Tüm üye profillerini sil
  const deletedProfiles = await prisma.memberProfile.deleteMany({})
  console.log(`✅ Deleted ${deletedProfiles.count} profiles`)
  
  // 4. Tüm kullanıcıları sil
  const deletedUsers = await prisma.user.deleteMany({})
  console.log(`✅ Deleted ${deletedUsers.count} users`)
  
  console.log('\n🎯 Creating 3 test users for strict rules test...')
  
  // Test User 1: Ana'ya atanacak
  const user1 = await prisma.user.create({
    data: {
      email: 'test-user-1@test.com',
      password: '$2a$10$dummyhash',
      firstName: 'Test',
      lastName: 'User 1',
      phone: '+905555555001',
      status: 'ACTIVE'
    }
  })
  
  const profile1 = await prisma.memberProfile.create({
    data: {
      userId: user1.id,
      firstName: 'Test',
      lastName: 'User 1',
      birthYear: 2016,
      mainPositionKey: 'STOPER',
      altPositionKey: 'SOL_DEF',
      country: 'Turkey',
      city: 'Istanbul',
      district: 'Kadikoy',
      phone: '+905555555001',
      team: 'Test Team',
      league: 'U2016'
    }
  })
  
  console.log(`✅ Created User 1: ${user1.email} - Should be assigned to MAIN position`)
  
  // Test User 2: Alt'a atanacak (Ana dolu olacak)
  const user2 = await prisma.user.create({
    data: {
      email: 'test-user-2@test.com',
      password: '$2a$10$dummyhash',
      firstName: 'Test',
      lastName: 'User 2',
      phone: '+905555555002',
      status: 'ACTIVE'
    }
  })
  
  const profile2 = await prisma.memberProfile.create({
    data: {
      userId: user2.id,
      firstName: 'Test',
      lastName: 'User 2',
      birthYear: 2016,
      mainPositionKey: 'STOPER',
      altPositionKey: 'SOL_DEF',
      country: 'Turkey',
      city: 'Istanbul',
      district: 'Kadikoy',
      phone: '+905555555002',
      team: 'Test Team',
      league: 'U2016'
    }
  })
  
  console.log(`✅ Created User 2: ${user2.email} - Should be assigned to ALT position (MAIN will be full)`)
  
  // Test User 3: Yeni kadro açılacak (Ana+Alt dolu olacak)
  const user3 = await prisma.user.create({
    data: {
      email: 'test-user-3@test.com',
      password: '$2a$10$dummyhash',
      firstName: 'Test',
      lastName: 'User 3',
      phone: '+905555555003',
      status: 'ACTIVE'
    }
  })
  
  const profile3 = await prisma.memberProfile.create({
    data: {
      userId: user3.id,
      firstName: 'Test',
      lastName: 'User 3',
      birthYear: 2016,
      mainPositionKey: 'STOPER',
      altPositionKey: 'SOL_DEF',
      country: 'Turkey',
      city: 'Istanbul',
      district: 'Kadikoy',
      phone: '+905555555003',
      team: 'Test Team',
      league: 'U2016'
    }
  })
  
  console.log(`✅ Created User 3: ${user3.email} - Should create NEW SQUAD (MAIN+ALT will be full)`)
  
  console.log('\n🎯 Testing auto-assignment...')
  
  // Test User 1 → ANA'ya atanır
  console.log('\n--- Test 1: Auto-assign User 1 to MAIN position ---')
  try {
    const { autoAssignUser } = await import('../lib/squads/assign')
    const assignment1 = await autoAssignUser({
      userId: user1.id,
      birthYear: 2016,
      mainPositionKey: 'STOPER',
      altPositionKey: 'SOL_DEF'
    })
    console.log(`✅ User 1 assigned to ${assignment1.squadId}`)
  } catch (error: any) {
    console.error(`❌ User 1 assignment failed:`, error.message)
  }
  
  // Test User 2 → ALT'a atanır (ANA dolu)
  console.log('\n--- Test 2: Auto-assign User 2 to ALT position (MAIN is full) ---')
  try {
    const { autoAssignUser } = await import('../lib/squads/assign')
    const assignment2 = await autoAssignUser({
      userId: user2.id,
      birthYear: 2016,
      mainPositionKey: 'STOPER',
      altPositionKey: 'SOL_DEF'
    })
    console.log(`✅ User 2 assigned to ${assignment2.squadId}`)
  } catch (error: any) {
    console.error(`❌ User 2 assignment failed:`, error.message)
  }
  
  // Test User 3 → Yeni kadro açılır
  console.log('\n--- Test 3: Auto-assign User 3 - NEW SQUAD will be created ---')
  try {
    const { autoAssignUser } = await import('../lib/squads/assign')
    const assignment3 = await autoAssignUser({
      userId: user3.id,
      birthYear: 2016,
      mainPositionKey: 'STOPER',
      altPositionKey: 'SOL_DEF'
    })
    console.log(`✅ User 3 assigned to ${assignment3.squadId}`)
  } catch (error: any) {
    console.error(`❌ User 3 assignment failed:`, error.message)
  }
  
  // Final durum kontrolü
  console.log('\n📊 Final Status:')
  const squads = await prisma.squad.findMany({
    include: {
      assignments: {
        include: {
          user: true
        }
      }
    }
  })
  
  for (const squad of squads) {
    console.log(`\n${squad.name}:`)
    for (const assignment of squad.assignments) {
      console.log(`  - ${assignment.user.firstName} ${assignment.user.lastName} → ${assignment.positionKey} (#${assignment.number})`)
    }
  }
  
  console.log('\n✅ Test completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


