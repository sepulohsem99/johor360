import { Fragment, type ReactNode } from 'react'
import { usePrefs } from '../../app/prefs'

/**
 * Inline translator for UI copy.
 *
 * Wraps a plain English sentence and renders it in the active language:
 *     <T>Top matches for you</T>
 *
 * A component rather than a `t()` call at every site: this interface was
 * written English-first with copy sitting directly in JSX, and <T> re-renders
 * correctly on language change. Missing rows fall back to English rather than
 * blanking the interface.
 */
export function T({ children }: { children: ReactNode }) {
  const { tx } = usePrefs()
  if (typeof children !== 'string') return <>{children}</>
  return <Fragment>{tx(children)}</Fragment>
}

export default T
