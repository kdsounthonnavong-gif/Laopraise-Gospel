import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['lo', 'th', 'en', 'ko'] as const
export type AppLocale = typeof locales[number]

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  if (!locale || !locales.includes(locale as AppLocale)) notFound()
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
