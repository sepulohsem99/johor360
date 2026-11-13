import { useMemo, useState } from 'react'
import { usePrefs } from '../../app/prefs'
import { T } from '../../components/ui/T'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../../components/ui/Icon'
import { Button, DemoTag, EmptyState, Field, Modal, Meter } from '../../components/ui'
import { useApp, usePublishedExperiences } from '../../app/store'
import { experienceById } from '../../data/experiencesIndex'
import { stationById, CORRIDOR, RAIL_SOURCE } from '../../data/stations'
import { itineraryDuration, itineraryTotals, toMin, toTime } from '../../services/itinerary'
import { hoursLabel, money, dateLabel } from '../../services/storage'
import { useMoneyText } from '../../app/currency'
import type { Itinerary, ItineraryItem } from '../../types'

export default function ItineraryBuilder() {
  const { tx } = usePrefs()
  const money = useMoneyText()
  const nav = useNavigate()
  const { itineraries, updateItinerary, removeItinerary, toast, profile, addItinerary } = useApp()
  const exps = usePublishedExperiences()

  const [activeId, setActiveId] = useState(itineraries[0]?.id ?? '')
  const active = itineraries.find((i) => i.id === activeId) ?? itineraries[0]

  const [renameOpen, setRenameOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [dragging, setDragging] = useState<string | null>(null)

  const totals = useMemo(() => (active ? itineraryTotals(active) : null), [active])
  const dur = useMemo(() => (active ? itineraryDuration(active) : 0), [active])

  if (!active) {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <EmptyState
          icon="route"
          title={tx("No itinerary yet")}
          body="Generate one from your matches, or build it manually by adding experiences from the corridor."
          action={<Button onClick={() => nav('/visitor/recommendations')} icon="sparkles"><T>Generate from matches</T></Button>}
        />
      </div>
    )
  }

  const station = stationById(active.stationId)

  const persist = (next: Itinerary) => {
    updateItinerary(next)
  }

  const removeItem = (itemId: string) => {
    const next = { ...active, items: active.items.filter((i) => i.id !== itemId) }
    persist(next)
    toast('Stop removed', 'Estimated cost and duration updated.', 'info')
  }

  const move = (itemId: string, dir: -1 | 1) => {
    const items = [...active.items].sort((a, b) => toMin(a.startTime) - toMin(b.startTime))
    const idx = items.findIndex((i) => i.id === itemId)
    const swap = idx + dir
    if (swap < 0 || swap >= items.length) return
    const times = items.map((i) => i.startTime)
    const a = items[idx]
    const b = items[swap]
    const nextItems = active.items.map((i) => {
      if (i.id === a.id) return { ...i, startTime: b.startTime }
      if (i.id === b.id) return { ...i, startTime: a.startTime }
      return i
    })
    void times
    persist({ ...active, items: nextItems })
  }

  const shiftTime = (itemId: string, mins: number) => {
    const nextItems = active.items.map((i) =>
      i.id === itemId ? { ...i, startTime: toTime(Math.max(0, toMin(i.startTime) + mins)) } : i
    )
    persist({ ...active, items: nextItems })
  }

  const duplicate = () => {
    const copy: Itinerary = {
      ...active,
      id: `it-${Date.now()}`,
      name: `${active.name} (copy)`,
      source: 'visitor',
      updatedAt: new Date().toISOString(),
      items: active.items.map((i) => ({ ...i, id: `ii-${Math.random().toString(36).slice(2, 9)}` })),
    }
    addItinerary(copy)
    setActiveId(copy.id)
    toast('Itinerary duplicated', copy.name, 'success')
  }

  const sorted = [...active.items].sort((a, b) => toMin(a.startTime) - toMin(b.startTime))
  const budgetPct = totals ? Math.min(100, (totals.total / active.budget) * 100) : 0

  const onDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) return
    const from = sorted.findIndex((i) => i.id === dragging)
    const to = sorted.findIndex((i) => i.id === targetId)
    if (from === -1 || to === -1) return
    const reordered = [...sorted]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    // reassign sequential times starting from first slot
    let cursor = sorted.length ? toMin(sorted[0].startTime) : 540
    const items = reordered.map((i) => {
      const item = { ...i, startTime: toTime(cursor) }
      cursor += i.durationMins + 30
      return item
    })
    persist({ ...active, items })
    setDragging(null)
    toast('Order updated', 'Times reassigned sequentially.', 'info')
  }

  return (
    <div className="min-w-0 space-y-5">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-[24px] font-extrabold">{active.name}</h1>
            <DemoTag label="Draft plan" />
          </div>
          <p className="mt-1 text-[12.5px] text-ink-mute">
            {station?.name} · {dateLabel(active.date)} · updated {dateLabel(active.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" icon="pen-line" onClick={() => { setNewName(active.name); setRenameOpen(true) }}><T>Rename</T></Button>
          <Button variant="ghost" size="sm" icon="copy" onClick={duplicate}><T>Duplicate</T></Button>
          <Button variant="ghost" size="sm" icon="share-2" onClick={() => setShareOpen(true)}><T>Share</T></Button>
          <Button variant="navy" size="sm" icon="plus" onClick={() => setAddOpen(true)}><T>Add stop</T></Button>
        </div>
      </div>

      {/* itinerary picker */}
      {itineraries.length > 1 && (
        <div className="w-full min-w-0 overflow-hidden">
        <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto pb-1">
          {itineraries.map((i) => (
            <button
              key={i.id}
              onClick={() => setActiveId(i.id)}
              className={clsx('shrink-0 rounded-xl border px-3 py-2 text-left transition-all',
                i.id === active.id ? 'border-navy bg-navy text-white' : 'border-line bg-raised text-ink-soft hover:border-navy-200')}
            >
              <p className="max-w-[180px] truncate text-[12px] font-bold">{i.name}</p>
              <p className={clsx('text-[10px]', i.id === active.id ? 'text-white/60' : 'text-ink-faint')}>
                {i.items.length} stops · {money(itineraryTotals(i).total)}
              </p>
            </button>
          ))}
        </div>
        </div>
      )}

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_312px]">
        {/* timeline */}
        <div className="min-w-0 space-y-3">
          {sorted.length === 0 ? (
            <EmptyState icon="calendar-x" title={tx("This itinerary is empty")} body={tx("Add an experience from the corridor, or generate a plan from your matches.")} action={<Button onClick={() => setAddOpen(true)} icon="plus"><T>Add a stop</T></Button>} />
          ) : (
            <div className="rounded-2xl border border-line bg-raised p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[14px] font-extrabold"><T>Timeline</T></h2>
                <p className="text-[10.5px] text-ink-faint"><T>Drag to reorder · times auto-assign</T></p>
              </div>

              <div className="relative">
                <span className="absolute bottom-3 left-[7px] top-3 w-px bg-navy-200" aria-hidden="true" />

                <div className="space-y-2">
                  {sorted.map((item, idx) => {
                    const exp = experienceById(item.experienceId) ?? exps.find((e) => e.id === item.experienceId)
                    if (!exp) return null
                    const gap = idx > 0 ? toMin(item.startTime) - (toMin(sorted[idx - 1].startTime) + sorted[idx - 1].durationMins) : 0
                    return (
                      <div key={item.id}>
                        {gap > 0 && (
                          <div className="mb-2 ml-6 flex items-center gap-2">
                            <span className="h-px flex-1 bg-line" />
                            <span className="text-[9.5px] font-semibold text-ink-faint">
                              {gap >= 60 ? `${Math.floor(gap / 60)}h ${gap % 60}m` : `${gap}m`} buffer
                              {item.transportMins > 0 && ` · ${item.transportMins}m rail`}
                            </span>
                            <span className="h-px flex-1 bg-line" />
                          </div>
                        )}

                        <div
                          draggable
                          onDragStart={() => setDragging(item.id)}
                          onDragEnd={() => setDragging(null)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => onDrop(item.id)}
                          className={clsx(
                            'relative flex gap-3 rounded-xl border p-2.5 transition-all',
                            dragging === item.id ? 'border-royal opacity-50' : 'border-line bg-raised hover:border-navy-200 hover:shadow-card'
                          )}
                        >
                          <div className="flex flex-col items-center pt-1">
                            <span className="z-10 grid h-[15px] w-[15px] place-items-center rounded-full border-2 border-royal bg-raised">
                              <span className="h-1.5 w-1.5 rounded-full bg-royal" />
                            </span>
                          </div>

                          <div className="flex min-w-0 flex-1 gap-2.5">
                            <div className="w-[46px] shrink-0 pt-0.5 text-center">
                              <p className="text-[12px] font-extrabold text-navy num">{item.startTime}</p>
                              <p className="text-[9.5px] text-ink-faint num">{hoursLabel(item.durationMins)}</p>
                            </div>

                            <div className="min-w-0 flex-1">
                              <Link to={`/experiences/${exp.id}`} className="block truncate text-[13px] font-bold text-navy hover:text-royal">
                                {exp.title}
                              </Link>
                              <p className="mt-0.5 truncate text-[10.5px] text-ink-mute">
                                {stationById(exp.stationId)?.name} · {money(item.price)} · {exp.intensity} intensity
                              </p>
                              <div className="mt-1.5 flex flex-wrap items-center gap-1">
                                <button onClick={() => shiftTime(item.id, -15)} className="rounded border border-line px-1.5 py-0.5 text-[9.5px] font-bold text-ink-mute hover:border-navy-300 hover:text-navy">−15m</button>
                                <button onClick={() => shiftTime(item.id, 15)} className="rounded border border-line px-1.5 py-0.5 text-[9.5px] font-bold text-ink-mute hover:border-navy-300 hover:text-navy">+15m</button>
                                <button onClick={() => move(item.id, -1)} disabled={idx === 0} className="grid h-5 w-5 place-items-center rounded border border-line text-ink-mute hover:border-navy-300 hover:text-navy disabled:opacity-30" aria-label="Move earlier">
                                  <Icon name="chevron-up" size={10} />
                                </button>
                                <button onClick={() => move(item.id, 1)} disabled={idx === sorted.length - 1} className="grid h-5 w-5 place-items-center rounded border border-line text-ink-mute hover:border-navy-300 hover:text-navy disabled:opacity-30" aria-label="Move later">
                                  <Icon name="chevron-down" size={10} />
                                </button>
                              </div>
                            </div>

                            <button onClick={() => removeItem(item.id)} aria-label={`Remove ${exp.title}`}
                              className="grid h-7 w-7 shrink-0 place-items-center self-start rounded-lg text-ink-faint transition-colors hover:bg-johor-50 hover:text-johor">
                              <Icon name="trash-2" size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* return leg */}
                <div className="mt-2 ml-6 flex items-center gap-2 rounded-xl border border-dashed border-gold-300 bg-gold-50/50 px-2.5 py-2">
                  <Icon name="train-front" size={14} className="shrink-0 text-gold-700" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] font-bold text-navy">Return leg to {station?.name}</p>
                    <p className="text-[10px] text-ink-mute">
                      Reserve at least 15 min buffer · {dur > 0 ? `activities end ${toTime(toMin(sorted[sorted.length - 1].startTime) + sorted[sorted.length - 1].durationMins)}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* cost table */}
          {totals && (
            <div className="rounded-2xl border border-line bg-raised p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[14px] font-extrabold"><T>Estimated cost</T></h2>
                <DemoTag label="Illustrative" />
              </div>
              <div className="space-y-1.5">
                {[
                  ['Experiences', totals.expCost, `${sorted.length} stops`],
                  ['Food & drink', totals.foodCost, 'estimated at 25% of activity spend'],
                  ['Local transport', totals.transportCost, 'e-hailing legs, RM12 each'],
                ].map(([l, v, note]) => (
                  <div key={l as string} className="flex items-center justify-between border-b border-line pb-1.5 last:border-0">
                    <div>
                      <p className="text-[12px] font-semibold text-ink-soft">{l}</p>
                      <p className="text-[10px] text-ink-faint">{note}</p>
                    </div>
                    <p className="text-[12.5px] font-bold text-navy num">{money(v as number)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 flex items-end justify-between border-t border-line pt-2.5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint"><T>Total per person</T></p>
                  <p className="text-[22px] font-extrabold leading-none text-navy num">{money(totals.total)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint"><T>Budget</T></p>
                  <p className={clsx('text-[13px] font-bold num', totals.remaining >= 0 ? 'text-emerald2-700' : 'text-johor')}>
                    {totals.remaining >= 0 ? `${money(totals.remaining)} left` : `${money(Math.abs(totals.remaining))} over`}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <Meter value={budgetPct} tone={budgetPct > 100 ? 'johor' : budgetPct > 85 ? 'gold' : 'emerald2'} />
              </div>
            </div>
          )}
        </div>

        {/* sidebar */}
        <aside className="min-w-0 space-y-3 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-raised p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint"><T>Plan summary</T></p>
            <div className="mt-2.5 space-y-2">
              {[
                ['Stops', `${sorted.length}`],
                ['Time on activities', hoursLabel(dur)],
                ['Estimated cost', totals ? money(totals.total) : 'RM0'],
                ['Budget', money(active.budget)],
                ['Purpose', active.purpose],
              ].map(([l, v]) => (
                <div key={l as string} className="flex items-center justify-between">
                  <span className="text-[11.5px] text-ink-mute">{l}</span>
                  <span className="text-[11.5px] font-bold capitalize text-navy num">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-raised p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">ETS reference</p>
              <a href={RAIL_SOURCE.url} target="_blank" rel="noreferrer noopener" className="text-[10px] font-bold text-royal underline">
                <T>KTMB</T>
              </a>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="rounded-lg bg-canvas px-2.5 py-2">
                <p className="text-[10px] text-ink-faint"><T>Departure</T></p>
                <p className="text-[11.5px] font-bold text-navy">JB Sentral → {station?.name}</p>
                <p className="text-[10px] text-ink-mute num">~{station?.minutesFromJB} min · 4 services/day</p>
              </div>
              <div className="rounded-lg bg-canvas px-2.5 py-2">
                <p className="text-[10px] text-ink-faint"><T>Return</T></p>
                <p className="text-[11.5px] font-bold text-navy">{station?.name} → JB Sentral</p>
                <p className="text-[10px] text-ink-mute num">~{station?.minutesFromJB} min</p>
              </div>
            </div>
            <p className="mt-2 text-[9.5px] leading-relaxed text-ink-faint">
              <T>Sample schedule. Not live KTMB data — always confirm departure times before travelling.</T>
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-raised p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint"><T>Last mile</T></p>
            <div className="mt-2 space-y-1.5">
              {station?.lastMile.slice(0, 3).map((l) => (
                <div key={l.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-ink-mute">{l.label}</span>
                  <span className={clsx('rounded px-1.5 py-0.5 text-[9.5px] font-bold',
                    l.available === true ? 'bg-emerald2-50 text-emerald2-700' : 'bg-gold-50 text-gold-800')}>
                    {l.available === true ? `${l.minutes}m` : 'Unknown'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Button className="w-full" variant="ghost" icon="printer" onClick={() => window.print()}><T>Print itinerary</T></Button>
            <Button className="w-full" variant="ghost" icon="download" onClick={() => toast('Export queued (mock)', 'A PDF export would be generated here. This is a UI demonstration.', 'info')}>
              <T>Export PDF</T>
            </Button>
            <Button className="w-full" variant="quiet" icon="trash-2"
              onClick={() => { if (confirm(`Delete “${active.name}”?`)) { removeItinerary(active.id); toast('Itinerary deleted', active.name, 'info'); setActiveId(itineraries.find((i) => i.id !== active.id)?.id ?? '') } }}>
              <T>Delete itinerary</T>
            </Button>
          </div>
        </aside>
      </div>

      {/* rename */}
      <Modal open={renameOpen} onClose={() => setRenameOpen(false)} title="Rename itinerary"
        footer={<><Button variant="quiet" size="sm" onClick={() => setRenameOpen(false)}><T>Cancel</T></Button>
          <Button size="sm" onClick={() => { if (newName.trim()) { persist({ ...active, name: newName.trim() }); setRenameOpen(false); toast('Renamed', newName, 'success') } }}><T>Save</T></Button></>}>
        <Field label={tx("Itinerary name")} required>
          <input className="field" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
        </Field>
      </Modal>

      {/* share */}
      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share itinerary"
        footer={<Button variant="quiet" size="sm" onClick={() => setShareOpen(false)}><T>Close</T></Button>}>
        <div className="space-y-3">
          <div className="rounded-xl bg-canvas p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint"><T>Demo share link</T></p>
            <p className="mt-1 break-all font-mono text-[11.5px] text-navy">https://johor360.pages.dev/share/{active.id}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[['Copy link', 'link-2'], ['Email', 'mail'], ['WhatsApp', 'message-square']].map(([l, i]) => (
              <button key={l} onClick={() => toast(`${l} (mock)`, 'Share targets are UI demonstrations only.', 'info')}
                className="rounded-xl border border-line py-3 text-center transition-colors hover:border-navy-200">
                <Icon name={i} size={16} className="mx-auto text-navy" />
                <p className="mt-1 text-[10.5px] font-semibold text-ink-soft">{l}</p>
              </button>
            ))}
          </div>
          <p className="rounded-lg bg-gold-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-gold-900">
            <T>Share is simulated. No public link is created and no data leaves this browser.</T>
          </p>
        </div>
      </Modal>

      {/* add stop */}
      <AddStopModal open={addOpen} onClose={() => setAddOpen(false)} itinerary={active} onAdd={(item) => {
        persist({ ...active, items: [...active.items, item] })
        toast('Stop added', 'Timeline and cost updated.', 'success')
        setAddOpen(false)
      }} />
    </div>
  )
}

function AddStopModal({ open, onClose, itinerary, onAdd }: { open: boolean; onClose: () => void; itinerary: Itinerary; onAdd: (i: ItineraryItem) => void }) {
  const { tx } = usePrefs()
  const exps = usePublishedExperiences()
  const [q, setQ] = useState('')
  const [stationFilter, setStationFilter] = useState<string>('')

  const list = useMemo(() => {
    let l = exps.filter((e) => !itinerary.items.some((i) => i.experienceId === e.id))
    if (stationFilter) l = l.filter((e) => e.stationId === stationFilter)
    if (q.trim()) {
      const s = q.toLowerCase()
      l = l.filter((e) => e.title.toLowerCase().includes(s) || e.town.toLowerCase().includes(s))
    }
    return l.slice(0, 12)
  }, [exps, q, stationFilter, itinerary.items])

  return (
    <Modal open={open} onClose={onClose} title={tx("Add a stop")} width="max-w-xl">
      <div className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="field" placeholder={tx("Search experiences…")} value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="field" value={stationFilter} onChange={(e) => setStationFilter(e.target.value)}>
            <option value=""><T>All stations</T></option>
            {CORRIDOR.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="max-h-[46vh] space-y-1.5 overflow-y-auto">
          {list.length === 0 ? (
            <p className="py-8 text-center text-[12px] text-ink-faint"><T>No matching experiences left to add.</T></p>
          ) : (
            list.map((e) => (
              <button key={e.id}
                onClick={() => onAdd({ id: `ii-${Date.now()}`, experienceId: e.id, startTime: '10:00', durationMins: e.durationMins, price: e.price, transportMins: 0 })}
                className="flex w-full items-center gap-2.5 rounded-xl border border-line p-2.5 text-left transition-colors hover:border-navy-200 hover:bg-navy-50/50">
                <div className="h-9 w-12 shrink-0 overflow-hidden rounded-lg bg-navy-900">
                  <SceneMini id={e.id} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-bold text-navy">{e.title}</p>
                  <p className="text-[10.5px] text-ink-faint">{stationById(e.stationId)?.name} · {hoursLabel(e.durationMins)} · {money(e.price)}</p>
                </div>
                <Icon name="plus" size={15} className="shrink-0 text-royal" />
              </button>
            ))
          )}
        </div>
        <p className="rounded-lg bg-gold-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-gold-900">
          <T>Newly added stops start at 10:00. Use the arrow controls to reorder and the ±15m buttons to shift timing.</T>
        </p>
      </div>
    </Modal>
  )
}

import Scene from '../../components/art/Scene'
function SceneMini({ id }: { id: string }) {
  const e = experienceById(id)
  return <Scene seed={id} category={e?.category ?? 'heritage'} className="h-full w-full" variant="thumb" />
}

export function ItinerariesIndex() {
  const { tx } = usePrefs()
  const money = useMoneyText()
  const { itineraries, removeItinerary, toast } = useApp()
  const nav = useNavigate()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold"><T>Saved itineraries</T></h1>
          <p className="mt-1 text-[13px] text-ink-mute">{itineraries.length} plans stored in this browser</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon="sparkles" onClick={() => nav('/visitor/recommendations')}><T>Generate new</T></Button>
          <Button size="sm" icon="route" onClick={() => nav('/visitor/itinerary')}><T>Open builder</T></Button>
        </div>
      </div>

      {itineraries.length === 0 ? (
        <EmptyState icon="route" title={tx("No itineraries saved")} body={tx("Generate one from your matches or build it manually.")} action={<Button onClick={() => nav('/visitor/recommendations')}><T>See matches</T></Button>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {itineraries.map((it) => {
            const t = itineraryTotals(it)
            const d = itineraryDuration(it)
            return (
              <div key={it.id} className="group flex flex-col rounded-2xl border border-line bg-raised p-4 transition-all hover:border-navy-200 hover:shadow-card">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-extrabold text-navy">{it.name}</p>
                    <p className="mt-0.5 text-[10.5px] text-ink-faint">
                      {stationById(it.stationId)?.name} · {dateLabel(it.date)}
                    </p>
                  </div>
                  <span className={clsx('shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-bold uppercase',
                    it.source === 'seed' ? 'bg-navy-50 text-navy-500' : 'bg-emerald2-50 text-emerald2-700')}>
                    {it.source === 'seed' ? 'Sample' : 'Mine'}
                  </span>
                </div>

                <div className="mt-2.5 space-y-1">
                  {it.items.slice(0, 3).map((i) => {
                    const e = experienceById(i.experienceId)
                    return (
                      <p key={i.id} className="flex items-center gap-1.5 truncate text-[11px] text-ink-mute">
                        <span className="text-[9.5px] font-bold text-royal num">{i.startTime}</span>
                        <span className="truncate">{e?.title}</span>
                      </p>
                    )
                  })}
                  {it.items.length > 3 && <p className="text-[10px] text-ink-faint">+{it.items.length - 3} more</p>}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-line pt-2.5">
                  <div className="flex gap-2.5 text-[10.5px]">
                    <span className="text-ink-faint num">{it.items.length} stops</span>
                    <span className="text-ink-faint num">{hoursLabel(d)}</span>
                    <span className={clsx('font-bold num', t.total <= it.budget ? 'text-emerald2-700' : 'text-johor')}>{money(t.total)}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => nav('/visitor/itinerary')} className="grid h-6 w-6 place-items-center rounded text-ink-faint hover:bg-navy-50 hover:text-navy" aria-label="Open">
                      <Icon name="arrow-right" size={13} />
                    </button>
                    <button onClick={() => { removeItinerary(it.id); toast('Deleted', it.name, 'info') }} className="grid h-6 w-6 place-items-center rounded text-ink-faint hover:bg-johor-50 hover:text-johor" aria-label={tx("Delete")}>
                      <Icon name="trash-2" size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
