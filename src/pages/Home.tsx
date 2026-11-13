import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../components/ui/Icon'
import { Section, Button, DemoTag, Stars } from '../components/ui'
import Scene from '../components/art/Scene'
import { ExperienceCard } from '../components/ExperienceCard'
import { STATIONS, CORRIDOR, stationById } from '../data/stations'
import { CATEGORIES, PURPOSES } from '../data/taxonomy'
import { usePublishedExperiences, useApp } from '../app/store'
import { money, hoursLabel } from '../services/storage'

export default function Home() {
  const nav = useNavigate()
  const { setProfile, profile } = useApp()
  const exps = usePublishedExperiences()
  const [station, setStation] = useState('')
  const [category, setCategory] = useState('')
  const [purpose, setPurpose] = useState('')

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const e of exps) c[e.stationId] = (c[e.stationId] ?? 0) + 1
    return c
  }, [exps])

  const featured = useMemo(() => exps.filter((e) => e.featured).slice(0, 4), [exps])
  const beyondJB = useMemo(() => exps.filter((e) => e.stationId !== 'jb-sentral'), [exps])
  const popular = useMemo(
    () => [...beyondJB].sort((a, b) => b.views - a.views).slice(0, 4),
    [beyondJB]
  )

  const search = () => {
    const p = new URLSearchParams()
    if (station) p.set('station', station)
    if (category) p.set('category', category)
    if (purpose) {
      setProfile({ ...profile, purpose: purpose as never, stationId: station || profile.stationId, onboarded: true })
      p.set('purpose', purpose)
    }
    nav(`/explore?${p.toString()}`)
  }

  const pickPurpose = (id: string) => {
    setProfile({ ...profile, purpose: id as never, onboarded: true })
    nav(`/visitor/recommendations?purpose=${id}`)
  }

  return (
    <div>
      {/* ============================================================ HERO */}
      <section className="relative overflow-hidden bg-navy-900">
        {/* art backdrop */}
        <div className="absolute inset-0 opacity-[0.55]">
          <Scene seed="johor-hero-2026" category="heritage" className="h-full w-full" variant="hero" motif="shophouse" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/95 via-navy-900/80 to-royal-900/60" />
        {/* rail line motif */}
        <svg className="absolute inset-x-0 bottom-0 h-24 w-full opacity-[0.13]" preserveAspectRatio="none" viewBox="0 0 1200 100" aria-hidden="true">
          <path d="M0 70 L1200 22" stroke="#fff" strokeWidth="1.5" />
          <path d="M0 92 L1200 44" stroke="#fff" strokeWidth="1.5" />
          {Array.from({ length: 34 }, (_, i) => (
            <line key={i} x1={i * 36} y1={70 - i * 1.4} x2={i * 36 + 14} y2={92 - i * 1.4} stroke="#fff" strokeWidth="2.4" opacity="0.6" />
          ))}
        </svg>

        <div className="shell relative pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
          <div className="grid items-start gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            <div className="animate-fadeUp">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald2-400" />
                <span className="text-[11.5px] font-semibold text-white/85">
                  Johor Innovation Challenge 2026 · Category 4
                </span>
              </div>

              <h1 className="text-[34px] font-extrabold leading-[1.06] tracking-[-0.03em] text-white sm:text-[46px] lg:text-[54px]">
                Explore Johor
                <br />
                <span className="relative inline-block">
                  beyond the city
                  <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gold/80" aria-hidden="true" />
                </span>
                <span className="text-gold">.</span>
              </h1>

              <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-white/70 sm:max-w-[46ch] sm:text-[16.5px]">
                Discover authentic local experiences, educational activities and hidden gems along Johor's ETS
                corridor — run by small operators in towns most visitors never reach.
              </p>

              {/* search console */}
              <div className="mt-8 rounded-2xl border border-white/15 bg-white/[0.07] p-3 backdrop-blur-xl sm:p-4">
                <div className="grid gap-2.5 sm:grid-cols-[1.1fr_1fr_auto]">
                  <label className="relative block">
                    <span className="sr-only">ETS station</span>
                    <Icon name="train-front" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                    <select
                      value={station}
                      onChange={(e) => setStation(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-white/15 bg-white/95 pl-9 pr-8 text-[13px] font-semibold text-navy outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="">Any ETS station</option>
                      {STATIONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.district}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="relative block">
                    <span className="sr-only">Experience type</span>
                    <Icon name="shapes" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-white/15 bg-white/95 pl-9 pr-8 text-[13px] font-semibold text-navy outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="">Any experience type</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Button onClick={search} icon="search" size="md" className="h-11 sm:px-6">
                    Explore
                  </Button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-[10.5px] font-bold uppercase tracking-wider text-white/40">Travelling for</span>
                  {PURPOSES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => pickPurpose(p.id)}
                      className={clsx(
                        'rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-all',
                        purpose === p.id
                          ? 'border-gold bg-gold text-navy'
                          : 'border-white/15 bg-white/[0.06] text-white/75 hover:border-white/35 hover:text-white'
                      )}
                    >
                      {p.label.replace(' traveller', '')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                {[
                  { v: `${exps.length}`, l: 'verified experiences' },
                  { v: '9', l: 'ETS stations' },
                  { v: '15', l: 'local operators' },
                ].map((s) => (
                  <div key={s.l} className="flex items-baseline gap-1.5">
                    <span className="text-[19px] font-extrabold text-white num">{s.v}</span>
                    <span className="text-[11.5px] text-white/50">{s.l}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.1em] text-white/30">
                Competition mockup · demonstration data · no real bookings
              </p>
            </div>

            {/* right: preview panel — deliberately stacked, not overlapping */}
            <div className="relative hidden lg:block">
              <div className="animate-fadeUp" style={{ animationDelay: '120ms' }}>
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-1.5 shadow-pop backdrop-blur-xl">
                  <div className="overflow-hidden rounded-xl bg-white">
                    <div className="relative h-[168px]">
                      <Scene seed={featured[0]?.id ?? 'x'} category={featured[0]?.category ?? 'heritage'} className="h-full w-full" variant="thumb" />
                      <span className="absolute left-2.5 top-2.5 rounded-md bg-navy px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white">
                        Next stop
                      </span>
                      <span className="absolute bottom-2.5 left-2.5 rounded-md bg-white/95 px-2 py-0.5 text-[10.5px] font-extrabold text-navy num">
                        {money(featured[0]?.price ?? 85)}
                      </span>
                    </div>
                    <div className="p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-royal">
                        Kluang · 1h 25m by ETS
                      </p>
                      <p className="mt-1 text-[13.5px] font-bold leading-snug text-navy">
                        {featured[0]?.title ?? 'Batik workshop'}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-mute">
                        <Icon name="clock" size={11} /> {hoursLabel(featured[0]?.durationMins ?? 120)} · max 6 people
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 animate-fadeUp rounded-2xl border border-white/15 bg-navy-950/80 p-4 shadow-pop backdrop-blur-xl" style={{ animationDelay: '260ms' }}>
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald2 text-white">
                    <Icon name="sparkles" size={12} />
                  </span>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-white/80">Why this one</p>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-white/80">
                  Near your selected station, fits your RM150 budget, and takes about two hours.
                </p>
                <div className="mt-3 space-y-2">
                  {[['Time fit', 92], ['Rail access', 88], ['Budget', 76]].map(([l, v]) => (
                    <div key={l as string} className="flex items-center gap-2.5">
                      <span className="w-[64px] text-[10px] font-medium text-white/55">{l}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                        <div className="h-full rounded-full bg-emerald2-400" style={{ width: `${v}%` }} />
                      </div>
                      <span className="w-6 text-right text-[9.5px] font-bold text-white/70 num">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ CORRIDOR */}
      <section className="border-b border-line bg-white">
        <div className="shell py-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-[12.5px] font-bold text-navy">
              <Icon name="train-front" size={15} className="text-royal" />
              The ETS corridor
              <span className="hidden font-normal text-ink-faint sm:inline">— southbound from Gemas junction to JB Sentral</span>
            </p>
            <Link to="/explore/stations" className="inline-flex items-center gap-1 text-[12px] font-bold text-royal hover:text-royal-700">
              Full station guide <Icon name="arrow-right" size={13} />
            </Link>
          </div>
          <div className="relative">
            <div className="no-scrollbar flex items-stretch gap-2 overflow-x-auto pb-1 pr-16">
            {[...CORRIDOR].reverse().map((s, i, arr) => (
              <React.Fragment key={s.id}>
                <Link
                  to={`/explore/stations/${s.id}`}
                  className="group flex min-w-[136px] flex-col rounded-xl border border-line px-3 py-2.5 transition-all hover:border-royal hover:shadow-card"
                >
                  <span className="text-[13px] font-bold text-navy group-hover:text-royal">{s.name}</span>
                  <span className="mt-0.5 truncate text-[10.5px] text-ink-faint">{s.district}</span>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald2-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald2" />
                    {counts[s.id] ?? 0} experiences
                  </span>
                </Link>
                {i < arr.length - 1 && (
                  <div className="flex shrink-0 items-center" aria-hidden="true">
                    <span className="h-px w-4 bg-navy-200" />
                  </div>
                )}
              </React.Fragment>
            ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white to-white/0" aria-hidden="true" />
            <Link
              to="/explore/stations"
              aria-label="See all stations"
              className="absolute right-0 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-navy shadow-card transition-colors hover:border-royal hover:text-royal"
            >
              <Icon name="chevron-right" size={15} />
            </Link>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[10.5px] text-ink-faint">
            <Icon name="info" size={11} />
            Station names and order verified against KTMB ETS route information. Journey times shown in JOHOR360 are illustrative estimates.
          </p>
        </div>
      </section>

      {/* ============================================================ CATEGORIES */}
      <Section
        eyebrow="Experiences for every journey"
        title="Ten ways to spend a spare morning"
        blurb="Every listing is run by an operator with ten employees or fewer. Filter by what you actually want to do, not by what a guidebook recommends."
        action={
          <Button variant="ghost" iconRight="arrow-right" onClick={() => nav('/explore')}>
            Browse all
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const n = exps.filter((e) => e.category === c.id).length
            return (
              <Link
                key={c.id}
                to={`/explore?category=${c.id}`}
                className="group relative overflow-hidden rounded-2xl border border-line bg-white p-4 transition-all hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-50 text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                  <Icon name={c.glyph} size={17} />
                </span>
                <p className="mt-3 text-[13.5px] font-bold text-navy">{c.label}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-ink-mute">{c.blurb}</p>
                <p className="mt-2 text-[10.5px] font-bold text-royal num">{n} listed</p>
              </Link>
            )
          })}
        </div>
      </Section>

      {/* ============================================================ FEATURED */}
      <section className="bg-white py-14 sm:py-20">
        <div className="shell">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow mb-2.5">Featured local operators</p>
              <h2 className="text-[26px] font-extrabold leading-[1.14] sm:text-[36px]">
                The people the guidebooks skip
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-mute">
                Small studios, family farms and collectives. Booked directly, priced honestly, verified by our team.
              </p>
            </div>
            <DemoTag label="Sample listings" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featured.map((e) => (
              <ExperienceCard key={e.id} exp={e} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ HOW IT WORKS */}
      <Section
        eyebrow="How JOHOR360 works"
        title="Three steps, one train line"
        blurb="Built around a constraint most travel apps ignore: your day is bounded by a train you have to catch."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              n: '01',
              icon: 'compass',
              title: 'Tell us why you are here',
              body: 'Business, medical, education or leisure. That single choice changes what we show you — a two-hour window near a station is not the same trip as a relaxed accessible afternoon.',
              link: '/register',
              linkLabel: 'Set your purpose',
            },
            {
              n: '02',
              icon: 'sparkles',
              title: 'Get matched, not listed',
              body: 'Our matching engine scores every experience on interest, time fit, rail access, budget and purpose — and excludes anything that fails your accessibility needs before ranking begins.',
              link: '/how-it-works',
              linkLabel: 'See the scoring model',
            },
            {
              n: '03',
              icon: 'route',
              title: 'Leave with a real plan',
              body: 'Micro-itineraries sized to your actual window, with the return leg and a buffer built in. Cost estimated in ringgit before you commit to anything.',
              link: '/visitor/itinerary',
              linkLabel: 'Open itinerary builder',
            },
          ].map((s) => (
            <div key={s.n} className="group relative overflow-hidden rounded-2xl border border-line bg-white p-5">
              <span className="absolute right-4 top-3 text-[42px] font-extrabold leading-none text-navy-50 num">{s.n}</span>
              <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-navy text-white">
                <Icon name={s.icon} size={18} />
              </span>
              <h3 className="relative mt-4 text-[16px] font-extrabold">{s.title}</h3>
              <p className="relative mt-2 text-[13px] leading-relaxed text-ink-mute">{s.body}</p>
              <Link to={s.link} className="relative mt-4 inline-flex items-center gap-1 text-[12.5px] font-bold text-royal hover:text-royal-700">
                {s.linkLabel} <Icon name="arrow-right" size={13} />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================ MATCHING DEMO */}
      <section className="relative overflow-hidden bg-navy-900 py-14 sm:py-20">
        <div className="absolute inset-0 opacity-20">
          <Scene seed="matching-bg" category="education" className="h-full w-full" variant="hero" motif="rails" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/95 to-navy-900/70" />
        <div className="shell relative">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow mb-2.5 !text-gold">Smart experience matching</p>
              <h2 className="text-[26px] font-extrabold leading-[1.14] text-white sm:text-[36px]">
                Transparent scoring.<br />No black box.
              </h2>
              <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-white/65">
                Every recommendation shows you why it appeared. Five weighted factors, hard constraints checked
                first, and an explanation in plain language — because a visitor with a 3pm train needs to trust the
                answer, not just receive one.
              </p>

              <div className="mt-6 space-y-2.5">
                {[
                  ['Interest relevance', 25, 'Does it match what you actually want to do'],
                  ['Time compatibility', 25, 'Duration plus travel plus return buffer'],
                  ['Rail & last-mile access', 25, 'Distance from your station, transfer difficulty'],
                  ['Budget compatibility', 15, 'Priced in ringgit against your stated budget'],
                  ['Purpose relevance', 10, 'Tuned to business, medical, education or leisure'],
                ].map(([label, w, note]) => (
                  <div key={label as string} className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[12.5px] font-bold text-white">{label}</span>
                      <span className="text-[12px] font-extrabold text-gold num">{Number(w)}%</span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gold/80" style={{ width: `${Number(w) * 4}%` }} />
                    </div>
                    <p className="mt-1.5 text-[10.5px] text-white/45">{note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10.5px] leading-relaxed text-white/35">
                Proposed product weights for the mockup, not research-validated coefficients. Hard constraints
                (accessibility, extreme time mismatch) are applied before ranking.
              </p>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white p-1.5 shadow-pop">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Live match preview</p>
                <span className="rounded-md bg-emerald2-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald2-700">Demo</span>
              </div>
              <div className="space-y-1.5">
                {popular.slice(0, 3).map((e, i) => (
                  <Link
                    key={e.id}
                    to={`/experiences/${e.id}`}
                    className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-navy-50/70"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald2-50 text-[11px] font-black text-emerald2-700 num">
                      {[94, 88, 81][i]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-bold text-navy">{e.title}</p>
                      <p className="mt-0.5 truncate text-[10.5px] text-ink-mute">
                        {stationById(e.stationId)?.name} · {money(e.price)} · {hoursLabel(e.durationMins)}
                      </p>
                    </div>
                    <Icon name="chevron-right" size={15} className="text-ink-faint" />
                  </Link>
                ))}
              </div>
              <div className="m-2 rounded-xl bg-navy-50/80 p-2.5">
                <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-navy-600">
                  <Icon name="sparkles" size={12} className="mt-0.5 shrink-0 text-emerald2-600" />
                  Recommended because it is near your selected station, fits your budget and takes about two hours.
                </p>
              </div>
              <div className="p-2">
                <Button variant="navy" className="w-full" onClick={() => nav('/visitor/recommendations')} icon="wand-sparkles">
                  Try the matching engine
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ BEYOND JB */}
      <Section
        eyebrow="Discover beyond Johor Bahru"
        title="Johor does not end at the city"
        blurb="Most visitor spending lands in a handful of postcodes. These are experiences outside JB Sentral — the ones the concentration problem leaves invisible."
        action={
          <Button variant="ghost" iconRight="arrow-right" onClick={() => nav('/explore?beyond=1')}>
            All beyond the city
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((e) => (
            <ExperienceCard key={e.id} exp={e} />
          ))}
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-3">
          {[
            { k: '4 of 9', l: 'ETS stops with no listed operator in Johor today', i: 'circle-slash' },
            { k: '82%', l: 'of visitor spending in Johor concentrates in JB district', i: 'trending-up' },
            { k: 'RM2.4b', l: 'estimated annual visitor spend outside the state capital', i: 'wallet' },
          ].map((s) => (
            <div key={s.l} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-johor-50 text-johor">
                <Icon name={s.i} size={15} />
              </span>
              <div>
                <p className="text-[18px] font-extrabold leading-none text-navy num">{s.k}</p>
                <p className="mt-1 text-[11.5px] leading-snug text-ink-mute">{s.l}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-[10.5px] text-ink-faint">
          <Icon name="info" size={11} />
          Illustrative figures used to frame the problem for the competition. Not cited external statistics.
        </p>
      </Section>

      {/* ============================================================ PURPOSE SPLIT */}
      <section className="bg-white py-14 sm:py-20">
        <div className="shell">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow mb-2.5">Built for four different trips</p>
            <h2 className="text-[26px] font-extrabold leading-[1.14] sm:text-[36px]">
              A medical traveller and a business traveller need different Johors
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-mute">
              The same town, the same train line, entirely different constraints. Purpose is the first input, not an
              afterthought.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { id: 'business', title: 'Business', body: 'Time-boxed experiences within walking distance of the station. Your window is the constraint.', ex: 'Kopitiam crawl, 90 min', accent: 'bg-royal-600', icon: 'briefcase' },
              { id: 'medical', title: 'Medical', body: 'Low intensity, step-free, close to the hospital catchment with generous buffers built in.', ex: 'Gentle market visit, 2 hrs', accent: 'bg-emerald2-600', icon: 'stethoscope' },
              { id: 'education', title: 'Education', body: 'Structured learning visits with real learning outcomes and syllabus relevance where possible.', ex: 'Coffee science, 2 hrs', accent: 'bg-gold-600', icon: 'graduation-cap' },
              { id: 'leisure', title: 'Leisure', body: 'Food, nature, craft and community. Depth over checklist, run by people who live there.', ex: 'Loom session, 2 hrs', accent: 'bg-johor', icon: 'palmtree' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => pickPurpose(p.id)}
                className="group rounded-2xl border border-line bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift"
              >
                <span className={clsx('grid h-10 w-10 place-items-center rounded-xl text-white', p.accent)}>
                  <Icon name={p.icon} size={18} />
                </span>
                <h3 className="mt-4 text-[15.5px] font-extrabold">{p.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-mute">{p.body}</p>
                <p className="mt-3 inline-flex items-center gap-1 rounded-md bg-navy-50 px-2 py-1 text-[10.5px] font-bold text-navy-600">
                  <Icon name="example" size={0} className="hidden" />
                  {p.ex}
                </p>
                <span className="mt-3 flex items-center gap-1 text-[11.5px] font-bold text-royal">
                  See recommendations <Icon name="arrow-right" size={12} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ SME CTA */}
      <Section>
        <div className="overflow-hidden rounded-3xl border border-line bg-white">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-7 sm:p-10">
              <p className="eyebrow mb-2.5">Become a local experience partner</p>
              <h2 className="text-[24px] font-extrabold leading-[1.16] sm:text-[32px]">
                If you run it, visitors should be able to find it
              </h2>
              <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-ink-mute">
                Listing is free for operators with ten employees or fewer. We verify every operator manually — SSM
                registration, safety documentation and an accessibility statement — then put you in front of visitors
                already travelling on your train line.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { i: 'badge-check', t: 'Manual verification', d: 'Human review, not an automated crawl' },
                  { i: 'train-front', t: 'Corridor placement', d: 'Surfaced to visitors at your nearest station' },
                  { i: 'message-square', t: 'Enquiries, not bookings', d: 'You keep control of the conversation' },
                ].map((b) => (
                  <div key={b.t} className="rounded-xl border border-line p-3">
                    <Icon name={b.i} size={16} className="text-emerald2-600" />
                    <p className="mt-2 text-[12px] font-bold text-navy">{b.t}</p>
                    <p className="mt-0.5 text-[10.5px] leading-snug text-ink-mute">{b.d}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Button onClick={() => nav('/register')} icon="store">
                  Register your business
                </Button>
                <Button variant="ghost" onClick={() => nav('/sme/dashboard')} iconRight="arrow-right">
                  See the operator portal
                </Button>
              </div>
            </div>

            <div className="relative min-h-[240px] bg-navy-900 p-6 sm:p-8">
              <Scene seed="sme-cta" category="workshops" className="absolute inset-0 h-full w-full opacity-40" variant="hero" motif="loom" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-900/30" />
              <div className="relative flex h-full flex-col justify-end">
                <div className="rounded-xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-white/50">Demo operator</p>
                    <span className="rounded-md bg-emerald2 px-1.5 py-0.5 text-[9.5px] font-bold uppercase text-white">Verified</span>
                  </div>
                  <p className="mt-1.5 text-[14px] font-extrabold text-white">Sri Kluang Batik Studio</p>
                  <div className="mt-2.5 grid grid-cols-3 gap-2">
                    {[['6', 'listings'], ['41', 'enquiries'], ['2.3k', 'views']].map(([v, l]) => (
                      <div key={l}>
                        <p className="text-[15px] font-extrabold text-gold num">{v}</p>
                        <p className="text-[9.5px] text-white/45">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ IMPACT */}
      <section className="border-y border-line bg-white py-14 sm:py-20">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="eyebrow mb-2.5">Community and economic impact</p>
              <h2 className="text-[26px] font-extrabold leading-[1.14] sm:text-[34px]">
                What we will actually measure
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-mute">
                Discovery is not the outcome. The outcome is money and attention moving to operators outside the city.
                JOHOR360 tracks that explicitly instead of reporting page views.
              </p>

              <div className="mt-6 space-y-2.5">
                {[
                  ['Share of discovery beyond JB Sentral', 'The core distribution metric — how much of all visitor interest lands outside the capital.'],
                  ['SME enquiry conversion', 'Enquiries that reach a small operator and receive a reply, not just listings published.'],
                  ['Operator revenue referenced', 'Estimated value of enquiries sent to operators with ten staff or fewer.'],
                  ['Station-level interest spread', 'Which ETS stops visitors actually show intent to visit.'],
                ].map(([t, d]) => (
                  <div key={t} className="flex items-start gap-2.5 rounded-xl border border-line px-3.5 py-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald2-50 text-emerald2-700">
                      <Icon name="check" size={11} strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-[12.5px] font-bold text-navy">{t}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-ink-mute">{d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="navy" className="mt-6" onClick={() => nav('/admin/impact')} iconRight="arrow-right">
                Open impact dashboard
              </Button>
            </div>

            <div className="rounded-2xl border border-line bg-canvas p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[12px] font-bold text-navy">Visitor interest by station</p>
                <DemoTag label="Simulated" />
              </div>
              <div className="space-y-2.5">
                {[
                  ['Kluang', 84, 'bg-royal'],
                  ['Labis', 71, 'bg-emerald2'],
                  ['Segamat', 58, 'bg-gold'],
                  ['Paloh', 34, 'bg-royal'],
                  ['Bekok', 29, 'bg-emerald2'],
                  ['Gemas', 22, 'bg-gold'],
                  ['JB Sentral', 96, 'bg-johor'],
                ].map(([n, v, c]) => (
                  <div key={n as string}>
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-ink-soft">{n}</span>
                      <span className="font-bold text-navy num">{v}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-navy-100">
                      <div className={clsx('h-full rounded-full', c as string)} style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-navy px-3.5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Key finding</p>
                <p className="mt-1 text-[12px] leading-relaxed text-white/85">
                  Of 412 simulated discovery sessions, <span className="font-extrabold text-gold">64%</span> expressed
                  interest in a station other than JB Sentral.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ FINAL CTA */}
      <section className="py-14 sm:py-20">
        <div className="shell">
          <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-12 text-center sm:px-10 sm:py-16">
            <Scene seed="cta-final" category="nature" className="absolute inset-0 h-full w-full opacity-25" variant="hero" motif="rails" />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/85 to-navy-950/60" />
            <div className="relative mx-auto max-w-xl">
              <h2 className="text-[26px] font-extrabold leading-[1.14] text-white sm:text-[36px]">
                Your next four hours are already on the line
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/65">
                Pick a station, tell us how long you have, and we will show you what the town offers before your
                train comes back.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
                <Button size="lg" onClick={() => nav('/explore')} icon="compass">
                  Explore experiences
                </Button>
                <Button size="lg" variant="ghost" onClick={() => nav('/visitor/onboarding')} className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/15">
                  Plan my journey
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
