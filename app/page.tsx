import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  Atom,
  Brain,
  Dumbbell,
  HeartPulse,
  LogIn,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserPlus,
  Users2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getHomepageContent,
  getSiteInfo,
  getBanners,
  getWelcomeRightImage,
} from "@/lib/site-settings";
import { IconKey } from "@/lib/homepage-content";
import { SiteHeader } from "@/components/site-header";

const iconMap: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  target: Target,
  users: Users2,
  shield: ShieldCheck,
  sparkles: Sparkles,
  activity: Activity,
  dumbbell: Dumbbell,
  brain: Brain,
  heart: HeartPulse,
  atom: Atom,
};

function IconRenderer({
  icon,
  className,
}: {
  icon: IconKey;
  className?: string;
}) {
  const IconComponent = iconMap[icon] ?? Sparkles;
  return <IconComponent className={className} />;
}

export default async function HomePage() {
  const [
    content,
    siteInfo,
    leftBanners,
    rightBanners,
    mainBanners,
    welcomeRightImage,
  ] = await Promise.all([
    getHomepageContent(),
    getSiteInfo(),
    getBanners("LEFT"),
    getBanners("RIGHT"),
    getBanners("MAIN"),
    getWelcomeRightImage(),
  ]);

  // MAIN banner'ları pozisyonlarına göre ayır
  const mainLeftBanner = mainBanners.find((b) => b.sort === 0);
  const mainRightTopBanner = mainBanners.find((b) => b.sort === 1);
  const mainRightBottomBanner = mainBanners.find((b) => b.sort === 2);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <SiteHeader />

      {/* Main Banner - 3 Bölümlü */}
      {mainBanners.length > 0 && (
        <section className="w-full bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 lg:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[300px] sm:h-[400px] lg:h-[600px]">
              {/* Sol Büyük Bölüm - 60% */}
              {mainLeftBanner && (
                <Link
                  href={mainLeftBanner.linkUrl || "#"}
                  className="lg:col-span-7 relative group overflow-hidden rounded-xl lg:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative w-full h-full min-h-[300px] lg:min-h-0">
                    <Image
                      src={mainLeftBanner.imageUrl}
                      alt={mainLeftBanner.title || "Banner"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={mainLeftBanner.imageUrl.startsWith("http")}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {mainLeftBanner.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                          {mainLeftBanner.title}
                        </h3>
                      </div>
                    )}
                  </div>
                </Link>
              )}

              {/* Sağ Bölüm - 40% - İki parça */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Sağ Üst Bölüm */}
                {mainRightTopBanner && (
                  <Link
                    href={mainRightTopBanner.linkUrl || "#"}
                    className="flex-1 relative group overflow-hidden rounded-xl lg:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[140px] sm:min-h-[180px] lg:min-h-0"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={mainRightTopBanner.imageUrl}
                        alt={mainRightTopBanner.title || "Banner"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={mainRightTopBanner.imageUrl.startsWith(
                          "http"
                        )}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      {mainRightTopBanner.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
                          <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                            {mainRightTopBanner.title}
                          </h4>
                        </div>
                      )}
                    </div>
                  </Link>
                )}

                {/* Sağ Alt Bölüm */}
                {mainRightBottomBanner && (
                  <Link
                    href={mainRightBottomBanner.linkUrl || "#"}
                    className="flex-1 relative group overflow-hidden rounded-xl lg:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[140px] sm:min-h-[180px] lg:min-h-0"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={mainRightBottomBanner.imageUrl}
                        alt={mainRightBottomBanner.title || "Banner"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={mainRightBottomBanner.imageUrl.startsWith(
                          "http"
                        )}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      {mainRightBottomBanner.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
                          <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                            {mainRightBottomBanner.title}
                          </h4>
                        </div>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Sol Banner - Desktop'ta göster */}
            {leftBanners.length > 0 && (
              <div className="hidden lg:block lg:col-span-2">
                <div className="space-y-4">
                  {leftBanners.map((banner) => (
                    <Link
                      key={banner.id}
                      href={banner.linkUrl || "#"}
                      className="block relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
                    >
                      <div className="relative aspect-[9/16] w-full">
                        <Image
                          src={banner.imageUrl}
                          alt={banner.title || "Banner"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized={banner.imageUrl.startsWith("http")}
                        />
                      </div>
                      {banner.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-white text-sm font-medium">
                            {banner.title}
                          </p>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Orta - Ana içerik */}
            <div
              className={`space-y-8 ${
                leftBanners.length > 0 ? "lg:col-span-6" : "lg:col-span-8"
              } ${leftBanners.length === 0 ? "lg:ml-0" : ""}`}
            >
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm uppercase tracking-widest text-red-600 font-semibold">
                {content.hero.badge}
              </span>
              <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                {content.hero.title}{" "}
                <span className="text-red-600">{content.hero.highlight}</span>
              </h1>
              <p className="text-lg text-gray-600 sm:text-xl max-w-3xl">
                {content.hero.description}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-base font-semibold bg-red-600 hover:bg-red-700 text-white"
                >
                  <Link href={content.hero.primaryCtaLink}>
                    <ArrowRight className="mr-2 h-5 w-5" />
                    {content.hero.primaryCtaLabel}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-gray-300 bg-white px-8 text-base text-gray-700 hover:bg-gray-50"
                >
                  <Link href={content.hero.secondaryCtaLink}>
                    {content.hero.secondaryCtaLabel}
                  </Link>
                </Button>
              </div>
              <p className="max-w-3xl text-sm text-gray-500 lg:text-base">
                {content.hero.statsNote}
              </p>
              <div className="grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-3">
                {content.stats.map((stat) => (
                  <div key={stat.id} className="space-y-1">
                    <div className="text-3xl font-semibold text-red-600 md:text-4xl">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium uppercase tracking-wide text-gray-700">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <p className="text-sm text-gray-500">
                        {stat.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ Taraf Görseli - Desktop'ta göster */}
            {welcomeRightImage && (
              <div
                className={`xs:block relative ${
                  leftBanners.length > 0 ? "lg:col-span-4" : "lg:col-span-4"
                }`}
              >
                <div className="sticky top-24 flex items-center justify-start h-full min-h-[500px] pl-4">
                  <div className="relative w-full max-w-sm">
                    <Image
                      src={welcomeRightImage}
                      alt="Sağ Taraf Görseli"
                      width={300}
                      height={700}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto space-y-12 px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {content.features.title}
            </h2>
            <p className="text-lg text-gray-600">
              {content.features.description}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {content.features.items.map((feature) => (
              <div
                key={feature.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-red-200 hover:shadow-xl hover:shadow-red-100 hover:-translate-y-1"
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at top right, rgba(220,38,38,0.05), transparent 55%)",
                  }}
                />
                <div className="relative z-10 space-y-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                    <IconRenderer icon={feature.icon} className="h-6 w-6" />
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-white py-20">
        <div className="container mx-auto space-y-12 px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {content.programs.title}
              </h2>
              <p className="text-lg text-gray-600">
                {content.programs.description}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-11 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              <Link href="#media">Sahadan Görüntüler</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {content.programs.items.map((program) => (
              <article
                key={program.id}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className="h-56 w-full bg-cover bg-center relative transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.1), rgba(0,0,0,0.4)), url(${program.imageUrl})`,
                  }}
                />
                <div className="space-y-4 p-6">
                  <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600 group-hover:bg-red-100 transition-colors">
                    {program.badge}
                  </span>
                  <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-sm text-gray-600">{program.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto space-y-12 px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {content.technology.title}
              </h2>
              <p className="text-lg text-gray-600">
                {content.technology.description}
              </p>
              <Button
                asChild
                size="lg"
                className="h-11 w-fit bg-red-600 text-white hover:bg-red-700"
              >
                <Link href={content.hero.primaryCtaLink}>
                  Deneme Seansı Planla
                </Link>
              </Button>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {content.technology.items.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 md:flex-row md:items-start shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-200"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                    <IconRenderer icon={item.icon} className="h-7 w-7" />
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories / Başarı Hikayeleri */}
      <section className="bg-gradient-to-br from-red-50 via-white to-gray-50 py-20">
        <div className="container mx-auto space-y-12 px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Başarı Hikayeleri
            </h2>
            <p className="text-lg text-gray-600">
              Sporcularımızın profesyonel kariyerlerindeki başarılarını ve
              gelişim yolculuklarını keşfedin.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Başarı Kartları */}
            {[
              {
                id: "success-1",
                name: "Yetenek Keşfi",
                description:
                  "Akademimizden mezun olan genç yetenekler profesyonel takımlarla sözleşme imzalıyor.",
                stat: "50+",
                statLabel: "Profesyonel Sözleşme",
                icon: "trophy",
              },
              {
                id: "success-2",
                name: "Milli Takım Yolu",
                description:
                  "Eğitmenlerimizle çalışan sporcularımız milli takım seviyesine yükseliyor.",
                stat: "15+",
                statLabel: "Milli Takım Çağrısı",
                icon: "target",
              },
              {
                id: "success-3",
                name: "Sürekli Gelişim",
                description:
                  "Her seviyede sporcuya özel antrenman programlarıyla performans artışı sağlıyoruz.",
                stat: "95%",
                statLabel: "Performans Artışı",
                icon: "activity",
              },
            ].map((story) => (
              <div
                key={story.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                      <IconRenderer
                        icon={story.icon as IconKey}
                        className="h-7 w-7"
                      />
                    </span>
                    <div>
                      <div className="text-3xl font-bold text-red-600">
                        {story.stat}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {story.statLabel}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {story.name}
                  </h3>
                  <p className="text-sm text-gray-600">{story.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Events / Haberler ve Etkinlikler */}
      <section className="bg-white py-20">
        <div className="container mx-auto space-y-12 px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Haberler ve Etkinlikler
              </h2>
              <p className="text-lg text-gray-600">
                Son duyurularımız, kampanyalarımız ve özel etkinliklerimizden
                haberdar olun.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-11 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              <Link href="#media">Tüm Haberler</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "news-1",
                title: "Yaz Dönemi Kayıtları Başladı",
                description:
                  "2024-2025 sezonu için kayıtlarımız açıldı. Sınırlı kontenjan ile erken kayıt avantajlarından yararlanın.",
                date: "15 Nisan 2024",
                badge: "Yeni",
                image:
                  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
              },
              {
                id: "news-2",
                title: "Özel Turnuva Etkinliği",
                description:
                  "Akademi içi turnuva ile sporcularımız kendilerini geliştirme fırsatı buluyor.",
                date: "20 Nisan 2024",
                badge: "Etkinlik",
                image:
                  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
              },
              {
                id: "news-3",
                title: "Uzman Eğitmen Seminerleri",
                description:
                  "UEFA lisanslı eğitmenlerimiz ile özel teknik ve taktik seminerleri düzenleniyor.",
                date: "25 Nisan 2024",
                badge: "Eğitim",
                image:
                  "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop",
              },
            ].map((news) => (
              <article
                key={news.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${news.image})` }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                      {news.badge}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 p-6">
                  <div className="text-sm text-gray-500">{news.date}</div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-600">{news.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="container mx-auto space-y-10 px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {content.testimonials.title}
            </h2>
            <p className="text-lg text-gray-600">
              {content.testimonials.description}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.testimonials.items.map((item) => (
              <figure
                key={item.id}
                className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute right-6 top-6 h-8 w-8 rounded-full border border-red-200 text-red-600 flex items-center justify-center">
                  <span className="text-xl">"</span>
                </div>
                <blockquote className="text-sm text-gray-600 pr-8">
                  "{item.quote}"
                </blockquote>
                <figcaption className="mt-6 space-y-1">
                  <div className="text-base font-semibold text-gray-900">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-500">{item.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Media - Sahadan Anlar */}
      <section
        id="media"
        className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20"
      >
        <div className="container mx-auto space-y-12 px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {content.media.title}
            </h2>
            <p className="text-lg text-gray-600">{content.media.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Video Bölümü */}
            {content.media.videoUrl && (
              <div className="lg:col-span-7 space-y-4">
                <div className="aspect-video overflow-hidden rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <iframe
                    src={content.media.videoUrl}
                    title="Hedef Performans"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Galeri Bölümü */}
            <div
              className={`grid gap-4 ${
                content.media.videoUrl ? "lg:col-span-5" : "lg:col-span-12"
              } ${
                content.media.videoUrl ? "lg:grid-cols-1" : "lg:grid-cols-3"
              }`}
            >
              {content.media.gallery.map((image, idx) => (
                <div
                  key={`${image}-${idx}`}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="h-48 lg:h-64 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-red-600 to-red-700">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${content.cta.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {content.cta.title}
              </h2>
              <p className="text-lg text-white/90">{content.cta.description}</p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-base font-semibold bg-white text-red-600 hover:bg-gray-100"
                >
                  <Link href={content.cta.primaryCtaLink}>
                    {content.cta.primaryCtaLabel}
                  </Link>
                </Button>
                {content.cta.secondaryCtaLabel &&
                  content.cta.secondaryCtaLink && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-12 border-white/40 bg-white/10 px-8 text-base text-white backdrop-blur hover:bg-white/20"
                    >
                      <Link href={content.cta.secondaryCtaLink}>
                        {content.cta.secondaryCtaLabel}
                      </Link>
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto space-y-10 px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Hedef Performans
              </h3>
              <p className="text-sm text-gray-600">{siteInfo.headline}</p>
              <p className="text-sm text-gray-500">{siteInfo.description}</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Platform
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/videos"
                    className="transition hover:text-red-600"
                  >
                    Videolar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/matches"
                    className="transition hover:text-red-600"
                  >
                    Maç Analizleri
                  </Link>
                </li>
                <li>
                  <Link
                    href={content.hero.primaryCtaLink}
                    className="transition hover:text-red-600"
                  >
                    Başvuru Yap
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                İletişim
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>{siteInfo.email}</li>
                <li>{siteInfo.phone}</li>
                <li>{siteInfo.address}</li>
              </ul>
              {siteInfo.whatsapp && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-red-200 bg-white text-red-600 hover:bg-red-50"
                >
                  <Link href={siteInfo.whatsapp} target="_blank">
                    WhatsApp İletişim
                  </Link>
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Sosyal Medya
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {siteInfo.socials.instagram && (
                  <li>
                    <Link
                      href={siteInfo.socials.instagram}
                      target="_blank"
                      className="transition hover:text-red-600"
                    >
                      Instagram
                    </Link>
                  </li>
                )}
                {siteInfo.socials.youtube && (
                  <li>
                    <Link
                      href={siteInfo.socials.youtube}
                      target="_blank"
                      className="transition hover:text-red-600"
                    >
                      YouTube
                    </Link>
                  </li>
                )}
                {siteInfo.socials.tiktok && (
                  <li>
                    <Link
                      href={siteInfo.socials.tiktok}
                      target="_blank"
                      className="transition hover:text-red-600"
                    >
                      TikTok
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Hedef Performans. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
