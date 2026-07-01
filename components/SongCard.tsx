import Link from 'next/link'
import { songTitle } from '@/lib/utils'
import type { Song, Category, Locale } from '@/lib/supabase/types'

interface Props {
  song:   Song & { categories: Category | null }
  locale: Locale
}

const LANG_GRAD: Record<string, string> = {
  lo: 'from-amber-400 to-orange-500',
  th: 'from-emerald-400 to-teal-500',
  en: 'from-sky-400 to-blue-500',
  ko: 'from-violet-400 to-purple-500',
}

const LANG_LABEL: Record<string, string> = {
  lo: 'ລາວ', th: 'ไทย', en: 'EN', ko: '한국어',
}

export function SongCard({ song, locale }: Props) {
  const title   = songTitle(song.title, locale)
  const catName = song.categories ? songTitle(song.categories.name, locale) : ''
  const grad    = LANG_GRAD[song.lang] ?? 'from-amber-400 to-orange-500'

  return (
    <Link
      href={`/${locale}/songs/${song.id}`}
      className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-0.5 transition-all group"
    >
      {/* Gradient thumbnail */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex-shrink-0 flex items-center justify-center shadow-sm`}>
        <span className="text-white text-lg">🎵</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-amber-950 text-sm leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {catName && (
            <span className="text-xs text-amber-400 truncate">{catName}</span>
          )}
          {song.original_key && (
            <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-mono flex-shrink-0">
              {song.original_key}
            </span>
          )}
        </div>
      </div>

      {/* Lang badge + arrow */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-white bg-gradient-to-r ${grad} shadow-sm`}>
          {LANG_LABEL[song.lang] ?? song.lang}
        </span>
        <span className="text-stone-300 group-hover:text-amber-400 transition-colors text-lg leading-none">›</span>
      </div>
    </Link>
  )
}
