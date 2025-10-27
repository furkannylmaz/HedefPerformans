// Test setup
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

beforeAll(async () => {
  // Test veritabanını temizle
  await prisma.squadAssignment.deleteMany()
  await prisma.squad.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

