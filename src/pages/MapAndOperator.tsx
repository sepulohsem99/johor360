import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import clsx from 'clsx'
import L from 'leaflet'
import Icon from '../components/ui/Icon'
import { Button, DemoTag, EmptyState } from '../components/ui'
import Scene from '../components/art/Scene'
import { usePublishedExperiences } from '../app/store'
import { STATIONS, CORRIDOR, stationById } from '../data/stations'
import { operatorById } from '../data/operators'
import { CATEGORIES } from '../data/taxonomy'
import { hoursLabel, money } from '../services/storage'

export default function ExploreMap() {
  const exps = usePublishedExperiences()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapObj = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const [station, setStation] = useState<string | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let l = exps
    if (station) l = l.filter((e) => e.stationId === station)
    if (category) l = l.filter((e) => e.category === category)
    return l
  }, [exps, station, category])

  // init map once
  useEffect(() => {
    if (!mapRef.current || mapObj.current) return
    const map = L.map(mapRef.current, {
      center: [2.15, 103.3],
      zoom: 9,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map)
    markersRef.current = L.layerGroup().addTo(map)
    mapObj.current = map

    // draw corridor polyline
    const line = CORRIDOR.map((s) => [s.lat, s.lng] as [number, number])
    L.polyline(line, { color: '#1769AA', weight: 3, opacity: 0.55, dashArray: '8 8' }).addTo(map)

    return () => {
      map.remove()
      mapObj.current = null
    }
  }, [])

  // markers
  useEffect(() => {
    const map = mapObj.current
    const group = markersRef.current
    if (!map || !group) return
    group.clearLayers()

    for (const s of STATIONS) {
      const count = filtered.filter((e) => e.stationId === s.id).length
      const icon = L.divIcon({
        html: `<div class="j360-pin station" style="width:${count ? 36 : 26}px;height:${count ? 36 : 26}px;font-size:${count ? 12 : 10}px">${count || '·'}</div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })
      L.marker([s.lat, s.lng], { icon, title: s.name })
        .addTo(group)
        .bindPopup(
          `<div style="font-family:inherit;min-width:180px">
            <p style="margin:0;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#6B7C93;font-weight:700">${s.state}</p>
            <p style="margin:2px 0 0;font-size:14px;font-weight:800;color:#0B1F3A">${s.name}</p>
            <p style="margin:4px 0 0;font-size:11px;color:#3D4E66">${s.district} · ~${s.minutesFromJB} min from JB</p>
            <p style="margin:6px 0 0;font-size:11px;font-weight:700;color:#15856A">${count} experience${count === 1 ? '' : 's'}</p>
            <a href="/explore/stations/${s.id}" style="display:inline-block;margin-top:8px;font-size:11px;font-weight:700;color:#1769AA;text-decoration:none">View station →</a>
          </div>`
        )
        .on('click', () => setStation(s.id))
    }

    for (const e of filtered) {
      const st = stationById(e.stationId)
      if (!st) continue
      // jitter deterministically so pins near a station do not overlap
      const seed = e.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      const jLat = (Math.sin(seed) * 0.022)
      const jLng = (Math.cos(seed) * 0.022)
      const icon = L.divIcon({ html: `<div class="j360-pin">${money(e.price).replace('RM', '')}</div>`, className: '', iconSize: [32, 32], iconAnchor: [16, 16] })
      L.marker([st.lat + jLat, st.lng + jLng], { icon })
        .addTo(group)
        .on('click', () => setSelected(e.id))
        .bindPopup(
          `<div style="font-family:inherit;max-width:200px">
            <p style="margin:0;font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#1769AA;font-weight:800">${CATEGORIES.find((c) => c.id === e.category)?.label}</p>
            <p style="margin:3px 0 0;font-size:13px;font-weight:800;color:#0B1F3A;line-height:1.3">${e.title}</p>
            <p style="margin:4px 0 0;font-size:10.5px;color:#3D4E66">${operatorById(e.operatorId)?.name}</p>
            <p style="margin:3px 0 0;font-size:10.5px;font-weight:700;color:#0B1F3A">${money(e.price)} · ${hoursLabel(e.durationMins)}</p>
          </div>`
        )
    }
  }, [filtered])

  const flyTo = (id: string) => {
    const s = STATIONS.find((x) => x.id === id)
    if (s && mapObj.current) {
      mapObj.current.flyTo([s.lat, s.lng], 11, { duration: 0.8 })
      setStation(id)
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const e of exps) c[e.stationId] = (c[e.stationId] ?? 0) + 1
    return c
  }, [exps])

  const selectedExp = selected ? exps.find((e) => e.id === selected) : null

  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-line bg-white">
        <div className="shell py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow mb-1.5">Experience map</p>
              <h1 className="text-[24px] font-extrabold sm:text-[30px]">The corridor, geographically</h1>
              <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-ink-mute">
                Station pins show how many verified experiences sit at each stop. Price pins are individual listings,
                offset slightly so they stay readable.
              </p>
            </div>
            <DemoTag label="Illustrative positions" />
          </div>
        </div>
      </div>

      <div className="shell py-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {/* filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button onClick={() => setStation(null)} className={clsx('chip', !station && 'chip-active')}>
                All stations
              </button>
              {CORRIDOR.map((s) => (
                <button key={s.id} onClick={() => flyTo(s.id)} className={clsx('chip', station === s.id && 'chip-active')}>
                  {s.name} <span className="num opacity-60">{counts[s.id] ?? 0}</span>
                </button>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-line bg-white">
              <div ref={mapRef} className="h-[420px] w-full sm:h-[520px]" aria-label="Map of Johor ETS corridor experiences" />
              <div className="pointer-events-none absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-1 text-[9.5px] text-ink-mute backdrop-blur-sm">
                Map data © OpenStreetMap contributors
              </div>
            </div>

            <p className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-ink-faint">
              <Icon name="info" size={11} className="mt-0.5 shrink-0" />
              Experience pin positions are offset from their station so that multiple listings at one stop remain
              visible. They indicate proximity, not precise venue coordinates.
            </p>
          </div>

          <aside className="space-y-3">
            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Category filter</p>
                {category && (
                  <button onClick={() => setCategory(null)} className="text-[10px] font-bold text-royal">Clear</button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button key={c.id} onClick={() => setCategory(c.id === category ? null : c.id)}
                    className={clsx('chip !text-[11px]', category === c.id && 'chip-active')}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                {filtered.length} experiences
              </p>
              <div className="max-h-[380px] space-y-1.5 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="py-6 text-center text-[11.5px] text-ink-faint">No listings match these filters.</p>
                ) : (
                  filtered.map((e) => (
                    <Link key={e.id} to={`/experiences/${e.id}`}
                      onMouseEnter={() => setSelected(e.id)}
                      className="flex items-center gap-2 rounded-lg border border-line p-1.5 transition-colors hover:border-navy-200 hover:bg-navy-50/40">
                      <div className="h-8 w-10 shrink-0 overflow-hidden rounded bg-navy-900">
                        <Scene seed={e.id} category={e.category} className="h-full w-full" variant="thumb" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-bold text-navy">{e.title}</p>
                        <p className="text-[9.5px] text-ink-faint">{stationById(e.stationId)?.name} · {money(e.price)}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {selectedExp && (
              <div className="rounded-2xl border border-royal-200 bg-royal-50/50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-royal">Highlighted</p>
                <p className="mt-1 text-[12px] font-bold text-navy">{selectedExp.title}</p>
                <Link to={`/experiences/${selectedExp.id}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-royal">
                  Open listing <Icon name="arrow-right" size={11} />
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

export function OperatorProfile() {
  const params = useParams()
  const exps = usePublishedExperiences()
  const opId = params.slug ?? params.id
  const all = exps.concat([])
  const operator = opId ? operatorById(opId) : undefined
  const listings = operator ? all.filter((e) => e.operatorId === operator.id) : []
  const station = operator ? stationById(operator.stationId) : null

  if (!operator) {
    return (
      <div className="shell py-20">
        <EmptyState icon="store" title="Operator not found" body="This demo operator does not exist in the dataset." action={<Link to="/explore" className="btn btn-primary btn-md">Browse experiences</Link>} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="relative overflow-hidden bg-navy-900">
        <Scene seed={operator.id} category="workshops" className="absolute inset-0 h-full w-full opacity-25" variant="hero" motif="loom" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/50" />
        <div className="shell relative py-10">
          <nav className="mb-4 flex items-center gap-1.5 text-[11.5px] text-white/40" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <Icon name="chevron-right" size={11} />
            <Link to="/explore" className="hover:text-white/70">Explore</Link>
            <Icon name="chevron-right" size={11} />
            <span className="text-white/70">{operator.name}</span>
          </nav>

          <div className="flex flex-wrap items-start gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-[17px] font-extrabold text-navy">
              {operator.logoAdopt}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[24px] font-extrabold text-white sm:text-[32px]">{operator.name}</h1>
                <span className="rounded-md bg-emerald2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Verified
                </span>
              </div>
              <p className="mt-1 text-[12.5px] text-white/55">
                {operator.category} · {operator.town} · {listings.length} listings · member since {operator.joined.slice(0, 4)}
              </p>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-white/70">{operator.description}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              ['Listings', listings.length],
              ['Reviews', operator.reviewCount],
              ['Rating', operator.rating || '—'],
              ['Station', station?.name ?? '—'],
            ].map(([l, v]) => (
              <div key={l as string} className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2">
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-white/40">{l}</p>
                <p className="mt-0.5 text-[14px] font-extrabold text-white">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shell py-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-extrabold">Experiences by {operator.name}</h2>
          <DemoTag label="Demo operator" />
        </div>

        {listings.length === 0 ? (
          <EmptyState icon="package-x" title="No published listings" body="This operator has no verified public listings right now." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((e) => (
              <Link key={e.id} to={`/experiences/${e.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift">
                <div className="relative h-[136px] overflow-hidden bg-navy-900">
                  <Scene seed={e.id} category={e.category} className="h-full w-full transition-transform duration-500 group-hover:scale-105" variant="thumb" />
                </div>
                <div className="flex flex-1 flex-col p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-royal">{CATEGORIES.find((c) => c.id === e.category)?.label}</p>
                  <h3 className="mt-0.5 line-clamp-2 text-[13.5px] font-bold leading-snug text-navy group-hover:text-royal">{e.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-mute">{e.summary}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-2.5">
                    <span className="text-[10.5px] text-ink-faint num">{hoursLabel(e.durationMins)}</span>
                    <span className="text-[13px] font-extrabold text-navy num">{money(e.price)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-line bg-white p-4">
          <div className="flex items-start gap-2.5">
            <Icon name="shield-check" size={15} className="mt-0.5 shrink-0 text-emerald2-600" />
            <div>
              <p className="text-[12px] font-bold text-navy">About this verification</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-mute">
                This operator profile is a demonstration record created for the JOHOR360 mockup. In production,
                verification would confirm business registration (SSM), public liability cover and an accessibility
                statement — not a quality endorsement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
