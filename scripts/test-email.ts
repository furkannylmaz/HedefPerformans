// Email servisi test scripti
// Kullanım: npx tsx scripts/test-email.ts

import { sendWelcomeEmail, sendSquadAssignmentEmail, sendPaymentApprovedEmail } from '../lib/email'

async function testEmails() {
  const testEmail = process.env.TEST_EMAIL || 'test@example.com'
  const testFirstName = 'Test'
  const testPassword = 'Test123456'

  console.log('🧪 Email servisi test başlatılıyor...\n')

  // 1. Hoş geldin email'i test et
  console.log('1️⃣  Hoş geldin email gönderiliyor...')
  const welcomeResult = await sendWelcomeEmail(
    testEmail,
    testFirstName,
    testPassword,
    'http://localhost:3000/auth'
  )
  console.log('✅ Sonuç:', welcomeResult)
  console.log('\n⏳ 5 saniye bekleniyor...\n')
  await new Promise(resolve => setTimeout(resolve, 5000))

  // 2. Kadro ataması email'i test et
  console.log('2️⃣  Kadro atama email gönderiliyor...')
  const squadResult = await sendSquadAssignmentEmail(
    testEmail,
    testFirstName,
    'U2011 10+1 A',
    'FORVET',
    9
  )
  console.log('✅ Sonuç:', squadResult)
  console.log('\n⏳ 5 saniye bekleniyor...\n')
  await new Promise(resolve => setTimeout(resolve, 5000))

  // 3. Ödeme onayı email'i test et
  console.log('3️⃣  Ödeme onayı email gönderiliyor...')
  const paymentResult = await sendPaymentApprovedEmail(
    testEmail,
    testFirstName
  )
  console.log('✅ Sonuç:', paymentResult)

  console.log('\n✅ Tüm testler tamamlandı!')
  console.log('📧 E-posta kutunuzu kontrol edin:', testEmail)
}

testEmails().catch(console.error)

