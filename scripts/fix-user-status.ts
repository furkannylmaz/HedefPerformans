// Script: Fix User Status
// Hedef Performans - Kullanıcı Durumunu Düzelt

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixUserStatus() {
  console.log('🔧 Kullanıcı durumlarını düzeltiyorum...\n')
  
  try {
    // PAID olan kullanıcıları ACTIVE yap
    const result = await prisma.user.updateMany({
      where: {
        status: 'PAID'
      },
      data: {
        status: 'ACTIVE'
      }
    })
    
    console.log(`✅ ${result.count} kullanıcı durumu güncellendi`)
    
  } catch (error: any) {
    console.error('❌ Hata:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

fixUserStatus()

