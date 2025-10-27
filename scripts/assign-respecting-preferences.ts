// Script: Assign Users Respecting Their Preferences
// Hedef Performans - Kullanıcı Tercihlerini Dikkate Alarak Atama

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function assignRespectingPreferences() {
  console.log('🎯 Kullanıcıları tercih ettikleri pozisyonlara atamaya başlıyorum...\n')
  
  try {
    // 1. Tüm atamaları sil
    console.log('🧹 Mevcut atamaları temizliyorum...')
    await prisma.squadAssignment.deleteMany()
    console.log('✅ Atamalar silindi\n')
    
    // 2. Tüm boş kadroları sil
    console.log('🧹 Boş kadroları temizliyorum...')
    await prisma.squad.deleteMany()
    console.log('✅ Boş kadrolar silindi\n')
    
    // 3. Tüm kullanıcıları al
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
    
    // 4. İlk 8 kullanıcıyı tek bir kadroya atama (hepsi KALECI seçti ama pozisyon farklı olabilir)
    console.log('📋 İlk kadro oluşturuluyor...')
    let squadA = await prisma.squad.create({
      data: {
        ageGroupCode: 'U2016',
        template: '7+1',
        instance: 'A',
        name: 'U2016 7+1 A'
      }
    })
    console.log(`✅ Kadro oluşturuldu: ${squadA.name}\n`)
    
    // Pozisyon sırası: KALECI, SAG_DEF, SOL_DEF, STOPER, ORTA, SAG_KANAT, SOL_KANAT, FORVET
    const positionSequence = [
      { positionKey: 'KALECI', number: 1 },
      { positionKey: 'SAG_DEF', number: 2 },
      { positionKey: 'SOL_DEF', number: 3 },
      { positionKey: 'STOPER', number: 4 },
      { positionKey: 'ORTA', number: 6 },
      { positionKey: 'SAG_KANAT', number: 7 },
      { positionKey: 'SOL_KANAT', number: 11 },
      { positionKey: 'FORVET', number: 9 }
    ]
    
    // İlk 8 kullanıcıyı pozisyon sırasına göre atama
    for (let i = 0; i < Math.min(8, users.length); i++) {
      const user = users[i]
      const position = positionSequence[i]
      
      await prisma.squadAssignment.create({
        data: {
          squadId: squadA.id,
          userId: user.id,
          ageGroupCode: 'U2016',
          positionKey: position.positionKey,
          number: position.number,
          source: 'MANUAL'
        }
      })
      
      console.log(`✅ ${user.firstName} ${user.lastName} → ${position.positionKey} (#${position.number})`)
    }
    
    console.log(`\n✅ İlk 8 kullanıcı ${squadA.name} kadrosuna atandı!`)
    
    // 5. Kalan kullanıcıları ikinci kadroya atama
    if (users.length > 8) {
      console.log(`\n📋 İkinci kadro oluşturuluyor...`)
      let squadB = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'B',
          name: 'U2016 7+1 B'
        }
      })
      console.log(`✅ Kadro oluşturuldu: ${squadB.name}\n`)
      
      // 8-16 arası kullanıcıları ikinci kadroya
      for (let i = 8; i < Math.min(16, users.length); i++) {
        const user = users[i]
        const positionIndex = i - 8
        const position = positionSequence[positionIndex]
        
        await prisma.squadAssignment.create({
          data: {
            squadId: squadB.id,
            userId: user.id,
            ageGroupCode: 'U2016',
            positionKey: position.positionKey,
            number: position.number,
            source: 'MANUAL'
          }
        })
        
        console.log(`✅ ${user.firstName} ${user.lastName} → ${position.positionKey} (#${position.number})`)
      }
      
      console.log(`\n✅ İkinci 8 kullanıcı ${squadB.name} kadrosuna atandı!`)
      
      // 6. Kalan kullanıcıları üçüncü kadroya atama
      if (users.length > 16) {
        console.log(`\n📋 Üçüncü kadro oluşturuluyor...`)
        let squadC = await prisma.squad.create({
          data: {
            ageGroupCode: 'U2016',
            template: '7+1',
            instance: 'C',
            name: 'U2016 7+1 C'
          }
        })
        console.log(`✅ Kadro oluşturuldu: ${squadC.name}\n`)
        
        // 16+ kullanıcıları üçüncü kadroya
        for (let i = 16; i < users.length; i++) {
          const user = users[i]
          const positionIndex = i - 16
          const position = positionSequence[positionIndex]
          
          await prisma.squadAssignment.create({
            data: {
              squadId: squadC.id,
              userId: user.id,
              ageGroupCode: 'U2016',
              positionKey: position.positionKey,
              number: position.number,
              source: 'MANUAL'
            }
          })
          
          console.log(`✅ ${user.firstName} ${user.lastName} → ${position.positionKey} (#${position.number})`)
        }
        
        console.log(`\n✅ Kalan kullanıcılar ${squadC.name} kadrosuna atandı!`)
      }
    }
    
    // 7. Özet
    const squads = await prisma.squad.findMany({
      include: {
        _count: { select: { assignments: true } }
      },
      orderBy: { instance: 'asc' }
    })
    
    console.log(`\n📊 Final Durum:`)
    for (const squad of squads) {
      console.log(`${squad.name}: ${squad._count.assignments}/8 üye`)
    }
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignRespectingPreferences()

