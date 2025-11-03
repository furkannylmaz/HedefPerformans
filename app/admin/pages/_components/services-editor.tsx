"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, Save, Plus, Trash2 } from "lucide-react"
import { ServicesPageContent, defaultServicesPageContent } from "@/lib/pages-content"
import { SERVICES_PAGE_KEY } from "@/lib/site-settings"

const API_ENDPOINT = "/api/admin/pages"

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}

export function ServicesPageEditor() {
  const [content, setContent] = useState<ServicesPageContent>(defaultServicesPageContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_ENDPOINT}?key=${SERVICES_PAGE_KEY}`)
        const data = await response.json()

        if (data.success && data.data) {
          setContent(data.data as ServicesPageContent)
        }
      } catch (error) {
        console.error("[ServicesPageEditor] fetch error", error)
        toast.error("İçerik yüklenirken bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const handleFileUpload = async (
    fieldPath: string,
    file: File,
  ) => {
    setUploading(fieldPath)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin/sliders/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.data?.url) {
        const pathParts = fieldPath.split(".")
        if (pathParts.length === 1) {
          setContent((prev) => ({
            ...prev,
            hero: {
              ...prev.hero,
              [pathParts[0] as keyof typeof prev.hero]: data.data.url,
            },
          }))
        }
        toast.success("Görsel başarıyla yüklendi")
      } else {
        toast.error(data.message || "Görsel yüklenemedi")
      }
    } catch (error) {
      console.error("[ServicesPageEditor] upload error", error)
      toast.error("Görsel yüklenirken bir hata oluştu")
    } finally {
      setUploading(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: SERVICES_PAGE_KEY,
          value: content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("İçerik başarıyla kaydedildi")
      } else {
        toast.error(data.message || "Kayıt sırasında bir hata oluştu")
      }
    } catch (error) {
      console.error("[ServicesPageEditor] save error", error)
      toast.error("Kayıt sırasında bir hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field: keyof ServicesPageContent["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }))
  }

  const updateService = (
    index: number,
    field: keyof ServicesPageContent["services"][0],
    value: string | string[] | number,
  ) => {
    setContent((prev) => {
      const next = [...prev.services]
      next[index] = {
        ...next[index],
        [field]: value,
      }
      return { ...prev, services: next }
    })
  }

  const addService = () => {
    setContent((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: createId("service"),
          title: "Yeni Hizmet",
          subtitle: "Alt başlık",
          description: "Açıklama",
          features: [],
          order: prev.services.length + 1,
        },
      ],
    }))
  }

  const removeService = (index: number) => {
    setContent((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  const addFeature = (serviceIndex: number) => {
    setContent((prev) => {
      const next = [...prev.services]
      next[serviceIndex] = {
        ...next[serviceIndex],
        features: [...next[serviceIndex].features, "Yeni özellik"],
      }
      return { ...prev, services: next }
    })
  }

  const updateFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    setContent((prev) => {
      const next = [...prev.services]
      next[serviceIndex] = {
        ...next[serviceIndex],
        features: next[serviceIndex].features.map((f, i) => (i === featureIndex ? value : f)),
      }
      return { ...prev, services: next }
    })
  }

  const removeFeature = (serviceIndex: number, featureIndex: number) => {
    setContent((prev) => {
      const next = [...prev.services]
      next[serviceIndex] = {
        ...next[serviceIndex],
        features: next[serviceIndex].features.filter((_, i) => i !== featureIndex),
      }
      return { ...prev, services: next }
    })
  }

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Hero Bölümü</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Başlık</Label>
            <Input
              value={content.hero.title}
              onChange={(e) => updateHero("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Alt Başlık</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => updateHero("subtitle", e.target.value)}
            />
          </div>
          <div>
            <Label>Açıklama</Label>
            <Textarea
              value={content.hero.description}
              onChange={(e) => updateHero("description", e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label>Arka Plan Görseli</Label>
            <div className="flex gap-2">
              <Input
                value={content.hero.backgroundImage || ""}
                onChange={(e) => updateHero("backgroundImage", e.target.value)}
                placeholder="Görsel URL"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="hero-background-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload("hero.backgroundImage", file)
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("hero-background-upload")?.click()}
                disabled={uploading === "hero.backgroundImage"}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading === "hero.backgroundImage" ? "Yükleniyor..." : "Yükle"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-gray-900">Hizmetler</CardTitle>
          <Button onClick={addService} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Hizmet Ekle
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.services
            .sort((a, b) => a.order - b.order)
            .map((service, index) => (
              <Card key={service.id} className="bg-gray-50 border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">Hizmet {index + 1}</CardTitle>
                  <Button
                    onClick={() => removeService(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Başlık</Label>
                    <Input
                      value={service.title}
                      onChange={(e) => updateService(index, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Alt Başlık</Label>
                    <Input
                      value={service.subtitle}
                      onChange={(e) => updateService(index, "subtitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Açıklama</Label>
                    <Textarea
                      value={service.description}
                      onChange={(e) => updateService(index, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Görsel URL</Label>
                    <Input
                      value={service.imageUrl || ""}
                      onChange={(e) => updateService(index, "imageUrl", e.target.value)}
                      placeholder="Görsel URL"
                    />
                  </div>
                  <div>
                    <Label>Sıra</Label>
                    <Input
                      type="number"
                      value={service.order}
                      onChange={(e) => updateService(index, "order", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Özellikler</Label>
                      <Button
                        onClick={() => addFeature(index)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Özellik Ekle
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                            placeholder="Özellik metni"
                          />
                          <Button
                            onClick={() => removeFeature(index, featureIndex)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Çağrı Bölümü (CTA)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Başlık</Label>
            <Input
              value={content.cta.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, title: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label>Açıklama</Label>
            <Textarea
              value={content.cta.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, description: e.target.value },
                }))
              }
              rows={3}
            />
          </div>
          <div>
            <Label>Buton Metni</Label>
            <Input
              value={content.cta.buttonText}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, buttonText: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label>Buton Link</Label>
            <Input
              value={content.cta.buttonLink}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, buttonLink: e.target.value },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-red-600 hover:bg-red-700">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </div>
  )
}

