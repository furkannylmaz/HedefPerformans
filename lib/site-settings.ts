import { prisma } from '@/lib/prisma'
import {
  HomepageContent,
  mergeHomepageContent,
} from '@/lib/homepage-content'
import type { SiteInfo } from '@/lib/site-info'
import { mergeSiteInfo } from '@/lib/site-info'
import {
  ServicesPageContent,
  defaultServicesPageContent,
  AcademyPageContent,
  defaultAcademyPageContent,
  MovementTrainingPageContent,
  defaultMovementTrainingPageContent,
  AboutPageContent,
  defaultAboutPageContent,
  ContactPageContent,
  defaultContactPageContent,
  mergePageContent,
} from '@/lib/pages-content'

export type { SiteInfo, SiteInfoSocials } from '@/lib/site-info'
export { defaultSiteInfo, mergeSiteInfo } from '@/lib/site-info'
export type {
  ServicesPageContent,
  AcademyPageContent,
  MovementTrainingPageContent,
  AboutPageContent,
  ContactPageContent,
} from '@/lib/pages-content'
export { mergePageContent } from '@/lib/pages-content'

export const HOMEPAGE_SETTING_KEY = 'homepage'
export const SITE_INFO_SETTING_KEY = 'siteInfo'
export const SERVICES_PAGE_KEY = 'servicesPage'
export const ACADEMY_PAGE_KEY = 'academyPage'
export const MOVEMENT_TRAINING_PAGE_KEY = 'movementTrainingPage'
export const ABOUT_PAGE_KEY = 'aboutPage'
export const CONTACT_PAGE_KEY = 'contactPage'

function serialiseSetting(value: unknown) {
  return JSON.stringify(value)
}

function parseSetting<T>(value?: string | null): T | undefined {
  if (!value) return undefined
  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.error('[SiteSettings] JSON parse error', error)
    return undefined
  }
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    // Runtime'da DATABASE_URL kontrolü
    if (!process.env.DATABASE_URL) {
      console.error('[getHomepageContent] DATABASE_URL is missing, using defaults')
      return mergeHomepageContent(undefined)
    }
    
    const setting = await prisma.siteSetting.findUnique({ where: { key: HOMEPAGE_SETTING_KEY } })
    const parsed = parseSetting<HomepageContent>(setting?.value)
    return mergeHomepageContent(parsed)
  } catch (error) {
    console.error('[getHomepageContent] Database error, using defaults:', error)
    if (error instanceof Error) {
      console.error('[getHomepageContent] Error message:', error.message)
    }
    return mergeHomepageContent(undefined)
  }
}

export async function saveHomepageContent(content: HomepageContent) {
  try {
    const result = await prisma.siteSetting.upsert({
      where: { key: HOMEPAGE_SETTING_KEY },
      update: {
        value: serialiseSetting(content),
      },
      create: {
        key: HOMEPAGE_SETTING_KEY,
        value: serialiseSetting(content),
      },
    })
    console.log('[saveHomepageContent] Successfully saved:', result.key)
    return result
  } catch (error) {
    console.error('[saveHomepageContent] Database error:', error)
    throw error
  }
}

export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    // Runtime'da DATABASE_URL kontrolü
    if (!process.env.DATABASE_URL) {
      console.error('[getSiteInfo] DATABASE_URL is missing, using defaults')
      return mergeSiteInfo(undefined)
    }
    
    const setting = await prisma.siteSetting.findUnique({ where: { key: SITE_INFO_SETTING_KEY } })
    const parsed = parseSetting<SiteInfo>(setting?.value)
    return mergeSiteInfo(parsed)
  } catch (error) {
    console.error('[getSiteInfo] Database error, using defaults:', error)
    if (error instanceof Error) {
      console.error('[getSiteInfo] Error message:', error.message)
    }
    return mergeSiteInfo(undefined)
  }
}

export async function saveSiteInfo(info: SiteInfo) {
  try {
    const result = await prisma.siteSetting.upsert({
      where: { key: SITE_INFO_SETTING_KEY },
      update: {
        value: serialiseSetting(info),
      },
      create: {
        key: SITE_INFO_SETTING_KEY,
        value: serialiseSetting(info),
      },
    })
    console.log('[saveSiteInfo] Successfully saved:', result.key)
    return result
  } catch (error) {
    console.error('[saveSiteInfo] Database error:', error)
    throw error
  }
}

