"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Lock, ArrowRight, Loader2 } from "lucide-react"

export default function ThreeDSecurePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState("")
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleResend = () => {
    setTimer(60)
    setCanResend(false)
    alert("Doğrulama kodu yeniden gönderildi")
  }

  const handleVerify = async () => {
    if (code.length !== 6) {
      alert("Lütfen 6 haneli doğrulama kodunu girin")
      return
    }

    setLoading(true)

    // Simüle edilmiş doğrulama
    setTimeout(() => {
      setLoading(false)
      // Processing sayfasına yönlendir
      router.push("/checkout/processing")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">3D Secure Doğrulama</CardTitle>
            <CardDescription className="text-lg">
              Kart bilgilerinizin güvenliği için doğrulama gereklidir
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Banka Simülasyonu */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Banka Güvenlik Kontrolü</h3>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Cep telefonunuza gönderilen 6 haneli doğrulama kodunu girin
              </p>
            </div>

            {/* SMS Kodu */}
            <div className="space-y-2">
              <Label>Doğrulama Kodu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    if (value.length <= 6) {
                      setCode(value)
                    }
                  }}
                  className="pl-10 text-2xl text-center font-mono tracking-wider"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                SMS ile gönderilen 6 haneli kodu girin
              </p>
            </div>

            {/* Timer */}
            <div className="text-center space-y-2">
              {timer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Kodu tekrar göndermek için <span className="font-semibold">{timer}s</span> bekleyin
                </p>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResend}
                  disabled={!canResend}
                  className="text-primary"
                >
                  Kodu Tekrar Gönder
                </Button>
              )}
            </div>

            {/* Demo Kodu */}
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                🧪 Demo Kodu:
              </p>
              <p className="text-2xl font-mono text-yellow-800 dark:text-yellow-200">123456</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Test için bu kodu kullanabilirsiniz
              </p>
            </div>

            {/* Buton */}
            <Button
              onClick={handleVerify}
              className="w-full"
              size="lg"
              disabled={loading || code.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Doğrulanıyor...
                </>
              ) : (
                <>
                  Doğrula
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>

            {/* Güvenlik Bilgisi */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              <Lock className="h-4 w-4" />
              <span>İşleminiz SSL ile korunmaktadır</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

