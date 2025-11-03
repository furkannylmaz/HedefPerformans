# 💳 Online Ödeme vs Havale/EFT - Süreç Karşılaştırması

## 📋 Genel Akış

### 🟢 Online Ödeme (Kart ile)

1. **Kayıt** → `app/api/auth/register/route.ts`
   - User oluşturulur: `status = PENDING`
   - Hoş geldin email'i gönderilir ✅
   - Dashboard'a yönlendirilir

2. **Ödeme Sayfası** → `/checkout/payment-method`
   - Online ödeme seçilir
   - 3D Secure ile ödeme yapılır

3. **Başarılı Ödeme** → `/checkout/success`
   - `app/api/admin/users/approve-payment` çağrılır
   - User status: `PENDING → PAID` ✅
   - Payment kaydı oluşturulur: `status = PAID` ✅
   - Kadro atama job'u başlatılır ✅
   - Job tamamlandığında **TEK email** gönderilir:
     - "Ödemeniz Onaylandı ve Kadroya Atandınız!"

---

### 🔵 Havale/EFT

1. **Kayıt** → `app/api/auth/register/route.ts`
   - User oluşturulur: `status = PENDING`
   - Hoş geldin email'i gönderilir ✅
   - Dashboard'a yönlendirilir

2. **Ödeme Sayfası** → `/checkout/payment-method`
   - Havale/EFT seçilir
   - Banka bilgileri gösterilir
   - Manuel ödeme yapılır

3. **Ödeme Yapıldı Sayfası** → `/checkout/payment-method/transfer-success`
   - ✅ Sadece bilgilendirme mesajı
   - ❌ Email GÖNDERİLMEZ
   - ❌ User status DEĞİŞMEZ (PENDING kalır)
   - ❌ Payment kaydı OLUŞTURULMAZ

4. **Admin İşlemleri**
   - Admin `/admin/users` sayfasına girer
   - Kullanıcının yanında **"Ödemeyi Onayla"** butonu görür
   - Butona tıklar

5. **Admin Onay** → `app/api/admin/users/approve-payment`
   - User status: `PENDING → PAID` ✅
   - Payment kaydı oluşturulur: `status = PAID` ✅
   - Kadro atama job'u başlatılır ✅
   - Job tamamlandığında **TEK email** gönderilir:
     - "Ödemeniz Onaylandı ve Kadroya Atandınız!"

---

## 📊 Farklar Tablosu

| Özellik | Online Ödeme | Havale/EFT |
|---------|-------------|------------|
| **User Status (Kayıt sonrası)** | PENDING | PENDING |
| **Hoş Geldin Email** | ✅ Gönderilir | ✅ Gönderilir |
| **Ödeme Sonrası Status** | Otomatik PAID | Manuel PAID (admin onayı) |
| **Ödeme Sonrası Email** | ✅ Kadro bilgileri | ✅ Kadro bilgileri |
| **Payment Kaydı** | Otomatik oluşturulur | Admin onayından sonra oluşturulur |
| **Kadro Ataması** | Otomatik başlatılır | Admin onayından sonra başlatılır |
| **Bekleme Süresi** | ~5-10 saniye | Admin onayına kadar bekleme |

---

## 📧 Email Servisi - Çalışma Mantığı

### Email Türleri

#### 1️⃣ Hoş Geldin Email'i
- **Ne zaman:** Kullanıcı kayıt olduğunda
- **Kim:** `sendWelcomeEmail()` fonksiyonu
- **İçerik:**
  - Hoş geldin mesajı
  - Email/şifre bilgileri
  - Giriş linki

#### 2️⃣ Ödeme Onay + Kadro Email'i
- **Ne zaman:** Admin ödeme onayladığında VE kadro ataması tamamlandığında
- **Kim:** `sendSquadAssignmentEmail()` fonksiyonu
- **İçerik:**
  - Ödeme onaylandı mesajı
  - Kadro adı
  - Pozisyon
  - Numarası

### Email Gönderimi Akışı

```
Online Ödeme:
Kayıt → Hoş geldin email ✅
↓
Ödeme → Success page
↓
Admin API (/api/admin/users/approve-payment) → Çağrılır
↓
User: PENDING → PAID
↓
Payment kaydı oluşturulur
↓
Kadro atama job'u başlatılır
↓
Job tamamlandığında → Email gönderilir 📧

Havale/EFT:
Kayıt → Hoş geldin email ✅
↓
Ödeme bilgileri gösterilir
↓
[MANUEL SÜREÇ - Admin beklemede]
↓
Admin "Ödemeyi Onayla" tıklar
↓
Admin API (/api/admin/users/approve-payment) → Çağrılır
↓
User: PENDING → PAID
↓
Payment kaydı oluşturulur
↓
Kadro atama job'u başlatılır
↓
Job tamamlandığında → Email gönderilir 📧
```

---

## 🔄 Otomatik vs Manuel İşlemler

### Online Ödeme (Otomatik)
```
Kullanıcı ödeme yapar
    ↓
API çağrılır (frontend'den)
    ↓
User → PAID
    ↓
Job başlatılır
    ↓
Email gönderilir
```
⏱️ **Süre:** 5-10 saniye

### Havale/EFT (Manuel)
```
Kullanıcı ödeme yapar
    ↓
[Beklemede] ⏸️
    ↓
Admin ödemeyi onaylar (manuel)
    ↓
User → PAID
    ↓
Job başlatılır
    ↓
Email gönderilir
```
⏱️ **Süre:** Admin onayına kadar beklenir (saatler/günler olabilir)

---

## 🎯 Önemli Noktalar

1. **Email servisi:** Sadece kadro ataması tamamlandığında çalışır
2. **Manuel onay email'i:** Gönderilmez (kaldırıldı)
3. **Tek email:** Ödeme onayı + Kadro bilgileri birlikte gönderilir
4. **PENDING kullanıcılar:**
   - Giriş yapabilir ✅
   - Video yükleyemez ❌
5. **PAID kullanıcılar:**
   - Giriş yapabilir ✅
   - Video yükleyebilir ✅

---

## 🧪 Test Senaryoları

### Online Ödeme Testi
1. Kullanıcı kaydolur
2. Hoş geldin email'i gelir ✅
3. Online ödeme yapar
4. 5-10 saniye bekler
5. Email: "Ödemeniz onaylandı ve kadroya atandınız!" ✅
6. Dashboard'da kadro bilgileri görünür

### Havale/EFT Testi
1. Kullanıcı kaydolur
2. Hoş geldin email'i gelir ✅
3. Havale/EFT seçer
4. Banka bilgilerini görür
5. [Beklemede] ⏸️
6. Admin giriş yapar
7. Admin "Ödemeyi Onayla" tıklar
8. Email: "Ödemeniz onaylandı ve kadroya atandınız!" ✅
9. Dashboard'da kadro bilgileri görünür

