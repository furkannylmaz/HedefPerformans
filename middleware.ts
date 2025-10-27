import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log(`🔍 [MIDDLEWARE] Path: ${pathname}`)
  
  // SADECE admin sayfa route'ları için kontrol
  // API route'ları, auth sayfası ve upload sayfaları hariç
  if (
    pathname.startsWith('/admin') && 
    !pathname.startsWith('/api/admin') && 
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
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}

