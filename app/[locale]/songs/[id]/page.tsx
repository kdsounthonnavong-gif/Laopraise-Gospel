import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { songTitle } from '@/lib/utils'
import { SongImageViewer } from '@/components/SongImageViewer'
import { TransposeControl } from '@/components/TransposeControl'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import type { AppLocale } from '@/i18n'

export default async function SongDetailPage({
  params: { locale, id },
}: {
  params: { locale: AppLocale; id: string }
}) {
  const t        = await getTranslations()
  const supabase = createClient()

  const { data: song } = await supabase
    .from('songs')
    .select('*, song_images(id, image_url, sort_order), categories(*)')
    .eq('id', id)
    .single()

  if (!song) notFound()

  const title   = songTitle(song.title, locale)
  const images  = [...(song.song_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const catName = song.categories ? songTitle(song.categories.name, locale) : null

  const ytUrl = song.youtube_url ?? ''
  const ytId  = ytUrl.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? null

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100/50">
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-amber-100 px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-amber-700 text-sm">← {t('nav_home')}</Link>
        <LanguageSwitcher currentLocale={locale} />
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Title block */}
        <div>
          {catName && <p className="text-xs text-amber-500 mb-1">{catName}</p>}
          <h1 className="text-xl font-bold text-amber-900">{title}</h1>
          {song.original_key && (
            <span className="inline-block mt-1 text-xs bg-amber-100 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-mono">
              {t('key_label')}: {song.original_key}
            </span>
          )}
        </div>

        {/* Images */}
        <SongImageViewer images={images} songTitle={title} />

        {/* Transpose */}
        {song.original_key && <TransposeControl originalKey={song.original_key} />}

        {/* YouTube */}
        {ytId && (
          <a
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-2xl overflow-hidden aspect-video bg-black group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
              alt="YouTube thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 group-hover:bg-black/50 transition-colors">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span className="text-white text-sm font-medium">{t('youtube_open')}</span>
            </div>
          </a>
        )}

        {/* Audio */}
        {song.audio_url && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <p className="text-xs font-semibold text-amber-700 mb-2">🎵 Audio</p>
            <audio controls className="w-full accent-amber-700">
              <source src={song.audio_url} type="audio/mpeg" />
            </audio>
          </div>
        )}
      </div>
    </div>
  )
}
