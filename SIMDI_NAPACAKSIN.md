# 🚀 ŞİMDİ NE YAPACAKSIN? - Adım Adım Kılavuz

## ✅ ŞU AN DURUM

- Prisma schema PostgreSQL'e çevrildi ✓
- Kodlar hazır ✓
- Sadece deploy ve migration yapılması gerekiyor

---

## 📝 ADIM 1: Git'e Commit ve Push (2 dakika)

Terminal'de proje klasöründe şunları çalıştır:

```bash
# Değişiklikleri göster
git status

# Tüm değişiklikleri ekle
git add .

# Commit yap
git commit -m "Update Prisma schema to PostgreSQL for production"

# Vercel'e push et
git push
```

**Sonuç:** Vercel otomatik olarak deploy etmeye başlayacak.

---

## ⏳ ADIM 2: Vercel Deploy'unu Bekle (3-5 dakika)

1. Vercel dashboard'a git: https://vercel.com/dashboard
2. Projeni bul
3. "Deployments" sekmesine bak
4. En üstteki deployment'ın "Building" → "Ready" olmasını bekle

**Kontrol:** Build başarılı olmalı (yeşil tick). Hata varsa logları kontrol et.

---

## 🗄️ ADIM 3: Database Migration Çalıştır (ÖNEMLİ!)

Vercel deploy tamamlandıktan SONRA database'de tabloları oluşturman lazım.

### Seçenek A: Prisma db push (EN KOLAY - Önerilen)

Terminal'de:

```bash
# Neon/PostgreSQL connection string'ini kullan
DATABASE_URL="postgresql://your-connection-string" npx prisma db push
```

**Bu komut:**

- Database'de tabloları oluşturur
- Schema'yı database'e uygular
- Migration geçmişi tutmaz (ilk kurulum için yeterli)

### Seçenek B: Prisma migrate deploy (Migration geçmişi ile)

Eğer migration geçmişini tutmak istersen:

```bash
# Önce migration oluştur (local'de)
DATABASE_URL="postgresql://your-connection-string" npx prisma migrate dev --name init

# Sonra production'a uygula
DATABASE_URL="postgresql://your-connection-string" npx prisma migrate deploy
```

---

## 🔍 ADIM 4: Kontrol Et

### 4.1 Health Check

Tarayıcıda aç:

```
https://yourdomain.com/api/health
```

**Beklenen sonuç:**

```json
{
  "status": "ok",
  "checks": {
    "database": "ok",
    "cloudinary": "ok"
  }
}
```

### 4.2 Admin Panel Test

1. Admin paneline git: `/admin/sliders`
2. Görsel yükle
3. Slider kaydet

**Sorun varsa:** Vercel Logs'dan error mesajlarını kontrol et.

---

## ❓ SORUN ÇIKARSA

### Hata: "the URL must start with the protocol `file:`"

**Neden:** Vercel eski Prisma Client'ı kullanıyor.

**Çözüm:**

1. Vercel dashboard → Project → Settings → General
2. "Clear Build Cache" butonuna tıkla
3. Yeniden deploy et

### Hata: "Table does not exist"

**Neden:** Migration çalıştırılmamış.

**Çözüm:** ADIM 3'ü tekrar yap.

### Hata: "Can't reach database server"

**Neden:** DATABASE_URL yanlış veya database kapalı.

**Çözüm:**

1. Vercel dashboard → Settings → Environment Variables
2. DATABASE_URL'in doğru olduğundan emin ol
3. Database servisinin çalıştığını kontrol et (Neon/Railway dashboard)

---

## ✅ ÖZET CHECKLIST

- [ ] Git'e commit ve push ettim
- [ ] Vercel deploy başarılı oldu
- [ ] Database migration çalıştırdım (`prisma db push`)
- [ ] `/api/health` endpoint'i çalışıyor
- [ ] Admin panelinden slider kaydedebiliyorum
- [ ] Hata yok, her şey çalışıyor!

---

## 📞 HALA SORUN VARSA

1. Vercel Logs'u kontrol et: Dashboard → Project → Logs
2. Health check endpoint'ini test et: `/api/health`
3. Error mesajlarını not al
4. Bana sor!

---

## 🎉 BAŞARILI OLURSA

Artık:

- ✅ PostgreSQL kullanılıyor
- ✅ Görsel yükleme çalışıyor (Cloudinary)
- ✅ Slider kaydetme çalışıyor
- ✅ Tüm admin işlemleri çalışıyor

**Tebrikler! 🎊**
