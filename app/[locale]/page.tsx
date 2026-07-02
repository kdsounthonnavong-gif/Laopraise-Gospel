import { createClient } from '@/lib/supabase/server'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SongCard } from '@/components/SongCard'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import Image from 'next/image'
import type { AppLocale } from '@/i18n'
import type { Song, Category } from '@/lib/supabase/types'

type SongRow = Song & { categories: Category | null }

const CAT_ITEMS = [
  { grad: 'from-[#F59E0B] to-[#F97316]', shadow: '0 2px 8px rgba(249,115,22,0.25)', icon: '🙏' },
  { grad: 'from-[#34D399] to-[#0D9488]', shadow: '0 2px 8px rgba(13,148,136,0.25)',  icon: '🎶' },
  { grad: 'from-[#38BDF8] to-[#3B82F6]', shadow: '0 2px 8px rgba(59,130,246,0.25)', icon: '⭐' },
  { grad: 'from-[#A78BFA] to-[#7C3AED]', shadow: '0 2px 8px rgba(124,58,237,0.25)', icon: '💧' },
  { grad: 'from-[#FB7185] to-[#E11D48]', shadow: '0 2px 8px rgba(225,29,72,0.25)',  icon: '🕊️' },
  { grad: 'from-[#34D399] to-[#16A34A]', shadow: '0 2px 8px rgba(22,163,74,0.25)',  icon: '🌿' },
]

