import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { Button } from '../components/ui'
import { ExperienceCard } from '../components/ExperienceCard'
import { JohorSkyline, JohorDivider } from '../components/art/JohorIdentity'
import Scene from '../components/art/Scene'
import { CORRIDOR } from '../data/stations'
import { CATEGORIES, PURPOSES } from '../data/taxonomy'
import { usePublishedExperiences, useApp } from '../app/store'
import { usePrefs } from '../app/prefs'
import { hoursLabel } from '../services/storage'

export default function Home() {
  const nav = useNavigate()
  const { setProfile, profile } = useApp()
  const { t } = usePrefs()
  const exps = usePublishedExperiences()
  const [station, setStation] = useState('')
  const [category, setCategory] = useState('')

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const e of exps) c[e.stationId] = (c[e.stationId] ?? 0) + 1
    return c
  }, [exps])

  const featured = useMemo(() => exps.filter((e) => e.featured).slice(0, 1), [exps])
  const beyondJB = useMemo(() => exps.filter((e) => e.stationId !== 'jb-sentral'), [exps])
  const popular = useMemo(() => [...beyondJB].sort((a, b) => b.views - a.views).slice(0, 6), [beyondJB])
  const operatorCount = useMemo(() => new Set(exps.map((e) => e.operatorId)).size, [exps])

  const search = () => {
    const p = new URLSearchParams()
    if (station) p.set('station', station)
    if (category) p.set('category', category)
    nav(`/explore?${p.toString()}`)
  }

  const pickPurpose = (id: string) => {
    setProfile({ ...profile, purpose: id as never, onboarded: true })
    nav(`/visitor/recommendations?purpose=${id}`)
  }

  const f = featured[0]

  return (
    <div>
      {/* ================================================================== HERO */}
      <section className="relative overflow-hidden bg-[#071D49]">
        <div className="absolute inset-0 opacity-75">
          <JohorSkyline />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#071D49] via-[#071D49]/95 to-[#071D49]/40" />

        <div className="shell relative py-9 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.18fr_0.82fr]">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-gold">
                  {t('home.eyebrow')}
                </span>
              </div>

              <h1 className="max-w-[16ch] text-[29px] font-extrabold leading-[1.06] tracking-[-0.035em] text-white sm:text-[38px] lg:text-[44px]">
                {t('home.headline')}
              </h1>

              <p className="mt-2.5 max-w-lg text-[13px] leading-relaxed text-white/65 sm:text-[14.5px]">
                {t('home.sub')}
              </p>

              {/* search — the primary action, above the fold */}
              <div className="mt-4 rounded-xl border border-white/12 bg-white/[0.07] p-1.5 backdrop-blur-md">
                <div className="flex flex-col gap-1.5 sm:flex-row">
                  <select
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    aria-label={t('explore.stationLabel')}
                    className="h-10 flex-1 rounded-lg border border-transparent bg-[#0b2857] px-2.5 text-[12.5px] font-semibold text-white focus:border-gold/50 focus:outline-none"
                  >
                    <option value="">{t('home.anyStation')}</option>
                    {CORRIDOR.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label={t('explore.categoryLabel')}
                    className="h-10 flex-1 rounded-lg border border-transparent bg-[#0b2857] px-2.5 text-[12.5px] font-semibold text-white focus:border-gold/50 focus:outline-none"
                  >
                    <option value="">{t('home.anyCategory')}</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {t("category." + c.id)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={search}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-johor px-4 text-[12.5px] font-bold text-white transition-colors hover:bg-johor-700"
                  >
                    <Icon name="search" size={14} />
                    {t('home.searchCta')}
                  </button>
                </div>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10.5px] font-semibold text-white/40">{t('home.travelingFor')}</span>
                {PURPOSES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => pickPurpose(p.id)}
                    className="inline-flex h-7 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 text-[11px] font-semibold text-white/80 transition-colors hover:border-gold/40 hover:bg-gold/10 hover:text-white"
                  >
                    <Icon name={p.glyph} size={10} className="text-gold" />
                    {t(`purpose.${p.id}`)}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/10 pt-3 text-[11px] text-white/50">
                <span>
                  <strong className="text-white num">{exps.length}</strong> {t('home.statExperiences')}
                </span>
                <span>
                  <strong className="text-white num">{CORRIDOR.length}</strong> {t('home.statStations')}
                </span>
                <span>
                  <strong className="text-white num">{operatorCount}</strong> {t('home.statOperators')}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-white/30">{t('common.demoNotice')}</span>
              </div>
            </div>

            {/* featured preview — stacked, no overlap */}
            <div className="hidden lg:block">
              {f && (
                <Link
                  to={`/experiences/${f.id}`}
                  className="group block overflow-hidden rounded-xl border border-white/15 bg-white/[0.06] p-1.5 backdrop-blur-xl transition-colors hover:border-gold/40"
                >
                  <div className="overflow-hidden rounded-lg bg-raised">
                    <div className="relative h-[140px] overflow-hidden">
                      <Scene seed={f.id} category={f.category} className="h-full w-full" variant="thumb" />
                      <span className="absolute left-2 top-2 rounded bg-johor px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                        {t('home.nextStop')}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-accent">
                        {f.town} · {hoursLabel(f.durationMins)}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[13px] font-bold text-ink">{f.title}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[13px] font-extrabold text-ink num">RM {f.price}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent">
                          {t('card.viewExperience')} <Icon name="arrow-right" size={9} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              <div className="mt-2 rounded-xl border border-white/12 bg-[#0a2149]/85 p-3 backdrop-blur-xl">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-gold">
                  {t('home.whyThisOne')}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/70">{t('home.whyBody')}</p>
                <div className="mt-2 space-y-1.5">
                  {[
                    [t('home.timeFit'), 92],
                    [t('home.railAccess'), 88],
                    [t('home.budget'), 76],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex items-center gap-2">
                      <span className="w-[58px] text-[9px] font-medium text-white/45">{label}</span>
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/12">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${val}%` }} />
                      </div>
                      <span className="w-4 text-right text-[8.5px] font-bold text-white/60 num">
                        {val as number}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= ETS CORRIDOR */}
      <section className="border-b border-line bg-raised">
        <div className="shell py-4">
          <div className="mb-2.5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-[14px] font-extrabold tracking-tight text-ink">{t('home.corridorTitle')}</h2>
              <p className="text-[11px] text-ink-mute">{t('home.corridorSub')}</p>
            </div>
            <Link
              to="/explore/stations"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:underline"
            >
              {t('home.fullStationGuide')} <Icon name="arrow-right" size={10} />
            </Link>
          </div>

          <div className="relative">
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1 pr-14">
              {[...CORRIDOR].reverse().map((s) => (
                <Link
                  key={s.id}
                  to={`/explore?station=${s.id}`}
                  className="group flex min-w-[118px] shrink-0 flex-col rounded-lg border border-line px-2.5 py-1.5 transition-all hover:border-johor hover:shadow-card"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-johor/70" />
                    <span className="truncate text-[12px] font-bold text-ink group-hover:text-accent">
                      {s.name}
                    </span>
                  </span>
                  <span className="mt-0.5 text-[9.5px] text-ink-faint num">
                    {counts[s.id] ?? 0} {t('common.results')}
                  </span>
                </Link>
              ))}
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-14"
              style={{ background: 'linear-gradient(to left, var(--bg-raised), transparent)' }}
              aria-hidden
            />
          </div>

          <p className="mt-1.5 flex items-start gap-1.5 text-[9.5px] leading-relaxed text-ink-faint">
            <Icon name="info" size={9} className="mt-0.5 shrink-0" />
            {t('home.corridorNote')}
          </p>
        </div>
      </section>

      {/* ============================================================== CATEGORIES */}
      <section className="shell py-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="eyebrow">{t('home.categoriesTitle')}</p>
            <h2 className="mt-1 max-w-lg text-[19px] font-extrabold leading-tight tracking-tight text-ink sm:text-[22px]">
              {t('home.categoriesSub').split('.')[0]}
            </h2>
          </div>
          <Link to="/explore">
            <Button variant="ghost" size="sm" iconRight="arrow-right">
              {t('home.browseAll')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/explore?category=${c.id}`}
              className="group rounded-lg border border-line bg-raised p-2.5 transition-all hover:-translate-y-0.5 hover:border-johor hover:shadow-card"
            >
              <span className="grid h-7 w-7 place-items-center rounded-md bg-inset text-ink transition-colors group-hover:bg-johor group-hover:text-white">
                <Icon name={c.glyph} size={13} />
              </span>
              <p className="mt-1.5 text-[12.5px] font-bold text-ink">{t("category." + c.id)}</p>
              <p className="text-[9.5px] text-ink-faint num">
                {exps.filter((e) => e.category === c.id).length} {t('common.results')}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================ POPULAR PICKS */}
      <section className="border-y border-line" style={{ background: 'var(--bg-sunken)' }}>
        <div className="shell py-6">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="eyebrow">{t('explore.rankedBy')}</p>
              <h2 className="mt-1 text-[19px] font-extrabold tracking-tight text-ink sm:text-[22px]">
                {t('home.ctaVisitorTitle')}
              </h2>
            </div>
            <Link to="/explore" className="text-[11px] font-bold text-accent hover:underline">
              {t('common.viewAll')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {popular.map((e) => (
              <ExperienceCard key={e.id} exp={e} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= PILLARS */}
      <section className="shell py-6">
        <JohorDivider className="mb-5" />
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { icon: 'train-front', title: t('home.railFirst'), body: t('home.railFirstBody') },
            { icon: 'store', title: t('home.smeCentric'), body: t('home.smeCentricBody') },
            { icon: 'compass', title: t('home.purposeBased'), body: t('home.purposeBasedBody') },
          ].map((p) => (
            <div key={p.title} className="rounded-lg border border-line bg-raised p-3.5">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-navy text-white">
                <Icon name={p.icon} size={13} />
              </span>
              <h3 className="mt-2 text-[13px] font-bold text-ink">{p.title}</h3>
              <p className="mt-0.5 text-[11px] leading-relaxed text-ink-mute">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== CTA */}
      <section className="shell pb-8">
        <div className="grid gap-2.5 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl bg-[#071D49] p-4 text-white">
            <div className="absolute inset-0 motif-lattice opacity-40" aria-hidden />
            <div className="relative">
              <h3 className="text-[16px] font-extrabold leading-tight">{t('home.ctaSmeTitle')}</h3>
              <p className="mt-1 max-w-sm text-[11.5px] leading-relaxed text-white/65">{t('home.ctaSmeBody')}</p>
              <Link to="/register" className="btn btn-gold btn-sm mt-2.5">
                {t('home.ctaSmeButton')} <Icon name="arrow-right" size={10} />
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-raised p-4">
            <h3 className="text-[16px] font-extrabold leading-tight text-ink">{t('home.ctaVisitorTitle')}</h3>
            <p className="mt-1 max-w-sm text-[11.5px] leading-relaxed text-ink-mute">{t('home.ctaVisitorBody')}</p>
            <Link to="/visitor/onboarding" className="btn btn-primary btn-sm mt-2.5">
              {t('home.ctaVisitorButton')} <Icon name="arrow-right" size={10} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
