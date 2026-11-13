import { Fragment, type ReactNode } from 'react'
import { usePrefs } from '../../app/prefs'

/**
 * Inline translator for UI copy.
 *
 * Wraps a plain English sentence and renders it in the active language:
 *     <T>Top matches for you</T>
 *
 * Why a component and not a `t()` call at every site: this interface was
 * written English-first with the copy sitting directly in JSX. `<T>` lets the
 * copy stay where a designer expects to find it, re-renders correctly when the
 * language changes (it consumes the preference context), and falls back to the
 * English original if a row is missing — a missing translation can never blank
 * out the interface.
 */
export function T({ children }: { children: ReactNode }) {
  const { tx } = usePrefs()
  if (typeof children !== 'string') return <>{children}</>
  return <Fragment>{tx(children)}</Fragment>
}

export default T
