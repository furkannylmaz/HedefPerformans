"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Shield, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AdminAuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Basit admin kontrolü - Gerçek sisteme göre değiştirilecek
      if (email === "admin@hedefperformans.com" && password === "admin123") {
        // Admin cookie'sini set et
        document.cookie = "admin_authenticated=true; path=/; max-age=86400" // 24 saat
        
        toast.success("Giriş başarılı!")
        router.push('/admin/users')
      } else {
        toast.error("E-posta veya şifre hatalı!")
      }
    } catch (error) {
      toast.error("Giriş yapılırken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <Card className="relative z-10 max-w-md w-full bg-white border-gray-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-3">
            <Image
              src="/logohedef.png"
              alt="Hedef Performans Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
            />
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              <span className="text-xs text-gray-500">Hedef Performans</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Yönetici Girişi</CardTitle>
          <CardDescription className="text-gray-600">
            Admin paneline erişmek için giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hedefperformans.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-red-600 focus:ring-red-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-red-600 focus:ring-red-600"
              />
            </div>


            <Button 
              type="submit" 
              className="w-full bg-red-600 text-white hover:bg-red-700 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
