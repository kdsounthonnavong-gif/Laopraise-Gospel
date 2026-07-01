'use client'
import { useState } from 'react'
import { getTargetKey, getCapoSuggestion } from '@/lib/transpose'
import { useTranslations } from 'next-intl'

export function TransposeControl({ originalKey }: { originalKey: string }) {
  const t              = useTranslations()
  const [shift, setShift] = useState(0)

  const targetKey = getTargetKey(originalKey, shift)
  const capo      = getCapoSuggestion(targetKey)

  return (
    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
      <p className="text-xs font-semibold text-amber-700 mb-3">{t('transpose_label')}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-amber-500">{t('orig_key')}</p>
          <p className="font-bold text-amber-900 font-mono text-lg">{originalKey}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShift(s => s - 1)}
            className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 font-bold text-lg hover:bg-amber-300"
          >
            −
          </button>
          <span className="text-sm font-mono text-amber-700 w-6 text-center">
            {shift > 0 ? `+${shift}` : shift}
          </span>
          <button
            onClick={() => setShift(s => s + 1)}
            className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 font-bold text-lg hover:bg-amber-300"
          >
            +
          </button>
        </div>
        <div className="text-right">
          <p className="text-xs text-amber-500">{t('play_key')}</p>
          <p className="font-bold text-amber-900 font-mono text-lg">{targetKey}</p>
        </div>
      </div>
      {capo && (
        <p className="text-xs text-amber-600 mt-3 bg-white rounded-xl px-3 py-2 border border-amber-100">
          {t('capo_hint', { capo: capo.capo, key: capo.playKey })}
        </p>
      )}
      {shift !== 0 && (
        <button
          onClick={() => setShift(0)}
          className="text-xs text-amber-500 underline mt-2 block"
        >
          reset
        </button>
      )}
    </div>
  )
}
