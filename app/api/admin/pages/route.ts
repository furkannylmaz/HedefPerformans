import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  SERVICES_PAGE_KEY,
  ACADEMY_PAGE_KEY,
  MOVEMENT_TRAINING_PAGE_KEY,
  ABOUT_PAGE_KEY,
  CONTACT_PAGE_KEY,
  getServicesPageContent,
  getAcademyPageContent,
  getMovementTrainingPageContent,
  getAboutPageContent,
  getContactPageContent,
  saveServicesPageContent,
  saveAcademyPageContent,
  saveMovementTrainingPageContent,
  saveAboutPageContent,
  saveContactPageContent,
  mergePageContent,
} from '@/lib/site-settings'
import {
  defaultServicesPageContent,
  defaultAcademyPageContent,
  defaultMovementTrainingPageContent,
  defaultAboutPageContent,
  defaultContactPageContent,
  ServicesPageContent,
  AcademyPageContent,
  MovementTrainingPageContent,
  AboutPageContent,
  ContactPageContent,
} from '@/lib/pages-content'

function isAdminAuthenticated() {
  const adminCookie = cookies().get('admin_authenticated')
  return adminCookie?.value === 'true'
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
  }

  const key = request.nextUrl.searchParams.get('key')

  if (!key) {
    return NextResponse.json({ success: false, message: 'key parametresi zorunlu' }, { status: 400 })
  }

  try {
    let data

    switch (key) {
      case SERVICES_PAGE_KEY:
        data = await getServicesPageContent()
        break
      case ACADEMY_PAGE_KEY:
        data = await getAcademyPageContent()
        break
      case MOVEMENT_TRAINING_PAGE_KEY:
        data = await getMovementTrainingPageContent()
        break
      case ABOUT_PAGE_KEY:
        data = await getAboutPageContent()
        break
      case CONTACT_PAGE_KEY:
        data = await getContactPageContent()
        break
      default:
        return NextResponse.json({ success: false, message: 'Desteklenmeyen key' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[AdminPages][GET] error', error)
    return NextResponse.json({ success: false, message: 'Veri yüklenirken bir hata oluştu' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)

  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ success: false, message: 'Geçersiz istek gövdesi' }, { status: 400 })
  }

  const { key, value } = payload as { key?: string; value?: unknown }

  if (!key || typeof key !== 'string') {
    return NextResponse.json({ success: false, message: 'key alanı zorunludur' }, { status: 400 })
  }

  if (value === undefined) {
    return NextResponse.json({ success: false, message: 'value alanı zorunludur' }, { status: 400 })
  }

  try {
    switch (key) {
      case SERVICES_PAGE_KEY: {
        // Gelen içeriği direkt kaydet, merge yerine
        const content = value as any
        // Eksik alanları default değerlerle doldur
        const merged: ServicesPageContent = {
          hero: content.hero || defaultServicesPageContent.hero,
          services: content.services || defaultServicesPageContent.services,
          cta: content.cta || defaultServicesPageContent.cta,
        }
        await saveServicesPageContent(merged)
        return NextResponse.json({ success: true, data: merged })
      }
      case ACADEMY_PAGE_KEY: {
        const content = value as any
        const merged: AcademyPageContent = {
          hero: content.hero || defaultAcademyPageContent.hero,
          sections: content.sections || defaultAcademyPageContent.sections,
          cta: content.cta || defaultAcademyPageContent.cta,
        }
        await saveAcademyPageContent(merged)
        return NextResponse.json({ success: true, data: merged })
      }
      case MOVEMENT_TRAINING_PAGE_KEY: {
        const content = value as any
        const merged: MovementTrainingPageContent = {
          hero: content.hero || defaultMovementTrainingPageContent.hero,
          sections: content.sections || defaultMovementTrainingPageContent.sections,
          benefits: content.benefits || defaultMovementTrainingPageContent.benefits,
          cta: content.cta || defaultMovementTrainingPageContent.cta,
        }
        await saveMovementTrainingPageContent(merged)
        return NextResponse.json({ success: true, data: merged })
      }
      case ABOUT_PAGE_KEY: {
        const content = value as any
        const merged: AboutPageContent = {
          hero: content.hero || defaultAboutPageContent.hero,
          mission: content.mission || defaultAboutPageContent.mission,
          vision: content.vision || defaultAboutPageContent.vision,
          values: content.values || defaultAboutPageContent.values,
          stats: content.stats || defaultAboutPageContent.stats,
          cta: content.cta || defaultAboutPageContent.cta,
        }
        await saveAboutPageContent(merged)
        return NextResponse.json({ success: true, data: merged })
      }
      case CONTACT_PAGE_KEY: {
        const content = value as any
        const merged: ContactPageContent = {
          hero: content.hero || defaultContactPageContent.hero,
          contact: content.contact || defaultContactPageContent.contact,
          form: content.form || defaultContactPageContent.form,
          map: content.map || defaultContactPageContent.map,
        }
        await saveContactPageContent(merged)
        return NextResponse.json({ success: true, data: merged })
      }
      default:
        return NextResponse.json({ success: false, message: 'Desteklenmeyen key' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('[AdminPages][PUT] error', error)
    console.error('[AdminPages][PUT] error details', error?.message, error?.stack)
    return NextResponse.json({ 
      success: false, 
      message: 'Kayıt sırasında bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }, { status: 500 })
  }
}

