import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { locales, type AppLocale } from '@/i18n'

export async function POST(request: Request) {
  const supabase = createClient()
  await supabase.auth.signOut()
  const raw    = new URL(request.url).searchParams.get('locale')
  const locale: AppLocale = (locales as readonly string[]).includes(raw ?? '') ? (raw as AppLocale) : 'lo'
  return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
}
