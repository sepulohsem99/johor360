import { useMemo, useState } from 'react'
import { T } from '../../components/ui/T'
import { Link, useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../../components/ui/Icon'
import { Button, DemoTag, EmptyState, EnquiryBadge, Field, Meter, Modal, Stat, Stars, VerificationBadge } from '../../components/ui'
import Scene from '../../components/art/Scene'
import { useApp } from '../../app/store'
import { operatorById } from '../../data/operators'
import { stationById, STATIONS } from '../../data/stations'
import { CATEGORIES, TAGS } from '../../data/taxonomy'
import { hoursLabel, money, dateLabel, timeAgo } from '../../services/storage'
import { useMoneyText } from '../../app/currency'
import type { Experience, VerificationStatus } from '../../types'

/** Demo SME identity for the mockup — always the same operator so state is coherent. */
const DEMO_OPERATOR_ID = 'op-sri-kluang-batik'

export function useDemoOperator() {
  const { experiences, enquiries, reviews } = useApp()
  const operator = operatorById(DEMO_OPERATOR_ID)!
  const listings = experiences.filter((e) => e.operatorId === DEMO_OPERATOR_ID)
  const opsEnquiries = enquiries.filter((e) => e.operatorId === DEMO_OPERATOR_ID)
  const opsReviews = reviews.filter((r) => r.operatorId === DEMO_OPERATOR_ID)
  return { operator, listings, opsEnquiries, opsReviews }
}

// ------------------------------------------------------------------ Dashboard
export function SmeDashboard() {
  const money = useMoneyText()
  const nav = useNavigate()
  const { operator, listings, opsEnquiries, opsReviews } = useDemoOperator()
  const published = listings.filter((l) => l.verification === 'verified')
  const pending = opsEnquiries.filter((e) => e.status === 'new').length
  const totalViews = listings.reduce((s, l) => s + l.views, 0)
  const totalEnq = opsEnquiries.length
  const avgRating = opsReviews.length ? opsReviews.reduce((s, r) => s + r.rating, 0) / opsReviews.length : 0

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold">Welcome back, {operator.operatorName.split(' ')[0]}</h1>
          <p className="mt-1 text-[13px] text-ink-mute">
            {operator.name} · {operator.town} · nearest station {stationById(operator.stationId)?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon="eye" onClick={() => nav(`/operators/${operator.id}`)}><T>View public profile</T></Button>
          <Button size="sm" icon="plus" onClick={() => nav('/sme/listings/new')}><T>New listing</T></Button>
        </div>
      </div>

      <div className="rounded-xl border border-royal-200 bg-royal-50/60 px-3.5 py-2.5">
        <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-navy-700">
          <Icon name="info" size={13} className="mt-0.5 shrink-0 text-royal" />
          You are viewing the SME operator portal as a demo account. All metrics are simulated demonstration data and
          do not represent real business performance.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Listings" value={listings.length} icon="package" tone="navy" hint={`${published.length} published · ${listings.length - published.length} in review`} />
        <Stat label="New enquiries" value={pending} icon="message-square" tone="johor" hint={`${totalEnq} total received`} />
        <Stat label="Profile views" value={operator.profileViews.toLocaleString()} icon="eye" tone="royal" hint="last 30 days (simulated)" />
        <Stat label="Average rating" value={avgRating ? avgRating.toFixed(1) : '—'} icon="star" tone="gold" hint={`${opsReviews.length} demo reviews`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* listings */}
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[14px] font-extrabold"><T>Your listings</T></h2>
              <Link to="/sme/listings" className="text-[11px] font-bold text-royal"><T>Manage all</T></Link>
            </div>
            <div className="space-y-2">
              {listings.map((l) => (
                <Link key={l.id} to={`/sme/listings/${l.id}/edit`} className="flex items-center gap-3 rounded-xl border border-line p-2.5 transition-colors hover:border-navy-200">
                  <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-navy-900">
                    <Scene seed={l.id} category={l.category} className="h-full w-full" variant="thumb" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-navy">{l.title}</p>
                    <p className="text-[10.5px] text-ink-faint">{money(l.price)} · {hoursLabel(l.durationMins)} · {l.views} views</p>
                  </div>
                  <VerificationBadge status={l.verification} size="xs" />
                </Link>
              ))}
              {listings.length === 0 && <p className="py-6 text-center text-[12px] text-ink-faint"><T>No listings yet.</T></p>}
            </div>
          </div>

          {/* enquiries */}
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[14px] font-extrabold"><T>Recent enquiries</T></h2>
              <Link to="/sme/enquiries" className="text-[11px] font-bold text-royal"><T>View all</T></Link>
            </div>
            <div className="space-y-2">
              {opsEnquiries.slice(0, 4).map((e) => (
                <div key={e.id} className="rounded-xl border border-line p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold text-navy">{e.visitorName}</p>
                      <p className="text-[10px] text-ink-faint">{e.partySize} people · {dateLabel(e.date)} · {timeAgo(e.createdAt)}</p>
                    </div>
                    <EnquiryBadge status={e.status} />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-ink-mute">{e.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint"><T>Enquiry funnel</T></p>
            <div className="mt-3 space-y-2.5">
              {[
                ['Received', opsEnquiries.length, 'royal'],
                ['In review', opsEnquiries.filter((e) => e.status === 'in_review').length, 'gold'],
                ['Responded', opsEnquiries.filter((e) => e.status === 'responded').length, 'emerald2'],
                ['Closed', opsEnquiries.filter((e) => e.status === 'closed').length, 'navy'],
              ].map(([l, v, t]) => (
                <div key={l as string}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-ink-mute">{l}</span>
                    <span className="font-bold text-navy num">{v}</span>
                  </div>
                  <Meter value={opsEnquiries.length ? ((v as number) / opsEnquiries.length) * 100 : 0} tone={t as string} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Listing views</p>
            <div className="mt-3 space-y-2">
              {listings.slice(0, 4).map((l) => (
                <div key={l.id}>
                  <div className="mb-1 flex justify-between gap-2 text-[10.5px]">
                    <span className="truncate text-ink-mute">{l.title}</span>
                    <span className="shrink-0 font-bold text-navy num">{l.views}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-navy-100">
                    <div className="h-full rounded-full bg-royal" style={{ width: `${Math.min(100, (l.views / Math.max(1, totalViews)) * 100 * 2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-navy p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/45"><T>Next step</T></p>
            <p className="mt-1 text-[12.5px] font-bold text-white">
              {listings.some((l) => l.verification === 'pending') ? 'A listing is waiting for verification' : 'Respond to new enquiries'}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/55">
              {listings.some((l) => l.verification === 'pending')
                ? 'Your submission is in the admin queue. Average review time in this demo is 2 days.'
                : 'Fast replies are the single biggest factor in visitor conversion.'}
            </p>
            <Button size="sm" variant="ghost" className="mt-3 w-full !bg-white/10 !border-white/20 !text-white hover:!bg-white/15" onClick={() => nav('/sme/enquiries')}>
              <T>Open enquiries</T>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Listings
export function SmeListings() {
  const money = useMoneyText()
  const nav = useNavigate()
  const { listings } = useDemoOperator()
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('all')

  const shown = filter === 'all' ? listings : listings.filter((l) => l.verification === filter)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold">Listings</h1>
          <p className="mt-1 text-[13px] text-ink-mute">{listings.length} experiences · {listings.filter((l) => l.verification === 'verified').length} published</p>
        </div>
        <Button size="sm" icon="plus" onClick={() => nav('/sme/listings/new')}>Create listing</Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[
          { id: 'all' as const, label: 'All', n: listings.length },
          { id: 'verified' as const, label: 'Published', n: listings.filter((l) => l.verification === 'verified').length },
          { id: 'pending' as const, label: 'Pending', n: listings.filter((l) => l.verification === 'pending').length },
          { id: 'changes_requested' as const, label: 'Changes requested', n: listings.filter((l) => l.verification === 'changes_requested').length },
          { id: 'draft' as const, label: 'Draft', n: listings.filter((l) => l.verification === 'draft').length },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={clsx('chip', filter === f.id && 'chip-active')}>
            {f.label} <span className="num opacity-60">{f.n}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState icon="package" title="No listings in this state" body="Try a different filter, or create a new experience listing." action={<Button onClick={() => nav('/sme/listings/new')} icon="plus">Create listing</Button>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((l) => (
            <div key={l.id} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:border-navy-200 hover:shadow-card">
              <div className="relative h-[110px] overflow-hidden bg-navy-900">
                <Scene seed={l.id} category={l.category} className="h-full w-full" variant="thumb" />
                <div className="absolute right-2 top-2"><VerificationBadge status={l.verification} size="xs" /></div>
              </div>
              <div className="flex flex-1 flex-col p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-royal">
                  {CATEGORIES.find((c) => c.id === l.category)?.label}
                </p>
                <h3 className="mt-0.5 line-clamp-2 text-[13.5px] font-bold leading-snug text-navy">{l.title}</h3>
                <p className="mt-1 text-[10.5px] text-ink-faint">
                  {money(l.price)} · {hoursLabel(l.durationMins)} · capacity {l.capacity}
                </p>

                <div className="mt-2 flex items-center gap-3 text-[10.5px] text-ink-mute">
                  <span className="inline-flex items-center gap-1"><Icon name="eye" size={11} />{l.views}</span>
                  <span className="inline-flex items-center gap-1"><Icon name="message-square" size={11} />{l.enquiries}</span>
                  <Stars value={l.rating} size={10} />
                </div>

                <div className="mt-auto flex gap-1.5 pt-3">
                  <Button size="sm" variant="ghost" className="flex-1" icon="pen-line" onClick={() => nav(`/sme/listings/${l.id}/edit`)}>Edit</Button>
                  <Button size="sm" variant="quiet" icon="eye" onClick={() => nav(`/experiences/${l.id}`)} aria-label="Preview" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ Listing form
type FormState = {
  title: string
  summary: string
  description: string
  category: string
  tags: string[]
  stationId: string
  town: string
  price: string
  durationMins: string
  capacity: string
  wheelchair: boolean
  stepFree: boolean
  seatedOption: boolean
  accessNotes: string
  intensity: 'low' | 'moderate' | 'high'
  setting: 'indoor' | 'outdoor' | 'mixed'
  learningValue: string
  lastMileNote: string
}

const empty: FormState = {
  title: '', summary: '', description: '', category: 'workshops', tags: [], stationId: 'kluang', town: '',
  price: '80', durationMins: '120', capacity: '6', wheelchair: true, stepFree: true, seatedOption: true,
  accessNotes: '', intensity: 'low', setting: 'indoor', learningValue: '', lastMileNote: '',
}

export function SmeListingForm() {
  const money = useMoneyText()
  const { id } = useParams()
  const nav = useNavigate()
  const { experiences, upsertExperience, toast, setExperienceStatus } = useApp()
  const existing = id ? experiences.find((e) => e.id === id) : null
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const [f, setF] = useState<FormState>(() =>
    existing
      ? {
          title: existing.title, summary: existing.summary, description: existing.description,
          category: existing.category, tags: existing.tags, stationId: existing.stationId, town: existing.town,
          price: String(existing.price), durationMins: String(existing.durationMins), capacity: String(existing.capacity),
          wheelchair: existing.accessibility.wheelchair, stepFree: existing.accessibility.stepFree,
          seatedOption: existing.accessibility.seatedOption, accessNotes: existing.accessibility.notes,
          intensity: existing.intensity, setting: existing.setting, learningValue: existing.learningValue,
          lastMileNote: existing.lastMileNote,
        }
      : empty
  )

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }))
  const toggleTag = (t: string) => set('tags', f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t])

  const validate = () => {
    const e: Record<string, string> = {}
    if (f.title.trim().length < 8) e.title = 'Title needs at least 8 characters'
    if (f.summary.trim().length < 20) e.summary = 'Summary needs at least 20 characters'
    if (f.description.trim().length < 60) e.description = 'Description needs at least 60 characters'
    if (!f.town.trim()) e.town = 'Enter the town or area'
    if (Number(f.price) <= 0) e.price = 'Enter a price above zero'
    if (Number(f.durationMins) < 30) e.durationMins = 'Minimum 30 minutes'
    if (Number(f.capacity) < 1) e.capacity = 'At least one participant'
    if (f.learningValue.trim().length < 20) e.learningValue = 'Describe the educational value'
    if (f.accessNotes.trim().length < 10) e.accessNotes = 'Describe accessibility honestly'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) {
      toast('Some fields need attention', 'Check the highlighted fields before submitting.', 'error')
      return
    }
    const exp: Experience = {
      id: existing?.id ?? `exp-new-${Date.now()}`,
      operatorId: DEMO_OPERATOR_ID,
      title: f.title,
      summary: f.summary,
      description: f.description,
      category: f.category as Experience['category'],
      tags: f.tags as Experience['tags'],
      stationId: f.stationId,
      town: f.town,
      price: Number(f.price),
      durationMins: Number(f.durationMins),
      capacity: Number(f.capacity),
      accessibility: { wheelchair: f.wheelchair, stepFree: f.stepFree, seatedOption: f.seatedOption, notes: f.accessNotes },
      intensity: f.intensity,
      setting: f.setting,
      interests: [f.category],
      bestFor: ['leisure'],
      heroGradient: 'from-navy-800 via-royal-700 to-emerald2-700',
      images: [],
      learningValue: f.learningValue,
      availability: [
        { day: 'Mon', times: [] }, { day: 'Tue', times: ['09:00', '14:00'] }, { day: 'Wed', times: ['09:00', '14:00'] },
        { day: 'Thu', times: ['09:00', '14:00'] }, { day: 'Fri', times: ['09:00', '14:00'] },
        { day: 'Sat', times: ['09:00', '11:00', '14:00'] }, { day: 'Sun', times: ['09:00'] },
      ],
      verification: 'pending',
      rating: existing?.rating ?? 0,
      reviewCount: existing?.reviewCount ?? 0,
      views: existing?.views ?? 0,
      enquiries: existing?.enquiries ?? 0,
      featured: false,
      lastMileNote: f.lastMileNote || 'Operator pickup available on request from the station.',
      createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
    }
    upsertExperience(exp)
    setSubmitted(true)
    toast('Submitted for verification', 'Your listing is now in the admin queue.', 'success')
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl py-10">
        <div className="rounded-2xl border border-line bg-white p-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-100 text-gold-700">
            <Icon name="clipboard-check" size={26} />
          </span>
          <h1 className="mt-4 text-[21px] font-extrabold"><T>Submitted for verification</T></h1>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink-mute">
            “{f.title}” is now in the admin verification queue with status <strong><T>Pending verification</T></strong>. It
            will not appear in visitor discovery until an administrator approves it.
          </p>
          <div className="mx-auto mt-4 max-w-xs rounded-xl bg-canvas p-3 text-left">
            {[
              ['Status', 'Pending verification'],
              ['Submitted', 'just now'],
              ['Estimated review', '2 working days (demo)'],
              ['Visible to visitors', 'No'],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between border-b border-line py-1 last:border-0">
                <span className="text-[11px] text-ink-mute">{l}</span>
                <span className="text-[11px] font-bold text-navy">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="ghost" onClick={() => nav('/sme/listings')} icon="package"><T>Back to listings</T></Button>
            <Button onClick={() => nav('/admin/verifications')} icon="shield-check"><T>Open admin queue</T></Button>
          </div>
          <p className="mt-3 text-[10.5px] text-ink-faint">
            Tip: switch role to Administrator to approve this listing and see it appear in visitor discovery.
          </p>
        </div>
      </div>
    )
  }

  const Steps = ['Basics', 'Details', 'Accessibility', 'Review']
  const canNext = () => {
    if (step === 0) return f.title.length >= 8 && f.summary.length >= 20 && f.town.trim().length > 0
    if (step === 1) return f.description.length >= 60 && Number(f.price) > 0
    if (step === 2) return f.learningValue.length >= 20 && f.accessNotes.length >= 10
    return true
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-extrabold">{existing ? 'Edit listing' : 'Create a listing'}</h1>
          <p className="mt-1 text-[13px] text-ink-mute">
            New and edited listings enter the admin verification queue before appearing publicly.
          </p>
        </div>
        {existing && <VerificationBadge status={existing.verification} />}
      </div>

      {/* steps */}
      <div className="flex gap-1.5">
        {Steps.map((s, i) => (
          <button key={s} onClick={() => i < step && setStep(i)}
            className={clsx('flex flex-1 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all',
              i === step ? 'border-royal bg-royal-50/60' : i < step ? 'border-emerald2-200 bg-emerald2-50/40' : 'border-line bg-white')}>
            <span className={clsx('grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold',
              i === step ? 'bg-royal text-white' : i < step ? 'bg-emerald2 text-white' : 'bg-navy-100 text-ink-faint')}>
              {i < step ? '✓' : i + 1}
            </span>
            <span className={clsx('truncate text-[11.5px] font-semibold', i === step ? 'text-navy' : 'text-ink-mute')}>{s}</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-white p-5">
        {step === 0 && (
          <div className="space-y-3">
            <Field label="Experience title" required error={errors.title} hint="Specific beats clever. What will they actually do?">
              <input className="field" value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="Canting Batik Workshop — Johor Palette" />
            </Field>
            <Field label="One-line summary" required error={errors.summary} hint="Appears on cards. 20–140 characters.">
              <textarea className="field field-area" rows={2} value={f.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Draw wax lines by hand with a canting pen, then dye a 40cm cotton square." />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Category" required>
                <select className="field" value={f.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Nearest ETS station" required>
                <select className="field" value={f.stationId} onChange={(e) => set('stationId', e.target.value)}>
                  {STATIONS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Town or area" required error={errors.town}>
              <input className="field" value={f.town} onChange={(e) => set('town', e.target.value)} placeholder="Kluang" />
            </Field>
            <div>
              <p className="label">Educational tags</p>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map((t) => (
                  <button key={t.id} onClick={() => toggleTag(t.id)}
                    className={clsx('chip', f.tags.includes(t.id) && 'chip-active')}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <Field label="Full description" required error={errors.description} hint="At least 60 characters. Be honest about what is included and what is not.">
              <textarea className="field field-area" rows={6} value={f.description} onChange={(e) => set('description', e.target.value)} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Price per person (MYR)" required error={errors.price}>
                <input className="field" type="number" value={f.price} onChange={(e) => set('price', e.target.value)} />
              </Field>
              <Field label="Duration (minutes)" required error={errors.durationMins}>
                <input className="field" type="number" value={f.durationMins} onChange={(e) => set('durationMins', e.target.value)} />
              </Field>
              <Field label="Max participants" required error={errors.capacity}>
                <input className="field" type="number" value={f.capacity} onChange={(e) => set('capacity', e.target.value)} />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Physical intensity">
                <select className="field" value={f.intensity} onChange={(e) => set('intensity', e.target.value as FormState['intensity'])}>
                  <option value="low">Low — seated or gentle</option>
                  <option value="moderate">Moderate — some walking</option>
                  <option value="high">High — demanding</option>
                </select>
              </Field>
              <Field label="Setting">
                <select className="field" value={f.setting} onChange={(e) => set('setting', e.target.value as FormState['setting'])}>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="mixed">Mixed</option>
                </select>
              </Field>
            </div>
            <Field label="Last-mile note" hint="How does a visitor get from the station to you?">
              <input className="field" value={f.lastMileNote} onChange={(e) => set('lastMileNote', e.target.value)} placeholder="10 min walk from Kluang station, flat pavement." />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div>
              <p className="label">Accessibility</p>
              <p className="mb-2 text-[11.5px] text-ink-mute"><T>Answer honestly — these become hard constraints in matching.</T></p>
              <div className="grid gap-2 sm:grid-cols-3">
                {([['wheelchair', 'Wheelchair accessible'], ['stepFree', 'Step-free route'], ['seatedOption', 'Seated option']] as const).map(([k, l]) => (
                  <label key={k} className={clsx('flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors',
                    f[k] ? 'border-emerald2 bg-emerald2-50/50' : 'border-line hover:border-navy-200')}>
                    <input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} className="accent-emerald2" />
                    <span className="text-[12px] font-semibold text-ink-soft">{l}</span>
                  </label>
                ))}
              </div>
            </div>
            <Field label="Accessibility notes" required error={errors.accessNotes} hint="Mention steps, thresholds, gradients, seating, toilets.">
              <textarea className="field field-area" rows={3} value={f.accessNotes} onChange={(e) => set('accessNotes', e.target.value)} placeholder="All work happens at seated height. Step-free entrance, 6cm threshold at the rear door." />
            </Field>
            <Field label="Educational value" required error={errors.learningValue} hint="What will a visitor actually learn?">
              <textarea className="field field-area" rows={3} value={f.learningValue} onChange={(e) => set('learningValue', e.target.value)} placeholder="Wax-resist chemistry, colour theory in natural dyes, and the economics of a six-person studio." />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <p className="text-[12.5px] text-ink-mute">Review before submitting. You can edit after submitting, but it returns to the queue.</p>
            <div className="rounded-xl bg-canvas p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-royal">
                {CATEGORIES.find((c) => c.id === f.category)?.label} · {stationById(f.stationId)?.name}
              </p>
              <p className="mt-1 text-[15px] font-extrabold text-navy">{f.title || '—'}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-mute">{f.summary || '—'}</p>
              <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] text-ink-mute">
                <span className="font-bold text-navy num">{money(Number(f.price))}</span>
                <span className="num">{hoursLabel(Number(f.durationMins))}</span>
                <span className="num">max {f.capacity}</span>
                <span className="capitalize">{f.intensity} intensity</span>
                <span className="capitalize">{f.setting}</span>
              </div>
              <div className="mt-2 flex gap-1">
                {f.wheelchair && <span className="rounded bg-emerald2-50 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald2-700">Wheelchair</span>}
                {f.stepFree && <span className="rounded bg-emerald2-50 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald2-700">Step-free</span>}
                {f.seatedOption && <span className="rounded bg-emerald2-50 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald2-700">Seated</span>}
              </div>
            </div>
            <div className="rounded-xl border border-gold-200 bg-gold-50/60 p-3">
              <p className="flex items-start gap-2 text-[11px] leading-relaxed text-gold-900">
                <Icon name="shield-check" size={13} className="mt-0.5 shrink-0" />
                <T>Submitting sends this listing to the admin queue with status</T> <strong><T>Pending verification</T></strong>. It
                will not be visible to visitors until approved. In this mockup, you can approve it yourself by
                switching to the Administrator role.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="quiet" onClick={() => (step === 0 ? nav('/sme/listings') : setStep(step - 1))} icon="arrow-left">
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        <div className="flex gap-2">
          {existing && (
            <Button variant="ghost" size="sm" onClick={() => { setExperienceStatus(existing.id, 'draft'); toast('Saved as draft', 'Not submitted for verification.', 'info'); nav('/sme/listings') }}>
              <T>Save draft</T>
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext()} iconRight="arrow-right"><T>Continue</T></Button>
          ) : (
            <Button onClick={submit} icon="send"><T>Submit for verification</T></Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Enquiries
export function SmeEnquiries() {
  const { opsEnquiries } = useDemoOperator()
  const { updateEnquiry, toast, experiences } = useApp()
  const [filter, setFilter] = useState<string>('all')
  const [open, setOpen] = useState<string | null>(null)

  const shown = filter === 'all' ? opsEnquiries : opsEnquiries.filter((e) => e.status === filter)
  const active = opsEnquiries.find((e) => e.id === open)

  const setStatus = (id: string, s: 'new' | 'in_review' | 'responded' | 'closed') => {
    updateEnquiry(id, s)
    toast('Enquiry updated', `Status set to ${s.replace('_', ' ')}.`, 'success')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold"><T>Enquiries</T></h1>
          <p className="mt-1 text-[13px] text-ink-mute"><T>Visitor enquiries are not bookings. You keep control of the conversation.</T></p>
        </div>
        <DemoTag label="Demo enquiries" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[
          ['all', 'All', opsEnquiries.length],
          ['new', 'New', opsEnquiries.filter((e) => e.status === 'new').length],
          ['in_review', 'In review', opsEnquiries.filter((e) => e.status === 'in_review').length],
          ['responded', 'Responded', opsEnquiries.filter((e) => e.status === 'responded').length],
          ['closed', 'Closed', opsEnquiries.filter((e) => e.status === 'closed').length],
        ].map(([id, label, n]) => (
          <button key={id as string} onClick={() => setFilter(id as string)} className={clsx('chip', filter === id && 'chip-active')}>
            {label} <span className="num opacity-60">{n}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState icon="message-square" title="No enquiries here" body="Enquiries from visitors will appear in this queue." />
      ) : (
        <div className="space-y-2">
          {shown.map((e) => {
            const exp = experiences.find((x) => x.id === e.experienceId)
            return (
              <div key={e.id} className="rounded-2xl border border-line bg-white p-3.5 transition-all hover:border-navy-200">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-100 text-[11px] font-bold text-navy-600">
                      {e.visitorName.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-navy">{e.visitorName}</p>
                      <p className="text-[10.5px] text-ink-faint">
                        {e.partySize} {e.partySize > 1 ? 'people' : 'person'} · {dateLabel(e.date)} · {timeAgo(e.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnquiryBadge status={e.status} />
                    <select
                      value={e.status}
                      onChange={(ev) => setStatus(e.id, ev.target.value as never)}
                      className="field !h-7 !w-auto !py-0 !text-[10.5px] font-semibold"
                      aria-label="Update enquiry status"
                    >
                      <option value="new">New</option>
                      <option value="in_review"><T>In review</T></option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <p className="mt-2 rounded-lg bg-canvas px-2.5 py-2 text-[11.5px] leading-relaxed text-ink-soft">{e.message}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="truncate text-[10px] text-ink-faint">re: {exp?.title ?? 'Listing'}</p>
                  <button onClick={() => setOpen(e.id)} className="text-[10.5px] font-bold text-royal hover:text-royal-700"><T>Open details</T></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!active} onClose={() => setOpen(null)} title="Enquiry details"
        footer={<>
          <Button variant="quiet" size="sm" onClick={() => setOpen(null)}><T>Close</T></Button>
          <Button size="sm" icon="send" onClick={() => { if (active) { setStatus(active.id, 'responded'); setOpen(null) } }}>Mark responded</Button>
        </>}>
        {active && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                ['Visitor', active.visitorName], ['Email', active.visitorEmail],
                ['Party size', `${active.partySize}`], ['Preferred date', dateLabel(active.date)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-canvas px-2.5 py-2">
                  <p className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">{l}</p>
                  <p className="mt-0.5 truncate text-[12px] font-semibold text-navy">{v}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-line px-2.5 py-2">
              <p className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint"><T>Message</T></p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{active.message}</p>
            </div>
            <div className="rounded-lg bg-gold-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-gold-900">
              Replies are not actually sent — this is a mock enquiry. Status changes are saved in your browser.
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ------------------------------------------------------------------ Reviews
export function SmeReviews() {
  const { opsReviews } = useDemoOperator()
  const { experiences } = useApp()
  const avg = opsReviews.length ? opsReviews.reduce((s, r) => s + r.rating, 0) / opsReviews.length : 0
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, n: opsReviews.filter((r) => r.rating === s).length }))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold">Visitor feedback</h1>
          <p className="mt-1 text-[13px] text-ink-mute">{opsReviews.length} reviews · demonstration data only</p>
        </div>
        <DemoTag label="Simulated reviews" />
      </div>

      <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Overall rating</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-[40px] font-extrabold leading-none text-navy num">{avg ? avg.toFixed(1) : '—'}</p>
            <div className="pb-1.5"><Stars value={avg} size={13} /></div>
          </div>
          <div className="mt-4 space-y-2">
            {dist.map((d) => (
              <div key={d.s} className="flex items-center gap-2">
                <span className="w-3 text-[10px] text-ink-faint num">{d.s}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-100">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${opsReviews.length ? (d.n / opsReviews.length) * 100 : 0}%` }} />
                </div>
                <span className="w-3 text-right text-[10px] text-ink-faint num">{d.n}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-canvas p-2.5">
            <p className="text-[10.5px] leading-relaxed text-ink-mute">
              {avg >= 4.5
                ? 'Accessibility clarity is your strongest signal in review text. Keep detailing thresholds and seating.'
                : 'Reviews mention accessibility accuracy most often. Consider adding photos of the entrance.'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {opsReviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-line bg-white p-3.5">
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
                <Stars value={r.rating} size={11} />
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">{r.body}</p>
              <p className="mt-1.5 text-[10px] text-ink-faint">
                {experiences.find((e) => e.id === r.experienceId)?.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Analytics
export function SmeAnalytics() {
  const { listings, opsEnquiries } = useDemoOperator()
  const totalViews = listings.reduce((s, l) => s + l.views, 0)
  const totalEnq = opsEnquiries.length
  const conv = totalViews ? ((totalEnq / totalViews) * 100).toFixed(1) : '0'

  const weekly = [22, 31, 28, 44, 39, 58, 47]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold">Performance</h1>
          <p className="mt-1 text-[13px] text-ink-mute"><T>All figures are simulated demonstration data.</T></p>
        </div>
        <DemoTag label="Simulated metrics" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total views" value={totalViews.toLocaleString()} icon="eye" tone="royal" delta="+18% vs last month" />
        <Stat label="Enquiries" value={totalEnq} icon="message-square" tone="johor" delta="+4 this week" />
        <Stat label="View → enquiry" value={`${conv}%`} icon="target" tone="emerald2" hint="Simulated conversion rate" />
        <Stat label="Published" value={listings.filter((l) => l.verification === 'verified').length} icon="package" tone="gold" hint={`of ${listings.length} listings`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[12px] font-bold text-navy">Views over 7 days</p>
          <div className="mt-4 flex h-[132px] items-end gap-2">
            {weekly.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t bg-royal/85 transition-all hover:bg-royal" style={{ height: `${(v / 58) * 100}%` }} />
                <span className="text-[9px] text-ink-faint">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-ink-faint"><T>Simulated traffic pattern for the mockup.</T></p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[12px] font-bold text-navy"><T>Enquiry sources</T></p>
          <div className="mt-3 space-y-2.5">
            {[
              ['Station page', 42], ['Matching engine', 31], ['Map view', 16], ['Direct link', 11],
            ].map(([l, v]) => (
              <div key={l as string}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-ink-mute">{l}</span><span className="font-bold text-navy num">{v}%</span>
                </div>
                <Meter value={v as number} />
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-emerald2-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-emerald2-900">
            73% of your enquiries come from visitors who found you through station or matching pages — not search.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-4">
        <p className="text-[12px] font-bold text-navy">Listing performance</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-wider text-ink-faint">
                <th className="pb-2 font-bold">Listing</th>
                <th className="pb-2 font-bold">Views</th>
                <th className="pb-2 font-bold"><T>Enquiries</T></th>
                <th className="pb-2 font-bold">Rate</th>
                <th className="pb-2 font-bold">Rating</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-b border-line last:border-0">
                  <td className="py-2 pr-3 text-[11.5px] font-semibold text-navy">{l.title}</td>
                  <td className="py-2 text-[11.5px] text-ink-mute num">{l.views}</td>
                  <td className="py-2 text-[11.5px] text-ink-mute num">{l.enquiries}</td>
                  <td className="py-2 text-[11.5px] font-semibold text-emerald2-700 num">
                    {l.views ? `${((l.enquiries / l.views) * 100).toFixed(1)}%` : '—'}
                  </td>
                  <td className="py-2 text-[11.5px] text-ink-mute num">{l.rating || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Profile
export function SmeProfilePage() {
  const { operator, listings } = useDemoOperator()
  const { toast } = useApp()
  const [f, setF] = useState({
    name: operator.name, operatorName: operator.operatorName, email: operator.email,
    phone: operator.phone, town: operator.town, stationId: operator.stationId,
    description: operator.description, category: operator.category,
  })

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold"><T>Operator profile</T></h1>
          <p className="mt-1 text-[13px] text-ink-mute"><T>This is what visitors see when they tap your business name.</T></p>
        </div>
        <VerificationBadge status={operator.verification} />
      </div>

      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy text-[15px] font-extrabold text-white">
            {operator.logoAdopt}
          </span>
          <div>
            <p className="text-[15px] font-extrabold text-navy">{operator.name}</p>
            <p className="text-[11.5px] text-ink-mute">{operator.category} · {operator.town}</p>
            <p className="mt-0.5 text-[10.5px] text-emerald2-700">Verified since {dateLabel(operator.joined)}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Field label="Business name"><input className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Operator name"><input className="field" value={f.operatorName} onChange={(e) => setF({ ...f, operatorName: e.target.value })} /></Field>
          <Field label="Email (mock)"><input className="field" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
          <Field label="Phone (mock)"><input className="field" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <Field label="Town / area"><input className="field" value={f.town} onChange={(e) => setF({ ...f, town: e.target.value })} /></Field>
          <Field label="Nearest ETS station">
            <select className="field" value={f.stationId} onChange={(e) => setF({ ...f, stationId: e.target.value })}>
              {STATIONS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
        </div>

        <div className="mt-3">
          <Field label="Business description" hint="Visible to visitors on your operator page.">
            <textarea className="field field-area" rows={4} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          </Field>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => toast('Profile saved (mock)', 'Changes stored in this browser only.', 'success')} icon="save"><T>Save changes</T></Button>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5">
        <p className="text-[13px] font-extrabold">Verification documents</p>
        <p className="mt-1 text-[11.5px] text-ink-mute"><T>Uploads are simulated — no files leave this browser.</T></p>
        <div className="mt-3 space-y-1.5">
          {operator.documents.map((d) => (
            <div key={d} className="flex items-center justify-between rounded-lg border border-line px-2.5 py-2">
              <span className="flex items-center gap-2 text-[11.5px] text-ink-soft">
                <Icon name="file-text" size={13} className="text-ink-faint" /> {d}
              </span>
              <span className="rounded bg-emerald2-50 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald2-700"><T>On file</T></span>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-3" icon="upload"
          onClick={() => toast('Upload simulated', 'File uploads are not functional in this mockup.', 'info')}>
          Upload document
        </Button>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5">
        <p className="text-[13px] font-extrabold">Promotions & packages</p>
        <p className="mt-1 text-[11.5px] text-ink-mute">Bundle listings or run a seasonal offer.</p>
        <div className="mt-3 space-y-1.5">
          {[
            { t: 'Weekend pair: batik + coffee cupping', d: '15% off when booked together', p: 'RM119', on: true },
            { t: 'School group package (min 15)', d: 'Programme + worksheet pack', p: 'RM32/pax', on: true },
            { t: 'Monsoon indoor-only bundle', d: 'Draft — not published', p: 'RM98', on: false },
          ].map((p) => (
            <div key={p.t} className="flex items-center justify-between rounded-lg border border-line px-2.5 py-2">
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-semibold text-navy">{p.t}</p>
                <p className="text-[10px] text-ink-faint">{p.d}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-[11px] font-bold text-navy num">{p.p}</span>
                <span className={clsx('rounded px-1.5 py-0.5 text-[9px] font-bold', p.on ? 'bg-emerald2-50 text-emerald2-700' : 'bg-navy-50 text-ink-faint')}>
                  {p.on ? 'Live' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-3" icon="plus"
          onClick={() => toast('Promotion builder (mock)', 'Package creation would open here.', 'info')}>
          Create package
        </Button>
      </div>

      <p className="text-center text-[10.5px] text-ink-faint">
        {listings.length} listings linked to this operator profile.
      </p>
    </div>
  )
}
