"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, LogOut, Home, Users, Users2, Image as ImageIcon, FileText, Info } from "lucide-react"

type AdminNavKey = 'users' | 'squads' | 'sliders' | 'homepage' | 'siteInfo' | 'pages'

const adminLinks: { key: AdminNavKey; href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'sliders', href: '/admin/sliders', label: 'Slider Yönetimi', icon: ImageIcon },
  { key: 'homepage', href: '/admin/homepage', label: 'Tanıtım İçeriği', icon: FileText },
  { key: 'siteInfo', href: '/admin/site-info', label: 'Site Bilgileri', icon: Info },
  { key: 'pages', href: '/admin/pages', label: 'Sayfa Yönetimi', icon: FileText },
]

export function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    document.cookie = 'admin_authenticated=; path=/; max-age=0'
    router.push('/')
  }

  const currentPage = pathname.split('/').pop() as AdminNavKey

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/admin/users" className="flex items-center space-x-3">
            <Image
              src="/logohedef.png"
              alt="Hedef Performans Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                Admin Panel
              </span>
              <span className="text-xs text-gray-500">Hedef Performans</span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:bg-gray-100"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Siteyi Görüntüle
              </Link>
            </Button>

            <Button
              asChild
              variant={pathname === '/admin/users' ? 'default' : 'ghost'}
              size="sm"
              className={
                pathname === '/admin/users'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            >
              <Link href="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                Kullanıcı Yönetimi
              </Link>
            </Button>

            <Button
              asChild
              variant={pathname === '/admin/squads' ? 'default' : 'ghost'}
              size="sm"
              className={
                pathname === '/admin/squads'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            >
              <Link href="/admin/squads">
                <Users2 className="h-4 w-4 mr-2" />
                Kadro Yönetimi
              </Link>
            </Button>

            {/* Ayarlar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:bg-gray-100 hover:text-red-600"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Ayarlar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Yönetim Menüsü</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {adminLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = currentPage === link.key || pathname === link.href
                  if (!Icon) return null
                  return (
                    <DropdownMenuItem
                      key={link.key}
                      className={isActive ? "bg-red-50 text-red-600" : ""}
                      onClick={() => router.push(link.href)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {link.label}
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
