# 🚀 Hedef Performans - Canlıya Alma Rehberi

## Adım Adım Production Deployment Kılavuzu

### 📋 GENEL BAKIŞ

Bu proje production'a almak için şunlara ihtiyacınız var:

1. **Hosting** (Next.js uygulaması için) - **Vercel** öneriyorum (ücretsiz, kolay)
2. **Veritabanı** (SQLite yerine PostgreSQL) - **Railway** veya **Supabase** (ücretsiz planlar var)
3. **Redis** (kadro atama sistemi için) - **Upstash** (ücretsiz plan var)
4. **Dosya Depolama** (videolar için) - **AWS S3** veya **Cloudflare R2** (ücretsiz planlar var)
5. **Email Servisi** - **Resend** (zaten kullanıyorsunuz)

---

## 🎯 SEÇENEK 1: VERCEL + RAILWAY (Önerilen - Kolay)

### AŞAMA 1: Veritabanını PostgreSQL'e Geçirin

#### 1.1 Railway'de PostgreSQL Oluşturun

1. [Railway.app](https://railway.app) adresine gidin
2. "Start a New Project" tıklayın
3. "Provision PostgreSQL" seçin
4. PostgreSQL oluşturulduktan sonra:
   - "Postgres" kartına tıklayın
   - "Variables" sekmesine gidin
   - `DATABASE_URL` değerini kopyalayın (şöyle bir şey: `postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway`)

#### 1.2 Prisma Schema'yı PostgreSQL için Güncelleyin

`prisma/schema.prisma` dosyasını açın ve şu değişikliği yapın:

```prisma
datasource db {
  provider = "postgresql"  // sqlite yerine postgresql
  url      = env("DATABASE_URL")
}
```

#### 1.3 Migration Çalıştırın

Terminal'de:

```bash
npx prisma generate
npx prisma migrate deploy
```

---

### AŞAMA 2: Redis Kurulumu (Upstash)

1. [Upstash.com](https://upstash.com) adresine gidin
2. Kayıt olun (ücretsiz)
3. "Create Database" tıklayın
4. "Redis" seçin
5. Database adını verin (örn: "hedef-performans-redis")
6. Region seçin (Türkiye'ye yakın: "eu-west-1" veya "eu-central-1")
7. "Create" tıklayın
8. Database oluştuktan sonra:
   - "Details" sekmesinde `UPSTASH_REDIS_REST_URL` ve `UPSTASH_REDIS_REST_TOKEN` değerlerini kopyalayın

---

### AŞAMA 3: Dosya Depolama (AWS S3 veya Cloudflare R2)

#### Seçenek A: Cloudflare R2 (Önerilen - Daha Kolay)

1. [Cloudflare Dashboard](https://dash.cloudflare.com) giriş yapın
2. Sol menüden "R2" seçin
3. "Create bucket" tıklayın
4. Bucket adını verin (örn: "hedef-performans-videos")
5. Region seçin (örn: "WEUR" - Western Europe)
6. Oluşturulduktan sonra:
   - "Manage R2 API Tokens" tıklayın
   - "Create API Token" tıklayın
   - İsim: "Hedef Performans"
   - Permissions: "Object Read & Write"
   - Bucket: Oluşturduğunuz bucket'ı seçin
   - Token oluşturun ve şu bilgileri kopyalayın:
     - Account ID
     - Access Key ID
     - Secret Access Key
   - Public URL: `https://<account-id>.r2.cloudflarestorage.com`

#### Seçenek B: AWS S3

1. [AWS Console](https://console.aws.amazon.com) giriş yapın
2. S3 servisine gidin
3. "Create bucket" tıklayın
4. Bucket adını verin
5. Region seçin
6. IAM'den Access Key oluşturun

---

### AŞAMA 4: Email Servisi (Resend)

1. [Resend.com](https://resend.com) adresine gidin
2. Kayıt olun / Giriş yapın
3. "API Keys" menüsünden yeni bir key oluşturun
4. Key'i kopyalayın (bir daha gösterilmeyecek)

---

### AŞAMA 5: Domain DNS Ayarları

Domain'inizin DNS ayarlarını yapmanız gerekecek:

1. Domain sağlayıcınızın panelinden DNS ayarlarına gidin
2. Şu kayıtları ekleyin:
   - **A Record**: `@` -> Vercel'in vereceği IP (Vercel'den alacaksınız)
   - **CNAME Record**: `www` -> Vercel'in vereceği CNAME (örn: `cname.vercel-dns.com`)

**Not:** Vercel'e deploy ettikten sonra domain'i bağladığınızda size tam talimat verecek.

---

### AŞAMA 6: Vercel'e Deploy

#### 6.1 GitHub'a Kodunuzu Yükleyin

1. [GitHub.com](https://github.com) hesabı oluşturun (yoksa)
2. Yeni bir repository oluşturun (örn: "hedef-performans")
3. Terminal'de proje klasöründe:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/kullaniciadi/hedef-performans.git
git push -u origin main
```

#### 6.2 Vercel'e Bağlayın

1. [Vercel.com](https://vercel.com) adresine gidin
2. "Sign Up" tıklayın, GitHub ile giriş yapın
3. "Add New Project" tıklayın
4. GitHub'dan "hedef-performans" repository'sini seçin
5. "Import" tıklayın

#### 6.3 Environment Variables Ekleyin

Vercel'de "Settings" -> "Environment Variables" kısmına şunları ekleyin:

```bash
# Veritabanı (Railway'den aldığınız)
DATABASE_URL=postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway

# Redis (Upstash'den aldığınız)
REDIS_HOST=<upstash-redis-host>
REDIS_PORT=6379
REDIS_PASSWORD=<upstash-redis-password>
# VEYA Upstash REST API kullanıyorsanız:
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx

# MinIO/S3 (Cloudflare R2 veya AWS S3)
MINIO_ENDPOINT=<cloudflare-account-id>.r2.cloudflarestorage.com
# VEYA AWS S3 için:
# MINIO_ENDPOINT=s3.amazonaws.com
MINIO_PORT=443
MINIO_ACCESS_KEY=<access-key-id>
MINIO_SECRET_KEY=<secret-access-key>
MINIO_BUCKET_NAME=hedef-performans-videos
MINIO_USE_SSL=true

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Uygulama
NEXT_PUBLIC_APP_URL=https://yourdomain.com
APP_URL=https://yourdomain.com
NODE_ENV=production

# NextAuth (güvenli bir random string oluşturun)
NEXTAUTH_SECRET=<güvenli-random-string>
NEXTAUTH_URL=https://yourdomain.com
```

**Güvenli Random String Oluşturmak İçin:**

```bash
# Terminal'de çalıştırın:
openssl rand -base64 32
```

#### 6.4 Build Ayarları

Vercel'de "Settings" -> "General" -> "Build & Development Settings":

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (otomatik)
- **Output Directory**: `.next` (otomatik)
- **Install Command**: `npm install` (otomatik)

#### 6.5 Deploy

1. "Deploy" butonuna tıklayın
2. Build tamamlanana kadar bekleyin (2-5 dakika)
3. Deploy başarılı olursa size bir URL verecek (örn: `hedef-performans.vercel.app`)

---

### AŞAMA 7: Domain Bağlama

1. Vercel dashboard'da projenize gidin
2. "Settings" -> "Domains" seçin
3. Domain'inizi girin (örn: `hedefperformans.com`)
4. Vercel size DNS kayıtlarını gösterecek
5. Domain sağlayıcınızın panelinde bu kayıtları ekleyin
6. 24-48 saat içinde aktif olur (genelde 1-2 saat)

---

### AŞAMA 8: Production Database Migration

Vercel deploy olduktan sonra, production database'e migration çalıştırmanız gerekiyor:

#### Seçenek A: Railway Console'dan (Kolay)

1. Railway dashboard'a gidin
2. PostgreSQL servisinize tıklayın
3. "Connect" sekmesinden database'e bağlanın
4. Veya "Query" sekmesinden SQL çalıştırın

#### Seçenek B: Local'den (Terminal)

Local'de `.env` dosyanıza production DATABASE_URL'i ekleyin ve:

```bash
npx prisma migrate deploy
```

**⚠️ ÖNEMLİ:** `.env` dosyasını asla GitHub'a yüklemeyin! `.gitignore` dosyasında olmalı.

---

### AŞAMA 9: İlk Admin Kullanıcısını Oluşturun

Production'da ilk admin kullanıcısını oluşturmanız gerekiyor. Bunun için bir script hazırlayalım:

#### Script Oluşturma:

`scripts/create-admin.ts` dosyası oluşturun (eğer yoksa) veya Railway/PostgreSQL console'dan direkt SQL çalıştırın:

```sql
-- Şifreyi hash'leyin (bcrypt ile "admin123" şifresi için)
-- Veya aşağıdaki script'i çalıştırın
```

---

## 🔧 PRODUCTION İÇİN GEREKLİ DEĞİŞİKLİKLER

### 1. Prisma Schema Güncellemesi

`prisma/schema.prisma` dosyasında `sqlite` yerine `postgresql` kullanılmalı.

### 2. MinIO Konfigürasyonu

`lib/minio.ts` dosyasını kontrol edin, production URL'lerini kullanacak şekilde güncelleyin.

### 3. Redis Connection

`lib/queue/connection.ts` dosyasını production Redis bilgileri ile güncelleyin.

---

## 📝 KONTROL LİSTESİ

Deploy öncesi kontrol edin:

- [ ] PostgreSQL veritabanı oluşturuldu
- [ ] Prisma schema PostgreSQL'e güncellendi
- [ ] Redis servisi hazır
- [ ] Dosya depolama (S3/R2) kuruldu
- [ ] Resend API key hazır
- [ ] GitHub'a kod yüklendi
- [ ] Vercel'e bağlandı
- [ ] Environment variables eklendi
- [ ] Domain DNS ayarları yapıldı
- [ ] Build başarılı
- [ ] Database migration çalıştırıldı
- [ ] İlk admin kullanıcısı oluşturuldu

---

## 🆘 SORUN GİDERME

### Build Hatası

- `npm run build` komutunu local'de çalıştırın, hataları görün
- TypeScript hatalarını düzeltin
- Missing dependencies varsa ekleyin

### Database Connection Hatası

- `DATABASE_URL` doğru mu kontrol edin
- Railway'de PostgreSQL çalışıyor mu kontrol edin
- SSL bağlantısı gerekebilir, `?sslmode=require` ekleyin

### Redis Hatası

- Redis credentials doğru mu kontrol edin
- Upstash'de database aktif mi kontrol edin

### Domain Çalışmıyor

- DNS propagation 24-48 saat sürebilir
- `nslookup yourdomain.com` ile kontrol edin

---

## 🎉 BAŞARILI DEPLOY SONRASI

1. Siteyi test edin: `https://yourdomain.com`
2. Kayıt olma formunu test edin
3. Admin paneline giriş yapın: `/admin/auth`
4. Email gönderimini test edin
5. Dosya yükleme işlevini test edin

---

## 📞 DESTEK

Herhangi bir adımda takılırsanız, bana sorun, yardımcı olayım!
