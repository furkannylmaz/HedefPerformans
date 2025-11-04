import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Shield } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Kullanıcı Sözleşmesi</h1>
              <p className="text-muted-foreground">
                Hedef Performans platformu kullanım şartları
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
                  Sözleşme Versiyonu
                </CardTitle>
                <Badge variant="outline">v1.0</Badge>
              </div>
              <CardDescription>
                Bu sözleşme 1 Ocak 2024 tarihinden itibaren geçerlidir.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Önemli:</strong> Kayıt anındaki sözleşme versiyonu geçerlidir. 
                  Sözleşme değişiklikleri için e-posta bildirimi gönderilir.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sözleşme İçeriği */}
          <Card>
            <CardHeader>
              <CardTitle>1. Genel Hükümler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bu kullanıcı sözleşmesi ("Sözleşme"), Hedef Performans platformunu 
                ("Platform") kullanmak isteyen kullanıcılar ("Üye") ile Hedef Performans 
                ("Şirket") arasında yapılmıştır.
              </p>
              
              <p>
                Platform, futbol sporcularının eğitim videolarını paylaşabileceği, 
                profesyonel maç analizlerini izleyebileceği ve kadro sistemi ile 
                iletişim kurabileceği bir online platformdur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Üyelik ve Ödeme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">2.1 Üyelik Koşulları</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Geçerli e-posta adresi sahibi olmak</li>
                  <li>Doğru ve güncel bilgiler vermek</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">2.2 Ödeme Koşulları</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Ödeme onaylanmadan hesap aktifleştirilmez</li>
                  <li>Ödeme PayTR güvenli ödeme sistemi ile yapılır</li>
                  <li>İade politikası 14 gün içinde geçerlidir</li>
                  <li>Ödeme başarısız olursa hesap askıya alınır</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Platform Kullanımı</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">3.1 Üye Hakları</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Eğitim videolarını yükleyebilme</li>
                  <li>Diğer üyelerin videolarını izleyebilme</li>
                  <li>Admin maç analizlerini görüntüleyebilme</li>
                  <li>Kadro sistemi ile iletişim kurabilme</li>
                  <li>WhatsApp gruplarına katılabilme</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3.2 Yasak Faaliyetler</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Telif hakkı ihlali yapan içerik paylaşımı</li>
                  <li>Hakaret, küfür veya zararlı içerik</li>
                  <li>Spam veya reklam içerikleri</li>
                  <li>Başka üyelerin hesaplarını kullanma</li>
                  <li>Platform güvenliğini tehdit eden davranışlar</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Kadro Sistemi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Platform, üyeleri ana mevki öncelikli olarak 7+1 kadro sistemine yerleştirir. 
                Kadro atamaları otomatik olarak yapılır ve admin tarafından manuel olarak 
                düzenlenebilir.
              </p>
              
              <div>
                <h4 className="font-semibold mb-2">4.1 Kadro Kuralları</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Her kadro maksimum 7 üye + 1 yedek üye alabilir</li>
                  <li>Ana mevki öncelikli atama yapılır</li>
                  <li>Aynı kullanıcı aynı kadroya tekrar atanamaz</li>
                  <li>Admin kadro atamalarını değiştirebilir</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Veri Güvenliği ve Gizlilik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Kişisel verileriniz KVKK (Kişisel Verilerin Korunması Kanunu) kapsamında 
                korunur ve sadece platform hizmetleri için kullanılır.
              </p>
              
              <div>
                <h4 className="font-semibold mb-2">5.1 Veri Kullanımı</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Kişisel bilgileriniz sadece platform içinde görünür</li>
                  <li>Video içerikleriniz herkese açık olarak paylaşılır</li>
                  <li>WhatsApp gruplarına katılım opsiyoneldir</li>
                  <li>Verileriniz üçüncü taraflarla paylaşılmaz</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Hesap Askıya Alma ve İptal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">6.1 Askıya Alma Nedenleri</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Sözleşme ihlali</li>
                  <li>Ödeme başarısızlığı</li>
                  <li>Sahte bilgi verme</li>
                  <li>Platform kurallarını ihlal etme</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">6.2 İptal Koşulları</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>14 gün içinde iade talebinde bulunabilirsiniz</li>
                  <li>İade işlemi 5-7 iş günü içinde tamamlanır</li>
                  <li>Hesap iptalinde verileriniz silinir</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Sorumluluk Sınırları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Platform, üyelerin paylaştığı içeriklerden sorumlu değildir. Üyeler 
                kendi içeriklerinden sorumludur ve telif hakkı ihlali durumunda 
                platform zarar görmeyecektir.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Önemli Uyarı</h4>
                <p className="text-sm text-yellow-800">
                  Platform sadece içerik paylaşımı için bir araçtır. Eğitim videolarının 
                  doğruluğu ve etkinliği konusunda platform sorumluluk kabul etmez.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. İletişim</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Sözleşme ile ilgili sorularınız için{" "}
                <a href="mailto:info@hedefperformans.com" className="text-primary hover:underline">
                  info@hedefperformans.com
                </a>{" "}
                adresinden bizimle iletişime geçebilirsiniz.
              </p>
            </CardContent>
          </Card>

          {/* Alt Bilgi */}
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Bu sözleşme Türk Hukuku'na tabidir
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
