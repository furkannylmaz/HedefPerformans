// Script: Assign All Users to Same Squad
// Hedef Performans - Tüm Kullanıcıları Aynı Kadroya Atama

import { PrismaClient } from '@prisma/client'
import { getPositionsForTemplate } from '../lib/squads/positions'

const prisma = new PrismaClient()

async function assignAllToSameSquad() {
  console.log('🎯 Tüm kullanıcıları aynı kadroya atamaya başlıyorum...\n')
  
  try {
    // 1. Tüm atamaları sil
    console.log('🧹 Mevcut atamaları temizliyorum...')
    await prisma.squadAssignment.deleteMany()
    console.log('✅ Atamalar silindi\n')
    
    // 2. Tüm boş kadroları sil
    console.log('🧹 Boş kadroları temizliyorum...')
    await prisma.squad.deleteMany()
    console.log('✅ Boş kadrolar silindi\n')
    
    // 3. Yeni bir kadro oluştur
    console.log('📋 Yeni kadro oluşturuluyor...')
    const squad = await prisma.squad.create({
      data: {
        ageGroupCode: 'U2016',
        template: '7+1',
        instance: 'A',
        name: 'U2016 7+1 A'
      }
    })
    console.log(`✅ Kadro oluşturuldu: ${squad.name}\n`)
    
    // 4. Tüm kullanıcıları al
    console.log('👥 Kullanıcılar getiriliyor...')
    const users = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        memberProfile: {
          isNot: null
        }
      },
      include: {
        memberProfile: true
      }
    })
    
    console.log(`📊 Toplam ${users.length} kullanıcı bulundu\n`)
    
    // 5. Her kullanıcıyı kadroya atama
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
    
    // 6. Özet
    const finalSquad = await prisma.squad.findUnique({
      where: { id: squad.id },
      include: {
        _count: { select: { assignments: true } }
      }
    })
    
    console.log(`\n📊 Final Durum:`)
    console.log(`${finalSquad?.name}: ${finalSquad?._count.assignments}/8 üye`)
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignAllToSameSquad()

