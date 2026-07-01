import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { SongCard } from '@/components/SongCard'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import Image from 'next/image'
import type { AppLocale } from '@/i18n'
import type { Song, Category } from '@/lib/supabase/types'

type SongRow = Song & { categories: Category | null }

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
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="Laopraise"
          fill
          className="object-cover object-center"
          priority
        />
        {/* top nav overlay */}
        <div className="absolute inset-x-0 top-0 z-10 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-white/60 to-transparent">
          <span className="font-bold text-amber-900 text-lg drop-shadow-sm">Laopraise</span>
          <LanguageSwitcher currentLocale={locale} />
        </div>
        {/* bottom gradient + content */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-50 via-amber-50/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 flex flex-col items-center text-center gap-3">
          <h1 className="text-2xl font-bold text-amber-900 drop-shadow-sm">{t('hero_title')}</h1>
          <p className="text-amber-700 text-sm drop-shadow-sm">{t('hero_sub')}</p>
          <form method="GET" className="w-full max-w-sm">
            <input
              name="q"
              defaultValue={query}
              placeholder={t('search_placeholder')}
              className="w-full px-4 py-3 rounded-2xl border border-amber-200 bg-white/90 backdrop-blur shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
            />
          </form>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">

        {/* Categories */}
        {!query && categories && categories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-amber-900">{t('section_categories')}</h2>
              <Link href={`/${locale}/categories`} className="text-xs text-amber-600">{t('see_all')}</Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.slice(0, 6).map(cat => (
                <Link
                  key={cat.id}
                  href={`/${locale}/categories?cat=${cat.id}`}
                  className="bg-white rounded-xl p-3 border border-amber-100 hover:border-amber-300 transition-colors"
                >
                  <p className="font-medium text-amber-900 text-sm truncate">
                    {(cat.name as Record<string, string>)[locale] || (cat.name as Record<string, string>)['lo']}
                  </p>
                  <p className="text-xs text-amber-500 mt-0.5">
                    {t('songs_count', { count: (cat as { songs?: { count: number }[] }).songs?.[0]?.count ?? 0 })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Songs grid */}
        <section>
          <h2 className="font-bold text-amber-900 mb-3">
            {query ? `🔍 "${query}"` : t('section_latest')}
          </h2>
          {songs && songs.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {songs.map(song => (
                <SongCard key={song.id} song={song as unknown as SongRow} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="text-center text-amber-500 py-8 text-sm">
              {query ? 'ບໍ່ພົບເພງ / ไม่พบเพลง / Song not found' : 'ຍັງບໍ່ມີເພງ'}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
