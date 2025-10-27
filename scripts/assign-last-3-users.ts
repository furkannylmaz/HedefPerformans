// Script: Assign Last 3 Users to Third Squad
// Hedef Performans - Son 3 Kullanıcıyı Üçüncü Kadroya Atama

import { PrismaClient } from '@prisma/client'
import { getPositionsForTemplate } from '../lib/squads/positions'

const prisma = new PrismaClient()

async function assignLastUsers() {
  console.log('🎯 Son 3 kullanıcıyı üçüncü kadroya atamaya başlıyorum...\n')
  
  try {
    // 1. Üçüncü kadroyu oluştur
    console.log('📋 Üçüncü kadro oluşturuluyor...')
    const squad = await prisma.squad.create({
      data: {
        ageGroupCode: 'U2016',
        template: '7+1',
        instance: 'C',
        name: 'U2016 7+1 C'
      }
    })
    console.log(`✅ Kadro oluşturuldu: ${squad.name}\n`)
    
    // 2. Atanmamış kullanıcıları al
    const users = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        memberProfile: {
          isNot: null
        },
        squadAssignments: {
          none: {}
        }
      },
      include: {
        memberProfile: true
      }
    })
    
    console.log(`📊 Toplam ${users.length} atanmamış kullanıcı bulundu\n`)
    
    // 3. Her kullanıcıyı kadroya atama
    const positions = getPositionsForTemplate('7+1')
    let positionIndex = 0
    
    for (const user of users) {
      if (user.memberProfile && positionIndex < positions.length) {
        const position = positions[positionIndex]
        
        await prisma.squadAssignment.create({
          data: {
            squadId: squad.id,
            userId: user.id,
            ageGroupCode: 'U2016',
            positionKey: position.positionKey,
            number: position.number,
            source: 'MANUAL'
          }
        })
        
        console.log(`✅ ${user.firstName} ${user.lastName} → ${position.positionKey} (#${position.number})`)
        positionIndex++
      }
    }
    
    console.log(`\n✅ ${positionIndex} kullanıcı ${squad.name} kadrosuna atandı!`)
    
    // 4. Özet
    const squads = await prisma.squad.findMany({
      where: { ageGroupCode: 'U2016', template: '7+1' },
      include: {
        _count: { select: { assignments: true } }
      },
      orderBy: { instance: 'asc' }
    })
    
    console.log(`\n📊 Toplam Kadro Özeti:`)
    for (const s of squads) {
      console.log(`${s.name}: ${s._count.assignments}/8 üye`)
    }
    
    console.log(`\n✅ İşlem tamamlandı!`)
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignLastUsers()

