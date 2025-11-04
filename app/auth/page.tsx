"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Lock,
  User,
  Users,
  Trophy,
  Play,
  Upload,
  FileText,
} from "lucide-react";

// Swiper CSS import
import "swiper/css";
import "swiper/css/pagination";

// Login form şeması
const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

// Register form şeması - Yeni pozisyon sistemi ile
const registerSchema = z
  .object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
    birthYear: z
      .number()
      .int()
      .min(2006)
      .max(2018, "Doğum yılı 2006-2018 arasında olmalıdır"),
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
    isMartyrRelative: z.boolean().default(false),
    martyrRelativeDocument: z.instanceof(File).optional(),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, "Sözleşmeyi kabul etmelisiniz"),
  })
  .refine(
    (data) => {
      // Kaleci haricinde yedek mevki zorunlu
      if (data.mainPositionKey !== "KALECI" && !data.altPositionKey) {
        return false;
      }
      return true;
    },
    {
      message: "Kaleci haricinde yedek mevki seçimi zorunludur",
      path: ["altPositionKey"],
    }
  )
  .refine(
    (data) => {
      // Şehit yakını ise dosya zorunlu
      if (data.isMartyrRelative && !data.martyrRelativeDocument) {
        return false;
      }
      return true;
    },
    {
      message: "Şehit yakını iseniz belge yüklemelisiniz",
      path: ["martyrRelativeDocument"],
    }
  );

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

// Boş slider listesi - gerçek veriler veritabanından gelecek
const sliderImages: any[] = [];

// Pozisyon seçenekleri - Yeni sistem
const POSITIONS_7_PLUS_1 = [
  { value: "KALECI", label: "Kaleci" },
  { value: "SAG_DEF", label: "Sağ Defans" },
  { value: "STOPER", label: "Stoper" },
  { value: "SOL_DEF", label: "Sol Defans" },
  { value: "ORTA", label: "Orta Saha" },
  { value: "SAG_KANAT", label: "Sağ Kanat" },
  { value: "SOL_KANAT", label: "Sol Kanat" },
  { value: "FORVET", label: "Forvet" },
];

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
  { value: "FORVET", label: "Forvet" },
];

// Ülke seçenekleri - gerçek veriler veritabanından gelecek
const countries: any[] = [];

