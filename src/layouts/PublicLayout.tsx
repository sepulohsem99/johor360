import React, { useState } from 'react'
import { T } from '../components/ui/T'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../app/store'
import { usePrefs } from '../app/prefs'
import Icon from '../components/ui/Icon'
import { LanguageToggle, ThemeToggle, CurrencySelect } from '../components/ui/controls'
import type { Role } from '../types'

export default function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="group inline-flex shrink-0 items-center gap-2.5" aria-label="JOHOR360 home">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[10px] bg-navy ring-1 ring-white/10">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 17.5c3.2-1.6 5.2-5.2 5.2-9.2 0-1.2-.2-2.3-.6-3.3 3 .6 5.4 2.6 6.6 5.2 1-1 2.4-1.7 4-1.9-.4 1.3-.4 2.6 0 3.9 1.4 4.4 3 6 4.8 6.9-2.6.6-5.3.1-7.5-1.4-2 1.2-4.4 1.7-6.8 1.4-1.9-.2-3.6-.8-5.1-1.7z"
            fill="#C8102E"
          />
          <circle cx="17.4" cy="6.2" r="1.7" fill="#D4A64A" />
        </svg>
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gold" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={clsx(
              'block text-[16px] font-extrabold tracking-[-0.03em]',
              light ? 'text-white' : 'text-ink'
            )}
          >
            JOHOR<span className="text-johor">360</span>
          </span>
          <span
            className={clsx(
              'mt-[3px] block text-[9px] font-semibold uppercase tracking-[0.14em]',
              light ? 'text-white/55' : 'text-ink-faint'
            )}
          >
            <T>Beyond the city</T>
          </span>
        </span>
      )}
    </Link>
  )
}

const PUBLIC_LINKS = [
  { to: '/explore', key: 'nav.explore' },
  { to: '/explore/stations', key: 'nav.corridor' },
  { to: '/visitor/itinerary', key: 'nav.plan' },
  { to: '/sme/dashboard', key: 'nav.operators' },
]

const ROLE_META: Record<Role, { label: string; icon: string; home: string; desc: string }> = {
  visitor: { label: 'Visitor', icon: 'compass', home: '/visitor/dashboard', desc: 'Discover and plan' },
  sme: { label: 'SME operator', icon: 'store', home: '/sme/dashboard', desc: 'Manage listings' },
  admin: { label: 'Administrator', icon: 'shield-check', home: '/admin/dashboard', desc: 'Verify and monitor' },
}

