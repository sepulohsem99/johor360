import { useState } from 'react'
import Icon from './Icon'
import { useCurrency, formatMoney } from '../../app/currency'
import { usePrefs } from '../../app/prefs'
import { CURRENCIES } from '../../services/rates'

/**
 * Currency converter.
 *
 * Two modes:
 *  - "price" mode: shows what a MYR price becomes in the selected currency,
 *    plus the rate actually used and its real timestamp.
 *  - "free" mode: arbitrary amount from any supported currency to any other.
 *
 * Rates come from services/rates.ts. If no rate is available we say so and fall
 * back to MYR — we never invent a number.
 */
export function CurrencyConverter({ compact = false }: { compact?: boolean }) {
  const { t, currency } = usePrefs()
  const { rates, snapshot, status, refresh, toDisplay } = useCurrency()
  const [amount, setAmount] = useState('80')
  const [from, setFrom] = useState('MYR')
  const [to, setTo] = useState(currency === 'MYR' ? 'SGD' : currency)

  const num = Number(amount)
  const valid = isFinite(num) && num > 0

  // convert through MYR as the pivot, which is how all our stored prices work
  let result: number | null = null
  if (valid && rates) {
    const fromRate = rates[from]
    const toRate = rates[to]
    if (fromRate && toRate) {
      const myr = num / fromRate
      result = myr * toRate
    }
  }
  if (from === to) result = valid ? num : null

  const rateLine =
    rates && rates[from] && rates[to]
      ? `1 ${from} = ${(rates[to] / rates[from]).toLocaleString('en-MY', { maximumFractionDigits: 4 })} ${to}`
      : null

  const when = snapshot
    ? new Date(snapshot.fetchedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null

  return (
    <div className="rounded-xl border border-line bg-raised p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-ink">
          <Icon name="wallet" size={12} className="text-accent" />
          {t('currency.converter')}
        </p>
        <button
          onClick={() => void refresh()}
          disabled={status === 'loading'}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-ink-mute transition-colors hover:text-accent disabled:opacity-50"
          aria-label={t('currency.refresh')}
        >
          <Icon name="refresh-cw" size={10} className={status === 'loading' ? 'animate-spin' : ''} />
          {status === 'loading' ? t('currency.refreshing') : t('currency.refresh')}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          inputMode="decimal"
          aria-label={t('currency.amount')}
          className="field !h-9 !w-[92px] !text-[12.5px]"
        />
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          aria-label={t('currency.from')}
          className="field !h-9 !w-[74px] !px-1.5 !text-[11.5px]"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Icon name="arrow-right" size={12} className="shrink-0 text-ink-faint" />
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label={t('currency.to')}
          className="field !h-9 !w-[74px] !px-1.5 !text-[11.5px]"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 rounded-lg bg-inset px-2.5 py-2">
        {result !== null ? (
          <p className="text-[16px] font-extrabold text-ink num">{formatMoney(result, to)}</p>
        ) : (
          <p className="text-[12px] font-semibold text-accent">{t('currency.unavailable')}</p>
        )}
        {rateLine && <p className="mt-0.5 text-[10px] text-ink-mute num">{rateLine}</p>}
        {status === 'error' && (
          <p className="mt-1 text-[10px] leading-relaxed text-ink-mute">{t('currency.unavailableBody')}</p>
        )}
      </div>

      {!compact && (
        <div className="mt-2 space-y-0.5 text-[9.5px] leading-relaxed text-ink-faint">
          {snapshot && (
            <>
              <p>
                {t('currency.lastUpdated')}: <span className="num">{when}</span>
                {snapshot.cached && <span className="ml-1 font-bold text-gold">· {t('currency.cached')}</span>}
              </p>
              <p>
                {t('currency.source')}: {snapshot.source}
              </p>
            </>
          )}
          <p className="italic">{t('currency.indicative')}</p>
        </div>
      )}
    </div>
  )
}

/** Small one-line rate notice for price-heavy pages. */
export function RateNotice() {
  const { t } = usePrefs()
  const { snapshot, status } = useCurrency()
  if (status === 'error' || !snapshot) {
    return (
      <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-ink-faint">
        <Icon name="info" size={10} className="mt-0.5 shrink-0" />
        {t('currency.unavailableBody')}
      </p>
    )
  }
  return (
    <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-ink-faint">
      <Icon name="info" size={10} className="mt-0.5 shrink-0" />
      {t('currency.indicative')}
      {snapshot.cached && <span className="font-bold text-gold">· {t('currency.cachedBody')}</span>}
    </p>
  )
}
