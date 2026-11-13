import React, { useMemo } from 'react'
import { usePrefs } from '../app/prefs'
import { T } from '../components/ui/T'
import { Link, useParams } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../components/ui/Icon'
import { Button, DemoTag, EmptyState, Stars } from '../components/ui'
import { ExperienceCard, RailCorridor } from '../components/ExperienceCard'
import Scene from '../components/art/Scene'
import { usePublishedExperiences } from '../app/store'
import { STATIONS, stationById, CORRIDOR } from '../data/stations'
import { PURPOSES } from '../data/taxonomy'
import { RAIL_SOURCE } from '../data/stations'
import { hoursLabel, money } from '../services/storage'

export function StationsIndex() {
  const exps = usePublishedExperiences()
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const e of exps) c[e.stationId] = (c[e.stationId] ?? 0) + 1
    return c
  }, [exps])

  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-line bg-navy-900">
        <div className="shell py-12">
          <nav className="mb-3 flex items-center gap-1.5 text-[11.5px] text-white/40" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <Icon name="chevron-right" size={11} />
            <span className="text-white/70">ETS corridor</span>
          </nav>
          <h1 className="max-w-2xl text-[30px] font-extrabold leading-[1.1] text-white sm:text-[42px]">
            <T>Nine stations. One line. Most of them you have never heard of.</T>
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/60">
            The ETS now runs from Gemas junction south through Segamat, Labis, Bekok, Paloh and Kluang to JB Sentral.
            Each stop is a town with its own operators — and its own last-mile reality.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-white/15 bg-white/[0.07] px-2.5 py-1.5 text-[11px] font-semibold text-white/70">
              <Icon name="train-front" size={11} className="mr-1 inline" />
              KL–JB through-service since Dec 2025
            </span>
            <span className="rounded-lg border border-white/15 bg-white/[0.07] px-2.5 py-1.5 text-[11px] font-semibold text-white/70">
              4 services per direction per day
            </span>
            <DemoTag label="Illustrative timings" className="border-white/10 bg-white/10 text-white/50 ring-white/10" />
          </div>
        </div>
      </div>

      <div className="shell py-8">
        <div className="mb-6 rounded-2xl border border-line bg-white px-4 py-3">
          <RailCorridor counts={counts} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...CORRIDOR].map((s) => {
            const townExps = exps.filter((e) => e.stationId === s.id)
            return (
              <Link
                key={s.id}
                to={`/explore/stations/${s.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift"
              >
                <div className="relative h-[124px] overflow-hidden bg-navy-900">
                  <Scene seed={s.id} category={s.order > 3 ? 'nature' : 'heritage'} className="h-full w-full transition-transform duration-500 group-hover:scale-105" variant="thumb" motif={s.order > 4 ? 'field' : 'shophouse'} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 to-transparent p-3">
                    <p className="text-[16px] font-extrabold text-white">{s.name}</p>
                    <p className="text-[10.5px] text-white/60">{s.district} · {s.state}</p>
                  </div>
                  {s.id === 'gemas' && (
                    <span className="absolute right-2 top-2 rounded-md bg-gold px-1.5 py-0.5 text-[9.5px] font-bold uppercase text-navy">
                      Interchange
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="line-clamp-2 text-[12.5px] leading-relaxed text-ink-mute">{s.blurb}</p>
                  <div className="mt-3 flex items-center gap-3 border-t border-line pt-3 text-[11px]">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald2-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald2" />
                      {counts[s.id] ?? 0} experiences
                    </span>
                    <span className="inline-flex items-center gap-1 text-ink-faint">
                      <Icon name="clock" size={11} /> ~{s.minutesFromJB} min from JB
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.towns.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-md bg-navy-50 px-1.5 py-0.5 text-[10px] font-medium text-navy-600">{t}</span>
                    ))}
                  </div>
                  {townExps.length > 0 && (
                    <p className="mt-2.5 truncate text-[10.5px] text-ink-faint">
                      e.g. {townExps[0].title}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-white p-4">
          <div className="flex items-start gap-2.5">
            <Icon name="info" size={15} className="mt-0.5 shrink-0 text-royal" />
            <div className="text-[11.5px] leading-relaxed text-ink-mute">
              <p className="font-bold text-navy"><T>On rail accuracy</T></p>
              <p className="mt-1">
                Station names and order were verified against KTMB ETS route information on {RAIL_SOURCE.lastVerified}.
                Not every station receives the same number of services, and journey times shown here are illustrative
                estimates for the mockup, not live KTMB schedules. Always confirm with{' '}
                <a href={RAIL_SOURCE.url} target="_blank" rel="noreferrer noopener" className="font-semibold text-royal underline">
                  ktmb.com.my
                </a>{' '}
                before travelling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StationDetail() {
  const { tx } = usePrefs()
  const { stationId } = useParams()
  const station = stationById(stationId)
  const exps = usePublishedExperiences()

  if (!station) {
    return (
      <div className="shell py-20">
        <EmptyState icon="map-pin-off" title={tx("Station not found")} body={tx("That station is not part of the JOHOR360 demo corridor.")} action={<Link to="/explore/stations" className="btn btn-primary btn-md"><T>Back to corridor</T></Link>} />
      </div>
    )
  }

  const list = exps.filter((e) => e.stationId === station.id)
  const idx = CORRIDOR.findIndex((s) => s.id === station.id)
  const next = CORRIDOR[idx - 1]
  const prev = CORRIDOR[idx + 1]

  return (
    <div className="min-h-screen bg-canvas">
      <div className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0 opacity-30">
          <Scene seed={station.id} category="heritage" className="h-full w-full" variant="hero" motif={station.order > 4 ? 'field' : 'shophouse'} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/60" />
        <div className="shell relative py-10">
          <nav className="mb-4 flex items-center gap-1.5 text-[11.5px] text-white/40" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <Icon name="chevron-right" size={11} />
            <Link to="/explore/stations" className="hover:text-white/70">Corridor</Link>
            <Icon name="chevron-right" size={11} />
            <span className="text-white/70">{station.name}</span>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Stop {CORRIDOR.length - idx} of {CORRIDOR.length}
                </span>
                {station.id === 'gemas' && (
                  <span className="rounded-md bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy">Interchange</span>
                )}
              </div>
              <h1 className="text-[30px] font-extrabold leading-tight text-white sm:text-[40px]">{station.name}</h1>
              <p className="mt-1 text-[13px] text-white/50">
                {station.district} District · {station.state} · ~{station.minutesFromJB} min from JB Sentral
              </p>
            </div>
            <div className="flex gap-2">
              {prev && (
                <Link to={`/explore/stations/${prev.id}`} className="btn btn-sm !bg-white/10 !text-white !border-white/20 hover:!bg-white/15">
                  <Icon name="arrow-left" size={14} /> {prev.name}
                </Link>
              )}
              {next && (
                <Link to={`/explore/stations/${next.id}`} className="btn btn-sm !bg-white/10 !text-white !border-white/20 hover:!bg-white/15">
                  {next.name} <Icon name="arrow-right" size={14} />
                </Link>
              )}
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-white/65">{station.blurb}</p>
        </div>
      </div>

      <div className="shell py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[17px] font-extrabold">Experiences at {station.name}</h2>
              <DemoTag label="Demo listings" />
            </div>
            {list.length === 0 ? (
              <EmptyState
                icon="circle-slash"
                title={tx("No listed operator here yet")}
                body={`${station.name} is on the corridor but no verified operator has been onboarded in this demo dataset. This is exactly the gap JOHOR360 is built to close.`}
                action={<Link to="/explore" className="btn btn-ghost btn-md">Browse whole corridor</Link>}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {list.map((e) => (
                  <ExperienceCard key={e.id} exp={e} />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="mb-3 text-[12px] font-bold uppercase tracking-wider text-ink-faint">Getting here</p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <Icon name="train-front" size={14} className="mt-0.5 text-royal" />
                  <div>
                    <p className="text-[12px] font-bold text-navy">ETS service</p>
                    <p className="text-[11px] text-ink-mute">
                      ~{station.minutesFromJB} min from JB Sentral · {station.servicesPerDay} services/day (illustrative)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="clock" size={14} className="mt-0.5 text-royal" />
                  <div>
                    <p className="text-[12px] font-bold text-navy">Frequency note</p>
                    <p className="text-[11px] leading-snug text-ink-mute">
                      Four through-services per direction per day. Missing a train can mean a long wait — always check the return leg.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="mb-3 text-[12px] font-bold uppercase tracking-wider text-ink-faint">Last mile</p>
              <div className="space-y-2.5">
                {station.lastMile.map((l) => (
                  <div key={l.label} className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-navy">{l.label}</p>
                      <p className="text-[10.5px] leading-snug text-ink-faint">{l.note}</p>
                    </div>
                    <span
                      className={clsx(
                        'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                        l.available === true
                          ? 'bg-emerald2-50 text-emerald2-700'
                          : 'bg-gold-50 text-gold-800'
                      )}
                    >
                      {l.available === true ? `${l.minutes} min` : 'Unknown'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 border-t border-line pt-2.5 text-[10px] leading-relaxed text-ink-faint">
                “Unknown” means we have not confirmed the service. JOHOR360 does not invent transport that might not exist.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="mb-2.5 text-[12px] font-bold uppercase tracking-wider text-ink-faint">Nearby towns</p>
              <div className="flex flex-wrap gap-1.5">
                {station.towns.map((t) => (
                  <span key={t} className="rounded-md bg-navy-50 px-2 py-1 text-[11px] font-medium text-navy-600">{t}</span>
                ))}
              </div>
              <p className="mt-3 border-t border-line pt-2.5 text-[10px] leading-relaxed text-ink-faint">{station.sourceNote}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
