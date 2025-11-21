import { NextRequest, NextResponse } from 'next/server'
import { getSiteInfo } from '@/lib/site-settings'

// Dynamic route - build-time execution'ı önle
export const dynamic = 'force-dynamic'

// Kullanıcılar için site bilgilerini getir (sadece okuma)
export async function GET(request: NextRequest) {
  try {
    const data = await getSiteInfo()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[UserSiteInfo][GET] error', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Site bilgileri yüklenirken bir hata oluştu' 
    }, { status: 500 })
  }
}

