import { redirect } from 'next/navigation'
import type { AppLocale } from '@/i18n'

export default function AdminPage({ params: { locale } }: { params: { locale: AppLocale } }) {
  redirect(`/${locale}/admin/songs`)
}
