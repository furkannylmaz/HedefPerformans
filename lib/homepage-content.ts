export type IconKey =
  | 'trophy'
  | 'target'
  | 'users'
  | 'shield'
  | 'sparkles'
  | 'activity'
  | 'dumbbell'
  | 'brain'
  | 'heart'
  | 'atom'

export interface HomepageFeature {
  id: string
  title: string
  description: string
  icon: IconKey
}

export interface HomepageProgram {
  id: string
  badge: string
  title: string
  description: string
  imageUrl: string
}

export interface HomepageStat {
  id: string
  value: string
  label: string
  description?: string
}

export interface HomepageTechnologyItem {
  id: string
  title: string
  description: string
  icon: IconKey
}

export interface HomepageTestimonial {
  id: string
  quote: string
  name: string
  role: string
}

export interface HomepageMedia {
  title: string
  description: string
  videoUrl?: string
  gallery: string[]
}

export interface HomepageCTA {
  title: string
  description: string
  primaryCtaLabel: string
  primaryCtaLink: string
  secondaryCtaLabel?: string
  secondaryCtaLink?: string
  backgroundImage?: string
}

export interface HomepageSection {
  title: string
  description: string
}

export interface HomepageContent {
  hero: {
    badge: string
    title: string
    highlight: string
    description: string
    backgroundImage: string
    overlayImage?: string
    primaryCtaLabel: string
    primaryCtaLink: string
    secondaryCtaLabel: string
    secondaryCtaLink: string
    statsNote: string
  }
  stats: HomepageStat[]
  features: HomepageSection & { items: HomepageFeature[] }
  programs: HomepageSection & { items: HomepageProgram[] }
  technology: HomepageSection & { items: HomepageTechnologyItem[] }
  testimonials: HomepageSection & { items: HomepageTestimonial[] }
  media: HomepageMedia
  cta: HomepageCTA
}

export const iconOptions: { label: string; value: IconKey }[] = [
  { label: 'Kupa', value: 'trophy' },
  { label: 'Hedef', value: 'target' },
  { label: 'Takım', value: 'users' },
  { label: 'Kalkan', value: 'shield' },
  { label: 'Parıltı', value: 'sparkles' },
  { label: 'Performans', value: 'activity' },
  { label: 'Güç', value: 'dumbbell' },
  { label: 'Zihin', value: 'brain' },
  { label: 'Sağlık', value: 'heart' },
  { label: 'Teknoloji', value: 'atom' },
]

