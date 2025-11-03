"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, Save, Plus, Trash2 } from "lucide-react"
import { AboutPageContent, defaultAboutPageContent } from "@/lib/pages-content"
import { ABOUT_PAGE_KEY } from "@/lib/site-settings"

const API_ENDPOINT = "/api/admin/pages"

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}

export function AboutPageEditor() {
  const [content, setContent] = useState<AboutPageContent>(defaultAboutPageContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_ENDPOINT}?key=${ABOUT_PAGE_KEY}`)
        const data = await response.json()

        if (data.success && data.data) {
          setContent(data.data as AboutPageContent)
        }
      } catch (error) {
        console.error("[AboutPageEditor] fetch error", error)
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
        setContent((prev) => ({
          ...prev,
          hero: {
            ...prev.hero,
            backgroundImage: data.data.url,
          },
        }))
        toast.success("Görsel başarıyla yüklendi")
      } else {
        toast.error(data.message || "Görsel yüklenemedi")
      }
    } catch (error) {
      console.error("[AboutPageEditor] upload error", error)
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
          key: ABOUT_PAGE_KEY,
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
      console.error("[AboutPageEditor] save error", error)
      toast.error("Kayıt sırasında bir hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field: keyof AboutPageContent["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }))
  }

  const updateValue = (
    index: number,
    field: keyof AboutPageContent["values"]["items"][0],
    value: string,
  ) => {
    setContent((prev) => {
      const next = [...prev.values.items]
      next[index] = {
        ...next[index],
        [field]: value,
      }
      return {
        ...prev,
        values: {
          ...prev.values,
          items: next,
        },
      }
    })
  }

  const addValue = () => {
    setContent((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        items: [
          ...prev.values.items,
          {
            id: createId("value"),
            title: "Yeni Değer",
            description: "Açıklama",
          },
        ],
      },
    }))
  }

  const removeValue = (index: number) => {
    setContent((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        items: prev.values.items.filter((_, i) => i !== index),
      },
    }))
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
                id="hero-background-upload-about"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload("hero.backgroundImage", file)
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("hero-background-upload-about")?.click()}
                disabled={uploading === "hero.backgroundImage"}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading === "hero.backgroundImage" ? "Yükleniyor..." : "Yükle"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Misyon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Başlık</Label>
              <Input
                value={content.mission.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    mission: { ...prev.mission, title: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label>Açıklama</Label>
              <Textarea
                value={content.mission.description}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    mission: { ...prev.mission, description: e.target.value },
                  }))
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Vizyon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Başlık</Label>
              <Input
                value={content.vision.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    vision: { ...prev.vision, title: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label>Açıklama</Label>
              <Textarea
                value={content.vision.description}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    vision: { ...prev.vision, description: e.target.value },
                  }))
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">İstatistikler</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Antrenör Sayısı</Label>
            <Input
              type="number"
              value={content.stats.trainers}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  stats: { ...prev.stats, trainers: parseInt(e.target.value) || 0 },
                }))
              }
            />
          </div>
          <div>
            <Label>Öğrenci Sayısı</Label>
            <Input
              type="number"
              value={content.stats.students}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  stats: { ...prev.stats, students: parseInt(e.target.value) || 0 },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Values */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-gray-900">Değerlerimiz</CardTitle>
          <Button onClick={addValue} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Değer Ekle
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Değerler Başlığı</Label>
            <Input
              value={content.values.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  values: { ...prev.values, title: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-4">
            {content.values.items.map((value, index) => (
              <Card key={value.id} className="bg-gray-50 border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">Değer {index + 1}</CardTitle>
                  <Button
                    onClick={() => removeValue(index)}
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
                      value={value.title}
                      onChange={(e) => updateValue(index, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Açıklama</Label>
                    <Textarea
                      value={value.description}
                      onChange={(e) => updateValue(index, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
