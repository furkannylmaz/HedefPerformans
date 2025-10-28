"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Calendar, MapPin, Phone, Mail, Lock, User, Users, Trophy, Play } from "lucide-react"

// Swiper CSS import
import "swiper/css"
import "swiper/css/pagination"

// Login form şeması
const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır")
})

// Register form şeması - Yeni pozisyon sistemi ile
const registerSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  birthYear: z.number().int().min(2006).max(2018, "Doğum yılı 2006-2018 arasında olmalıdır"),
  mainPositionKey: z.string().min(1, "Ana mevki seçimi gereklidir"),
  altPositionKey: z.string().optional(),
  country: z.string().min(1, "Ülke seçimi gereklidir"),
  city: z.string().min(1, "İl seçimi gereklidir"),
  district: z.string().min(1, "İlçe seçimi gereklidir"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  team: z.string().optional(),
  league: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, "Sözleşmeyi kabul etmelisiniz")
}).refine((data) => {
  // Kaleci haricinde yedek mevki zorunlu
  if (data.mainPositionKey !== "KALECI" && !data.altPositionKey) {
    return false
  }
  return true
}, {
  message: "Kaleci haricinde yedek mevki seçimi zorunludur",
  path: ["altPositionKey"]
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

// Boş slider listesi - gerçek veriler veritabanından gelecek
const sliderImages: any[] = []

// Pozisyon seçenekleri - Yeni sistem
const POSITIONS_7_PLUS_1 = [
  { value: "KALECI", label: "Kaleci" },
  { value: "SAG_DEF", label: "Sağ Defans" },
  { value: "STOPER", label: "Stoper" },
  { value: "SOL_DEF", label: "Sol Defans" },
  { value: "ORTA", label: "Orta Saha" },
  { value: "SAG_KANAT", label: "Sağ Kanat" },
  { value: "SOL_KANAT", label: "Sol Kanat" },
  { value: "FORVET", label: "Forvet" }
]

const POSITIONS_10_PLUS_1 = [
  { value: "KALECI", label: "Kaleci" },
  { value: "SAGBEK", label: "Sağbek" },
  { value: "SAG_STOPER", label: "Sağ Stoper" },
  { value: "SOL_STOPER", label: "Sol Stoper" },
  { value: "SOLBEK", label: "Solbek" },
  { value: "ONLIBERO", label: "Önlibero" },
  { value: "ORTA_8", label: "Orta Saha 8" },
  { value: "ORTA_10", label: "Orta Saha 10" },
  { value: "SAG_KANAT", label: "Sağ Kanat" },
  { value: "SOL_KANAT", label: "Sol Kanat" },
  { value: "FORVET", label: "Forvet" }
]

// Ülke seçenekleri - gerçek veriler veritabanından gelecek
const countries: any[] = []

// İl seçenekleri - gerçek veriler veritabanından gelecek  
const cities: any[] = []

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [availablePositions, setAvailablePositions] = useState(POSITIONS_7_PLUS_1)
  const [leftSliders, setLeftSliders] = useState<any[]>([])
  const [rightSliders, setRightSliders] = useState<any[]>([])

  // Slider verilerini yükle
  useEffect(() => {
    const loadSliders = async () => {
      try {
        // Sol slider'lar
        const leftResponse = await fetch('/api/sliders?side=LEFT')
        const leftData = await leftResponse.json()
        if (leftData.success) {
          setLeftSliders(leftData.data.sliders)
        }

        // Sağ slider'lar
        const rightResponse = await fetch('/api/sliders?side=RIGHT')
        const rightData = await rightResponse.json()
        if (rightData.success) {
          setRightSliders(rightData.data.sliders)
        }
      } catch (error) {
        console.error("Slider load error:", error)
      }
    }

    loadSliders()
  }, [])

  // Login form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  // Register form
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthYear: 2010,
      mainPositionKey: "",
      altPositionKey: "",
      country: "",
      city: "",
      district: "",
      phone: "",
      email: "",
      password: "",
      team: "",
      league: "",
      termsAccepted: false
    }
  })

  // Doğum yılına göre pozisyon filtreleme
  useEffect(() => {
    const subscription = registerForm.watch((value, { name }) => {
      if (name === "birthYear" && typeof value.birthYear === 'number') {
        const birthYear = value.birthYear
        if (birthYear >= 2014 && birthYear <= 2018) {
          setAvailablePositions(POSITIONS_7_PLUS_1)
        } else if (birthYear >= 2006 && birthYear <= 2013) {
          setAvailablePositions(POSITIONS_10_PLUS_1)
        }
        
        // Pozisyon değiştiğinde seçimleri sıfırla
        registerForm.setValue("mainPositionKey", "")
        registerForm.setValue("altPositionKey", "")
      }
    })
    
    return () => subscription.unsubscribe()
  }, [registerForm])

  const onLoginSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        // Cookie'ye kullanıcı bilgisini kaydet
        const token = JSON.stringify({ userId: result.data.user.id })
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax` // 24 saat
        
        // Başarılı giriş - yönlendirme
        setTimeout(() => {
          window.location.href = result.data.redirectUrl
        }, 100)
      } else {
        // Hata mesajı göster
        alert(result.message)
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Giriş işlemi sırasında bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const onRegisterSubmit = async (data: RegisterForm) => {
    console.log("Register form data:", data)
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("Register response:", result)

      if (result.success) {
        // Kullanıcı ID'sini cookie'ye kaydet
        const token = JSON.stringify({ userId: result.data.userId })
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax` // 24 saat
        
        // Başarılı kayıt - ödeme yöntemi sayfasına yönlendir
        window.location.href = "/checkout/payment-method"
      } else {
        // Hata mesajı göster
        alert(result.message || "Kayıt işlemi başarısız")
      }
    } catch (error) {
      console.error("Register error:", error)
      alert("Kayıt işlemi sırasında bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-turf-bg">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-turf-border sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/logo.jpeg" 
                alt="Hedef Performans" 
                width={120} 
                height={40}
                className="object-contain"
                priority
              />
            </Link>
            
            {/* Videolar Butonu */}
            <Button asChild variant="outline" size="lg">
              <Link href="/videos" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Videolar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-screen grid lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6 py-8">
          {/* Sol Slider */}
          <div className="hidden lg:block">
            <Card className="rounded-xl border-turf-border bg-white shadow-sm p-4 md:p-6">
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                className="h-[500px]"
              >
                {leftSliders.length > 0 ? (
                  leftSliders.map((slider) => (
                    <SwiperSlide key={slider.id}>
                      {slider.linkUrl ? (
                        <a href={slider.linkUrl} target="_blank" rel="noopener noreferrer">
                          <div className="relative w-full h-full">
                            <Image
                              src={slider.imageUrl}
                              alt={slider.title || "Hedef Performans"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </a>
                      ) : (
                        <div className="relative w-full h-full">
                          <Image
                            src={slider.imageUrl}
                            alt={slider.title || "Hedef Performans"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-accent/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h3 className="text-2xl font-bold mb-4">Hedef Performans</h3>
                          <p className="text-lg opacity-80">Futbol kariyerinizi geliştirin</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </Card>
          </div>

          {/* Orta - Form */}
          <div className="w-full">
            <Card className="rounded-xl border-turf-border bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-center">Hesabınıza Giriş Yapın</CardTitle>
                <CardDescription className="text-center">
                  Üyeliğiniz varsa giriş yapın, yoksa kayıt olun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="register" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                    <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
                  </TabsList>
                  
                  {/* Login Tab */}
                  <TabsContent value="login">
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">E-posta</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="ornek@email.com"
                            className="pl-10"
                            {...loginForm.register("email")}
                          />
                        </div>
                        {loginForm.formState.errors.email && (
                          <p className="text-sm text-destructive">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Şifre</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            {...loginForm.register("password")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-destructive">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-neon-green text-black hover:bg-[#26ff96]" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  {/* Register Tab */}
                  <TabsContent value="register">
                    {Object.keys(registerForm.formState.errors).length > 0 && (
                      <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">
                          Lütfen form alanlarındaki hataları düzeltin
                        </p>
                      </div>
                    )}
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      {/* Kişisel Bilgiler */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Ad</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="firstName"
                              placeholder="Adınız"
                              className="pl-10"
                              {...registerForm.register("firstName")}
                            />
                          </div>
                          {registerForm.formState.errors.firstName && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.firstName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Soyad</Label>
                          <Input
                            id="lastName"
                            placeholder="Soyadınız"
                            {...registerForm.register("lastName")}
                          />
                          {registerForm.formState.errors.lastName && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthYear">Doğum Yılı</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                          <Select 
                            value={registerForm.watch("birthYear")?.toString() || ""}
                            onValueChange={(value) => {
                              const year = parseInt(value)
                              if (!isNaN(year)) {
                                registerForm.setValue("birthYear", year, { shouldValidate: true })
                              }
                            }}
                          >
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Doğum yılı seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(13)].map((_, i) => {
                                const year = 2006 + i
                                return (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        {registerForm.formState.errors.birthYear && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.birthYear.message}
                          </p>
                        )}
                      </div>

                      {/* Mevki Bilgileri */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="mainPositionKey">Ana Mevki</Label>
                          <Select 
                            value={registerForm.watch("mainPositionKey")} 
                            onValueChange={(value) => {
                              registerForm.setValue("mainPositionKey", value, { shouldValidate: true })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Ana mevki seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePositions.map((position) => (
                                <SelectItem key={position.value} value={position.value}>
                                  {position.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {registerForm.formState.errors.mainPositionKey && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.mainPositionKey.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="altPositionKey">Yedek Mevki (Opsiyonel)</Label>
                          <Select 
                            value={registerForm.watch("altPositionKey") || ""} 
                            onValueChange={(value) => {
                              registerForm.setValue("altPositionKey", value, { shouldValidate: true })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Yedek mevki seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePositions.map((position) => (
                                <SelectItem key={position.value} value={position.value}>
                                  {position.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {registerForm.formState.errors.altPositionKey && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.altPositionKey.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Konum Bilgileri */}
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country">Ülke</Label>
                          <Select 
                            value={registerForm.watch("country")} 
                            onValueChange={(value) => {
                              registerForm.setValue("country", value, { shouldValidate: true })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Ülke" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.length > 0 ? (
                                countries.map((country) => (
                                  <SelectItem key={country.value} value={country.value}>
                                    {country.label}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="TR">Türkiye</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          {registerForm.formState.errors.country && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.country.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">İl</Label>
                          <Select 
                            value={registerForm.watch("city")} 
                            onValueChange={(value) => {
                              registerForm.setValue("city", value, { shouldValidate: true })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="İl" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.length > 0 ? (
                                cities.map((city) => (
                                  <SelectItem key={city.value} value={city.value}>
                                    {city.label}
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem value="istanbul">İstanbul</SelectItem>
                                  <SelectItem value="ankara">Ankara</SelectItem>
                                  <SelectItem value="izmir">İzmir</SelectItem>
                                  <SelectItem value="bursa">Bursa</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          {registerForm.formState.errors.city && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.city.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="district">İlçe</Label>
                          <Input
                            id="district"
                            placeholder="İlçe"
                            {...registerForm.register("district")}
                          />
                          {registerForm.formState.errors.district && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.district.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* İletişim Bilgileri */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+90 5XX XXX XX XX"
                            className="pl-10"
                            {...registerForm.register("phone")}
                          />
                        </div>
                        {registerForm.formState.errors.phone && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">E-posta</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-email"
                type="email"
                placeholder="ornek@email.com"
                            className="pl-10"
                            {...registerForm.register("email")}
                          />
                        </div>
                        {registerForm.formState.errors.email && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">Şifre</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            {...registerForm.register("password")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                        {registerForm.formState.errors.password && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Opsiyonel Bilgiler */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="team">Takım (Opsiyonel)</Label>
                          <Input
                            id="team"
                            placeholder="Takım adı"
                            {...registerForm.register("team")}
              />
            </div>
            
                        <div className="space-y-2">
                          <Label htmlFor="league">Lig (Opsiyonel)</Label>
                          <Input
                            id="league"
                            placeholder="Lig adı"
                            {...registerForm.register("league")}
                          />
                        </div>
                      </div>

                      {/* Sözleşme Onayı */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={registerForm.watch("termsAccepted")}
                          onCheckedChange={(checked) => registerForm.setValue("termsAccepted", checked as boolean)}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          <a href="/terms" className="text-primary hover:underline">
                            Kullanıcı sözleşmesi
                          </a>{" "}
                          ve{" "}
                          <a href="/privacy" className="text-primary hover:underline">
                            gizlilik politikası
                          </a>{" "}
                          şartlarını kabul ediyorum
                        </Label>
                      </div>
                      {registerForm.formState.errors.termsAccepted && (
                        <p className="text-sm text-destructive">
                          {registerForm.formState.errors.termsAccepted.message}
                        </p>
                      )}

                      <div className="mt-auto pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-neon-green text-black hover:bg-[#26ff96]" 
                          disabled={isLoading || !registerForm.watch("termsAccepted")}
                        >
                          {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Slider */}
          <div className="hidden lg:block">
            <Card className="rounded-xl border-turf-border bg-white shadow-sm p-4 md:p-6">
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                className="h-[500px]"
              >
                {rightSliders.length > 0 ? (
                  rightSliders.map((slider) => (
                    <SwiperSlide key={slider.id}>
                      {slider.linkUrl ? (
                        <a href={slider.linkUrl} target="_blank" rel="noopener noreferrer">
                          <div className="relative w-full h-full">
                            <Image
                              src={slider.imageUrl}
                              alt={slider.title || "Hedef Performans"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </a>
                      ) : (
                        <div className="relative w-full h-full">
                          <Image
                            src={slider.imageUrl}
                            alt={slider.title || "Hedef Performans"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-accent/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h3 className="text-2xl font-bold mb-4">Hedef Performans</h3>
                          <p className="text-lg opacity-80">Futbol kariyerinizi geliştirin</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
