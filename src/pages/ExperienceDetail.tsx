import React, { useMemo, useState } from 'react'
import { usePrefs } from '../app/prefs'
import { T } from '../components/ui/T'
import { Link, useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../components/ui/Icon'
import { Button, DemoTag, EmptyState, Field, Modal, Stars, Meter } from '../components/ui'
import Scene from '../components/art/Scene'
import { ExperienceCard } from '../components/ExperienceCard'
import { useApp, usePublishedExperiences } from '../app/store'
import { experienceById } from '../data/experiencesIndex'
import { operatorById } from '../data/operators'
import { stationById, CORRIDOR } from '../data/stations'
import { CATEGORIES, TAGS } from '../data/taxonomy'
import { hoursLabel, money, dateLabel } from '../services/storage'
import { useMoneyText } from '../app/currency'
import { toMin, toTime } from '../services/itinerary'
import { matchExperiences } from '../services/matching'

export default function ExperienceDetail() {
  const { tx } = usePrefs()
  const money = useMoneyText()
  const { slug } = useParams()
  const nav = useNavigate()
  const { favourites, toggleFavourite, toast, profile, addEnquiry, itineraries, addItinerary, updateItinerary, reviews, addReview } = useApp()
  const exps = usePublishedExperiences()
  const exp = experienceById(slug)

  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', party: '2', date: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [revForm, setRevForm] = useState({ name: '', rating: 5, body: '' })
  const [gallery, setGallery] = useState(0)

  const expReviews = useMemo(
    () => reviews.filter((r) => r.experienceId === exp?.id && r.status === 'published'),
    [reviews, exp?.id]
  )

  const similar = useMemo(() => {
    if (!exp) return []
    const scored = matchExperiences(exps.filter((e) => e.id !== exp.id), profile, { limit: 8 })
    return scored
      .filter((s) => s.experience.stationId === exp.stationId || s.experience.category === exp.category)
      .slice(0, 3)
      .map((s) => s.experience)
  }, [exp, exps, profile])

  if (!exp) {
    return (
      <div className="shell py-20">
        <EmptyState
          icon="package-x"
          title={tx("Experience not found")}
          body={tx("This listing may have been removed, or it is still awaiting admin verification.")}
          action={<Link to="/explore" className="btn btn-primary btn-md"><T>Browse experiences</T></Link>}
        />
      </div>
    )
  }

  const op = operatorById(exp.operatorId)
  const station = stationById(exp.stationId)
  const saved = favourites.includes(exp.id)
  const cat = CATEGORIES.find((c) => c.id === exp.category)
  const inItinerary = itineraries.some((it) => it.items.some((i) => i.experienceId === exp.id))
  const idx = CORRIDOR.findIndex((s) => s.id === exp.stationId)

  const validateEnquiry = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Enter your name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.date) e.date = 'Choose a date'
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Add a little detail (at least 10 characters)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submitEnquiry = () => {
    if (!validateEnquiry()) return
    addEnquiry({
      id: `en-${Date.now()}`,
      experienceId: exp.id,
      operatorId: exp.operatorId,
      visitorName: form.name,
      visitorEmail: form.email,
      partySize: Number(form.party),
      date: form.date,
      message: form.message,
      status: 'new',
      createdAt: new Date().toISOString(),
    })
    setEnquiryOpen(false)
    setForm({ name: '', email: '', party: '2', date: '', message: '' })
    toast('Enquiry sent (mock)', `${op?.name} would receive this in the SME portal.`, 'success')
  }

  const submitReview = () => {
    if (!revForm.name.trim() || revForm.body.trim().length < 15) {
      toast('Review not submitted', 'Add a name and at least 15 characters of feedback.', 'error')
      return
    }
    addReview({
      id: `rv-${Date.now()}`,
      experienceId: exp.id,
      operatorId: exp.operatorId,
      authorName: revForm.name,
      authorOrigin: profile.country,
      rating: revForm.rating,
      date: new Date().toISOString().slice(0, 10),
      body: revForm.body,
      purpose: profile.purpose ?? 'leisure',
      status: 'pending',
    })
    setReviewOpen(false)
    setRevForm({ name: '', rating: 5, body: '' })
    toast('Review submitted for moderation', 'Demo reviews enter the admin queue before publishing.', 'info')
  }

  const addToItinerary = () => {
    const draft = itineraries.find((i) => i.source === 'visitor') ?? itineraries[0]
    if (!draft) {
      addItinerary({
        id: `it-${Date.now()}`,
        name: `Trip to ${station?.name}`,
        purpose: profile.purpose ?? 'leisure',
        stationId: exp.stationId,
        date: new Date(Date.now() + 604800000).toISOString().slice(0, 10),
        budget: profile.budget,
        items: [{ id: `ii-${Date.now()}`, experienceId: exp.id, startTime: '10:00', durationMins: exp.durationMins, price: exp.price, transportMins: 0 }],
        updatedAt: new Date().toISOString(),
        source: 'visitor',
      })
      toast('Itinerary created', `“${exp.title}” added as the first stop.`, 'success')
    } else if (draft.items.some((i) => i.experienceId === exp.id)) {
      toast('Already in your itinerary', `“${exp.title}” is already in “${draft.name}”.`, 'info')
    } else {
      // append after the last stop, leaving a 30 minute transition
      const sorted = [...draft.items].sort((a, b) => toMin(a.startTime) - toMin(b.startTime))
      const last = sorted[sorted.length - 1]
      const start = last ? toTime(toMin(last.startTime) + last.durationMins + 30) : '10:00'
      updateItinerary({
        ...draft,
        items: [
          ...draft.items,
          {
            id: `ii-${Date.now()}`,
            experienceId: exp.id,
            startTime: start,
            durationMins: exp.durationMins,
            price: exp.price,
            transportMins: 0,
          },
        ],
      })
      toast('Added to itinerary', `“${exp.title}” added to “${draft.name}” at ${start}.`, 'success')
    }
    nav('/visitor/itinerary')
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* gallery header */}
      <div className="border-b border-line bg-raised">
        <div className="shell py-5">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[11.5px] text-ink-faint" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-navy"><T>Home</T></Link>
            <Icon name="chevron-right" size={11} />
            <Link to="/explore" className="hover:text-navy"><T>Explore</T></Link>
            <Icon name="chevron-right" size={11} />
            <Link to={`/explore/stations/${exp.stationId}`} className="hover:text-navy">{station?.name}</Link>
            <Icon name="chevron-right" size={11} />
            <span className="truncate font-semibold text-ink-soft">{exp.title}</span>
          </nav>

          <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-navy-900">
              <Scene
                seed={`${exp.id}-g${gallery}`}
                category={exp.category}
                className="h-full w-full"
                variant="hero"
                motif={['shophouse', 'loom', 'field', 'river', 'wheel', 'table'][gallery % 6] as never}
              />
              <div className="absolute left-3 top-3 flex gap-1.5">
                <span className="rounded-md bg-navy-950/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {cat?.label}
                </span>
                <span className="rounded-md bg-emerald2/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  <T>Verified operator</T>
                </span>
              </div>
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => setGallery(i)}
                    aria-label={`View image ${i + 1}`}
                    className={clsx('h-1.5 rounded-full transition-all', gallery === i ? 'w-6 bg-raised' : 'w-1.5 bg-white/50 hover:bg-white/80')}
                  />
                ))}
              </div>
            </div>

            <div className="hidden grid-cols-2 gap-3 lg:grid">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => setGallery(i)}
                  className="relative overflow-hidden rounded-xl bg-navy-900 ring-offset-2 transition-all hover:ring-2 hover:ring-royal"
                  aria-label={`View image ${i + 1}`}
                >
                  <Scene seed={`${exp.id}-g${i}`} category={exp.category} className="h-full w-full" variant="thumb" motif={['shophouse', 'loom', 'field', 'river', 'wheel', 'table'][i % 6] as never} />
                  {i === 3 && (
                    <span className="absolute inset-0 grid place-items-center bg-navy-950/60 text-[11px] font-bold text-white">
                      <T>Illustrative scenes</T>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-ink-faint">
            <Icon name="info" size={11} />
            <T>Illustrative generated artwork, not photographs of the actual venue. No third-party imagery is used.</T>
          </p>
        </div>
      </div>

      <div className="shell py-7">
        <div className="grid gap-7 lg:grid-cols-[1fr_356px]">
          {/* main */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-[24px] font-extrabold leading-[1.16] sm:text-[31px]">{exp.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <Stars value={exp.rating} count={exp.reviewCount} />
                  <span className="text-ink-faint">·</span>
                  <Link to={`/operators/${op?.id}`} className="text-[12.5px] font-semibold text-royal hover:underline">
                    {op?.name}
                  </Link>
                  <span className="text-ink-faint">·</span>
                  <Link to={`/explore/stations/${exp.stationId}`} className="inline-flex items-center gap-1 text-[12.5px] text-ink-soft hover:text-navy">
                    <Icon name="train-front" size={12} className="text-royal" /> {station?.name}, {exp.town}
                  </Link>
                </div>
              </div>
              <button
                onClick={() => {
                  toggleFavourite(exp.id)
                  toast(saved ? 'Removed from favourites' : 'Saved to favourites', exp.title, 'info')
                }}
                aria-pressed={saved}
                className={clsx('btn btn-sm shrink-0', saved ? 'btn-danger' : 'btn-ghost')}
              >
                <Icon name="heart" size={14} className={saved ? 'fill-johor' : ''} />
                {saved ? tx('Saved') : tx('Save')}
              </button>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{exp.summary}</p>

            {/* quick facts */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { i: 'clock', l: 'Duration', v: hoursLabel(exp.durationMins) },
                { i: 'wallet', l: 'Indicative price', v: `${money(exp.price)} / person` },
                { i: 'users', l: 'Max group', v: `${exp.capacity} people` },
                { i: 'gauge', l: 'Intensity', v: exp.intensity.charAt(0).toUpperCase() + exp.intensity.slice(1) },
              ].map((f) => (
                <div key={f.l} className="rounded-xl border border-line bg-raised px-3 py-2.5">
                  <Icon name={f.i} size={14} className="text-royal" />
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint">{f.l}</p>
                  <p className="mt-0.5 text-[12.5px] font-bold text-navy">{f.v}</p>
                </div>
              ))}
            </div>

            {/* about */}
            <div className="mt-7">
              <h2 className="text-[16px] font-extrabold"><T>About this experience</T></h2>
              <p className="mt-2.5 whitespace-pre-line text-[14px] leading-[1.75] text-ink-soft">{exp.description}</p>
            </div>

            {/* learning value */}
            <div className="mt-6 rounded-2xl border border-gold-200 bg-gold-50/50 p-4">
              <div className="flex items-start gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold text-white">
                  <Icon name="graduation-cap" size={16} />
                </span>
                <div>
                  <p className="text-[13px] font-extrabold text-navy"><T>Educational value</T></p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-navy-700">{exp.learningValue}</p>
                </div>
              </div>
            </div>

            {/* tags */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {exp.tags.map((t) => (
                <span key={t} className="rounded-md bg-navy-50 px-2 py-1 text-[11px] font-semibold text-navy-600">
                  {TAGS.find((x) => x.id === t)?.label ?? t}
                </span>
              ))}
              {exp.bestFor.map((b) => (
                <span key={b} className="rounded-md border border-line px-2 py-1 text-[11px] font-semibold capitalize text-ink-mute">
                  Best for {b}
                </span>
              ))}
            </div>

            {/* getting there */}
            <div className="mt-7 rounded-2xl border border-line bg-raised p-4">
              <h2 className="text-[15px] font-extrabold"><T>Getting there</T></h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-navy-50/70 p-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-faint"><T>Nearest ETS station</T></p>
                  <p className="mt-1 text-[13.5px] font-bold text-navy">{station?.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-ink-mute">
                    {exp.stationId === 'jb-sentral' ? 'At the terminus' : `~${station?.minutesFromJB} min from JB Sentral`}
                  </p>
                </div>
                <div className="rounded-xl bg-navy-50/70 p-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-faint"><T>Last mile</T></p>
                  <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">{exp.lastMileNote}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {station?.lastMile.map((l) => (
                  <div key={l.label} className="flex items-center justify-between rounded-lg border border-line px-2.5 py-1.5">
                    <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-soft">
                      <Icon name={l.mode === 'walk' ? 'footprints' : l.mode === 'bus' ? 'bus' : l.mode === 'shuttle' ? 'bus-front' : 'car'} size={12} className="text-ink-faint" />
                      {l.label}
                    </span>
                    <span className={clsx('rounded px-1.5 py-0.5 text-[10px] font-bold', l.available === true ? 'bg-emerald2-50 text-emerald2-700' : 'bg-gold-50 text-gold-800')}>
                      {l.available === true ? `${l.minutes} min` : 'Unconfirmed'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 flex items-start gap-1.5 text-[10px] leading-relaxed text-ink-faint">
                <Icon name="info" size={10} className="mt-0.5 shrink-0" />
                <T>Estimated travel times are illustrative. Unconfirmed modes are marked rather than assumed.</T>
              </p>
            </div>

            {/* accessibility */}
            <div className="mt-5 rounded-2xl border border-line bg-raised p-4">
              <h2 className="text-[15px] font-extrabold"><T>Accessibility</T></h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  ['Wheelchair accessible', exp.accessibility.wheelchair],
                  ['Step-free route', exp.accessibility.stepFree],
                  ['Seated option', exp.accessibility.seatedOption],
                ].map(([l, v]) => (
                  <div key={l as string} className={clsx('flex items-center gap-2 rounded-lg px-2.5 py-2', v ? 'bg-emerald2-50' : 'bg-navy-50')}>
                    <Icon name={v ? 'check-circle-2' : 'x-circle'} size={14} className={v ? 'text-emerald2-600' : 'text-ink-faint'} />
                    <span className={clsx('text-[11.5px] font-semibold', v ? 'text-emerald2-800' : 'text-ink-mute')}>{l}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-[12px] leading-relaxed text-ink-mute">{exp.accessibility.notes}</p>
            </div>

            {/* availability */}
            <div className="mt-5 rounded-2xl border border-line bg-raised p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-extrabold"><T>Sample availability</T></h2>
                <DemoTag label="Sample schedule" />
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1.5">
                {exp.availability.map((a) => (
                  <div key={a.day} className={clsx('rounded-lg border px-1 py-2 text-center', a.times.length ? 'border-line bg-raised' : 'border-dashed border-navy-200 bg-navy-50/40')}>
                    <p className="text-[10px] font-bold uppercase text-ink-faint">{a.day}</p>
                    {a.times.length ? (
                      <p className="mt-0.5 text-[11px] font-bold text-navy num">{a.times.length}×</p>
                    ) : (
                      <p className="mt-0.5 text-[10px] text-ink-faint">—</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10.5px] leading-relaxed text-ink-faint">
                <T>Sample availability for demonstration. This is not a live booking calendar and no slot is held.</T>
              </p>
            </div>

            {/* reviews */}
            <div className="mt-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[16px] font-extrabold">
                  <T>Visitor feedback</T> <span className="text-ink-faint num">({expReviews.length})</span>
                </h2>
                <div className="flex items-center gap-2">
                  <DemoTag label={tx("Demo reviews")} />
                  <Button variant="ghost" size="sm" icon="pen-line" onClick={() => setReviewOpen(true)}>
                    <T>Write a review</T>
                  </Button>
                </div>
              </div>

              <div className="mt-3 grid gap-4 sm:grid-cols-[200px_1fr]">
                <div className="rounded-xl border border-line bg-raised p-4 text-center">
                  <p className="text-[38px] font-extrabold leading-none text-navy num">{exp.rating || '—'}</p>
                  <div className="mt-1.5 flex justify-center"><Stars value={exp.rating} size={13} /></div>
                  <p className="mt-1 text-[11px] text-ink-faint">{expReviews.length} demo reviews</p>
                  <div className="mt-3 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const n = expReviews.filter((r) => r.rating === s).length
                      return (
                        <div key={s} className="flex items-center gap-1.5">
                          <span className="w-2 text-[10px] text-ink-faint num">{s}</span>
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-navy-100">
                            <div className="h-full rounded-full bg-gold" style={{ width: `${expReviews.length ? (n / expReviews.length) * 100 : 0}%` }} />
                          </div>
                          <span className="w-3 text-right text-[10px] text-ink-faint num">{n}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {expReviews.length === 0 ? (
                    <EmptyState icon="message-square" title={tx("No reviews yet")} body={tx("Be the first to leave demonstration feedback for this listing.")} />
                  ) : (
                    expReviews.slice(0, 4).map((r) => (
                      <div key={r.id} className="rounded-xl border border-line bg-raised p-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-100 text-[11px] font-bold text-navy-600">
                              {r.authorName.charAt(0)}
                            </span>
                            <div>
                              <p className="text-[12.5px] font-bold text-navy">{r.authorName}</p>
                              <p className="text-[10.5px] text-ink-faint">
                                {r.authorOrigin} · {dateLabel(r.date)} · {r.purpose}
                              </p>
                            </div>
                          </div>
                          <Stars value={r.rating} size={11} />
                        </div>
                        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{r.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* sticky booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-raised p-4 shadow-card">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-faint"><T>Indicative price</T></p>
                  <p className="mt-0.5 text-[26px] font-extrabold leading-none text-navy num">{money(exp.price)}</p>
                  <p className="mt-1 text-[11px] text-ink-faint">per person · illustrative estimate</p>
                </div>
                <span className="rounded-md bg-emerald2-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald2-700">
                  <T>Verified</T>
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-canvas px-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-[11.5px] text-ink-mute">
                    <Icon name="clock" size={12} /> <T>Duration</T>
                  </span>
                  <span className="text-[12px] font-bold text-navy">{hoursLabel(exp.durationMins)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-canvas px-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-[11.5px] text-ink-mute">
                    <Icon name="train-front" size={12} /> <T>Station</T>
                  </span>
                  <span className="text-[12px] font-bold text-navy">{station?.name}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-canvas px-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-[11.5px] text-ink-mute">
                    <Icon name="users" size={12} /> <T>Group size</T>
                  </span>
                  <span className="text-[12px] font-bold text-navy">Max {exp.capacity}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button className="w-full" icon="message-square" onClick={() => setEnquiryOpen(true)}>
                  <T>Send enquiry</T>
                </Button>
                <Button variant="navy" className="w-full" icon={inItinerary ? 'check' : 'plus'} onClick={addToItinerary}>
                  {inItinerary ? 'Add another to itinerary' : 'Add to itinerary'}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  icon="heart"
                  onClick={() => {
                    toggleFavourite(exp.id)
                    toast(saved ? 'Removed from favourites' : 'Saved to favourites', exp.title, 'info')
                  }}
                >
                  {saved ? tx('Remove from favourites') : tx('Save to favourites')}
                </Button>
              </div>

              <p className="mt-3 rounded-lg bg-gold-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-gold-900">
                <strong><T>Mock booking enquiry.</T></strong> <T>No payment is taken, no slot is reserved, and no booking is confirmed. The operator receives a message in the SME portal.</T>
              </p>

              <div className="mt-4 border-t border-line pt-3">
                <Link to={`/operators/${op?.id}`} className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-navy-50">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy text-[11px] font-extrabold text-white">
                    {op?.logoAdopt}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-navy">{op?.name}</p>
                    <p className="text-[10.5px] text-ink-faint">{op?.town} · {op?.reviewCount} reviews</p>
                  </div>
                  <Icon name="chevron-right" size={14} className="text-ink-faint" />
                </Link>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-line bg-raised px-3.5 py-3">
              <p className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-ink-faint">
                <Icon name="shield-check" size={12} className="mt-0.5 shrink-0 text-emerald2-600" />
                <T>Operator verified by JOHOR360 staff. Verification covers business registration and safety documentation — not a quality guarantee.</T>
              </p>
            </div>
          </aside>
        </div>

        {/* similar */}
        {similar.length > 0 && (
          <div className="mt-10 border-t border-line pt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[17px] font-extrabold">Also near {station?.name}</h2>
              <Link to={`/explore/stations/${exp.stationId}`} className="text-[12px] font-bold text-royal hover:text-royal-700">
                <T>See all</T>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((e) => (
                <ExperienceCard key={e.id} exp={e} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* enquiry modal */}
      <Modal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        title={tx("Send an enquiry")}
        footer={
          <>
            <Button variant="quiet" size="sm" onClick={() => setEnquiryOpen(false)}><T>Cancel</T></Button>
            <Button size="sm" icon="send" onClick={submitEnquiry}><T>Send enquiry</T></Button>
          </>
        }
      >
        <div className="mb-4 rounded-xl bg-canvas px-3 py-2.5">
          <p className="text-[12.5px] font-bold text-navy">{exp.title}</p>
          <p className="text-[11px] text-ink-mute">{op?.name} · {station?.name} · {money(exp.price)} per person</p>
        </div>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={tx("Your name")} required error={errors.name}>
              <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Anna Wijaya" />
            </Field>
            <Field label={tx("Email")} required error={errors.email}>
              <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={tx("Number of people")}>
              <select className="field" value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })}>
                {Array.from({ length: exp.capacity }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </Field>
            <Field label={tx("Preferred date")} required error={errors.date}>
              <input className="field" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
          </div>
          <Field label={tx("Message")} required error={errors.message} hint={tx("Mention your train time, mobility needs or anything else relevant.")}>
            <textarea
              className="field field-area"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="We arrive on the 09:12 from JB and need to be back by 15:00. Two adults, one wheelchair user."
            />
          </Field>
          <p className="rounded-lg bg-gold-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-gold-900">
            <T>This is a mock enquiry. Nothing is sent externally, no payment is taken and no booking is created.</T>
          </p>
        </div>
      </Modal>

      {/* review modal */}
      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title={tx("Write a review")}
        footer={
          <>
            <Button variant="quiet" size="sm" onClick={() => setReviewOpen(false)}><T>Cancel</T></Button>
            <Button size="sm" icon="send" onClick={submitReview}><T>Submit review</T></Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label={tx("Your name")} required>
            <input className="field" value={revForm.name} onChange={(e) => setRevForm({ ...revForm, name: e.target.value })} placeholder="Hana S." />
          </Field>
          <Field label="Rating">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRevForm({ ...revForm, rating: n })}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  className={clsx('grid h-9 w-9 place-items-center rounded-lg border transition-colors',
                    revForm.rating >= n ? 'border-gold bg-gold-50 text-gold-600' : 'border-line text-ink-faint hover:border-navy-200')}
                >
                  <Icon name="star" size={16} className={revForm.rating >= n ? 'fill-gold-500' : ''} />
                </button>
              ))}
            </div>
          </Field>
          <Field label={tx("Your feedback")} required hint={tx("At least 15 characters. Be specific — what worked, what to know before booking.")}>
            <textarea
              className="field field-area"
              rows={4}
              value={revForm.body}
              onChange={(e) => setRevForm({ ...revForm, body: e.target.value })}
              placeholder="Six people maximum genuinely means six. The instructor corrected my wax line three times."
            />
          </Field>
          <p className="rounded-lg bg-royal-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-royal-800">
            <T>Reviews are queued for moderation and appear in the admin review queue before publishing.</T>
          </p>
        </div>
      </Modal>
    </div>
  )
}
