import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { SongCard } from '@/components/SongCard'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import Image from 'next/image'
import type { AppLocale } from '@/i18n'
import type { Song, Category } from '@/lib/supabase/types'

type SongRow = Song & { categories: Category | null }

const CAT_ITEMS = [
  { grad: 'from-amber-400 to-orange-500',   shadow: 'shadow-orange-400/25', icon: '🙏' },
  { grad: 'from-emerald-400 to-teal-500',   shadow: 'shadow-teal-400/25',   icon: '🎶' },
  { grad: 'from-sky-400 to-blue-500',       shadow: 'shadow-blue-400/25',   icon: '⭐' },
  { grad: 'from-violet-400 to-purple-600',  shadow: 'shadow-purple-400/25', icon: '💧' },
  { grad: 'from-rose-400 to-pink-600',      shadow: 'shadow-rose-400/25',   icon: '🕊️' },
  { grad: 'from-lime-400 to-green-500',     shadow: 'shadow-green-400/25',  icon: '🌿' },
]

export default async function HomePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale }
  searchParams: { q?: string }
}) {
  const t        = await getTranslations()
  const supabase = createClient()
  const query    = searchParams.q?.trim() ?? ''

  let songsQuery = supabase
    .from('songs')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })
    .limit(20)

  if (query) {
    const safe = query.replace(/[,()*:\\]/g, '')
    songsQuery = songsQuery.or(
      ['lo', 'th', 'en', 'ko'].map(l => `title->${l}.ilike.%${safe}%`).join(',')
    )
  }

  const { data: songs } = await songsQuery

  const { data: categories } = await supabase
    .from('categories')
    .select('*, songs(count)')
    .is('parent_id', null)
    .order('sort_order')

  return (
    <div className="min-h-screen bg-[#F8FAFB]">

      {/* ── HERO: Morning Glory ── */}
      <div className="relative h-screen overflow-hidden">
        <Image
          src="/images/Background.jpg"
          alt="Laopraise"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0" style={{background:'linear-gradient(to bottom,rgba(255,255,255,0.08) 0%,transparent 20%,transparent 87%,rgba(248,252,255,0.55) 94%,#F8FAFB 100%)'}} />

        {/* NAV */}
        <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-400/35">
              <span className="text-white text-lg">🎵</span>
            </div>
            <span className="font-bold text-sky-950 text-lg tracking-tight" style={{ textShadow: '0 1px 6px rgba(255,255,255,0.9)' }}>
              Laopraise
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <Link
              href={`/${locale}/auth/login`}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 text-white text-sm font-semibold shadow-md shadow-sky-400/30 hover:shadow-sky-400/50 transition-shadow"
            >
              ເຂົ້າສູ່ລະບົບ
            </Link>
          </div>
        </nav>

        {/* CENTER CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center gap-6 pb-16">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.18em] text-sky-500 font-semibold uppercase">
              Gospel Song Library
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-sky-950 tracking-tight leading-tight"
              style={{ textShadow: '0 2px 12px rgba(255,255,255,0.9)' }}
            >
              {t('hero_title')}
            </h1>
            <p className="text-sky-900/50 text-sm sm:text-base italic max-w-xs mx-auto">
              &ldquo;I will sing of you among the peoples.&rdquo; — Ps 108:3
            </p>
          </div>

          {/* Search */}
          <form method="GET" className="w-full max-w-md">
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-300 text-base pointer-events-none">🔍</span>
              <input
                name="q"
                defaultValue={query}
                placeholder={t('search_placeholder')}
                className="w-full pl-12 pr-5 py-4 rounded-3xl bg-white/82 backdrop-blur-xl border-[1.5px] border-sky-200/70 text-sky-950 placeholder:text-sky-400/60 text-sm shadow-xl shadow-sky-200/40 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400"
              />
            </div>
          </form>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-sky-400/35 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2.5 rounded-full bg-sky-400/45" />
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">

        {/* Categories */}
        {!query && categories && categories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-sky-950">{t('section_categories')}</h2>
              <Link href={`/${locale}/categories`} className="text-sm text-sky-500 font-semibold hover:text-sky-700">
                {t('see_all')} →
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat, i) => {
                const item = CAT_ITEMS[i % CAT_ITEMS.length]
                return (
                  <Link
                    key={cat.id}
                    href={`/${locale}/categories?cat=${cat.id}`}
                    className="flex-shrink-0 rounded-2xl p-4 bg-white border-[1.5px] border-sky-100 min-w-[130px] hover:border-sky-300 hover:shadow-lg hover:shadow-sky-200/40 transition-all active:scale-95"
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.grad} flex items-center justify-center text-sm mb-3 shadow-md ${item.shadow}`}>
                      {item.icon}
                    </div>
                    <p className="font-semibold text-sky-950 text-sm leading-snug">
                      {(cat.name as Record<string, string>)[locale] || (cat.name as Record<string, string>)['lo']}
                    </p>
                    <p className="text-sky-400 text-xs mt-1">
                      {(cat as { songs?: { count: number }[] }).songs?.[0]?.count ?? 0} ເພງ
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Songs */}
        <section>
          <h2 className="text-base font-bold text-sky-950 mb-4">
            {query ? `🔍 "${query}"` : t('section_latest')}
          </h2>
          {songs && songs.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {songs.map(song => (
                <SongCard key={song.id} song={song as unknown as SongRow} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎵</p>
              <p className="text-sky-400 text-sm">
                {query ? 'ບໍ່ພົບເພງ / Song not found' : 'ຍັງບໍ່ມີເພງ'}
              </p>
            </div>
          )}
        </section>

        <div className="text-center pt-6 border-t border-sky-100">
          <p className="text-sky-300 text-xs tracking-widest uppercase">Laopraise Gospel Library</p>
        </div>
      </div>
    </div>
  )
}
