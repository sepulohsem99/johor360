import React, { useState } from 'react'
import { usePrefs } from '../../app/prefs'
import { T } from '../../components/ui/T'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../../components/ui/Icon'
import { Button, DemoTag, Field } from '../../components/ui'
import { useApp } from '../../app/store'
import { PURPOSES, INTERESTS, ACCESSIBILITY_OPTIONS, TRANSPORT_OPTIONS, COUNTRIES, LANGUAGES, DURATION_PRESETS } from '../../data/taxonomy'
import { STATIONS } from '../../data/stations'
import { money, hoursLabel } from '../../services/storage'
import { useMoneyText } from '../../app/currency'

const STEP_COUNT = 4

export default function Onboarding() {
  const { tx } = usePrefs()
  const money = useMoneyText()
  const nav = useNavigate()
  const { profile, setProfile, toast } = useApp()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState({ ...profile })

  const set = <K extends keyof typeof draft>(k: K, v: (typeof draft)[K]) =>
    setDraft((d) => ({ ...d, [k]: v }))

  const toggle = (field: 'interests' | 'transport' | 'accessibility', id: string) => {
    const cur = draft[field]
    set(field, cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])
  }

  const canNext = () => {
    if (step === 0) return !!draft.purpose
    if (step === 1) return draft.interests.length > 0
    if (step === 2) return draft.availableMins > 0 && !!draft.stationId
    return true
  }

  const finish = () => {
    setProfile({ ...draft, onboarded: true })
    toast('Preferences saved', 'Recommendations now use your purpose, time and budget.', 'success')
    nav('/visitor/recommendations')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-canvas">
      <div className="shell max-w-3xl py-8 sm:py-12">
        {/* progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-royal"><T>Visitor setup</T></p>
              <h1 className="mt-1 text-[24px] font-extrabold sm:text-[30px]">
                {['What brings you to Johor?', 'What are you into?', 'How much time and money?', 'Anything we should know?'][step]}
              </h1>
            </div>
            <span className="text-[11.5px] font-bold text-ink-faint num">Step {step + 1} of {STEP_COUNT}</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: STEP_COUNT }, (_, i) => (
              <div key={i} className={clsx('h-1 flex-1 rounded-full transition-colors', i <= step ? 'bg-royal' : 'bg-navy-100')} />
            ))}
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-ink-mute">
            <T>This drives the matching engine. You can change any of it later — nothing here is a permanent profile.</T>
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-raised p-5 sm:p-6">
          {/* STEP 0 — purpose */}
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {PURPOSES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => set('purpose', p.id)}
                  className={clsx(
                    'group relative rounded-2xl border-2 p-4 text-left transition-all',
                    draft.purpose === p.id
                      ? 'border-royal bg-royal-50/50 shadow-[0_0_0_4px_rgba(23,105,170,.08)]'
                      : 'border-line hover:border-navy-200 hover:bg-navy-50/40'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className={clsx('grid h-10 w-10 place-items-center rounded-xl text-white',
                      p.id === 'business' ? 'bg-royal-600' : p.id === 'medical' ? 'bg-emerald2-600' : p.id === 'education' ? 'bg-gold-600' : 'bg-johor')}>
                      <Icon name={p.glyph} size={18} />
                    </span>
                    {draft.purpose === p.id && (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-royal text-white">
                        <Icon name="check" size={13} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[14px] font-extrabold text-navy"><T>{p.label}</T></p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-mute"><T>{p.blurb}</T></p>
                </button>
              ))}
            </div>
          )}

          {/* STEP 1 — interests */}
          {step === 1 && (
            <div>
              <p className="mb-3 text-[12.5px] text-ink-mute"><T>Pick as many as you like. At least one.</T></p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => toggle('interests', i.id)}
                    className={clsx(
                      'rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-all',
                      draft.interests.includes(i.id)
                        ? 'border-navy bg-navy text-white'
                        : 'border-line bg-raised text-ink-soft hover:border-navy-300'
                    )}
                  >
                    {draft.interests.includes(i.id) && <Icon name="check" size={12} className="mr-1 inline" strokeWidth={3} />}
                    {i.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Field label={tx("Country of origin")}>
                  <select className="field" value={draft.country} onChange={(e) => set('country', e.target.value)}>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Preferred language">
                  <select className="field" value={draft.language} onChange={(e) => set('language', e.target.value)}>
                    {LANGUAGES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* STEP 2 — time/budget */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="label"><T>How much time do you have?</T></p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {DURATION_PRESETS.map((d) => (
                    <button
                      key={d.mins}
                      onClick={() => set('availableMins', d.mins)}
                      className={clsx('rounded-xl border-2 px-3 py-3 text-center transition-all',
                        draft.availableMins === d.mins ? 'border-royal bg-royal-50/60' : 'border-line hover:border-navy-200')}
                    >
                      <p className="text-[14px] font-extrabold text-navy">{d.label}</p>
                      <p className="mt-0.5 text-[10.5px] text-ink-faint">including travel</p>
                    </button>
                  ))}
                  <button
                    onClick={() => set('availableMins', 420)}
                    className={clsx('rounded-xl border-2 px-3 py-3 text-center transition-all',
                      draft.availableMins === 420 ? 'border-royal bg-royal-50/60' : 'border-line hover:border-navy-200')}
                  >
                    <p className="text-[14px] font-extrabold text-navy"><T>Full day</T></p>
                    <p className="mt-0.5 text-[10.5px] text-ink-faint">7 hours</p>
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="label !mb-0"><T>Budget per person</T></p>
                  <span className="text-[14px] font-extrabold text-navy num">{money(draft.budget)}</span>
                </div>
                <input type="range" min={30} max={600} step={10} value={draft.budget}
                  onChange={(e) => set('budget', Number(e.target.value))} className="w-full accent-royal" aria-label="Budget in ringgit" />
                <div className="mt-1 flex justify-between text-[10.5px] text-ink-faint">
                  <span>RM30</span><span>RM600</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={tx("Preferred ETS station")}>
                  <select className="field" value={draft.stationId} onChange={(e) => set('stationId', e.target.value)}>
                    {STATIONS.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.district}</option>)}
                  </select>
                </Field>
                <Field label={tx("Number of travellers")}>
                  <select className="field" value={draft.partySize} onChange={(e) => set('partySize', Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* STEP 3 — accessibility + transport */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="label"><T>Accessibility requirements</T></p>
                <p className="mb-2.5 text-[11.5px] leading-relaxed text-ink-mute">
                  Ticked requirements are applied as hard constraints — an experience that fails them is excluded
                  from your results entirely, not just ranked lower.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ACCESSIBILITY_OPTIONS.map((a) => (
                    <label key={a.id} className={clsx('flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors',
                      draft.accessibility.includes(a.id) ? 'border-emerald2 bg-emerald2-50/50' : 'border-line hover:border-navy-200')}>
                      <input type="checkbox" checked={draft.accessibility.includes(a.id)} onChange={() => toggle('accessibility', a.id)} className="accent-emerald2" />
                      <span className="text-[12.5px] font-semibold text-ink-soft">{a.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="label"><T>Transport you will use for the last mile</T></p>
                <div className="flex flex-wrap gap-2">
                  {TRANSPORT_OPTIONS.map((t) => (
                    <button key={t.id} onClick={() => toggle('transport', t.id)}
                      className={clsx('rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all',
                        draft.transport.includes(t.id) ? 'border-navy bg-navy text-white' : 'border-line text-ink-soft hover:border-navy-300')}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-navy-50 p-3.5">
                <p className="text-[11.5px] font-bold text-navy"><T>Your setup so far</T></p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11.5px] sm:grid-cols-4">
                  {[
                    ['Purpose', draft.purpose ? PURPOSES.find((p) => p.id === draft.purpose)?.label.replace(' traveller', '') : '—'],
                    ['Time', hoursLabel(draft.availableMins)],
                    ['Budget', money(draft.budget)],
                    ['Station', STATIONS.find((s) => s.id === draft.stationId)?.name ?? '—'],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-[10px] uppercase tracking-wider text-ink-faint">{l}</p>
                      <p className="font-bold text-navy">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Button variant="quiet" onClick={() => (step === 0 ? nav('/') : setStep(step - 1))} icon="arrow-left">
            {step === 0 ? tx('Cancel') : tx('Back')}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setProfile({ ...draft, onboarded: true }); nav('/visitor/dashboard') }}>
              <T>Skip setup</T>
            </Button>
            {step < STEP_COUNT - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()} iconRight="arrow-right">
                <T>Continue</T>
              </Button>
            ) : (
              <Button onClick={finish} icon="sparkles">
                <T>See my matches</T>
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-ink-faint">
          <DemoTag label={tx("No account needed")} /> <T>Preferences are stored in this browser only.</T>
        </p>
      </div>
    </div>
  )
}
