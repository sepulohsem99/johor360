import i18n from '../i18n'

/**
 * The matching engine and itinerary generator emit *reason keys*, not prose:
 *   "reason.atStation"
 *   "reason.fitsBudget|150|95"
 * so the same recommendation logic serves both languages. This resolver turns
 * a key + its pipe-separated params into a localised string.
 */
export function tReason(raw: string): string {
  if (!raw) return ''
  const [key, ...params] = raw.split('|')

  switch (key) {
    case 'reason.atStation':
      return i18n.t('reason.atStation')
    case 'reason.nearStation':
      return i18n.t('reason.nearStation', { mins: Number(params[0]), station: params[1] })
    case 'reason.fitsBudget':
      return i18n.t('reason.fitsBudget', { budget: Number(params[0]), price: Number(params[1]) })
    case 'reason.purposeFit':
      return i18n.t('reason.purposeFit', { purpose: i18n.t(`purpose.${params[0]}`) })
    case 'reason.stepFree':
      return i18n.t('reason.stepFree')
    case 'reason.indoor':
      return i18n.t('reason.indoor')
    case 'reason.duration':
      return i18n.t('reason.duration', { hours: params[0] })
    case 'reason.overallFit':
      return i18n.t('reason.overallFit')
    default:
      // already-human text (legacy data) — pass through untouched
      return raw
  }
}

export function tReasons(list?: string[]): string[] | undefined {
  if (!list) return undefined
  return list.map(tReason)
}
