// Kadro atama servisi - STRICT RULES
// Hedef Performans - Kadro Atama Sistemi
// Auto-Assign Strict Rules - Final Version

import { PrismaClient } from '@prisma/client'
import { 
  getPositionsForTemplate,
  getNumberForPosition,
  TemplateType,
  normalizePositionKey,
  validatePositionForTemplate,
  getAgeGroupCode
} from './positions'

const prisma = new PrismaClient()

export interface AssignUserParams {
  userId: string
  birthYear: number
  mainPositionKey: string
  altPositionKey?: string
}

export interface AssignSlotParams {
  userId: string
  squadId: string
  positionKey: string
  number: number
  source: 'AUTO' | 'MANUAL'
}

/**
 * Doğum yılına göre şablon seçimi
 */
export function getTemplateForBirthYear(birthYear: number): TemplateType {
  if (birthYear >= 2014 && birthYear <= 2018) {
    return '7+1'
  } else if (birthYear >= 2006 && birthYear <= 2013) {
    return '10+1'
  }
  throw new Error(`Desteklenmeyen doğum yılı: ${birthYear}`)
}

/**
 * ACTIVE kadroları listele - SADECE createdAt ASC + instance ASC
 */
export async function listActiveSquads(ageGroupCode: string, template: TemplateType) {
  return await prisma.squad.findMany({
    where: {
      ageGroupCode,
      template
    },
    include: {
      assignments: true,
      _count: {
        select: { assignments: true }
      }
    },
    orderBy: [
      { createdAt: 'asc' },
      { instance: 'asc' }
    ]
  })
}

/**
 * Slot boş mu kontrol et
 */
export function slotAvailable(squad: any, positionKey: string): boolean {
  const existingAssignment = squad.assignments.find(
    (assignment: any) => assignment.positionKey === positionKey
  )
  return !existingAssignment
}

/**
 * Yeni kadro instance oluştur
 */
export async function createNewSquadInstance(
  ageGroupCode: string, 
  template: TemplateType
) {
  const existingSquads = await prisma.squad.findMany({
    where: { ageGroupCode, template },
    select: { instance: true }
  })

  const instances = existingSquads.map(s => s.instance).sort()
  let nextInstance = 'A'
  
  if (instances.length > 0) {
    const lastInstance = instances[instances.length - 1]
    nextInstance = String.fromCharCode(lastInstance.charCodeAt(0) + 1)
  }

  const name = `${ageGroupCode} ${template} ${nextInstance}`

  const squad = await prisma.squad.create({
    data: {
      ageGroupCode,
      template,
      instance: nextInstance,
      name
    }
  })

  return squad
}

/**
 * Kullanıcıyı slota atama (DB transaction)
 */
export async function assignTx(params: AssignSlotParams) {
  return await prisma.$transaction(async (tx) => {
    // Squad bilgisini al
    const squad = await tx.squad.findUnique({
      where: { id: params.squadId },
      select: { ageGroupCode: true }
    })

    if (!squad) {
      throw new Error('Squad bulunamadı')
    }

    // User'ın var olup olmadığını kontrol et
    const user = await tx.user.findUnique({
      where: { id: params.userId },
      select: { id: true }
    })

    if (!user) {
      console.error(`❌ [ASSIGN-TX] User bulunamadı: ${params.userId}`)
      throw new Error(`User bulunamadı: ${params.userId}`)
    }

    console.log(`✅ [ASSIGN-TX] User doğrulandı: ${params.userId}`)

    try {
      const assignment = await tx.squadAssignment.create({
        data: {
          squadId: params.squadId,
          userId: params.userId,
          ageGroupCode: squad.ageGroupCode,
          positionKey: params.positionKey,
          number: params.number,
          source: params.source
        }
      })

      console.log(`✅ [ASSIGN-TX] Assignment oluşturuldu: squadId=${params.squadId}, userId=${params.userId}`)
      return assignment
    } catch (error: any) {
      console.error(`❌ [ASSIGN-TX] Assignment oluşturma hatası:`, error)
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('squadId') && error.meta?.target?.includes('number')) {
          throw new Error('SLOT_OCCUPIED')
        }
        if (error.meta?.target?.includes('userId') && error.meta?.target?.includes('ageGroupCode')) {
          throw new Error('USER_ALREADY_ASSIGNED')
        }
        if (error.meta?.target?.includes('userId') && error.meta?.target?.includes('squadId')) {
          throw new Error('USER_ALREADY_IN_SQUAD')
        }
      }
      // Foreign key constraint hatası için özel mesaj
      if (error.code === 'P2003') {
        console.error(`❌ [ASSIGN-TX] Foreign key constraint hatası:`, error.meta)
        throw new Error(`Foreign key constraint: ${JSON.stringify(error.meta)}`)
      }
      throw error
    }
  })
}

