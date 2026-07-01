import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { SongCard } from '@/components/SongCard'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import Image from 'next/image'
import type { AppLocale } from '@/i18n'
import type { Song, Category } from '@/lib/supabase/types'

type SongRow = Song & { categories: Category | null }

const CAT_COLORS = [
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-sky-400 to-blue-500',
  'from-purple-400 to-violet-500',
  'from-rose-400 to-pink-500',
  'from-lime-400 to-green-500',
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
    <div className="min-h-screen bg-stone-50">

      {/* ── HERO ── */}
      <div className="relative h-screen overflow-hidden">
        <Image
          src="/images/Background.jpg"
          alt="Laopraise"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-white/5 to-stone-50" />

        {/* NAV */}
        <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-900/85 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-white text-base">🎵</span>
            </div>
            <span className="font-bold text-amber-950 text-lg tracking-tight" style={{ textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
              Laopraise
            </span>
          </div>
          <LanguageSwitcher currentLocale={locale} />
        </nav>

        {/* CENTER CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center gap-6 pb-16">
          <div className="space-y-3">
            <h1
              className="text-4xl sm:text-5xl font-bold text-amber-950 tracking-tight leading-tight"
              style={{ textShadow: '0 2px 8px rgba(255,255,255,0.7)' }}
            >
              {t('hero_title')}
            </h1>
            <p
              className="text-amber-800/75 text-sm sm:text-base italic max-w-xs mx-auto"
              style={{ textShadow: '0 1px 4px rgba(255,255,255,0.6)' }}
            >
              &ldquo;I will sing of you among the peoples.&rdquo; — Ps 108:3
            </p>
          </div>

          {/* Search bar */}
          <form method="GET" className="w-full max-w-md">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 text-base pointer-events-none">🔍</span>
              <input
                name="q"
                defaultValue={query}
                placeholder={t('search_placeholder')}
                className="w-full pl-11 pr-5 py-4 rounded-2xl bg-white/88 backdrop-blur-md border border-white/70 shadow-xl text-sm text-amber-900 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/95"
              />
            </div>
          </form>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-7 inset-x-0 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-amber-800/30 flex items-start justify-center pt-1">
            <div className="w-1 h-2 rounded-full bg-amber-800/40" />
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">

        {/* Categories — horizontal scroll */}
        {!query && categories && categories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-amber-950">{t('section_categories')}</h2>
              <Link href={`/${locale}/categories`} className="text-sm text-amber-600 font-medium hover:text-amber-800">
                {t('see_all')} →
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/categories?cat=${cat.id}`}
                  className={`flex-shrink-0 rounded-2xl p-4 bg-gradient-to-br ${CAT_COLORS[i % CAT_COLORS.length]} text-white min-w-[140px] hover:scale-[1.04] transition-transform shadow-md active:scale-95`}
                >
                  <p className="font-semibold text-sm leading-snug">
                    {(cat.name as Record<string, string>)[locale] || (cat.name as Record<string, string>)['lo']}
                  </p>
                  <p className="text-white/70 text-xs mt-1.5">
                    {(cat as { songs?: { count: number }[] }).songs?.[0]?.count ?? 0} ເພງ
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Songs list */}
        <section>
          <h2 className="text-lg font-bold text-amber-950 mb-4">
            {query ? `🔍 &ldquo;${query}&rdquo;` : t('section_latest')}
          </h2>
          {songs && songs.length > 0 ? (
            <div className="flex flex-col gap-3">
              {songs.map(song => (
                <SongCard key={song.id} song={song as unknown as SongRow} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎵</p>
              <p className="text-amber-400 text-sm">
                {query ? 'ບໍ່ພົບເພງ / ไม่พบเพลง / Song not found' : 'ຍັງບໍ່ມີເພງ'}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
