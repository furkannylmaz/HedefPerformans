import { prisma } from '@/lib/prisma'
import {
  HomepageContent,
  defaultHomepageContent,
  mergeHomepageContent,
} from '@/lib/homepage-content'
import type { SiteInfo } from '@/lib/site-info'
import { mergeSiteInfo, defaultSiteInfo } from '@/lib/site-info'
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
  PageContentKey,
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
  const setting = await prisma.siteSetting.findUnique({ where: { key: HOMEPAGE_SETTING_KEY } })
  const parsed = parseSetting<HomepageContent>(setting?.value)
  return mergeHomepageContent(parsed)
}

export async function saveHomepageContent(content: HomepageContent) {
  await prisma.siteSetting.upsert({
    where: { key: HOMEPAGE_SETTING_KEY },
    update: {
      value: serialiseSetting(content),
    },
    create: {
      key: HOMEPAGE_SETTING_KEY,
      value: serialiseSetting(content),
    },
  })
}

export async function getSiteInfo(): Promise<SiteInfo> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: SITE_INFO_SETTING_KEY } })
  const parsed = parseSetting<SiteInfo>(setting?.value)
  return mergeSiteInfo(parsed)
}

export async function saveSiteInfo(info: SiteInfo) {
  await prisma.siteSetting.upsert({
    where: { key: SITE_INFO_SETTING_KEY },
    update: {
      value: serialiseSetting(info),
    },
    create: {
      key: SITE_INFO_SETTING_KEY,
      value: serialiseSetting(info),
    },
  })
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
  const where: any = {
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
}

export async function getWelcomeRightImage(): Promise<string | null> {
  const banners = await getBanners('WELCOME_RIGHT')
  return banners.length > 0 ? banners[0].imageUrl : null
}

// Sayfa içerikleri için fonksiyonlar
export async function getServicesPageContent(): Promise<ServicesPageContent> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: SERVICES_PAGE_KEY } })
  const parsed = parseSetting<ServicesPageContent>(setting?.value)
  return mergePageContent('services', parsed, defaultServicesPageContent)
}

export async function saveServicesPageContent(content: ServicesPageContent) {
  await prisma.siteSetting.upsert({
    where: { key: SERVICES_PAGE_KEY },
    update: { value: serialiseSetting(content) },
    create: { key: SERVICES_PAGE_KEY, value: serialiseSetting(content) },
  })
}

export async function getAcademyPageContent(): Promise<AcademyPageContent> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: ACADEMY_PAGE_KEY } })
  const parsed = parseSetting<AcademyPageContent>(setting?.value)
  return mergePageContent('academy', parsed, defaultAcademyPageContent)
}

export async function saveAcademyPageContent(content: AcademyPageContent) {
  await prisma.siteSetting.upsert({
    where: { key: ACADEMY_PAGE_KEY },
    update: { value: serialiseSetting(content) },
    create: { key: ACADEMY_PAGE_KEY, value: serialiseSetting(content) },
  })
}

export async function getMovementTrainingPageContent(): Promise<MovementTrainingPageContent> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: MOVEMENT_TRAINING_PAGE_KEY } })
  const parsed = parseSetting<MovementTrainingPageContent>(setting?.value)
  return mergePageContent('movementTraining', parsed, defaultMovementTrainingPageContent)
}

export async function saveMovementTrainingPageContent(content: MovementTrainingPageContent) {
  await prisma.siteSetting.upsert({
    where: { key: MOVEMENT_TRAINING_PAGE_KEY },
    update: { value: serialiseSetting(content) },
    create: { key: MOVEMENT_TRAINING_PAGE_KEY, value: serialiseSetting(content) },
  })
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: ABOUT_PAGE_KEY } })
  const parsed = parseSetting<AboutPageContent>(setting?.value)
  return mergePageContent('about', parsed, defaultAboutPageContent)
}

export async function saveAboutPageContent(content: AboutPageContent) {
  await prisma.siteSetting.upsert({
    where: { key: ABOUT_PAGE_KEY },
    update: { value: serialiseSetting(content) },
    create: { key: ABOUT_PAGE_KEY, value: serialiseSetting(content) },
  })
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: CONTACT_PAGE_KEY } })
  const parsed = parseSetting<ContactPageContent>(setting?.value)
  return mergePageContent('contact', parsed, defaultContactPageContent)
}

export async function saveContactPageContent(content: ContactPageContent) {
  await prisma.siteSetting.upsert({
    where: { key: CONTACT_PAGE_KEY },
    update: { value: serialiseSetting(content) },
    create: { key: CONTACT_PAGE_KEY, value: serialiseSetting(content) },
  })
}

