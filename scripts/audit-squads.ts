import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface EmptySlot {
  number: number
  positionKey: string
}

interface SquadAudit {
  name: string
  instance: string
  filled: number
  total: number
  emptySlots: EmptySlot[]
}

async function auditSquads(ageGroupCode: string, template: string) {
  console.log(`\n📊 SQUAD AUDIT - ${ageGroupCode} ${template}\n`)
  
  try {
    // Tüm squad'ları createdAt ASC sırala
    const squads = await prisma.squad.findMany({
      where: {
        ageGroupCode,
        template
      },
      include: {
        assignments: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const audits: SquadAudit[] = []

    for (const squad of squads) {
      // Dolu slotları tespit et
      const filledSlots = squad.assignments.map(a => ({
        number: a.number,
        positionKey: a.positionKey
      }))

      // Tüm mevcut pozisyonları template'den al
      const allPositions = template === '7+1' 
        ? [
            { positionKey: 'KALECI', number: 1 },
            { positionKey: 'SAG_DEF', number: 2 },
            { positionKey: 'SOL_DEF', number: 3 },
            { positionKey: 'STOPER', number: 4 },
            { positionKey: 'ORTA', number: 6 },
            { positionKey: 'SAG_KANAT', number: 7 },
            { positionKey: 'FORVET', number: 9 },
            { positionKey: 'SOL_KANAT', number: 11 }
          ]
        : [
            { positionKey: 'KALECI', number: 1 },
            { positionKey: 'SAGBEK', number: 2 },
            { positionKey: 'SAG_STOPER', number: 3 },
            { positionKey: 'SOL_STOPER', number: 4 },
            { positionKey: 'SOLBEK', number: 5 },
            { positionKey: 'ONLIBERO', number: 6 },
            { positionKey: 'ORTA_8', number: 8 },
            { positionKey: 'ORTA_10', number: 10 },
            { positionKey: 'SAG_KANAT', number: 7 },
            { positionKey: 'SOL_KANAT', number: 11 },
            { positionKey: 'FORVET', number: 9 }
          ]

      // Boş slotları bul
      const emptySlots: EmptySlot[] = allPositions
        .filter(pos => !filledSlots.some(filled => filled.number === pos.number))
        .map(pos => ({
          number: pos.number,
          positionKey: pos.positionKey
        }))

      audits.push({
        name: squad.name,
        instance: squad.instance,
        filled: filledSlots.length,
        total: allPositions.length,
        emptySlots
      })
    }

    // Rapor yaz
    console.log(`Toplam ${audits.length} kadro bulundu\n`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    for (const audit of audits) {
      console.log(`📋 ${audit.name} (${audit.instance})`)
      console.log(`   Dolu: ${audit.filled}/${audit.total} slots`)
      
      if (audit.emptySlots.length > 0) {
        console.log(`   ⚠️  Boş Slotlar:`)
        for (const slot of audit.emptySlots) {
          console.log(`      - ${slot.number} numaralı forma (${slot.positionKey})`)
        }
      } else {
        console.log(`   ✅ Tüm slotlar dolu`)
      }
      console.log('')
    }

    // Özet istatistik
    const totalEmptySlots = audits.reduce((sum, audit) => sum + audit.emptySlots.length, 0)
    const totalSlots = audits.reduce((sum, audit) => sum + audit.total, 0)
    const totalFilled = audits.reduce((sum, audit) => sum + audit.filled, 0)
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📊 ÖZET İSTATİSTİKLER`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`Toplam Kadro: ${audits.length}`)
    console.log(`Toplam Slot: ${totalSlots}`)
    console.log(`Dolu Slot: ${totalFilled}`)
    console.log(`Boş Slot: ${totalEmptySlots} (${((totalEmptySlots / totalSlots) * 100).toFixed(1)}%)`)
    console.log('')

    // Boş slotların forma numarasına göre dağılımı
    const emptySlotsByNumber = new Map<number, number>()
    const emptySlotsByPosition = new Map<string, number>()
    
    for (const audit of audits) {
      for (const slot of audit.emptySlots) {
        emptySlotsByNumber.set(slot.number, (emptySlotsByNumber.get(slot.number) || 0) + 1)
        emptySlotsByPosition.set(slot.positionKey, (emptySlotsByPosition.get(slot.positionKey) || 0) + 1)
      }
    }

    if (emptySlotsByNumber.size > 0) {
      console.log('🔢 Boş Slotlar - Forma Numarası Dağılımı:')
      const sortedByNumber = Array.from(emptySlotsByNumber.entries()).sort((a, b) => a[0] - b[0])
      for (const [number, count] of sortedByNumber) {
        console.log(`   Forma ${number}: ${count} kadroda boş`)
      }
      console.log('')
    }

    if (emptySlotsByPosition.size > 0) {
      console.log('⚽ Boş Slotlar - Pozisyon Dağılımı:')
      const sortedByPosition = Array.from(emptySlotsByPosition.entries()).sort((a, b) => b[1] - a[1])
      for (const [position, count] of sortedByPosition) {
        console.log(`   ${position}: ${count} kadroda boş`)
      }
      console.log('')
    }

    // İlk ve son oluşturulan kadrolar
    if (audits.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`🕐 KADRO OLUŞTURULMA SIRASI`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`İlk Oluşturulan: ${audits[0].name} (${audits[0].filled}/${audits[0].total} dolu)`)
      console.log(`Son Oluşturulan: ${audits[audits.length - 1].name} (${audits[audits.length - 1].filled}/${audits[audits.length - 1].total} dolu)`)
      console.log('')
    }

  } catch (error) {
    console.error('❌ Audit hatası:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Script'i çalıştır
auditSquads('U2016', '7+1')

