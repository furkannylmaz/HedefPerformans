"use client"

import React, { useState } from "react"
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
import { Settings, LogOut, Home, Users, Users2, Image as ImageIcon, FileText, Info, Calendar, Menu, X } from "lucide-react"

type AdminNavKey = 'users' | 'squads' | 'matches' | 'sliders' | 'homepage' | 'siteInfo' | 'pages'

const adminLinks: { key: AdminNavKey; href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'sliders', href: '/admin/sliders', label: 'Slider Yönetimi', icon: ImageIcon },
  { key: 'homepage', href: '/admin/homepage', label: 'Tanıtım İçeriği', icon: FileText },
  { key: 'siteInfo', href: '/admin/site-info', label: 'Site Bilgileri', icon: Info },
  { key: 'pages', href: '/admin/pages', label: 'Sayfa Yönetimi', icon: FileText },
]

export function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    document.cookie = 'admin_authenticated=; path=/; max-age=0'
    router.push('/')
  }

  const currentPage = pathname.split('/').pop() as AdminNavKey

  const mainNavItems = [
    { href: '/admin/users', label: 'Kullanıcı Yönetimi', icon: Users },
    { href: '/admin/squads', label: 'Kadro Yönetimi', icon: Users2 },
    { href: '/admin/matches', label: 'Maç Yönetimi', icon: Calendar },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/admin/users" className="flex items-center space-x-3 flex-shrink-0">
            <Image
              src="/logohedef.png"
              alt="Hedef Performans Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                Admin Panel
              </span>
              <span className="text-xs text-gray-500">Hedef Performans</span>
            </div>
            <span className="sm:hidden text-lg font-bold text-gray-900">Admin</span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
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

            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={
                    isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                </Button>
              )
            })}

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

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:bg-gray-100"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:bg-gray-100 hover:text-red-600"
                >
                  <Settings className="h-5 w-5" />
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              {mainNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant={isActive ? 'default' : 'ghost'}
                    className={
                      isActive
                        ? 'bg-red-600 text-white hover:bg-red-700 justify-start'
                        : 'justify-start text-gray-700 hover:bg-gray-100'
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
