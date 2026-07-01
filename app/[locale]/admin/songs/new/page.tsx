import { createClient } from '@/lib/supabase/server'
import { SongForm } from '@/components/SongForm'
import type { AppLocale } from '@/i18n'

export default async function NewSongPage({ params: { locale } }: { params: { locale: AppLocale } }) {
  const supabase = createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <div className="max-w-lg">
      <h1 className="text-lg font-bold text-amber-900 mb-6">➕ ເພີ່ມເພງໃໝ່</h1>
      <SongForm locale={locale} categories={categories ?? []} />
    </div>
  )
}
