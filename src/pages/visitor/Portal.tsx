import { useMemo, useState } from 'react'
import { usePrefs } from '../../app/prefs'
import { CurrencyConverter } from '../../components/ui/CurrencyConverter'
import { LanguageToggle, ThemeToggle } from '../../components/ui/controls'
import { CURRENCIES } from '../../services/rates'
import { T } from '../../components/ui/T'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../../components/ui/Icon'
import { Button, DemoTag, EmptyState, Field, Meter, Stat, Stars } from '../../components/ui'
import { ExperienceCard } from '../../components/ExperienceCard'
import Scene from '../../components/art/Scene'
import { useApp, usePublishedExperiences } from '../../app/store'
import { generatePlans } from '../../services/itinerary'
import { matchExperiences } from '../../services/matching'
import { stationById, CORRIDOR } from '../../data/stations'
import { PURPOSES, INTERESTS, ACCESSIBILITY_OPTIONS } from '../../data/taxonomy'
import { hoursLabel, money, dateLabel } from '../../services/storage'
import { useMoneyText } from '../../app/currency'

export function VisitorDashboard() {
  const { tx } = usePrefs()
  const money = useMoneyText()
  const nav = useNavigate()
  const { profile, itineraries, favourites, experiences } = useApp()
  const exps = usePublishedExperiences()

  const matches = useMemo(() => matchExperiences(exps, profile, { limit: 4 }), [exps, profile])
  const plans = useMemo(() => generatePlans(exps, profile), [exps, profile])
  const station = stationById(profile.stationId)
  const myTrips = itineraries.filter((i) => i.source !== 'seed').slice(0, 3)
  const savedExps = experiences.filter((e) => favourites.includes(e.id)).slice(0, 3)
  const purposeLabel = PURPOSES.find((p) => p.id === profile.purpose)?.label ?? 'Not set'

  if (!profile.onboarded) {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <div className="rounded-2xl border border-line bg-raised p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-navy text-white">
            <Icon name="compass" size={22} />
          </span>
          <h1 className="mt-4 text-[22px] font-extrabold"><T>Let's set up your trip</T></h1>
          <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-ink-mute">
            Four quick questions about why you are in Johor, how long you have and what you are into. It takes under
            a minute and makes every recommendation better.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button onClick={() => nav('/visitor/onboarding')} icon="arrow-right"><T>Start setup</T></Button>
            <Button variant="ghost" onClick={() => nav('/explore')}><T>Just browse</T></Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-5 sm:p-6">
        <Scene seed="dash-hero" category="leisure" className="absolute inset-0 h-full w-full opacity-25" variant="hero" motif="shophouse" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/50" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-gold"><T>Your trip</T></p>
            <h1 className="mt-1 text-[24px] font-extrabold leading-tight text-white sm:text-[30px]">
              {hoursLabel(profile.availableMins)} around {station?.name}
            </h1>
            <p className="mt-1.5 text-[12.5px] text-white/55">
              {purposeLabel} · {money(profile.budget)} budget · {profile.partySize} {profile.partySize > 1 ? 'travellers' : 'traveller'}
              {profile.accessibility.length > 0 && ` · ${profile.accessibility.length} accessibility need${profile.accessibility.length > 1 ? 's' : ''}`}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => nav('/visitor/recommendations')} icon="sparkles"><T>See my matches</T></Button>
              <Button size="sm" variant="ghost" onClick={() => nav('/visitor/itinerary')} className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/15" icon="route">
                <T>Build itinerary</T>
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/visitor/profile" className="btn btn-sm !bg-white/10 !text-white !border-white/20 hover:!bg-white/15">
              <Icon name="settings" size={14} /> <T>Edit preferences</T>
            </Link>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Matched" value={matches.length > 0 ? `${matches.length}+` : '0'} icon="sparkles" tone="royal" hint="verified experiences fit your constraints" />
        <Stat label="Saved" value={favourites.length} icon="heart" tone="johor" hint="experiences in your favourites" />
        <Stat label="Itineraries" value={itineraries.length} icon="route" tone="emerald2" hint="saved and generated plans" />
        <Stat label={tx("Station")} value={station?.name ?? '—'} icon="train-front" tone="navy" hint={`~${station?.minutesFromJB ?? 0} min from JB Sentral`} />
      </div>

      {/* plans */}
      <div className="rounded-2xl border border-line bg-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-extrabold"><T>Suggested windows</T></h2>
            <p className="mt-0.5 text-[11.5px] text-ink-mute"><T>Generated deterministically from your preferences — no external AI service.</T></p>
          </div>
          <DemoTag label="Auto-generated" />
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => nav('/visitor/recommendations')}
              className="group rounded-xl border border-line p-3 text-left transition-all hover:border-navy-200 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold text-navy">{p.label}</p>
                <span className={clsx('rounded px-1.5 py-0.5 text-[10px] font-bold num',
                  p.items.length ? 'bg-emerald2-50 text-emerald2-700' : 'bg-navy-50 text-ink-mute')}>
                  {p.items.length} {p.items.length === 1 ? 'stop' : 'stops'}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-ink-mute">{p.narrative}</p>
              <div className="mt-2 flex items-center gap-2 text-[10.5px]">
                <span className={clsx('font-bold num', p.fitsBudget ? 'text-emerald2-700' : 'text-johor')}>{money(p.totalCost)}</span>
                <span className="text-ink-faint">·</span>
                <span className="text-ink-faint num">{hoursLabel(p.totalMins)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* matches */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold"><T>Top matches for you</T></h2>
          <Link to="/visitor/recommendations" className="text-[11.5px] font-bold text-royal hover:text-royal-700">
            <T>See all</T>
          </Link>
        </div>
        {matches.length === 0 ? (
          <EmptyState icon="filter-x" title={tx("Nothing passes your constraints")} body="Your accessibility or time requirements exclude everything near this station. Try a different station or widen your window." action={<Button variant="ghost" onClick={() => nav('/visitor/profile')}><T>Edit preferences</T></Button>} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {matches.map((m) => (
              <ExperienceCard key={m.experience.id} exp={m.experience} matchScore={m.score} reasons={m.reasons} />
            ))}
          </div>
        )}
      </div>

      {/* trips + saved */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-raised p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[14px] font-extrabold"><T>Your itineraries</T></h2>
            <Link to="/visitor/itineraries" className="text-[11px] font-bold text-royal"><T>All trips</T></Link>
          </div>
          {myTrips.length === 0 ? (
            <p className="rounded-xl bg-canvas px-3 py-6 text-center text-[12px] text-ink-faint">
              <T>No saved itineraries yet. Build one from your matches.</T>
            </p>
          ) : (
            <div className="space-y-2">
              {myTrips.map((t) => (
                <Link key={t.id} to="/visitor/itinerary" className="flex items-center gap-3 rounded-xl border border-line p-2.5 transition-colors hover:border-navy-200">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy">
                    <Icon name="route" size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-navy">{t.name}</p>
                    <p className="text-[10.5px] text-ink-faint">{stationById(t.stationId)?.name} · {t.items.length} stops · {dateLabel(t.date)}</p>
                  </div>
                  <Icon name="chevron-right" size={14} className="text-ink-faint" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-raised p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[14px] font-extrabold"><T>Saved experiences</T></h2>
            <Link to="/visitor/favourites" className="text-[11px] font-bold text-royal"><T>All saved</T></Link>
          </div>
          {savedExps.length === 0 ? (
            <p className="rounded-xl bg-canvas px-3 py-6 text-center text-[12px] text-ink-faint">
              <T>Nothing saved yet. Tap the heart on any experience.</T>
            </p>
          ) : (
            <div className="space-y-2">
              {savedExps.map((e) => (
                <Link key={e.id} to={`/experiences/${e.id}`} className="flex items-center gap-3 rounded-xl border border-line p-2.5 transition-colors hover:border-navy-200">
                  <div className="h-9 w-12 shrink-0 overflow-hidden rounded-lg bg-navy-900">
                    <Scene seed={e.id} category={e.category} className="h-full w-full" variant="thumb" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-navy">{e.title}</p>
                    <p className="text-[10.5px] text-ink-faint">{stationById(e.stationId)?.name} · {money(e.price)}</p>
                  </div>
                  <Icon name="heart" size={16} className="shrink-0 text-johor" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Recommendations() {
  const { tx } = usePrefs()
  const money = useMoneyText()
  const { profile, setProfile, toast } = useApp()
  const exps = usePublishedExperiences()
  const nav = useNavigate()
  const [rain, setRain] = useState(false)
  const [duration, setDuration] = useState(profile.availableMins)
  const [budget, setBudget] = useState(profile.budget)
  const [station, setStation] = useState(profile.stationId)
  const [showExplainer, setShowExplainer] = useState(false)
  const [lastRemoved, setLastRemoved] = useState<string[]>([])

  const activeProfile = { ...profile, availableMins: duration, budget, stationId: station }
  const prevProfile = { ...profile, availableMins: profile.availableMins, budget: profile.budget, stationId: profile.stationId }

  const results = useMemo(() => matchExperiences(exps, activeProfile, { rain, limit: 12 }), [exps, activeProfile, rain])
  const prevResults = useMemo(() => matchExperiences(exps, prevProfile, { limit: 12 }), [exps, prevProfile])

  const removed = useMemo(() => {
    const now = new Set(results.map((r) => r.experience.id))
    return prevResults.filter((r) => !now.has(r.experience.id)).map((r) => r.experience.title)
  }, [results, prevResults])

  const plans = useMemo(() => generatePlans(exps, activeProfile, rain), [exps, activeProfile, rain])

  const reset = () => {
    setDuration(profile.availableMins)
    setBudget(profile.budget)
    setStation(profile.stationId)
    setRain(false)
    setLastRemoved([])
  }

  const apply = () => {
    if (removed.length) setLastRemoved(removed)
    setProfile({ ...profile, availableMins: duration, budget, stationId: station })
    toast('Recommendations recalculated', `${results.length} experiences match your updated window.`, 'info')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold sm:text-[28px]"><T>Your matches</T></h1>
          <p className="mt-1 text-[13px] text-ink-mute">
            <T>Ranked by five weighted factors. Hard constraints applied first.</T>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon="help-circle" onClick={() => setShowExplainer((s) => !s)}>
            <T>Why these?</T>
          </Button>
          <Button variant="navy" size="sm" icon="route" onClick={() => nav('/visitor/itinerary')}>
            <T>Build itinerary</T>
          </Button>
        </div>
      </div>

      {showExplainer && (
        <div className="rounded-2xl border border-royal-200 bg-royal-50/60 p-4 animate-fadeUp">
          <div className="flex items-start justify-between">
            <p className="text-[13px] font-extrabold text-navy"><T>How the matching engine works</T></p>
            <button onClick={() => setShowExplainer(false)} aria-label={tx("Close")} className="text-ink-faint hover:text-navy">
              <Icon name="x" size={15} />
            </button>
          </div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-5">
            {[
              ['Interest', 25], ['Time', 25], ['Rail access', 25], ['Budget', 15], ['Purpose', 10],
            ].map(([l, w]) => (
              <div key={l as string} className="rounded-lg bg-raised px-2.5 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">{l}</p>
                <p className="mt-0.5 text-[16px] font-extrabold text-navy num">{w}%</p>
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-[11px] leading-relaxed text-ink-mute">
            These are proposed product weights for this mockup, not research-validated coefficients. Before ranking,
            experiences that fail an accessibility requirement or grossly exceed your available time are removed
            entirely rather than scored down.
          </p>
        </div>
      )}

      {/* scenario controls */}
      <div className="rounded-2xl border border-line bg-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-extrabold"><T>Adjust the scenario</T></p>
          <button onClick={reset} className="text-[11px] font-semibold text-royal hover:text-royal-700"><T>Reset to saved</T></button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint"><T>Available time</T></p>
            <div className="flex gap-1">
              {[120, 240, 300, 420].map((d) => (
                <button key={d} onClick={() => setDuration(d)}
                  className={clsx('flex-1 rounded-lg border py-1.5 text-[11px] font-bold transition-all',
                    duration === d ? 'border-royal bg-royal-50 text-royal-800' : 'border-line text-ink-mute hover:border-navy-200')}>
                  {d < 300 ? `${d / 60}h` : d === 300 ? 'Half' : 'Full'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">
              <T>Budget</T> <span className="text-[11px] text-navy num">{money(budget)}</span>
            </p>
            <input type="range" min={30} max={600} step={10} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-royal" aria-label={tx("Budget")} />
          </div>

          <div>
            <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint"><T>Station</T></p>
            <select value={station} onChange={(e) => setStation(e.target.value)} className="field !h-8 !py-0 !text-[12px]">
              {CORRIDOR.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint"><T>Weather scenario</T></p>
            <button
              onClick={() => setRain(!rain)}
              className={clsx('flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border text-[11.5px] font-bold transition-all',
                rain ? 'border-royal bg-navy text-white' : 'border-line text-ink-mute hover:border-navy-200')}
              aria-pressed={rain}
            >
              <Icon name={rain ? 'moon' : 'sun'} size={12} />
              {rain ? 'Rain simulation on' : 'Simulate rain'}
            </button>
          </div>
        </div>

        {rain && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-royal-50 px-3 py-2.5 animate-fadeUp">
            <Icon name="moon" size={14} className="mt-0.5 shrink-0 text-royal" />
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-bold text-navy"><T>Rain scenario active</T></p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-navy-600">
                Outdoor experiences are scored down and indoor alternatives are lifted. This demonstrates adaptive
                matching — the same visitor, the same window, different conditions.
              </p>
            </div>
            <Button size="sm" variant="quiet" onClick={() => setRain(false)}><T>Dismiss</T></Button>
          </div>
        )}

        {removed.length > 0 && (
          <div className="mt-3 rounded-xl bg-johor-50 px-3 py-2.5 animate-fadeUp">
            <p className="text-[11.5px] font-bold text-johor-800">{removed.length} experience{removed.length > 1 ? 's' : ''} no longer fit</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-johor-700">
              {removed.slice(0, 3).join(', ')}{removed.length > 3 ? ` and ${removed.length - 3} more` : ''} — removed
              because the new time or budget window no longer accommodates them.
            </p>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <p className="text-[11.5px] text-ink-mute">
            <span className="font-bold text-navy num">{results.length}</span> experiences pass your constraints
          </p>
          <Button size="sm" onClick={apply} icon="refresh-cw"><T>Save these preferences</T></Button>
        </div>
      </div>

      {/* plans */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold"><T>Three itineraries, sized to your window</T></h2>
          <DemoTag label="Deterministic logic" />
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.id} className="flex flex-col rounded-2xl border border-line bg-raised p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-extrabold text-navy">{p.label}</p>
                  <p className="mt-0.5 text-[10.5px] text-ink-faint">{p.blurb}</p>
                </div>
                <span className={clsx('shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                  p.items.length ? 'bg-emerald2-50 text-emerald2-700' : 'bg-navy-50 text-ink-mute')}>
                  {p.items.length} stops
                </span>
              </div>

              {p.items.length === 0 ? (
                <div className="my-4 flex-1 rounded-xl bg-canvas px-3 py-6 text-center">
                  <p className="text-[11.5px] text-ink-faint"><T>No verified experience fits this window.</T></p>
                </div>
              ) : (
                <div className="my-3 flex-1 space-y-1.5">
                  {p.items.map((it, i) => {
                    const exp = exps.find((e) => e.id === it.experienceId)
                    return (
                      <div key={it.id} className="flex items-start gap-2 rounded-lg bg-canvas px-2 py-1.5">
                        <span className="mt-0.5 text-[10px] font-bold text-royal num">{it.startTime}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-semibold text-navy">{exp?.title}</p>
                          <p className="text-[9.5px] text-ink-faint">{hoursLabel(it.durationMins)} · {money(it.price)}{it.transportMins > 0 && ` · ${it.transportMins}min rail`}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="border-t border-line pt-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-ink-mute"><T>Estimated</T></span>
                  <span className={clsx('font-extrabold num', p.fitsBudget ? 'text-navy' : 'text-johor')}>{money(p.totalCost)}</span>
                </div>
                <p className="mt-1 text-[10px] leading-snug text-ink-faint">{p.narrative}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* results */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold"><T>Individual matches</T></h2>
          <span className="text-[11px] text-ink-faint"><T>Score shown as percentage</T></span>
        </div>
        {results.length === 0 ? (
          <EmptyState icon="filter-x" title={tx("No experiences pass your constraints")} body="Every listing was excluded by an accessibility requirement or time mismatch. Try a longer window, a different station, or review your accessibility needs." action={<Button variant="ghost" onClick={reset} icon="rotate-ccw"><T>Reset scenario</T></Button>} />
        ) : (
          <div className="space-y-2.5">
            {results.map((r) => (
              <div key={r.experience.id} className="rounded-2xl border border-line bg-raised p-3 transition-all hover:border-navy-200 hover:shadow-card">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <ExperienceCard exp={r.experience} variant="row" matchScore={r.score} reasons={r.reasons} />
                  </div>
                  <div className="shrink-0 border-t border-line pt-2.5 sm:w-[188px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink-faint"><T>Score breakdown</T></p>
                    <div className="space-y-1.5">
                      {[
                        ['Interest', r.breakdown.interest],
                        ['Time', r.breakdown.time],
                        ['Access', r.breakdown.access],
                        ['Budget', r.breakdown.budget],
                        ['Purpose', r.breakdown.purpose],
                      ].map(([l, v]) => (
                        <div key={l as string}>
                          <div className="flex justify-between text-[9.5px] font-medium text-ink-mute">
                            <span>{l}</span>
                            <span className="num">{v}</span>
                          </div>
                          <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-navy-100">
                            <div className="h-full rounded-full bg-royal" style={{ width: `${v}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function VisitorProfilePage() {
  const { t, tx, currency, setCurrency } = usePrefs()
  const money = useMoneyText()
  const { profile, setProfile, toast } = useApp()
  const [draft, setDraft] = useState({ ...profile })
  const [dirty, setDirty] = useState(false)

  const set = <K extends keyof typeof draft>(k: K, v: (typeof draft)[K]) => {
    setDraft((d) => ({ ...d, [k]: v }))
    setDirty(true)
  }

  const toggle = (field: 'interests' | 'transport' | 'accessibility', id: string) => {
    const cur = draft[field]
    set(field, cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-[24px] font-extrabold"><T>Profile & preferences</T></h1>
        <p className="mt-1 text-[13px] text-ink-mute"><T>Changes apply to matching immediately after saving.</T></p>
      </div>

      {/* language / currency / theme — the three persistence controls */}
      <div className="rounded-2xl border border-line bg-raised p-5">
        <h2 className="text-[14px] font-extrabold"><T>Interface preferences</T></h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label={tx('Language')}>
            <LanguageToggle />
          </Field>
          <Field label={tx('Display currency')}>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="field !h-8 !text-[11.5px] font-bold" aria-label={tx('Display currency')}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label={tx('Theme')}>
            <ThemeToggle />
          </Field>
        </div>
        <p className="mt-2 text-[10.5px] leading-relaxed text-ink-faint">
          <T>MYR remains the stored base currency. Display currency only changes the number you read.</T>
        </p>
        <div className="mt-3">
          <CurrencyConverter />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-raised p-5">
        <h2 className="text-[14px] font-extrabold"><T>About you</T></h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label={tx("Display name")}>
            <input className="field" value={draft.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label={tx("Email (mock)")}>
            <input className="field" type="email" value={draft.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
          </Field>
          <Field label="Country">
            <select className="field" value={draft.country} onChange={(e) => set('country', e.target.value)}>
              {['Singapore', 'Indonesia', 'Australia', 'United Kingdom', 'Japan', 'South Korea', 'China', 'India', 'United States', 'Germany', 'Other'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Language">
            <select className="field" value={draft.language} onChange={(e) => set('language', e.target.value)}>
              {['English', 'Bahasa Melayu', 'Mandarin', 'Tamil', 'Japanese', 'Korean'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-raised p-5">
        <h2 className="text-[14px] font-extrabold"><T>Travel purpose</T></h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          {PURPOSES.map((p) => (
            <button key={p.id} onClick={() => set('purpose', p.id)}
              className={clsx('rounded-xl border-2 px-2.5 py-2.5 text-left transition-all',
                draft.purpose === p.id ? 'border-royal bg-royal-50/60' : 'border-line hover:border-navy-200')}>
              <Icon name={p.glyph} size={15} className={draft.purpose === p.id ? 'text-royal' : 'text-ink-faint'} />
              <p className="mt-1.5 text-[11.5px] font-bold text-navy">{p.label.replace(' traveller', '')}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-raised p-5">
        <h2 className="text-[14px] font-extrabold"><T>Time, budget & station</T></h2>
        <div className="mt-3 space-y-4">
          <div>
            <div className="mb-1.5 flex justify-between">
              <p className="text-[12px] font-semibold text-ink-soft"><T>Available time</T></p>
              <span className="text-[12px] font-bold text-navy num">{hoursLabel(draft.availableMins)}</span>
            </div>
            <input type="range" min={60} max={480} step={30} value={draft.availableMins} onChange={(e) => set('availableMins', Number(e.target.value))} className="w-full accent-royal" aria-label={tx("Available time")} />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between">
              <p className="text-[12px] font-semibold text-ink-soft"><T>Budget per person</T></p>
              <span className="text-[12px] font-bold text-navy num">{money(draft.budget)}</span>
            </div>
            <input type="range" min={30} max={600} step={10} value={draft.budget} onChange={(e) => set('budget', Number(e.target.value))} className="w-full accent-royal" aria-label={tx("Budget")} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={tx("Preferred station")}>
              <select className="field" value={draft.stationId} onChange={(e) => set('stationId', e.target.value)}>
                {CORRIDOR.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Travellers">
              <select className="field" value={draft.partySize} onChange={(e) => set('partySize', Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-raised p-5">
        <h2 className="text-[14px] font-extrabold"><T>Interests</T></h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {INTERESTS.map((i) => (
            <button key={i.id} onClick={() => toggle('interests', i.id)}
              className={clsx('rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all',
                draft.interests.includes(i.id) ? 'border-navy bg-navy text-white' : 'border-line text-ink-soft hover:border-navy-300')}>
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-raised p-5">
        <h2 className="text-[14px] font-extrabold"><T>Accessibility requirements</T></h2>
        <p className="mt-1 text-[11.5px] text-ink-mute"><T>Applied as hard constraints, not soft preferences.</T></p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {ACCESSIBILITY_OPTIONS.map((a) => (
            <label key={a.id} className={clsx('flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors',
              draft.accessibility.includes(a.id) ? 'border-emerald2 bg-emerald2-50/50' : 'border-line hover:border-navy-200')}>
              <input type="checkbox" checked={draft.accessibility.includes(a.id)} onChange={() => toggle('accessibility', a.id)} className="accent-emerald2" />
              <span className="text-[12px] font-semibold text-ink-soft">{a.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="sticky bottom-20 flex items-center justify-between rounded-2xl border border-line bg-raised p-3.5 shadow-lift lg:bottom-4">
        <p className="text-[11.5px] text-ink-mute">{dirty ? 'You have unsaved changes' : 'All changes saved'}</p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setDraft({ ...profile }); setDirty(false) }} disabled={!dirty}><T>Reset</T></Button>
          <Button size="sm" icon="save" onClick={() => { setProfile(draft); setDirty(false); toast('Preferences saved', 'Recommendations updated.', 'success') }} disabled={!dirty}>
            <T>Save changes</T>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Favourites() {
  const { tx } = usePrefs()
  const { favourites, experiences } = useApp()
  const saved = experiences.filter((e) => favourites.includes(e.id))

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] font-extrabold"><T>Saved experiences</T></h1>
        <p className="mt-1 text-[13px] text-ink-mute">{saved.length} saved · stored in this browser</p>
      </div>
      {saved.length === 0 ? (
        <EmptyState icon="heart" title={tx("Nothing saved yet")} body={tx("Tap the heart on any experience to keep it here for later.")} action={<Link to="/explore" className="btn btn-primary btn-md"><T>Explore experiences</T></Link>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((e) => <ExperienceCard key={e.id} exp={e} />)}
        </div>
      )}
    </div>
  )
}