/**
 * ANA STRICT ALGORİTMA
 * 
 * 1. Doğum yılına göre şablon
 * 2. Ana ve yedek mevki normalize et
 * 3. Atama sırası:
 *    a) ANA turu: her kadroda ana mevki slotu boşsa ata
 *    b) YEDEK turu: ana doluysa her kadroda yedek slotu boşsa ata
 *    c) Yeni kadro: main+alt hiçbirinde boş yoksa yeni kadro oluştur
 * 4. Politika eşiği YOK - NEW_SQUAD her zaman öncelikli
 * 5. Idempotency: unique(userId, ageGroupCode), unique(squadId, number)
 */
export async function autoAssignUser(params: AssignUserParams) {
  const { userId, birthYear, mainPositionKey, altPositionKey } = params
  
  // 1. Template ve yaş grubu
  const template = getTemplateForBirthYear(birthYear)
  const ageGroupCode = getAgeGroupCode(birthYear)

  // 2. Normalize pozisyonlar
  const normalizedMainKey = normalizePositionKey(mainPositionKey, template)
  const normalizedAltKey = altPositionKey ? normalizePositionKey(altPositionKey, template) : null

  // 3. STRICT Validation
  if (!validatePositionForTemplate(normalizedMainKey, template)) {
    throw new Error(`POSITION_TEMPLATE_MISMATCH: ${normalizedMainKey} geçerli değil ${template} template'inde`)
  }

  if (normalizedAltKey && !validatePositionForTemplate(normalizedAltKey, template)) {
    throw new Error(`POSITION_TEMPLATE_MISMATCH: ${normalizedAltKey} geçerli değil ${template} template'inde`)
  }

  // DEBUG: Input
  console.log(`[ASSIGN-DEBUG] Input: {userId: ${userId}, birthYear: ${birthYear}, mainPositionKey: ${mainPositionKey} → ${normalizedMainKey}, altPositionKey: ${altPositionKey || 'N/A'} → ${normalizedAltKey || 'N/A'}}`)
  console.log(`[ASSIGN-DEBUG] Computed: {ageGroupCode: ${ageGroupCode}, template: ${template}}`)

  // 4. Idempotency: Aynı kullanıcı aynı yaş grubunda zaten atanmış mı?
  const existingAssignment = await prisma.squadAssignment.findFirst({
    where: {
      userId,
      ageGroupCode
    },
    include: {
      squad: true
    }
  })

  if (existingAssignment) {
    console.log(`[ASSIGN-DEBUG] Kullanıcı ${userId} zaten ${ageGroupCode} yaş grubunda atanmış`)
    return existingAssignment
  }

  // 5. ACTIVE kadroları listele - SADECE createdAt ASC + instance ASC
  const squads = await listActiveSquads(ageGroupCode, template)
  
  // DEBUG: Ordered squads
  console.log(`[ASSIGN-DEBUG] ORDERED_SQUADS: ${JSON.stringify(squads.map(squad => ({
    name: squad.name,
    instance: squad.instance,
    filled: squad._count.assignments,
    total: getPositionsForTemplate(template).length,
    createdAt: squad.createdAt.toISOString()
  })))}`)

  // 6. ANA TURU: Her kadroda ana mevki slotu boşsa ata
  for (const squad of squads) {
    const mainSlotNumber = getNumberForPosition(template, normalizedMainKey)
    
    if (!mainSlotNumber) {
      throw new Error(`Invalid position: ${normalizedMainKey}`)
    }

    if (slotAvailable(squad, normalizedMainKey)) {
      try {
        const assignment = await assignTx({
          userId,
          squadId: squad.id,
          positionKey: normalizedMainKey,
          number: mainSlotNumber,
          source: 'AUTO'
        })

        console.log(`[ASSIGN-DEBUG] DECISION: ${JSON.stringify({ squad: squad.name, slotNumber: mainSlotNumber, reason: 'MAIN' })}`)
        return assignment
      } catch (error: any) {
        if (error.message === 'SLOT_OCCUPIED') {
          continue
        }
        throw error
      }
    }
  }

  // 7. YEDEK TURU: Ana doluysa her kadroda yedek slotu boşsa ata
  if (normalizedAltKey) {
    for (const squad of squads) {
      const altSlotNumber = getNumberForPosition(template, normalizedAltKey)
      
      if (!altSlotNumber) {
        throw new Error(`Invalid position: ${normalizedAltKey}`)
      }

      if (slotAvailable(squad, normalizedAltKey)) {
        try {
          const assignment = await assignTx({
            userId,
            squadId: squad.id,
            positionKey: normalizedAltKey,
            number: altSlotNumber,
            source: 'AUTO'
          })

          console.log(`[ASSIGN-DEBUG] DECISION: ${JSON.stringify({ squad: squad.name, slotNumber: altSlotNumber, reason: 'ALT' })}`)
          return assignment
        } catch (error: any) {
          if (error.message === 'SLOT_OCCUPIED') {
            continue
          }
          throw error
        }
      }
    }
  }

  // 8. YENİ KADRO: main+alt hiçbirinde boş yoksa yeni kadro oluştur ve ana mevkiye ata
  console.log(`[ASSIGN-DEBUG] No slot found in existing squads, creating NEW_SQUAD...`)
  
  const newSquad = await createNewSquadInstance(ageGroupCode, template)
  const mainSlotNumber = getNumberForPosition(template, normalizedMainKey)
  
  if (!mainSlotNumber) {
    throw new Error(`Invalid position: ${normalizedMainKey}`)
  }

  // Ana slot yoksa yedek slotuna ata
  let assignedPositionKey = normalizedMainKey
  let assignedNumber = mainSlotNumber

  // Ana mevki template'de yoksa (örn: 10+1'de SOL_DEF yok), yedek mevkiye bak
  if (!getNumberForPosition(template, normalizedMainKey) && normalizedAltKey) {
    const altSlotNumber = getNumberForPosition(template, normalizedAltKey)
    if (altSlotNumber) {
      assignedPositionKey = normalizedAltKey
      assignedNumber = altSlotNumber
    }
  }

  const assignment = await assignTx({
    userId,
    squadId: newSquad.id,
    positionKey: assignedPositionKey,
    number: assignedNumber,
    source: 'AUTO'
  })

  console.log(`[ASSIGN-DEBUG] DECISION: ${JSON.stringify({ squad: newSquad.name, slotNumber: assignedNumber, reason: 'NEW_SQUAD' })}`)
  return assignment
}

/**
 * Kullanıcının mevcut atamasını getir
 */
export async function getUserAssignment(userId: string) {
  return await prisma.squadAssignment.findFirst({
    where: { userId },
    include: {
      squad: true,
      user: {
        include: {
          memberProfile: true
        }
      }
    }
  })
}

/**
 * Kadronun doluluk bilgilerini getir
 */
export async function getSquadOccupancy(squadId: string) {
  const squad = await prisma.squad.findUnique({
    where: { id: squadId },
    include: {
      assignments: {
        include: {
          user: {
            include: {
              memberProfile: true
            }
          }
        }
      }
    }
  })

  if (!squad) return null

  const template = squad.template as TemplateType
  const positions = getPositionsForTemplate(template)
  const totalSlots = positions.length
  const occupiedSlots = squad.assignments.length
  const occupancyRate = (occupiedSlots / totalSlots) * 100

  return {
    squad,
    totalSlots,
    occupiedSlots,
    occupancyRate,
    availableSlots: totalSlots - occupiedSlots
  }
}
