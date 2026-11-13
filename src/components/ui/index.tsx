import React from 'react'
import { usePrefs } from '../../app/prefs'
import clsx from 'clsx'
import Icon from './Icon'
import { VERIFICATION_META, ENQUIRY_META } from '../../services/storage'
import type { VerificationStatus } from '../../types'

// ---------------------------------------------------------------- Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'navy' | 'ghost' | 'quiet' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconRight?: string
  as?: 'button'
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'btn',
        `btn-${variant}`,
        size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : 'btn-md',
        className
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 15 : 17} />}
    </button>
  )
}

// ---------------------------------------------------------------- Badge
export function VerificationBadge({ status, size = 'sm' }: { status: VerificationStatus; size?: 'sm' | 'xs' }) {
  const m = VERIFICATION_META[status]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap',
        m.tone,
        size === 'xs' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-1 text-[11.5px]'
      )}
    >
      <span className={clsx('h-1.5 w-1.5 rounded-full', m.dot)} />
      {m.label}
    </span>
  )
}

export function EnquiryBadge({ status }: { status: string }) {
  const m = ENQUIRY_META[status] ?? ENQUIRY_META.new
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold', m.tone)}>
      {m.label}
    </span>
  )
}

// ---------------------------------------------------------------- DemoTag
export function DemoTag({ className, label = 'Demo data' }: { className?: string; label?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md bg-navy-50 px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-navy-500 ring-1 ring-inset ring-navy-100',
        className
      )}
      title="This is simulated demonstration data for a competition mockup, not live or verified information."
    >
      <Icon name="flask-conical" size={11} />
      {label}
    </span>
  )
}

// ---------------------------------------------------------------- Section
export function Section({
  eyebrow,
  title,
  blurb,
  action,
  children,
  className,
  tight,
}: {
  eyebrow?: string
  title?: React.ReactNode
  blurb?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
  tight?: boolean
}) {
  return (
    <section className={clsx(tight ? 'py-10' : 'py-14 sm:py-20', className)}>
      <div className="shell">
        {(eyebrow || title || action) && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
              {title && (
                <h2 className="text-[26px] leading-[1.14] font-extrabold sm:text-[36px]">{title}</h2>
              )}
              {blurb && <p className="mt-3 text-[15px] leading-relaxed text-ink-mute">{blurb}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Stars
export function Stars({ value, count, size = 13 }: { value: number; count?: number; size?: number }) {
  if (!value) return <span className="text-[12px] text-ink-faint">No reviews yet</span>
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M10 1.6l2.47 5.16 5.66.76-4.15 3.94 1.04 5.6L10 14.42 4.98 17.06l1.04-5.6L1.87 7.52l5.66-.76L10 1.6z"
              fill={i <= Math.round(value) ? '#E5AE45' : '#DDE4EF'}
            />
          </svg>
        ))}
      </span>
      <span className="text-[12.5px] font-semibold text-ink-soft num">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-[12px] text-ink-faint">({count})</span>}
    </span>
  )
}

// ---------------------------------------------------------------- Skeleton
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('relative overflow-hidden rounded-xl bg-navy-100/70', className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  )
}

// ---------------------------------------------------------------- Empty
export function EmptyState({
  icon = 'search-x',
  title,
  body,
  action,
}: {
  icon?: string
  title: string
  body?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white/60 px-6 py-14 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-navy-50 text-navy-400">
        <Icon name={icon} size={22} />
      </div>
      <h3 className="text-[16px] font-bold">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-ink-mute">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ---------------------------------------------------------------- Toggle
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
}: {
  options: { id: T; label: string; count?: number }[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <div className={clsx('inline-flex rounded-xl bg-navy-50 p-1', className)} role="tablist">
      {options.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={clsx(
            'rounded-lg font-semibold transition-all',
            size === 'sm' ? 'px-3 py-1.5 text-[12.5px]' : 'px-3.5 py-2 text-[13px]',
            value === o.id
              ? 'bg-raised text-navy shadow-[0_1px_2px_rgba(11,31,58,.12)]'
              : 'text-ink-mute hover:text-navy'
          )}
        >
          {o.label}
          {o.count !== undefined && (
            <span className={clsx('ml-1.5 num', value === o.id ? 'text-royal' : 'text-ink-faint')}>{o.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------- Modal
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 'max-w-lg',
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  width?: string
}) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-navy-950/45 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          'relative w-full overflow-hidden rounded-t-3xl bg-raised shadow-pop animate-fadeUp sm:rounded-2xl',
          width
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-[16px] font-bold">{title}</h3>
          <button
            onClick={onClose}
            aria-label={title ?? 'Close dialog'}
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-mute hover:bg-navy-50 hover:text-navy"
          >
            <Icon name="x" size={17} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-line bg-canvas px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Field
export function Field({
  label,
  hint,
  error,
  children,
  required,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
  required?: boolean
}) {
  const id = React.useId()
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-johor">*</span>}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id })
        : children}
      {hint && !error && <p className="mt-1.5 text-[12px] text-ink-faint">{hint}</p>}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-johor">
          <Icon name="alert-circle" size={12} /> {error}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- Stat
export function Stat({
  label,
  value,
  delta,
  icon,
  hint,
  tone = 'navy',
}: {
  label: string
  value: string | number
  delta?: string
  icon?: string
  hint?: string
  tone?: 'navy' | 'emerald2' | 'gold' | 'royal' | 'johor'
}) {
  const tones: Record<string, string> = {
    navy: 'bg-navy-50 text-navy-600',
    emerald2: 'bg-emerald2-50 text-emerald2-700',
    gold: 'bg-gold-50 text-gold-700',
    royal: 'bg-royal-50 text-royal-700',
    johor: 'bg-johor-50 text-johor-700',
  }
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
        {icon && (
          <span className={clsx('grid h-7 w-7 place-items-center rounded-lg', tones[tone])}>
            <Icon name={icon} size={14} />
          </span>
        )}
      </div>
      <p className="mt-2 text-[26px] font-extrabold leading-none num">{value}</p>
      {delta && <p className="mt-1.5 text-[12px] font-semibold text-emerald2-700">{delta}</p>}
      {hint && <p className="mt-1.5 text-[11.5px] leading-snug text-ink-faint">{hint}</p>}
    </div>
  )
}

// ---------------------------------------------------------------- Progress
export function Meter({ value, tone = 'royal', label }: { value: number; tone?: string; label?: string }) {
  const tones: Record<string, string> = {
    royal: 'bg-royal',
    emerald2: 'bg-emerald2',
    gold: 'bg-gold',
    johor: 'bg-johor',
    navy: 'bg-navy',
  }
  return (
    <div>
      {label && <div className="mb-1 flex justify-between text-[11.5px] font-medium text-ink-mute">{label}</div>}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-100">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', tones[tone] ?? tones.royal)}
          style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )
}
