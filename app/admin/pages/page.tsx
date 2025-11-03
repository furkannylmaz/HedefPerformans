"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/app/admin/_components/admin-header"
import { ServicesPageEditor } from "./_components/services-editor"
import { AcademyPageEditor } from "./_components/academy-editor"
import { MovementTrainingPageEditor } from "./_components/movement-training-editor"
import { AboutPageEditor } from "./_components/about-editor"
import { ContactPageEditor } from "./_components/contact-editor"

export default function AdminPagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Sayfa Yönetimi</h1>
          <p className="text-gray-600 mt-2">
            Sitenin tüm sayfalarının içeriklerini düzenleyebilirsiniz.
          </p>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="services">Bireysel Hizmetler</TabsTrigger>
            <TabsTrigger value="academy">Futbol Koleji</TabsTrigger>
            <TabsTrigger value="movement-training">Temel Hareket Eğitimi</TabsTrigger>
            <TabsTrigger value="about">Hakkımızda</TabsTrigger>
            <TabsTrigger value="contact">İletişim</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServicesPageEditor />
          </TabsContent>

          <TabsContent value="academy">
            <AcademyPageEditor />
          </TabsContent>

          <TabsContent value="movement-training">
            <MovementTrainingPageEditor />
          </TabsContent>

          <TabsContent value="about">
            <AboutPageEditor />
          </TabsContent>

          <TabsContent value="contact">
            <ContactPageEditor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