export const defaultHomepageContent: HomepageContent = {
  hero: {
    badge: 'Uluslararası Futbolcu Seçmeleri',
    title: 'Hedef Performans Futbol Koleji',
    highlight: 'İzmir’de yetenek avı başladı',
    description:
      'UEFA lisanslı antrenörler, fizyoterapistler ve performans ekibimizle bireyselleştirilmiş gelişim programları sunuyoruz. Şehrin en kapsamlı futbol akademisinde vitrine çıkma zamanı.',
    backgroundImage:
      'https://images.unsplash.com/photo-1549923746-1235c1f7c59a?q=80&w=1600&auto=format&fit=crop',
    overlayImage:
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1600&auto=format&fit=crop',
    primaryCtaLabel: 'Hemen Başvur',
    primaryCtaLink: '/auth',
    secondaryCtaLabel: 'Programları Keşfet',
    secondaryCtaLink: '#programlar',
    statsNote: 'Her yaş grubu için sınırlı kontenjan. Şehrin yıldızları burada yetişiyor.',
  },
  stats: [
    {
      id: 'athletes',
      value: '1200+',
      label: 'Gelişim Kampı Mezunu',
      description: 'Türkiye genelinden katılan sporcular',
    },
    {
      id: 'coaches',
      value: '35+',
      label: 'UEFA Lisanslı Eğitmen',
      description: 'Her branşta uzman koçlar',
    },
    {
      id: 'clubs',
      value: '18',
      label: 'Profesyonel Kulüp Temsilcisi',
      description: 'Düzenli scout ve yetenek seçmeleri',
    },
  ],
  features: {
    title: 'Performans için ihtiyacınız olan her şey',
    description:
      'Saha içi ve dışında bireysel gelişimi uçtan uca destekleyen programlarımızla hayallerinizi profesyonel bir planla birleştiriyoruz.',
    items: [
      {
        id: 'feature-1',
        title: 'Video Analiz & Raporlama',
        description:
          'Her maç ve antrenman sonrası detaylı istatistik, 4K video kırılımları ve bireysel gelişim takip paneli.',
        icon: 'activity',
      },
      {
        id: 'feature-2',
        title: 'Kişiye Özel Antrenman',
        description:
          'Performans testleriyle belirlenen eksik alanlara odaklanan saha, salon ve plaj antrenmanları.',
        icon: 'dumbbell',
      },
      {
        id: 'feature-3',
        title: 'Fizyoterapi & Rehabilitasyon',
        description:
          'Sakatlık önleme protokolleri, manuel terapi ve toparlanmayı hızlandıran meditasyon destekleri.',
        icon: 'heart',
      },
      {
        id: 'feature-4',
        title: 'Mentorluk ve Psikoloji',
        description:
          'Spor psikologları, diyetisyenler ve performans koçlarıyla zihinsel ve fiziksel dayanıklılık.',
        icon: 'brain',
      },
    ],
  },
  programs: {
    title: 'Programlarımız',
    description:
      'Temel hareket eğitiminden elit sporcu programlarına kadar her seviyeye uygun, bilimsel olarak kurgulanmış modüller.',
    items: [
      {
        id: 'program-1',
        badge: 'Seçmelere Hazırlık',
        title: 'Uluslararası Futbolcu Seçmeleri Kampı',
        description:
          'Profesyonel kulüp temsilcileriyle doğrudan temas. 4 haftalık yoğun hazırlık ve vitrine çıkış programı.',
        imageUrl:
          'https://images.unsplash.com/photo-1515865644861-8bedc4fb834b?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'program-2',
        badge: 'Bireysel Hizmetler',
        title: 'Performans Takip & Güç Kampı',
        description:
          'GPS yeleği, oksijen maskesi ve EMS destekli güç antrenmanlarıyla dayanıklılığı yeni seviyeye taşıyın.',
        imageUrl:
          'https://images.unsplash.com/photo-1594737625785-c66858a24b47?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'program-3',
        badge: 'Futbol Koleji',
        title: 'Elit Akademi Gelişim Programı',
        description:
          '12 ay boyunca modüler eğitim, maç analizi ve kişiye özel performans planlaması.',
        imageUrl:
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600&auto=format&fit=crop',
      },
    ],
  },
  technology: {
    title: 'Teknoloji ile güçlenen gelişim',
    description:
      'Modern ekipmanlar ve veri odaklı yaklaşımımızla her sporcunun potansiyelini görünür kılıyoruz.',
    items: [
      {
        id: 'tech-1',
        title: 'GPS Destekli Veri Takibi',
        description: 'Anlık hız, yüklenme ve konum analiziyle gelişim grafiklerini takip edin.',
        icon: 'target',
      },
      {
        id: 'tech-2',
        title: '4K Çok Kameralı Çekim',
        description: 'Çok açılı maç kaydı ve veri odaklı analiz raporlarıyla fark yaratın.',
        icon: 'sparkles',
      },
      {
        id: 'tech-3',
        title: 'Oksijen & EMS Protokolleri',
        description: 'Yüksek irtifa simülasyonu ve elektrostimülasyon ile yeni sınırlar keşfedin.',
        icon: 'atom',
      },
    ],
  },
  testimonials: {
    title: 'Ailemiz ne söylüyor?',
    description: 'Sporcularımızın ve ebeveynlerimizin deneyimlerinden ilham alın.',
    items: [
      {
        id: 'testimonial-1',
        quote:
          'GPS verileri ve kişisel raporlar sayesinde oğlumun gelişimini haftalık olarak görebiliyoruz. Profesyonel süreç bize güven verdi.',
        name: 'Merve Kara',
        role: 'U14 sporcu velisi',
      },
      {
        id: 'testimonial-2',
        quote:
          'Seçmelere hazırlık kampında öğrendiğim detaylar sayesinde profesyonel kulüp scoutlarıyla ilk kez temas kurdum.',
        name: 'Efe Yıldırım',
        role: 'U17 forvet oyuncusu',
      },
      {
        id: 'testimonial-3',
        quote:
          'Fizyoterapi ve psikoloji destekleri sayesinde sakatlıktan dönüş sürecim çok daha planlı ilerledi.',
        name: 'Can Aksoy',
        role: 'U19 orta saha',
      },
    ],
  },
  media: {
    title: 'Sahadan anlar',
    description:
      'Kamp atmosferimiz, antrenman seansları ve kulüp ziyaretlerinden seçilmiş karelere göz atın.',
    videoUrl: 'https://www.youtube.com/embed/6H7g66Nmg6E',
    gallery: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518600506271-1e25c0ed2787?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  cta: {
    title: 'Profesyonel vitrine birlikte hazırlanalım',
    description:
      'Seçmeler, bireysel hizmetler ve akademi programları için erken kayıt avantajlarından yararlanın. Kontenjanlar hızla doluyor.',
    primaryCtaLabel: 'Kayıt Ol',
    primaryCtaLink: '/auth',
    secondaryCtaLabel: 'Danışmanla Görüş',
    secondaryCtaLink: 'mailto:info@hedefperformans.com',
    backgroundImage:
      'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1600&auto=format&fit=crop',
  },
}

export function mergeHomepageContent(partial?: Partial<HomepageContent>): HomepageContent {
  if (!partial) {
    return defaultHomepageContent
  }

  return {
    hero: {
      ...defaultHomepageContent.hero,
      ...partial.hero,
    },
    stats: partial.stats?.length ? partial.stats : defaultHomepageContent.stats,
    features: {
      ...defaultHomepageContent.features,
      ...partial.features,
      items: partial.features?.items?.length ? partial.features.items : defaultHomepageContent.features.items,
    },
    programs: {
      ...defaultHomepageContent.programs,
      ...partial.programs,
      items: partial.programs?.items?.length ? partial.programs.items : defaultHomepageContent.programs.items,
    },
    technology: {
      ...defaultHomepageContent.technology,
      ...partial.technology,
      items: partial.technology?.items?.length ? partial.technology.items : defaultHomepageContent.technology.items,
    },
    testimonials: {
      ...defaultHomepageContent.testimonials,
      ...partial.testimonials,
      items: partial.testimonials?.items?.length
        ? partial.testimonials.items
        : defaultHomepageContent.testimonials.items,
    },
    media: {
      ...defaultHomepageContent.media,
      ...partial.media,
      gallery: partial.media?.gallery?.length ? partial.media.gallery : defaultHomepageContent.media.gallery,
    },
    cta: {
      ...defaultHomepageContent.cta,
      ...partial.cta,
    },
  }
}

