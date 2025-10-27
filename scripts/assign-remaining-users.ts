// Script: Assign Remaining Users to Second Squad
// Hedef Performans - Kalan Kullanıcıları İkinci Kadroya Atama

import { PrismaClient } from '@prisma/client'
import { getPositionsForTemplate } from '../lib/squads/positions'

const prisma = new PrismaClient()

async function assignRemainingUsers() {
  console.log('🎯 Kalan kullanıcıları ikinci kadroya atamaya başlıyorum...\n')
  
  try {
    // 1. İkinci kadroyu oluştur
    console.log('📋 İkinci kadro oluşturuluyor...')
    const squad = await prisma.squad.create({
      data: {
        ageGroupCode: 'U2016',
        template: '7+1',
        instance: 'B',
        name: 'U2016 7+1 B'
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
    
    console.log(`\n📊 Kadro Özeti:`)
    for (const s of squads) {
      console.log(`${s.name}: ${s._count.assignments}/8 üye`)
    }
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignRemainingUsers()

