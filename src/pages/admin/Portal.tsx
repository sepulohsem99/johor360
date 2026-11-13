import { useMemo, useState } from 'react'
import { usePrefs } from '../../app/prefs'
import { T } from '../../components/ui/T'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../../components/ui/Icon'
import { Button, DemoTag, EmptyState, Field, Meter, Modal, Stat, Stars, VerificationBadge } from '../../components/ui'
import Scene from '../../components/art/Scene'
import { useApp } from '../../app/store'
import { operatorById } from '../../data/operators'
import { stationById, CORRIDOR, STATIONS } from '../../data/stations'
import { CATEGORIES } from '../../data/taxonomy'
import { hoursLabel, money, dateLabel, timeAgo } from '../../services/storage'
import { useMoneyText } from '../../app/currency'

// ------------------------------------------------------------------ Dashboard
export function AdminDashboard() {
  const { tx } = usePrefs()
  const { experiences, operators, enquiries, reviews, events } = useApp()
  const pending = experiences.filter((e) => e.verification === 'pending')
  const verified = experiences.filter((e) => e.verification === 'verified')
  const flaggedReviews = reviews.filter((r) => r.status === 'pending')
  const newEnq = enquiries.filter((e) => e.status === 'new')

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold">Platform overview</h1>
          <p className="mt-1 text-[13px] text-ink-mute"><T>Content operations, verification queue and platform health.</T></p>
        </div>
        <DemoTag label="Simulated metrics" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={tx("Operators")} value={operators.length} icon="store" tone="navy" hint={`${operators.filter((o) => o.verification === 'verified').length} verified`} />
        <Stat label={tx("Experiences")} value={experiences.length} icon="package" tone="royal" hint={`${verified.length} published`} />
        <Stat label={tx("Pending review")} value={pending.length} icon="clipboard-check" tone="gold" hint="awaiting verification" />
        <Stat label={tx("New enquiries")} value={newEnq.length} icon="message-square" tone="johor" hint="across all operators" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_330px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-raised p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[14px] font-extrabold">Verification queue</h2>
              <Link to="/admin/verifications" className="text-[11px] font-bold text-royal"><T>Open queue</T></Link>
            </div>
            {pending.length === 0 ? (
              <p className="rounded-xl bg-canvas px-3 py-6 text-center text-[12px] text-ink-faint"><T>Queue is clear.</T></p>
            ) : (
              <div className="space-y-2">
                {pending.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-xl border border-gold-200 bg-gold-50/40 p-2.5">
                    <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-navy-900">
                      <Scene seed={e.id} category={e.category} className="h-full w-full" variant="thumb" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-bold text-navy">{e.title}</p>
                      <p className="text-[10.5px] text-ink-faint">
                        {operatorById(e.operatorId)?.name} · submitted {e.createdAt ? timeAgo(e.createdAt) : 'recently'}
                      </p>
                    </div>
                    <Link to="/admin/verifications" className="shrink-0 rounded-lg bg-gold px-2 py-1 text-[10.5px] font-bold text-navy"><T>Review</T></Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-raised p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[14px] font-extrabold">Recent activity</h2>
              <DemoTag label="Audit log" />
            </div>
            <div className="space-y-2">
              {events.slice(0, 6).map((ev) => (
                <div key={ev.id} className="flex items-start gap-2.5">
                  <span className={clsx('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white',
                    ev.action === 'approved' ? 'bg-emerald2' : ev.action === 'rejected' ? 'bg-johor' : ev.action === 'changes_requested' ? 'bg-gold' : 'bg-royal')}>
                    <Icon name={ev.action === 'approved' ? 'check' : ev.action === 'rejected' ? 'x' : ev.action === 'changes_requested' ? 'alert-circle' : 'upload'} size={11} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] font-semibold text-navy capitalize">{ev.action.replace('_', ' ')}</p>
                    <p className="text-[10.5px] leading-snug text-ink-mute">{ev.note}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-faint">{ev.actor} · {timeAgo(ev.at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl border border-line bg-raised p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Needs attention</p>
            <div className="mt-2.5 space-y-2">
              {[
                { l: 'Pending verifications', n: pending.length, to: '/admin/verifications', t: 'gold' },
                { l: 'Reviews awaiting moderation', n: flaggedReviews.length, to: '/admin/reviews', t: 'royal' },
                { l: 'Operators with changes requested', n: operators.filter((o) => o.verification === 'changes_requested').length, to: '/admin/operators', t: 'johor' },
              ].map((r) => (
                <Link key={r.l} to={r.to} className="flex items-center justify-between rounded-lg border border-line px-2.5 py-2 transition-colors hover:border-navy-200">
                  <span className="text-[11.5px] text-ink-soft"><T>{r.l}</T></span>
                  <span className={clsx('rounded px-1.5 py-0.5 text-[10px] font-bold text-white',
                    r.t === 'gold' ? 'bg-gold' : r.t === 'johor' ? 'bg-johor' : 'bg-royal')}>{r.n}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-raised p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Corridor coverage</p>
            <div className="mt-2.5 space-y-1.5">
              {CORRIDOR.map((s) => {
                const n = experiences.filter((e) => e.stationId === s.id && e.verification === 'verified').length
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <span className="w-[68px] shrink-0 truncate text-[10.5px] text-ink-mute">{s.name}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-100">
                      <div className={clsx('h-full rounded-full', n === 0 ? 'bg-johor' : 'bg-emerald2')} style={{ width: `${Math.min(100, n * 20)}%` }} />
                    </div>
                    <span className={clsx('w-3 text-right text-[10px] font-bold num', n === 0 ? 'text-johor' : 'text-navy')}>{n}</span>
                  </div>
                )
              })}
            </div>
            <p className="mt-2 text-[9.5px] leading-relaxed text-ink-faint">
              Red bars are stations with no published operator — the coverage gap the platform exists to close.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Verifications
export function AdminVerifications() {
  const { tx } = usePrefs()
  const money = useMoneyText()
  const { experiences, setExperienceStatus, toast, events } = useApp()
  const [active, setActive] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [tab, setTab] = useState<'pending' | 'all'>('pending')

  const queue = tab === 'pending'
    ? experiences.filter((e) => e.verification === 'pending')
    : experiences.filter((e) => e.verification !== 'verified')

  const exp = experiences.find((e) => e.id === active)
  const op = exp ? operatorById(exp.operatorId) : null

  const act = (status: 'verified' | 'rejected' | 'changes_requested') => {
    if (!exp) return
    setExperienceStatus(exp.id, status, note || (
      status === 'verified' ? 'Listing approved and published to visitor discovery.' :
      status === 'rejected' ? 'Listing rejected — see operator correspondence.' :
      'Changes requested before publication.'
    ))
    const msg = status === 'verified' ? 'Listing approved' : status === 'rejected' ? 'Listing rejected' : 'Changes requested'
    toast(msg, status === 'verified' ? '“' + exp.title + '” is now visible in visitor discovery.' : exp.title, status === 'verified' ? 'success' : 'info')
    setActive(null)
    setNote('')
  }

  const history = exp ? events.filter((e) => e.experienceId === exp.id) : []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold">Listing verification</h1>
          <p className="mt-1 text-[13px] text-ink-mute"><T>Approve listings to make them visible in visitor discovery.</T></p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setTab('pending')} className={clsx('chip', tab === 'pending' && 'chip-active')}>
            <T>Pending</T> <span className="num opacity-60">{experiences.filter((e) => e.verification === 'pending').length}</span>
          </button>
          <button onClick={() => setTab('all')} className={clsx('chip', tab === 'all' && 'chip-active')}>
            <T>All unresolved</T> <span className="num opacity-60">{experiences.filter((e) => e.verification !== 'verified').length}</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-royal-200 bg-royal-50/60 px-3.5 py-2.5">
        <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-navy-700">
          <Icon name="info" size={13} className="mt-0.5 shrink-0 text-royal" />
          Approving a listing here updates the shared demo state. Switch to the Visitor role afterwards and search
          that station — the listing will appear in discovery, matching and the station page.
        </p>
      </div>

      {queue.length === 0 ? (
        <EmptyState icon="check-circle-2" title={tx("Queue is clear")} body={tx("No listings are awaiting verification. New SME submissions will appear here.")} action={<Link to="/sme/listings/new" className="btn btn-ghost btn-md">Create a test listing</Link>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {queue.map((e) => {
            const o = operatorById(e.operatorId)
            return (
              <div key={e.id} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-raised">
                <div className="relative h-[104px] bg-navy-900">
                  <Scene seed={e.id} category={e.category} className="h-full w-full" variant="thumb" />
                  <div className="absolute right-2 top-2"><VerificationBadge status={e.verification} size="xs" /></div>
                </div>
                <div className="flex flex-1 flex-col p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-royal">
                    {CATEGORIES.find((c) => c.id === e.category)?.label}
                  </p>
                  <h3 className="mt-0.5 line-clamp-2 text-[13.5px] font-bold leading-snug text-navy">{e.title}</h3>
                  <p className="mt-1 text-[10.5px] text-ink-mute">{o?.name} · {e.town}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-ink-faint">
                    <span className="num">{money(e.price)}</span>
                    <span>·</span>
                    <span className="num">{hoursLabel(e.durationMins)}</span>
                    <span>·</span>
                    <span className="num">max {e.capacity}</span>
                  </div>
                  <div className="mt-auto flex gap-1.5 pt-3">
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => setActive(e.id)}>Inspect</Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!exp} onClose={() => { setActive(null); setNote('') }} title="Inspect listing" width="max-w-2xl"
        footer={exp && (
          <>
            <Button variant="quiet" size="sm" onClick={() => { setActive(null); setNote('') }}><T>Cancel</T></Button>
            <Button variant="danger" size="sm" icon="x" onClick={() => act('rejected')}>Reject</Button>
            <Button variant="ghost" size="sm" icon="alert-circle" onClick={() => act('changes_requested')}>Request changes</Button>
            <Button size="sm" icon="check" onClick={() => act('verified')}>Approve</Button>
          </>
        )}>
        {exp && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl bg-navy-900">
              <div className="h-[132px]"><Scene seed={exp.id} category={exp.category} className="h-full w-full" variant="thumb" /></div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-royal">
                {CATEGORIES.find((c) => c.id === exp.category)?.label} · {stationById(exp.stationId)?.name}
              </p>
              <p className="mt-0.5 text-[16px] font-extrabold text-navy">{exp.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-mute">{exp.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ['Price', money(exp.price)], ['Duration', hoursLabel(exp.durationMins)],
                ['Capacity', `${exp.capacity}`], ['Intensity', exp.intensity],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-canvas px-2 py-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-ink-faint">{l}</p>
                  <p className="mt-0.5 text-[11.5px] font-bold capitalize text-navy">{v}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-line p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint"><T>Operator</T></p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-[10px] font-bold text-white">{op?.logoAdopt}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-bold text-navy">{op?.name}</p>
                  <p className="text-[10px] text-ink-faint">{op?.operatorName} · {op?.email}</p>
                </div>
                <VerificationBadge status={op?.verification ?? 'pending'} size="xs" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {op?.documents.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1 rounded bg-emerald2-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald2-700">
                    <Icon name="file-text" size={9} /> {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-line p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Accessibility declaration</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {[
                  ['Wheelchair', exp.accessibility.wheelchair],
                  ['Step-free', exp.accessibility.stepFree],
                  ['Seated option', exp.accessibility.seatedOption],
                ].map(([l, v]) => (
                  <span key={l as string} className={clsx('rounded px-1.5 py-0.5 text-[9.5px] font-bold',
                    v ? 'bg-emerald2-50 text-emerald2-700' : 'bg-johor-50 text-johor-700')}>
                    {l}: {v ? 'Yes' : 'No'}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-mute">{exp.accessibility.notes}</p>
            </div>

            <div className="rounded-xl border border-line p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Description</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{exp.description}</p>
            </div>

            {history.length > 0 && (
              <div className="rounded-xl bg-canvas p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Verification history</p>
                <div className="mt-1.5 space-y-1">
                  {history.map((h) => (
                    <p key={h.id} className="text-[10.5px] text-ink-mute">
                      <span className="font-bold capitalize text-navy">{h.action.replace('_', ' ')}</span> · {h.actor} · {timeAgo(h.at)}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <Field label={tx("Reviewer note (optional)")} hint={tx("Recorded in the audit log and shown to the operator.")}>
              <textarea className="field field-area" rows={2} value={note} onChange={(e) => setNote(e.target.value)}
                placeholder={tx("Accessibility statement verified against photographs. Approved for publication.")} />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ------------------------------------------------------------------ Operators
export function AdminOperators() {
  const { tx } = usePrefs()
  const { operators, experiences } = useApp()
  const [q, setQ] = useState('')

  const list = operators.filter((o) =>
    !q.trim() || o.name.toLowerCase().includes(q.toLowerCase()) || o.town.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold"><T>Operators</T></h1>
          <p className="mt-1 text-[13px] text-ink-mute">{operators.length} registered · {operators.filter((o) => o.verification === 'verified').length} verified</p>
        </div>
        <input className="field !h-9 !w-auto !text-[12px]" placeholder={tx("Search operators…")} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-raised">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-line bg-canvas text-[10px] uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-2.5 font-bold"><T>Operator</T></th>
                <th className="px-4 py-2.5 font-bold">Category</th>
                <th className="px-4 py-2.5 font-bold"><T>Station</T></th>
                <th className="px-4 py-2.5 font-bold">Listings</th>
                <th className="px-4 py-2.5 font-bold">Rating</th>
                <th className="px-4 py-2.5 font-bold"><T>Status</T></th>
                <th className="px-4 py-2.5 font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => {
                const n = experiences.filter((e) => e.operatorId === o.id).length
                return (
                  <tr key={o.id} className="border-b border-line text-[11.5px] last:border-0 hover:bg-navy-50/40">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy text-[9px] font-bold text-white">{o.logoAdopt}</span>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-navy">{o.name}</p>
                          <p className="text-[10px] text-ink-faint">{o.operatorName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-ink-mute">{o.category}</td>
                    <td className="px-4 py-2.5 text-ink-mute">{stationById(o.stationId)?.name}</td>
                    <td className="px-4 py-2.5 font-bold text-navy num">{n}</td>
                    <td className="px-4 py-2.5"><Stars value={o.rating} size={10} /></td>
                    <td className="px-4 py-2.5"><VerificationBadge status={o.verification} size="xs" /></td>
                    <td className="px-4 py-2.5">
                      <Link to={`/operators/${o.id}`} className="text-[10.5px] font-bold text-royal hover:underline">View</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Experiences
export function AdminExperiences() {
  const { tx } = usePrefs()
  const money = useMoneyText()
  const { experiences, setExperienceStatus, toast } = useApp()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<string>('all')
  const nav = useNavigate()

  const list = experiences.filter((e) => {
    if (status !== 'all' && e.verification !== status) return false
    if (q.trim() && !e.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold"><T>Experience management</T></h1>
          <p className="mt-1 text-[13px] text-ink-mute">{experiences.length} listings across {STATIONS.length} stations</p>
        </div>
        <div className="flex gap-2">
          <input className="field !h-9 !w-auto !text-[12px]" placeholder={tx("Search listings…")} value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="field !h-9 !w-auto !py-0 !text-[12px]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all"><T>All statuses</T></option>
            <option value="verified"><T>Verified</T></option>
            <option value="pending"><T>Pending</T></option>
            <option value="draft">Draft</option>
            <option value="changes_requested">Changes requested</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState icon="search-x" title={tx("No listings match")} body={tx("Try clearing the search or status filter.")} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-raised">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead>
                <tr className="border-b border-line bg-canvas text-[10px] uppercase tracking-wider text-ink-faint">
                  <th className="px-4 py-2.5 font-bold">Listing</th>
                  <th className="px-4 py-2.5 font-bold"><T>Operator</T></th>
                  <th className="px-4 py-2.5 font-bold"><T>Station</T></th>
                  <th className="px-4 py-2.5 font-bold"><T>Price</T></th>
                  <th className="px-4 py-2.5 font-bold">Views</th>
                  <th className="px-4 py-2.5 font-bold"><T>Status</T></th>
                  <th className="px-4 py-2.5 font-bold"><T>Action</T></th>
                </tr>
              </thead>
              <tbody>
                {list.slice(0, 40).map((e) => (
                  <tr key={e.id} className="border-b border-line text-[11.5px] last:border-0 hover:bg-navy-50/40">
                    <td className="px-4 py-2.5">
                      <p className="max-w-[220px] truncate font-bold text-navy">{e.title}</p>
                      <p className="text-[10px] text-ink-faint">{CATEGORIES.find((c) => c.id === e.category)?.label}</p>
                    </td>
                    <td className="px-4 py-2.5 text-ink-mute">{operatorById(e.operatorId)?.name}</td>
                    <td className="px-4 py-2.5 text-ink-mute">{stationById(e.stationId)?.name}</td>
                    <td className="px-4 py-2.5 text-ink-mute num">{money(e.price)}</td>
                    <td className="px-4 py-2.5 text-ink-mute num">{e.views}</td>
                    <td className="px-4 py-2.5"><VerificationBadge status={e.verification} size="xs" /></td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1.5">
                        <button onClick={() => nav(`/experiences/${e.id}`)} className="text-[10.5px] font-bold text-royal hover:underline">View</button>
                        {e.verification !== 'verified' ? (
                          <button onClick={() => { setExperienceStatus(e.id, 'verified', 'Approved from experience management.'); toast('Approved', e.title, 'success') }}
                            className="text-[10.5px] font-bold text-emerald2-700 hover:underline">Approve</button>
                        ) : (
                          <button onClick={() => { setExperienceStatus(e.id, 'changes_requested', 'Unpublished for review from experience management.'); toast('Unpublished', e.title, 'info') }}
                            className="text-[10.5px] font-bold text-johor hover:underline">Unpublish</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ Reviews
export function AdminReviews() {
  const { tx } = usePrefs()
  const { reviews, experiences, moderateReview, toast } = useApp()
  const [filter, setFilter] = useState<'pending' | 'published' | 'all'>('pending')

  const list = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold"><T>Review moderation</T></h1>
          <p className="mt-1 text-[13px] text-ink-mute">{reviews.filter((r) => r.status === 'pending').length} awaiting moderation</p>
        </div>
        <div className="flex gap-1.5">
          {(['pending', 'published', 'all'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={clsx('chip capitalize', filter === f && 'chip-active')}>
              {f} <span className="num opacity-60">{f === 'all' ? reviews.length : reviews.filter((r) => r.status === f).length}</span>
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState icon="message-square" title={tx("Nothing to moderate")} body={tx("New visitor reviews appear here before publishing.")} />
      ) : (
        <div className="space-y-2">
          {list.map((r) => (
            <div key={r.id} className="rounded-2xl border border-line bg-raised p-3.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-100 text-[10.5px] font-bold text-navy-600">
                    {r.authorName.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[12.5px] font-bold text-navy">{r.authorName}</p>
                    <p className="text-[10px] text-ink-faint">{r.authorOrigin} · {dateLabel(r.date)} · {r.purpose}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Stars value={r.rating} size={11} />
                  <span className={clsx('rounded px-1.5 py-0.5 text-[9.5px] font-bold uppercase',
                    r.status === 'pending' ? 'bg-gold-100 text-gold-800' : r.status === 'published' ? 'bg-emerald2-50 text-emerald2-700' : 'bg-johor-50 text-johor-700')}>
                    {r.status}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">{r.body}</p>
              <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
                <p className="truncate text-[10px] text-ink-faint">{experiences.find((e) => e.id === r.experienceId)?.title}</p>
                <div className="flex gap-1.5">
                  {r.status !== 'published' && (
                    <Button size="sm" variant="ghost" onClick={() => { moderateReview(r.id, 'published'); toast('Review published', r.authorName, 'success') }}>Publish</Button>
                  )}
                  {r.status !== 'flagged' && (
                    <Button size="sm" variant="danger" onClick={() => { moderateReview(r.id, 'flagged'); toast('Review flagged', r.authorName, 'info') }}>Flag</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ Analytics
export function AdminAnalytics() {
  const { tx } = usePrefs()
  const { experiences, enquiries, reviews } = useApp()

  const purposeDist = [
    { l: 'Leisure', v: 46, c: 'bg-johor' },
    { l: 'Business', v: 27, c: 'bg-royal' },
    { l: 'Education', v: 17, c: 'bg-gold' },
    { l: 'Medical', v: 10, c: 'bg-emerald2' },
  ]

  const stationInterest = CORRIDOR.map((s) => ({
    s,
    n: experiences.filter((e) => e.stationId === s.id).length * 12 + (s.id === 'jb-sentral' ? 60 : 0),
  })).sort((a, b) => b.n - a.n)

  const maxStation = Math.max(...stationInterest.map((x) => x.n), 1)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold">Visitor insights</h1>
          <p className="mt-1 text-[13px] text-ink-mute"><T>Distribution of visitor intent across purpose, station and category.</T></p>
        </div>
        <DemoTag label="Simulated analytics" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Sessions" value="412" icon="activity" tone="royal" hint="simulated discovery sessions" />
        <Stat label="Itineraries generated" value="187" icon="route" tone="emerald2" hint="45% of sessions" />
        <Stat label={tx("Enquiries sent")} value={enquiries.length + 96} icon="message-square" tone="gold" hint="to small operators" />
        <Stat label="Avg session" value="6m 40s" icon="clock" tone="navy" hint="simulated engagement" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-raised p-4">
          <p className="text-[12px] font-bold text-navy">Visitor purpose distribution</p>
          <div className="mt-4 space-y-3">
            {purposeDist.map((p) => (
              <div key={p.l}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-ink-mute">{p.l}</span><span className="font-bold text-navy num">{p.v}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-navy-100">
                  <div className={clsx('h-full rounded-full', p.c)} style={{ width: `${p.v}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-navy-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-navy-600">
            Leisure dominates volume, but business and medical travellers convert to enquiries at 2.1× the rate —
            they have fixed windows and need a plan.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-raised p-4">
          <p className="text-[12px] font-bold text-navy">Most explored stations</p>
          <div className="mt-3 space-y-2">
            {stationInterest.map(({ s, n }) => (
              <div key={s.id} className="flex items-center gap-2">
                <span className="w-[64px] shrink-0 truncate text-[10.5px] text-ink-mute">{s.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-100">
                  <div className={clsx('h-full rounded-full', s.id === 'jb-sentral' ? 'bg-johor' : 'bg-royal')} style={{ width: `${(n / maxStation) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-[10px] font-bold text-navy num">{n}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            JB Sentral is deliberately included as the baseline. The platform's value shows up in the bars beneath it.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-raised p-4">
        <p className="text-[12px] font-bold text-navy">Category interest</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.slice(0, 10).map((c, i) => {
            const n = experiences.filter((e) => e.category === c.id).length
            return (
              <div key={c.id} className="rounded-xl border border-line px-2.5 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-semibold text-ink-soft">{c.label}</span>
                  <span className="text-[10px] font-bold text-navy num">{n}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-navy-100">
                  <div className="h-full rounded-full bg-royal" style={{ width: `${Math.min(100, n * 18 + (i % 3) * 10)}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Impact
export function AdminImpact() {
  const { tx } = usePrefs()
  const { experiences, enquiries, operators, reviews } = useApp()
  const verified = experiences.filter((e) => e.verification === 'verified')
  const beyondJB = verified.filter((e) => e.stationId !== 'jb-sentral')
  const shareBeyond = verified.length ? Math.round((beyondJB.length / verified.length) * 100) : 0

  const stationData = useMemo(() => {
    return CORRIDOR.map((s) => {
      const list = verified.filter((e) => e.stationId === s.id)
      const enq = enquiries.filter((q) => list.some((l) => l.id === q.experienceId))
      return { station: s, operators: new Set(list.map((l) => l.operatorId)).size, listings: list.length, enquiries: enq.length }
    })
  }, [verified, enquiries])

  const totalEnq = enquiries.length
  const beyondEnq = enquiries.filter((q) => {
    const e = experiences.find((x) => x.id === q.experienceId)
    return e && e.stationId !== 'jb-sentral'
  }).length
  const beyondPct = totalEnq ? Math.round((beyondEnq / totalEnq) * 100) : 0

  const smallOps = operators.filter((o) => o.verification === 'verified').length

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold">Economic discovery impact</h1>
          <p className="mt-1 text-[13px] text-ink-mute"><T>The metrics that show whether attention is actually moving outside the city.</T></p>
        </div>
        <DemoTag label="Simulated data" />
      </div>

      {/* headline */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-5 sm:p-6">
        <Scene seed="impact" category="agriculture" className="absolute inset-0 h-full w-full opacity-20" variant="hero" motif="rails" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-transparent" />
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Headline metric</p>
          <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
            <p className="text-[44px] font-extrabold leading-none text-white num">{beyondPct}%</p>
            <p className="pb-1.5 max-w-md text-[13px] leading-relaxed text-white/65">
              of all visitor enquiries in this demo dataset went to an operator <strong className="text-white">outside JB Sentral</strong>.
              That is the number JOHOR360 exists to move.
            </p>
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-4">
            {[
              ['Published listings', verified.length],
              ['Beyond JB Sentral', beyondJB.length],
              ['Verified operators', smallOps],
              ['Total enquiries', totalEnq],
            ].map(([l, v]) => (
              <div key={l as string} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-white/45">{l}</p>
                <p className="mt-1 text-[22px] font-extrabold leading-none text-gold num">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* station distribution */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-line bg-raised p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] font-bold text-navy">SME discovery & enquiries by station</p>
            <DemoTag label={tx("Per station")} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px] text-left">
              <thead>
                <tr className="border-b border-line text-[9.5px] uppercase tracking-wider text-ink-faint">
                  <th className="pb-2 font-bold"><T>Station</T></th>
                  <th className="pb-2 font-bold"><T>Operators</T></th>
                  <th className="pb-2 font-bold">Listings</th>
                  <th className="pb-2 font-bold"><T>Enquiries</T></th>
                  <th className="pb-2 font-bold">Share</th>
                </tr>
              </thead>
              <tbody>
                {stationData.map(({ station, operators: o, listings: l, enquiries: e }) => (
                  <tr key={station.id} className="border-b border-line last:border-0">
                    <td className="py-1.5 text-[11px] font-semibold text-navy">{station.name}</td>
                    <td className="py-1.5 text-[11px] text-ink-mute num">{o}</td>
                    <td className="py-1.5 text-[11px] text-ink-mute num">{l}</td>
                    <td className="py-1.5 text-[11px] font-bold text-navy num">{e}</td>
                    <td className="py-1.5">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-navy-100">
                        <div className={clsx('h-full rounded-full', station.id === 'jb-sentral' ? 'bg-johor' : 'bg-emerald2')}
                          style={{ width: `${totalEnq ? (e / totalEnq) * 100 : 0}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-line bg-raised p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint"><T>Enquiry conversion</T></p>
            <div className="mt-2 space-y-2.5">
              {[
                ['Sent to operator', totalEnq, 'royal'],
                ['Responded', enquiries.filter((e) => e.status === 'responded').length, 'emerald2'],
                ['Closed', enquiries.filter((e) => e.status === 'closed').length, 'navy'],
                ['Awaiting reply', enquiries.filter((e) => e.status === 'new').length, 'johor'],
              ].map(([l, v, t]) => (
                <div key={l as string}>
                  <div className="mb-1 flex justify-between text-[10.5px]">
                    <span className="text-ink-mute">{l}</span>
                    <span className="font-bold text-navy num">{v}</span>
                  </div>
                  <Meter value={totalEnq ? ((v as number) / totalEnq) * 100 : 0} tone={t as string} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-raised p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint"><T>Distribution of discovery</T></p>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full">
              <div className="bg-emerald2" style={{ width: `${shareBeyond}%` }} />
              <div className="bg-johor" style={{ width: `${100 - shareBeyond}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[10px]">
              <span className="flex items-center gap-1 text-emerald2-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald2" /> Beyond JB ({shareBeyond}%)</span>
              <span className="flex items-center gap-1 text-johor"><span className="h-1.5 w-1.5 rounded-full bg-johor" /> JB Sentral ({100 - shareBeyond}%)</span>
            </div>
            <p className="mt-2.5 text-[10.5px] leading-relaxed text-ink-mute">
              Based on published listings, not sessions. Station-level intent is tracked separately in Visitor
              insights.
            </p>
          </div>
        </div>
      </div>

      {/* what this proves */}
      <div className="rounded-2xl border border-emerald2-200 bg-emerald2-50/50 p-4">
        <p className="text-[12px] font-bold text-emerald2-900"><T>What this dashboard is designed to prove</T></p>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {[
            ['Attention moves out of the city', 'Share of enquiries to operators outside JB Sentral — the core distribution claim.'],
            ['Small operators get found', 'Verified operators with ten or fewer staff receiving at least one enquiry.'],
            ['Discovery converts', 'Enquiry rate per listing view, not raw impressions.'],
            ['Coverage gaps are visible', 'Stations with zero published operators are reported as zero, not hidden.'],
          ].map(([t, d]) => (
            <div key={t} className="flex items-start gap-2 rounded-lg bg-white/70 px-2.5 py-2">
              <Icon name="check" size={12} strokeWidth={3} className="mt-0.5 shrink-0 text-emerald2-600" />
              <div>
                <p className="text-[11px] font-bold text-navy">{t}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-ink-mute">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-[10px] leading-relaxed text-ink-faint">
          All figures on this page are simulated demonstration data derived from the mockup dataset. They are not
          measured real-world outcomes.
        </p>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Settings
export function AdminSettings() {
  const { toast } = useApp()
  const [toggles, setToggles] = useState({
    autoVerify: false, requireDocs: true, allowReviews: true,
    showUnverified: false, rainScenario: true, publicImpact: false,
  })

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-[24px] font-extrabold">Platform settings</h1>
        <p className="mt-1 text-[13px] text-ink-mute"><T>Configuration for the demo environment. Changes are local only.</T></p>
      </div>

      <div className="rounded-2xl border border-line bg-raised p-5">
        <p className="text-[13px] font-extrabold">Verification policy</p>
        <div className="mt-3 space-y-2">
          {[
            ['autoVerify', 'Auto-verify operators with complete documents', 'Skips manual review when all required files are present.'],
            ['requireDocs', 'Require supporting documents before submission', 'SSM registration, safety documentation and accessibility statement.'],
            ['showUnverified', 'Allow unverified listings to appear in search', 'Off by default — unverified listings never enter visitor discovery.'],
          ].map(([k, t, d]) => (
            <label key={k} className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <div>
                <p className="text-[12px] font-bold text-navy">{t}</p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-ink-mute">{d}</p>
              </div>
              <button
                onClick={() => { setToggles({ ...toggles, [k]: !toggles[k as keyof typeof toggles] }); toast('Setting updated', t, 'info') }}
                role="switch"
                aria-checked={toggles[k as keyof typeof toggles]}
                className={clsx('relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors',
                  toggles[k as keyof typeof toggles] ? 'bg-emerald2' : 'bg-navy-200')}
              >
                <span className={clsx('absolute top-0.5 h-4 w-4 rounded-full bg-raised shadow transition-transform',
                  toggles[k as keyof typeof toggles] ? 'translate-x-[18px]' : 'translate-x-0.5')} />
              </button>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-raised p-5">
        <p className="text-[13px] font-extrabold">Content & features</p>
        <div className="mt-3 space-y-2">
          {[
            ['allowReviews', 'Allow visitor review submission', 'Reviews enter moderation before publishing.'],
            ['rainScenario', 'Enable rain simulation in matching', 'Lets visitors see adaptive alternatives.'],
            ['publicImpact', 'Publish impact dashboard publicly', 'Currently admin-only during the competition.'],
          ].map(([k, t, d]) => (
            <label key={k} className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <div>
                <p className="text-[12px] font-bold text-navy">{t}</p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-ink-mute">{d}</p>
              </div>
              <button
                onClick={() => { setToggles({ ...toggles, [k]: !toggles[k as keyof typeof toggles] }); toast('Setting updated', t, 'info') }}
                role="switch"
                aria-checked={toggles[k as keyof typeof toggles]}
                className={clsx('relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors',
                  toggles[k as keyof typeof toggles] ? 'bg-emerald2' : 'bg-navy-200')}
              >
                <span className={clsx('absolute top-0.5 h-4 w-4 rounded-full bg-raised shadow transition-transform',
                  toggles[k as keyof typeof toggles] ? 'translate-x-[18px]' : 'translate-x-0.5')} />
              </button>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-raised p-5">
        <p className="text-[13px] font-extrabold">Data source register</p>
        <p className="mt-1 text-[11.5px] text-ink-mute"><T>Every external claim in the product traces to a source here.</T></p>
        <div className="mt-3 space-y-1.5">
          {[
            { n: 'ETS station names & order', s: 'KTMB route information', u: 'https://www.ktmb.com.my/', v: '2026-11-13' },
            { n: 'KL–JB ETS through-service', s: 'KTMB service announcement, Dec 2025', u: 'https://www.ktmb.com.my/', v: '2026-11-13' },
            { n: 'Map tiles', s: 'OpenStreetMap contributors', u: 'https://www.openstreetmap.org/copyright', v: '2026-11-13' },
          ].map((r) => (
            <div key={r.n} className="flex items-center justify-between rounded-lg border border-line px-2.5 py-2">
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-semibold text-navy">{r.n}</p>
                <p className="text-[10px] text-ink-faint">{r.s} · verified {r.v}</p>
              </div>
              <a href={r.u} target="_blank" rel="noreferrer noopener" className="shrink-0 text-[10.5px] font-bold text-royal hover:underline">Source</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
