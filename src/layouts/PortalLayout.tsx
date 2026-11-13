import React, { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../app/store'
import { usePrefs } from '../app/prefs'
import Icon from '../components/ui/Icon'
import Logo, { RoleSwitcher } from './PublicLayout'
import { LanguageToggle, ThemeToggle, CurrencySelect } from '../components/ui/controls'
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
  const { t } = usePrefs()
  const [mobileNav, setMobileNav] = useState(false)

  const accentBg =
    accent === 'sme' ? 'bg-emerald2-600' : accent === 'admin' ? 'bg-navy' : 'bg-navy'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-sunken)' }}>
      <header className="sticky top-0 z-40 border-b border-line glass">
        <div className="johor-rule opacity-90" />
        <div className="mx-auto flex h-[58px] w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Logo compact />
            <div className="hidden h-5 w-px bg-line sm:block" />
            <div className="hidden min-w-0 sm:block">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-faint">{subtitle}</p>
              <p className="truncate text-[13px] font-bold leading-tight text-ink">{title}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {headerRight}
            <div className="hidden items-center gap-1.5 xl:flex">
              <LanguageToggle />
              <CurrencySelect />
              <ThemeToggle />
            </div>
            <RoleSwitcher compact />
            <button
              onClick={() => setMobileNav((m) => !m)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink lg:hidden"
              aria-label={t('nav.openMenu')}
            >
              <Icon name="menu" size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-50 w-[252px] shrink-0 overflow-y-auto border-r border-line bg-raised pt-3 transition-transform lg:sticky lg:top-[61px] lg:z-0 lg:h-[calc(100vh-61px)] lg:translate-x-0',
            mobileNav ? 'translate-x-0 shadow-pop' : '-translate-x-full'
          )}
        >
          <div className="mb-3 flex items-center justify-between px-4 lg:hidden">
            <Logo />
            <button
              onClick={() => setMobileNav(false)}
              aria-label={t('common.close')}
              className="grid h-8 w-8 place-items-center rounded-lg text-ink-mute"
            >
              <Icon name="x" size={16} />
            </button>
          </div>

          <div className="px-3 pb-3">
            <div className={clsx('rounded-lg p-3 text-white', accentBg)}>
              <p className="text-[9.5px] font-bold uppercase tracking-wider opacity-70">
                {accent === 'visitor'
                  ? t('visitor.portal')
                  : accent === 'sme'
                    ? t('sme.portal')
                    : t('admin.portal')}
              </p>
              <p className="mt-0.5 truncate text-[12.5px] font-bold">
                {accent === 'visitor'
                  ? profile.name || 'Guest visitor'
                  : accent === 'sme'
                    ? 'Sri Kluang Batik Studio'
                    : 'JOHOR360 Admin'}
              </p>
              <p className="mt-0.5 truncate text-[10px] opacity-70">
                {accent === 'visitor'
                  ? profile.country
                  : accent === 'sme'
                    ? 'Kluang, Johor'
                    : 'Platform operations'}
              </p>
            </div>

            {/* preferences inside the portal sidebar — theme/lang/currency must work in every portal */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 xl:hidden">
              <LanguageToggle />
              <CurrencySelect />
              <ThemeToggle />
            </div>
          </div>

          <nav className="px-2 pb-6" aria-label={`${title} navigation`}>
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                onClick={() => setMobileNav(false)}
                className={({ isActive }) =>
                  clsx(
                    'mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold transition-colors',
                    isActive ? 'bg-inset text-ink' : 'text-ink-mute hover:bg-inset hover:text-ink'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={it.icon} size={15} className={isActive ? 'text-accent' : ''} />
                    <span className="flex-1">{it.label}</span>
                    {it.badge ? (
                      <span className="rounded-full bg-johor px-1.5 py-0.5 text-[9.5px] font-bold text-white num">
                        {it.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}

            <div className="mt-4 space-y-0.5 border-t border-line pt-3">
              <Link
                to="/"
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold text-ink-mute hover:bg-inset hover:text-ink"
              >
                <Icon name="home" size={15} /> {t('nav.explore')}
              </Link>
              <button
                onClick={() => {
                  if (confirm('Reset all demo data and return to the seeded state?')) {
                    resetAll()
                    window.location.href = '/'
                  }
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold text-ink-mute hover:bg-accent-soft hover:text-accent"
              >
                <Icon name="rotate-ccw" size={15} /> {t('admin.resetDemo')}
              </button>
            </div>
          </nav>
        </aside>

        {mobileNav && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileNav(false)}
            aria-hidden
          />
        )}

        <main className="min-w-0 flex-1 px-4 pb-20 pt-5 sm:px-6 lg:pb-12">
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
      {toasts.map((item) => (
        <div
          key={item.id}
          role="status"
          className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-line bg-raised p-3 shadow-pop animate-fadeUp"
        >
          <span
            className={clsx(
              'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white',
              item.tone === 'error' ? 'bg-johor' : item.tone === 'info' ? 'bg-navy' : 'bg-emerald2'
            )}
          >
            <Icon
              name={item.tone === 'error' ? 'alert-triangle' : item.tone === 'info' ? 'info' : 'check'}
              size={13}
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-bold text-ink">{item.title}</p>
            {item.body && <p className="mt-0.5 text-[11.5px] leading-snug text-ink-mute">{item.body}</p>}
          </div>
          <button
            onClick={() => dismissToast(item.id)}
            aria-label="Dismiss"
            className="text-ink-faint hover:text-ink"
          >
            <Icon name="x" size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
