"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Image as ImageIcon, Plus, Edit, Trash2, Save, X, Upload } from "lucide-react"
import Link from "next/link"

// Slider tipi
interface Slider {
  id: string
  side: string
  title: string | null
  imageUrl: string
  linkUrl: string | null
  sort: number
  isActive: boolean
}

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    side: "LEFT",
    title: "",
    imageUrl: "",
    linkUrl: "",
    sort: 0,
    isActive: true
  })

  // Slider'ları yükle
  const loadSliders = async () => {
    try {
      const response = await fetch('/api/admin/sliders')
      const data = await response.json()
      if (data.success) {
        setSliders(data.data.sliders)
      }
    } catch (error) {
      console.error("Slider load error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSliders()
  }, [])

  // Görsel yükleme
  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const uploadData = new FormData()
      uploadData.append('file', file)

      const response = await fetch('/api/admin/sliders/upload', {
        method: 'POST',
        body: uploadData
      })

      const data = await response.json()
      if (data.success) {
        setFormData({ ...formData, imageUrl: data.data.url })
        alert("Görsel başarıyla yüklendi!")
      } else {
        alert(data.message || "Görsel yüklenemedi")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Görsel yüklenirken hata oluştu")
    } finally {
      setUploading(false)
    }
  }

  // Yeni slider ekle
  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/sliders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setShowAddForm(false)
        resetForm()
        loadSliders()
        alert("Slider başarıyla eklendi!")
      } else {
        alert(data.message || "Slider eklenemedi")
      }
    } catch (error) {
      console.error("Add error:", error)
      alert("Slider eklenirken hata oluştu")
    }
  }

  // Slider güncelle
  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/sliders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setEditingId(null)
        resetForm()
        loadSliders()
        alert("Slider güncellendi!")
      } else {
        alert(data.message || "Slider güncellenemedi")
      }
    } catch (error) {
      console.error("Update error:", error)
      alert("Slider güncellenirken hata oluştu")
    }
  }

  // Slider sil
  const handleDelete = async (id: string) => {
    if (!confirm("Bu slider'ı silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/admin/sliders/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        loadSliders()
        alert("Slider silindi!")
      } else {
        alert(data.message || "Slider silinemedi")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Slider silinirken hata oluştu")
    }
  }

  // Form'u sıfırla
  const resetForm = () => {
    setFormData({
      side: "LEFT",
      title: "",
      imageUrl: "",
      linkUrl: "",
      sort: 0,
      isActive: true
    })
  }

  // Düzenleme için slider'ı yükle
  const startEdit = (slider: Slider) => {
    setEditingId(slider.id)
    setFormData({
      side: slider.side,
      title: slider.title || "",
      imageUrl: slider.imageUrl,
      linkUrl: slider.linkUrl || "",
      sort: slider.sort,
      isActive: slider.isActive
    })
    setShowAddForm(false)
  }

  // Düzenlemeyi iptal et
  const cancelEdit = () => {
    setEditingId(null)
    resetForm()
  }

  // Sol ve sağ slider'ları ayır
  const leftSliders = sliders.filter(s => s.side === "LEFT")
  const rightSliders = sliders.filter(s => s.side === "RIGHT")

  return (
    <div className="min-h-screen bg-turf-bg">
      <div className="border-b border-turf-border bg-turf-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#111111] flex items-center gap-2">
                <ImageIcon className="h-8 w-8" />
                Slider Yönetimi
              </h1>
              <p className="text-[#111111]">
                Slider görsellerini yönetin.
              </p>
            </div>
            <Button
              onClick={() => {
                setShowAddForm(!showAddForm)
                setEditingId(null)
                resetForm()
              }}
              className="bg-neon-green text-black hover:bg-field-green"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Slider Ekle
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hızlı Linkler */}
        <div className="mb-6 overflow-x-auto scroll-smooth">
          <div className="flex gap-2 min-w-max">
            <Button asChild variant="outline" size="sm" className="border-neon-green text-[#111111] hover:bg-neon-green">
              <Link href="/admin/users">Kullanıcı Yönetimi</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-neon-green text-[#111111] hover:bg-neon-green">
              <Link href="/admin/squads">Kadro Yönetimi</Link>
            </Button>
            <Button asChild variant="default" size="sm" className="bg-neon-green text-black hover:bg-field-green font-bold">
              <Link href="/admin/sliders">Slider Yönetimi</Link>
            </Button>
          </div>
        </div>

        {/* Form - Yeni Ekleme veya Düzenleme */}
        {(showAddForm || editingId) && (
          <Card className="mb-6 bg-turf-card border-turf-border">
            <CardHeader>
              <CardTitle>{editingId ? 'Slider Düzenle' : 'Yeni Slider Ekle'}</CardTitle>
              <CardDescription>
                {editingId ? 'Slider bilgilerini güncelleyin' : 'Slider bilgilerini girin'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Taraf</Label>
                  <Select
                    value={formData.side}
                    onValueChange={(value) => setFormData({ ...formData, side: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEFT">Sol</SelectItem>
                      <SelectItem value="RIGHT">Sağ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sıralama</Label>
                  <Input
                    type="number"
                    value={formData.sort}
                    onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Başlık (Opsiyonel)</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: Özel Kampanyamız"
                />
              </div>

              <div className="space-y-2">
                <Label>Görsel URL *</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg veya /sliders/image.jpg"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={uploading}
                    className="whitespace-nowrap"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Yükleniyor...' : 'Görsel Seç'}
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(file)
                      }
                    }}
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl.startsWith('/') ? formData.imageUrl : formData.imageUrl} 
                      alt="Preview" 
                      className="w-32 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Link URL (Opsiyonel)</Label>
                <Input
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive">Aktif</Label>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                  className="bg-neon-green text-black hover:bg-field-green"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Güncelle' : 'Kaydet'}
                </Button>
                <Button
                  onClick={() => {
                    if (editingId) cancelEdit()
                    else setShowAddForm(false)
                  }}
                  variant="outline"
                >
                  <X className="h-4 w-4 mr-2" />
                  İptal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sol Slider'lar */}
        <Card className="mb-6 bg-turf-card border-turf-border">
          <CardHeader>
            <CardTitle>Sol Slider ({leftSliders.length})</CardTitle>
            <CardDescription>Auth sayfasında solda görünecek slider'lar</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : leftSliders.length > 0 ? (
              <div className="space-y-4">
                {leftSliders.map((slider) => (
                  <div key={slider.id} className="flex items-center gap-4 p-4 border rounded-lg bg-turf-bg">
                    <img src={slider.imageUrl} alt={slider.title || 'Slider'} className="w-32 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-bold text-[#111111]">{slider.title || 'Başlıksız'}</h3>
                      <p className="text-sm text-muted-foreground">Sıra: {slider.sort} | {slider.isActive ? 'Aktif' : 'Pasif'}</p>
                      {slider.linkUrl && (
                        <p className="text-xs text-blue-500">Link: {slider.linkUrl}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEdit(slider)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(slider.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Henüz sol slider eklenmemiş</p>
            )}
          </CardContent>
        </Card>

        {/* Sağ Slider'lar */}
        <Card className="bg-turf-card border-turf-border">
          <CardHeader>
            <CardTitle>Sağ Slider ({rightSliders.length})</CardTitle>
            <CardDescription>Auth sayfasında sağda görünecek slider'lar</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : rightSliders.length > 0 ? (
              <div className="space-y-4">
                {rightSliders.map((slider) => (
                  <div key={slider.id} className="flex items-center gap-4 p-4 border rounded-lg bg-turf-bg">
                    <img src={slider.imageUrl} alt={slider.title || 'Slider'} className="w-32 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-bold text-[#111111]">{slider.title || 'Başlıksız'}</h3>
                      <p className="text-sm text-muted-foreground">Sıra: {slider.sort} | {slider.isActive ? 'Aktif' : 'Pasif'}</p>
                      {slider.linkUrl && (
                        <p className="text-xs text-blue-500">Link: {slider.linkUrl}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEdit(slider)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(slider.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Henüz sağ slider eklenmemiş</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
