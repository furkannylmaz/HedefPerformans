// Sayfa içerikleri için tip tanımlamaları

export interface ServiceItem {
  id: string
  title: string
  subtitle: string
  description: string
  imageUrl?: string
  features: string[]
  order: number
}

export interface ServicesPageContent {
  hero: {
    title: string
    subtitle: string
    description: string
    backgroundImage?: string
  }
  services: ServiceItem[]
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }
}

export const defaultServicesPageContent: ServicesPageContent = {
  hero: {
    title: "Bireysel Hizmetlerimiz",
    subtitle: "Sporcunun Tüm Gelişimini Kapsayan Kapsamlı Destek ve Performans Hizmetleri",
    description: "Hedef Performans, temel hareket eğitiminden elit sporcu programlarına kadar uzanan geniş bir yelpazede, bireysel yetenekleri zirveye taşımayı hedefler.",
  },
  services: [
    {
      id: "physiotherapist",
      title: "Fizyoterapist",
      subtitle: "Sporcu Sağlığına Bilimsel Yaklaşım",
      description: "Yaralanma Önleme, Rehabilitasyon ve Performans Artışı…",
      features: [
        "Yaralanma önleme programları",
        "Rehabilitasyon hizmetleri",
        "Performans artışı için özel programlar",
      ],
      order: 1,
    },
    {
      id: "fitness",
      title: "Salon (Fitness) Antrenmanı",
      subtitle: "Bireysel Gelişim için Güç Antrenmanları",
      description: "Dayanıklılığı Artıran, Performansı Destekleyen Salon…",
      features: [
        "Kişiye özel antrenman programları",
        "Güç ve dayanıklılık gelişimi",
        "Profesyonel ekipman kullanımı",
      ],
      order: 2,
    },
    {
      id: "field-training",
      title: "Saha Çalışmaları",
      subtitle: "Gerçek Maç Dinamiklerinde Antrenman",
      description: "Teknik ve Taktik Becerileri Geliştiren Profesyonel…",
      features: [
        "Teknik beceri geliştirme",
        "Taktiksel eğitim",
        "Maç senaryolarına hazırlık",
      ],
      order: 3,
    },
    {
      id: "beach-training",
      title: "Plaj Antrenmanları",
      subtitle: "Doğayla Uyumlu Direnç Antrenmanları",
      description: "Kum Zeminde Güç, Dayanıklılık ve Dengeyi…",
      features: [
        "Kum zemininde özel antrenman",
        "Denge ve koordinasyon gelişimi",
        "Doğal direnç eğitimi",
      ],
      order: 4,
    },
    {
      id: "psychology",
      title: "Psikolog Desteği",
      subtitle: "Mental Güç, Maksimum Performans",
      description: "Odaklanma, Motivasyon ve Zihinsel Dayanıklılık İçin…",
      features: [
        "Mental hazırlık programları",
        "Motivasyon ve odaklanma teknikleri",
        "Yarış öncesi zihinsel hazırlık",
      ],
      order: 5,
    },
    {
      id: "video-analysis",
      title: "Video Analiz ve İstatistik Desteği",
      subtitle: "Veriye Dayalı Performans Takibi",
      description: "Oyuncu ve Takım Gelişimini Destekleyen Detaylı…",
      features: [
        "Maç ve antrenman video analizi",
        "Performans istatistikleri",
        "Gelişim takibi ve raporlama",
      ],
      order: 6,
    },
    {
      id: "theoretical-education",
      title: "Teorik Eğitim",
      subtitle: "Sahada Akılcı Oyunun Temeli",
      description: "Oyun Bilgisi, Taktiksel Farkındalık ve Stratejik…",
      features: [
        "Futbol teorisi eğitimi",
        "Taktiksel analiz",
        "Oyun stratejileri",
      ],
      order: 7,
    },
    {
      id: "dietitian",
      title: "Diyetisyen Desteği",
      subtitle: "Performans için Doğru Beslenme",
      description: "Kas Gelişimi, Enerji Yönetimi ve Rejenerasyon…",
      features: [
        "Kişiye özel beslenme planları",
        "Enerji yönetimi",
        "Kas gelişimi için beslenme",
      ],
      order: 8,
    },
    {
      id: "altitude-training",
      title: "Yükselti ve Oksijen Maske Antrenmanları",
      subtitle: "Yüksek Rakımda Performans Artışı",
      description: "Aerobik Kapasiteyi Geliştiren Yükselti ve Oksijen…",
      features: [
        "Yükseklik antrenmanları",
        "Oksijen maskesi kullanımı",
        "Aerobik kapasite geliştirme",
      ],
      order: 9,
    },
    {
      id: "gps-tracking",
      title: "GPS Yeleği ile Performans Takibi",
      subtitle: "Performansı Anlık Ölç, Bilimle Geliştir",
      description: "Fiziksel Yüklenmeyi, Taktik Pozisyonu ve…",
      features: [
        "Gerçek zamanlı performans ölçümü",
        "Fiziksel yüklenme analizi",
        "Taktik pozisyon takibi",
      ],
      order: 10,
    },
    {
      id: "sports-massage",
      title: "Sporcu Masajı",
      subtitle: "Kas Yenilenmesi ve Rahatlama",
      description: "Toparlanmayı Hızlandıran, Esnekliği Artıran Profesyonel Sporcu…",
      features: [
        "Kas gevşetme teknikleri",
        "Toparlanma masajı",
        "Esneklik artırma",
      ],
      order: 11,
    },
    {
      id: "ems-training",
      title: "EMS Antrenmanı",
      subtitle: "Kısa Sürede Maksimum Etki",
      description: "Kas Gelişimini ve Metabolizmayı Hızlandıran Yüksek…",
      features: [
        "Elektriksel kas stimülasyonu",
        "Kısa sürede etkili antrenman",
        "Metabolizma hızlandırma",
      ],
      order: 12,
    },
  ],
  cta: {
    title: "Hedef Performans Ailesine Dahil Olun",
    description: "Sporcunun Tüm Gelişimini Kapsayan Kapsamlı Destek ve Performans Hizmetleri",
    buttonText: "Katıl",
    buttonLink: "/auth",
  },
}

