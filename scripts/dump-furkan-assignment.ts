// Script: ASSIGN-DUMP-FURKAN
// Hedef Performans - Furkan Yılmaz'ın atama sürecini incele

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function dumpFurkanAssignment() {
  console.log('🔍 Furkan Yılmaz atama durumunu inceliyorum...\n')
  
  try {
    // 1. Furkan Yılmaz'ı bul
    const user = await prisma.user.findFirst({
      where: {
        email: 'fy1486@example.com'
      },
      include: {
        memberProfile: true,
        squadAssignments: {
          include: {
            squad: {
              include: {
                assignments: true
              }
            }
          }
        }
      }
    })
    
    if (!user) {
      console.log('❌ Kullanıcı bulunamadı (email: fy1486@example.com)')
      return
    }
    
    console.log(`✅ Kullanıcı bulundu: ${user.firstName} ${user.lastName}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Status: ${user.status}`)
    console.log(`   ID: ${user.id}\n`)
    
    if (user.memberProfile) {
      console.log(`📋 Profil Bilgileri:`)
      console.log(`   Doğum Yılı: ${user.memberProfile.birthYear}`)
      console.log(`   Ana Mevki: ${user.memberProfile.mainPositionKey}`)
      console.log(`   Yedek Mevki: ${user.memberProfile.altPositionKey}\n`)
    }
    
    // 2. Kadro ataması kontrolü
    if (user.squadAssignments.length === 0) {
      console.log('⚠️  KADRO ATAMASI YOK\n')
      
      // 3. Mevcut kadroları kontrol et
      console.log('📊 Mevcut Kadrolar (U2016 7+1):')
      const squads = await prisma.squad.findMany({
        where: {
          ageGroupCode: 'U2016',
          template: '7+1'
        },
        include: {
          assignments: true
        },
        orderBy: [
          { createdAt: 'asc' }
        ]
      })
      
      if (squads.length === 0) {
        console.log('   ❌ Hiç kadro yok')
      } else {
        for (const squad of squads) {
          console.log(`   - ${squad.name} (${squad.instance}): ${squad.assignments.length}/8 doluluk`)
          
          // Pozisyonlara göre doldurulmuş slotlar
          const positions = squad.assignments.map(a => `#${a.number} ${a.positionKey}`)
          console.log(`     Dolu pozisyonlar: ${positions.join(', ')}`)
          
          // Furkan'ın ana ve yedek mevkilerini kontrol et
          const mainOccupied = squad.assignments.some(a => a.positionKey === user.memberProfile?.mainPositionKey)
          const altOccupied = user.memberProfile?.altPositionKey && squad.assignments.some(a => a.positionKey === user.memberProfile?.altPositionKey)
          
          console.log(`     MAIN (${user.memberProfile?.mainPositionKey}): ${mainOccupied ? '❌ DOLU' : '✅ BOŞ'}`)
          if (user.memberProfile?.altPositionKey) {
            console.log(`     ALT (${user.memberProfile?.altPositionKey}): ${altOccupied ? '❌ DOLU' : '✅ BOŞ'}`)
          }
        }
      }
      
    } else {
      const assignment = user.squadAssignments[0]
      console.log(`✅ KADRO ATAMASI VAR:`)
      console.log(`   Kadro: ${assignment.squad.name}`)
      console.log(`   Pozisyon: ${assignment.positionKey}`)
      console.log(`   Forma: #${assignment.number}`)
    }
    
  } catch (error: any) {
    console.error('❌ Hata:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

dumpFurkanAssignment()

