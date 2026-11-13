import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Icon from './Icon'
import { usePrefs, type ThemeMode } from '../../app/prefs'
import { useCurrency, formatMoney } from '../../app/currency'
import { CURRENCIES } from '../../services/rates'

/* ------------------------------------------------------------------ hooks */
function useOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [onClose])
  return ref
}

/* --------------------------------------------------------------- lang toggle */
export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = usePrefs()
  return (
    <div
      role="group"
      aria-label="Language / Bahasa"
      className="inline-flex h-8 items-center rounded-lg border border-line bg-raised p-0.5"
    >
      {(['ms', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={clsx(
            'h-7 rounded-md px-2 text-[11px] font-bold uppercase tracking-wide transition-colors',
            lang === code ? 'bg-navy text-white' : 'text-ink-mute hover:text-ink'
          )}
        >
          {compact ? code.toUpperCase() : code === 'ms' ? 'BM' : 'EN'}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------ theme toggle */
const THEMES: { id: ThemeMode; icon: string; labelKey: string }[] = [
  { id: 'light', icon: 'sun', labelKey: 'nav.themeLight' },
  { id: 'dark', icon: 'moon', labelKey: 'nav.themeDark' },
  { id: 'system', icon: 'monitor', labelKey: 'nav.themeSystem' },
]

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, t } = usePrefs()
  if (compact) {
    // mobile: single cycle button
    const order: ThemeMode[] = ['light', 'dark', 'system']
    const next = order[(order.indexOf(theme) + 1) % order.length]
    const cur = THEMES.find((x) => x.id === theme)!
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={`${t('nav.theme')}: ${t(cur.labelKey)}`}
        className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:text-ink"
      >
        <Icon name={cur.icon} size={14} />
      </button>
    )
  }
  return (
    <div
      role="group"
      aria-label={t('nav.theme')}
      className="inline-flex h-8 items-center rounded-lg border border-line bg-raised p-0.5"
    >
      {THEMES.map((th) => (
        <button
          key={th.id}
          type="button"
          onClick={() => setTheme(th.id)}
          aria-pressed={theme === th.id}
          title={t(th.labelKey)}
          aria-label={t(th.labelKey)}
          className={clsx(
            'grid h-7 w-7 place-items-center rounded-md transition-colors',
            theme === th.id ? 'bg-navy text-white' : 'text-ink-mute hover:text-ink'
          )}
        >
          <Icon name={th.icon} size={13} />
        </button>
      ))}
    </div>
  )
}

/* --------------------------------------------------------- currency select */
export function CurrencySelect() {
  const { currency, setCurrency } = usePrefs()
  const { status } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useOutside(() => setOpen(false))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-raised px-2.5 text-[11.5px] font-bold text-ink transition-colors hover:border-lineStrong"
      >
        {currency}
        {status === 'loading' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />}
        <Icon name="chevron-down" size={11} className="text-ink-faint" />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-xl border border-line bg-raised p-1 shadow-pop animate-popIn"
        >
          {CURRENCIES.map((c) => (
            <button
              key={c}
              role="option"
              aria-selected={currency === c}
              onClick={() => {
                setCurrency(c)
                setOpen(false)
              }}
              className={clsx(
                'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[12.5px] transition-colors',
                currency === c ? 'bg-inset font-bold text-ink' : 'text-ink-soft hover:bg-inset'
              )}
            >
              <span>{c}</span>
              {currency === c && <Icon name="check" size={12} className="text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------- price text */
export function Price({
  myr,
  className,
  showApprox = true,
  size = 'base',
}: {
  myr: number
  className?: string
  showApprox?: boolean
  size?: 'sm' | 'base' | 'lg'
}) {
  const { currency } = usePrefs()
  const { toDisplay, snapshot } = useCurrency()
  const converted = toDisplay(myr)
  const isMyr = currency === 'MYR' || converted === null

  const main =
    'text-[15px] font-extrabold text-ink num'
  const mainCls =
    size === 'lg' ? 'text-[22px] font-extrabold text-ink num'
      : size === 'sm' ? 'text-[13px] font-bold text-ink num'
        : main

  if (isMyr) {
    return (
      <span className={clsx(mainCls, className)}>
        {formatMoney(myr, 'MYR')}
        {converted === null && currency !== 'MYR' && (
          <span className="ml-1 text-[10px] font-medium text-ink-faint">({currency} n/a)</span>
        )}
      </span>
    )
  }

  return (
    <span className={clsx('inline-flex flex-col leading-tight', className)}>
      <span className={mainCls}>{formatMoney(converted!, currency)}</span>
      {showApprox && (
        <span className="text-[10.5px] font-medium text-ink-faint num">
          ≈ {formatMoney(myr, 'MYR')}
          {snapshot?.cached && <span className="ml-1 text-gold">·</span>}
        </span>
      )}
    </span>
  )
}
