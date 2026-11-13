import type { Experience, MatchResult, VisitorProfile, Purpose, Station } from '../types'
import { stationById, STATIONS } from '../data/stations'

/**
 * JOHOR360 SMART MATCH
 * --------------------
 * Deterministic weighted scoring, no external AI service.
 *
 * These weights are a PROPOSED PRODUCT DESIGN, not research-validated
 * coefficients. They are exposed in the UI so judges and visitors can see
 * exactly why an experience ranked where it did.
 */
export const WEIGHTS = {
  interest: 0.25,
  time: 0.25,
  access: 0.25,
  budget: 0.15,
  purpose: 0.1,
} as const

/** Buffer applied per experience for arrival/settlement, in minutes. */
const ARRIVAL_BUFFER = 10
/** Buffer applied for the return leg to the station. */
const RETURN_BUFFER = 15

export interface MatchOptions {
  /** simulated rain scenario reduces outdoor suitability */
  rain?: boolean
  /** restrict to a specific station (null = whole corridor) */
  stationId?: string | null
  /** max results */
  limit?: number
  /** include experiences that fail hard constraints, flagged */
  includeFailures?: boolean
}

const INTEREST_MAP: Record<string, string[]> = {
  food: ['food'],
  culture: ['culture'],
  heritage: ['heritage'],
  nature: ['nature'],
  agriculture: ['agriculture'],
  craft: ['craft'],
  wellness: ['wellness'],
  education: ['education'],
  photography: ['photography'],
  community: ['community', 'culture'],
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

/** Travel minutes from the visitor's chosen station to the experience's station. */
export function railMinutesBetween(fromId: string, toId: string): number {
  const a = stationById(fromId)
  const b = stationById(toId)
  if (!a || !b) return 0
  return Math.abs(a.minutesFromJB - b.minutesFromJB)
}

export function stationDistanceLabel(fromId: string, toId: string): string {
  const mins = railMinutesBetween(fromId, toId)
  if (mins === 0) return 'At your station'
  if (mins <= 20) return `~${mins} min by ETS`
  return `~${mins} min by ETS`
}

function interestScore(exp: Experience, profile: VisitorProfile): number {
  if (!profile.interests.length) return 0.55
  let hits = 0
  for (const i of profile.interests) {
    const mapped = INTEREST_MAP[i] ?? [i]
    if (mapped.some((m) => exp.interests.includes(m))) hits += 1
  }
  return clamp01(0.35 + (hits / Math.max(1, profile.interests.length)) * 0.75)
}

function timeScore(exp: Experience, profile: VisitorProfile, travelMins: number): number {
  const needed = exp.durationMins + travelMins * 2 + ARRIVAL_BUFFER + RETURN_BUFFER
  const available = profile.availableMins
  if (needed > available) return 0
  const slack = available - needed
  // best fit: uses most of the available window without overrunning
  return clamp01(0.55 + (1 - slack / Math.max(60, available)) * 0.45)
}

function accessScore(exp: Experience, profile: VisitorProfile, travelMins: number): number {
  let s = 1
  // rail proximity
  if (travelMins > 0) s -= Math.min(0.35, travelMins / 400)
  // last mile: prefer options the visitor is willing to use
  const station = stationById(exp.stationId) as Station | undefined
  if (station) {
    const usable = station.lastMile.filter((l) => l.available === true)
    if (!usable.length) s -= 0.15
  }
  // accessibility alignment
  const needsStepFree = profile.accessibility.includes('wheelchair') || profile.accessibility.includes('step_free')
  if (needsStepFree) {
    if (!exp.accessibility.stepFree) s -= 0.45
    if (profile.accessibility.includes('wheelchair') && !exp.accessibility.wheelchair) s -= 0.5
  }
  if (profile.accessibility.includes('seated') && !exp.accessibility.seatedOption) s -= 0.2
  if (profile.accessibility.includes('low_intensity') && exp.intensity === 'high') s -= 0.35
  return clamp01(s)
}

function budgetScore(exp: Experience, profile: VisitorProfile): number {
  if (exp.price > profile.budget) return 0
  const ratio = exp.price / Math.max(1, profile.budget)
  // sweet spot: uses a meaningful share of budget but leaves room
  return clamp01(0.5 + (1 - Math.abs(ratio - 0.45) * 1.4) * 0.5)
}

const PURPOSE_AFFINITY: Record<Purpose, Partial<Record<Experience['category'], number>>> = {
  business: { food: 1, heritage: 0.85, workshops: 0.7, culture: 0.7, leisure: 0.8, wellness: 0.6 },
  medical: { wellness: 1, food: 0.8, heritage: 0.7, culture: 0.7, community: 0.75, workshops: 0.6 },
  education: { education: 1, heritage: 0.95, agriculture: 0.9, workshops: 0.9, culture: 0.85, nature: 0.8 },
  leisure: { nature: 1, food: 0.95, culture: 0.9, agriculture: 0.9, community: 0.9, heritage: 0.8, workshops: 0.8 },
}

function purposeScore(exp: Experience, profile: VisitorProfile): number {
  if (!profile.purpose) return 0.6
  const aff = PURPOSE_AFFINITY[profile.purpose][exp.category] ?? 0.4
  const explicit = exp.bestFor.includes(profile.purpose) ? 0.25 : 0
  return clamp01(aff * 0.85 + explicit)
}

export interface HardConstraintIssue {
  exp: Experience
  reason: string
}

/**
 * Hard constraints are evaluated BEFORE ranking. An experience that fails a
 * hard constraint is never recommended to that visitor.
 */
export function hardConstraints(exp: Experience, profile: VisitorProfile, travelMins: number): string | null {
  const needsWheelchair = profile.accessibility.includes('wheelchair')
  if (needsWheelchair && !exp.accessibility.wheelchair) {
    return 'Not wheelchair accessible — excluded because you require wheelchair access.'
  }
  if (profile.accessibility.includes('step_free') && !exp.accessibility.stepFree) {
    return 'Route includes steps or uneven ground — excluded because you need step-free access.'
  }
  if (profile.accessibility.includes('low_intensity') && exp.intensity === 'high') {
    return 'High physical intensity — excluded because you asked for low-intensity only.'
  }
  const needed = exp.durationMins + travelMins * 2 + ARRIVAL_BUFFER + RETURN_BUFFER
  if (needed > profile.availableMins * 1.6) {
    return `Needs about ${Math.round(needed / 60)}h including travel — far beyond your available time.`
  }
  return null
}

export function matchExperiences(
  experiences: Experience[],
  profile: VisitorProfile,
  opts: MatchOptions = {}
): MatchResult[] {
  const { rain = false, stationId = null, limit = 24, includeFailures = false } = opts
  const base = stationId ?? profile.stationId

  const results: MatchResult[] = []

  for (const exp of experiences) {
    if (exp.verification !== 'verified') continue
    const travelMins = railMinutesBetween(base, exp.stationId)
    const fail = hardConstraints(exp, profile, travelMins)
    if (fail && !includeFailures) continue

    const i = interestScore(exp, profile)
    const t = timeScore(exp, profile, travelMins)
    const a = accessScore(exp, profile, travelMins)
    const b = budgetScore(exp, profile)
    const p = purposeScore(exp, profile)

    let score =
      i * WEIGHTS.interest + t * WEIGHTS.time + a * WEIGHTS.access + b * WEIGHTS.budget + p * WEIGHTS.purpose

    // Quality tiebreak: when weighted factors land on the same value, prefer the
    // better-reviewed listing. Kept small so it never overrides the five factors.
    const quality = exp.reviewCount ? (exp.rating / 5) * 0.02 : 0.01
    score = Math.min(1, score + quality)

    // rain scenario: penalise outdoor, boost indoor
    if (rain) {
      if (exp.setting === 'outdoor') score *= 0.55
      if (exp.setting === 'indoor') score = Math.min(1, score * 1.08)
    }

    const reasons: string[] = []
    if (travelMins === 0) reasons.push('reason.atStation')
    else if (travelMins <= 30) reasons.push(`reason.nearStation|${travelMins}|${stationById(base)?.name ?? ''}`)
    if (exp.price <= profile.budget) reasons.push(`reason.fitsBudget|${profile.budget}|${exp.price}`)
    if (profile.purpose && exp.bestFor.includes(profile.purpose)) {
      reasons.push(`reason.purposeFit|${profile.purpose}`)
    }
    if (exp.accessibility.stepFree && profile.accessibility.length) reasons.push('reason.stepFree')
    if (rain && exp.setting === 'indoor') reasons.push('reason.indoor')
    if (exp.durationMins <= profile.availableMins) {
      const hrs = (exp.durationMins / 60).toFixed(exp.durationMins % 60 === 0 ? 0 : 1)
      reasons.push(`reason.duration|${hrs}`)
    }
    if (!reasons.length) reasons.push('reason.overallFit')

    results.push({
      experience: exp,
      score: Math.round(score * 1000) / 1000,
      breakdown: {
        interest: Math.round(i * 100),
        time: Math.round(t * 100),
        access: Math.round(a * 100),
        budget: Math.round(b * 100),
        purpose: Math.round(p * 100),
      },
      reasons: reasons.slice(0, 3),
      hardFail: fail ?? undefined,
    })
  }

  results.sort((x, y) => y.score - x.score)
  return results.slice(0, limit)
}

/** Stations ranked by how many verified experiences are available within a window. */
export function stationSupply(experiences: Experience[]) {
  return STATIONS.map((s) => ({
    station: s,
    count: experiences.filter((e) => e.stationId === s.id && e.verification === 'verified').length,
  }))
}
