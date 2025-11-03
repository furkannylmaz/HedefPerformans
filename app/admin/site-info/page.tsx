"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { defaultSiteInfo, SiteInfo } from "@/lib/site-info"

const API_ENDPOINT = "/api/admin/site-settings"

export default function AdminSiteInfoPage() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(defaultSiteInfo)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSiteInfo = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_ENDPOINT}?key=siteInfo`)
        const data = await response.json()

        if (data.success && data.data) {
          setSiteInfo(data.data as SiteInfo)
        } else {
          toast.error(data.message || "Site bilgileri yüklenemedi")
        }
      } catch (error) {
        console.error("[AdminSiteInfo] fetch error", error)
        toast.error("Site bilgileri yüklenirken bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchSiteInfo()
  }, [])

  const updateField = (field: keyof SiteInfo, value: string | SiteInfo["socials"] | SiteInfo["bankInfo"]) => {
    setSiteInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateSocial = (field: keyof SiteInfo["socials"], value: string) => {
    setSiteInfo((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "siteInfo",
          value: siteInfo,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSiteInfo(data.data as SiteInfo)
        toast.success("Site bilgileri güncellendi")
      } else {
        toast.error(data.message || "Kayıt tamamlanamadı")
      }
    } catch (error) {
      console.error("[AdminSiteInfo] save error", error)
      toast.error("Kaydedilirken bir hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Bilgileri</h1>
          <p className="text-gray-600 mt-1">
            İletişim, adres ve sosyal medya bağlantıları dahil olmak üzere sabit içerikleri yönetin.
          </p>
        </div>
        <Button
          className="bg-red-600 text-white hover:bg-red-700 font-semibold"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Kaydediliyor..." : "Bilgileri Kaydet"}
        </Button>
      </div>

      {loading ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="py-16 text-center text-gray-600">
            Bilgiler yükleniyor...
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Genel Bilgiler</CardTitle>
              <CardDescription>Bu bilgilerin tamamı ana sayfanın alt bölümünde gösterilir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input value={siteInfo.headline} onChange={(e) => updateField("headline", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input value={siteInfo.phone} onChange={(e) => updateField("phone", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kısa Açıklama</Label>
                <Textarea
                  value={siteInfo.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>E-posta</Label>
                  <Input value={siteInfo.email} onChange={(e) => updateField("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Linki</Label>
                  <Input
                    value={siteInfo.whatsapp}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                    placeholder="https://wa.me/90..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Adres</Label>
                <Textarea value={siteInfo.address} onChange={(e) => updateField("address", e.target.value)} rows={2} />
              </div>

              <Separator />

              <div className="space-y-4">
                <CardTitle className="text-lg">Sosyal Medya</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      value={siteInfo.socials.instagram ?? ""}
                      onChange={(e) => updateSocial("instagram", e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube</Label>
                    <Input
                      value={siteInfo.socials.youtube ?? ""}
                      onChange={(e) => updateSocial("youtube", e.target.value)}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TikTok</Label>
                    <Input
                      value={siteInfo.socials.tiktok ?? ""}
                      onChange={(e) => updateSocial("tiktok", e.target.value)}
                      placeholder="https://www.tiktok.com/@..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp (widget)</Label>
                    <Input
                      value={siteInfo.socials.whatsapp ?? ""}
                      onChange={(e) => updateSocial("whatsapp", e.target.value)}
                      placeholder="https://wa.me/..."
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <CardTitle className="text-lg">Banka Hesap Bilgileri</CardTitle>
                  <CardDescription className="mt-1">
                    Havale/EFT ödeme sayfasında gösterilecek banka bilgileri
                  </CardDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Banka Adı</Label>
                    <Input
                      value={siteInfo.bankInfo?.bankName ?? ""}
                      onChange={(e) => updateField("bankInfo", { ...siteInfo.bankInfo, bankName: e.target.value } as any)}
                      placeholder="Örn: Ziraat Bankası"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hesap Sahibi</Label>
                    <Input
                      value={siteInfo.bankInfo?.accountName ?? ""}
                      onChange={(e) => updateField("bankInfo", { ...siteInfo.bankInfo, accountName: e.target.value } as any)}
                      placeholder="Örn: Hedef Performans Spor Kulübü"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IBAN</Label>
                    <Input
                      value={siteInfo.bankInfo?.iban ?? ""}
                      onChange={(e) => updateField("bankInfo", { ...siteInfo.bankInfo, iban: e.target.value } as any)}
                      placeholder="TR99 0001 0009 9900 0000 0000 00"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hesap Numarası</Label>
                    <Input
                      value={siteInfo.bankInfo?.accountNumber ?? ""}
                      onChange={(e) => updateField("bankInfo", { ...siteInfo.bankInfo, accountNumber: e.target.value } as any)}
                      placeholder="9900000000"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Şube</Label>
                    <Input
                      value={siteInfo.bankInfo?.branch ?? ""}
                      onChange={(e) => updateField("bankInfo", { ...siteInfo.bankInfo, branch: e.target.value } as any)}
                      placeholder="Örn: Kadıköy Şubesi (990)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ödeme Tutarı (₺)</Label>
                    <Input
                      value={siteInfo.bankInfo?.amount ?? ""}
                      onChange={(e) => updateField("bankInfo", { ...siteInfo.bankInfo, amount: e.target.value } as any)}
                      placeholder="499.00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-red-600 text-white hover:bg-red-700 font-semibold"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Kaydediliyor..." : "Bilgileri Kaydet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}

