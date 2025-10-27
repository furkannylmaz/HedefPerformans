import { Resend } from 'resend'

// Resend API key - Her çağrıda kontrol et
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY
  console.log('🔍 [EMAIL-DEBUG] API Key check:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined')
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY bulunamadı - Email gönderimi kapalı')
    return null
  }
  
  try {
    return new Resend(apiKey)
  } catch (error) {
    console.error('❌ Resend başlatma hatası:', error)
    return null
  }
}

// Email sablonları
export async function sendWelcomeEmail(email: string, firstName: string, password: string, loginUrl: string) {
  const resend = getResendClient()
  if (!resend) {
    console.warn('⚠️ Resend başlatılmamış - Email göndermeyi atlıyoruz')
    return { success: false, error: 'Email servisi aktif değil' }
  }
  
  try {
    await resend.emails.send({
      from: 'Hedef Performans <onboarding@resend.dev>',
      to: email,
      subject: 'Hedef Performans\'a Hoş Geldiniz! 🎯',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #22C55E;">Hedef Performans'a Hoş Geldiniz!</h1>
          <p>Merhaba ${firstName},</p>
          <p>Hesabınız başarıyla oluşturuldu. Hesap bilgileriniz:</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>E-posta:</strong> ${email}</p>
            <p><strong>Şifre:</strong> ${password}</p>
          </div>
          <p style="color: #666;">⚠️ Bu şifreyi kimseyle paylaşmayın.</p>
          <a href="${loginUrl}" style="display: inline-block; background: #22C55E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Giriş Yap
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Sorularınız için: support@hedefperformans.com
          </p>
        </div>
      `
    })
    console.log('✅ Welcome email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('❌ Email gönderme hatası:', error)
    return { success: false, error }
  }
}

export async function sendSquadAssignmentEmail(email: string, firstName: string, squadName: string, positionKey: string, squadNumber: number) {
  const resend = getResendClient()
  if (!resend) {
    console.warn('⚠️ Resend başlatılmamış - Email göndermeyi atlıyoruz')
    return { success: false, error: 'Email servisi aktif değil' }
  }
  
  try {
    await resend.emails.send({
      from: 'Hedef Performans <onboarding@resend.dev>',
      to: email,
      subject: 'Ödemeniz Onaylandı ve Kadroya Atandınız! ⚽',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #22C55E;">🎉 Ödemeniz Onaylandı ve Kadroya Atandınız!</h1>
          <p>Merhaba ${firstName},</p>
          <p>✅ Ödemeleriniz onaylandı ve sizin için uygun kadroya atandınız! İşte kadro bilgileriniz:</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Kadro:</strong> ${squadName}</p>
            <p><strong>Pozisyon:</strong> ${positionKey}</p>
            <p><strong>Numara:</strong> #${squadNumber}</p>
          </div>
          <p style="color: #22C55E; font-weight: bold;">Artık kadronuzu görebilir ve diğer üyelerle iletişime geçebilirsiniz!</p>
          <a href="http://localhost:3000/member/dashboard" style="display: inline-block; background: #22C55E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Dashboard'a Git
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Sorularınız için: support@hedefperformans.com
          </p>
        </div>
      `
    })
    console.log('✅ Squad assignment email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('❌ Email gönderme hatası:', error)
    return { success: false, error }
  }
}

export async function sendPaymentApprovedEmail(email: string, firstName: string) {
  const resend = getResendClient()
  if (!resend) {
    console.warn('⚠️ Resend başlatılmamış - Email göndermeyi atlıyoruz')
    return { success: false, error: 'Email servisi aktif değil' }
  }
  
  try {
    await resend.emails.send({
      from: 'Hedef Performans <onboarding@resend.dev>',
      to: email,
      subject: 'Ödemeniz Onaylandı! ✅',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #22C55E;">Ödemeniz Onaylandı!</h1>
          <p>Merhaba ${firstName},</p>
          <p>Ödeme işleminiz başarıyla onaylandı. Şimdi kadroya atanma süreci başlatıldı.</p>
          <p style="color: #22C55E; font-weight: bold;">Kısa süre içinde kadro bilgileriniz size e-posta ile iletilecektir.</p>
          <a href="http://localhost:3000/member/dashboard" style="display: inline-block; background: #22C55E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Dashboard'a Git
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Sorularınız için: support@hedefperformans.com
          </p>
        </div>
      `
    })
    console.log('✅ Payment approval email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('❌ Email gönderme hatası:', error)
    return { success: false, error }
  }
}

