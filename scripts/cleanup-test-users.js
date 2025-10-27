const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupTestUsers() {
  try {
    const deleted = await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'worker-test'
        }
      }
    })
    
    console.log(`✅ ${deleted.count} test kullanıcısı silindi`)
  } catch (error) {
    console.error('❌ Cleanup hatası:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupTestUsers()
