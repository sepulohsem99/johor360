import type { VerificationStatus } from '../types'

const KEY = 'johor360.v1'

export function load<T>(fallback: T, field: string): T {
  try {
    const raw = localStorage.getItem(`${KEY}.${field}`)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save<T>(field: string, value: T) {
  try {
    localStorage.setItem(`${KEY}.${field}`, JSON.stringify(value))
  } catch {
    /* storage full or blocked — non-fatal for a mockup */
  }
}

export function resetAll() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(KEY))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}

export const VERIFICATION_META: Record<
  VerificationStatus,
  { label: string; tone: string; dot: string }
> = {
  draft: { label: 'Draft', tone: 'bg-navy-100 text-navy-700', dot: 'bg-navy-400' },
  pending: { label: 'Pending verification', tone: 'bg-gold-100 text-gold-800', dot: 'bg-gold-500' },
  verified: { label: 'Verified', tone: 'bg-emerald2-100 text-emerald2-800', dot: 'bg-emerald2-600' },
  rejected: { label: 'Rejected', tone: 'bg-johor-100 text-johor-700', dot: 'bg-johor-600' },
  changes_requested: {
    label: 'Changes requested',
    tone: 'bg-gold-100 text-gold-900',
    dot: 'bg-gold-600',
  },
}

export const ENQUIRY_META: Record<string, { label: string; tone: string }> = {
  new: { label: 'New', tone: 'bg-royal-100 text-royal-800' },
  in_review: { label: 'In review', tone: 'bg-gold-100 text-gold-800' },
  responded: { label: 'Responded', tone: 'bg-emerald2-100 text-emerald2-800' },
  closed: { label: 'Closed', tone: 'bg-navy-100 text-navy-600' },
}

export const money = (n: number) => `RM${n.toLocaleString('en-MY')}`

export const hoursLabel = (mins: number) => {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export const dateLabel = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const timeAgo = (iso: string) => {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return iso
  const diff = Date.now() - then
  const day = 86400000
  if (diff < day) return 'today'
  if (diff < day * 2) return 'yesterday'
  return `${Math.floor(diff / day)} days ago`
}
