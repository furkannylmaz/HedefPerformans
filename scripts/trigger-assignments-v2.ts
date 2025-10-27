// Script: Trigger Assignments V2
// Hedef Performans - Direkt autoAssignUser çağrısı

import { PrismaClient } from '@prisma/client'
import { autoAssignUser } from '../lib/squads/assign'

const prisma = new PrismaClient()

async function triggerAssignments() {
  console.log('🔄 Kadro atamaları yapılıyor...\n')
  
  try {
    // Kullanıcıları al
    const users = await prisma.user.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        memberProfile: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    
    console.log(`📊 ${users.length} kullanıcı bulundu\n`)
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      if (!user.memberProfile) continue
      
      console.log(`${i + 1}. ${user.firstName} ${user.lastName} (${user.memberProfile.mainPositionKey}/${user.memberProfile.altPositionKey})`)
      
      try {
        // Direkt autoAssignUser çağrısı
        const assignment = await autoAssignUser({
          userId: user.id,
          birthYear: user.memberProfile.birthYear,
          mainPositionKey: user.memberProfile.mainPositionKey,
          altPositionKey: user.memberProfile.altPositionKey || undefined
        })
        
        console.log(`   ✅ Atama: ${assignment.squad.name} - ${assignment.positionKey} #${assignment.number}`)
      } catch (error: any) {
        console.log(`   ❌ Hata: ${error.message}`)
      }
      
      // Kısa gecikme
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log('\n✅ Tüm atamalar tamamlandı')
    
  } catch (error: any) {
    console.error('❌ Hata:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

triggerAssignments()

