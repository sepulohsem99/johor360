import type { ComponentType } from 'react'
import { ICONS } from './icons'

interface IconProps {
  name: string
  size?: number
  className?: string
  strokeWidth?: number
}

/** Lucide icon looked up from the trimmed registry in `icons.ts`. */
export default function Icon({ name, size = 18, className, strokeWidth = 1.9 }: IconProps) {
  const C = (ICONS[name] ?? ICONS.circle) as ComponentType<{
    size?: number
    className?: string
    strokeWidth?: number
  }>
  return <C size={size} className={className} strokeWidth={strokeWidth} aria-hidden="true" />
}
