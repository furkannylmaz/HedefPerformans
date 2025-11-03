import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { getServicesPageContent } from "@/lib/site-settings"

export default async function ServicesPage() {
  const content = await getServicesPageContent()

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
              Bireysel Hizmetlerimiz
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

      {/* Services Grid */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.services
              .sort((a, b) => a.order - b.order)
              .map((service) => (
                <Card
                  key={service.id}
                  className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-red-200"
                >
                  {service.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={service.imageUrl}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 mb-2">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-red-600 font-medium text-base">
                      {service.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
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

