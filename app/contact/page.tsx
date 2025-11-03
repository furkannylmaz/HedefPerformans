"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { useContactPageContent } from "@/hooks/use-contact-page-content"
import { toast } from "sonner"

export default function ContactPage() {
  const content = useContactPageContent()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: API endpoint'e gönder
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Mesajınız başarıyla gönderildi!")
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast.error("Mesaj gönderilirken bir hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      {/* Hero Section */}
      <section 
        className="relative py-20 px-6 sm:px-8 lg:px-12"
        style={{
          backgroundImage: content.hero.backgroundImage 
            ? `linear-gradient(to bottom right, rgba(239, 68, 68, 0.1), rgba(255, 255, 255, 0.8), rgba(239, 68, 68, 0.1)), url(${content.hero.backgroundImage})`
            : undefined,
          backgroundColor: !content.hero.backgroundImage ? '#fef2f2' : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-4">
              {content.hero.subtitle}
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {content.hero.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
              <div className="space-y-6">
                <Card className="bg-white border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-red-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">E-posta</h3>
                        <a
                          href={`mailto:${content.contact.email}`}
                          className="text-gray-600 hover:text-red-600"
                        >
                          {content.contact.email}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-red-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                        <a
                          href={`tel:${content.contact.phone}`}
                          className="text-gray-600 hover:text-red-600"
                        >
                          {content.contact.phone}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-red-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Adres</h3>
                        <p className="text-gray-600">{content.contact.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                  {content.form.title}
                </CardTitle>
                <CardDescription>{content.form.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{content.form.fields.name.label}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={content.form.fields.name.placeholder}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{content.form.fields.email.label}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={content.form.fields.email.placeholder}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{content.form.fields.phone.label}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={content.form.fields.phone.placeholder}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">{content.form.fields.subject.label}</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={content.form.fields.subject.placeholder}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">{content.form.fields.message.label}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={content.form.fields.message.placeholder}
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-red-600 text-white hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Gönderiliyor..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {content.form.submitButton}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

