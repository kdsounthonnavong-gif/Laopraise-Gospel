import Link from 'next/link'
import { songTitle } from '@/lib/utils'
import type { Song, Category, Locale } from '@/lib/supabase/types'

interface Props {
  song:   Song & { categories: Category | null }
  locale: Locale
}

const LANG_STYLE: Record<string, string> = {
  lo: 'bg-amber-100 text-amber-800 border-amber-200',
  th: 'bg-green-100 text-green-800 border-green-200',
  en: 'bg-sky-100 text-sky-800 border-sky-200',
  ko: 'bg-orange-100 text-orange-800 border-orange-200',
}
const LANG_LABEL: Record<string, string> = {
  lo: 'ລາວ', th: 'ไทย', en: 'EN', ko: '한국어',
}

export function SongCard({ song, locale }: Props) {
  const title   = songTitle(song.title, locale)
  const catName = song.categories ? songTitle(song.categories.name, locale) : ''

  return (
    <Link
      href={`/${locale}/songs/${song.id}`}
      className="block bg-white rounded-2xl p-4 shadow-sm border border-amber-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-amber-900 text-sm leading-snug line-clamp-2 flex-1">
          {title}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${LANG_STYLE[song.lang]}`}>
          {LANG_LABEL[song.lang]}
        </span>
      </div>
      {catName && (
        <p className="text-xs text-amber-600 truncate mb-2">{catName}</p>
      )}
      {song.original_key && (
        <span className="inline-block text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-mono">
          {song.original_key}
        </span>
      )}
    </Link>
  )
}
