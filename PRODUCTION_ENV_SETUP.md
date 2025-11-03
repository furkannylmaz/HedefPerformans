# Production Environment Variables Setup
# Hedef Performans - Vercel Production Deployment

Bu dosya, Vercel production ortamında gerekli environment variable'ların nasıl ayarlanacağını açıklar.

## 📋 Gerekli Environment Variables

Vercel dashboard'unda **Settings → Environment Variables** bölümüne şu değişkenleri ekleyin:

### 🗄️ Veritabanı (PostgreSQL - Neon)

```
DATABASE_URL=postgresql://username:password@hostname:port/database
```

**Not:** Neon veya başka bir PostgreSQL servisi kullanıyorsanız, connection string'i servis sağlayıcınızdan alın.

### ☁️ Cloudinary (Görsel Yükleme)

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Cloudinary Setup:**
1. [Cloudinary.com](https://cloudinary.com) → Hesap oluşturun
2. Dashboard → "Settings" → "Security" bölümünden:
   - Cloud Name
   - API Key
   - API Secret
3. Bu değerleri Vercel'e ekleyin

### 🔐 NextAuth

```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://yourdomain.com
```

**NEXTAUTH_SECRET Oluşturma:**
```bash
openssl rand -base64 32
```

### 🌐 Uygulama URL'leri

```
APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### 💳 PayTR Ödeme Sistemi (Opsiyonel)

```
PAYTR_MERCHANT_ID=your-merchant-id
PAYTR_MERCHANT_KEY=your-merchant-key
PAYTR_MERCHANT_SALT=your-merchant-salt
```

### 📧 Email Servisi (Resend - Opsiyonel)

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

### 🎥 MinIO/S3 (Video Uploads - Opsiyonel)

```
MINIO_ENDPOINT=your-endpoint
MINIO_PORT=443
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET_NAME=hedef-performans-videos
MINIO_USE_SSL=true
MINIO_PUBLIC_URL=https://your-public-url.com
```

### 🔴 Redis (BullMQ - Opsiyonel)

```
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

## ✅ Environment Variables Kontrolü

Deploy sonrası health check endpoint'ini kullanarak kontrol edin:

```
GET https://yourdomain.com/api/health
```

Bu endpoint şunları kontrol eder:
- DATABASE_URL varlığı
- Cloudinary config varlığı
- Database connection test
- Environment variable durumu

## 🔍 Hata Ayıklama

Production'da sorun yaşıyorsanız:

1. **Vercel Logs:** Vercel dashboard → Project → "Logs" sekmesinden runtime logları kontrol edin
2. **Health Check:** `/api/health` endpoint'ini kontrol edin
3. **Environment Variables:** Vercel dashboard → Settings → Environment Variables'dan tüm değişkenlerin doğru eklendiğini kontrol edin

## 📝 Önemli Notlar

- Environment variable'lar production, preview ve development için ayrı ayrı ayarlanabilir
- Production için tüm environment variable'ların doğru ayarlandığından emin olun
- Cloudinary ve Database credentials'larını asla commit etmeyin
- Deploy sonrası ilk kullanımda admin kullanıcı oluşturmayı unutmayın

