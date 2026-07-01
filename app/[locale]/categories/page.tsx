import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { SongCard } from '@/components/SongCard'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import type { AppLocale } from '@/i18n'
import type { Song, Category } from '@/lib/supabase/types'

type SongRow = Song & { categories: Category | null }

export default async function CategoriesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale }
  searchParams: { cat?: string }
}) {
  const t        = await getTranslations()
  const supabase = createClient()

  const { data: allCats } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  const parents  = (allCats ?? []).filter(c => !c.parent_id)
  const children = (allCats ?? []).filter(c =>  c.parent_id)

  let songs: SongRow[] = []
  const selectedCat = allCats?.find(c => c.id === searchParams.cat)

  if (searchParams.cat) {
    const { data } = await supabase
      .from('songs')
      .select('*, categories(*)')
      .eq('category_id', searchParams.cat)
      .order('created_at', { ascending: false })
    songs = (data ?? []) as unknown as SongRow[]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100/50">
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-amber-100 px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-bold text-amber-900">🎵 Laopraise</Link>
        <LanguageSwitcher currentLocale={locale} />
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <h1 className="font-bold text-amber-900 text-xl">{t('nav_categories')}</h1>

        {/* Category tree */}
        <div className="space-y-4">
          {parents.map(parent => {
            const kids = children.filter(c => c.parent_id === parent.id)
            const name = (parent.name as Record<string, string>)[locale] || (parent.name as Record<string, string>)['lo']
            return (
              <div key={parent.id} className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
                <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
                  <p className="font-bold text-amber-900 text-sm">📂 {name}</p>
                </div>
                <div className="divide-y divide-amber-50">
                  {kids.length > 0
                    ? kids.map(child => {
                        const cName = (child.name as Record<string, string>)[locale] || (child.name as Record<string, string>)['lo']
                        return (
                          <Link
                            key={child.id}
                            href={`/${locale}/categories?cat=${child.id}`}
                            className={`flex items-center justify-between px-4 py-3 hover:bg-amber-50 transition-colors ${searchParams.cat === child.id ? 'bg-amber-50' : ''}`}
                          >
                            <span className="text-sm text-amber-800">{cName}</span>
                          </Link>
                        )
                      })
                    : (
                      <Link
                        href={`/${locale}/categories?cat=${parent.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-amber-50"
                      >
                        <span className="text-sm text-amber-500">{t('see_all')}</span>
                      </Link>
                    )
                  }
                </div>
              </div>
            )
          })}
        </div>

        {/* Songs in selected category */}
        {selectedCat && (
          <section>
            <h2 className="font-bold text-amber-900 mb-3">
              {(selectedCat.name as Record<string, string>)[locale] || (selectedCat.name as Record<string, string>)['lo']}
            </h2>
            {songs.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {songs.map(song => <SongCard key={song.id} song={song} locale={locale} />)}
              </div>
            ) : (
              <p className="text-center text-amber-400 py-6 text-sm">ຍັງບໍ່ມີເພງ</p>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
