import { AdminHeader } from "@/app/admin/_components/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {children}
      </main>
    </div>
  )
}
