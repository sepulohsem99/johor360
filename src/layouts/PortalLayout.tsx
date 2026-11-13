import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../app/store'
import Icon from '../components/ui/Icon'
import Logo, { RoleSwitcher } from './PublicLayout'
import { resetAll } from '../services/storage'

export interface NavItem {
  to: string
  label: string
  icon: string
  end?: boolean
  badge?: number
}

interface PortalLayoutProps {
  title: string
  subtitle: string
  items: NavItem[]
  accent?: 'visitor' | 'sme' | 'admin'
  headerRight?: React.ReactNode
}

export default function PortalLayout({ title, subtitle, items, accent = 'visitor', headerRight }: PortalLayoutProps) {
  const { profile } = useApp()
  const [mobileNav, setMobileNav] = useState(false)
  const nav = useNavigate()

  const accentBg =
    accent === 'sme' ? 'bg-emerald2-600' : accent === 'admin' ? 'bg-navy-800' : 'bg-royal-600'

  return (
    <div className="min-h-screen bg-canvas">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 glass">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo compact />
            <div className="hidden h-6 w-px bg-line sm:block" />
            <div className="hidden sm:block">
              <p className={clsx('text-[10px] font-bold uppercase tracking-[0.14em] text-white/0', accentBg)} aria-hidden />
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-faint">{subtitle}</p>
              <p className="text-[14px] font-bold leading-tight text-navy">{title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {headerRight}
            <RoleSwitcher compact />
            <button
              onClick={() => setMobileNav((m) => !m)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-navy lg:hidden"
              aria-label="Toggle portal navigation"
            >
              <Icon name="menu" size={17} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px]">
        {/* sidebar */}
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-50 w-[264px] shrink-0 overflow-y-auto border-r border-line bg-white pt-4 transition-transform lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0',
            mobileNav ? 'translate-x-0 shadow-pop' : '-translate-x-full'
          )}
        >
          <div className="mb-4 flex items-center justify-between px-4 lg:hidden">
            <Logo />
            <button onClick={() => setMobileNav(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-ink-mute">
              <Icon name="x" size={17} />
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className={clsx('rounded-xl p-3 text-white', accentBg)}>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                {accent === 'visitor' ? 'Visitor account' : accent === 'sme' ? 'Operator account' : 'Staff account'}
              </p>
              <p className="mt-0.5 truncate text-[13px] font-bold">
                {accent === 'visitor' ? profile.name || 'Guest visitor' : accent === 'sme' ? 'Sri Kluang Batik Studio' : 'JOHOR360 Admin'}
              </p>
              <p className="mt-0.5 truncate text-[10.5px] opacity-60">
                {accent === 'visitor' ? profile.country : accent === 'sme' ? 'Kluang, Johor' : 'Platform operations'}
              </p>
            </div>
          </div>

          <nav className="px-3 pb-6" aria-label={`${title} navigation`}>
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                onClick={() => setMobileNav(false)}
                className={({ isActive }) =>
                  clsx(
                    'mb-0.5 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors',
                    isActive
                      ? 'bg-navy-50 text-navy'
                      : 'text-ink-mute hover:bg-navy-50/60 hover:text-navy'
                  )
                }
              >
                <Icon name={it.icon} size={16} />
                <span className="flex-1">{it.label}</span>
                {it.badge ? (
                  <span className="rounded-full bg-johor px-1.5 py-0.5 text-[10px] font-bold text-white num">
                    {it.badge}
                  </span>
                ) : null}
              </NavLink>
            ))}

            <div className="mt-5 space-y-1 border-t border-line pt-4">
              <Link
                to="/"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-ink-mute hover:bg-navy-50/60 hover:text-navy"
              >
                <Icon name="home" size={16} /> Public site
              </Link>
              <button
                onClick={() => {
                  if (confirm('Reset all demo data and return to the seeded state?')) {
                    resetAll()
                    window.location.href = '/'
                  }
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-ink-mute hover:bg-johor-50 hover:text-johor"
              >
                <Icon name="rotate-ccw" size={16} /> Reset demo data
              </button>
            </div>
          </nav>
        </aside>

        {mobileNav && (
          <div className="fixed inset-0 z-40 bg-navy-950/40 lg:hidden" onClick={() => setMobileNav(false)} aria-hidden />
        )}

        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 lg:pb-14">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Toasts
export function ToastStack() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={clsx(
            'pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-white p-3 shadow-pop animate-fadeUp',
            t.tone === 'error' ? 'border-johor-200' : t.tone === 'info' ? 'border-royal-200' : 'border-emerald2-200'
          )}
        >
          <span
            className={clsx(
              'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white',
              t.tone === 'error' ? 'bg-johor' : t.tone === 'info' ? 'bg-royal' : 'bg-emerald2'
            )}
          >
            <Icon name={t.tone === 'error' ? 'alert-triangle' : t.tone === 'info' ? 'info' : 'check'} size={13} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-navy">{t.title}</p>
            {t.body && <p className="mt-0.5 text-[12px] leading-snug text-ink-mute">{t.body}</p>}
          </div>
          <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-ink-faint hover:text-navy">
            <Icon name="x" size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
