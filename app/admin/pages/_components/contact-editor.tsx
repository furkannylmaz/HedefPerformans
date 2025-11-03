"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { ContactPageContent, defaultContactPageContent } from "@/lib/pages-content"
import { CONTACT_PAGE_KEY } from "@/lib/site-settings"

const API_ENDPOINT = "/api/admin/pages"

export function ContactPageEditor() {
  const [content, setContent] = useState<ContactPageContent>(defaultContactPageContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_ENDPOINT}?key=${CONTACT_PAGE_KEY}`)
        const data = await response.json()

        if (data.success && data.data) {
          setContent(data.data as ContactPageContent)
        }
      } catch (error) {
        console.error("[ContactPageEditor] fetch error", error)
        toast.error("İçerik yüklenirken bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: CONTACT_PAGE_KEY,
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
      console.error("[ContactPageEditor] save error", error)
      toast.error("Kayıt sırasında bir hata oluştu")
    } finally {
      setSaving(false)
    }
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
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, title: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label>Alt Başlık</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subtitle: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label>Açıklama</Label>
            <Textarea
              value={content.hero.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, description: e.target.value },
                }))
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">İletişim Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>E-posta</Label>
            <Input
              type="email"
              value={content.contact.email}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, email: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label>Telefon</Label>
            <Input
              type="tel"
              value={content.contact.phone}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, phone: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label>Adres</Label>
            <Textarea
              value={content.contact.address}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, address: e.target.value },
                }))
              }
              rows={3}
            />
          </div>
          <div>
            <Label>WhatsApp (Opsiyonel)</Label>
            <Input
              type="tel"
              value={content.contact.whatsapp || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, whatsapp: e.target.value },
                }))
              }
              placeholder="WhatsApp numarası"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Settings */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Form Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Form Başlığı</Label>
            <Input
              value={content.form.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  form: { ...prev.form, title: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label>Form Açıklaması</Label>
            <Textarea
              value={content.form.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  form: { ...prev.form, description: e.target.value },
                }))
              }
              rows={2}
            />
          </div>
          <div>
            <Label>Gönder Butonu Metni</Label>
            <Input
              value={content.form.submitButton}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  form: { ...prev.form, submitButton: e.target.value },
                }))
              }
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-gray-900">Form Alanları</h3>
            
            <div className="space-y-2">
              <Label>Ad Soyad Alanı</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={content.form.fields.name.label}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        fields: {
                          ...prev.form.fields,
                          name: { ...prev.form.fields.name, label: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Label"
                />
                <Input
                  value={content.form.fields.name.placeholder}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        fields: {
                          ...prev.form.fields,
                          name: { ...prev.form.fields.name, placeholder: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Placeholder"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>E-posta Alanı</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={content.form.fields.email.label}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        fields: {
                          ...prev.form.fields,
                          email: { ...prev.form.fields.email, label: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Label"
                />
                <Input
                  value={content.form.fields.email.placeholder}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        fields: {
                          ...prev.form.fields,
                          email: { ...prev.form.fields.email, placeholder: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Placeholder"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Telefon Alanı</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={content.form.fields.phone.label}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        fields: {
                          ...prev.form.fields,
                          phone: { ...prev.form.fields.phone, label: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Label"
                />
                <Input
                  value={content.form.fields.phone.placeholder}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        fields: {
                          ...prev.form.fields,
                          phone: { ...prev.form.fields.phone, placeholder: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Placeholder"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Konu Alanı</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={content.form.fields.subject.label}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        fields: {
                          ...prev.form.fields,
                          subject: { ...prev.form.fields.subject, label: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Label"
                />
                <Input
                  value={content.form.fields.subject.placeholder}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        fields: {
                          ...prev.form.fields,
                          subject: { ...prev.form.fields.subject, placeholder: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Placeholder"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mesaj Alanı</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={content.form.fields.message.label}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        fields: {
                          ...prev.form.fields,
                          message: { ...prev.form.fields.message, label: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Label"
                />
                <Input
                  value={content.form.fields.message.placeholder}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        fields: {
                          ...prev.form.fields,
                          message: { ...prev.form.fields.message, placeholder: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Placeholder"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Settings */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Harita Ayarları (Opsiyonel)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Harita Embed URL</Label>
            <Input
              value={content.map?.embedUrl || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  map: { embedUrl: e.target.value },
                }))
              }
              placeholder="Google Maps embed URL"
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
