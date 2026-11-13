import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getRates, convert, roundFor, type RateSnapshot } from '../services/rates'
import { usePrefs } from './prefs'

interface CurrencyValue {
  currency: string
  setCurrency: (c: string) => void
  rates: Record<string, number> | null
  snapshot: RateSnapshot | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  refresh: () => Promise<void>
  /** MYR -> selected currency; null when no rate is available */
  toDisplay: (myr: number) => number | null
  /** selected currency -> MYR; null when no rate is available */
  toMyr: (amount: number) => number | null
  /** formatted display string, falls back to MYR */
  fmt: (myr: number) => string
  /** just the converted number as a string with the currency code */
  fmtCompact: (myr: number) => string
  isFallback: boolean
}

const Ctx = createContext<CurrencyValue | null>(null)

const SYMBOL: Record<string, string> = {
  MYR: 'RM',
  SGD: 'S$',
  USD: 'US$',
  IDR: 'Rp',
  THB: '฿',
  EUR: '€',
  GBP: '£',
  CNY: 'CN¥',
}

export function symbolFor(code: string) {
  return SYMBOL[code] ?? code
}

export function formatMoney(amount: number, code: string) {
  const rounded = roundFor(code, amount)
  const decimals = code === 'IDR' ? 0 : 2
  const body = rounded.toLocaleString('en-MY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${symbolFor(code)} ${body}`
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { currency } = usePrefs()
  const [snapshot, setSnapshot] = useState<RateSnapshot | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')

  const load = useCallback(async (force = false) => {
    setStatus('loading')
    try {
      const snap = await getRates(force)
      setSnapshot(snap)
      setStatus(snap ? 'ready' : 'error')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void load(false)
  }, [load])

  const rates = snapshot?.rates ?? null

  const toDisplay = useCallback(
    (myr: number) => convert(myr, currency, rates),
    [currency, rates]
  )

  const toMyr = useCallback(
    (amount: number) => {
      if (currency === 'MYR') return amount
      if (!rates) return null
      const r = rates[currency]
      if (!r || !isFinite(r) || r <= 0) return null
      return amount / r
    },
    [currency, rates]
  )

  const fmt = useCallback(
    (myr: number) => {
      const v = toDisplay(myr)
      if (v === null) return formatMoney(myr, 'MYR')
      return formatMoney(v, currency)
    },
    [toDisplay, currency]
  )

  const fmtCompact = useCallback(
    (myr: number) => {
      const v = toDisplay(myr)
      if (v === null) return `RM ${myr.toFixed(0)}`
      return formatMoney(v, currency)
    },
    [toDisplay, currency]
  )

  const value = useMemo<CurrencyValue>(
    () => ({
      currency,
      setCurrency: () => {
        /* owned by prefs */
      },
      rates,
      snapshot,
      status,
      refresh: () => load(true),
      toDisplay,
      toMyr,
      fmt,
      fmtCompact,
      isFallback: status === 'error' || (!!snapshot && snapshot.cached),
    }),
    [currency, rates, snapshot, status, load, toDisplay, toMyr, fmt, fmtCompact]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCurrency() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useCurrency must be used inside CurrencyProvider')
  return v
}

/**
 * Returns a formatter that renders a MYR amount in the visitor's selected
 * currency, falling back to MYR when no rate is available. Use this anywhere a
 * price appears as plain text (tables, summaries, exports). For inline price
 * blocks with the "≈ RM" sub-line, use the <Price> component instead.
 */
export function useMoneyText() {
  const { fmt } = useCurrency()
  return fmt
}
