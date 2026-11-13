import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Scene from './art/Scene'
import Icon from './ui/Icon'
import { Stars, DemoTag } from './ui'
import { stationById, CORRIDOR } from '../data/stations'
import { operatorById } from '../data/operators'
import { useApp } from '../app/store'
import { hoursLabel, money } from '../services/storage'
import type { Experience } from '../types'
import { CATEGORIES } from '../data/taxonomy'

const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id

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
  const saved = favourites.includes(exp.id)
  const station = stationById(exp.stationId)
  const op = operatorById(exp.operatorId)

  const onSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavourite(exp.id)
    toast(saved ? 'Removed from favourites' : 'Saved to favourites', exp.title, 'info')
  }

  if (variant === 'row') {
    return (
      <Link
        to={`/experiences/${exp.id}`}
        className="group flex gap-4 rounded-2xl border border-line bg-white p-3 transition-all hover:border-navy-200 hover:shadow-card"
      >
        <div className="relative h-[104px] w-[136px] shrink-0 overflow-hidden rounded-xl bg-navy-900">
          <Scene seed={exp.id} category={exp.category} className="h-full w-full" variant="thumb" />
          {matchScore !== undefined && (
            <span className="absolute left-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[10.5px] font-extrabold text-navy num">
              {Math.round(matchScore * 100)}%
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-royal">{catLabel(exp.category)}</p>
              <h3 className="mt-0.5 truncate text-[14.5px] font-bold leading-snug text-navy group-hover:text-royal">
                {exp.title}
              </h3>
            </div>
            <button
              onClick={onSave}
              aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
              aria-pressed={saved}
              className={clsx('grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors',
                saved ? 'bg-johor-50 text-johor' : 'text-ink-faint hover:bg-navy-50 hover:text-navy')}
            >
              <Icon name="heart" size={14} className={saved ? 'fill-johor' : ''} />
            </button>
          </div>
          <p className="mt-1 line-clamp-1 text-[12px] text-ink-mute">{op?.name}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px] text-ink-mute">
            <span className="inline-flex items-center gap-1">
              <Icon name="train-front" size={12} className="text-royal" /> {station?.name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" size={12} /> {hoursLabel(exp.durationMins)}
            </span>
            <span className="font-bold text-navy num">{money(exp.price)}</span>
          </div>
          {reasons?.[0] && (
            <p className="mt-1.5 flex items-start gap-1 text-[11px] leading-snug text-emerald2-700">
              <Icon name="sparkles" size={11} className="mt-0.5 shrink-0" /> {reasons[0]}
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
        className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-3xl bg-navy-900 p-5 text-white"
      >
        <Scene seed={exp.id} category={exp.category} className="absolute inset-0 h-full w-full" variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/55 to-transparent" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              Featured
            </span>
            <span className="text-[10.5px] font-semibold text-white/70">{catLabel(exp.category)}</span>
          </div>
          <h3 className="text-[19px] font-extrabold leading-tight">{exp.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-white/70">{exp.summary}</p>
          <div className="mt-3 flex items-center gap-3 text-[11.5px] text-white/80">
            <span className="inline-flex items-center gap-1">
              <Icon name="train-front" size={12} /> {station?.name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" size={12} /> {hoursLabel(exp.durationMins)}
            </span>
            <span className="font-bold text-gold num">{money(exp.price)}</span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link to={`/experiences/${exp.id}`} className="group block w-full">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy-900">
          <Scene seed={exp.id} category={exp.category} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]" variant="thumb" />
          <span className="absolute bottom-2 left-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[10.5px] font-bold text-navy num">
            {money(exp.price)}
          </span>
        </div>
        <h4 className="mt-2 line-clamp-2 text-[13px] font-bold leading-snug text-navy group-hover:text-royal">{exp.title}</h4>
        <p className="mt-0.5 text-[11px] text-ink-faint">{station?.name} · {hoursLabel(exp.durationMins)}</p>
      </Link>
    )
  }

  return (
    <Link
      to={`/experiences/${exp.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
        <Scene seed={exp.id} category={exp.category} className="h-full w-full transition-transform duration-[700ms] group-hover:scale-[1.05]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
          <span className="rounded-md bg-navy-950/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {catLabel(exp.category)}
          </span>
          <button
            onClick={onSave}
            aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
            aria-pressed={saved}
            className={clsx(
              'grid h-7 w-7 place-items-center rounded-lg backdrop-blur-sm transition-colors',
              saved ? 'bg-white text-johor' : 'bg-navy-950/40 text-white hover:bg-white hover:text-navy'
            )}
          >
            <Icon name="heart" size={13.5} className={saved ? 'fill-johor' : ''} />
          </button>
        </div>
        {matchScore !== undefined && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-white/95 px-2 py-1 shadow-sm">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-emerald2 text-[9px] font-black text-white num">
              {Math.round(matchScore * 100)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-navy">Match</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 text-[14.5px] font-bold leading-snug text-navy transition-colors group-hover:text-royal">
          {exp.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-ink-mute">{exp.summary}</p>

        {reasons && reasons.length > 0 && (
          <div className="mt-2.5 space-y-1 rounded-lg bg-emerald2-50/70 px-2 py-1.5">
            {reasons.slice(0, 2).map((r, i) => (
              <p key={i} className="flex items-start gap-1 text-[10.5px] leading-snug text-emerald2-800">
                <Icon name="check" size={10} className="mt-0.5 shrink-0" strokeWidth={3} /> {r}
              </p>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between border-t border-line pt-2.5">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-ink-soft">{op?.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-ink-faint">
                <Icon name="train-front" size={10} /> {station?.name} · {hoursLabel(exp.durationMins)}
              </p>
            </div>
            <p className="shrink-0 text-[14px] font-extrabold text-navy num">{money(exp.price)}</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Stars value={exp.rating} count={exp.reviewCount} size={11} />
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald2-700">
              <Icon name="badge-check" size={11} /> Verified
            </span>
          </div>
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
  const S = CORRIDOR
  return (
    <div className="relative">
      <div className="no-scrollbar flex gap-0 overflow-x-auto pb-2">
        {S.map((s, i) => {
          const active = s.id === activeStationId
          const count = counts?.[s.id] ?? 0
          return (
            <button
              key={s.id}
              onClick={() => onSelect?.(s.id)}
              className={clsx(
                'group relative flex min-w-[92px] shrink-0 flex-col items-center px-1 pt-3 text-center transition-opacity',
                !onSelect && 'cursor-default'
              )}
              aria-current={active ? 'true' : undefined}
            >
              <span className="absolute left-0 right-0 top-[26px] h-px bg-navy-200" aria-hidden />
              {i === 0 && <span className="absolute left-0 top-[26px] h-px w-1/2 bg-transparent" aria-hidden />}
              <span
                className={clsx(
                  'relative z-10 grid h-[13px] w-[13px] place-items-center rounded-full border-2 transition-all',
                  active
                    ? 'scale-125 border-royal bg-white ring-4 ring-royal/15'
                    : 'border-navy-300 bg-white group-hover:border-royal'
                )}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-royal" />}
              </span>
              <span
                className={clsx(
                  'mt-2 text-[11.5px] font-bold leading-tight',
                  active ? 'text-royal' : 'text-navy-600 group-hover:text-royal'
                )}
              >
                {s.name}
              </span>
              {!compact && (
                <span className="mt-0.5 text-[10px] text-ink-faint num">
                  {count > 0 ? `${count} exp` : '—'}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

