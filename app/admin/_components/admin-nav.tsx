import Link from 'next/link'
import { Button } from '@/components/ui/button'

type AdminNavKey = 'users' | 'squads' | 'matches' | 'sliders' | 'homepage' | 'siteInfo'

interface AdminNavProps {
  active: AdminNavKey
}

const links: { key: AdminNavKey; href: string; label: string }[] = [
  { key: 'users', href: '/admin/users', label: 'Kullanıcı Yönetimi' },
  { key: 'squads', href: '/admin/squads', label: 'Kadro Yönetimi' },
  { key: 'matches', href: '/admin/matches', label: 'Maç Yönetimi' },
  { key: 'sliders', href: '/admin/sliders', label: 'Slider Yönetimi' },
  { key: 'homepage', href: '/admin/homepage', label: 'Tanıtım İçeriği' },
  { key: 'siteInfo', href: '/admin/site-info', label: 'Site Bilgileri' },
]

export function AdminNav({ active }: AdminNavProps) {
  return (
    <div className="mb-6 overflow-x-auto scroll-smooth">
      <div className="flex gap-2 min-w-max">
        {links.map((link) => {
          const isActive = link.key === active
          return (
            <Button
              key={link.key}
              asChild
              size="sm"
              variant={isActive ? 'default' : 'outline'}
              className={
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black hover:from-emerald-600 hover:to-emerald-700 font-semibold shadow-lg shadow-emerald-500/50'
                  : 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300'
              }
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