// İl seçenekleri - gerçek veriler veritabanından gelecek
const cities: any[] = [];

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availablePositions, setAvailablePositions] =
    useState(POSITIONS_7_PLUS_1);
  const [leftSliders, setLeftSliders] = useState<any[]>([]);
  const [rightSliders, setRightSliders] = useState<any[]>([]);

  // Slider verilerini yükle
  useEffect(() => {
    const loadSliders = async () => {
      try {
        // Sol slider'lar
        const leftResponse = await fetch("/api/sliders?side=LEFT");
        const leftData = await leftResponse.json();
        if (leftData.success) {
          setLeftSliders(leftData.data.sliders);
        }

        // Sağ slider'lar
        const rightResponse = await fetch("/api/sliders?side=RIGHT");
        const rightData = await rightResponse.json();
        if (rightData.success) {
          setRightSliders(rightData.data.sliders);
        }
      } catch (error) {
        console.error("Slider load error:", error);
      }
    };

    loadSliders();
  }, []);

  // Login form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
      isMartyrRelative: false,
      martyrRelativeDocument: undefined,
      termsAccepted: false,
    },
  });

  // Doğum yılına göre pozisyon filtreleme
  useEffect(() => {
    const subscription = registerForm.watch((value, { name }) => {
      if (name === "birthYear" && typeof value.birthYear === "number") {
        const birthYear = value.birthYear;
        if (birthYear >= 2014 && birthYear <= 2018) {
          setAvailablePositions(POSITIONS_7_PLUS_1);
        } else if (birthYear >= 2006 && birthYear <= 2013) {
          setAvailablePositions(POSITIONS_10_PLUS_1);
        }

        // Pozisyon değiştiğinde seçimleri sıfırla
        registerForm.setValue("mainPositionKey", "");
        registerForm.setValue("altPositionKey", "");
      }
    });

    return () => subscription.unsubscribe();
  }, [registerForm]);

  const onLoginSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Cookie'ye kullanıcı bilgisini kaydet
        const token = JSON.stringify({ userId: result.data.user.id });
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`; // 24 saat

        // Başarılı giriş - yönlendirme
        setTimeout(() => {
          window.location.href = result.data.redirectUrl;
        }, 100);
      } else {
        // Hata mesajı göster
        alert(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Giriş işlemi sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterForm) => {
    console.log("Register form data:", data);
    setIsLoading(true);
    try {
      let documentUrl: string | undefined = undefined;

      // Şehit yakını belgesi varsa önce yükle
      if (data.isMartyrRelative && data.martyrRelativeDocument) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", data.martyrRelativeDocument);

        const uploadResponse = await fetch("/api/auth/upload-document", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          alert(uploadResult.message || "Dosya yüklenirken bir hata oluştu");
          setIsLoading(false);
          return;
        }
        documentUrl = uploadResult.data.url;
      }

      // Kayıt verilerini hazırla
      const registerData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        birthYear: data.birthYear,
        mainPositionKey: data.mainPositionKey,
        altPositionKey: data.altPositionKey,
        country: data.country,
        city: data.city,
        district: data.district,
        phone: data.phone,
        email: data.email,
        password: data.password,
        team: data.team,
        league: data.league,
        isMartyrRelative: data.isMartyrRelative,
        martyrRelativeDocumentUrl: documentUrl,
        termsAccepted: data.termsAccepted,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();
      console.log("Register response:", result);

      if (result.success) {
        // Kullanıcı ID'sini cookie'ye kaydet
        const token = JSON.stringify({ userId: result.data.userId });
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`; // 24 saat

        // API'den gelen redirectUrl'e yönlendir (şehit yakını ise dashboard, değilse parent-info)
        window.location.href = result.data.redirectUrl || "/auth/parent-info";
      } else {
        // Hata mesajı göster - daha detaylı hata gösterimi
        if (result.errors) {
          const errorMessages = result.errors
            .map((err: any) => `${err.path.join(".")}: ${err.message}`)
            .join("\n");
          alert(`Form Validasyon Hataları:\n${errorMessages}`);
        } else {
          // API'den gelen hata mesajını göster
          console.error("Register error response:", result);
          const errorMessage = result.error || result.message || "Kayıt işlemi başarısız";
          alert(`Hata: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Kayıt işlemi sırasında bir hata oluştu");
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
            {/* Logo */}
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

            {/* Videolar Butonu */}
            <Button
              asChild
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link href="/videos" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Videolar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-center min-h-[85vh]">
          {/* Sol Slider */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-2xl blur-xl" />
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                className="rounded-2xl overflow-hidden shadow-xl h-[600px] border border-gray-200"
              >
                {leftSliders.length > 0 ? (
                  leftSliders.map((slider) => (
                    <SwiperSlide key={slider.id}>
                      {slider.linkUrl ? (
                        <a
                          href={slider.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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
                        <div className="text-center text-gray-900">
                          <h3 className="text-2xl font-bold mb-4">
                            Hedef Performans
                          </h3>
                          <p className="text-lg text-gray-600">
                            Futbol kariyerinizi geliştirin
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
          </div>

          {/* Orta - Form */}
          <div className="w-full max-w-full lg:max-w-md mx-auto lg:col-start-2 lg:col-span-1 flex flex-col lg:items-center lg:justify-center">
            {/* Mobil Başlık - Sadece mobilde görünür */}
            <div className="text-center mb-6 lg:hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 border border-red-200 mb-4">
                <Image
                  src="/logohedef.png"
                  alt="Hedef Performans Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Hedef Performans
              </h1>
              <p className="text-base sm:text-lg text-gray-600 px-4">
                Futbol kariyerinizi bir üst seviyeye taşıyın
              </p>
            </div>

            <Card className="border-gray-200 bg-white shadow-xl w-full">
              <CardHeader className="space-y-2 pb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-200 mx-auto mb-2">
                  <Trophy className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-center text-2xl text-gray-900">
                  Hesabınıza Giriş Yapın
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Üyeliğiniz varsa giriş yapın, yoksa kayıt olun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="register" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 border border-gray-200 p-1">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                    >
                      Giriş Yap
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                    >
                      Kayıt Ol
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login">
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-gray-900">
                          E-posta
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="ornek@email.com"
                            className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-red-600 focus:ring-red-600"
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
                        <Label
                          htmlFor="login-password"
                          className="text-gray-900"
                        >
                          Şifre
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 bg-gray-50 border-gray-200 text-white placeholder:text-gray-400 focus:border-red-600 focus:ring-red-600"
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

                      <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-emerald-500/70 transition-all"
                        disabled={isLoading}
                      >
                        {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                      </Button>
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
                    <form
                      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                      className="space-y-4"
                    >
                      {/* Kişisel Bilgiler */}
                      <div className="grid grid-cols-2 gap-4">
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
                            value={
                              registerForm.watch("birthYear")?.toString() || ""
                            }
                            onValueChange={(value) => {
                              const year = parseInt(value);
                              if (!isNaN(year)) {
                                registerForm.setValue("birthYear", year, {
                                  shouldValidate: true,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Doğum yılı seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(13)].map((_, i) => {
                                const year = 2006 + i;
                                return (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                  >
                                    {year}
                                  </SelectItem>
                                );
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="mainPositionKey">Ana Mevki</Label>
                          <Select
                            value={registerForm.watch("mainPositionKey")}
                            onValueChange={(value) => {
                              registerForm.setValue("mainPositionKey", value, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Ana mevki seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePositions.map((position) => (
                                <SelectItem
                                  key={position.value}
                                  value={position.value}
                                >
                                  {position.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {registerForm.formState.errors.mainPositionKey && (
                            <p className="text-sm text-destructive">
                              {
                                registerForm.formState.errors.mainPositionKey
                                  .message
                              }
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="altPositionKey">
                            Yedek Mevki (Opsiyonel)
                          </Label>
                          <Select
                            value={registerForm.watch("altPositionKey") || ""}
                            onValueChange={(value) => {
                              registerForm.setValue("altPositionKey", value, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Yedek mevki seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePositions.map((position) => (
                                <SelectItem
                                  key={position.value}
                                  value={position.value}
                                >
                                  {position.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {registerForm.formState.errors.altPositionKey && (
                            <p className="text-sm text-destructive">
                              {
                                registerForm.formState.errors.altPositionKey
                                  .message
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Konum Bilgileri */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country">Ülke</Label>
                          <Select
                            value={registerForm.watch("country")}
                            onValueChange={(value) => {
                              registerForm.setValue("country", value, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Ülke" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.length > 0 ? (
                                countries.map((country) => (
                                  <SelectItem
                                    key={country.value}
                                    value={country.value}
                                  >
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
                              registerForm.setValue("city", value, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="İl" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.length > 0 ? (
                                cities.map((city) => (
                                  <SelectItem
                                    key={city.value}
                                    value={city.value}
                                  >
                                    {city.label}
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem value="istanbul">
                                    İstanbul
                                  </SelectItem>
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
                      <div className="grid grid-cols-2 gap-4">
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

                      {/* Şehit Yakını */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isMartyrRelative"
                            checked={registerForm.watch("isMartyrRelative")}
                            onCheckedChange={(checked) => {
                              registerForm.setValue(
                                "isMartyrRelative",
                                checked as boolean
                              );
                              if (!checked) {
                                registerForm.setValue(
                                  "martyrRelativeDocument",
                                  undefined
                                );
                              }
                            }}
                          />
                          <Label htmlFor="isMartyrRelative" className="text-sm">
                            Şehit Yakını mısınız?
                          </Label>
                        </div>
                        {registerForm.watch("isMartyrRelative") && (
                          <div className="space-y-2">
                            <Label htmlFor="martyrRelativeDocument">
                              Şehit Yakını Belgesi
                            </Label>
                            <div className="relative">
                              <Input
                                id="martyrRelativeDocument"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    registerForm.setValue(
                                      "martyrRelativeDocument",
                                      file
                                    );
                                  }
                                }}
                                className="cursor-pointer"
                              />
                              {registerForm.watch("martyrRelativeDocument") && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                                  <FileText className="h-4 w-4" />
                                  {
                                    registerForm.watch("martyrRelativeDocument")
                                      ?.name
                                  }
                                </div>
                              )}
                            </div>
                            {registerForm.formState.errors
                              .martyrRelativeDocument && (
                              <p className="text-sm text-destructive">
                                {
                                  registerForm.formState.errors
                                    .martyrRelativeDocument.message
                                }
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Sözleşme Onayı */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={registerForm.watch("termsAccepted")}
                          onCheckedChange={(checked) =>
                            registerForm.setValue(
                              "termsAccepted",
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor="terms" className="text-sm">
                          <a
                            href="/terms"
                            className="text-primary hover:underline"
                          >
                            Kullanıcı sözleşmesi
                          </a>{" "}
                          ve{" "}
                          <a
                            href="/privacy"
                            className="text-primary hover:underline"
                          >
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

                      <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-emerald-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          isLoading || !registerForm.watch("termsAccepted")
                        }
                      >
                        {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Slider */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-2xl blur-xl" />
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                className="rounded-2xl overflow-hidden shadow-xl h-[600px] border border-gray-200"
              >
                {rightSliders.length > 0 ? (
                  rightSliders.map((slider) => (
                    <SwiperSlide key={slider.id}>
                      {slider.linkUrl ? (
                        <a
                          href={slider.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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
                        <div className="text-center text-gray-900">
                          <h3 className="text-2xl font-bold mb-4">
                            Hedef Performans
                          </h3>
                          <p className="text-lg text-gray-600">
                            Futbol kariyerinizi geliştirin
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
