# PostgreSQL Migration Guide
# Hedef Performans - SQLite'den PostgreSQL'e Geçiş

## ⚠️ ÖNEMLİ: Schema Güncellemesi Yapıldı

`prisma/schema.prisma` dosyası artık PostgreSQL kullanıyor. Vercel'de deploy etmeden önce aşağıdaki adımları izleyin:

## 📋 Adım 1: Local Migration (Opsiyonel - İsterseniz)

Eğer local'de PostgreSQL kullanmak isterseniz:

```bash
# 1. PostgreSQL connection string'i .env dosyasına ekleyin
DATABASE_URL="postgresql://username:password@localhost:5432/hedef_performans"

# 2. Prisma Client'ı yeniden generate edin
npx prisma generate

# 3. Migration'ı çalıştırın (YENİ DATABASE İÇİN)
npx prisma migrate dev --name init

# VEYA mevcut database varsa:
npx prisma db push
```

## 🚀 Adım 2: Vercel'e Deploy

1. **Git'e commit edin:**
```bash
git add prisma/schema.prisma
git commit -m "Update Prisma schema to PostgreSQL for production"
git push
```

2. **Vercel otomatik deploy edecek:**
   - Build sırasında `prisma generate` çalışacak (package.json'da tanımlı)
   - Prisma Client PostgreSQL için generate edilecek

## 📊 Adım 3: Production Database Migration

**ÖNEMLİ:** Vercel'de ilk deploy sonrası migration çalıştırmanız gerekebilir.

### Seçenek 1: Prisma Studio ile (Önerilen)

```bash
# Local'de production DATABASE_URL ile
DATABASE_URL="postgresql://..." npx prisma studio

# Veya direkt migration:
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### Seçenek 2: Vercel CLI ile

```bash
# Vercel CLI kurulu olmalı
vercel env pull .env.local

# Migration çalıştır
npx prisma migrate deploy
```

### Seçenek 3: Railway/Neon Console'dan

1. Railway/Neon dashboard'a gidin
2. PostgreSQL servisinize tıklayın
3. "Query" veya "SQL Editor" sekmesine gidin
4. Migration SQL'lerini manuel çalıştırın (Prisma migration dosyalarından)

## ✅ Kontrol Listesi

- [ ] `prisma/schema.prisma` PostgreSQL'e çevrildi ✓
- [ ] Vercel'de `DATABASE_URL` environment variable set edildi
- [ ] Git'e commit ve push edildi
- [ ] Vercel deploy başarılı
- [ ] Production database'de migration çalıştırıldı
- [ ] `/api/health` endpoint'i database connection test ediyor

## 🔍 Sorun Giderme

### Hata: "the URL must start with the protocol `file:`"

**Sebep:** Prisma hala eski schema'yı kullanıyor.

**Çözüm:**
1. `.next` klasörünü silin: `rm -rf .next`
2. `node_modules/.prisma` klasörünü silin: `rm -rf node_modules/.prisma`
3. `npx prisma generate` çalıştırın
4. Vercel'de redeploy edin

### Hata: "Table does not exist"

**Sebep:** Migration çalıştırılmamış.

**Çözüm:** Yukarıdaki "Production Database Migration" adımlarını izleyin.

### Hata: "Can't reach database server"

**Sebep:** DATABASE_URL yanlış veya database erişilebilir değil.

**Çözüm:**
1. Vercel dashboard → Settings → Environment Variables
2. DATABASE_URL'i kontrol edin
3. Database servisinin çalıştığından emin olun

## 📝 Notlar

- Local development için SQLite kullanmaya devam edebilirsiniz (schema.prisma'yı tekrar değiştirerek)
- Production her zaman PostgreSQL kullanmalı
- Migration'lar sadece bir kez çalıştırılmalı (ilk deploy'da)

