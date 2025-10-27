import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Trophy, Users, Shield, ArrowRight, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-card">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">
              Hedef Performans
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Futbol kariyerinizi bir üst seviyeye taşıyın. Profesyonel eğitim videoları, 
              maç analizleri ve kadro sistemi ile gelişiminizi hızlandırın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Hemen Başla — 499₺
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/videos">
                  <Play className="h-4 w-4 mr-2" />
                  Videoları İncele
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Neden Hedef Performans?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Futbol gelişiminiz için ihtiyacınız olan tüm araçları tek platformda bulun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Play className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Video Paylaşımı</CardTitle>
                <CardDescription>
                  Eğitim videolarınızı paylaşın ve diğer üyelerden geri bildirim alın.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Maç Analizleri</CardTitle>
                <CardDescription>
                  Profesyonel ekibimizin hazırladığı detaylı maç analizlerini izleyin.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Kadro Sistemi</CardTitle>
                <CardDescription>
                  Mevkinize göre otomatik atandığınız kadro ile iletişim kurun.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Güvenli Platform</CardTitle>
                <CardDescription>
                  Verileriniz KVKK uyumlu şekilde korunur ve güvenli ödeme sistemi.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">0</div>
              <div className="text-muted-foreground">Aktif Üye</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">0</div>
              <div className="text-muted-foreground">Eğitim Videosu</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">0</div>
              <div className="text-muted-foreground">Maç Analizi</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl">Hemen Üye Olun</CardTitle>
              <CardDescription className="text-lg">
                Futbol kariyerinizde fark yaratmak için bugün başlayın. 
                Sadece 499₺ ile tüm özelliklere erişim sağlayın.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" asChild>
                <Link href="/auth">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Üye Ol — 499₺
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Hedef Performans</h3>
              <p className="text-sm text-muted-foreground">
                Futbol kariyerinizi bir üst seviyeye taşıyın.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/videos" className="text-muted-foreground hover:text-foreground">Videolar</Link></li>
                <li><Link href="/matches" className="text-muted-foreground hover:text-foreground">Maç Analizleri</Link></li>
                <li><Link href="/auth" className="text-muted-foreground hover:text-foreground">Üye Ol</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Kullanıcı Sözleşmesi</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Gizlilik Politikası</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>info@hedefperformans.com</li>
                <li>+90 (212) 123 45 67</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Hedef Performans. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
