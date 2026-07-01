import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import type { AppLocale } from '@/i18n'

export default async function AdminSongsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: AppLocale }
  searchParams: { q?: string }
}) {
  const t        = await getTranslations()
  const supabase = createClient()
  const q        = searchParams.q?.trim() ?? ''

  let query = supabase
    .from('songs')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  if (q) {
    const safe = q.replace(/[,()*:\\]/g, '')
    query = query.or(
      ['lo', 'th', 'en', 'ko'].map(l => `title->${l}.ilike.%${safe}%`).join(',')
    )
  }

  const { data: songs } = await query

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-amber-900">🎵 ຈັດການເພງ ({songs?.length ?? 0})</h1>
        <Link href={`/${locale}/admin/songs/new`} className="px-4 py-2 bg-amber-900 text-white rounded-xl text-sm font-bold">
          + ເພີ່ມ
        </Link>
      </div>

      <form method="GET">
        <input
          name="q"
          defaultValue={q}
          placeholder={t('search_admin')}
          className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </form>

      <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
        {songs && songs.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-amber-50 border-b border-amber-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-amber-700">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-amber-700">ຊື່</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-amber-700 hidden sm:table-cell">ໝວດ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-amber-700 hidden sm:table-cell">ຄີ</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {songs.map((song, i) => (
                <tr key={song.id} className="hover:bg-amber-50">
                  <td className="px-4 py-3 text-amber-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-amber-900 text-xs">
                      {(song.title as Record<string, string>)['lo'] || Object.values(song.title as object)[0]}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-amber-500 hidden sm:table-cell">
                    {song.categories ? (song.categories.name as Record<string, string>)['lo'] : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-amber-700 hidden sm:table-cell">
                    {song.original_key ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/${locale}/admin/songs/${song.id}/edit`}
                      className="text-xs text-amber-600 hover:text-amber-900 font-medium"
                    >
                      ແກ້ໄຂ →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-amber-400 py-10 text-sm">ຍັງບໍ່ມີເພງ — ກົດ + ເພີ່ມ</p>
        )}
      </div>
    </div>
  )
}
