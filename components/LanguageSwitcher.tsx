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
    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(186,214,232,0.7)', borderRadius: 20, padding: 3, gap: 1, backdropFilter: 'blur(10px)' }}>
      {locales.map(l => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          style={l === currentLocale ? {
            padding: '5px 11px', borderRadius: 16, fontSize: 11, fontWeight: 600,
            border: 'none', cursor: 'pointer', fontFamily: 'sans-serif', color: 'white',
            background: 'linear-gradient(135deg,#38BDF8,#0EA5E9)',
            boxShadow: '0 1px 4px rgba(14,165,233,0.3)',
          } : {
            padding: '5px 11px', borderRadius: 16, fontSize: 11, fontWeight: 500,
            border: 'none', cursor: 'pointer', fontFamily: 'sans-serif',
            background: 'transparent', color: '#4A7A9B',
          }}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  )
}
