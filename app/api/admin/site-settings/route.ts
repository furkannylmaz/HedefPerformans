import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Dynamic route - build-time execution'ı önle
export const dynamic = 'force-dynamic'
import {
  HOMEPAGE_SETTING_KEY,
  SITE_INFO_SETTING_KEY,
  getHomepageContent,
  getSiteInfo,
  saveHomepageContent,
  saveSiteInfo,
  mergeSiteInfo,
} from '@/lib/site-settings'
import { mergeHomepageContent } from '@/lib/homepage-content'

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

  if (key === HOMEPAGE_SETTING_KEY) {
    const data = await getHomepageContent()
    return NextResponse.json({ success: true, data })
  }

  if (key === SITE_INFO_SETTING_KEY) {
    const data = await getSiteInfo()
    return NextResponse.json({ success: true, data })
  }

  return NextResponse.json({ success: false, message: 'Desteklenmeyen key' }, { status: 400 })
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
    if (key === HOMEPAGE_SETTING_KEY) {
      const merged = mergeHomepageContent(value as any)
      await saveHomepageContent(merged)
      return NextResponse.json({ success: true, data: merged })
    }

    if (key === SITE_INFO_SETTING_KEY) {
      const merged = mergeSiteInfo(value as any)
      await saveSiteInfo(merged)
      return NextResponse.json({ success: true, data: merged })
    }

    return NextResponse.json({ success: false, message: 'Desteklenmeyen key' }, { status: 400 })
  } catch (error) {
    console.error('[SiteSettings][PUT] error', error)
    
    // Detaylı error logging
    if (error instanceof Error) {
      console.error('[SiteSettings][PUT] Error message:', error.message)
      console.error('[SiteSettings][PUT] Error stack:', error.stack)
      
      // Database connection error
      if (error.message.includes('DATABASE_URL') || error.message.includes('connect')) {
        console.error('[SiteSettings][PUT] Database connection error detected')
        return NextResponse.json({ 
          success: false, 
          message: 'Veritabanı bağlantı hatası. Lütfen yöneticiye bildirin.',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Kayıt sırasında bir hata oluştu',
      error: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Bilinmeyen hata')
        : undefined
    }, { status: 500 })
  }
}

