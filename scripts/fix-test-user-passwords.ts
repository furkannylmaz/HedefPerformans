// Fix Test User Passwords
// Hedef Performans - Test Kullanıcı Şifreleri

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Fixing test user passwords...')
  
  const password = '123456' // Basit test şifresi
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: '@test.com'
      }
    }
  })
  
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        status: 'ACTIVE'
      }
    })
    console.log(`✅ Updated password for ${user.email}`)
  }
  
  console.log('\n✅ Test user passwords fixed!')
  console.log('📝 Login credentials:')
  console.log('   Email: test-user-1@test.com | test-user-2@test.com | test-user-3@test.com')
  console.log('   Password: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


