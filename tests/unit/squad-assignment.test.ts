import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { PrismaClient } from '@prisma/client'
import { 
  listActiveSquads,
  autoAssignUser,
  getTemplateForBirthYear,
  getAgeGroupCode
} from '../../lib/squads/assign'

const prisma = new PrismaClient()

describe('Squad Assignment Algorithm', () => {
  beforeEach(async () => {
    // Test verilerini temizle
    await prisma.squadAssignment.deleteMany()
    await prisma.user.deleteMany()
    await prisma.squad.deleteMany()
  })

  afterEach(async () => {
    await prisma.$disconnect()
  })

  describe('Template and Age Group Code', () => {
    it('should generate correct template for birth years', () => {
      expect(getTemplateForBirthYear(2016)).toBe('7+1')
      expect(getTemplateForBirthYear(2010)).toBe('10+1')
      expect(getTemplateForBirthYear(2006)).toBe('10+1')
      expect(getTemplateForBirthYear(2018)).toBe('7+1')
    })

    it('should generate correct age group codes', () => {
      expect(getAgeGroupCode(2016)).toBe('U2016')
      expect(getAgeGroupCode(2010)).toBe('U2010')
      expect(getAgeGroupCode(2006)).toBe('U2006')
    })
  })

  describe('Squad Ordering', () => {
    it('should order squads by occupancy rate ASC, then by createdAt ASC', async () => {
      // Test kadroları oluştur (farklı zamanlarda ve doluluk oranlarında)
      const squadA = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'A',
          name: 'U2016 7+1 A',
          createdAt: new Date('2025-01-01T10:00:00Z')
        }
      })

      const squadB = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'B',
          name: 'U2016 7+1 B',
          createdAt: new Date('2025-01-01T09:00:00Z') // Daha eski
        }
      })


      // Squad A'ya 6 atama (75% doluluk) - farklı kullanıcılar
      const positionsA = ['KALECI', 'SAG_DEF', 'STOPER', 'SOL_DEF', 'ORTA', 'SAG_KANAT']
      for (let i = 0; i < 6; i++) {
        const testUserA = await prisma.user.create({
          data: {
            email: `user-a-${i}@test.com`,
            password: 'test123',
            firstName: 'Test',
            lastName: `UserA${i}`,
            status: 'PAID',
            memberProfile: {
              create: {
                firstName: 'Test',
                lastName: `UserA${i}`,
                birthYear: 2016,
                mainPositionKey: positionsA[i],
                phone: '+905551234567',
                country: 'Turkey',
                city: 'Istanbul',
                district: 'Test',
                team: 'Test Team',
                league: 'Test League'
              }
            }
          }
        })

        await prisma.squadAssignment.create({
          data: {
            squadId: squadA.id,
            userId: testUserA.id,
            ageGroupCode: 'U2016',
            positionKey: positionsA[i],
            number: i + 1,
            source: 'AUTO'
          }
        })
      }

      // Squad B'ye 4 atama (50% doluluk) - En az dolu
      const positionsB = ['KALECI', 'SAG_DEF', 'STOPER', 'SOL_DEF']
      for (let i = 0; i < 4; i++) {
        const testUserB = await prisma.user.create({
          data: {
            email: `user-b-${i}@test.com`,
            password: 'test123',
            firstName: 'Test',
            lastName: `UserB${i}`,
            status: 'PAID',
            memberProfile: {
              create: {
                firstName: 'Test',
                lastName: `UserB${i}`,
                birthYear: 2016,
                mainPositionKey: positionsB[i],
                phone: '+905551234567',
                country: 'Turkey',
                city: 'Istanbul',
                district: 'Test',
                team: 'Test Team',
                league: 'Test League'
              }
            }
          }
        })

        await prisma.squadAssignment.create({
          data: {
            squadId: squadB.id,
            userId: testUserB.id,
            ageGroupCode: 'U2016',
            positionKey: positionsB[i],
            number: i + 1,
            source: 'AUTO'
          }
        })
      }

      // Kadroları sırala
      const orderedSquads = await listActiveSquads('U2016', '7+1')

      // Beklenen sıralama: B (50%) -> A (75%)
      expect(orderedSquads).toHaveLength(2)
      expect(orderedSquads[0].instance).toBe('B') // En az dolu
      expect(orderedSquads[1].instance).toBe('A') // Daha dolu
    })

    it('should prioritize older squad when occupancy rates are equal', async () => {
      // Eşit dolulukta daha eski olan önce gelmeli testi
      const squadB = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'B',
          name: 'U2016 7+1 B',
          createdAt: new Date('2025-01-01T09:00:00Z') // Daha eski
        }
      })

      const squadC = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'C',
          name: 'U2016 7+1 C',
          createdAt: new Date('2025-01-01T10:00:00Z') // Daha yeni
        }
      })

      // Test kullanıcısı oluştur
      const testUser = await prisma.user.create({
        data: {
          email: 'test-user@test.com',
          password: 'test123',
          firstName: 'Test',
          lastName: 'User',
          status: 'PAID',
          memberProfile: {
            create: {
              firstName: 'Test',
              lastName: 'User',
              birthYear: 2016,
              mainPositionKey: 'KALECI',
              phone: '+905551234567',
              country: 'Turkey',
              city: 'Istanbul',
              district: 'Test',
              team: 'Test Team',
              league: 'Test League'
            }
          }
        }
      })

      // Kadroları sırala
      const orderedSquads = await listActiveSquads('U2016', '7+1')

      // Beklenen sıralama: B (daha eski) -> C (daha yeni)
      expect(orderedSquads).toHaveLength(2)
      expect(orderedSquads[0].instance).toBe('B') // Daha eski
      expect(orderedSquads[1].instance).toBe('C') // Daha yeni

      // Kaleci ataması yap - B'ye gitmeli (daha eski)
      const assignment = await autoAssignUser({
        userId: testUser.id,
        birthYear: 2016,
        mainPositionKey: 'KALECI'
      })

      expect(assignment.squadId).toBe(squadB.id)
      expect(assignment.positionKey).toBe('KALECI')
    })
  })

  describe('Per-Squad ALT Flow', () => {
    it('should prioritize main position in same squad over alt position in different squad', async () => {
      // İki kadro oluştur
      const squadA = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'A',
          name: 'U2016 7+1 A'
        }
      })

      const squadB = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'B',
          name: 'U2016 7+1 B'
        }
      })

      // Test kullanıcısı oluştur
      const testUser = await prisma.user.create({
        data: {
          email: 'test-user@test.com',
          password: 'test123',
          firstName: 'Test',
          lastName: 'User',
          status: 'PAID',
          memberProfile: {
            create: {
              firstName: 'Test',
              lastName: 'User',
              birthYear: 2016,
              mainPositionKey: 'KALECI',
              altPositionKey: 'SAG_DEF',
              phone: '+905551234567',
              country: 'Turkey',
              city: 'Istanbul',
              district: 'Test',
              team: 'Test Team',
              league: 'Test League'
            }
          }
        }
      })

      // Atama yap
      const assignment = await autoAssignUser({
        userId: testUser.id,
        birthYear: 2016,
        mainPositionKey: 'KALECI',
        altPositionKey: 'SAG_DEF'
      })

      // Squad A'da KALECI slotuna atanmalı (ana mevki öncelikli)
      expect(assignment.squadId).toBe(squadA.id)
      expect(assignment.positionKey).toBe('KALECI')
    })

    it('should use ALT position in same squad when main is occupied', async () => {
      // İki kadro oluştur
      const squadA = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'A',
          name: 'U2016 7+1 A'
        }
      })

      const squadB = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'B',
          name: 'U2016 7+1 B'
        }
      })

      // Squad A'da KALECI slotunu doldur
      const existingUser = await prisma.user.create({
        data: {
          email: 'existing-user@test.com',
          password: 'test123',
          firstName: 'Existing',
          lastName: 'User',
          status: 'PAID',
          memberProfile: {
            create: {
              firstName: 'Existing',
              lastName: 'User',
              birthYear: 2016,
              mainPositionKey: 'KALECI',
              phone: '+905551234567',
              country: 'Turkey',
              city: 'Istanbul',
              district: 'Test',
              team: 'Test Team',
              league: 'Test League'
            }
          }
        }
      })

      await prisma.squadAssignment.create({
        data: {
          squadId: squadA.id,
          userId: existingUser.id,
          ageGroupCode: 'U2016',
          positionKey: 'KALECI',
          number: 1,
          source: 'AUTO'
        }
      })

      // Squad B'yi de doldur ki Squad A'da ALT akışı test edilsin
      const existingUserB = await prisma.user.create({
        data: {
          email: 'existing-user-b@test.com',
          password: 'test123',
          firstName: 'Existing',
          lastName: 'UserB',
          status: 'PAID',
          memberProfile: {
            create: {
              firstName: 'Existing',
              lastName: 'UserB',
              birthYear: 2016,
              mainPositionKey: 'KALECI',
              phone: '+905551234567',
              country: 'Turkey',
              city: 'Istanbul',
              district: 'Test',
              team: 'Test Team',
              league: 'Test League'
            }
          }
        }
      })

      await prisma.squadAssignment.create({
        data: {
          squadId: squadB.id,
          userId: existingUserB.id,
          ageGroupCode: 'U2016',
          positionKey: 'KALECI',
          number: 1,
          source: 'AUTO'
        }
      })

      // Test kullanıcısı oluştur
      const testUser = await prisma.user.create({
        data: {
          email: 'test-user@test.com',
          password: 'test123',
          firstName: 'Test',
          lastName: 'User',
          status: 'PAID',
          memberProfile: {
            create: {
              firstName: 'Test',
              lastName: 'User',
              birthYear: 2016,
              mainPositionKey: 'KALECI',
              altPositionKey: 'SAG_DEF',
              phone: '+905551234567',
              country: 'Turkey',
              city: 'Istanbul',
              district: 'Test',
              team: 'Test Team',
              league: 'Test League'
            }
          }
        }
      })

      // Atama yap
      const assignment = await autoAssignUser({
        userId: testUser.id,
        birthYear: 2016,
        mainPositionKey: 'KALECI',
        altPositionKey: 'SAG_DEF'
      })

      // Squad A'da SAG_DEF slotuna atanmalı (aynı kadroda ALT)
      expect(assignment.squadId).toBe(squadA.id)
      expect(assignment.positionKey).toBe('SAG_DEF')
    })

    it('should not jump to different squad for ALT position', async () => {
      // İki kadro oluştur
      const squadA = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'A',
          name: 'U2016 7+1 A'
        }
      })

      const squadB = await prisma.squad.create({
        data: {
          ageGroupCode: 'U2016',
          template: '7+1',
          instance: 'B',
          name: 'U2016 7+1 B'
        }
      })

      // Squad A'da hem KALECI hem SAG_DEF slotlarını doldur
      const existingUser1 = await prisma.user.create({
        data: {
          email: 'existing-user1@test.com',
          password: 'test123',
          firstName: 'Existing',
          lastName: 'User1',
          status: 'PAID',
          memberProfile: {
            create: {
              firstName: 'Existing',
              lastName: 'User1',
              birthYear: 2016,
              mainPositionKey: 'KALECI',
              phone: '+905551234567',
              country: 'Turkey',
              city: 'Istanbul',
              district: 'Test',
              team: 'Test Team',
              league: 'Test League'
            }
          }
        }
      })

      const existingUser2 = await prisma.user.create({
        data: {
          email: 'existing-user2@test.com',
          password: 'test123',
          firstName: 'Existing',
          lastName: 'User2',
          status: 'PAID',
          memberProfile: {
            create: {
              firstName: 'Existing',
              lastName: 'User2',
              birthYear: 2016,
              mainPositionKey: 'SAG_DEF',
              phone: '+905551234567',
              country: 'Turkey',
              city: 'Istanbul',
              district: 'Test',
              team: 'Test Team',
              league: 'Test League'
            }
          }
        }
      })

      await prisma.squadAssignment.create({
        data: {
          squadId: squadA.id,
          userId: existingUser1.id,
          ageGroupCode: 'U2016',
          positionKey: 'KALECI',
          number: 1,
          source: 'AUTO'
        }
      })

      await prisma.squadAssignment.create({
        data: {
          squadId: squadA.id,
          userId: existingUser2.id,
          ageGroupCode: 'U2016',
          positionKey: 'SAG_DEF',
          number: 2,
          source: 'AUTO'
        }
      })

      // Test kullanıcısı oluştur
      const testUser = await prisma.user.create({
        data: {
          email: 'test-user@test.com',
          password: 'test123',
          firstName: 'Test',
          lastName: 'User',
          status: 'PAID',
          memberProfile: {
            create: {
              firstName: 'Test',
              lastName: 'User',
              birthYear: 2016,
              mainPositionKey: 'KALECI',
              altPositionKey: 'SAG_DEF',
              phone: '+905551234567',
              country: 'Turkey',
              city: 'Istanbul',
              district: 'Test',
              team: 'Test Team',
              league: 'Test League'
            }
          }
        }
      })

      // Atama yap
      const assignment = await autoAssignUser({
        userId: testUser.id,
        birthYear: 2016,
        mainPositionKey: 'KALECI',
        altPositionKey: 'SAG_DEF'
      })

      // Squad B'de KALECI slotuna atanmalı (yeni kadro)
      expect(assignment.squadId).toBe(squadB.id)
      expect(assignment.positionKey).toBe('KALECI')
    })
  })
})