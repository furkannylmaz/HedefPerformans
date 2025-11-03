import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Target, Eye, Heart, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { getAboutPageContent } from "@/lib/site-settings"

export const dynamic = 'force-dynamic'

const valueIcons = {
  scientific: Award,
  excellence: Target,
  passion: Heart,
  integrity: Eye,
}

export default async function AboutPage() {
  const content = await getAboutPageContent()

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      {/* Hero Section */}
      <section 
        className="relative py-20 px-6 sm:px-8 lg:px-12"
        style={{
          backgroundImage: content.hero.backgroundImage 
            ? `linear-gradient(to bottom right, rgba(239, 68, 68, 0.1), rgba(255, 255, 255, 0.8), rgba(239, 68, 68, 0.1)), url(${content.hero.backgroundImage})`
            : undefined,
          backgroundColor: !content.hero.backgroundImage ? '#fef2f2' : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-4">
              {content.hero.subtitle}
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {content.hero.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                  <Target className="h-6 w-6 text-red-600" />
                  {content.mission.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">{content.mission.description}</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-red-600" />
                  {content.vision.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">{content.vision.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-red-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-4xl font-bold">{content.stats.trainers}+</CardTitle>
                <CardDescription className="text-red-100 text-lg">Antrenör</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-red-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-4xl font-bold">{content.stats.students}+</CardTitle>
                <CardDescription className="text-red-100 text-lg">Öğrenci</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              {content.values.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.values.items.map((value) => {
                const Icon = valueIcons[value.id as keyof typeof valueIcons] || Heart
                return (
                  <Card
                    key={value.id}
                    className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-red-200"
                  >
                    <CardHeader>
                      <Icon className="h-8 w-8 text-red-600 mb-2" />
                      <CardTitle className="text-xl text-gray-900">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.cta.title}</h2>
          <p className="text-xl mb-8 text-red-100">{content.cta.description}</p>
          <Button
            asChild
            size="lg"
            className="bg-white text-red-600 hover:bg-gray-100"
          >
            <Link href={content.cta.buttonLink}>
              {content.cta.buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

