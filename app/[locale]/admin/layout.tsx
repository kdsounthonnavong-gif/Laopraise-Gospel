import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { AppLocale } from '@/i18n'

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: AppLocale }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  return (
    <div className="min-h-screen bg-amber-50">
      <nav className="bg-amber-900 text-white px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-amber-200 text-sm">← Site</Link>
        <span className="font-bold text-sm">Admin — Laopraise</span>
        <span className="text-amber-300 text-xs">{user.email}</span>
      </nav>

      <div className="bg-amber-800 px-4 flex gap-1">
        {[
          { href: `/${locale}/admin/songs`,      label: '🎵 ເພງ' },
          { href: `/${locale}/admin/categories`, label: '📂 ໝວດ' },
          { href: `/${locale}/admin/users`,      label: '👤 ຜູ້ໃຊ້' },
        ].map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className="px-4 py-2.5 text-xs text-amber-200 hover:text-white hover:bg-amber-700 rounded-t-lg transition-colors"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
