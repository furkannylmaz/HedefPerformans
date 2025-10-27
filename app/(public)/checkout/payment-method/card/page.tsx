"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, ArrowLeft, ArrowRight, Lock } from "lucide-react"
import Image from "next/image"

export default function CardPaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    saveCard: false
  })

  // Kart numarası formatla
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const match = cleaned.match(/.{1,4}/g)
    return match ? match.join(" ") : cleaned
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "")
    if (value.length <= 16) {
      setFormData({ ...formData, cardNumber: formatCardNumber(value) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasyon
    if (
      formData.cardNumber.replace(/\s/g, "").length !== 16 ||
      !formData.cardName ||
      !formData.expiryMonth ||
      !formData.expiryYear ||
      formData.cvv.length !== 3
    ) {
      alert("Lütfen tüm bilgileri eksiksiz doldurun")
      return
    }

    setLoading(true)
    
    // Simüle edilmiş ödeme
    setTimeout(() => {
      // 3D Secure sayfasına yönlendir
      router.push("/checkout/3d-secure")
    }, 1000)
  }

  // Kart tipini tespit et
  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "")
    if (cleaned.startsWith("4")) return "VISA"
    if (cleaned.startsWith("5")) return "MASTERCARD"
    if (cleaned.startsWith("3")) return "AMEX"
    return "KART"
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
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
          {/* Sol Taraf - Kart Önizleme */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Kart Önizleme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Kart */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg p-6 text-white shadow-xl">
                      {/* Chip */}
                      <div className="mb-6">
                        <div className="w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm"></div>
                      </div>

                      {/* Kart Numarası */}
                      <div className="mb-6">
                        <p className="text-sm text-gray-400 mb-1">Kart Numarası</p>
                        <p className="text-2xl font-mono tracking-wider">
                          {formData.cardNumber || "•••• •••• •••• ••••"}
                        </p>
                      </div>

                      {/* Alt Bilgiler */}
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Kart Sahibi</p>
                          <p className="text-lg font-semibold uppercase">
                            {formData.cardName || "ADI SOYADI"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 mb-1">Son Kullanma</p>
                          <p className="text-lg font-mono">
                            {formData.expiryMonth || "MM"}/{formData.expiryYear || "YY"}
                          </p>
                        </div>
                      </div>

                      {/* Kart Tipi */}
                      <div className="mt-6 flex justify-end">
                        <div className="text-xl font-bold">
                          {formData.cardNumber ? getCardType(formData.cardNumber) : "KART"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CVV Göster */}
                  {formData.cardNumber && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>CVV: {formData.cvv || "•••"}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sağ Taraf - Kart Bilgileri Formu */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Kart Bilgileri
                </CardTitle>
                <CardDescription>
                  Güvenli ödeme için kart bilgilerinizi girin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Kart Numarası */}
                  <div className="space-y-2">
                    <Label>Kart Numarası</Label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      className="font-mono"
                    />
                  </div>

                  {/* Kart Adı */}
                  <div className="space-y-2">
                    <Label>Kart Sahibinin Adı</Label>
                    <Input
                      type="text"
                      placeholder="ADI SOYADI"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                      required
                      className="uppercase"
                    />
                  </div>

                  {/* Son Kullanma Tarihi */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ay</Label>
                      <Input
                        type="text"
                        placeholder="MM"
                        maxLength={2}
                        value={formData.expiryMonth}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          if (value.length <= 2) {
                            setFormData({ ...formData, expiryMonth: value })
                          }
                        }}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Yıl</Label>
                      <Input
                        type="text"
                        placeholder="YY"
                        maxLength={2}
                        value={formData.expiryYear}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          if (value.length <= 2) {
                            setFormData({ ...formData, expiryYear: value })
                          }
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* CVV */}
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input
                      type="text"
                      placeholder="123"
                      maxLength={3}
                      value={formData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        if (value.length <= 3) {
                          setFormData({ ...formData, cvv: value })
                        }
                      }}
                      required
                      className="w-1/2"
                    />
                  </div>

                  {/* Güvenlik Bilgisi */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Kart bilgileriniz güvenli şekilde işlenir</span>
                  </div>

                  {/* Butonlar */}
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? "İşleniyor..." : "Ödemeye Devam Et"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/checkout/payment-method")}
                      className="w-full"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Geri
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

