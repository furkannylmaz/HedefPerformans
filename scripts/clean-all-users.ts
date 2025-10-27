// Script: Clean All Users
// Hedef Performans - Tüm Üyeleri Sil

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanAllUsers() {
  console.log('🧹 Tüm üyeleri temizliyorum...\n')
  
  try {
    // 1. Squad Assignments sil
    console.log('🗑️  Squad Assignments siliniyor...')
    const deletedAssignments = await prisma.squadAssignment.deleteMany()
    console.log(`✅ ${deletedAssignments.count} atama silindi`)
    
    // 2. WhatsApp Groups sil
    console.log('🗑️  WhatsApp Groups siliniyor...')
    const deletedWhatsapp = await prisma.whatsAppGroup.deleteMany()
    console.log(`✅ ${deletedWhatsapp.count} WhatsApp grubu silindi`)
    
    // 3. Terms Consents sil
    console.log('🗑️  Terms Consents siliniyor...')
    const deletedTerms = await prisma.termsConsent.deleteMany()
    console.log(`✅ ${deletedTerms.count} terms consent silindi`)
    
    // 4. Payments sil
    console.log('🗑️  Payments siliniyor...')
    const deletedPayments = await prisma.payment.deleteMany()
    console.log(`✅ ${deletedPayments.count} ödeme kaydı silindi`)
    
    // 5. Videos sil
    console.log('🗑️  Videos siliniyor...')
    const deletedVideos = await prisma.video.deleteMany()
    console.log(`✅ ${deletedVideos.count} video silindi`)
    
    // 6. Member Profiles sil
    console.log('🗑️  Member Profiles siliniyor...')
    const deletedProfiles = await prisma.memberProfile.deleteMany()
    console.log(`✅ ${deletedProfiles.count} profil silindi`)
    
    // 7. Users sil
    console.log('🗑️  Users siliniyor...')
    const deletedUsers = await prisma.user.deleteMany()
    console.log(`✅ ${deletedUsers.count} kullanıcı silindi`)
    
    // 8. Squads sil (opsiyonel - boş kadrolar)
    console.log('🗑️  Boş kadrolar siliniyor...')
    const deletedSquads = await prisma.squad.deleteMany()
    console.log(`✅ ${deletedSquads.count} kadro silindi`)
    
    console.log('\n✅ Tüm üyeler ve ilgili veriler temizlendi!')
    
  } catch (error: any) {
    console.error('❌ Silme hatası:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanAllUsers()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })

