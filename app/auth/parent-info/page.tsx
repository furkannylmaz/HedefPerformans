"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, FileText, ArrowRight } from "lucide-react";

// Veli bilgi form şeması
const parentInfoSchema = z.object({
  parentOccupationGroup: z.string().min(1, "Veli meslek grubu seçimi gereklidir"),
  parentPhone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  participationCity: z.string().min(1, "Seçmelere katılacağınız şehir seçimi gereklidir"),
  kvkkAccepted: z.boolean().refine((val) => val === true, "KVKK onayı gereklidir"),
  infoFormAccepted: z.boolean().refine((val) => val === true, "Ön Bilgilendirme Formu onayı gereklidir"),
  healthConsentAccepted: z.boolean().refine((val) => val === true, "Sağlık Onam Formu onayı gereklidir"),
  salesContractAccepted: z.boolean().refine((val) => val === true, "Mesafeli Satış Sözleşmesi onayı gereklidir"),
  playedInClubBefore: z.string().min(1, "Bu bilgi gereklidir"),
});

type ParentInfoForm = z.infer<typeof parentInfoSchema>;

// Meslek grupları (örnek - gerçek liste Türkiye futbol federasyonu verilerine göre olabilir)
const occupationGroups = [
  { value: "MEMUR", label: "Memur" },
  { value: "OGRETMEN", label: "Öğretmen" },
  { value: "DOKTOR", label: "Doktor" },
  { value: "MUHENDIS", label: "Mühendis" },
  { value: "ISCI", label: "İşçi" },
  { value: "ESNAF", label: "Esnaf" },
  { value: "ISVEREN", label: "İşveren" },
  { value: "EMEKLİ", label: "Emekli" },
  { value: "OGRENCI", label: "Öğrenci" },
  { value: "DIGER", label: "Diğer" },
];

// Şehirler (örnek)
const cities = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Kocaeli",
  "Diyarbakır",
];

