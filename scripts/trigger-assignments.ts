// Script: Trigger Assignments for 3 Users
// Hedef Performans - Kadro Atamalarını Tetikle

import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

async function triggerAssignments() {
  console.log('🔄 Kadro atamaları tetikleniyor...\n')
  
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
        // Test webhook endpoint'ini kullanarak atamayı tetikle
        const response = await axios.post('http://localhost:3000/api/test/payment-webhook', {
          userId: user.id,
          success: true
        })
        
        if (response.data.success) {
          console.log(`   ✅ Atama başarılı`)
        } else {
          console.log(`   ⚠️  Atama: ${response.data.message}`)
        }
      } catch (error: any) {
        console.log(`   ❌ Hata: ${error.message}`)
      }
      
      // Kısa gecikme
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log('\n✅ Tüm atamalar tamamlandı')
    
  } catch (error: any) {
    console.error('❌ Hata:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

triggerAssignments()