export function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { role, setRole, toast } = useApp()
  const { t } = usePrefs()
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
        aria-label={t('nav.role')}
        className={clsx(
          'flex items-center gap-2 rounded-lg border border-line bg-raised transition-colors hover:border-lineStrong',
          compact ? 'h-8 px-2' : 'h-8 px-2.5'
        )}
      >
        <span className="grid h-5 w-5 place-items-center rounded-md bg-navy text-white">
          <Icon name={meta.icon} size={11} />
        </span>
        <span className="hidden text-[12px] font-bold text-ink sm:block">{meta.label}</span>
        <Icon name="chevrons-up-down" size={12} className="text-ink-faint" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-[264px] overflow-hidden rounded-xl border border-line bg-raised p-1.5 shadow-pop animate-fadeUp"
          >
            <p className="px-2.5 py-2 text-[10px] font-bold uppercase tracking-widest text-ink-faint">
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
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                    role === r ? 'bg-inset' : 'hover:bg-inset'
                  )}
                >
                  <span
                    className={clsx(
                      'grid h-7 w-7 shrink-0 place-items-center rounded-md',
                      role === r ? 'bg-navy text-white' : 'bg-inset text-ink-mute'
                    )}
                  >
                    <Icon name={m.icon} size={13} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-bold text-ink">{m.label}</span>
                    <span className="block text-[10.5px] text-ink-faint">{m.desc}</span>
                  </span>
                  {role === r && <Icon name="check" size={13} className="text-emerald2" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export function PublicHeader() {
  const { role } = useApp()
  const { t } = usePrefs()
  const [mobile, setMobile] = useState(false)
  const loc = useLocation()

  React.useEffect(() => setMobile(false), [loc.pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-xl">
      {/* Johor flag rule — thin, structural, not decorative noise */}
      <div className="johor-rule opacity-90" />
      <div className="shell flex h-[58px] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {PUBLIC_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  clsx(
                    'relative rounded-md px-2.5 py-2 text-[13px] font-semibold transition-colors',
                    isActive ? 'text-ink' : 'text-ink-mute hover:text-ink'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {t(l.key)}
                    {isActive && (
                      <span className="absolute inset-x-2.5 -bottom-[11px] h-[2px] rounded-full bg-johor" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          {/* preference cluster — desktop */}
          <div className="hidden items-center gap-1.5 xl:flex">
            <LanguageToggle />
            <CurrencySelect />
            <ThemeToggle />
          </div>

          <span className="hidden h-5 w-px bg-line xl:block" aria-hidden="true" />

          <RoleSwitcher compact />
          <Link to="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
            {t('nav.signIn')}
          </Link>
          <button
            onClick={() => setMobile((m) => !m)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink lg:hidden"
            aria-label={mobile ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={mobile}
          >
            <Icon name={mobile ? 'x' : 'menu'} size={16} />
          </button>
        </div>
      </div>

      {mobile && (
        <div className="border-t border-line bg-raised lg:hidden animate-fadeUp">
          <nav className="shell flex flex-col py-2" aria-label="Mobile">
            {PUBLIC_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between rounded-lg px-3 py-2.5 text-[13.5px] font-semibold',
                    isActive ? 'bg-inset text-ink' : 'text-ink-soft'
                  )
                }
              >
                {t(l.key)}
              </NavLink>
            ))}

            {/* preferences live in the mobile sheet — per brief */}
            <div className="mt-2 border-t border-line pt-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                {t('nav.preferences')}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <LanguageToggle />
                <CurrencySelect />
                <ThemeToggle />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
              <Link to="/login" className="btn btn-ghost btn-sm">
                {t('nav.signIn')}
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                {t('nav.register')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export function PublicFooter() {
  const { t } = usePrefs()
  return (
    <footer className="mt-10 border-t border-line" style={{ background: 'var(--bg-sunken)' }}>
      <div className="shell py-10">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-ink-mute">{t('footer.tagline')}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-inset px-2 py-1 text-[10.5px] font-semibold text-ink-soft">
              <Icon name="flask-conical" size={11} />
              {t('common.demoNotice')}
            </div>
          </div>
          {[
            {
              title: t('footer.discover'),
              links: [
                [t('nav.explore'), '/explore'],
                [t('nav.corridor'), '/explore/stations'],
                [t('nav.map'), '/map'],
                [t('nav.howItWorks'), '/how-it-works'],
              ],
            },
            {
              title: t('footer.portals'),
              links: [
                [t('visitor.portal'), '/visitor/dashboard'],
                [t('sme.portal'), '/sme/dashboard'],
                [t('admin.portal'), '/admin/dashboard'],
                [t('admin.impact'), '/admin/impact'],
              ],
            },
            {
              title: t('footer.about'),
              links: [
                [t('nav.about'), '/about'],
                [t('auth.signUp'), '/register'],
                [t('auth.signIn'), '/login'],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-widest text-ink-faint">{col.title}</p>
              <ul className="space-y-1.5">
                {col.links.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-[12.5px] text-ink-soft transition-colors hover:text-accent">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-5 text-[11px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 JOHOR360 · {t('footer.rights')}</p>
          <p className="flex items-center gap-1.5">
            <Icon name="info" size={11} />
            {t('footer.photoCredit')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export { ROLE_META }
