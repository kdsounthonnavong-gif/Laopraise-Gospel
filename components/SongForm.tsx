'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ImageUploader } from './ImageUploader'
import type { Song, Category } from '@/lib/supabase/types'

interface Props {
  locale:     string
  categories: Category[]
  song?:      Song & { song_images?: { url: string; name: string }[] }
}

const LANGS = [['lo', 'ລາວ'], ['th', 'ไทย'], ['en', 'English'], ['ko', '한국어']] as const

export function SongForm({ locale, categories, song }: Props) {
  const router  = useRouter()
  const isEdit  = !!song
  const [songId] = useState(() => song?.id ?? crypto.randomUUID())

  const [titleLo,  setTitleLo]  = useState(song?.title?.lo ?? '')
  const [titleTh,  setTitleTh]  = useState(song?.title?.th ?? '')
  const [titleEn,  setTitleEn]  = useState(song?.title?.en ?? '')
  const [titleKo,  setTitleKo]  = useState(song?.title?.ko ?? '')
  const [lang,     setLang]     = useState(song?.lang ?? 'lo')
  const [key,      setKey]      = useState(song?.original_key ?? '')
  const [catId,    setCatId]    = useState(song?.category_id ?? '')
  const [ytUrl,    setYtUrl]    = useState(song?.youtube_url ?? '')
  const [images,   setImages]   = useState<{ url: string; name: string }[]>(song?.song_images ?? [])
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  const titleByCode: Record<string, [string, (v: string) => void]> = {
    lo: [titleLo, setTitleLo],
    th: [titleTh, setTitleTh],
    en: [titleEn, setTitleEn],
    ko: [titleKo, setTitleKo],
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()

    const payload = {
      id:           songId,
      title:        { lo: titleLo, th: titleTh, en: titleEn, ko: titleKo },
      lang,
      original_key: key || null,
      category_id:  catId || null,
      youtube_url:  ytUrl || null,
    }

    const { error: songErr } = isEdit
      ? await supabase.from('songs').update(payload).eq('id', songId)
      : await supabase.from('songs').insert(payload)

    if (songErr) { setError(songErr.message); setSaving(false); return }

    await supabase.from('song_images').delete().eq('song_id', songId)
    if (images.length > 0) {
      await supabase.from('song_images').insert(
        images.map((img, i) => ({ song_id: songId, image_url: img.url, sort_order: i }))
      )
    }

    router.push(`/${locale}/admin/songs`)
    router.refresh()
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white'
  const labelClass = 'text-xs font-semibold text-amber-700 block mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {LANGS.map(([code, label]) => {
        const [val, setter] = titleByCode[code]
        return (
          <div key={code}>
            <label className={labelClass}>{label}</label>
            <input
              className={inputClass}
              value={val}
              onChange={e => setter(e.target.value)}
              placeholder={`ຊື່ເພງ (${label})`}
            />
          </div>
        )
      })}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>ພາສາຫລັກ</label>
          <select className={inputClass} value={lang} onChange={e => setLang(e.target.value as 'lo' | 'th' | 'en' | 'ko')}>
            {LANGS.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>ຄີ</label>
          <input className={inputClass} value={key} onChange={e => setKey(e.target.value)} placeholder="G, Am, F#..." />
        </div>
      </div>

      <div>
        <label className={labelClass}>ໝວດໝູ່</label>
        <select className={inputClass} value={catId} onChange={e => setCatId(e.target.value)}>
          <option value="">-- ເລືອກໝວດ --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {(cat.name as Record<string, string>)['lo']}{cat.parent_id ? '' : ' (parent)'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>YouTube URL</label>
        <input className={inputClass} value={ytUrl} onChange={e => setYtUrl(e.target.value)} placeholder="https://youtu.be/..." />
      </div>

      <div>
        <label className={labelClass}>ໂນດເພງ (ຮູບ)</label>
        <ImageUploader songId={songId} initial={images} onChange={setImages} />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl border border-amber-200 text-amber-700 text-sm font-medium"
        >
          ຍົກເລີກ
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 rounded-xl bg-amber-900 text-white text-sm font-bold disabled:opacity-50"
        >
          {saving ? '...' : '💾 ບັນທຶກ'}
        </button>
      </div>
    </form>
  )
}
