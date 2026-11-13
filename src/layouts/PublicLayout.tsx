import React, { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../app/store'
import Icon from '../components/ui/Icon'
import type { Role } from '../types'

export default function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="JOHOR360 home">
      <span className="relative grid h-9 w-9 place-items-center rounded-[11px] bg-navy shadow-[0_4px_12px_-4px_rgba(11,31,58,.5)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 17.5c3.2-1.6 5.2-5.2 5.2-9.2 0-1.2-.2-2.3-.6-3.3 3 .6 5.4 2.6 6.6 5.2 1-1 2.4-1.7 4-1.9-.4 1.3-.4 2.6 0 3.9 1.4 4.4 3 6 4.8 6.9-2.6.6-5.3.1-7.5-1.4-2 1.2-4.4 1.7-6.8 1.4-1.9-.2-3.6-.8-5.1-1.7z" fill="#D71920" />
          <circle cx="17.4" cy="6.2" r="1.7" fill="#E5AE45" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={clsx('block text-[16.5px] font-extrabold tracking-[-0.03em]', light ? 'text-white' : 'text-navy')}>
            JOHOR<span className="text-johor">360</span>
          </span>
          <span className={clsx('mt-0.5 block text-[9.5px] font-semibold uppercase tracking-[0.13em]', light ? 'text-white/50' : 'text-ink-faint')}>
            Beyond the city
          </span>
        </span>
      )}
    </Link>
  )
}

const PUBLIC_LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/explore/stations', label: 'ETS corridor' },
  { to: '/map', label: 'Map' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/about', label: 'About' },
]

const ROLE_META: Record<Role, { label: string; icon: string; home: string; desc: string }> = {
  visitor: { label: 'Visitor', icon: 'compass', home: '/visitor/dashboard', desc: 'Discover and plan' },
  sme: { label: 'SME operator', icon: 'store', home: '/sme/dashboard', desc: 'Manage listings' },
  admin: { label: 'Administrator', icon: 'shield-check', home: '/admin/dashboard', desc: 'Verify and monitor' },
}

export function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { role, setRole, toast } = useApp()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const meta = ROLE_META[role]

  const switchTo = (r: Role) => {
    setRole(r)
    setOpen(false)
    nav(ROLE_META[r].home)
    toast(`Switched to ${ROLE_META[r].label} view`, 'Demo role switching — no authentication required.', 'info')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={clsx(
          'flex items-center gap-2 rounded-xl border border-line bg-white transition-colors hover:border-navy-300',
          compact ? 'h-9 px-2.5' : 'h-10 px-3'
        )}
      >
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-navy text-white">
          <Icon name={meta.icon} size={13} />
        </span>
        <span className="hidden text-[12.5px] font-bold text-navy sm:block">{meta.label}</span>
        <Icon name="chevrons-up-down" size={13} className="text-ink-faint" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-[268px] overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-pop animate-fadeUp"
          >
            <p className="px-2.5 py-2 text-[10.5px] font-bold uppercase tracking-widest text-ink-faint">
              Demo role switcher
            </p>
            {(Object.keys(ROLE_META) as Role[]).map((r) => {
              const m = ROLE_META[r]
              return (
                <button
                  key={r}
                  role="menuitem"
                  onClick={() => switchTo(r)}
                  className={clsx(
                    'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors',
                    role === r ? 'bg-navy-50' : 'hover:bg-navy-50/70'
                  )}
                >
                  <span
                    className={clsx(
                      'grid h-8 w-8 shrink-0 place-items-center rounded-lg',
                      role === r ? 'bg-navy text-white' : 'bg-navy-50 text-navy-500'
                    )}
                  >
                    <Icon name={m.icon} size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-navy">{m.label}</span>
                    <span className="block text-[11px] text-ink-faint">{m.desc}</span>
                  </span>
                  {role === r && <Icon name="check" size={14} className="text-emerald2-600" />}
                </button>
              )
            })}
            <p className="border-t border-line px-2.5 pt-2 pb-1 text-[10.5px] leading-relaxed text-ink-faint">
              Mockup only. No accounts, passwords or real authentication.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export function PublicHeader() {
  const { role } = useApp()
  const [mobile, setMobile] = useState(false)
  const loc = useLocation()

  React.useEffect(() => setMobile(false), [loc.pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 glass">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-7">
          <Logo />
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {PUBLIC_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-colors',
                    isActive ? 'text-navy' : 'text-ink-mute hover:text-navy hover:bg-navy-50/60'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {role !== 'visitor' ? (
            <Link
              to={ROLE_META[role].home}
              className="hidden h-10 items-center gap-1.5 rounded-xl bg-navy px-3.5 text-[12.5px] font-bold text-white sm:flex"
            >
              <Icon name="layout-dashboard" size={14} />
              {ROLE_META[role].label} portal
            </Link>
          ) : (
            <Link to="/visitor/dashboard" className="hidden h-10 items-center gap-1.5 rounded-xl px-3 text-[13px] font-semibold text-ink-soft hover:text-navy sm:flex">
              My trips
            </Link>
          )}
          <RoleSwitcher />
          <Link to="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
            Sign in
          </Link>
          <button
            onClick={() => setMobile((m) => !m)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-navy lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobile}
          >
            <Icon name={mobile ? 'x' : 'menu'} size={18} />
          </button>
        </div>
      </div>

      {mobile && (
        <div className="border-t border-line bg-white lg:hidden animate-fadeUp">
          <nav className="shell flex flex-col py-2" aria-label="Mobile">
            {PUBLIC_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-3 text-[14px] font-semibold',
                    isActive ? 'bg-navy-50 text-navy' : 'text-ink-soft'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-1 grid grid-cols-2 gap-2 border-t border-line pt-3">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer className="mt-8 border-t border-line bg-white">
      <div className="shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink-mute">
              A rail-connected discovery platform helping international visitors find authentic experiences run by
              small and medium operators across Johor's ETS corridor.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-navy-50 px-2.5 py-1.5 text-[11px] font-semibold text-navy-600">
              <Icon name="flask-conical" size={12} />
              Competition mockup — all data simulated
            </div>
          </div>
          {[
            { title: 'Discover', links: [['Explore experiences', '/explore'], ['ETS corridor', '/explore/stations'], ['Experience map', '/map'], ['How it works', '/how-it-works']] },
            { title: 'For operators', links: [['List your experience', '/register'], ['Operator portal', '/sme/dashboard'], ['Verification process', '/how-it-works']] },
            { title: 'Platform', links: [['About JOHOR360', '/about'], ['Admin portal', '/admin/dashboard'], ['Impact dashboard', '/admin/impact']] },
          ].map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ink-faint">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-[13px] text-ink-soft transition-colors hover:text-royal">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-[11.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 JOHOR360 · Johor Innovation Challenge 2026 entry · Category 4: Connecting Visitors in Johor</p>
          <p className="flex items-center gap-1.5">
            <Icon name="info" size={12} />
            Demo operators and reviews. Rail data illustrative — verify with KTMB.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { ROLE_META }
