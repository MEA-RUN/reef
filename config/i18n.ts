import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { useNuxt } from '@nuxt/kit'

const supportedLocales = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
]

export function configureI18n(modules: string[]) {
  const nuxt = useNuxt()
  const locales = supportedLocales.filter(({ code }) =>
    existsSync(resolve(nuxt.options.rootDir, 'content', code)),
  )

  if (locales.length === 0)
    return

  const options = nuxt.options as typeof nuxt.options & {
    i18n?: {
      baseUrl?: string
      defaultLocale: string
      locales: typeof supportedLocales
    }
  }

  options.i18n = {
    baseUrl: process.env.NUXT_SITE_URL,
    defaultLocale: locales.some(({ code }) => code === 'fr') ? 'fr' : locales[0]?.code || 'en',
    locales,
  }
  modules.push('@nuxtjs/i18n')
}