export interface AcademyPageContent {
  hero: {
    title: string
    subtitle: string
    description: string
    backgroundImage?: string
  }
  sections: {
    id: string
    title: string
    description: string
    imageUrl?: string
    features: string[]
    order: number
  }[]
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }
}

export const defaultAcademyPageContent: AcademyPageContent = {
  hero: {
    title: "Hedef Performans Futbol Koleji",
    subtitle: "Temelden Zirveye",
    description: "Küçük yaştaki yetenekleri bilimsel yöntemlerle keşfeder, geliştirir ve geleceğin yıldızlarına dönüşmeleri için rehberlik eder.",
  },
  sections: [
    {
      id: "nutrition",
      title: "Beslenme Uzmanı",
      description: "Çocukların yaşlarına, fiziksel gelişimlerine ve spor düzeylerine uygun beslenme planları oluşturuyoruz. Sağlıklı büyümeyi destekleyen, enerji dengesi sağlayan ve performansı artıran özel diyet programlarıyla aileleri de sürece dahil ediyoruz.",
      features: [
        "Yaşa ve spor düzeyine uygun kişisel diyet planları",
        "Büyümeyi ve kas gelişimini destekleyen dengeli beslenme önerileri",
        "Ailelerle sürekli iletişim ve eğitim temelli yaklaşım",
      ],
      order: 1,
    },
    {
      id: "gymnastics",
      title: "Jimnastik",
      description: "Temel motor becerilerin gelişmesi ve vücut farkındalığının artması için jimnastik eğitimi sunuyoruz. Denge, esneklik ve koordinasyon gibi fiziksel temelleri eğlenceli antrenmanlarla güçlendiriyoruz.",
      features: [
        "Yaşa uygun, güvenli ve eğlenceli egzersizler",
        "Denge ve koordinasyon gelişimini destekleme",
        "Disiplin ve özgüven kazandıran bireysel odaklı eğitim",
      ],
      order: 2,
    },
    {
      id: "field-work",
      title: "Saha Çalışmaları",
      description: "Futbolun temel teknik ve taktiklerini yaşa uygun şekilde kazandırdığımız saha çalışmalarıyla çocukları oyunla eğitiyoruz. Takım içi uyum, top hâkimiyeti ve oyun zekâsı bu alanda geliştirilir.",
      features: [
        "Temel teknikler: pas, şut, top sürme eğitimi",
        "Takım içi etkileşim ve sosyal gelişim odaklı antrenman",
        "Yaşa uygun antrenman yoğunluğu ve programlama",
      ],
      order: 3,
    },
    {
      id: "movement-basics",
      title: "Temel Hareket Eğitimi",
      description: "Koşma, zıplama, sıçrama gibi temel hareket becerilerini kazandırarak çocukların sportif altyapısını güçlendiriyoruz. Bu eğitim, diğer tüm fiziksel aktivitelerin sağlıklı bir şekilde yapılmasını destekler.",
      features: [
        "Sporun temelini oluşturan hareket becerileri",
        "Yaş gruplarına özel gelişimsel programlar",
        "Duruş, denge ve motor kontrol kazanımı",
      ],
      order: 4,
    },
    {
      id: "theory",
      title: "Teorik Eğitim",
      description: "Futbolun sadece sahada değil, zihinde de kazanıldığını bilen çocuklar yetiştiriyoruz. Kurallar, oyun anlayışı ve spor kültürüne dair eğlenceli teorik içeriklerle eğitim sürecini tamamlıyoruz.",
      features: [
        "Temel futbol kuralları ve strateji bilgisi",
        "Sporcu disiplini ve etik değerlerin kazandırılması",
        "Eğitsel içeriklerle desteklenen interaktif oturumlar",
      ],
      order: 5,
    },
  ],
  cta: {
    title: "Hedef Performans Ailesine Dahil Olun",
    description: "Sporcunun Tüm Gelişimini Kapsayan Kapsamlı Destek ve Performans Hizmetleri",
    buttonText: "Katıl",
    buttonLink: "/auth",
  },
}