export interface SliderItem {
  id: string
  side: string
  title: string | null
  imageUrl: string
  linkUrl: string | null
  sort: number
  isActive: boolean
}

export async function getBanners(side?: 'LEFT' | 'RIGHT' | 'MAIN' | 'WELCOME_RIGHT'): Promise<SliderItem[]> {
  try {
    // Runtime'da DATABASE_URL kontrolü
    if (!process.env.DATABASE_URL) {
      console.error('[getBanners] DATABASE_URL is missing, returning empty array')
      return []
    }
    
    const where: {
      isActive: boolean
      side?: string
    } = {
      isActive: true,
    }

    if (side) {
      where.side = side
    }

    const sliders = await prisma.sliderItem.findMany({
      where,
      orderBy: {
        sort: 'asc',
      },
    })

    return sliders
  } catch (error) {
    console.error('[getBanners] Database error, returning empty array:', error)
    if (error instanceof Error) {
      console.error('[getBanners] Error message:', error.message)
    }
    return []
  }
}

export async function getWelcomeRightImage(): Promise<string | null> {
  const banners = await getBanners('WELCOME_RIGHT')
  return banners.length > 0 ? banners[0].imageUrl : null
}

// Sayfa içerikleri için fonksiyonlar
export async function getServicesPageContent(): Promise<ServicesPageContent> {
  try {
    // Runtime'da DATABASE_URL kontrolü
    if (!process.env.DATABASE_URL) {
      console.error('[getServicesPageContent] DATABASE_URL is missing, using defaults')
      return defaultServicesPageContent
    }
    
    const setting = await prisma.siteSetting.findUnique({ where: { key: SERVICES_PAGE_KEY } })
    const parsed = parseSetting<ServicesPageContent>(setting?.value)
    return mergePageContent('services', parsed, defaultServicesPageContent)
  } catch (error) {
    console.error('[getServicesPageContent] Database error, using defaults:', error)
    if (error instanceof Error) {
      console.error('[getServicesPageContent] Error message:', error.message)
      console.error('[getServicesPageContent] Error stack:', error.stack)
    }
    return defaultServicesPageContent
  }
}

export async function saveServicesPageContent(content: ServicesPageContent) {
  try {
    const result = await prisma.siteSetting.upsert({
      where: { key: SERVICES_PAGE_KEY },
      update: { value: serialiseSetting(content) },
      create: { key: SERVICES_PAGE_KEY, value: serialiseSetting(content) },
    })
    console.log('[saveServicesPageContent] Successfully saved:', result.key)
    return result
  } catch (error) {
    console.error('[saveServicesPageContent] Database error:', error)
    throw error
  }
}

export async function getAcademyPageContent(): Promise<AcademyPageContent> {
  try {
    // Runtime'da DATABASE_URL kontrolü
    if (!process.env.DATABASE_URL) {
      console.error('[getAcademyPageContent] DATABASE_URL is missing, using defaults')
      return defaultAcademyPageContent
    }
    
    const setting = await prisma.siteSetting.findUnique({ where: { key: ACADEMY_PAGE_KEY } })
    const parsed = parseSetting<AcademyPageContent>(setting?.value)
    return mergePageContent('academy', parsed, defaultAcademyPageContent)
  } catch (error) {
    console.error('[getAcademyPageContent] Database error, using defaults:', error)
    if (error instanceof Error) {
      console.error('[getAcademyPageContent] Error message:', error.message)
    }
    return defaultAcademyPageContent
  }
}

export async function saveAcademyPageContent(content: AcademyPageContent) {
  try {
    const result = await prisma.siteSetting.upsert({
      where: { key: ACADEMY_PAGE_KEY },
      update: { value: serialiseSetting(content) },
      create: { key: ACADEMY_PAGE_KEY, value: serialiseSetting(content) },
    })
    console.log('[saveAcademyPageContent] Successfully saved:', result.key)
    return result
  } catch (error) {
    console.error('[saveAcademyPageContent] Database error:', error)
    throw error
  }
}

