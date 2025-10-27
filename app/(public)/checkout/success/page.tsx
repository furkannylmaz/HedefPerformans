"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Trophy, Users, Play, Loader2 } from "lucide-react"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Cookie'den userId'yi al
        const authToken = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1]
        
        if (!authToken) {
          console.error('Auth token bulunamadı')
          setIsProcessing(false)
          return
        }

        // Token'dan userId'yi çıkar
        const decoded = JSON.parse(decodeURIComponent(authToken))
        const userId = decoded.userId

        console.log('🎉 Payment success - Processing payment approval for userId:', userId)

        // Ödeme onayı API'yi çağır
        const response = await fetch('/api/admin/users/approve-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId })
        })

        const data = await response.json()

        if (data.success) {
          console.log('✅ Payment approved and squad assignment started')
        } else {
          console.error('❌ Payment approval failed:', data.message)
        }
      } catch (error) {
        console.error('❌ Payment processing error:', error)
      } finally {
        setIsProcessing(false)
      }
    }

    processPayment()
  }, [])

  useEffect(() => {
    // 5 saniye sonra otomatik yönlendirme
    if (!isProcessing) {
      const timer = setTimeout(() => {
        router.push("/member/dashboard")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [router, isProcessing])

  const handleGoToDashboard = () => {
    router.push("/member/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Ödeme Başarılı!</CardTitle>
            <CardDescription className="text-lg">
              Hoş geldiniz! Hesabınız başarıyla aktifleştirildi.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Başarı Mesajı */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Hedef Performans'a Hoş Geldiniz!</h3>
              <p className="text-muted-foreground">
                Artık platformumuzun tüm özelliklerine erişebilir, video paylaşabilir ve 
                kadronuzla iletişim kurabilirsiniz.
              </p>
            </div>

            {/* Özellikler */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Play className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium text-sm">Video Paylaş</h4>
                <p className="text-xs text-muted-foreground">
                  Eğitim videolarınızı paylaşın
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium text-sm">Kadro Sistemi</h4>
                <p className="text-xs text-muted-foreground">
                  Mevkinize göre kadroya atandınız
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium text-sm">Maç Analizleri</h4>
                <p className="text-xs text-muted-foreground">
                  Profesyonel analizleri izleyin
                </p>
              </div>
            </div>

            {/* Kadro Bilgisi */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">Kadro Atamanız</h4>
              <p className="text-sm text-muted-foreground">
                Ana mevkinize göre otomatik olarak bir kadroya atandınız. 
                Kadro bilgilerinizi dashboard'da görebilirsiniz.
              </p>
            </div>

            {/* Processing */}
            {isProcessing ? (
              <div className="text-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Ödeme onaylanıyor ve kadro ataması yapılıyor...</p>
              </div>
            ) : (
              <>
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
              </>
            )}
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
            Hesabınızla ilgili tüm bilgiler e-posta adresinize gönderilmiştir.
          </p>
        </div>
      </div>
    </div>
  )
}
