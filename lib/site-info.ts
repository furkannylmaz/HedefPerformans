export interface SiteInfoSocials {
  instagram?: string
  youtube?: string
  tiktok?: string
  whatsapp?: string
}

export interface BankInfo {
  bankName: string
  accountName: string
  iban: string
  accountNumber: string
  branch: string
  amount: string
}

export interface SiteInfo {
  headline: string
  description: string
  email: string
  phone: string
  address: string
  whatsapp: string
  socials: SiteInfoSocials
  bankInfo?: BankInfo
}

export const defaultSiteInfo: SiteInfo = {
  headline: 'Sahada ve hayatta birlikte güçlenelim',
  description:
    'Programlarımız hakkında bilgi almak, seçmelere başvurmak veya kurumsal iş birlikleri için bize ulaşın.',
  email: 'info@hedefperformans.com',
  phone: '+90 553 882 45 50',
  address: 'Konak, İzmir — Türkiye',
  whatsapp: 'https://wa.me/905538824550',
  socials: {
    instagram: 'https://instagram.com/hedefperformans',
    youtube: 'https://youtube.com/@hedefperformans',
    tiktok: 'https://www.tiktok.com/@hedefperformans',
  },
  bankInfo: {
    bankName: 'Ziraat Bankası',
    accountName: 'Hedef Performans Spor Kulübü',
    iban: 'TR99 0001 0009 9900 0000 0000 00',
    accountNumber: '9900000000',
    branch: 'Kadıköy Şubesi (990)',
    amount: '499.00',
  },
}

export function mergeSiteInfo(partial?: Partial<SiteInfo>): SiteInfo {
  if (!partial) {
    return defaultSiteInfo
  }

  return {
    ...defaultSiteInfo,
    ...partial,
    socials: {
      ...defaultSiteInfo.socials,
      ...partial.socials,
    },
    bankInfo: partial.bankInfo ? {
      ...defaultSiteInfo.bankInfo,
      ...partial.bankInfo,
    } : defaultSiteInfo.bankInfo,
  }
}

