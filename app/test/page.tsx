export default function TestPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Hedef Performans - Test
        </h1>
        <p className="text-muted-foreground mb-8">
          Proje başarıyla çalışıyor!
        </p>
        <div className="space-y-4">
          <a 
            href="/auth" 
            className="block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Auth Sayfasına Git
          </a>
          <a 
            href="/videos" 
            className="block bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Videos Sayfasına Git
          </a>
          <a 
            href="/matches" 
            className="block bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Matches Sayfasına Git
          </a>
        </div>
      </div>
    </div>
  )
}
