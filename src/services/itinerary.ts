import type { Experience, Itinerary, ItineraryItem, VisitorProfile } from '../types'
import { stationById } from '../data/stations'
import { matchExperiences } from './matching'

export interface PlanOption {
  id: '2h' | '4h' | 'half'
  label: string
  minutes: number
  blurb: string
  items: ItineraryItem[]
  totalMins: number
  totalCost: number
  travelMins: number
  fitsBudget: boolean
  narrative: string
}

const pad = (n: number) => String(n).padStart(2, '0')
const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const toTime = (m: number) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`

const START = 9 * 60 // demo day starts 09:00
const ARRIVAL = 10
const RETURN = 15

function buildTimeline(picks: Experience[], baseStation: string) {
  let cursor = START
  const items: ItineraryItem[] = []
  let travelTotal = 0
  for (const exp of picks) {
    const station = stationById(exp.stationId)
    const base = stationById(baseStation)
    const travel = Math.abs((station?.minutesFromJB ?? 0) - (base?.minutesFromJB ?? 0))
    travelTotal += travel
    cursor += ARRIVAL + travel
    items.push({
      id: `ii-gen-${exp.id}-${Math.random().toString(36).slice(2, 7)}`,
      experienceId: exp.id,
      startTime: toTime(cursor),
      durationMins: exp.durationMins,
      price: exp.price,
      transportMins: travel,
    })
    cursor += exp.durationMins + 15 // inter-activity buffer
  }
  return { items, travelTotal, endMins: cursor + RETURN }
}

export function generatePlans(
  experiences: Experience[],
  profile: VisitorProfile,
  rain = false
): PlanOption[] {
  const mk = (
    id: PlanOption['id'],
    label: string,
    minutes: number,
    blurb: string,
    maxItems: number
  ): PlanOption => {
    const windowProfile: VisitorProfile = { ...profile, availableMins: minutes }
    const ranked = matchExperiences(experiences, windowProfile, { rain, limit: 12 })
    // Prefer experiences at the visitor's own station: a 4-hour window cannot
    // absorb two hours of return rail travel to a different stop.
    const localFirst = [
      ...ranked.filter((r) => r.experience.stationId === profile.stationId),
      ...ranked.filter((r) => r.experience.stationId !== profile.stationId),
    ]
    const picks: Experience[] = []
    let used = ARRIVAL + RETURN
    let cost = 0
    for (const r of localFirst) {
      const exp = r.experience
      const station = stationById(exp.stationId)
      const base = stationById(profile.stationId)
      const travel = Math.abs((station?.minutesFromJB ?? 0) - (base?.minutesFromJB ?? 0))
      // travel counts twice (out and back) plus a per-stop buffer
      const need = exp.durationMins + travel * 2 + 15
      if (used + need > minutes) continue
      if (cost + exp.price > profile.budget) continue
      if (picks.length >= maxItems) break
      picks.push(exp)
      used += need
      cost += exp.price
    }
    const { items, travelTotal, endMins } = buildTimeline(picks, profile.stationId)
    const totalMins = endMins - START
    const totalCost = items.reduce((s, i) => s + i.price, 0)
    const buffer = Math.max(0, minutes - totalMins) + RETURN
    const lastEnd = items.length
      ? toTime(toMin(items[items.length - 1].startTime) + items[items.length - 1].durationMins)
      : '—'
    const narrative = picks.length
      ? `${picks.length} stop${picks.length > 1 ? 's' : ''} from ${stationById(profile.stationId)?.name}, last activity ends ${lastEnd} — leaving ${buffer} min before your onward train.`
      : 'No verified experience fits this window with your current filters. Try widening your budget or time.'

    return {
      id,
      label,
      minutes,
      blurb,
      items,
      totalMins,
      totalCost,
      travelMins: travelTotal,
      fitsBudget: totalCost <= profile.budget,
      narrative,
    }
  }

  return [
    mk('2h', '2-hour exploration', 120, 'Tight window — one experience close to your station.', 1),
    mk('4h', '4-hour exploration', 240, 'Two experiences with a comfortable buffer.', 2),
    mk('half', 'Half-day experience', 300, 'Full morning or afternoon with three stops.', 3),
  ]
}

export function planToItinerary(plan: PlanOption, profile: VisitorProfile): Itinerary {
  return {
    id: `it-gen-${Date.now()}`,
    name: `${plan.label} — ${stationById(profile.stationId)?.name ?? 'Corridor'}`,
    purpose: profile.purpose ?? 'leisure',
    stationId: profile.stationId,
    date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    items: plan.items,
    budget: profile.budget,
    updatedAt: new Date().toISOString(),
    source: 'generated',
  }
}

export function itineraryTotals(itinerary: Itinerary) {
  const expCost = itinerary.items.reduce((s, i) => s + i.price, 0)
  const foodCost = Math.round(expCost * 0.25)
  const transportCost = itinerary.items.reduce((s, i) => (i.transportMins > 0 ? s + 12 : s), 0)
  const total = expCost + foodCost + transportCost
  return { expCost, foodCost, transportCost, total, remaining: itinerary.budget - total }
}

export function itineraryDuration(itinerary: Itinerary) {
  if (!itinerary.items.length) return 0
  const sorted = [...itinerary.items].sort((a, b) => toMin(a.startTime) - toMin(b.startTime))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  return toMin(last.startTime) + last.durationMins - toMin(first.startTime)
}

export { toMin, toTime }