export default async function HomePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale }
  searchParams: { q?: string }
}) {
  setRequestLocale(locale)
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

  const { data: songs }      = await songsQuery
  const { data: categories } = await supabase
    .from('categories')
    .select('*, songs(count)')
    .is('parent_id', null)
    .order('sort_order')

  return (
    <div className="min-h-screen bg-[#F8FAFB]">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden">
        <Image
          src="/images/Background.jpg"
          alt="Laopraise"
          width={878}
          height={540}
          sizes="100vw"
          className="w-full h-auto block"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(255,255,255,0.08) 0%,transparent 20%,transparent 87%,rgba(248,252,255,0.55) 94%,#F8FAFB 100%)' }} />

        {/* NAV */}
        <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-[17px]" style={{ boxShadow: '0 2px 12px rgba(14,165,233,0.35)' }}>
              🎵
            </div>
            <span className="font-bold text-[#0F2845] text-[18px]" style={{ fontFamily: 'var(--font-noto-lao), sans-serif', textShadow: '0 1px 6px rgba(255,255,255,0.8)' }}>
              Laopraise
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher currentLocale={locale} />
            <Link
              href={`/${locale}/auth/login`}
              className="px-[18px] py-[9px] rounded-[20px] bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white text-[13px] font-semibold"
              style={{ boxShadow: '0 2px 10px rgba(14,165,233,0.3)' }}
            >
              ເຂົ້າສູ່ລະບົບ
            </Link>
          </div>
        </nav>

        {/* CENTER CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: 70, paddingBottom: 90, gap: 22 }}>
          <div className="flex flex-col" style={{ gap: 10 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.18em', color: '#0EA5E9', fontFamily: 'sans-serif', textTransform: 'uppercase', fontWeight: 600 }}>
              Gospel Song Library
            </p>
            <h1 style={{ fontFamily: 'var(--font-noto-lao), sans-serif', fontSize: 'clamp(30px,6vw,52px)', fontWeight: 700, color: '#0F2845', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.1, textShadow: '0 2px 12px rgba(255,255,255,0.9)' }}>
              {t('hero_title')}
            </h1>
            <p style={{ color: 'rgba(15,40,69,0.55)', fontSize: 'clamp(13px,2vw,16px)', margin: 0, fontStyle: 'italic' }}>
              &ldquo;I will sing of you among the peoples.&rdquo; &mdash; Ps 108:3
            </p>
          </div>

          {/* Search */}
          <form method="GET" style={{ position: 'relative', width: '100%', maxWidth: 460 }}>
            <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#93C5FD', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
            <input
              name="q"
              defaultValue={query}
              placeholder={t('search_placeholder')}
              style={{ width: '100%', padding: '16px 20px 16px 50px', borderRadius: 28, border: '1.5px solid rgba(186,214,232,0.7)', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)', fontSize: 14, outline: 'none', fontFamily: 'var(--font-noto-lao), sans-serif', color: '#0F2845', boxSizing: 'border-box', boxShadow: '0 8px 32px rgba(14,165,233,0.12),0 2px 8px rgba(0,0,0,0.04)' }}
            />
          </form>
        </div>

      </div>

      {/* ── CONTENT ── */}
      <div style={{ background: '#F8FAFB', minHeight: '60vh' }}>
        <div className="mx-auto px-5" style={{ maxWidth: 720, paddingTop: 32, paddingBottom: 80 }}>

          {/* Categories */}
          {!query && categories && categories.length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <h2 style={{ fontFamily: 'var(--font-noto-lao), sans-serif', fontSize: 16, fontWeight: 700, color: '#0F2845', margin: 0 }}>
                  {t('section_categories')}
                </h2>
                <Link href={`/${locale}/categories`} style={{ fontSize: 13, color: '#0EA5E9', fontWeight: 600, fontFamily: 'var(--font-noto-lao), sans-serif', textDecoration: 'none' }}>
                  {t('see_all')} →
                </Link>
              </div>
              <div className="flex overflow-x-auto pb-1.5 -mx-5 px-5" style={{ gap: 10, scrollbarWidth: 'none' }}>
                {categories.map((cat, i) => {
                  const item = CAT_ITEMS[i % CAT_ITEMS.length]
                  return (
                    <Link
                      key={cat.id}
                      href={`/${locale}/categories?cat=${cat.id}`}
                      style={{ flexShrink: 0, borderRadius: 16, padding: '14px 16px', background: 'white', border: '1.5px solid #E0EEFA', minWidth: 130, textDecoration: 'none', display: 'block', boxShadow: '0 2px 10px rgba(14,165,233,0.07)', transition: 'all 0.18s' }}
                    >
                      <div className={`bg-gradient-to-br ${item.grad} flex items-center justify-center text-base`} style={{ width: 34, height: 34, borderRadius: 10, marginBottom: 10, boxShadow: item.shadow }}>
                        {item.icon}
                      </div>
                      <p style={{ fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-noto-lao), sans-serif', margin: '0 0 4px', color: '#0F2845' }}>
                        {(cat.name as Record<string, string>)[locale] || (cat.name as Record<string, string>)['lo']}
                      </p>
                      <p style={{ fontSize: 11, color: '#64A4C4', margin: 0 }}>
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
            <h2 style={{ fontFamily: 'var(--font-noto-lao), sans-serif', fontSize: 16, fontWeight: 700, color: '#0F2845', marginBottom: 16 }}>
              {query ? `🔍 "${query}"` : t('section_latest')}
            </h2>
            {songs && songs.length > 0 ? (
              <div className="flex flex-col" style={{ gap: 10 }}>
                {songs.map(song => (
                  <SongCard key={song.id} song={song as unknown as SongRow} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="text-center" style={{ paddingTop: 64, paddingBottom: 64 }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>🎵</p>
                <p style={{ color: '#64A4C4', fontSize: 13, fontFamily: 'var(--font-noto-lao), sans-serif' }}>
                  {query ? 'ບໍ່ພົບເພງ / Song not found' : 'ຍັງບໍ່ມີເພງ'}
                </p>
              </div>
            )}
          </section>

          <div className="text-center" style={{ paddingTop: 24, borderTop: '1px solid #E0EEFA' }}>
            <p style={{ color: '#93C5FD', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Laopraise Gospel Library</p>
          </div>
        </div>
      </div>
    </div>
  )
}
