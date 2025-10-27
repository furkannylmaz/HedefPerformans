"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react"

export default function CheckoutProcessingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    { id: 1, title: "Ödeme Bilgileri", description: "Kart bilgileriniz kontrol ediliyor" },
    { id: 2, title: "Güvenlik Kontrolü", description: "3D Secure doğrulaması yapılıyor" },
    { id: 3, title: "İşlem Onayı", description: "Ödeme işlemi tamamlanıyor" },
    { id: 4, title: "Hesap Aktivasyonu", description: "Hesabınız aktifleştiriliyor" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          
          // İşlem tamamlandığında success sayfasına yönlendir
          setTimeout(() => {
            router.push("/checkout/success")
          }, 500)
          
          return 100
        }
        return prev + 2
      })
    }, 100)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 4) {
          clearInterval(stepInterval)
          return 4
        }
        return prev + 1
      })
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Ödeme İşlemi Devam Ediyor</CardTitle>
            <CardDescription>
              Lütfen bu sayfayı kapatmayın. Ödeme işleminiz tamamlandığında otomatik olarak yönlendirileceksiniz.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* İlerleme Çubuğu */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>İlerleme</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Adımlar */}
            <div className="space-y-4">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    step.id <= currentStep 
                      ? 'bg-primary/5 border border-primary/20' 
                      : 'bg-muted/50'
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step.id < currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : step.id === currentStep
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.id < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : step.id === currentStep ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-xs font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${
                      step.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Güvenlik Bilgisi */}
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800">
                Ödeme işleminiz SSL ile güvenli şekilde korunmaktadır.
              </p>
            </div>

            {/* Bekleme Mesajı */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Bu işlem genellikle 30-60 saniye sürer.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alt Bilgi */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Sorun yaşıyorsanız{" "}
            <a href="/contact" className="text-primary hover:underline">
              destek ekibimizle iletişime geçin
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
