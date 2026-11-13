import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../components/ui/Icon'
import { ExperienceCard, RailCorridor } from '../components/ExperienceCard'
import { JohorSkyline } from '../components/art/JohorIdentity'
import { useApp, usePublishedExperiences } from '../app/store'
import { usePrefs } from '../app/prefs'
import { useCurrency } from '../app/currency'
import { stationById, CORRIDOR } from '../data/stations'
import { CATEGORIES, PURPOSES } from '../data/taxonomy'
import { matchExperiences } from '../services/matching'

const DURATIONS = [
  { id: '', key: 'explore.anyTime', mins: 0 },
  { id: '120', key: 'explore.upTo2h', mins: 120 },
  { id: '240', key: 'explore.upTo4h', mins: 240 },
  { id: '360', key: 'explore.upTo6h', mins: 360 },
  { id: '480', key: 'explore.halfDay', mins: 480 },
]

const BUDGETS = [
  { id: '', key: 'explore.anyBudget', max: 0 },
  { id: '50', key: 'explore.under50', max: 50 },
  { id: '100', key: 'explore.under100', max: 100 },
  { id: '150', key: 'explore.under150', max: 150 },
  { id: '250', key: 'explore.under250', max: 250 },
]

const SORTS = ['bestMatch', 'priceLow', 'priceHigh', 'durationShort', 'rating'] as const
type SortKey = (typeof SORTS)[number]

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const exps = usePublishedExperiences()
  const { profile, setProfile } = useApp()
  const { t, lang } = usePrefs()
  const { toMyr, currency } = useCurrency()

  const station = params.get('station') ?? ''
  const category = params.get('category') ?? ''
  const duration = params.get('duration') ?? ''
  const budget = params.get('budget') ?? ''
  const purpose = params.get('purpose') ?? ''
  const sort = (params.get('sort') ?? 'bestMatch') as SortKey
  const urlQ = params.get('q') ?? ''

  const [q, setQ] = useState(urlQ)
  const [drawer, setDrawer] = useState(false)

  useEffect(() => setQ(urlQ), [urlQ])

  // Debounced URL sync so a search is shareable/copyable, while typing stays
  // instant — the list filters on `q` directly, not on the URL round-trip.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = new URLSearchParams(params)
      if (q) next.set('q', q)
      else next.delete('q')
      if (next.toString() !== params.toString()) setParams(next, { replace: true })
    }, 350)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const clearAll = () => {
    setQ('')
    setParams(new URLSearchParams(), { replace: true })
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const e of exps) c[e.stationId] = (c[e.stationId] ?? 0) + 1
    return c
  }, [exps])

  const catCounts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const e of exps) c[e.category] = (c[e.category] ?? 0) + 1
    return c
  }, [exps])

  const activeFilters = [station, category, purpose, duration, budget, urlQ].filter(Boolean).length

  const results = useMemo(() => {
    let list = exps
    if (station) list = list.filter((e) => e.stationId === station)
    if (category) list = list.filter((e) => e.category === category)

    const dur = DURATIONS.find((d) => d.id === duration)
    if (dur?.mins) list = list.filter((e) => e.durationMins <= dur.mins)

    const bud = BUDGETS.find((b) => b.id === budget)
    if (bud?.max) {
      // budget chips are denominated in the visitor's display currency
      const maxMyr = currency === 'MYR' ? bud.max : (toMyr(bud.max) ?? bud.max)
      list = list.filter((e) => e.price <= maxMyr)
    }

    if (q.trim()) {
      const needle = q.toLowerCase()
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(needle) ||
          e.summary.toLowerCase().includes(needle) ||
          e.town.toLowerCase().includes(needle) ||
          (stationById(e.stationId)?.name.toLowerCase().includes(needle) ?? false) ||
          e.tags.some((tag) => tag.includes(needle))
      )
    }

    if (purpose) list = list.filter((e) => e.bestFor.includes(purpose as never))

    if (sort === 'bestMatch') {
      const p = { ...profile, purpose: (purpose || profile.purpose) as never }
      const ranked = matchExperiences(list, p, { limit: 200 })
      return ranked.map((r) => ({ exp: r.experience, score: r.score, reasons: r.reasons }))
    }

    const sorted = [...list]
    if (sort === 'priceLow') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'priceHigh') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'durationShort') sorted.sort((a, b) => a.durationMins - b.durationMins)
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)

    return sorted.map((exp) => ({ exp, score: undefined as number | undefined, reasons: undefined as string[] | undefined }))
  }, [exps, station, category, duration, budget, q, purpose, sort, profile, currency, toMyr])

  const applyPurpose = (id: string) => {
    const next = purpose === id ? '' : id
    setParam('purpose', next)
    setProfile({ ...profile, purpose: (next || null) as never })
  }

  const operatorCount = useMemo(() => new Set(exps.map((e) => e.operatorId)).size, [exps])

  const filterPanel = (
    <div className="space-y-4">
      <div>
        <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">
          {t('explore.stationLabel')}
        </p>
        <div className="space-y-0.5">
          <button
            onClick={() => setParam('station', '')}
            className={clsx(
              'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[12.5px] transition-colors',
              !station ? 'bg-inset font-bold text-ink' : 'text-ink-soft hover:bg-inset'
            )}
          >
            <span>{t('common.allStations')}</span>
            <span className="text-[10.5px] text-ink-faint num">{exps.length}</span>
          </button>
          {CORRIDOR.map((s) => (
            <button
              key={s.id}
              onClick={() => setParam('station', s.id)}
              className={clsx(
                'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[12.5px] transition-colors',
                station === s.id ? 'bg-inset font-bold text-ink' : 'text-ink-soft hover:bg-inset'
              )}
            >
              <span className="flex items-center gap-1.5 truncate">
                <span
                  className={clsx(
                    'h-1.5 w-1.5 shrink-0 rounded-full',
                    station === s.id ? 'bg-johor' : 'bg-lineStrong'
                  )}
                />
                <span className="truncate">{s.name}</span>
              </span>
              <span className="text-[10.5px] text-ink-faint num">{counts[s.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="hairline pt-3">
        <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">
          {t('explore.categoryLabel')}
        </p>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setParam('category', '')}
            className={clsx('chip !h-7 !px-2 !text-[11px]', !category && 'chip-active')}
          >
            {t('common.all')}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setParam('category', category === c.id ? '' : c.id)}
              className={clsx('chip !h-7 !px-2 !text-[11px]', category === c.id && 'chip-active')}
            >
              {t("category." + c.id)}
              <span className="text-[9.5px] opacity-60 num">{catCounts[c.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="hairline pt-3">
        <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">
          {t('explore.timeLabel')}
        </p>
        <div className="flex flex-wrap gap-1">
          {DURATIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setParam('duration', d.id)}
              className={clsx('chip !h-7 !px-2 !text-[11px]', duration === d.id && 'chip-active')}
            >
              {t(d.key)}
            </button>
          ))}
        </div>
      </div>

      <div className="hairline pt-3">
        <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">
          {t('explore.budgetLabel')}{' '}
          {currency !== 'MYR' && <span className="text-gold">({currency})</span>}
        </p>
        <div className="flex flex-wrap gap-1">
          {BUDGETS.map((b) => (
            <button
              key={b.id}
              onClick={() => setParam('budget', b.id)}
              className={clsx('chip !h-7 !px-2 !text-[11px]', budget === b.id && 'chip-active')}
            >
              {t(b.key)}
            </button>
          ))}
        </div>
      </div>

      <div className="hairline pt-3">
        <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">
          {t('explore.purposeLabel')}
        </p>
        <div className="grid grid-cols-2 gap-1">
          {PURPOSES.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPurpose(p.id)}
              className={clsx(
                'flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[11.5px] font-semibold transition-colors',
                purpose === p.id
                  ? 'border-johor bg-johor text-white'
                  : 'border-line bg-raised text-ink-soft hover:border-lineStrong'
              )}
            >
              <Icon name={p.glyph} size={11} />
              <span className="truncate">{t(`purpose.${p.id}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {activeFilters > 0 && (
        <button
          onClick={clearAll}
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-line py-1.5 text-[11.5px] font-semibold text-ink-soft transition-colors hover:border-johor hover:text-accent"
        >
          <Icon name="rotate-ccw" size={11} /> {t('explore.resetFilters')} ({activeFilters})
        </button>
      )}
    </div>
  )

  const pins = CORRIDOR.map((s, i) => ({ ...s, x: 6 + (i / (CORRIDOR.length - 1)) * 88 }))

  return (
    <div>
      {/* ============================================================ DISCOVERY HEADER */}
      <section className="relative overflow-hidden border-b border-line bg-[#071D49]">
        <div className="absolute inset-0 opacity-70">
          <JohorSkyline />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#071D49] via-[#071D49]/94 to-[#071D49]/35" />
        <div className="shell relative py-7 lg:py-8">
          <nav className="mb-2.5 flex items-center gap-1.5 text-[11px] text-white/50" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">
              {t('explore.breadcrumbHome')}
            </Link>
            <Icon name="chevron-right" size={10} />
            <span className="text-white/80">{t('explore.breadcrumbExplore')}</span>
          </nav>

          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gold">
                {t('home.eyebrow')}
              </span>
            </div>
            <h1 className="text-[25px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white sm:text-[32px] lg:text-[36px]">
              {t('explore.title')}
            </h1>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-white/65 sm:text-[14px]">
              {t('explore.sub')}
            </p>
          </div>

          {/* search + quick selects */}
          <div className="mt-4 rounded-xl border border-white/12 bg-white/[0.07] p-2 backdrop-blur-md">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Icon
                  name="search"
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45"
                />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setParam('q', q)}
                  onBlur={() => setParam('q', q)}
                  placeholder={t('explore.searchPlaceholder')}
                  aria-label={t('common.search')}
                  className="h-10 w-full rounded-lg border border-transparent bg-white/[0.09] pl-9 pr-8 text-[13.5px] text-white placeholder:text-white/40 focus:border-gold/50 focus:bg-white/[0.13] focus:outline-none"
                />
                {q && (
                  <button
                    onClick={() => {
                      setQ('')
                      setParam('q', '')
                    }}
                    aria-label={t('common.clear')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/45 hover:text-white"
                  >
                    <Icon name="x" size={13} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={station}
                  onChange={(e) => setParam('station', e.target.value)}
                  aria-label={t('explore.stationLabel')}
                  className="h-10 rounded-lg border border-white/15 bg-[#0b2857] px-2.5 text-[12.5px] font-semibold text-white focus:border-gold/50 focus:outline-none"
                >
                  <option value="">{t('common.allStations')}</option>
                  {CORRIDOR.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <select
                  value={category}
                  onChange={(e) => setParam('category', e.target.value)}
                  aria-label={t('explore.categoryLabel')}
                  className="h-10 rounded-lg border border-white/15 bg-[#0b2857] px-2.5 text-[12.5px] font-semibold text-white focus:border-gold/50 focus:outline-none"
                >
                  <option value="">{t('common.all')}</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {t("category." + c.id)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setDrawer(true)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.09] px-3 text-[12.5px] font-bold text-white transition-colors hover:bg-white/[0.15] lg:hidden"
                >
                  <Icon name="sliders-horizontal" size={13} />
                  {t('common.filters')}
                  {activeFilters > 0 && (
                    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-johor px-1 text-[9.5px] font-black">
                      {activeFilters}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11.5px] text-white/55">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="train-front" size={12} className="text-gold" />
              <strong className="text-white/90 num">{CORRIDOR.length}</strong> {t('home.statStations')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="compass" size={12} className="text-gold" />
              <strong className="text-white/90 num">{exps.length}</strong> {t('home.statExperiences')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="store" size={12} className="text-gold" />
              <strong className="text-white/90 num">{operatorCount}</strong> {t('home.statOperators')}
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================ RAIL BAND */}
      <section className="border-b border-line bg-raised">
        <div className="shell py-2.5">
          <RailCorridor
            activeStationId={station || undefined}
            onSelect={(id) => setParam('station', station === id ? '' : id)}
            counts={counts}
            compact
          />
        </div>
      </section>

      {/* =================================================================== RESULTS */}
      <section className="shell py-5">
        <div className="flex gap-5">
          <aside className="hidden w-[208px] shrink-0 lg:block">
            <div className="sticky top-[74px] max-h-[calc(100vh-90px)] overflow-y-auto pr-1">
              <div className="mb-2.5 flex items-center justify-between">
                <h2 className="text-[11.5px] font-bold uppercase tracking-wider text-ink">
                  {t('common.filters')}
                </h2>
                <Icon name="sliders-horizontal" size={13} className="text-ink-faint" />
              </div>
              {filterPanel}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h2 className="text-[14.5px] font-extrabold text-ink num">
                  {t('common.resultsCount', { count: results.length })}
                </h2>
                {sort === 'bestMatch' && (
                  <span className="text-[11px] text-ink-faint">· {t('explore.rankedBy')}</span>
                )}
                {station && (
                  <span className="text-[11px] text-ink-mute">
                    · {stationById(station)?.name}
                  </span>
                )}
              </div>
              <label className="flex items-center gap-1.5 text-[11.5px] text-ink-mute">
                {t('common.sort')}
                <select
                  value={sort}
                  onChange={(e) => setParam('sort', e.target.value)}
                  className="h-8 rounded-md border border-line bg-raised px-2 text-[11.5px] font-semibold text-ink focus:border-lineStrong focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s} value={s}>
                      {t(`sort.${s}`)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line py-14 text-center">
                <Icon name="search-x" size={26} className="mx-auto text-ink-faint" />
                <p className="mt-3 text-[14px] font-bold text-ink">{t('common.noResults')}</p>
                <p className="mx-auto mt-1 max-w-sm text-[12.5px] text-ink-mute">
                  {t('common.noResultsBody')}
                </p>
                <button onClick={clearAll} className="btn btn-ghost btn-sm mt-4">
                  {t('explore.resetFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {results.map(({ exp, score, reasons }) => (
                  <ExperienceCard
                    key={exp.id}
                    exp={exp}
                    matchScore={score}
                    reasons={reasons}
                  />
                ))}
              </div>
            )}

            {results.length > 0 && (
              <p className="mt-4 text-center text-[11px] text-ink-faint">
                {t('explore.showing', { shown: results.length, total: exps.length })}
              </p>
            )}
          </div>

          {/* contextual panel — only when there is room */}
          <aside className="hidden w-[228px] shrink-0 2xl:block">
            <div className="sticky top-[74px]">
              <div className="card overflow-hidden">
                <div className="border-b border-line px-3 py-2">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink">
                    {t('explore.mapPreview')}
                  </p>
                </div>
                <div className="relative h-[176px] overflow-hidden bg-[#071D49]">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                    <line
                      x1="6"
                      y1="50"
                      x2="94"
                      y2="50"
                      stroke="#D4A64A"
                      strokeWidth="0.7"
                      strokeDasharray="3 2"
                    />
                  </svg>
                  {pins.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setParam('station', station === p.id ? '' : p.id)}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${p.x}%`, top: '50%' }}
                      aria-label={p.name}
                    >
                      <span
                        className={clsx(
                          'block h-2 w-2 rounded-full ring-2 transition-transform',
                          station === p.id
                            ? 'scale-150 bg-johor ring-white'
                            : 'bg-white/80 ring-white/25 hover:scale-125'
                        )}
                      />
                      <span
                        className={clsx(
                          'absolute left-1/2 top-3.5 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold',
                          station === p.id ? 'text-gold' : 'text-white/45'
                        )}
                      >
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="p-2.5">
                  <p className="text-[10px] leading-relaxed text-ink-faint">
                    {t('stations.routeNote')}
                  </p>
                  <Link
                    to="/map"
                    className="mt-2 flex items-center justify-center gap-1 rounded-md bg-inset py-1.5 text-[11px] font-bold text-ink transition-colors hover:bg-johor hover:text-white"
                  >
                    {t('explore.openMap')} <Icon name="arrow-right" size={10} />
                  </Link>
                </div>
              </div>

              {station && (
                <div className="card mt-3 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                    {t('explore.resultsFor')}
                  </p>
                  <p className="mt-1 text-[13.5px] font-extrabold text-ink">{stationById(station)?.name}</p>
                  <p className="mt-0.5 text-[11px] text-ink-mute">
                    {t('stations.experiences', { count: counts[station] ?? 0 })}
                  </p>
                  <Link
                    to={`/explore/stations/${station}`}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-accent"
                  >
                    {t('nav.corridor')} <Icon name="arrow-right" size={10} />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* ============================================================ MOBILE FILTERS */}
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('common.filters')}
            className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl border-t border-line bg-raised p-4 pb-6 animate-fadeUp"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[14px] font-extrabold text-ink">{t('common.filters')}</h2>
              <button
                onClick={() => setDrawer(false)}
                aria-label={t('common.close')}
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft"
              >
                <Icon name="x" size={15} />
              </button>
            </div>
            {filterPanel}
            <button onClick={() => setDrawer(false)} className="btn btn-primary btn-md mt-4 w-full">
              {t('explore.showing', { shown: results.length, total: exps.length })}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
