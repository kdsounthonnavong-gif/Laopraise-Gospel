'use client'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface UploadedImage { url: string; name: string }

interface Props {
  songId:   string
  initial?: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
}

export function ImageUploader({ songId, initial = [], onChange }: Props) {
  const [images,   setImages]   = useState<UploadedImage[]>(initial)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    setUploading(true)
    const supabase  = createClient()
    const newImages = [...images]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const path = `songs/${songId}/${newImages.length}-${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('song-images')
        .upload(path, file, { upsert: false })

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('song-images').getPublicUrl(data.path)
        newImages.push({ url: publicUrl, name: file.name })
      }
    }

    setImages(newImages)
    onChange(newImages)
    setUploading(false)
  }

  function remove(index: number) {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative w-24 h-32 rounded-xl overflow-hidden border border-amber-200 bg-amber-50">
            <Image src={img.url} alt={img.name} fill className="object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
            <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5">
              {i + 1}
            </span>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-32 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 flex flex-col items-center justify-center gap-1 text-amber-500 hover:border-amber-500 hover:bg-amber-100 transition-colors disabled:opacity-50"
        >
          <span className="text-2xl">{uploading ? '⏳' : '+'}</span>
          <span className="text-xs">ເພີ່ມຮູບ</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  )
}
