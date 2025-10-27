"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Error object geçersiz olabilir, hiçbir şey loglamıyoruz
  }, [])

  return (
    <div className="min-h-screen bg-turf-bg flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-turf-card border-turf-border">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-error-red mx-auto mb-4" />
          <CardTitle className="text-[#111111]">Bir Hata Oluştu</CardTitle>
          <CardDescription className="text-[#111111]">
            Üzgünüz, bir şeyler ters gitti.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-[#111111]">
              Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={reset}
              className="flex-1 bg-neon-green text-black hover:bg-field-green font-bold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tekrar Dene
            </Button>
            <Button
              variant="outline"
              asChild
              className="flex-1 border-turf-border text-[#111111]"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

