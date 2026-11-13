import React, { useMemo } from 'react'
import type { CategoryId } from '../../types'

/**
 * Procedural scene artwork.
 *
 * JOHOR360 ships no stock photography: the mockup uses generated SVG scenes so
 * there is no image licensing exposure, no broken-image risk on venue wifi, and
 * consistent art direction across every card. Each scene is deterministic from
 * its seed, so a listing always looks the same.
 */

export const SCENE_PALETTES: Record<CategoryId, { sky: [string, string]; ground: string; accent: string; far: string }> = {
  food: { sky: ['#2A1C14', '#6B3E24'], ground: '#3A2418', accent: '#E5AE45', far: '#8A5A32' },
  culture: { sky: ['#2A1220', '#7A2434'], ground: '#3A1A24', accent: '#F2C86E', far: '#A03A48' },
  heritage: { sky: ['#0B1F3A', '#2E4B72'], ground: '#16283F', accent: '#E5AE45', far: '#3F5D85' },
  nature: { sky: ['#0C2A26', '#17584A'], ground: '#0E332C', accent: '#7FD9B0', far: '#1E6B58' },
  agriculture: { sky: ['#1E2A14', '#4E6B2A'], ground: '#28361A', accent: '#D8E27A', far: '#6E8C3C' },
  workshops: { sky: ['#241A2E', '#4E3760'], ground: '#2C2038', accent: '#D9A6F0', far: '#6B4E80' },
  education: { sky: ['#0E2436', '#1F4F72'], ground: '#132F45', accent: '#8ABDEE', far: '#2A6389' },
  leisure: { sky: ['#171228', '#3A2A5E'], ground: '#1E1832', accent: '#F2C86E', far: '#4E3A78' },
  wellness: { sky: ['#12262E', '#2C5A62'], ground: '#16303A', accent: '#9FE3D6', far: '#3A7480' },
  community: { sky: ['#2A1810', '#6E3A20'], ground: '#331E14', accent: '#F0B26A', far: '#8C4C2A' },
}

function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/** Deterministic pseudo-random in [0,1) */
function rnd(seed: number, n: number) {
  const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453
  return x - Math.floor(x)
}

interface SceneProps {
  seed: string
  category: CategoryId
  className?: string
  /** 0 = wide card, 1 = tall hero */
  variant?: 'card' | 'hero' | 'thumb'
  motif?: 'shophouse' | 'loom' | 'trees' | 'wheel' | 'table' | 'rails' | 'field' | 'river'
}

const MOTIF_BY_CATEGORY: Record<CategoryId, SceneProps['motif']> = {
  food: 'table',
  culture: 'loom',
  heritage: 'shophouse',
  nature: 'river',
  agriculture: 'field',
  workshops: 'wheel',
  education: 'rails',
  leisure: 'shophouse',
  wellness: 'river',
  community: 'loom',
}

export default function Scene({ seed, category, className = '', variant = 'card', motif }: SceneProps) {
  const p = SCENE_PALETTES[category] ?? SCENE_PALETTES.heritage
  const s = useMemo(() => hash(seed), [seed])
  const m = motif ?? MOTIF_BY_CATEGORY[category] ?? 'shophouse'
  const uid = useMemo(() => `sc${s.toString(36).slice(0, 6)}`, [s])

  const W = 640
  const H = variant === 'hero' ? 400 : variant === 'thumb' ? 200 : 360

  // sun / moon
  const orbX = 90 + rnd(s, 1) * 400
  const orbY = 50 + rnd(s, 2) * 40
  const orbR = 26 + rnd(s, 3) * 22

  const hills = Array.from({ length: 4 }, (_, i) => {
    const base = H * (0.52 + i * 0.055)
    const amp = 22 + rnd(s, 10 + i) * 34
    const y1 = base - amp
    const y2 = base + amp * 0.5
    return `M0 ${base} Q ${W * 0.2} ${y1}, ${W * 0.42} ${base - amp * 0.4} T ${W * 0.78} ${y2} T ${W} ${base - amp * 0.3} L ${W} ${H} L 0 ${H} Z`
  })

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Illustrated scene representing a ${category} experience in Johor`}
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="100%" stopColor={p.sky[1]} />
        </linearGradient>
        <linearGradient id={`${uid}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${uid}-orb`}>
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.95" />
          <stop offset="70%" stopColor={p.accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${uid}-sky)`} />
      {/* atmospheric glow */}
      <rect width={W} height={H * 0.7} fill={`url(#${uid}-glow)`} opacity="0.45" />
      <circle cx={orbX} cy={orbY} r={orbR * 3.4} fill={`url(#${uid}-orb)`} />
      <circle cx={orbX} cy={orbY} r={orbR} fill={p.accent} opacity="0.85" />

      {/* far hills */}
      {hills.slice(0, 2).map((d, i) => (
        <path key={`h${i}`} d={d} fill={p.far} opacity={0.28 + i * 0.12} />
      ))}

      {/* motif layer */}
      <g opacity="0.95">{renderMotif(m, s, p, W, H, variant)}</g>

      {/* near hills */}
      <path d={hills[3]} fill={p.ground} opacity="0.95" />
      <path d={hills[2]} fill={p.ground} opacity="0.6" />

      <rect width={W} height={H} fill={`url(#${uid}-vig)`} />
    </svg>
  )
}