export default function ParentInfoPage() {
  const [isLoading, setIsLoading] = useState(false);

  const parentInfoForm = useForm<ParentInfoForm>({
    resolver: zodResolver(parentInfoSchema),
    defaultValues: {
      parentOccupationGroup: "",
      parentPhone: "",
      participationCity: "",
      kvkkAccepted: false,
      infoFormAccepted: false,
      healthConsentAccepted: false,
      salesContractAccepted: false,
      playedInClubBefore: "",
    },
  });

  const onSubmit = async (data: ParentInfoForm) => {
    setIsLoading(true);
    try {
      // Cookie'den kullanıcı ID'sini al
      const cookies = document.cookie.split(";");
      let userId: string | null = null;
      
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "auth_token") {
          try {
            const token = JSON.parse(decodeURIComponent(value));
            userId = token.userId;
            break;
          } catch {
            // Cookie parse hatası
          }
        }
      }

      if (!userId) {
        alert("Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
        window.location.href = "/auth";
        return;
      }

      const response = await fetch("/api/auth/parent-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId,
          playedInClubBefore: data.playedInClubBefore === "EVET",
        }),
      });

      const result = await response.json();

      if (result.success) {
        // API'den gelen redirectUrl'e yönlendir (şehit yakını ise dashboard, değilse payment-method)
        window.location.href = result.data.redirectUrl || "/checkout/payment-method";
      } else {
        alert(result.message || "Veli bilgileri kaydedilemedi");
      }
    } catch (error) {
      console.error("Parent info error:", error);
      alert("Veli bilgileri kaydedilirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logohedef.png"
                alt="Hedef Performans Logo"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span className="text-lg font-bold text-gray-900">
                Hedef Performans
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-gray-200 bg-white shadow-xl">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-200 mx-auto mb-2">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-center text-2xl text-gray-900">
                Veli Bilgileri
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Türkiye futbol federasyonu veri kayıt sistemine uygun bilgi
                elde edebilme amacıyla düzenlenmiştir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={parentInfoForm.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Veli Meslek Grubu */}
                <div className="space-y-2">
                  <Label htmlFor="parentOccupationGroup">
                    Veli Meslek Grubu
                  </Label>
                  <Select
                    value={parentInfoForm.watch("parentOccupationGroup")}
                    onValueChange={(value) => {
                      parentInfoForm.setValue("parentOccupationGroup", value, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="– Seçim Yapınız –" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupationGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {parentInfoForm.formState.errors.parentOccupationGroup && (
                    <p className="text-sm text-destructive">
                      {
                        parentInfoForm.formState.errors.parentOccupationGroup
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Veli Telefon Numarası */}
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Telefon Numarası</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="parentPhone"
                      type="tel"
                      placeholder="+90 5XX XXX XX XX"
                      className="pl-10"
                      {...parentInfoForm.register("parentPhone")}
                    />
                  </div>
                  {parentInfoForm.formState.errors.parentPhone && (
                    <p className="text-sm text-destructive">
                      {parentInfoForm.formState.errors.parentPhone.message}
                    </p>
                  )}
                </div>

                {/* Katılım Bilgileri */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Katılım Bilgileri
                  </h3>

                  {/* Seçmelere Katılacağınız Şehir */}
                  <div className="space-y-2">
                    <Label htmlFor="participationCity">
                      Seçmelere Katılacağınız Şehir
                    </Label>
                    <Select
                      value={parentInfoForm.watch("participationCity")}
                      onValueChange={(value) => {
                        parentInfoForm.setValue("participationCity", value, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Şehir seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {parentInfoForm.formState.errors.participationCity && (
                      <p className="text-sm text-destructive">
                        {parentInfoForm.formState.errors.participationCity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Onaylar */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="kvkkAccepted"
                        checked={parentInfoForm.watch("kvkkAccepted")}
                        onCheckedChange={(checked) =>
                          parentInfoForm.setValue(
                            "kvkkAccepted",
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor="kvkkAccepted" className="text-sm">
                        Kişisel verilerimin{" "}
                        <a href="/kvkk" className="text-primary hover:underline">
                          KVKK
                        </a>{" "}
                        kapsamında işlenmesini kabul ediyorum.
                      </Label>
                    </div>
                    {parentInfoForm.formState.errors.kvkkAccepted && (
                      <p className="text-sm text-destructive ml-6">
                        {parentInfoForm.formState.errors.kvkkAccepted.message}
                      </p>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="infoFormAccepted"
                        checked={parentInfoForm.watch("infoFormAccepted")}
                        onCheckedChange={(checked) =>
                          parentInfoForm.setValue(
                            "infoFormAccepted",
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor="infoFormAccepted" className="text-sm">
                        <a href="/info-form" className="text-primary hover:underline">
                          Ön Bilgilendirme Formunu
                        </a>{" "}
                        okudum, onaylıyorum.
                      </Label>
                    </div>
                    {parentInfoForm.formState.errors.infoFormAccepted && (
                      <p className="text-sm text-destructive ml-6">
                        {parentInfoForm.formState.errors.infoFormAccepted.message}
                      </p>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="healthConsentAccepted"
                        checked={parentInfoForm.watch("healthConsentAccepted")}
                        onCheckedChange={(checked) =>
                          parentInfoForm.setValue(
                            "healthConsentAccepted",
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor="healthConsentAccepted" className="text-sm">
                        <a href="/health-consent" className="text-primary hover:underline">
                          Sağlık Onam Formunu
                        </a>{" "}
                        okudum, onaylıyorum.
                      </Label>
                    </div>
                    {parentInfoForm.formState.errors.healthConsentAccepted && (
                      <p className="text-sm text-destructive ml-6">
                        {
                          parentInfoForm.formState.errors.healthConsentAccepted
                            .message
                        }
                      </p>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="salesContractAccepted"
                        checked={parentInfoForm.watch("salesContractAccepted")}
                        onCheckedChange={(checked) =>
                          parentInfoForm.setValue(
                            "salesContractAccepted",
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor="salesContractAccepted" className="text-sm">
                        <a href="/sales-contract" className="text-primary hover:underline">
                          Mesafeli Satış Sözleşmesini
                        </a>{" "}
                        okudum, onaylıyorum.
                      </Label>
                    </div>
                    {parentInfoForm.formState.errors.salesContractAccepted && (
                      <p className="text-sm text-destructive ml-6">
                        {
                          parentInfoForm.formState.errors.salesContractAccepted
                            .message
                        }
                      </p>
                    )}
                  </div>
                </div>

                {/* Daha Önce Bir Kulüpte Oynadı Mı */}
                <div className="space-y-2">
                  <Label htmlFor="playedInClubBefore">
                    Daha Önce Bir Kulüpte Oynadı Mı
                  </Label>
                  <Select
                    value={parentInfoForm.watch("playedInClubBefore")}
                    onValueChange={(value) => {
                      parentInfoForm.setValue("playedInClubBefore", value, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="– Seçim Yapın –" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EVET">Evet</SelectItem>
                      <SelectItem value="HAYIR">Hayır</SelectItem>
                    </SelectContent>
                  </Select>
                  {parentInfoForm.formState.errors.playedInClubBefore && (
                    <p className="text-sm text-destructive">
                      {parentInfoForm.formState.errors.playedInClubBefore.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-red-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Kaydediliyor..."
                  ) : (
                    <>
                      Devam Et
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