export interface MovementTrainingPageContent {
  hero: {
    title: string
    subtitle: string
    description: string
    backgroundImage?: string
  }
  sections: {
    id: string
    title: string
    description: string
    imageUrl?: string
    order: number
  }[]
  benefits: string[]
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }
}

export const defaultMovementTrainingPageContent: MovementTrainingPageContent = {
  hero: {
    title: "Erken Yaşta Spor Altyapısı İçin Bilimsel Temel Hareket Eğitimi",
    subtitle: "Güçlü Sporcu, Sağlam Temelle Yetişir",
    description: "Sporun temeli, doğru hareketle başlar. Hedef Performans olarak, çocukluk dönemindeki sporcuların fiziksel gelişimlerini desteklemek amacıyla yapılandırılmış Temel Hareket Eğitimi programımız; denge, koordinasyon, esneklik, çeviklik ve motor becerileri geliştirmeye odaklanır. Bu eğitim, yalnızca spora hazırlık değil; aynı zamanda çocukların genel fiziksel kapasitesini güçlendiren, güvenli ve eğitici bir süreçtir.",
  },
  sections: [
    {
      id: "introduction",
      title: "Temel Hareket Eğitimi Nedir?",
      description: "Erken yaşta kazandırılan temel hareket becerileri, çocuğun hem fiziksel gelişimini hızlandırır hem de ileride seçeceği spor dalında başarılı olmasını sağlar.",
      order: 1,
    },
    {
      id: "benefits",
      title: "Faydaları",
      description: "Temel hareket eğitimi, çocukların motor becerilerini geliştirir ve sağlıklı bir fiziksel temel oluşturur.",
      order: 2,
    },
  ],
  benefits: [
    "Denge ve koordinasyon gelişimi",
    "Esneklik ve çeviklik artışı",
    "Motor becerilerin geliştirilmesi",
    "Spor yaralanmalarının önlenmesi",
    "Genel fiziksel kapasitenin artırılması",
  ],
  cta: {
    title: "Temel Hareket Eğitimi Programına Katılın",
    description: "Çocuklarınızın sağlam bir spor altyapısına sahip olmasını sağlayın",
    buttonText: "Başvur",
    buttonLink: "/auth",
  },
}

export interface AboutPageContent {
  hero: {
    title: string
    subtitle: string
    description: string
    backgroundImage?: string
  }
  mission: {
    title: string
    description: string
  }
  vision: {
    title: string
    description: string
  }
  values: {
    title: string
    items: {
      id: string
      title: string
      description: string
      icon?: string
    }[]
  }
  stats: {
    trainers: number
    students: number
  }
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }
}

