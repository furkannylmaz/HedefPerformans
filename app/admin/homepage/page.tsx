"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Upload } from "lucide-react"
import {
  HomepageContent,
  HomepageFeature,
  HomepageProgram,
  HomepageStat,
  HomepageTechnologyItem,
  IconKey,
  defaultHomepageContent,
  iconOptions,
} from "@/lib/homepage-content"

interface EditableStat extends HomepageStat {}
interface EditableFeature extends HomepageFeature {}
interface EditableProgram extends HomepageProgram {}
interface EditableTechnology extends HomepageTechnologyItem {}

const API_ENDPOINT = "/api/admin/site-settings"

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}

export default function AdminHomepagePage() {
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null) // Hangi görsel yükleniyor

  const stats = useMemo(() => content.stats ?? [], [content.stats])
  const features = useMemo(() => content.features.items ?? [], [content.features.items])
  const programs = useMemo(() => content.programs.items ?? [], [content.programs.items])
  const technologies = useMemo(() => content.technology.items ?? [], [content.technology.items])
  const testimonials = useMemo(() => content.testimonials.items ?? [], [content.testimonials.items])
  const gallery = useMemo(() => content.media.gallery ?? [], [content.media.gallery])

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_ENDPOINT}?key=homepage`)
        const data = await response.json()

        if (data.success && data.data) {
          setContent(data.data as HomepageContent)
        } else {
          toast.error(data.message || "İçerik yüklenemedi")
        }
      } catch (error) {
        console.error("[AdminHomepage] fetch error", error)
        toast.error("İçerik yüklenirken bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const updateHero = (field: keyof HomepageContent["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }))
  }

  const updateStat = (index: number, field: keyof EditableStat, value: string) => {
    setContent((prev) => {
      const next = [...prev.stats]
      next[index] = {
        ...next[index],
        [field]: value,
      }
      return { ...prev, stats: next }
    })
  }

  const addStat = () => {
    setContent((prev) => ({
      ...prev,
      stats: [
        ...prev.stats,
        {
          id: createId("stat"),
          value: "100",
          label: "Yeni istatistik",
          description: "Kısa açıklama",
        },
      ],
    }))
  }

  const removeStat = (index: number) => {
    setContent((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }))
  }

  const updateFeature = (index: number, field: keyof EditableFeature, value: string | IconKey) => {
    setContent((prev) => {
      const next = [...prev.features.items]
      next[index] = {
        ...next[index],
        [field]: value,
      }
      return {
        ...prev,
        features: {
          ...prev.features,
          items: next,
        },
      }
    })
  }

  const addFeature = () => {
    setContent((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: [
          ...prev.features.items,
          {
            id: createId("feature"),
            title: "Yeni avantaj",
            description: "Kısa açıklama",
            icon: "sparkles" as IconKey,
          },
        ],
      },
    }))
  }

  const removeFeature = (index: number) => {
    setContent((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.filter((_, i) => i !== index),
      },
    }))
  }

  const updateProgram = (index: number, field: keyof EditableProgram, value: string) => {
    setContent((prev) => {
      const next = [...prev.programs.items]
      next[index] = {
        ...next[index],
        [field]: value,
      }
      return {
        ...prev,
        programs: {
          ...prev.programs,
          items: next,
        },
      }
    })
  }

  const addProgram = () => {
    setContent((prev) => ({
      ...prev,
      programs: {
        ...prev.programs,
        items: [
          ...prev.programs.items,
          {
            id: createId("program"),
            badge: "Yeni modül",
            title: "Program başlığı",
            description: "Program açıklaması",
            imageUrl: "https://picsum.photos/seed/program/1200/800",
          },
        ],
      },
    }))
  }

  const removeProgram = (index: number) => {
    setContent((prev) => ({
      ...prev,
      programs: {
        ...prev.programs,
        items: prev.programs.items.filter((_, i) => i !== index),
      },
    }))
  }

  const updateTechnology = (index: number, field: keyof EditableTechnology, value: string | IconKey) => {
    setContent((prev) => {
      const next = [...prev.technology.items]
      next[index] = {
        ...next[index],
        [field]: value,
      }
      return {
        ...prev,
        technology: {
          ...prev.technology,
          items: next,
        },
      }
    })
  }

  const addTechnology = () => {
    setContent((prev) => ({
      ...prev,
      technology: {
        ...prev.technology,
        items: [
          ...prev.technology.items,
          {
            id: createId("tech"),
            title: "Yeni teknoloji",
            description: "Teknoloji açıklaması",
            icon: "atom" as IconKey,
          },
        ],
      },
    }))
  }

  const removeTechnology = (index: number) => {
    setContent((prev) => ({
      ...prev,
      technology: {
        ...prev.technology,
        items: prev.technology.items.filter((_, i) => i !== index),
      },
    }))
  }

  const updateTestimonial = (index: number, field: "quote" | "name" | "role", value: string) => {
    setContent((prev) => {
      const next = [...prev.testimonials.items]
      next[index] = {
        ...next[index],
        [field]: value,
      }
      return {
        ...prev,
        testimonials: {
          ...prev.testimonials,
          items: next,
        },
      }
    })
  }

  const addTestimonial = () => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: [
          ...prev.testimonials.items,
          {
            id: createId("testimonial"),
            quote: "Yeni yorum metni",
            name: "İsim Soyisim",
            role: "Ünvan",
          },
        ],
      },
    }))
  }

  const removeTestimonial = (index: number) => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: prev.testimonials.items.filter((_, i) => i !== index),
      },
    }))
  }

  const updateGalleryImage = (index: number, value: string) => {
    setContent((prev) => {
      const next = [...prev.media.gallery]
      next[index] = value
      return {
        ...prev,
        media: {
          ...prev.media,
          gallery: next,
        },
      }
    })
  }

  const addGalleryImage = () => {
    setContent((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        gallery: [...prev.media.gallery, "https://picsum.photos/seed/gallery/1200/800"],
      },
    }))
  }

  const removeGalleryImage = (index: number) => {
    setContent((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        gallery: prev.media.gallery.filter((_, i) => i !== index),
      },
    }))
  }

  const updateSectionDescription = (
    section: "features" | "programs" | "technology" | "testimonials",
    field: "title" | "description",
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const updateMedia = (field: "title" | "description" | "videoUrl", value: string) => {
    setContent((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        [field]: value,
      },
    }))
  }

  const updateCTA = (
    field:
      | "title"
      | "description"
      | "primaryCtaLabel"
      | "primaryCtaLink"
      | "secondaryCtaLabel"
      | "secondaryCtaLink"
      | "backgroundImage",
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      cta: {
        ...prev.cta,
        [field]: value,
      },
    }))
  }

  // Görsel yükleme fonksiyonu - updateHero, updateCTA, updateProgram'dan sonra tanımlanmalı
  const handleFileUpload = async (file: File, field: string, index?: number) => {
    setUploading(field)
    try {
      const uploadData = new FormData()
      uploadData.append('file', file)

      const response = await fetch('/api/admin/sliders/upload', {
        method: 'POST',
        body: uploadData
      })

      const data = await response.json()
      if (data.success) {
        const imageUrl = data.data.url
        
        if (field === 'hero.backgroundImage') {
          updateHero('backgroundImage', imageUrl)
        } else if (field === 'hero.overlayImage') {
          updateHero('overlayImage', imageUrl)
        } else if (field === 'cta.backgroundImage') {
          updateCTA('backgroundImage', imageUrl)
        } else if (field === 'program.imageUrl') {
          if (typeof index === 'number') {
            updateProgram(index, 'imageUrl', imageUrl)
          }
        } else if (field === 'gallery') {
          if (typeof index === 'number') {
            // Mevcut görseli güncelle
            setContent(prev => {
              const next = [...prev.media.gallery]
              next[index] = imageUrl
              return {
                ...prev,
                media: {
                  ...prev.media,
                  gallery: next,
                },
              }
            })
          } else {
            // Yeni galeri görseli ekle
            setContent(prev => ({
              ...prev,
              media: {
                ...prev.media,
                gallery: [...prev.media.gallery, imageUrl],
              },
            }))
          }
        }
        
        toast.success("Görsel başarıyla yüklendi!")
      } else {
        toast.error(data.message || "Görsel yüklenemedi")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Görsel yüklenirken hata oluştu")
    } finally {
      setUploading(null)
    }
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
          key: "homepage",
          value: content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setContent(data.data as HomepageContent)
        toast.success("Ana sayfa içeriği güncellendi")
      } else {
        toast.error(data.message || "Kayıt tamamlanamadı")
      }
    } catch (error) {
      console.error("[AdminHomepage] save error", error)
      toast.error("Kaydedilirken bir hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tanıtım İçeriği</h1>
          <p className="text-gray-600 mt-1">
            Ana sayfada gösterilen hero, programlar, teknoloji ve referans bloklarını buradan yönetin.
          </p>
        </div>
        <Button
          className="bg-red-600 text-white hover:bg-red-700 font-semibold"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
        </Button>
      </div>

      {loading ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="py-16 text-center text-gray-600">
            İçerik yükleniyor...
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Hero */}
          <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Hero Bölümü</CardTitle>
                <CardDescription>Ana başlık, görsel ve CTA içerikleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Üst Bant</Label>
                    <Input
                      value={content.hero.badge}
                      onChange={(e) => updateHero("badge", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vurgu Satırı</Label>
                    <Input
                      value={content.hero.highlight}
                      onChange={(e) => updateHero("highlight", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Textarea
                    value={content.hero.title}
                    onChange={(e) => updateHero("title", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea
                    value={content.hero.description}
                    onChange={(e) => updateHero("description", e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Arkaplan Görseli URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={content.hero.backgroundImage}
                        onChange={(e) => updateHero("backgroundImage", e.target.value)}
                        placeholder="Görsel URL veya yükleyin"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('upload-hero-bg')?.click()}
                        disabled={uploading === 'hero.backgroundImage'}
                        className="whitespace-nowrap"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading === 'hero.backgroundImage' ? 'Yükleniyor...' : 'Yükle'}
                      </Button>
                      <input
                        id="upload-hero-bg"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(file, 'hero.backgroundImage')
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Overlay Görsel URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={content.hero.overlayImage ?? ""}
                        onChange={(e) => updateHero("overlayImage", e.target.value)}
                        placeholder="Görsel URL veya yükleyin"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('upload-hero-overlay')?.click()}
                        disabled={uploading === 'hero.overlayImage'}
                        className="whitespace-nowrap"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading === 'hero.overlayImage' ? 'Yükleniyor...' : 'Yükle'}
                      </Button>
                      <input
                        id="upload-hero-overlay"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(file, 'hero.overlayImage')
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Birincil CTA Başlığı</Label>
                    <Input
                      value={content.hero.primaryCtaLabel}
                      onChange={(e) => updateHero("primaryCtaLabel", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Birincil CTA Link</Label>
                    <Input
                      value={content.hero.primaryCtaLink}
                      onChange={(e) => updateHero("primaryCtaLink", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>İkincil CTA Başlığı</Label>
                    <Input
                      value={content.hero.secondaryCtaLabel}
                      onChange={(e) => updateHero("secondaryCtaLabel", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>İkincil CTA Link</Label>
                    <Input
                      value={content.hero.secondaryCtaLink}
                      onChange={(e) => updateHero("secondaryCtaLink", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Alt Açıklama / Not</Label>
                  <Textarea
                    value={content.hero.statsNote}
                    onChange={(e) => updateHero("statsNote", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Öne Çıkan Rakamlar</CardTitle>
                <CardDescription>Hero altında gösterilen üçlü istatistik kartları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={stat.id} className="rounded-lg border border-turf-border bg-turf-bg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Değer</Label>
                        <Input value={stat.value} onChange={(e) => updateStat(index, "value", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Başlık</Label>
                        <Input value={stat.label} onChange={(e) => updateStat(index, "label", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Açıklama</Label>
                        <Input
                          value={stat.description ?? ""}
                          onChange={(e) => updateStat(index, "description", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeStat(index)}
                        disabled={stats.length <= 1}
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addStat} className="w-full md:w-auto">
                  Yeni İstatistik Ekle
                </Button>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Avantaj Kartları</CardTitle>
                <CardDescription>Ana sayfadaki dört avantaj kartı</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bölüm Başlığı</Label>
                    <Input
                      value={content.features.title}
                      onChange={(e) => updateSectionDescription("features", "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bölüm Açıklaması</Label>
                    <Textarea
                      value={content.features.description}
                      onChange={(e) => updateSectionDescription("features", "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <Separator />
                {features.map((feature, index) => (
                  <div key={feature.id} className="rounded-lg border border-turf-border bg-turf-bg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Başlık</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => updateFeature(index, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Açıklama</Label>
                        <Textarea
                          value={feature.description}
                          onChange={(e) => updateFeature(index, "description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>İkon</Label>
                      <Select
                        value={feature.icon}
                        onValueChange={(value) => updateFeature(index, "icon", value as IconKey)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="İkon seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(index)}>
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature} className="w-full md:w-auto">
                  Yeni Kart Ekle
                </Button>
              </CardContent>
            </Card>

            {/* Programs */}
            <Card className="bg-white border-gray-200 shadow-sm" id="programlar">
              <CardHeader>
                <CardTitle>Programlar</CardTitle>
                <CardDescription>Program kartlarının başlık ve görselleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bölüm Başlığı</Label>
                    <Input
                      value={content.programs.title}
                      onChange={(e) => updateSectionDescription("programs", "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bölüm Açıklaması</Label>
                    <Textarea
                      value={content.programs.description}
                      onChange={(e) => updateSectionDescription("programs", "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <Separator />
                {programs.map((program, index) => (
                  <div key={program.id} className="rounded-lg border border-turf-border bg-turf-bg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Üst Etiket</Label>
                        <Input
                          value={program.badge}
                          onChange={(e) => updateProgram(index, "badge", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Program Başlığı</Label>
                        <Input
                          value={program.title}
                          onChange={(e) => updateProgram(index, "title", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Açıklama</Label>
                      <Textarea
                        value={program.description}
                        onChange={(e) => updateProgram(index, "description", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Arkaplan Görseli</Label>
                      <div className="flex gap-2">
                        <Input
                          value={program.imageUrl}
                          onChange={(e) => updateProgram(index, "imageUrl", e.target.value)}
                          placeholder="Görsel URL veya yükleyin"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById(`upload-program-${index}`)?.click()}
                          disabled={uploading === `program.imageUrl` && uploading?.includes(`${index}`)}
                          className="whitespace-nowrap"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading?.startsWith(`program.imageUrl`) ? 'Yükleniyor...' : 'Yükle'}
                        </Button>
                        <input
                          id={`upload-program-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload(file, `program.imageUrl`, index)
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" variant="outline" size="sm" onClick={() => removeProgram(index)}>
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addProgram} className="w-full md:w-auto">
                  Yeni Program Ekle
                </Button>
              </CardContent>
            </Card>

            {/* Technology */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Teknoloji & Ekipman</CardTitle>
                <CardDescription>Teknoloji kartlarını düzenleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bölüm Başlığı</Label>
                    <Input
                      value={content.technology.title}
                      onChange={(e) => updateSectionDescription("technology", "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bölüm Açıklaması</Label>
                    <Textarea
                      value={content.technology.description}
                      onChange={(e) => updateSectionDescription("technology", "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <Separator />
                {technologies.map((item, index) => (
                  <div key={item.id} className="rounded-lg border border-turf-border bg-turf-bg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Başlık</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => updateTechnology(index, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Açıklama</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateTechnology(index, "description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>İkon</Label>
                      <Select
                        value={item.icon}
                        onValueChange={(value) => updateTechnology(index, "icon", value as IconKey)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="İkon seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" variant="outline" size="sm" onClick={() => removeTechnology(index)}>
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTechnology} className="w-full md:w-auto">
                  Yeni Teknoloji Kartı
                </Button>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Referanslar</CardTitle>
                <CardDescription>Sporcu ve veli yorumları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bölüm Başlığı</Label>
                    <Input
                      value={content.testimonials.title}
                      onChange={(e) => updateSectionDescription("testimonials", "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bölüm Açıklaması</Label>
                    <Textarea
                      value={content.testimonials.description}
                      onChange={(e) => updateSectionDescription("testimonials", "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <Separator />
                {testimonials.map((item, index) => (
                  <div key={item.id} className="rounded-lg border border-turf-border bg-turf-bg p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Alıntı</Label>
                      <Textarea
                        value={item.quote}
                        onChange={(e) => updateTestimonial(index, "quote", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ad Soyad</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ünvan</Label>
                        <Input
                          value={item.role}
                          onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" variant="outline" size="sm" onClick={() => removeTestimonial(index)}>
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTestimonial} className="w-full md:w-auto">
                  Yeni Referans Ekle
                </Button>
              </CardContent>
            </Card>

            {/* Media */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Medya Galerisi</CardTitle>
                <CardDescription>Video ve görsel koleksiyonunu güncelleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bölüm Başlığı</Label>
                    <Input
                      value={content.media.title}
                      onChange={(e) => updateMedia("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bölüm Açıklaması</Label>
                    <Textarea
                      value={content.media.description}
                      onChange={(e) => updateMedia("description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Video URL (YouTube embed)</Label>
                  <Input value={content.media.videoUrl ?? ""} onChange={(e) => updateMedia("videoUrl", e.target.value)} />
                </div>
                <Separator />
                <div className="space-y-4">
                  {gallery.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={image} 
                        onChange={(e) => updateGalleryImage(index, e.target.value)} 
                        placeholder="Görsel URL veya yükleyin"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById(`upload-gallery-${index}`)?.click()}
                        disabled={uploading === `gallery.${index}`}
                        className="whitespace-nowrap"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading === `gallery.${index}` ? 'Yükleniyor...' : 'Yükle'}
                      </Button>
                      <input
                        id={`upload-gallery-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(file, 'gallery', index)
                          }
                        }}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => removeGalleryImage(index)}>
                        Sil
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('upload-gallery-new')?.click()}
                      disabled={uploading === 'gallery.new'}
                      className="whitespace-nowrap"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading === 'gallery.new' ? 'Yükleniyor...' : 'Görsel Yükle'}
                    </Button>
                    <input
                      id="upload-gallery-new"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleFileUpload(file, 'gallery')
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addGalleryImage} className="w-full md:w-auto">
                      URL ile Ekle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Alt CTA Bölümü</CardTitle>
                <CardDescription>Sayfanın altındaki kayıt çağrısı</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input value={content.cta.title} onChange={(e) => updateCTA("title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea
                    value={content.cta.description}
                    onChange={(e) => updateCTA("description", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Birincil CTA Başlığı</Label>
                    <Input
                      value={content.cta.primaryCtaLabel}
                      onChange={(e) => updateCTA("primaryCtaLabel", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Birincil CTA Link</Label>
                    <Input
                      value={content.cta.primaryCtaLink}
                      onChange={(e) => updateCTA("primaryCtaLink", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>İkincil CTA Başlığı</Label>
                    <Input
                      value={content.cta.secondaryCtaLabel ?? ""}
                      onChange={(e) => updateCTA("secondaryCtaLabel", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>İkincil CTA Link</Label>
                    <Input
                      value={content.cta.secondaryCtaLink ?? ""}
                      onChange={(e) => updateCTA("secondaryCtaLink", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Arkaplan Görsel URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={content.cta.backgroundImage ?? ""}
                      onChange={(e) => updateCTA("backgroundImage", e.target.value)}
                      placeholder="Görsel URL veya yükleyin"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('upload-cta-bg')?.click()}
                      disabled={uploading === 'cta.backgroundImage'}
                      className="whitespace-nowrap"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading === 'cta.backgroundImage' ? 'Yükleniyor...' : 'Yükle'}
                    </Button>
                    <input
                      id="upload-cta-bg"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleFileUpload(file, 'cta.backgroundImage')
                        }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                className="bg-red-600 text-white hover:bg-red-700 font-bold"
                size="lg"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
            </div>
          </>
        )}
    </div>
  )
}

