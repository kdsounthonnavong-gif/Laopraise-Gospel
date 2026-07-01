'use client'
import { useTranslations } from 'next-intl'

interface Props { songTitle: string }

function tapLink(href: string) {
  const a = Object.assign(document.createElement('a'), {
    href, target: '_blank', rel: 'noopener noreferrer',
  })
  document.body.appendChild(a)
  a.click()
  setTimeout(() => document.body.removeChild(a), 200)
}

export function ShareButtons({ songTitle }: Props) {
  const t    = useTranslations()
  const text = `🎵 ${songTitle} — Laopraise Gospel`
  const url  = typeof window !== 'undefined' ? window.location.href : ''

  function shareWhatsApp()  { tapLink(`https://wa.me/?text=${encodeURIComponent(text)}`) }
  function shareMessenger() { tapLink(`fb-messenger://share/?link=${encodeURIComponent(url)}`) }
  function shareFacebook()  { tapLink(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`) }
  async function shareNative() {
    if (navigator.share) {
      await navigator.share({ title: songTitle, text, url }).catch(() => {})
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    }
  }

  const btnClass  = 'flex flex-col items-center gap-2 p-2 cursor-pointer bg-transparent border-none'
  const iconClass = 'w-14 h-14 rounded-[18px] flex items-center justify-center'
  const labelClass = 'text-[10px] text-white/65 font-medium'

  return (
    <div className="flex justify-around max-w-sm mx-auto">
      <button onClick={shareWhatsApp} className={btnClass}>
        <div className={`${iconClass} bg-[#25D366] shadow-lg shadow-green-500/30`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0012.05 0"/>
          </svg>
        </div>
        <span className={labelClass}>WhatsApp</span>
      </button>
      <button onClick={shareMessenger} className={btnClass}>
        <div className={`${iconClass} shadow-lg shadow-blue-500/30`} style={{ background: 'linear-gradient(145deg,#00C6FF,#0068FF)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.889-3.26-6.56 6.963z"/>
          </svg>
        </div>
        <span className={labelClass}>Messenger</span>
      </button>
      <button onClick={shareFacebook} className={btnClass}>
        <div className={`${iconClass} bg-[#1877F2] shadow-lg shadow-blue-600/30`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
        <span className={labelClass}>Facebook</span>
      </button>
      <button onClick={shareNative} className={btnClass}>
        <div className={`${iconClass} bg-white/15`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </div>
        <span className={labelClass}>{t('share')}</span>
      </button>
    </div>
  )
}
