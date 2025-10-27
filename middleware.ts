import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log(`🔍 [MIDDLEWARE] Path: ${pathname}`)
  
  // Admin sayfa route'ları için kontrol (auth sayfası ve upload sayfaları hariç)
  if (
    pathname.startsWith('/admin') && 
    pathname !== '/admin/auth' &&
    !pathname.includes('/upload')
  ) {
    // Admin cookie kontrolü
    const isAdmin = request.cookies.get('admin_authenticated')
    
    console.log(`🔍 [MIDDLEWARE] Admin cookie: ${isAdmin?.value}`)
    
    if (!isAdmin || isAdmin.value !== 'true') {
      console.log(`❌ [MIDDLEWARE] Redirecting to /admin/auth`)
      // Admin giriş sayfasına yönlendir
      return NextResponse.redirect(new URL('/admin/auth', request.url))
    }
  }
  
  // Admin API route'ları için kontrol
  if (pathname.startsWith('/api/admin')) {
    // Admin cookie kontrolü
    const isAdmin = request.cookies.get('admin_authenticated')
    
    console.log(`🔍 [MIDDLEWARE] API Admin cookie: ${isAdmin?.value}`)
    
    if (!isAdmin || isAdmin.value !== 'true') {
      console.log(`❌ [MIDDLEWARE] Unauthorized API access`)
      // 401 Unauthorized döndür
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}

