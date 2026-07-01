'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShareButtons } from './ShareButtons'
import type { SongImage } from '@/lib/supabase/types'
import { useTranslations } from 'next-intl'

interface Props {
  images:    SongImage[]
  songTitle: string
}

export function SongImageViewer({ images, songTitle }: Props) {
  const t                           = useTranslations()
  const [page, setPage]             = useState(0)
  const [lightboxOpen, setLightbox] = useState(false)

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     setLightbox(false)
      if (e.key === 'ArrowRight') setPage(p => (p + 1) % images.length)
      if (e.key === 'ArrowLeft')  setPage(p => (p - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, images.length])

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] max-w-sm mx-auto rounded-2xl bg-amber-50 border-2 border-dashed border-amber-200 flex flex-col items-center justify-center gap-3 text-amber-400">
        <span className="text-5xl">🎼</span>
        <p className="text-sm">Sheet Music / Chord Chart</p>
      </div>
    )
  }

  const current = images[page]

  function download() {
    const a = Object.assign(document.createElement('a'), {
      href: current.image_url,
      download: `${songTitle}-p${page + 1}.jpg`,
    })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <>
      {/* Inline viewer */}
      <div
        className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden bg-amber-50 cursor-zoom-in"
        onClick={() => setLightbox(true)}
      >
        <Image src={current.image_url} alt={`${songTitle} page ${page + 1}`} fill className="object-contain" />
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none">
          🔍 {t('zoom_hint')}
        </div>
      </div>

      {/* Page navigation dots */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-center mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors ${
                i === page ? 'bg-amber-900 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Quick action buttons */}
      <div className="flex gap-2 justify-center flex-wrap mt-4">
        <button
          onClick={() => setLightbox(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 bg-white text-amber-800 text-xs font-medium hover:bg-amber-50"
        >
          🔍 {t('zoom_hint')}
        </button>
        <button
          onClick={download}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 bg-white text-amber-800 text-xs font-medium hover:bg-amber-50"
        >
          ⬇️ {t('download')}
        </button>
      </div>

      {/* Fullscreen lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/97 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-4 pt-12 pb-3 flex-shrink-0">
            <span className="text-white/50 text-sm">
              {t('page_label', { current: page + 1, total: images.length })}
            </span>
            <button
              onClick={() => setLightbox(false)}
              className="w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center text-lg"
            >
              ✕
            </button>
          </div>

          {/* Image zone */}
          <div className="flex-1 relative min-h-0" onClick={() => setLightbox(false)}>
            <Image
              src={current.image_url}
              alt={`${songTitle} page ${page + 1}`}
              fill
              className="object-contain"
              onClick={e => e.stopPropagation()}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setPage(p => (p - 1 + images.length) % images.length) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white text-2xl flex items-center justify-center"
                >
                  ‹
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setPage(p => (p + 1) % images.length) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white text-2xl flex items-center justify-center"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Bottom bar */}
          <div className="flex-shrink-0 bg-[#120A04]/97 border-t border-white/8 rounded-t-3xl pt-5 pb-8">
            <div className="flex justify-center mb-4 px-4">
              <button onClick={download} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-[18px] bg-white/15 flex items-center justify-center">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <span className="text-[10px] text-white/65">{t('download')}</span>
              </button>
            </div>
            <ShareButtons songTitle={songTitle} />
          </div>
        </div>
      )}
    </>
  )
}
