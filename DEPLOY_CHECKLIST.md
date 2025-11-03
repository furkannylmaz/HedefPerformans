# ✅ Canlıya Alma Kontrol Listesi

## 📋 ÖN HAZIRLIK

### 1. GitHub Repository Hazırlığı
- [ ] GitHub hesabı oluşturuldu
- [ ] Yeni repository oluşturuldu
- [ ] Kodlar GitHub'a yüklendi
- [ ] `.env` dosyası `.gitignore`'da (asla GitHub'a yüklenmemeli!)

### 2. Servisler Kurulumu
- [ ] **Railway.app** hesabı oluşturuldu
- [ ] **Upstash.com** hesabı oluşturuldu  
- [ ] **Cloudflare** hesabı oluşturuldu (R2 için)
- [ ] **Resend.com** hesabı oluşturuldu (zaten var mı kontrol et)

---

## 🗄️ VERİTABANI (PostgreSQL)

### Railway ile PostgreSQL Kurulumu

1. [Railway.app](https://railway.app) → "Start New Project" → "Provision PostgreSQL"
2. PostgreSQL oluştuktan sonra:
   - **Variables** sekmesinden `DATABASE_URL` değerini kopyalayın
   - Format: `postgresql://postgres:PASSWORD@HOST:PORT/railway`
   
✅ **Yapıldı mı?** ☐

**DATABASE_URL:** `postgresql://...` (buraya yazın)

---

## 🔴 REDIS (Kadro Atama Sistemi)

### Upstash ile Redis Kurulumu

1. [Upstash.com](https://upstash.com) → "Create Database" → "Redis"
2. Database oluştuktan sonra:
   - **Details** sekmesinden bilgileri alın:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
   - VEYA **Traditional** modu seçerseniz:
     - `REDIS_HOST`
     - `REDIS_PORT`
     - `REDIS_PASSWORD`

✅ **Yapıldı mı?** ☐

**REDIS Bilgileri:** (buraya yazın)

---

## 💾 DOSYA DEPOLAMA (Videolar)

### Cloudflare R2 Kurulumu

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → "R2" → "Create bucket"
2. Bucket adı: `hedef-performans-videos`
3. "Manage R2 API Tokens" → "Create API Token"
4. Bilgileri kaydedin:
   - `Account ID`
   - `Access Key ID`
   - `Secret Access Key`
   - `Public URL` (Custom domain ayarlayabilirsiniz)

✅ **Yapıldı mı?** ☐

**R2 Bilgileri:** (buraya yazın)

---

## 📧 EMAIL SERVİSİ (Resend)

1. [Resend.com](https://resend.com) → Giriş yapın
2. "API Keys" → "Create API Key"
3. Key'i kopyalayın

✅ **Yapıldı mı?** ☐

**RESEND_API_KEY:** `re_...` (buraya yazın)

---

## 🌐 DOMAIN

Domain'iniz: **__________________**

DNS ayarları (Vercel deploy sonrası yapılacak):
- A Record: `@` → Vercel IP
- CNAME Record: `www` → Vercel CNAME

✅ **Domain hazır mı?** ☐

---

## 🚀 VERCEL DEPLOY

### Adım 1: GitHub'a Yükleme

```bash
git init
git add .
git commit -m "Production ready"
git branch -M main
git remote add origin https://github.com/KULLANICIADI/hedef-performans.git
git push -u origin main
```

✅ **GitHub'a yüklendi mi?** ☐

### Adım 2: Vercel'e Bağlama

1. [Vercel.com](https://vercel.com) → GitHub ile giriş
2. "Add New Project" → Repository seç → "Import"

✅ **Vercel'e bağlandı mı?** ☐

### Adım 3: Environment Variables

Vercel'de **Settings** → **Environment Variables** kısmına şunları ekleyin:

```bash
# Veritabanı
DATABASE_URL=postgresql://...

# Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
# VEYA
REDIS_HOST=...
REDIS_PORT=6379
REDIS_PASSWORD=...

# Dosya Depolama (R2)
MINIO_ENDPOINT=<account-id>.r2.cloudflarestorage.com
MINIO_PORT=443
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET_NAME=hedef-performans-videos
MINIO_USE_SSL=true
MINIO_PUBLIC_URL=https://pub-xxxxx.r2.dev  # Veya custom domain

# Email
RESEND_API_KEY=re_...

# Uygulama
NEXT_PUBLIC_APP_URL=https://yourdomain.com
APP_URL=https://yourdomain.com
NODE_ENV=production

# NextAuth (güvenli random string)
NEXTAUTH_SECRET=<openssl-rand-base64-32-ile-oluşturun>
NEXTAUTH_URL=https://yourdomain.com
```

✅ **Environment variables eklendi mi?** ☐

### Adım 4: Build & Deploy

1. "Deploy" butonuna tıklayın
2. Build tamamlanana kadar bekleyin
3. Başarılı olursa URL alın: `https://hedef-performans.vercel.app`

✅ **Deploy başarılı mı?** ☐

### Adım 5: Domain Bağlama

1. Vercel → "Settings" → "Domains"
2. Domain'inizi girin
3. DNS kayıtlarını domain sağlayıcınıza ekleyin

✅ **Domain bağlandı mı?** ☐

---

## 🔧 PRODUCTION AYARLARI

### Prisma Schema Güncellemesi

`prisma/schema.prisma` dosyasında:
```prisma
datasource db {
  provider = "postgresql"  // sqlite yerine
  url      = env("DATABASE_URL")
}
```

✅ **Schema güncellendi mi?** ☐

### Migration Çalıştırma

Local'de production DATABASE_URL ile:
```bash
npx prisma generate
npx prisma migrate deploy
```

✅ **Migration çalıştırıldı mı?** ☐

### İlk Admin Kullanıcı

Local'de veya Railway console'dan:
```bash
# Environment variable ile
ADMIN_EMAIL=admin@yourdomain.com ADMIN_PASSWORD=GüvenliŞifre123! npx tsx scripts/create-admin.ts

# Veya direkt çalıştırıp soruları cevaplayın
npx tsx scripts/create-admin.ts
```

✅ **Admin kullanıcı oluşturuldu mu?** ☐

---

## ✅ SON KONTROLLER

- [ ] Site açılıyor mu? `https://yourdomain.com`
- [ ] Kayıt formu çalışıyor mu?
- [ ] Admin paneline giriş yapılabiliyor mu?
- [ ] Email gönderimi çalışıyor mu?
- [ ] Dosya yükleme çalışıyor mu?
- [ ] Ödeme sistemi çalışıyor mu?

---

## 🎉 TAMAMLANDI!

Projeniz artık canlıda! 🚀

---

## 📞 YARDIM

Herhangi bir adımda takılırsanız, bana sorun!

