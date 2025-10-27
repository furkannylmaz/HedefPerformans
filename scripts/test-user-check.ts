// Script: Test User Check
// Hedef Performans - Kullanıcı Kontrolü

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  console.log('📊 Kullanıcıları kontrol ediyorum...\n')
  
  try {
    // Tüm kullanıcıları getir
    const users = await prisma.user.findMany({
      include: {
        memberProfile: true,
        squadAssignments: {
          include: {
            squad: true
          }
        }
      }
    })
    
    console.log(`✅ Toplam ${users.length} kullanıcı bulundu\n`)
    
    for (const user of users) {
      console.log(`👤 ${user.firstName} ${user.lastName} (${user.email})`)
      console.log(`   Status: ${user.status}`)
      if (user.memberProfile) {
        console.log(`   Doğum Yılı: ${user.memberProfile.birthYear}`)
        console.log(`   Ana Mevki: ${user.memberProfile.mainPositionKey}`)
        console.log(`   Yedek Mevki: ${user.memberProfile.altPositionKey}`)
      }
      if (user.squadAssignments.length > 0) {
        const assignment = user.squadAssignments[0]
        console.log(`   ⚽ Kadro: ${assignment.squad.name}`)
        console.log(`   Pozisyon: ${assignment.positionKey}`)
        console.log(`   Forma: #${assignment.number}`)
      } else {
        console.log(`   ⚠️  Kadro ataması yok`)
      }
      console.log('')
    }
    
  } catch (error: any) {
    console.error('❌ Hata:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()

