"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Banknote, ArrowLeft, ArrowRight, Copy, Check, FileText, Info } from "lucide-react"
import Image from "next/image"

interface BankInfo {
  bankName: string
  accountName: string
  iban: string
  accountNumber: string
  branch: string
  amount: string
}

export default function TransferPaymentPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bankName: "Ziraat Bankası",
    accountName: "Hedef Performans Spor Kulübü",
    iban: "TR99 0001 0009 9900 0000 0000 00",
    accountNumber: "9900000000",
    branch: "Kadıköy Şubesi (990)",
    amount: "499.00",
  })

  // Banka bilgilerini API'den yükle
  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        const response = await fetch("/api/user/site-info")
        const data = await response.json()
        
        if (data.success && data.data?.bankInfo) {
          setBankInfo(data.data.bankInfo)
        }
      } catch (error) {
        console.error("Bank info fetch error:", error)
        // Hata durumunda default değerler kullanılacak
      }
    }
    
    fetchBankInfo()
  }, [])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreateAccount = async () => {
    setLoading(true)
    
    // Simüle edilmiş hesap oluşturma
    setTimeout(() => {
      setLoading(false)
      router.push("/checkout/payment-method/transfer-success")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sol Taraf - Banka Bilgileri */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Banknote className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Banka Hesap Bilgileri</CardTitle>
                  <CardDescription>Havale/EFT ile Ödeme</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tutar */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Ödenecek Tutar</p>
                <p className="text-3xl font-bold text-primary">{bankInfo.amount} ₺</p>
              </div>

              {/* Banka Bilgileri */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Banka</p>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-semibold">{bankInfo.bankName}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">IBAN</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">
                      {bankInfo.iban}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(bankInfo.iban)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Hesap Sahibi</p>
                  <div className="p-3 bg-muted rounded-lg">
                    {bankInfo.accountName}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Hesap No</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">
                        {bankInfo.accountNumber}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Şube</p>
                    <div className="p-3 bg-muted rounded-lg">
                      {bankInfo.branch}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sağ Taraf - Talimatlar */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle>Dekont Talimatı</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Önemli Uyarı */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Önemli Bilgi
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      Dekont açıklamasına <strong>İsim Soyisim - Telefon</strong> bilgilerinizi yazmayı unutmayın!
                    </p>
                  </div>
                </div>
              </div>

              {/* Adımlar */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Havale/EFT Yap</p>
                    <p className="text-sm text-muted-foreground">
                      Yukarıdaki banka hesap bilgilerine {bankInfo.amount} ₺ tutarında ödeme yapın
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Dekont Kaydedin</p>
                    <p className="text-sm text-muted-foreground">
                      İşlem sonrası dekont ekranını ekran görüntüsü olarak kaydedin
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Hesabınızı Oluşturun</p>
                    <p className="text-sm text-muted-foreground">
                      Aşağıdaki butona tıklayarak hesabınızı oluşturun
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Onay İşlemi</p>
                    <p className="text-sm text-muted-foreground">
                      Ödeme onaylandıktan sonra (1-2 iş günü) hesabınız tamamen aktif olacak
                    </p>
                  </div>
                </div>
              </div>

              {/* Hesap Oluştur Butonu */}
              <div className="pt-4">
                <Button
                  onClick={handleCreateAccount}
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Oluşturuluyor..." : "Hesabımı Oluştur"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/checkout/payment-method")}
                  className="w-full mt-3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

