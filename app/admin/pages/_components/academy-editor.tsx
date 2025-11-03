"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, Save, Plus, Trash2 } from "lucide-react"
import { AcademyPageContent, defaultAcademyPageContent } from "@/lib/pages-content"
import { ACADEMY_PAGE_KEY } from "@/lib/site-settings"

const API_ENDPOINT = "/api/admin/pages"

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}

export function AcademyPageEditor() {
  const [content, setContent] = useState<AcademyPageContent>(defaultAcademyPageContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_ENDPOINT}?key=${ACADEMY_PAGE_KEY}`)
        const data = await response.json()

        if (data.success && data.data) {
          setContent(data.data as AcademyPageContent)
        }
      } catch (error) {
        console.error("[AcademyPageEditor] fetch error", error)
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
        if (pathParts.length === 2 && pathParts[0] === "hero") {
          setContent((prev) => ({
            ...prev,
            hero: {
              ...prev.hero,
              [pathParts[1] as keyof typeof prev.hero]: data.data.url,
            },
          }))
        } else if (pathParts.length === 3 && pathParts[0] === "sections") {
          const sectionIndex = parseInt(pathParts[1])
          setContent((prev) => {
            const next = [...prev.sections]
            next[sectionIndex] = {
              ...next[sectionIndex],
              imageUrl: data.data.url,
            }
            return { ...prev, sections: next }
          })
        }
        toast.success("Görsel başarıyla yüklendi")
      } else {
        toast.error(data.message || "Görsel yüklenemedi")
      }
    } catch (error) {
      console.error("[AcademyPageEditor] upload error", error)
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
          key: ACADEMY_PAGE_KEY,
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
      console.error("[AcademyPageEditor] save error", error)
      toast.error("Kayıt sırasında bir hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field: keyof AcademyPageContent["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }))
  }

  const updateSection = (
    index: number,
    field: keyof AcademyPageContent["sections"][0],
    value: string | string[],
  ) => {
    setContent((prev) => {
      const next = [...prev.sections]
      next[index] = {
        ...next[index],
        [field]: value,
      }
      return { ...prev, sections: next }
    })
  }

  const addSection = () => {
    setContent((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: createId("section"),
          title: "Yeni Bölüm",
          description: "Açıklama",
          features: [],
          order: prev.sections.length + 1,
        },
      ],
    }))
  }

  const removeSection = (index: number) => {
    setContent((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }))
  }

  const addFeature = (sectionIndex: number) => {
    setContent((prev) => {
      const next = [...prev.sections]
      next[sectionIndex] = {
        ...next[sectionIndex],
        features: [...next[sectionIndex].features, "Yeni özellik"],
      }
      return { ...prev, sections: next }
    })
  }

  const updateFeature = (sectionIndex: number, featureIndex: number, value: string) => {
    setContent((prev) => {
      const next = [...prev.sections]
      next[sectionIndex] = {
        ...next[sectionIndex],
        features: next[sectionIndex].features.map((f, i) => (i === featureIndex ? value : f)),
      }
      return { ...prev, sections: next }
    })
  }

  const removeFeature = (sectionIndex: number, featureIndex: number) => {
    setContent((prev) => {
      const next = [...prev.sections]
      next[sectionIndex] = {
        ...next[sectionIndex],
        features: next[sectionIndex].features.filter((_, i) => i !== featureIndex),
      }
      return { ...prev, sections: next }
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
                id="hero-background-upload-academy"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload("hero.backgroundImage", file)
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("hero-background-upload-academy")?.click()}
                disabled={uploading === "hero.backgroundImage"}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading === "hero.backgroundImage" ? "Yükleniyor..." : "Yükle"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-gray-900">Bölümler</CardTitle>
          <Button onClick={addSection} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Bölüm Ekle
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => (
              <Card key={section.id} className="bg-gray-50 border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">Bölüm {index + 1}</CardTitle>
                  <Button
                    onClick={() => removeSection(index)}
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
                      value={section.title}
                      onChange={(e) => updateSection(index, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Açıklama</Label>
                    <Textarea
                      value={section.description}
                      onChange={(e) => updateSection(index, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Görsel URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={section.imageUrl || ""}
                        onChange={(e) => updateSection(index, "imageUrl", e.target.value)}
                        placeholder="Görsel URL"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id={`section-image-upload-${index}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(`sections.${index}.imageUrl`, file)
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById(`section-image-upload-${index}`)?.click()}
                        disabled={uploading === `sections.${index}.imageUrl`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading === `sections.${index}.imageUrl` ? "Yükleniyor..." : "Yükle"}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Sıra</Label>
                    <Input
                      type="number"
                      value={section.order}
                      onChange={(e) => updateSection(index, "order", e.target.value)}
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
                      {section.features.map((feature, featureIndex) => (
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
