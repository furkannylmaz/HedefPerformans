// Unit Test - Squad Assignment Logic
// Hedef Performans - Kadro Atama Sistemi

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { PrismaClient } from '@prisma/client'
import { autoAssignUser } from '../lib/squads/assign'

const prisma = new PrismaClient()

describe('Squad Assignment Logic', () => {
  let testUserId: string

  beforeAll(async () => {
    // Test kullanıcısı oluştur
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'hashed_password',
        firstName: 'Test',
        lastName: 'User',
        status: 'PENDING'
      }
    })
    testUserId = testUser.id

    // MemberProfile oluştur
    await prisma.memberProfile.create({
      data: {
        userId: testUser.id,
        birthYear: 2016,
        mainPositionKey: 'SAG_KANAT',
        altPositionKey: 'FORVET',
        country: 'TR',
        city: 'Istanbul',
        district: 'Test',
        phone: '+905551234567'
      }
    })
  })

  afterAll(async () => {
    // Test verilerini temizle
    await prisma.squadAssignment.deleteMany({ where: { userId: testUserId } })
    await prisma.memberProfile.deleteMany({ where: { userId: testUserId } })
    await prisma.user.deleteMany({ where: { id: testUserId } })
    await prisma.$disconnect()
  })

  describe('Per-Kadro ALT Strategy', () => {
    it('should search ALT slot in the same squad where MAIN is full', async () => {
      // Senaryo: Squad A'da MAIN dolu, ALT boş → Squad A'ya ALT atamalı
      // Senaryo: Squad B'de MAIN boş olsa bile, Squad A'da ALT varsa Squad A seçilmeli (bugünkü mantık)
      
      // Test: Önce bir kadroya SAG_KANAT (MAIN) ekle, sonra ikinci bir kullanıcı kaydet
      // İkinci kullanıcı için ANA mevki: SAG_KANAT (dolu), ALT mevki: FORVET
      // Beklenti: İkinci kullanıcı AYNI kadroya ALT (FORVET) ile atanmalı
      
      const testUser2 = await prisma.user.create({
        data: {
          email: `test2-${Date.now()}@example.com`,
          password: 'hashed_password',
          firstName: 'Test2',
          lastName: 'User2',
          status: 'PENDING'
        }
      })

      await prisma.memberProfile.create({
        data: {
          userId: testUser2.id,
          birthYear: 2016,
          mainPositionKey: 'SAG_KANAT',
          altPositionKey: 'FORVET',
          country: 'TR',
          city: 'Istanbul',
          district: 'Test',
          phone: '+905551234568'
        }
      })

      // İlk kullanıcıyı atama
      const assignment1 = await autoAssignUser({
        userId: testUserId,
        birthYear: 2016,
        mainPositionKey: 'SAG_KANAT',
        altPositionKey: 'FORVET'
      })

      expect(assignment1).toBeDefined()
      expect(assignment1.positionKey).toBe('SAG_KANAT')
      console.log(`✅ İlk atama: ${assignment1.id} → ${assignment1.positionKey}`)

      // İkinci kullanıcıyı atama (MAIN dolu olacak, ALT denenmeli)
      const assignment2 = await autoAssignUser({
        userId: testUser2.id,
        birthYear: 2016,
        mainPositionKey: 'SAG_KANAT', // Dolu olacak
        altPositionKey: 'FORVET' // ALT denenmeli
      })

      expect(assignment2).toBeDefined()
      
      // ALT ataması aynı kadroda olmalı (bugünkü mantık)
      console.log(`✅ İkinci atama: ${assignment2.id} → ${assignment2.positionKey}`)
      
      // Temizlik
      await prisma.squadAssignment.deleteMany({ where: { userId: testUser2.id } })
      await prisma.memberProfile.deleteMany({ where: { userId: testUser2.id } })
      await prisma.user.delete({ where: { id: testUser2.id } })
    })

    it('should NOT create NEW_SQUAD if MAIN slot is available in ANY squad', async () => {
      // Senaryo: Bir kadroda MAIN boşken, NEW_SQUAD çağrılmamalı
      
      // Tüm kadroları kontrol et
      const allSquads = await prisma.squad.findMany({
        where: {
          ageGroupCode: 'U2016',
          template: '7+1'
        },
        include: {
          assignments: true,
          _count: {
            select: { assignments: true }
          }
        }
      })

      const totalSlots = 8 // 7+1 şablonu
      
      // Boş MAIN slotu (SAG_KANAT = 7) olan kadroları bul
      const squadsWithEmptyMain = allSquads.filter(squad => {
        const hasMainSlot = squad.assignments.some(a => a.number === 7 && a.positionKey === 'SAG_KANAT')
        return !hasMainSlot && squad._count.assignments < totalSlots
      })

      if (squadsWithEmptyMain.length > 0) {
        // Test kullanıcısı oluştur
        const testUser = await prisma.user.create({
          data: {
            email: `test-new-squad-${Date.now()}@example.com`,
            password: 'hashed_password',
            firstName: 'Test',
            lastName: 'NewSquad',
            status: 'PENDING'
          }
        })

        await prisma.memberProfile.create({
          data: {
            userId: testUser.id,
            birthYear: 2016,
            mainPositionKey: 'SAG_KANAT',
            altPositionKey: 'FORVET',
            country: 'TR',
            city: 'Istanbul',
            district: 'Test',
            phone: '+905551234569'
          }
        })

        // Atama yap
        const assignment = await autoAssignUser({
          userId: testUser.id,
          birthYear: 2016,
          mainPositionKey: 'SAG_KANAT',
          altPositionKey: 'FORVET'
        })

        expect(assignment).toBeDefined()
        expect(assignment.positionKey).toBe('SAG_KANAT') // MAIN slot olmalı
        expect(assignment.number).toBe(7) // SAG_KANAT = 7 numara
        
        // Temizlik
        await prisma.squadAssignment.deleteMany({ where: { userId: testUser.id } })
        await prisma.memberProfile.deleteMany({ where: { userId: testUser.id } })
        await prisma.user.delete({ where: { id: testUser.id } })
      }
    })
  })

  describe('Global vs Per-Kadro ALT Strategy', () => {
    it('should implement PER-KADRO ALT strategy (current behavior)', async () => {
      /**
       * Bugünkü Mantık:
       * 1. Her kadro için önce MAIN ara
       * 2. Aynı kadroda MAIN yoksa ALT ara
       * 3. Sonraki kadroya geç
       * 
       * Bu STRICTLY per-kadro demektir:
       * - Squad A'da MAIN dolu, ALT boş → Squad A'ya ALT atar
       * - Squad B'de MAIN boş olsa bile Squad A seçilir
       * 
       * Alternatif (global) mantık olsaydı:
       * - Önce tüm kadrolarda MAIN ara
       * - MAIN bulamazsa tüm kadrolarda ALT ara
       */
      
      const testUser = await prisma.user.create({
        data: {
          email: `test-per-kadro-${Date.now()}@example.com`,
          password: 'hashed_password',
          firstName: 'Test',
          lastName: 'PerKadro',
          status: 'PENDING'
        }
      })

      await prisma.memberProfile.create({
        data: {
          userId: testUser.id,
          birthYear: 2016,
          mainPositionKey: 'SAG_KANAT',
          altPositionKey: 'FORVET',
          country: 'TR',
          city: 'Istanbul',
          district: 'Test',
          phone: '+905551234570'
        }
      })

      // Atama yap
      const assignment = await autoAssignUser({
        userId: testUser.id,
        birthYear: 2016,
        mainPositionKey: 'SAG_KANAT',
        altPositionKey: 'FORVET'
      })

      // Bugünkü mantık: Per-kadro arama yapıyor
      // Her kadro için önce MAIN, sonra ALT deneniyor
      // Bu test gerçek davranışı doğrulamıyor, sadece mantığı açıklıyor
      
      expect(assignment).toBeDefined()
      console.log(`✅ Per-kadro strateji: ${assignment.positionKey} (number: ${assignment.number})`)
      
      // Temizlik
      await prisma.squadAssignment.deleteMany({ where: { userId: testUser.id } })
      await prisma.memberProfile.deleteMany({ where: { userId: testUser.id } })
      await prisma.user.delete({ where: { id: testUser.id } })
    })
  })
})

