"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, RefreshCw, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Ödeme Başarısız</CardTitle>
            <CardDescription className="text-lg">
              Ödeme işleminiz tamamlanamadı. Lütfen tekrar deneyin.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Hata Mesajı */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Ödeme İşlemi Başarısız</h3>
              <p className="text-muted-foreground">
                Ödeme işleminizde bir sorun oluştu. Bu durumun birkaç nedeni olabilir:
              </p>
            </div>

            {/* Olası Nedenler */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Kart Bilgileri</h4>
                  <p className="text-xs text-muted-foreground">
                    Kart numarası, son kullanma tarihi veya CVV kodu hatalı olabilir.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Yetersiz Bakiye</h4>
                  <p className="text-xs text-muted-foreground">
                    Kartınızda yeterli bakiye bulunmuyor olabilir.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <XCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Banka Onayı</h4>
                  <p className="text-xs text-muted-foreground">
                    Bankanız işlemi onaylamamış olabilir.
                  </p>
                </div>
              </div>
            </div>

            {/* Öneriler */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Ne Yapabilirsiniz?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Kart bilgilerinizi kontrol edin</li>
                <li>• Farklı bir kart deneyin</li>
                <li>• Bankanızla iletişime geçin</li>
                <li>• İnternet bağlantınızı kontrol edin</li>
              </ul>
            </div>

            {/* Aksiyon Butonları */}
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tekrar Dene
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href="/auth">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kayıt Sayfasına Dön
                </Link>
              </Button>
            </div>

            {/* Güvenlik Bilgisi */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Ödeme bilgileriniz güvenli şekilde işlenir ve saklanmaz.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alt Bilgi */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Sorun devam ederse{" "}
            <a href="/contact" className="text-primary hover:underline">
              destek ekibimizle iletişime geçin
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Ödeme işlemi sırasında kartınızdan herhangi bir ücret çekilmemiştir.
          </p>
        </div>
      </div>
    </div>
  )
}