function renderMotif(
  m: NonNullable<SceneProps['motif']>,
  s: number,
  p: { accent: string; far: string; ground: string },
  W: number,
  H: number,
  variant: string
): React.ReactNode {
  const baseY = H * 0.78

  if (m === 'shophouse') {
    const n = 5
    const bw = W / n
    return (
      <g>
        {Array.from({ length: n }, (_, i) => {
          const h = 90 + rnd(s, i + 20) * 110
          const x = i * bw
          const airWells = Math.max(0, Math.floor(rnd(s, i + 30) * 3))
          return (
            <g key={i}>
              <rect x={x + 4} y={baseY - h} width={bw - 8} height={h} fill={p.far} opacity={0.5 + rnd(s, i + 40) * 0.25} />
              <rect x={x + 4} y={baseY - h} width={bw - 8} height={6} fill={p.accent} opacity="0.55" />
              {/* five-foot way */}
              <rect x={x + 4} y={baseY - 26} width={bw - 8} height={26} fill="#0B1F3A" opacity="0.5" />
              {/* shuttered windows */}
              {Array.from({ length: 2 }, (_, r) => (
                <g key={r}>
                  <rect x={x + 14} y={baseY - h + 24 + r * 34} width={bw * 0.24} height={20} fill="#F7E7C8" opacity="0.28" />
                  <rect x={x + bw * 0.52} y={baseY - h + 24 + r * 34} width={bw * 0.24} height={20} fill="#F7E7C8" opacity="0.22" />
                </g>
              ))}
              {airWells > 0 && <rect x={x + bw * 0.42} y={baseY - h + 18} width={6} height={h - 44} fill="#040D1A" opacity="0.5" />}
            </g>
          )
        })}
        {/* street lamp */}
        <g opacity="0.8">
          <rect x={W * 0.12} y={baseY - 96} width={2.5} height={96} fill={p.accent} opacity="0.55" />
          <circle cx={W * 0.12 + 1} cy={baseY - 98} r={7} fill={p.accent} />
        </g>
      </g>
    )
  }

  if (m === 'rails') {
    return (
      <g>
        {/* rail line converging */}
        <path d={`M${W * 0.5} ${baseY - 60} L ${W * 0.08} ${baseY + 40}`} stroke={p.accent} strokeWidth="3" opacity="0.5" />
        <path d={`M${W * 0.5} ${baseY - 60} L ${W * 0.92} ${baseY + 40}`} stroke={p.accent} strokeWidth="3" opacity="0.5" />
        {Array.from({ length: 12 }, (_, i) => {
          const t = i / 12
          const y = baseY - 60 + t * 100
          const halfW = 8 + t * W * 0.42
          return <line key={i} x1={W / 2 - halfW} y1={y} x2={W / 2 + halfW} y2={y} stroke={p.accent} strokeWidth="2" opacity={0.18 + t * 0.28} />
        })}
        <g opacity="0.85">
          <rect x={W * 0.5 - 12} y={baseY - 132} width={24} height={72} rx="4" fill={p.far} />
          <rect x={W * 0.5 - 12} y={baseY - 132} width={24} height={10} rx="3" fill={p.accent} opacity="0.9" />
        </g>
      </g>
    )
  }

  if (m === 'field') {
    return (
      <g>
        {Array.from({ length: 26 }, (_, i) => {
          const x = (i / 26) * W + rnd(s, i) * 14
          const hh = 30 + rnd(s, i + 7) * 56
          return (
            <g key={i}>
              <line x1={x} y1={baseY + 18} x2={x} y2={baseY + 18 - hh} stroke={p.accent} strokeWidth="2" opacity={0.3 + rnd(s, i + 9) * 0.3} />
              <circle cx={x} cy={baseY + 18 - hh} r={2.5 + rnd(s, i + 11) * 2} fill={p.accent} opacity="0.6" />
            </g>
          )
        })}
      </g>
    )
  }

  if (m === 'river') {
    return (
      <g>
        <path d={`M0 ${baseY} Q ${W * 0.3} ${baseY - 26}, ${W * 0.55} ${baseY + 6} T ${W} ${baseY - 10} L ${W} ${H} L 0 ${H} Z`} fill={p.accent} opacity="0.16" />
        {Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M${rnd(s, i + 50) * W} ${baseY + 12 + i * 14} q 26 -6 52 0 t 52 0`}
            stroke={p.accent}
            strokeWidth="1.6"
            fill="none"
            opacity={0.16 + rnd(s, i + 60) * 0.22}
          />
        ))}
        {/* tree silhouettes */}
        {Array.from({ length: 5 }, (_, i) => {
          const x = W * 0.12 + i * (W * 0.19)
          const hh = 70 + rnd(s, i + 70) * 60
          return (
            <g key={i} opacity="0.8">
              <rect x={x} y={baseY - hh * 0.5} width={3} height={hh * 0.5} fill={p.far} />
              <ellipse cx={x + 1.5} cy={baseY - hh * 0.62} rx={20 + rnd(s, i + 80) * 14} ry={26 + rnd(s, i + 90) * 16} fill={p.far} opacity="0.85" />
            </g>
          )
        })}
      </g>
    )
  }

  if (m === 'wheel') {
    return (
      <g>
        {Array.from({ length: 3 }, (_, i) => {
          const cx = W * (0.28 + i * 0.22)
          const cy = baseY - 24
          return (
            <g key={i} opacity={0.55 + i * 0.15}>
              <ellipse cx={cx} cy={cy + 8} rx={42} ry={9} fill="#040D1A" opacity="0.5" />
              <path d={`M${cx - 40} ${cy + 4} q 40 -34 80 0`} stroke={p.accent} strokeWidth="4" fill="none" opacity="0.7" />
              <ellipse cx={cx} cy={cy - 6} rx={22} ry={8} fill={p.far} />
              <ellipse cx={cx} cy={cy - 12} rx={18} ry={6} fill={p.accent} opacity="0.5" />
            </g>
          )
        })}
      </g>
    )
  }

  if (m === 'loom') {
    return (
      <g opacity="0.8">
        <rect x={W * 0.16} y={baseY - 78} width={W * 0.68} height={4} rx="2" fill={p.accent} opacity="0.55" />
        <rect x={W * 0.16} y={baseY - 26} width={W * 0.68} height={4} rx="2" fill={p.accent} opacity="0.4" />
        {Array.from({ length: 30 }, (_, i) => (
          <line
            key={i}
            x1={W * 0.16 + (i / 30) * W * 0.68}
            y1={baseY - 74}
            x2={W * 0.16 + (i / 30) * W * 0.68}
            y2={baseY - 26}
            stroke={p.accent}
            strokeWidth="1.2"
            opacity={0.14 + (i % 3) * 0.08}
          />
        ))}
        <rect x={W * 0.4} y={baseY - 46} width={W * 0.2} height={18} rx="3" fill={p.far} opacity="0.85" />
      </g>
    )
  }

  // table / food
  return (
    <g opacity="0.85">
      <ellipse cx={W * 0.5} cy={baseY + 10} rx={W * 0.34} ry={16} fill="#040D1A" opacity="0.4" />
      <rect x={W * 0.18} y={baseY - 14} width={W * 0.64} height={9} rx="4" fill={p.far} />
      {Array.from({ length: 3 }, (_, i) => {
        const cx = W * (0.32 + i * 0.18)
        return (
          <g key={i}>
            <ellipse cx={cx} cy={baseY - 22} rx={20} ry={7} fill={p.accent} opacity={0.35 + i * 0.12} />
            <path d={`M${cx - 8} ${baseY - 50} q 8 -8 16 0`} stroke={p.accent} strokeWidth="2" fill="none" opacity="0.4" />
          </g>
        )
      })}
    </g>
  )
}
