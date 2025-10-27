// Unit Tests - Auto-Assign Strict Rules
// Hedef Performans - Kadro Atama Sistemi

import { autoAssignUser, getTemplateForBirthYear, getAgeGroupCode } from '../lib/squads/assign'
import { normalizePositionKey, validatePositionForTemplate } from '../lib/squads/positions'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Test Senaryoları:
 * 
 * 1. Main boşken → ana'ya atanır
 * 2. Main dolu, alt boşken → alt'a atanır
 * 3. Main+alt dolu → yeni kadro açılır
 * 4. Aynı kullanıcı tekrar atanamaz
 * 5. Yanlış template key → 400
 */

describe('Auto-Assign Strict Rules', () => {
  beforeEach(async () => {
    // Test öncesi cleanup
    await prisma.squadAssignment.deleteMany({})
    await prisma.squad.deleteMany({})
    await prisma.user.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('Template Selection', () => {
    it('should return 7+1 for birthYear 2014-2018', () => {
      expect(getTemplateForBirthYear(2014)).toBe('7+1')
      expect(getTemplateForBirthYear(2018)).toBe('7+1')
    })

    it('should return 10+1 for birthYear 2006-2013', () => {
      expect(getTemplateForBirthYear(2006)).toBe('10+1')
      expect(getTemplateForBirthYear(2013)).toBe('10+1')
    })

    it('should return U2016 for birthYear 2016', () => {
      expect(getAgeGroupCode(2016)).toBe('U2016')
    })
  })

  describe('Position Normalization', () => {
    it('should normalize position keys correctly for 7+1', () => {
      expect(normalizePositionKey('STOPER', '7+1')).toBe('STOPER')
      expect(normalizePositionKey('Sol Bek', '7+1')).toBe('SOL_DEF')
      expect(normalizePositionKey('sağ beker', '7+1')).toBe('SAG_DEF')
    })

    it('should normalize position keys correctly for 10+1', () => {
      expect(normalizePositionKey('SAGBEK', '10+1')).toBe('SAGBEK')
      expect(normalizePositionKey('Önlıbero', '10+1')).toBe('ONLIBERO')
      expect(normalizePositionKey('orta 8', '10+1')).toBe('ORTA_8')
    })
  })

  describe('Position Validation', () => {
    it('should validate correct positions for 7+1', () => {
      expect(validatePositionForTemplate('STOPER', '7+1')).toBe(true)
      expect(validatePositionForTemplate('SOL_DEF', '7+1')).toBe(true)
      expect(validatePositionForTemplate('FORVET', '7+1')).toBe(true)
    })

    it('should reject invalid positions for template', () => {
      expect(validatePositionForTemplate('STOPER', '10+1')).toBe(false) // 10+1'de STOPER yok, SOL_STOPER var
      expect(validatePositionForTemplate('SAGBEK', '7+1')).toBe(false) // 7+1'de SAGBEK yok, SAG_DEF var
    })
  })

  describe('Assignment Rules', () => {
    let userId: string
    let userId2: string
    let userId3: string

    beforeAll(async () => {
      // Test kullanıcıları oluştur
      const user1 = await prisma.user.create({
        data: {
          email: 'test1@example.com',
          password: 'hash',
          firstName: 'Test',
          lastName: 'User1'
        }
      })
      userId = user1.id

      const user2 = await prisma.user.create({
        data: {
          email: 'test2@example.com',
          password: 'hash',
          firstName: 'Test',
          lastName: 'User2'
        }
      })
      userId2 = user2.id

      const user3 = await prisma.user.create({
        data: {
          email: 'test3@example.com',
          password: 'hash',
          firstName: 'Test',
          lastName: 'User3'
        }
      })
      userId3 = user3.id
    })

    it('should assign to MAIN position when slot is empty', async () => {
      const assignment = await autoAssignUser({
        userId,
        birthYear: 2016,
        mainPositionKey: 'STOPER',
        altPositionKey: 'SOL_DEF'
      })

      expect(assignment).toBeDefined()
      expect(assignment.positionKey).toBe('STOPER')
      expect(assignment.number).toBe(4) // STOPER = forma 4
      
      // Squad'ta atama var mı kontrol et
      const squad = await prisma.squad.findUnique({
        where: { id: assignment.squadId },
        include: { assignments: true }
      })
      expect(squad?.assignments).toHaveLength(1)
      expect(squad?.assignments[0].positionKey).toBe('STOPER')
    })

    it('should assign to ALT position when MAIN is full', async () => {
      // İlk kullanıcıya ANA mevkiyi ata
      const assignment1 = await autoAssignUser({
        userId,
        birthYear: 2016,
        mainPositionKey: 'STOPER',
        altPositionKey: 'SOL_DEF'
      })

      // İkinci kullanıcıya ata (ANA dolu, ALT boş)
      const assignment2 = await autoAssignUser({
        userId: userId2,
        birthYear: 2016,
        mainPositionKey: 'STOPER',
        altPositionKey: 'SOL_DEF'
      })

      expect(assignment2).toBeDefined()
      expect(assignment2.positionKey).toBe('SOL_DEF') // ALT pozisyona atandı
      expect(assignment2.number).toBe(3) // SOL_DEF = forma 3
    })

    it('should create NEW SQUAD when MAIN and ALT are both full', async () => {
      // İlk iki kullanıcı mevcut kadrolara ata
      await autoAssignUser({
        userId,
        birthYear: 2016,
        mainPositionKey: 'STOPER',
        altPositionKey: 'SOL_DEF'
      })

      await autoAssignUser({
        userId: userId2,
        birthYear: 2016,
        mainPositionKey: 'STOPER',
        altPositionKey: 'SOL_DEF'
      })

      // Üçüncü kullanıcı - yeni kadro oluşturulmalı
      const assignment3 = await autoAssignUser({
        userId: userId3,
        birthYear: 2016,
        mainPositionKey: 'STOPER',
        altPositionKey: 'SOL_DEF'
      })

      expect(assignment3).toBeDefined()
      expect(assignment3.positionKey).toBe('STOPER') // ANA pozisyona atandı
      
      // Yeni kadro oluşturuldu mu kontrol et
      const squads = await prisma.squad.findMany({
        where: { ageGroupCode: 'U2016', template: '7+1' }
      })
      expect(squads.length).toBeGreaterThan(1) // Birden fazla kadro olmalı
    })

    it('should not assign same user twice in same age group', async () => {
      // İlk atama
      const assignment1 = await autoAssignUser({
        userId,
        birthYear: 2016,
        mainPositionKey: 'STOPER',
        altPositionKey: 'SOL_DEF'
      })

      // Aynı kullanıcıyı tekrar atamaya çalış
      const assignment2 = await autoAssignUser({
        userId,
        birthYear: 2016,
        mainPositionKey: 'FORVET',
        altPositionKey: 'ORTA'
      })

      // Aynı atama döndürülmeli
      expect(assignment2.id).toBe(assignment1.id)
      expect(assignment2.positionKey).toBe('STOPER') // İlk pozisyon korunmalı
    })

    it('should throw error for invalid template position', async () => {
      await expect(
        autoAssignUser({
          userId,
          birthYear: 2016,
          mainPositionKey: 'SAGBEK', // 7+1'de SAGBEK yok, SAG_DEF var
          altPositionKey: 'SOL_DEF'
        })
      ).rejects.toThrow('POSITION_TEMPLATE_MISMATCH')
    })
  })
})
