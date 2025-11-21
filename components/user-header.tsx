"use client"

import React from "react"
import { useState, useEffect } from "react"
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
import {
  User,
  Play,
  Users,
  Calendar,
  Settings,
  LogOut,
  LogIn,
  Home,
  Video,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UserHeaderProps {
  className?: string
}

export function UserHeader({ className }: UserHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch('/api/user/profile')
        const data = await response.json()
        if (data.success) {
          setUserData(data.data)
        }
      } catch (error) {
        console.error("User data load error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; max-age=0'
    router.push('/auth')
  }

  const navItems = [
    { href: '/videos', label: 'Videolar', icon: Play },
    { href: '/member/squads', label: 'Kadrolar', icon: Users },
    { href: '/member/matches', label: 'Maç Verilerim', icon: Calendar },
    { href: '/matches', label: 'Maç Analizleri', icon: Calendar },
  ]

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm", className)}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/member/dashboard" className="flex items-center space-x-3">
            <Image
              src="/logohedef.png"
              alt="Hedef Performans Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                Hedef Performans
              </span>
              <span className="text-xs text-gray-500">Üye Paneli</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
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
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200"
                  >
                    <User className="h-5 w-5 text-gray-700" />
                    <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-900">
                        {userData.firstName || userData.user?.firstName} {userData.lastName || userData.user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-gray-600">
                        {userData.email || userData.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/member/dashboard')} className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/videos')} className="cursor-pointer">
                    <Video className="mr-2 h-4 w-4" />
                    Videolarım
                  </DropdownMenuItem>
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
            ) : (
              <Button asChild size="sm" className="bg-red-600 text-white hover:bg-red-700">
                <Link href="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Giriş Yap
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
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
                    onClick={() => setIsOpen(false)}
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


