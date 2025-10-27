# 📧 Email Servisi Kurulum Rehberi

## 1️⃣ Resend Hesabı Oluşturun

1. [Resend.com](https://resend.com) adresine gidin
2. "Sign Up" butonuna tıklayın
3. Email/şifre ile kayıt olun

## 2️⃣ API Key Alın

1. Resend dashboard'a giriş yapın
2. Sol menüden **"API Keys"** seçin
3. **"Create API Key"** butonuna tıklayın
4. Bir isim verin (örn: "Hedef Performans Production")
5. Key'i kopyalayın (bir daha gösterilmeyecek)

## 3️⃣ .env Dosyasına Ekleyin

`.env` dosyanızı açın ve ekleyin:

```bash
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
```

**VEYA** `.env.local` dosyası oluşturun:

```bash
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
```

## 4️⃣ Test Email Gönderin

### Yöntem 1: Test Script (Kolay)

```bash
# Test email'inizi ayarlayın (isteğe bağlı)
export TEST_EMAIL="your-email@gmail.com"

# Test scripti çalıştırın
npx tsx scripts/test-email.ts
```

### Yöntem 2: Manuel Test (Gerçek Senaryo)

1. **Hoş geldin email testi:**
   - Yeni bir kullanıcı kaydolun
   - Kayıt olduğunuz email'i kontrol edin
   - "Hoş geldin" email'i gelmeli

2. **Kadro atama email testi:**
   - Admin panelden bir kullanıcının ödemesini onaylayın
   - Kullanıcının email'ini kontrol edin
   - "Kadroya atandınız" email'i gelmeli

3. **Ödeme onayı email testi:**
   - Online ödeme yapın veya havale ile kayıt olun
   - Admin panelden ödeme onaylayın
   - "Ödemeniz onaylandı" email'i gelmeli

## 5️⃣ Email Gelmemişse Kontrol Edin

### Resend Dashboard'dan kontrol edin:
1. **Logs** sayfasına gidin
2. Gönderim durumunu kontrol edin
3. Hata varsa log'a bakın

### Console log'larından kontrol edin:
```bash
# Development server'da şu logları göreceksiniz:
✅ Welcome email sent to: user@example.com
✅ Squad assignment email sent to: user@example.com
✅ Payment approval email sent to: user@example.com
```

### Hata varsa:
- `.env` dosyasında `RESEND_API_KEY` var mı?
- API key geçerli mi?
- Email adresi geçerli mi?
- Spam klasörünü kontrol ettiniz mi?

## 6️⃣ Production'a Geçerken

Domain doğrulaması yapmanız gerekebilir:

1. Resend dashboard → Domains
2. "Add Domain" butonuna tıklayın
3. Domain'inizi ekleyin (örn: `hedefperformans.com`)
4. DNS kayıtlarını ekleyin (Resend'den verilenler)
5. Doğrulamayı tamamlayın

## 📊 Email Limits

- **Ücretsiz plan:** 3,000 email/gün
- **Kredi kartı gerekmez**
- **API sınırı yok**

## 🔒 Güvenlik

- API key'i **ASLA** git'e commit etmeyin
- `.env` dosyasını `.gitignore`'a ekleyin
- Production'da environment variable olarak kullanın

