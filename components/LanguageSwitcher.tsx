'use client'
import { useRouter, usePathname } from 'next/navigation'
import { locales, type AppLocale } from '@/i18n'

const LABELS: Record<AppLocale, string> = {
  lo: 'ລາວ', th: 'ไทย', en: 'EN', ko: '한국어',
}

export function LanguageSwitcher({ currentLocale }: { currentLocale: AppLocale }) {
  const router   = useRouter()
  const pathname = usePathname()

  function switchTo(locale: AppLocale) {
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${locale}`)
    router.push(newPath)
  }

  return (
    <div className="flex gap-1">
      {locales.map(l => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
            l === currentLocale
              ? 'bg-amber-900 text-white'
              : 'text-amber-700 hover:bg-amber-100'
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  )
}