export const defaultAboutPageContent: AboutPageContent = {
  hero: {
    title: "Hakkımızda",
    subtitle: "Hedef Performans",
    description: "Sporcu gelişiminde öncü olan Hedef Performans, bilimsel yaklaşım ve deneyimli kadromuzla sporcuların en iyi versiyonlarına ulaşmalarını sağlıyoruz.",
  },
  mission: {
    title: "Misyonumuz",
    description: "Sporcuların fiziksel, zihinsel ve teknik gelişimlerini destekleyerek, onları hedeflerine ulaştırmak ve sporda başarılı olmalarını sağlamak.",
  },
  vision: {
    title: "Vizyonumuz",
    description: "Türkiye'nin önde gelen sporcu geliştirme merkezi olmak ve uluslararası arenada başarılı sporcular yetiştirmek.",
  },
  values: {
    title: "Değerlerimiz",
    items: [
      {
        id: "scientific",
        title: "Bilimsel Yaklaşım",
        description: "Her programımız bilimsel araştırmalar ve kanıta dayalı yöntemlerle hazırlanır.",
      },
      {
        id: "excellence",
        title: "Mükemmellik",
        description: "Sürekli kendimizi geliştirerek en yüksek kalitede hizmet sunmayı hedefleriz.",
      },
      {
        id: "passion",
        title: "Tutku",
        description: "Spor ve sporcu gelişimine olan tutkumuz, her gün daha iyi olmamızı sağlar.",
      },
      {
        id: "integrity",
        title: "Dürüstlük",
        description: "Tüm ilişkilerimizde şeffaflık ve dürüstlük ilkelerimizle hareket ederiz.",
      },
    ],
  },
  stats: {
    trainers: 0,
    students: 0,
  },
  cta: {
    title: "Hedef Performans Ailesine Katılın",
    description: "Siz de başarı hikayemizin bir parçası olun",
    buttonText: "Başvur",
    buttonLink: "/auth",
  },
}

export interface ContactPageContent {
  hero: {
    title: string
    subtitle: string
    description: string
    backgroundImage?: string
  }
  contact: {
    email: string
    phone: string
    address: string
    whatsapp?: string
  }
  form: {
    title: string
    description: string
    fields: {
      name: { label: string; placeholder: string }
      email: { label: string; placeholder: string }
      phone: { label: string; placeholder: string }
      subject: { label: string; placeholder: string }
      message: { label: string; placeholder: string }
    }
    submitButton: string
  }
  map?: {
    embedUrl?: string
  }
}

export const defaultContactPageContent: ContactPageContent = {
  hero: {
    title: "İletişim",
    subtitle: "Bize Ulaşın",
    description: "Sorularınız, önerileriniz veya randevu talepleriniz için bizimle iletişime geçebilirsiniz.",
  },
  contact: {
    email: "[email protected]",
    phone: "+90 553 882 45 50",
    address: "Konak / İzmir",
    whatsapp: "+90 553 882 45 50",
  },
  form: {
    title: "Mesaj Gönderin",
    description: "Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz.",
    fields: {
      name: { label: "Ad Soyad", placeholder: "Adınızı ve soyadınızı girin" },
      email: { label: "E-posta", placeholder: "E-posta adresinizi girin" },
      phone: { label: "Telefon", placeholder: "Telefon numaranızı girin" },
      subject: { label: "Konu", placeholder: "Mesaj konusunu girin" },
      message: { label: "Mesaj", placeholder: "Mesajınızı yazın" },
    },
    submitButton: "Gönder",
  },
}

export type PageContentKey =
  | "services"
  | "academy"
  | "movementTraining"
  | "about"
  | "contact"

export function mergePageContent<T extends { hero?: any }>(
  key: PageContentKey,
  partial: Partial<T> | undefined,
  defaults: T
): T {
  if (!partial) return defaults

  const merged = { ...defaults }

  if (partial.hero) {
    merged.hero = { ...defaults.hero, ...partial.hero }
  }

  if ("services" in merged && "services" in partial) {
    // Eğer partial'da services varsa direkt kullan, merge etme (duplicate önlemek için)
    merged.services = (partial as any).services || (merged as any).services || []
  }

  if ("sections" in merged && "sections" in partial) {
    // Eğer partial'da sections varsa direkt kullan, merge etme (duplicate önlemek için)
    merged.sections = (partial as any).sections || (merged as any).sections || []
  }

  if ("contact" in partial) {
    ;(merged as any).contact = { ...(defaults as any).contact, ...(partial as any).contact }
  }

  if ("mission" in partial) {
    ;(merged as any).mission = { ...(defaults as any).mission, ...(partial as any).mission }
  }

  if ("vision" in partial) {
    ;(merged as any).vision = { ...(defaults as any).vision, ...(partial as any).vision }
  }

  if ("values" in partial && "values" in defaults) {
    ;(merged as any).values = {
      ...(defaults as any).values,
      ...(partial as any).values,
      items: (partial as any).values?.items || (defaults as any).values.items,
    }
  }

  if ("stats" in partial) {
    ;(merged as any).stats = { ...(defaults as any).stats, ...(partial as any).stats }
  }

  if ("benefits" in partial) {
    ;(merged as any).benefits = (partial as any).benefits || (defaults as any).benefits
  }

  return merged as T
}

