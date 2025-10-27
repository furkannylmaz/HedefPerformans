"use client"

import { useState } from "react"
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
    <div className="min-h-screen bg-turf-bg flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-turf-card border-turf-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neon-green">
            <Shield className="h-6 w-6 text-black" />
          </div>
          <CardTitle className="text-[#111111]">Admin Girişi</CardTitle>
          <CardDescription className="text-[#111111]">
            Yönetim paneline erişmek için giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#111111]">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hedefperformans.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-turf-border text-[#111111]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#111111]">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-turf-border text-[#111111]"
              />
            </div>

            <div className="bg-turf-bg p-3 rounded-lg border border-turf-border">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <p className="text-xs text-[#111111]">
                  Demo: admin@hedefperformans.com / admin123
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-neon-green text-black hover:bg-field-green font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
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


