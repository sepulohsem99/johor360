import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import i18n from '../i18n'
import { UI_MS } from '../locales/ui-ms'
import { UI_MS_EXTRA } from '../locales/ui-ms-extra'

/**
 * Merged English -> BM table.
 *
 * React collapses runs of whitespace inside JSX text nodes into single spaces,
 * so a paragraph written across four source lines arrives here with single
 * spaces. Keys are normalised the same way on both sides.
 */
const TABLE: Record<string, string> = { ...UI_MS, ...UI_MS_EXTRA }
const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

export type ThemeMode = 'light' | 'dark' | 'system'
export type Lang = 'ms' | 'en'
export type Origin = 'MY' | 'SG' | 'ID' | 'TH' | 'OTHER'

const THEME_KEY = 'johor360.v2.theme'
const LANG_KEY = 'johor360.v2.lang'
const CURRENCY_KEY = 'johor360.v2.currency'
const ORIGIN_KEY = 'johor360.v2.origin'

export const ORIGIN_CURRENCY: Record<Origin, string> = {
  MY: 'MYR',
  SG: 'SGD',
  ID: 'IDR',
  TH: 'THB',
  OTHER: 'USD',
}

interface PrefsValue {
  theme: ThemeMode
  resolvedTheme: 'light' | 'dark'
  setTheme: (t: ThemeMode) => void
  lang: Lang
  setLang: (l: Lang) => void
  currency: string
  setCurrency: (c: string) => void
  origin: Origin
  setOrigin: (o: Origin) => void
  t: (key: string, vars?: Record<string, unknown>) => string
  /** Translate a full English UI sentence. Falls back to the source string. */
  tx: (text: string) => string
}

/**
 * UI copy table: English source string -> Bahasa Melayu.
 *
 * `tx()` is deliberately keyed on the *English sentence itself* rather than a
 * synthetic key. Two reasons:
 *  - The English build keeps rendering perfectly even if a row is missing, so
 *    a missing translation can never blank out the interface.
 *  - Translating an existing English-first codebase is a pure data problem:
 *    no call sites have to be renamed or restructured.
 * Keys must match the JSX text exactly, including punctuation and dashes.
 */

const Ctx = createContext<PrefsValue | null>(null)

function read<T extends string>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return (v as T) ?? fallback
  } catch {
    return fallback
  }
}

/** Runs before React paints (see index.html) but also re-applies on mount. */
function applyThemeClass(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = mode === 'dark' || (mode === 'system' && prefersDark)
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  return dark ? 'dark' : 'light'
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => read<ThemeMode>(THEME_KEY, 'system'))
  const [lang, setLangState] = useState<Lang>(() => read<Lang>(LANG_KEY, 'ms'))
  const [currency, setCurrencyState] = useState<string>(() => read(CURRENCY_KEY, 'MYR'))
  const [origin, setOriginState] = useState<Origin>(() => read<Origin>(ORIGIN_KEY, 'MY'))
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  )

  // theme -> DOM
  useEffect(() => {
    setResolvedTheme(applyThemeClass(theme))
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  // follow OS when in system mode
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setResolvedTheme(applyThemeClass('system'))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  // language -> DOM + i18next
  useEffect(() => {
    document.documentElement.lang = lang === 'ms' ? 'ms-MY' : 'en'
    if (i18n.language !== lang) void i18n.changeLanguage(lang)
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_KEY, currency)
    } catch {
      /* ignore */
    }
  }, [currency])

  useEffect(() => {
    try {
      localStorage.setItem(ORIGIN_KEY, origin)
    } catch {
      /* ignore */
    }
  }, [origin])

  const value = useMemo<PrefsValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeState,
      lang,
      setLang: setLangState,
      currency,
      setCurrency: setCurrencyState,
      origin,
      setOrigin: setOriginState,
      // Resolve against the `lang` state, not `i18n.language`.
      //
      // `i18n.changeLanguage()` is called from a useEffect, so on the render that
      // follows setLang() the i18next instance is still on the old language while
      // React has already re-rendered with the new value. Reading i18n.language
      // there produced one frame of the *old* language and no re-render after the
      // effect landed — headlines visibly stayed in the previous language until a
      // full page reload. getFixedT(lang) is derived from state, so the render is
      // correct immediately and stays correct.
      t: (key, vars) => {
        const fixed = i18n.getFixedT(lang)
        return (vars ? fixed(key, vars as never) : fixed(key)) as string
      },
      // English is the source language, so en returns the string untouched.
      tx: (text) => (lang === 'ms' ? (TABLE[norm(text)] ?? text) : text),
    }),
    [theme, resolvedTheme, lang, currency, origin]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePrefs() {
  const v = useContext(Ctx)
  if (!v) throw new Error('usePrefs must be used inside PreferencesProvider')
  return v
}
