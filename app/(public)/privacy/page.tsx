import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Calendar, Eye, Lock, Database, Users } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gizlilik Politikası</h1>
              <p className="text-muted-foreground">
                Kişisel verilerinizin korunması ve işlenmesi hakkında bilgiler
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Versiyon Bilgisi */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Politika Versiyonu
                </CardTitle>
                <Badge variant="outline">v1.0</Badge>
              </div>
              <CardDescription>
                Bu gizlilik politikası 1 Ocak 2024 tarihinden itibaren geçerlidir.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>KVKK Uyumlu:</strong> Bu politika Kişisel Verilerin Korunması Kanunu 
                  (KVKK) ve Avrupa Birliği Genel Veri Koruma Yönetmeliği (GDPR) ile uyumludur.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Veri Toplama */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                1. Toplanan Veriler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1.1 Kişisel Bilgiler</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Ad ve soyad</li>
                  <li>E-posta adresi</li>
                  <li>Telefon numarası</li>
                  <li>Doğum tarihi</li>
                  <li>Konum bilgileri (ülke, il, ilçe)</li>
                  <li>Futbol mevki bilgileri</li>
                  <li>Takım ve lig bilgileri (opsiyonel)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">1.2 Platform Kullanım Verileri</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Video yükleme ve izleme geçmişi</li>
                  <li>Kadro atama bilgileri</li>
                  <li>WhatsApp grup katılım durumu</li>
                  <li>Ödeme işlem kayıtları</li>
                  <li>Platform kullanım süreleri</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Veri Kullanımı */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                2. Veri Kullanım Amaçları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">2.1 Temel Hizmetler</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Hesap oluşturma ve yönetimi</li>
                  <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
                  <li>Kadro sistemi ile üye eşleştirmesi</li>
                  <li>Video paylaşım ve izleme hizmetleri</li>
                  <li>WhatsApp grup yönetimi</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">2.2 Platform Geliştirme</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Kullanıcı deneyiminin iyileştirilmesi</li>
                  <li>Yeni özelliklerin geliştirilmesi</li>
                  <li>Platform performansının analizi</li>
                  <li>Güvenlik önlemlerinin alınması</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Veri Paylaşımı */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                3. Veri Paylaşımı
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Temel İlke</h4>
                <p className="text-sm text-blue-800">
                  Kişisel verileriniz üçüncü taraflarla paylaşılmaz. Sadece platform 
                  hizmetleri için gerekli durumlarda sınırlı erişim sağlanır.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3.1 Platform İçi Paylaşım</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Video içerikleriniz herkese açık olarak görüntülenir</li>
                  <li>Ad ve soyadınız video kartlarında görünür</li>
                  <li>Kadro üyeleri birbirlerinin temel bilgilerini görebilir</li>
                  <li>WhatsApp gruplarına katılımda telefon numaranız paylaşılır</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3.2 Üçüncü Taraf Entegrasyonlar</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>PayTR:</strong> Ödeme işlemleri için gerekli bilgiler</li>
                  <li><strong>MinIO/S3:</strong> Video dosyalarının güvenli depolanması</li>
                  <li><strong>WhatsApp:</strong> Grup davet linklerinin oluşturulması</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Veri Güvenliği */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                4. Veri Güvenliği
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">4.1 Teknik Önlemler</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>SSL/TLS şifreleme ile veri iletimi</li>
                  <li>Şifrelerin bcrypt ile hash'lenmesi</li>
                  <li>Veritabanı erişim kontrolleri</li>
                  <li>Düzenli güvenlik güncellemeleri</li>
                  <li>Otomatik yedekleme sistemleri</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">4.2 Organizasyonel Önlemler</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Personel eğitimleri ve gizlilik sözleşmeleri</li>
                  <li>Sınırlı erişim yetkileri</li>
                  <li>Düzenli güvenlik denetimleri</li>
                  <li>Veri ihlali müdahale planları</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Kullanıcı Hakları */}
          <Card>
            <CardHeader>
              <CardTitle>5. Kullanıcı Hakları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">5.1 KVKK Kapsamındaki Haklarınız</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Bilgi Alma:</strong> Hangi verilerinizin işlendiğini öğrenme</li>
                  <li><strong>Erişim:</strong> Kişisel verilerinize erişim talep etme</li>
                  <li><strong>Düzeltme:</strong> Yanlış bilgilerin düzeltilmesini isteme</li>
                  <li><strong>Silme:</strong> Verilerinizin silinmesini talep etme</li>
                  <li><strong>Taşınabilirlik:</strong> Verilerinizi başka platforma aktarma</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Önemli Not</h4>
                <p className="text-sm text-yellow-800">
                  Veri silme talebinizde hesabınız tamamen kapatılır ve tüm verileriniz 
                  silinir. Bu işlem geri alınamaz.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Çerezler */}
          <Card>
            <CardHeader>
              <CardTitle>6. Çerezler (Cookies)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Platform, kullanıcı deneyimini iyileştirmek için çerezler kullanır.
              </p>
              
              <div>
                <h4 className="font-semibold mb-2">6.1 Çerez Türleri</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Zorunlu Çerezler:</strong> Platform işlevselliği için gerekli</li>
                  <li><strong>Analitik Çerezler:</strong> Kullanım istatistikleri için</li>
                  <li><strong>Tercih Çerezleri:</strong> Kullanıcı ayarları için</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">6.2 Çerez Yönetimi</h4>
                <p className="text-sm">
                  Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz. Ancak bazı çerezler 
                  platform işlevselliği için zorunludur.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Veri Saklama */}
          <Card>
            <CardHeader>
              <CardTitle>7. Veri Saklama Süreleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">7.1 Saklama Süreleri</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Hesap Bilgileri:</strong> Hesap aktif olduğu sürece</li>
                  <li><strong>Video İçerikleri:</strong> Hesap silinene kadar</li>
                  <li><strong>Ödeme Kayıtları:</strong> Yasal zorunluluk süresi (5 yıl)</li>
                  <li><strong>İletişim Logları:</strong> 1 yıl</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">7.2 Veri Silme</h4>
                <p className="text-sm">
                  Hesap silme talebinizde tüm kişisel verileriniz 30 gün içinde 
                  kalıcı olarak silinir. Yasal zorunluluklar saklıdır.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* İletişim */}
          <Card>
            <CardHeader>
              <CardTitle>8. İletişim ve Şikayetler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Veri Koruma Sorumlusu</h4>
                  <p className="text-sm">
                    <strong>E-posta:</strong>{" "}
                    <a href="mailto:kvkk@hedefperformans.com" className="text-primary hover:underline">
                      kvkk@hedefperformans.com
                    </a>
                  </p>
                  <p className="text-sm">
                    <strong>Telefon:</strong> +90 (212) 123 45 67
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Şikayet Hakkı</h4>
                  <p className="text-sm">
                    Kişisel verilerinizin işlenmesi konusunda şikayetlerinizi 
                    Kişisel Verileri Koruma Kurulu'na (KVKK) iletebilirsiniz.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alt Bilgi */}
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Verileriniz güvenli şekilde korunmaktadır
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Son güncelleme: 1 Ocak 2024 | Versiyon: 1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
