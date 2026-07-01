import { createClient } from '@/lib/supabase/server'
import { SongForm } from '@/components/SongForm'
import { notFound } from 'next/navigation'
import type { AppLocale } from '@/i18n'
import type { Song } from '@/lib/supabase/types'

export default async function EditSongPage({
  params: { locale, id },
}: {
  params: { locale: AppLocale; id: string }
}) {
  const supabase = createClient()

  const [{ data: song }, { data: categories }] = await Promise.all([
    supabase
      .from('songs')
      .select('*, song_images(image_url, sort_order)')
      .eq('id', id)
      .single(),
    supabase.from('categories').select('*').order('sort_order'),
  ])

  if (!song) notFound()

  const songWithImages = {
    ...song,
    song_images: [...(song.song_images ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => ({ url: img.image_url, name: img.image_url.split('/').pop() ?? '' })),
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-lg font-bold text-amber-900 mb-6">✏️ ແກ້ໄຂເພງ</h1>
      <SongForm locale={locale} categories={categories ?? []} song={songWithImages as unknown as Song & { song_images: { url: string; name: string }[] }} />
    </div>
  )
}
