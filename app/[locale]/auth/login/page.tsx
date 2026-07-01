'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  const t                     = useTranslations()
  const router                = useRouter()
  const [email, setEmail]     = useState('')
  const [pass,  setPass]      = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pass })
    setLoading(false)
    if (err) { setError(t('login_error')); return }
    router.push(`/${locale}/admin/songs`)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 border border-amber-100">
        <h1 className="text-xl font-bold text-amber-900 text-center mb-6">{t('login_title')}</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-amber-700 block mb-1">{t('login_email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-amber-700 block mb-1">{t('login_password')}</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-900 text-white font-bold text-sm hover:bg-amber-800 disabled:opacity-50"
          >
            {loading ? '...' : t('login_btn')}
          </button>
        </form>
      </div>
    </div>
  )
}
