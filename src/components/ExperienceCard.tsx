import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Scene from './art/Scene'
import Icon from './ui/Icon'
import { Stars } from './ui'
import { Price } from './ui/controls'
import { stationById, CORRIDOR } from '../data/stations'
import { operatorById } from '../data/operators'
import { useApp } from '../app/store'
import { usePrefs } from '../app/prefs'
import { hoursLabel } from '../services/storage'
import { tReasons } from '../services/reasons'
import type { Experience } from '../types'
import { CATEGORIES } from '../data/taxonomy'

const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id

/**
 * Premium discovery card.
 * Fixed anatomy so cards align in a 3-column grid regardless of copy length:
 *   16:10 art · category + save · title (2 lines) · operator · meta rail ·
 *   price row · CTA
 */
export function ExperienceCard({
  exp,
  variant = 'grid',
  matchScore,
  reasons,
}: {
  exp: Experience
  variant?: 'grid' | 'row' | 'compact' | 'feature'
  matchScore?: number
  reasons?: string[]
}) {
  const { favourites, toggleFavourite, toast } = useApp()
  const { t } = usePrefs()
  const saved = favourites.includes(exp.id)
  const station = stationById(exp.stationId)
  const op = operatorById(exp.operatorId)

  const onSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavourite(exp.id)
    toast(
      saved ? t('experience.removedFromFavourites') : t('experience.savedToFavourites'),
      exp.title,
      'info'
    )
  }

  if (variant === 'row') {
    return (
      <Link
        to={`/experiences/${exp.id}`}
        className="group flex gap-3 rounded-xl border border-line bg-raised p-2.5 transition-all hover:border-lineStrong hover:shadow-card"
      >
        <div className="relative h-[92px] w-[118px] shrink-0 overflow-hidden rounded-lg bg-navy-900">
          <Scene seed={exp.id} category={exp.category} className="h-full w-full" variant="thumb" />
          {matchScore !== undefined && (
            <span className="absolute left-1.5 top-1.5 rounded bg-white/95 px-1.5 py-0.5 text-[10px] font-extrabold text-ink num">
              {Math.round(matchScore * 100)}%
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">{catLabel(exp.category)}</p>
              <h3 className="mt-0.5 truncate text-[13.5px] font-bold leading-snug text-ink group-hover:text-accent">
                {exp.title}
              </h3>
            </div>
            <button
              onClick={onSave}
              aria-label={t('common.saveExperience')}
              aria-pressed={saved}
              className={clsx(
                'grid h-6.5 w-6.5 shrink-0 place-items-center rounded-md transition-colors',
                saved ? 'text-accent' : 'text-ink-faint hover:text-ink'
              )}
            >
              <Icon name="heart" size={13} className={saved ? 'fill-johor' : ''} />
            </button>
          </div>
          <p className="mt-1 truncate text-[11.5px] text-ink-mute">{op?.name}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-ink-mute">
            <span className="inline-flex items-center gap-1">
              <Icon name="train-front" size={11} className="text-accent" /> {station?.name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" size={11} /> {hoursLabel(exp.durationMins)}
            </span>
            <Price myr={exp.price} showApprox={false} size="sm" />
          </div>
          {reasons?.[0] && (
            <p className="mt-1.5 flex items-start gap-1 text-[10.5px] leading-snug text-emerald2">
              <Icon name="sparkles" size={10} className="mt-0.5 shrink-0" /> {tReasons(reasons)?.[0]}
            </p>
          )}
        </div>
      </Link>
    )
  }

  if (variant === 'feature') {
    return (
      <Link
        to={`/experiences/${exp.id}`}
        className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl bg-navy-950 p-5 text-white"
      >
        <Scene seed={exp.id} category={exp.category} className="absolute inset-0 h-full w-full" variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b16] via-[#050b16]/60 to-transparent" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-johor px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider">
              {t('common.selected')}
            </span>
            <span className="text-[10.5px] font-semibold text-white/75">{catLabel(exp.category)}</span>
          </div>
          <h3 className="text-[18px] font-extrabold leading-tight">{exp.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-white/72">{exp.summary}</p>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-white/85">
            <span className="inline-flex items-center gap-1">
              <Icon name="train-front" size={11} /> {station?.name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" size={11} /> {hoursLabel(exp.durationMins)}
            </span>
            <span className="font-bold text-gold num">
              <Price myr={exp.price} showApprox={false} size="sm" />
            </span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link to={`/experiences/${exp.id}`} className="group block w-full">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-navy-900">
          <Scene
            seed={exp.id}
            category={exp.category}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
            variant="thumb"
          />
          <span className="absolute bottom-1.5 left-1.5 rounded bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-ink num">
            <Price myr={exp.price} showApprox={false} size="sm" />
          </span>
        </div>
        <h4 className="mt-1.5 line-clamp-2 text-[12.5px] font-bold leading-snug text-ink group-hover:text-accent">
          {exp.title}
        </h4>
        <p className="mt-0.5 text-[10.5px] text-ink-faint">
          {station?.name} · {hoursLabel(exp.durationMins)}
        </p>
      </Link>
    )
  }

  return (
    <Link
      to={`/experiences/${exp.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-raised transition-all duration-300 hover:-translate-y-1 hover:border-lineStrong hover:shadow-lift"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
        <Scene
          seed={exp.id}
          category={exp.category}
          className="h-full w-full transition-transform duration-[700ms] group-hover:scale-[1.05]"
        />

        {/* top row: category chip + save */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-gradient-to-b from-black/45 to-transparent p-2 pb-6">
          <span className="rounded bg-[#071D49]/92 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white">
            {catLabel(exp.category)}
          </span>
          <button
            onClick={onSave}
            aria-label={t('common.saveExperience')}
            aria-pressed={saved}
            className={clsx(
              'grid h-7 w-7 place-items-center rounded-md transition-all',
              saved
                ? 'bg-raised text-johor'
                : 'bg-black/45 text-white hover:bg-raised hover:text-ink'
            )}
          >
            <Icon name="heart" size={13} className={saved ? 'fill-johor' : ''} />
          </button>
        </div>

        {/* bottom row: match + verified */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/50 to-transparent p-2 pt-6">
          {matchScore !== undefined ? (
            <span className="inline-flex items-center gap-1 rounded bg-raised px-1.5 py-0.5 shadow-sm">
              <span className="text-[10px] font-black text-emerald2 num">{Math.round(matchScore * 100)}%</span>
              <span className="text-[9px] font-bold uppercase tracking-wide text-ink-soft">{t('card.match')}</span>
            </span>
          ) : (
            <span />
          )}
          {exp.verification === 'verified' && (
            <span className="inline-flex items-center gap-1 rounded bg-[#071D49] px-1.5 py-0.5 text-[9px] font-bold text-white">
              <Icon name="badge-check" size={9} /> {t('common.verified')}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-[14px] font-bold leading-[1.3] text-ink transition-colors group-hover:text-accent">
          {exp.title}
        </h3>

        <p className="mt-1 flex items-center gap-1 truncate text-[11.5px] text-ink-mute">
          <Icon name="store" size={10} className="shrink-0 text-ink-faint" />
          <span className="truncate">{op?.name}</span>
        </p>

        <div className="mt-2 flex items-center gap-2.5 text-[11px] text-ink-soft">
          <span className="inline-flex items-center gap-1 font-semibold">
            <Icon name="train-front" size={11} className="text-accent" />
            {station?.name}
          </span>
          <span className="h-3 w-px bg-line" aria-hidden />
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" size={11} />
            {hoursLabel(exp.durationMins)}
          </span>
        </div>

        {reasons && reasons.length > 0 && (
          <p className="mt-2 flex items-start gap-1 rounded bg-emerald2-50 px-1.5 py-1 text-[10px] font-medium leading-snug text-emerald2-800 dark:text-emerald2-300">
            <Icon name="sparkles" size={9} className="mt-0.5 shrink-0" />
            <span className="clamp-2">{tReasons(reasons)?.[0]}</span>
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-line pt-2.5">
          <div className="min-w-0">
            <Price myr={exp.price} />
            <div className="mt-1">
              <Stars value={exp.rating} count={exp.reviewCount} size={10} />
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-navy px-2 py-1 text-[10.5px] font-bold text-white transition-colors group-hover:bg-johor">
            {t('card.viewExperience')}
            <Icon name="arrow-right" size={10} />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ---------------------------------------------------------------- Rail corridor visual
export function RailCorridor({
  activeStationId,
  onSelect,
  counts,
  compact = false,
}: {
  activeStationId?: string
  onSelect?: (id: string) => void
  counts?: Record<string, number>
  compact?: boolean
}) {
  const { t } = usePrefs()
  const S = CORRIDOR
  return (
    <div className="relative">
      <div className="no-scrollbar flex gap-0 overflow-x-auto pb-1">
        {S.map((s, i) => {
          const active = s.id === activeStationId
          const count = counts?.[s.id] ?? 0
          return (
            <button
              key={s.id}
              onClick={() => onSelect?.(s.id)}
              disabled={!onSelect}
              className={clsx(
                'group relative flex min-w-[84px] shrink-0 flex-col items-center px-1 pt-2.5 text-center',
                onSelect ? 'cursor-pointer' : 'cursor-default'
              )}
              aria-current={active ? 'true' : undefined}
            >
              {/* the rail line itself */}
              <span
                className={clsx(
                  'absolute left-0 right-0 top-[19px] h-[2px]',
                  active ? 'bg-johor' : 'bg-line'
                )}
                aria-hidden
              />
              {i === 0 && <span className="absolute left-0 top-[19px] h-[2px] w-1/2 bg-transparent" aria-hidden />}
              {i === S.length - 1 && (
                <span className="absolute right-0 top-[19px] h-[2px] w-1/2 bg-transparent" aria-hidden />
              )}
              <span
                className={clsx(
                  'relative z-10 grid h-[11px] w-[11px] place-items-center rounded-full border-2 transition-all duration-300',
                  active
                    ? 'scale-[1.35] border-johor bg-johor ring-[3px] ring-johor/18'
                    : 'border-lineStrong bg-raised group-hover:border-johor'
                )}
              />
              <span
                className={clsx(
                  'mt-1.5 text-[11px] font-bold leading-tight transition-colors',
                  active ? 'text-accent' : 'text-ink-soft group-hover:text-ink'
                )}
              >
                {s.name}
              </span>
              {!compact && (
                <span className="mt-0.5 text-[9.5px] text-ink-faint num">
                  {count > 0 ? `${count}` : '—'}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {!compact && (
        <p className="mt-1.5 text-[10px] text-ink-faint">{t('stations.routeNote')}</p>
      )}
    </div>
  )
}
