# Değişiklik Günlüğü

## 2025-01-27

### ✅ Tamamlanan Özellikler

1. **Excel Export Özelliği**
   - Admin Users sayfasına gerçek Excel (.xlsx) export eklendi
   - xlsx kütüphanesi entegre edildi
   - Türkçe karakter desteği (BOM)
   - Otomatik kolon genişlikleri
   - Dinamik dosya adı (tarih + filtre bilgisi)

2. **Video Upload İyileştirmeleri**
   - MinIO sunucu bağlantısı iyileştirildi
   - Detaylı hata mesajları eklendi
   - ECONNREFUSED hataları için özel mesajlar
   - Dashboard'da kullanıcı dostu hata gösterimi

3. **Videos Sayfası Güncellemeleri**
   - Tüm detaylı mevki filtreleri eklendi
   - Kaleci, Sağ/Sol Defans, Sağbek/Solbek, Stoper, Orta Saha, Forvet, Kanat
   - Mevki rozetleri güncellendi

4. **Kullanıcı Silme Özelliği**
   - `/api/admin/users/delete` endpoint oluşturuldu
   - Admin Users sayfasına silme butonu eklendi
   - Kırmızı çerçeveli ve onay mesajı ile

5. **Üye Kadro Görüntüleme Sayfası**
   - `/member/squads` sayfası oluşturuldu
   - Yaş grubu filtreleme
   - Kart görünümü ile kadro listesi
   - Üye bilgileri ve pozisyonlar
   - Dashboard'da Hızlı Erişim altına buton

6. **Boş Kadro Silme Özelliği**
   - `/api/admin/squads/delete` endpoint oluşturuldu
   - Transaction güvenliği ile silme
   - Cascade delete desteği
   - Sadece boş kadrolarda silme butonu görünüyor

### 🔧 Teknik Detaylar

- MinIO Docker container'ı başlatıldı
- xlsx kütüphanesi npm ile yüklendi
- Middleware yapılandırması korundu
- Veritabanı şeması değiştirilmedi

### 📝 Notlar

- Test kullanıcıları silindi
- Boş kadrolar silme özelliği eklendi
- Hiç açılmamış gibi temizlik yapılabilir
- Yeni kullanıcılar otomatik yeni kadroya atanacak

