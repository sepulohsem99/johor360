import { useState } from 'react'
import { usePrefs } from '../app/prefs'
import { T } from '../components/ui/T'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../components/ui/Icon'
import { Button, DemoTag, Field } from '../components/ui'
import Scene from '../components/art/Scene'
import { useApp } from '../app/store'
import { PURPOSES } from '../data/taxonomy'
import Logo from '../layouts/PublicLayout'

function AuthShell({ children, side }: { children: React.ReactNode; side: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_460px]">
      <div className="relative hidden overflow-hidden bg-navy-900 lg:block">
        <Scene seed="auth-side" category="heritage" className="absolute inset-0 h-full w-full" variant="hero" motif="rails" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/75 to-navy-900/40" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo light />
          <div>{side}</div>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[360px]">{children}</div>
      </div>
    </div>
  )
}

export function Login() {
  const { tx } = usePrefs()
  const nav = useNavigate()
  const { setRole, toast, setProfile, profile } = useApp()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address')
    if (pw.length < 4) return setErr('Password must be at least 4 characters')
    setErr('')
    setProfile({ ...profile, email, name: profile.name === 'Guest visitor' ? email.split('@')[0] : profile.name })
    toast('Signed in (demo)', 'No authentication is performed in this mockup.', 'info')
    nav('/visitor/dashboard')
  }

  const quick = (role: 'visitor' | 'sme' | 'admin') => {
    setRole(role)
    toast(`Entered as ${role}`, 'Demo role switch — no credentials required.', 'info')
    nav(role === 'visitor' ? '/visitor/dashboard' : role === 'sme' ? '/sme/dashboard' : '/admin/dashboard')
  }

  return (
    <AuthShell
      side={
        <>
          <p className="max-w-sm text-[26px] font-extrabold leading-[1.2] text-white">
            “For many visitors, Johor still ends where the city does.”
          </p>
          <p className="mt-3 text-[12px] text-white/45">
            Johor Innovation Challenge 2026 — Problem statement 4
          </p>
        </>
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-mute hover:text-navy">
          <Icon name="arrow-left" size={13} /> Back
        </Link>
        <DemoTag label={tx("No real auth")} />
      </div>

      <h1 className="text-[24px] font-extrabold"><T>Sign in</T></h1>
      <p className="mt-1 text-[13px] text-ink-mute"><T>Welcome back. Pick up where you left off.</T></p>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <Field label={tx("Email")} required error={err && !/^\S+@\S+\.\S+$/.test(email) ? err : ''}>
          <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field label="Password" required error={err && /^\S+@\S+\.\S+$/.test(email) ? err : ''}>
          <div className="relative">
            <input className="field pr-10" type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-navy">
              <Icon name={show ? 'eye-off' : 'eye'} size={16} />
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] text-ink-mute">
            <input type="checkbox" className="accent-royal" /> Remember me
          </label>
          <Link to="/login" onClick={() => toast('Reset link (mock)', 'No email would actually be sent.', 'info')} className="text-[11.5px] font-semibold text-royal hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg"><T>Sign in</T></Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">or continue as</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="space-y-2">
        {[
          ['visitor', 'Visitor', 'compass', '/visitor/dashboard'],
          ['sme', 'SME Operator', 'store', '/sme/dashboard'],
          ['admin', 'Administrator', 'shield-check', '/admin/dashboard'],
        ].map(([r, l, i, to]) => (
          <button key={r} onClick={() => quick(r as never)}
            className="flex w-full items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-left transition-colors hover:border-navy-300 hover:bg-navy-50/50">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-50 text-navy"><Icon name={i} size={15} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-bold text-navy">Explore as {l}</p>
              <p className="text-[10.5px] text-ink-faint">Demo role switch</p>
            </div>
            <Icon name="arrow-right" size={14} className="text-ink-faint" />
          </button>
        ))}
        <button onClick={() => nav('/explore')}
          className="w-full rounded-xl px-3 py-2.5 text-center text-[12px] font-semibold text-ink-mute hover:bg-navy-50 hover:text-navy">
          <T>Continue as guest</T>
        </button>
      </div>

      <p className="mt-5 text-center text-[11.5px] text-ink-mute">
        <T>No account?</T> <Link to="/register" className="font-bold text-royal hover:underline">Create one</Link>
      </p>
    </AuthShell>
  )
}