export async function getMovementTrainingPageContent(): Promise<MovementTrainingPageContent> {
  try {
    // Runtime'da DATABASE_URL kontrolü
    if (!process.env.DATABASE_URL) {
      console.error('[getMovementTrainingPageContent] DATABASE_URL is missing, using defaults')
      return defaultMovementTrainingPageContent
    }
    
    const setting = await prisma.siteSetting.findUnique({ where: { key: MOVEMENT_TRAINING_PAGE_KEY } })
    const parsed = parseSetting<MovementTrainingPageContent>(setting?.value)
    return mergePageContent('movementTraining', parsed, defaultMovementTrainingPageContent)
  } catch (error) {
    console.error('[getMovementTrainingPageContent] Database error, using defaults:', error)
    if (error instanceof Error) {
      console.error('[getMovementTrainingPageContent] Error message:', error.message)
    }
    return defaultMovementTrainingPageContent
  }
}

export async function saveMovementTrainingPageContent(content: MovementTrainingPageContent) {
  try {
    const result = await prisma.siteSetting.upsert({
      where: { key: MOVEMENT_TRAINING_PAGE_KEY },
      update: { value: serialiseSetting(content) },
      create: { key: MOVEMENT_TRAINING_PAGE_KEY, value: serialiseSetting(content) },
    })
    console.log('[saveMovementTrainingPageContent] Successfully saved:', result.key)
    return result
  } catch (error) {
    console.error('[saveMovementTrainingPageContent] Database error:', error)
    throw error
  }
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    // Runtime'da DATABASE_URL kontrolü
    if (!process.env.DATABASE_URL) {
      console.error('[getAboutPageContent] DATABASE_URL is missing, using defaults')
      return defaultAboutPageContent
    }
    
    const setting = await prisma.siteSetting.findUnique({ where: { key: ABOUT_PAGE_KEY } })
    const parsed = parseSetting<AboutPageContent>(setting?.value)
    return mergePageContent('about', parsed, defaultAboutPageContent)
  } catch (error) {
    console.error('[getAboutPageContent] Database error, using defaults:', error)
    if (error instanceof Error) {
      console.error('[getAboutPageContent] Error message:', error.message)
    }
    return defaultAboutPageContent
  }
}

export async function saveAboutPageContent(content: AboutPageContent) {
  try {
    const result = await prisma.siteSetting.upsert({
      where: { key: ABOUT_PAGE_KEY },
      update: { value: serialiseSetting(content) },
      create: { key: ABOUT_PAGE_KEY, value: serialiseSetting(content) },
    })
    console.log('[saveAboutPageContent] Successfully saved:', result.key)
    return result
  } catch (error) {
    console.error('[saveAboutPageContent] Database error:', error)
    throw error
  }
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  try {
    // Runtime'da DATABASE_URL kontrolü
    if (!process.env.DATABASE_URL) {
      console.error('[getContactPageContent] DATABASE_URL is missing, using defaults')
      return defaultContactPageContent
    }
    
    const setting = await prisma.siteSetting.findUnique({ where: { key: CONTACT_PAGE_KEY } })
    const parsed = parseSetting<ContactPageContent>(setting?.value)
    return mergePageContent('contact', parsed, defaultContactPageContent)
  } catch (error) {
    console.error('[getContactPageContent] Database error, using defaults:', error)
    if (error instanceof Error) {
      console.error('[getContactPageContent] Error message:', error.message)
    }
    return defaultContactPageContent
  }
}

export async function saveContactPageContent(content: ContactPageContent) {
  try {
    const result = await prisma.siteSetting.upsert({
      where: { key: CONTACT_PAGE_KEY },
      update: { value: serialiseSetting(content) },
      create: { key: CONTACT_PAGE_KEY, value: serialiseSetting(content) },
    })
    console.log('[saveContactPageContent] Successfully saved:', result.key)
    return result
  } catch (error) {
    console.error('[saveContactPageContent] Database error:', error)
    throw error
  }
}

