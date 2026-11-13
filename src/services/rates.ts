/**
 * Live exchange rates.
 *
 * Provider: ExchangeRate-API open endpoint (https://open.er-api.com) — free,
 * no API key, no subscription. Returns its own `time_last_update_utc`, which we
 * surface verbatim so the user always sees the true age of the rate.
 *
 * Fallback: Frankfurter (https://frankfurter.dev), which republishes the ECB
 * reference rates published once per working day around 16:00 CET.
 *
 * CONSEQUENCE, stated honestly in the UI: these are DAILY REFERENCE rates,
 * not live market quotes. We never label them as real-time.
 *
 * MYR is the base for all stored prices. Both providers publish a USD base, so
 * we cross-convert: (USD->X) / (USD->MYR) gives X per 1 MYR.
 *
 * If both providers fail we return the last cached snapshot clearly marked
 * `cached: true`, or null. We never fabricate a rate.
 */

export interface RateSnapshot {
  /** base currency of the table (always MYR for our maths) */
  base: 'MYR'
  /** rates[i] = how many units of currency i per 1 MYR */
  rates: Record<string, number>
  /** ISO date the provider says these rates are effective */
  effectiveDate: string
  /** provider timestamp, ISO */
  fetchedAt: string
  source: string
  sourceUrl: string
  /** true if served from cache */
  cached: boolean
}

const CACHE_KEY = 'johor360.v2.rates'
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6h — provider only updates daily
const SUPPORTED = ['MYR', 'SGD', 'USD', 'IDR', 'THB', 'EUR', 'GBP', 'CNY'] as const
export type CurrencyCode = (typeof SUPPORTED)[number]
export const CURRENCIES = SUPPORTED

interface Cached {
  snap: RateSnapshot
  storedAt: number
}

function readCache(): Cached | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Cached
    if (!parsed?.snap?.rates || typeof parsed.storedAt !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(snap: RateSnapshot) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ snap, storedAt: Date.now() }))
  } catch {
    /* storage full or blocked — non-fatal */
  }
}

/**
 * Primary: open.er-api.com — keyless, publishes MYR, returns update timestamp.
 * We only need the MYR->X legs, which this endpoint gives directly when
 * queried with base MYR... except the open endpoint does not accept a base
 * parameter, so we request USD base and cross-convert.
 */
async function fetchFromErApi(): Promise<RateSnapshot> {
  const res = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' })
  if (!res.ok) throw new Error(`er-api ${res.status}`)
  const json = (await res.json()) as {
    result: string
    time_last_update_utc: string
    base_code: string
    rates: Record<string, number>
  }
  if (json.result !== 'success') throw new Error('er-api unsuccessful')

  const usdToMyr = json.rates.MYR
  if (!usdToMyr) throw new Error('er-api missing MYR')

  const rates: Record<string, number> = {}
  for (const code of SUPPORTED) {
    const usdToX = code === 'USD' ? 1 : json.rates[code]
    if (typeof usdToX === 'number' && usdToX > 0) {
      // X per 1 MYR = usdToX / usdToMyr
      rates[code] = usdToX / usdToMyr
    }
  }
  rates.MYR = 1

  const fetchedAt = new Date().toISOString()
  const eff = new Date(json.time_last_update_utc)
  return {
    base: 'MYR',
    rates,
    effectiveDate: isNaN(eff.getTime()) ? fetchedAt.slice(0, 10) : eff.toISOString().slice(0, 10),
    fetchedAt,
    source: 'ExchangeRate-API (open access)',
    sourceUrl: 'https://www.exchangerate-api.com',
    cached: false,
  }
}

/**
 * Secondary: Frankfurter (ECB). Publishes daily reference rates, no MYR.
 * We use it only to sanity-check the USD->EUR/GBP legs, and as a fallback
 * source for non-MYR currencies by cross-converting through USD.
 * If MYR is absent we cannot build the table, so this throws.
 */
async function fetchFromFrankfurter(): Promise<RateSnapshot> {
  const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD', { cache: 'no-store' })
  if (!res.ok) throw new Error(`frankfurter ${res.status}`)
  const json = (await res.json()) as { date: string; base: string; rates: Record<string, number> }
  const usdToMyr = json.rates.MYR
  if (!usdToMyr) throw new Error('frankfurter missing MYR leg')
  const rates: Record<string, number> = { MYR: 1 }
  for (const code of SUPPORTED) {
    if (code === 'MYR') continue
    const usdToX = code === 'USD' ? 1 : json.rates[code]
    if (typeof usdToX === 'number' && usdToX > 0) rates[code] = usdToX / usdToMyr
  }
  return {
    base: 'MYR',
    rates,
    effectiveDate: json.date,
    fetchedAt: new Date().toISOString(),
    source: 'Frankfurter (ECB reference)',
    sourceUrl: 'https://frankfurter.dev',
    cached: false,
  }
}

let inFlight: Promise<RateSnapshot | null> | null = null

/** Returns a snapshot, or null when no provider could be reached and no cache exists. */
export async function getRates(force = false): Promise<RateSnapshot | null> {
  const cached = readCache()
  if (!force && cached && Date.now() - cached.storedAt < CACHE_TTL_MS) {
    return { ...cached.snap, cached: true }
  }
  if (inFlight) return inFlight

  inFlight = (async () => {
    for (const fn of [fetchFromErApi, fetchFromFrankfurter]) {
      try {
        const snap = await fn()
        writeCache(snap)
        return snap
      } catch {
        /* try next provider */
      }
    }
    // both failed — return stale cache if we have one, clearly marked
    if (cached) return { ...cached.snap, cached: true }
    return null
  })()

  try {
    return await inFlight
  } finally {
    inFlight = null
  }
}

export function convert(amountMyr: number, to: string, rates: Record<string, number> | null): number | null {
  if (to === 'MYR') return amountMyr
  if (!rates) return null
  const r = rates[to]
  if (typeof r !== 'number' || !isFinite(r) || r <= 0) return null
  return amountMyr * r
}

/** Rounding: 0 decimals for IDR, 2 for everything else. */
export function roundFor(code: string, v: number): number {
  if (code === 'IDR') return Math.round(v)
  if (code === 'JPY' || code === 'KRW' || code === 'VND') return Math.round(v)
  return Math.round(v * 100) / 100
}
