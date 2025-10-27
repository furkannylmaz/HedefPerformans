"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Clock, Loader2, AlertCircle, Play, Users, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TransferSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // 5 saniye sonra otomatik yönlendirme
    const timer = setTimeout(() => {
      router.push("/member/dashboard")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  const handleGoToDashboard = () => {
    router.push("/member/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo.jpeg" 
              alt="Hedef Performans" 
              width={150} 
              height={50}
              className="mx-auto"
              priority
            />
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-600">Hesabınız Oluşturuldu!</CardTitle>
            <CardDescription className="text-lg">
              Hoş geldiniz! Ödeme onayı bekleniyor.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Bekleme Mesajı */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Hedef Performans'a Hoş Geldiniz!</h3>
              <p className="text-muted-foreground">
                Hesabınız başarıyla oluşturuldu. Havale/EFT ödemeniz onaylandıktan sonra 
                hesabınız tamamen aktif olacak.
              </p>
            </div>

            {/* Bekleme Durumu */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Ödeme Onayı Bekleniyor
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Havale/EFT ödemeniz admin tarafından manuel olarak onaylandıktan sonra 
                    (1-2 iş günü) hesabınız tamamen aktif olacak.
                  </p>
                </div>
              </div>
            </div>

            {/* Beklemede Özellikler */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">Şu Anda Kullanılabilir:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Dashboard'u görüntüleyebilirsiniz</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Platform hakkında bilgi alabilirsiniz</span>
                </div>
              </div>
            </div>

            {/* Bekliyor - Geçici Durum */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">Ödeme Onayından Sonra Aktif Olacak:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg opacity-60">
                  <Play className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Video yükleme</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg opacity-60">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Kadro ataması</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg opacity-60">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">WhatsApp grubuna katılım</span>
                </div>
              </div>
            </div>

            {/* Ana Buton */}
            <Button 
              onClick={handleGoToDashboard}
              className="w-full"
              size="lg"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Dashboard'a Git
            </Button>

            {/* Otomatik Yönlendirme */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                5 saniye sonra otomatik olarak dashboard'a yönlendirileceksiniz.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alt Bilgi */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Sorularınız için{" "}
            <a href="/contact" className="text-primary hover:underline">
              destek ekibimizle iletişime geçin
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Ödemeniz onaylandığında e-posta ile bilgilendirileceksiniz.
          </p>
        </div>
      </div>
    </div>
  )
}

