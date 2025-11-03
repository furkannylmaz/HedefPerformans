"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Image as ImageIcon, Plus, Edit, Trash2, Save, X, Upload } from "lucide-react"

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

  // Slider'ları tarafa göre ayır
  const leftSliders = sliders.filter(s => s.side === "LEFT")
  const rightSliders = sliders.filter(s => s.side === "RIGHT")
  const mainSliders = sliders.filter(s => s.side === "MAIN")
  const welcomeRightSliders = sliders.filter(s => s.side === "WELCOME_RIGHT")
  
  // MAIN slider'ları pozisyonlarına göre ayır
  const mainLeftSlider = mainSliders.find(s => s.sort === 0)
  const mainRightTopSlider = mainSliders.find(s => s.sort === 1)
  const mainRightBottomSlider = mainSliders.find(s => s.sort === 2)
  
  // Welcome Right slider (tek görsel)
  const welcomeRightSlider = welcomeRightSliders[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="h-8 w-8 text-red-600" />
            Slider Yönetimi
          </h1>
          <p className="text-gray-600 mt-1">
            Slider görsellerini yönetin.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(!showAddForm)
            setEditingId(null)
            resetForm()
          }}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Slider Ekle
        </Button>
      </div>

      {/* Form - Yeni Ekleme veya Düzenleme */}
      {(showAddForm || editingId) && (
        <Card id="slider-form" className="mb-6 bg-white border-gray-200 shadow-sm">
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
                      <SelectItem value="LEFT">Sol (Auth Sayfası)</SelectItem>
                      <SelectItem value="RIGHT">Sağ (Auth Sayfası)</SelectItem>
                      <SelectItem value="MAIN">Ana Sayfa Banner</SelectItem>
                      <SelectItem value="WELCOME_RIGHT">Welcome Sağ Taraf Fotoğraf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              <div className="space-y-2">
                <Label>
                  Sıralama
                  {formData.side === "MAIN" && (
                    <span className="text-xs text-gray-500 block mt-1">
                      0: Sol büyük bölüm | 1: Sağ üst | 2: Sağ alt
                    </span>
                  )}
                  {formData.side === "WELCOME_RIGHT" && (
                    <span className="text-xs text-gray-500 block mt-1">
                      Tek görsel için 0 kullanın
                    </span>
                  )}
                </Label>
                <Input
                  type="number"
                  value={formData.sort}
                  onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })}
                  min={0}
                  max={formData.side === "MAIN" ? 2 : undefined}
                  disabled={formData.side === "WELCOME_RIGHT"}
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

              {formData.side !== "WELCOME_RIGHT" && (
                <div className="space-y-2">
                  <Label>Link URL (Opsiyonel)</Label>
                  <Input
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              )}

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
                  className="bg-red-600 text-white hover:bg-red-700"
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
        <Card className="mb-6 bg-white border-gray-200 shadow-sm">
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
                  <div key={slider.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
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
        <Card className="mb-6 bg-white border-gray-200 shadow-sm">
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
                  <div key={slider.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
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

        {/* Ana Sayfa Banner'lar */}
        <Card className="mb-6 bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Ana Sayfa Banner ({mainSliders.length}/3)</CardTitle>
            <CardDescription>Ana sayfanın üst kısmında görünecek 3 bölümlü banner sistemi</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : (
              <div className="space-y-4">
                {/* Sol Büyük Bölüm */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Sol Büyük Bölüm (sort: 0)</h4>
                    {mainLeftSlider ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Dolu</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Boş</span>
                    )}
                  </div>
                  {mainLeftSlider ? (
                    <div className="flex items-center gap-4">
                      <img src={mainLeftSlider.imageUrl} alt={mainLeftSlider.title || 'Slider'} className="w-32 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{mainLeftSlider.title || 'Başlıksız'}</h3>
                        <p className="text-sm text-muted-foreground">{mainLeftSlider.isActive ? 'Aktif' : 'Pasif'}</p>
                        {mainLeftSlider.linkUrl && (
                          <p className="text-xs text-blue-500">Link: {mainLeftSlider.linkUrl}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEdit(mainLeftSlider)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(mainLeftSlider.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Henüz eklenmemiş</p>
                  )}
                </div>

                {/* Sağ Üst Bölüm */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Sağ Üst Bölüm (sort: 1)</h4>
                    {mainRightTopSlider ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Dolu</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Boş</span>
                    )}
                  </div>
                  {mainRightTopSlider ? (
                    <div className="flex items-center gap-4">
                      <img src={mainRightTopSlider.imageUrl} alt={mainRightTopSlider.title || 'Slider'} className="w-32 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{mainRightTopSlider.title || 'Başlıksız'}</h3>
                        <p className="text-sm text-muted-foreground">{mainRightTopSlider.isActive ? 'Aktif' : 'Pasif'}</p>
                        {mainRightTopSlider.linkUrl && (
                          <p className="text-xs text-blue-500">Link: {mainRightTopSlider.linkUrl}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEdit(mainRightTopSlider)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(mainRightTopSlider.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Henüz eklenmemiş</p>
                  )}
                </div>

                {/* Sağ Alt Bölüm */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Sağ Alt Bölüm (sort: 2)</h4>
                    {mainRightBottomSlider ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Dolu</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Boş</span>
                    )}
                  </div>
                  {mainRightBottomSlider ? (
                    <div className="flex items-center gap-4">
                      <img src={mainRightBottomSlider.imageUrl} alt={mainRightBottomSlider.title || 'Slider'} className="w-32 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{mainRightBottomSlider.title || 'Başlıksız'}</h3>
                        <p className="text-sm text-muted-foreground">{mainRightBottomSlider.isActive ? 'Aktif' : 'Pasif'}</p>
                        {mainRightBottomSlider.linkUrl && (
                          <p className="text-xs text-blue-500">Link: {mainRightBottomSlider.linkUrl}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEdit(mainRightBottomSlider)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(mainRightBottomSlider.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Henüz eklenmemiş</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Welcome Sağ Taraf Fotoğraf */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Welcome Sağ Taraf Fotoğraf</CardTitle>
            <CardDescription>Ana sayfa Hero bölümünün sağ tarafında görünecek görsel</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : welcomeRightSlider ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                  <img 
                    src={welcomeRightSlider.imageUrl} 
                    alt={welcomeRightSlider.title || 'Welcome Right'} 
                    className="w-32 h-32 object-contain rounded border bg-white p-2" 
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {welcomeRightSlider.title || 'Welcome Sağ Taraf Fotoğraf'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {welcomeRightSlider.isActive ? 'Aktif' : 'Pasif'}
                    </p>
                    {welcomeRightSlider.linkUrl && (
                      <p className="text-xs text-blue-500 mt-1">Link: {welcomeRightSlider.linkUrl}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEdit(welcomeRightSlider)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </Button>
                    <Button
                      onClick={() => handleDelete(welcomeRightSlider.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed rounded-lg text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground mb-4">Henüz Welcome sağ taraf fotoğrafı eklenmemiş</p>
                <Button
                  onClick={() => {
                    setFormData({
                      side: "WELCOME_RIGHT",
                      title: "",
                      imageUrl: "",
                      linkUrl: "",
                      sort: 0,
                      isActive: true
                    })
                    setEditingId(null)
                    setShowAddForm(true)
                    // Form açıldığında forma scroll yap
                    setTimeout(() => {
                      const formElement = document.getElementById('slider-form')
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }, 100)
                  }}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Fotoğraf Ekle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
