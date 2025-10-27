# Hedef Performans

Futbol kariyerinizi bir üst seviyeye taşıyın. Profesyonel antrenmanlar, kişisel gelişim ve takım çalışması ile hedeflerinize ulaşın.

## 🚀 Proje Çalıştırma

```bash
# Bağımlılıkları kur
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Proje http://localhost:3000 adresinde çalışacak.

## 📁 Proje Yapısı

### Sayfalar
- `/` - Ana sayfa (navigasyon)
- `/auth` - Giriş/Kayıt sayfası (Swiper slider'lı)
- `/videos` - Video listesi (infinite scroll)
- `/matches` - Maç listesi (admin paylaşımları)
- `/dashboard` - Üye dashboard'u
- `/checkout/processing` - Ödeme işlemi
- `/checkout/success` - Başarılı ödeme
- `/checkout/failure` - Başarısız ödeme

### Admin Paneli
- `/admin/users` - Kullanıcı yönetimi (TanStack Table)
- `/admin/squads` - Kadro yönetimi
- `/admin/sliders` - Slider yönetimi

## 🛠️ Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI bileşenleri
- **TanStack Table** - Veri tabloları
- **Swiper.js** - Slider'lar
- **React Hook Form** - Form yönetimi
- **Zod** - Form validasyonu

## ✨ Özellikler

- **Responsive Design** - Mobil öncelikli tasarım
- **Accessibility** - WCAG uyumlu
- **Performance** - Optimize edilmiş yükleme
- **Real-time** - Dinamik içerik
- **Admin Panel** - Kapsamlı yönetim
- **Payment Flow** - Ödeme süreci

## 📱 Mobil Optimizasyon

- 44×44px minimum dokunma hedefleri
- Safe area padding (iOS/Android)
- Tek elle erişilebilir butonlar
- Responsive grid sistemleri

## 🔧 Geliştirme

```bash
# Linting
npm run lint

# Build
npm run build

# Production
npm start
```

## 📦 Docker

```bash
# Servisleri başlat
cd infra
docker-compose up -d
```

Servisler:
- PostgreSQL (port 5432)
- Redis (port 6379)  
- MinIO (port 9000/9001)
