import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../components/ui/Icon'
import { Button, DemoTag, EmptyState, Skeleton, Segmented } from '../components/ui'
import { ExperienceCard, RailCorridor } from '../components/ExperienceCard'
import { usePublishedExperiences, useApp } from '../app/store'
import { STATIONS, stationById, CORRIDOR } from '../data/stations'
import { CATEGORIES, PURPOSES } from '../data/taxonomy'
import { money, hoursLabel } from '../services/storage'
import { matchExperiences } from '../services/matching'

type SortKey = 'match' | 'price-low' | 'price-high' | 'duration' | 'rating'

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const exps = usePublishedExperiences()
  const { profile, setProfile } = useApp()

  const [station, setStation] = useState(params.get('station') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? '')
  const [purpose, setPurpose] = useState(params.get('purpose') ?? '')
  const [maxPrice, setMaxPrice] = useState(300)
  const [maxDuration, setMaxDuration] = useState(300)
  const [stepFree, setStepFree] = useState(false)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('match')
  const [showFilters, setShowFilters] = useState(false)
  const [loading] = useState(false)

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const e of exps) c[e.stationId] = (c[e.stationId] ?? 0) + 1
    return c
  }, [exps])

  const filtered = useMemo(() => {
    let list = exps
    if (station) list = list.filter((e) => e.stationId === station)
    if (category) list = list.filter((e) => e.category === category)
    if (stepFree) list = list.filter((e) => e.accessibility.stepFree)
    list = list.filter((e) => e.price <= maxPrice && e.durationMins <= maxDuration)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.town.toLowerCase().includes(q) ||
          e.tags.some((t) => t.includes(q))
      )
    }
    if (purpose) list = list.filter((e) => e.bestFor.includes(purpose as never))

    const sorted = [...list]
    if (sort === 'price-low') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-high') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'duration') sorted.sort((a, b) => a.durationMins - b.durationMins)
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    else sorted.sort((a, b) => b.featured === a.featured ? b.views - a.views : Number(b.featured) - Number(a.featured))
    return sorted
  }, [exps, station, category, stepFree, maxPrice, maxDuration, search, purpose, sort])

  const scored = useMemo(() => {
    if (sort !== 'match') return null
    const p = { ...profile, purpose: (purpose || profile.purpose) as never }
    return matchExperiences(filtered, p, { limit: 60 })
  }, [filtered, profile, purpose, sort])

  const activeFilters = [station, category, purpose, stepFree ? 'a' : ''].filter(Boolean).length

  const clearAll = () => {
    setStation('')
    setCategory('')
    setPurpose('')
    setStepFree(false)
    setMaxPrice(300)
    setMaxDuration(300)
    setSearch('')
    setParams({})
  }

  const applyPurpose = (id: string) => {
    setPurpose(id)
    setProfile({ ...profile, purpose: id as never })
  }

  const FilterPanel = (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-faint">ETS station</p>
        <div className="space-y-0.5">
          <button
            onClick={() => setStation('')}
            className={clsx(
              'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[12.5px] font-semibold transition-colors',
              !station ? 'bg-navy-50 text-navy' : 'text-ink-mute hover:bg-navy-50/60 hover:text-navy'
            )}
          >
            <span>All stations</span>
            <span className="text-[10.5px] text-ink-faint num">{exps.length}</span>
          </button>
          {[...CORRIDOR].map((s) => (
            <button
              key={s.id}
              onClick={() => setStation(s.id)}
              className={clsx(
                'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[12.5px] font-semibold transition-colors',
                station === s.id ? 'bg-navy-50 text-navy' : 'text-ink-mute hover:bg-navy-50/60 hover:text-navy'
              )}
            >
              <span className="truncate">{s.name}</span>
              <span className="text-[10.5px] text-ink-faint num">{counts[s.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-faint">Experience type</p>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setCategory('')} className={clsx('chip', !category && 'chip-active')}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id === category ? '' : c.id)}
              className={clsx('chip', category === c.id && 'chip-active')}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-faint">Travelling for</p>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setPurpose('')} className={clsx('chip', !purpose && 'chip-active')}>
            Any
          </button>
          {PURPOSES.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPurpose(p.id === purpose ? '' : p.id)}
              className={clsx('chip', purpose === p.id && 'chip-active')}
            >
              {p.label.replace(' traveller', '')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Max price</p>
          <span className="text-[12px] font-bold text-navy num">{money(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={20}
          max={300}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-royal"
          aria-label="Maximum price in ringgit"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Max duration</p>
          <span className="text-[12px] font-bold text-navy num">{hoursLabel(maxDuration)}</span>
        </div>
        <input
          type="range"
          min={60}
          max={300}
          step={30}
          value={maxDuration}
          onChange={(e) => setMaxDuration(Number(e.target.value))}
          className="w-full accent-royal"
          aria-label="Maximum duration"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-2.5 py-2">
        <input type="checkbox" checked={stepFree} onChange={(e) => setStepFree(e.target.checked)} className="accent-emerald2" />
        <span className="text-[12px] font-semibold text-ink-soft">Step-free access only</span>
      </label>

      {activeFilters > 0 && (
        <Button variant="quiet" size="sm" className="w-full" onClick={clearAll} icon="x">
          Clear all filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas">
      {/* header */}
      <div className="border-b border-line bg-white">
        <div className="shell py-7">
          <nav className="mb-3 flex items-center gap-1.5 text-[11.5px] text-ink-faint" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-navy">Home</Link>
            <Icon name="chevron-right" size={11} />
            <span className="font-semibold text-ink-soft">Explore</span>
          </nav>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[26px] font-extrabold leading-tight sm:text-[32px]">
                {station ? `Experiences near ${stationById(station)?.name}` : 'Discover experiences'}
              </h1>
              <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-ink-mute">
                {station
                  ? stationById(station)?.blurb
                  : 'Every listing is run by a small or medium operator along the ETS corridor. Filter by what you can actually fit into your day.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DemoTag label="Demo listings" />
              <Button variant="ghost" size="sm" icon="sliders-horizontal" className="lg:hidden" onClick={() => setShowFilters((s) => !s)}>
                Filters {activeFilters > 0 && `(${activeFilters})`}
              </Button>
            </div>
          </div>

          <div className="mt-5">
            <RailCorridor activeStationId={station} onSelect={(id) => setStation(id === station ? '' : id)} counts={counts} />
          </div>
        </div>
      </div>

      <div className="shell py-6">
        {/* search + sort bar */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Search experiences</span>
            <Icon name="search" size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workshops, batik, durian, Kluang…"
              className="field pl-10"
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-navy">
                <Icon name="x" size={15} />
              </button>
            )}
          </label>

          <div className="flex items-center gap-2">
            <span className="hidden text-[11.5px] font-semibold text-ink-faint sm:block">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="field !h-9 !w-auto !py-0 !text-[12.5px] font-semibold">
              <option value="match">Best match</option>
              <option value="rating">Highest rated</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="duration">Shortest duration</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[228px_1fr]">
          {/* sidebar */}
          <aside className={clsx('lg:block', showFilters ? 'block' : 'hidden')}>
            <div className="sticky top-24 rounded-2xl border border-line bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[13px] font-bold text-navy">Filters</p>
                {activeFilters > 0 && (
                  <span className="rounded-full bg-royal px-1.5 py-0.5 text-[10px] font-bold text-white num">{activeFilters}</span>
                )}
              </div>
              {FilterPanel}
            </div>
          </aside>

          {/* results */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[12.5px] text-ink-mute">
                <span className="font-bold text-navy num">{filtered.length}</span> experiences
                {station && <> near <span className="font-semibold text-navy">{stationById(station)?.name}</span></>}
                {sort === 'match' && <span className="ml-1.5 text-ink-faint">· ranked by your match score</span>}
              </p>
              {activeFilters > 0 && (
                <button onClick={clearAll} className="text-[11.5px] font-semibold text-royal hover:text-royal-700">
                  Reset
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <Skeleton className="h-[150px] rounded-none" />
                    <div className="space-y-2 p-3.5">
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon="search-x"
                title="No experiences match those filters"
                body="Try widening your price range, removing the station filter, or clearing the accessibility requirement."
                action={<Button variant="ghost" onClick={clearAll} icon="rotate-ccw">Reset filters</Button>}
              />
            ) : sort === 'match' && scored ? (
              scored.length === 0 ? (
                <EmptyState
                  icon="filter-x"
                  title="Nothing passes your hard constraints"
                  body="Your accessibility or time requirements exclude every listing here. Widen the station filter to see options further along the corridor."
                  action={<Button variant="ghost" onClick={clearAll}>Clear filters</Button>}
                />
              ) : (
                <div className="space-y-2.5">
                  {scored.map((r) => (
                    <ExperienceCard key={r.experience.id} exp={r.experience} variant="row" matchScore={r.score} reasons={r.reasons} />
                  ))}
                </div>
              )
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((e) => (
                  <ExperienceCard key={e.id} exp={e} />
                ))}
              </div>
            )}

            {filtered.length > 0 && sort !== 'match' && (
              <p className="mt-6 text-center text-[11.5px] text-ink-faint">
                Showing all {filtered.length} results · demo dataset
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
