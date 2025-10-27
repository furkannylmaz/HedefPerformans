import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-turf-bg flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-turf-card border-turf-border">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">404</div>
          <CardTitle className="text-[#111111]">Sayfa Bulunamadı</CardTitle>
          <CardDescription className="text-[#111111]">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-[#111111]">
              Ana sayfaya dönmek için aşağıdaki butonu kullanabilirsiniz.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              className="flex-1 bg-neon-green text-black hover:bg-field-green font-bold"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="flex-1 border-turf-border text-[#111111]"
            >
              <Link href="/videos">
                <Search className="h-4 w-4 mr-2" />
                Videolar
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

