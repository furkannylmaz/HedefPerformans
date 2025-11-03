"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Banknote, ArrowRight, Shield, Lock } from "lucide-react"
import Image from "next/image"

export default function PaymentMethodPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  const handleContinue = () => {
    if (selectedMethod === "card") {
      router.push("/checkout/payment-method/card")
    } else if (selectedMethod === "transfer") {
      router.push("/checkout/payment-method/transfer")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Ödeme Yöntemi Seçin</CardTitle>
            <CardDescription className="text-lg">
              Üyelik ücreti: <span className="text-2xl font-bold text-primary">499₺</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Kredi Kartı ile Ödeme */}
            <Card
              className={`hidden cursor-pointer transition-all ${
                selectedMethod === "card"
                  ? "ring-2 ring-primary border-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedMethod("card")}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    selectedMethod === "card" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Kredi Kartı ile Ödeme</h3>
                      {selectedMethod === "card" && (
                        <div className="flex items-center gap-2 text-primary">
                          <Lock className="h-4 w-4" />
                          <span className="text-sm font-medium">Güvenli Ödeme</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      PayTR güvenli ödeme sistemi ile ödemenizi tamamlayın
                    </p>
                    {selectedMethod === "card" && (
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>3D Secure</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          <span>SSL Şifreleme</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🔒</span>
                          <span>KVKK Uyumlu</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Havale/EFT ile Ödeme */}
            <Card
              className={`cursor-pointer transition-all ${
                selectedMethod === "transfer"
                  ? "ring-2 ring-primary border-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedMethod("transfer")}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    selectedMethod === "transfer" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <Banknote className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Havale/EFT ile Ödeme</h3>
                      {selectedMethod === "transfer" && (
                        <span className="text-sm font-medium text-orange-600">Manuel Onay</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Banka hesap bilgilerimiz ile ödemenizi yapın
                    </p>
                    {selectedMethod === "transfer" && (
                      <div className="mt-3 text-xs text-muted-foreground">
                        <p>Ödeme onayı 1-2 iş günü sürebilir</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onay ve Devam Butonu */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Ödeme bilgileriniz güvenli şekilde işlenir</span>
              </div>

              <Button
                onClick={handleContinue}
                disabled={!selectedMethod}
                className="w-full"
                size="lg"
              >
                Ödeme'ye Geç
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <div className="text-center">
                <Button variant="link" onClick={() => router.push("/auth")}>
                  Geri Dön
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