export function Register() {
  const { tx } = usePrefs()
  const nav = useNavigate()
  const { setRole, toast, profile, setProfile } = useApp()
  const [kind, setKind] = useState<'visitor' | 'sme'>('visitor')
  const [step, setStep] = useState(0)
  const [f, setF] = useState({ name: '', email: '', pw: '', country: 'Singapore', purpose: 'leisure', business: '', category: 'Craft & Textile', station: 'kluang', phone: '', description: '' })
  const [err, setErr] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (f.name.trim().length < 2) e.name = 'Enter your name'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email'
    if (f.pw.length < 6) e.pw = 'At least 6 characters'
    if (kind === 'sme') {
      if (f.business.trim().length < 2) e.business = 'Enter your business name'
      if (f.phone.trim().length < 8) e.phone = 'Enter a contact number'
      if (f.description.trim().length < 30) e.description = 'Describe your business (30+ characters)'
    }
    setErr(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    if (kind === 'visitor') {
      setProfile({ ...profile, name: f.name, email: f.email, country: f.country, purpose: f.purpose as never })
      setRole('visitor')
      toast('Account created (demo)', 'No account is actually created — this is a mockup.', 'info')
      nav('/visitor/onboarding')
    } else {
      setRole('sme')
      toast('Operator account created (demo)', 'Your listing would now enter verification.', 'info')
      nav('/sme/dashboard')
    }
  }

  return (
    <AuthShell
      side={
        <>
          <p className="max-w-sm text-[26px] font-extrabold leading-[1.2] text-white">
            <T>If you run it, visitors should be able to find it.</T>
          </p>
          <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-white/50">
            Free listing for operators with ten employees or fewer. Manual verification, no booking commission.
          </p>
        </>
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-mute hover:text-navy">
          <Icon name="arrow-left" size={13} /> Back
        </Link>
        <DemoTag label={tx("No real signup")} />
      </div>

      <h1 className="text-[24px] font-extrabold">Create an account</h1>
      <p className="mt-1 text-[13px] text-ink-mute"><T>Choose what kind of account you need.</T></p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {([['visitor', 'I am a visitor', 'compass'], ['sme', 'I run a business', 'store']] as const).map(([k, l, i]) => (
          <button key={k} onClick={() => { setKind(k); setStep(0) }}
            className={clsx('rounded-xl border-2 p-3 text-left transition-all',
              kind === k ? 'border-royal bg-royal-50/60' : 'border-line hover:border-navy-200')}>
            <Icon name={i} size={16} className={kind === k ? 'text-royal' : 'text-ink-faint'} />
            <p className="mt-1.5 text-[12px] font-bold text-navy">{l}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {step === 0 && (
          <>
            <Field label={kind === 'sme' ? 'Your name' : 'Full name'} required error={err.name}>
              <input className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Anna Wijaya" />
            </Field>
            <Field label={tx("Email")} required error={err.email}>
              <input className="field" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" />
            </Field>
            <Field label="Password" required error={err.pw} hint={tx("Minimum 6 characters. Not stored anywhere.")}>
              <input className="field" type="password" value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} placeholder="••••••••" />
            </Field>
            {kind === 'visitor' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Country">
                  <select className="field" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })}>
                    {['Singapore', 'Indonesia', 'Australia', 'United Kingdom', 'Japan', 'South Korea', 'China', 'India', 'Other'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Purpose">
                  <select className="field" value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })}>
                    {PURPOSES.map((p) => <option key={p.id} value={p.id}>{p.label.replace(' traveller', '')}</option>)}
                  </select>
                </Field>
              </div>
            )}
            <button onClick={() => { if (kind === 'sme') { if (f.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(f.email) || f.pw.length < 6) { validate(); return } setStep(1) } else submit() }}
              className="btn btn-primary btn-lg w-full">
              {kind === 'sme' ? 'Continue' : 'Create account'}
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Business name" required error={err.business}>
              <input className="field" value={f.business} onChange={(e) => setF({ ...f, business: e.target.value })} placeholder="Sri Kluang Batik Studio" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Business category">
                <select className="field" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
                  {['Food & Coffee', 'Craft & Textile', 'Agriculture', 'Heritage', 'Nature & Guiding', 'Education', 'Wellness', 'Community Craft'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={tx("Nearest ETS station")}>
                <select className="field" value={f.station} onChange={(e) => setF({ ...f, station: e.target.value })}>
                  {['jb-sentral', 'kulai', 'rengam', 'kluang', 'paloh', 'bekok', 'labis', 'segamat', 'gemas'].map((c) => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                </select>
              </Field>
            </div>
            <Field label={tx("Phone")} required error={err.phone}>
              <input className="field" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+60 7-000 0000" />
            </Field>
            <Field label="Business description" required error={err.description} hint={tx("What do you do, and who for? 30+ characters.")}>
              <textarea className="field field-area" rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
            </Field>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setStep(0)}>Back</Button>
              <Button className="flex-1" onClick={submit}>Create account</Button>
            </div>
          </>
        )}
      </div>

      <p className="mt-5 text-center text-[11.5px] text-ink-mute">
        <T>Already have one?</T> <Link to="/login" className="font-bold text-royal hover:underline"><T>Sign in</T></Link>
      </p>
    </AuthShell>
  )
}

export function ForgotPassword() {
  const { tx } = usePrefs()
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-sm flex-col justify-center px-5">
      <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-mute hover:text-navy">
        <Icon name="arrow-left" size={13} /> <T>Back to sign in</T>
      </Link>
      {sent ? (
        <div className="rounded-2xl border border-line bg-white p-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald2-50 text-emerald2-700">
            <Icon name="mail" size={22} />
          </span>
          <h1 className="mt-4 text-[19px] font-extrabold"><T>Check your inbox</T></h1>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-mute">
            If an account exists for {email}, a reset link would be sent. This is a mockup — no email is sent.
          </p>
          <Button variant="ghost" className="mt-5 w-full" onClick={() => setSent(false)}><T>Try another email</T></Button>
        </div>
      ) : (
        <>
          <h1 className="text-[24px] font-extrabold">Reset password</h1>
          <p className="mt-1 text-[13px] text-ink-mute"><T>Enter your email and we will send a reset link.</T></p>
          <div className="mt-5 space-y-3">
            <Field label={tx("Email")} required>
              <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </Field>
            <Button className="w-full" size="lg" onClick={() => setSent(true)} disabled={!/^\S+@\S+\.\S+$/.test(email)}>Send reset link</Button>
          </div>
          <p className="mt-4 text-center text-[11.5px] text-ink-faint"><T>Demo only — no email is dispatched.</T></p>
        </>
      )}
    </div>
  )
}
