import { UserHeader } from "@/components/user-header"

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <main className="container mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {children}
      </main>
    </div>
  )
}

