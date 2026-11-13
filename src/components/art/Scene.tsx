import React, { useMemo } from 'react'
import type { CategoryId } from '../../types'

/**
 * Procedural editorial artwork.
 *
 * JOHOR360 ships no stock photography: the mockup uses generated SVG scenes so
 * there is no image licensing exposure, no broken-image risk on venue wifi, and
 * consistent art direction across every card. Each scene is deterministic from
 * its seed, so a listing always looks the same.
 *
 * V2 goes for photographic *depth* rather than flat gradients: a graded sky, a
 * warm light source, layered silhouettes at three depths, foreground framing,
 * film grain and a vignette. It reads as an editorial illustration of a place,
 * and is labelled as illustration in the UI — never as a photograph.
 */

export const SCENE_PALETTES: Record<
  CategoryId,
  { sky: [string, string]; ground: string; accent: string; far: string; mid: string }
> = {
  food: { sky: ['#1B0F0A', '#7A3A18'], ground: '#241209', accent: '#F0B65C', far: '#8C4A22', mid: '#4E2612' },
  culture: { sky: ['#1E0A16', '#8A1F33'], ground: '#2A0E1A', accent: '#F5C574', far: '#A83248', mid: '#5E1424' },
  heritage: { sky: ['#050F22', '#2A4A7A'], ground: '#0A1730', accent: '#E2B45E', far: '#3A6094', mid: '#16294A' },
  nature: { sky: ['#04120F', '#12564A'], ground: '#071E1A', accent: '#7FE0B4', far: '#1C6E5C', mid: '#0C3A32' },
  agriculture: { sky: ['#141B08', '#5A7326'], ground: '#1B2410', accent: '#DCE87C', far: '#6E8A34', mid: '#38461C' },
  workshops: { sky: ['#170E20', '#553A6B'], ground: '#1E1329', accent: '#E0AEFF', far: '#6E4E86', mid: '#3A2650' },
  education: { sky: ['#05131E', '#1E4E72'], ground: '#081B29', accent: '#93C6F0', far: '#2C6690', mid: '#123A54' },
  leisure: { sky: ['#0E0918', '#40285E'], ground: '#160F26', accent: '#F5CE7A', far: '#523C7A', mid: '#2A1E44' },
  wellness: { sky: ['#08171C', '#2A5F68'], ground: '#0B2228', accent: '#A8E8DC', far: '#3A7884', mid: '#164048' },
  community: { sky: ['#1B0F07', '#7A3C1C'], ground: '#241408', accent: '#F5BE72', far: '#8E4E26', mid: '#4E2812' },
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
  const H = variant === 'hero' ? 420 : variant === 'thumb' ? 200 : 360

  const orbX = 140 + rnd(s, 1) * 360
  const orbY = H * (0.2 + rnd(s, 2) * 0.12)
  const orbR = 18 + rnd(s, 3) * 14

  // three silhouette ridges at different depths
  const ridge = (depth: number) => {
    const base = H * (0.5 + depth * 0.13)
    const amp = 18 + rnd(s, 40 + depth) * 30
    return `M0 ${base} Q ${W * 0.18} ${base - amp}, ${W * 0.36} ${base - amp * 0.4} T ${W * 0.72} ${base + amp * 0.35} T ${W} ${base - amp * 0.2} L ${W} ${H} L 0 ${H} Z`
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Illustrated scene representing a ${category} experience in Johor`}
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="62%" stopColor={p.sky[1]} />
          <stop offset="100%" stopColor={p.far} />
        </linearGradient>
        <radialGradient id={`${uid}-sun`}>
          <stop offset="0%" stopColor={p.accent} stopOpacity="1" />
          <stop offset="34%" stopColor={p.accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${uid}-warm`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.10" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </linearGradient>
        {/* film grain — kills the flat-vector look */}
        <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* sky */}
      <rect width={W} height={H} fill={`url(#${uid}-sky)`} />

      {/* light source + bloom */}
      <circle cx={orbX} cy={orbY} r={orbR * 4.2} fill={`url(#${uid}-sun)`} />
      <circle cx={orbX} cy={orbY} r={orbR} fill={p.accent} opacity="0.92" />
      <circle cx={orbX} cy={orbY} r={orbR * 1.55} fill={p.accent} opacity="0.16" filter={`url(#${uid}-soft)`} />

      {/* light sweep across the frame */}
      <rect width={W} height={H} fill={`url(#${uid}-warm)`} opacity="0.55" />

      {/* far ridge */}
      <path d={ridge(0)} fill={p.far} opacity="0.22" />
      {/* mid ridge */}
      <path d={ridge(1)} fill={p.mid} opacity="0.85" />

      {/* motif layer — the subject */}
      <g>{renderMotif(m, s, p, W, H, variant)}</g>

      {/* near silhouette — frames the bottom of the frame */}
      <path d={ridge(2.6)} fill={p.ground} />

      {/* vignette + grain */}
      <rect width={W} height={H} fill={`url(#${uid}-vig)`} />
      <rect width={W} height={H} filter={`url(#${uid}-grain)`} opacity="0.055" style={{ mixBlendMode: 'overlay' }} />
    </svg>
  )
}

function renderMotif(
  m: NonNullable<SceneProps['motif']>,
  s: number,
  p: { accent: string; far: string; ground: string; mid: string },
  W: number,
  H: number,
  variant: string
): React.ReactNode {
  const baseY = H * (variant === 'thumb' ? 0.7 : 0.74)
  const detail = variant === 'thumb' ? 0.7 : 1

  if (m === 'shophouse') {
    const n = 5
    const bw = W / n
    return (
      <g>
        {Array.from({ length: n }, (_, i) => {
          const h = (110 + rnd(s, i + 20) * 120) * detail
          const x = i * bw
          return (
            <g key={i}>
              {/* building mass */}
              <rect x={x + 2} y={baseY - h} width={bw - 4} height={h} fill={p.ground} />
              {/* roof fascia — the red tiled line */}
              <rect x={x + 2} y={baseY - h} width={bw - 4} height={7} fill={p.accent} opacity="0.8" />
              {/* upper shuttered windows, warm-lit */}
              {Array.from({ length: 2 }, (_, r) => {
                const wy = baseY - h + 26 + r * 40
                const lit = rnd(s, i * 7 + r + 60) > 0.42
                return (
                  <g key={r}>
                    <rect x={x + 12} y={wy} width={bw * 0.26} height={22} fill={lit ? p.accent : '#000'} opacity={lit ? 0.62 : 0.3} />
                    <rect x={x + bw * 0.56} y={wy} width={bw * 0.26} height={22} fill={lit ? p.accent : '#000'} opacity={lit ? 0.4 : 0.26} />
                    {/* shutter slats */}
                    <line x1={x + 12} y1={wy + 11} x2={x + 12 + bw * 0.26} y2={wy + 11} stroke="#000" strokeWidth="0.8" opacity="0.3" />
                  </g>
                )
              })}
              {/* five-foot way arcade */}
              <rect x={x + 2} y={baseY - 34} width={bw - 4} height={34} fill="#000" opacity="0.42" />
              <rect x={x + 10} y={baseY - 30} width={bw - 20} height={26} fill={p.accent} opacity="0.1" />
            </g>
          )
        })}
        {/* street lamp — a small human-scale cue */}
        <g>
          <rect x={W * 0.08} y={baseY - 104} width="2" height="104" fill="#000" opacity="0.55" />
          <circle cx={W * 0.08 + 1} cy={baseY - 106} r="9" fill={p.accent} opacity="0.35" />
          <circle cx={W * 0.08 + 1} cy={baseY - 106} r="3.4" fill={p.accent} />
        </g>
      </g>
    )
  }

  if (m === 'rails') {
    return (
      <g>
        {/* converging track — draws the eye to the vanishing point */}
        <path d={`M${W * 0.5} ${baseY - 78} L ${W * 0.06} ${baseY + 46}`} stroke={p.accent} strokeWidth="3" opacity="0.42" />
        <path d={`M${W * 0.5} ${baseY - 78} L ${W * 0.94} ${baseY + 46}`} stroke={p.accent} strokeWidth="3" opacity="0.42" />
        {Array.from({ length: 14 }, (_, i) => {
          const t = i / 14
          const y = baseY - 78 + t * 124
          const halfW = 5 + t * W * 0.44
          return (
            <line
              key={i}
              x1={W / 2 - halfW}
              y1={y}
              x2={W / 2 + halfW}
              y2={y}
              stroke="#000"
              strokeWidth={1.4 + t * 1.6}
              opacity={0.2 + t * 0.3}
            />
          )
        })}
        {/* catenary masts */}
        {[0.18, 0.34, 0.66, 0.82].map((px, i) => (
          <g key={i} opacity="0.5">
            <rect x={W * px} y={baseY - 110} width="2" height="110" fill="#000" />
            <rect x={W * px} y={baseY - 110} width={W * 0.09} height="2" fill="#000" />
          </g>
        ))}
        {/* locomotive silhouette at the vanishing point */}
        <g>
          <rect x={W * 0.5 - 16} y={baseY - 96} width="32" height="18" rx="3" fill={p.ground} />
          <rect x={W * 0.5 - 16} y={baseY - 96} width="32" height="4" rx="2" fill={p.accent} opacity="0.85" />
          <circle cx={W * 0.5 - 9} cy={baseY - 76} r="3" fill="#000" />
          <circle cx={W * 0.5 + 9} cy={baseY - 76} r="3" fill="#000" />
        </g>
      </g>
    )
  }

  if (m === 'field') {
    return (
      <g>
        {/* rows receding into depth */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i / 40) * W + rnd(s, i) * 10
          const depth = rnd(s, i + 3)
          const hh = (24 + depth * 62) * detail
          return (
            <g key={i} opacity={0.34 + depth * 0.42}>
              <line x1={x} y1={baseY + 26} x2={x + depth * 4} y2={baseY + 26 - hh} stroke={p.accent} strokeWidth={1.4 + depth} />
              <circle cx={x + depth * 4} cy={baseY + 26 - hh} r={1.8 + depth * 2.4} fill={p.accent} opacity="0.75" />
            </g>
          )
        })}
        {/* palm silhouette for scale */}
        <g opacity="0.6">
          <rect x={W * 0.82} y={baseY - 92} width="4" height="92" fill="#000" />
          {[-52, -26, 0, 26, 52].map((a, i) => (
            <path
              key={i}
              d={`M${W * 0.82 + 2} ${baseY - 92} q ${a} -22 ${a * 1.4} -6`}
              stroke="#000"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>
    )
  }

  if (m === 'river') {
    return (
      <g>
        {/* water plane with specular streaks */}
        <path d={`M0 ${baseY} Q ${W * 0.3} ${baseY - 20}, ${W * 0.55} ${baseY + 8} T ${W} ${baseY - 6} L ${W} ${H} L 0 ${H} Z`} fill={p.accent} opacity="0.13" />
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={i}
            d={`M${rnd(s, i + 50) * W * 0.8} ${baseY + 8 + i * 13} q 30 -5 60 0 t 60 0`}
            stroke={p.accent}
            strokeWidth="1.4"
            fill="none"
            opacity={0.12 + rnd(s, i + 60) * 0.2}
          />
        ))}
        {/* treeline */}
        {Array.from({ length: 6 }, (_, i) => {
          const x = W * 0.08 + i * (W * 0.17)
          const hh = (62 + rnd(s, i + 70) * 70) * detail
          return (
            <g key={i} opacity="0.72">
              <rect x={x} y={baseY - hh * 0.45} width="3" height={hh * 0.45} fill="#000" />
              <ellipse cx={x + 1.5} cy={baseY - hh * 0.62} rx={18 + rnd(s, i + 80) * 14} ry={24 + rnd(s, i + 90) * 16} fill={p.ground} />
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
          const cx = W * (0.26 + i * 0.24)
          const cy = baseY - 18
          const sc = 0.85 + i * 0.1
          return (
            <g key={i} opacity={0.62 + i * 0.12}>
              {/* bench */}
              <ellipse cx={cx} cy={cy + 12} rx={44 * sc} ry={8} fill="#000" opacity="0.4" />
              <rect x={cx - 42 * sc} y={cy + 2} width={84 * sc} height="7" rx="3" fill={p.ground} />
              {/* spinning form on the wheel head */}
              <path d={`M${cx - 34 * sc} ${cy + 2} q ${34 * sc} -30 ${68 * sc} 0`} stroke={p.accent} strokeWidth="4.5" fill="none" opacity="0.75" />
              <ellipse cx={cx} cy={cy - 8} rx={20 * sc} ry={8} fill={p.accent} opacity="0.55" />
              <ellipse cx={cx} cy={cy - 16} rx={14 * sc} ry={6} fill={p.accent} opacity="0.4" />
            </g>
          )
        })}
      </g>
    )
  }

  if (m === 'loom') {
    return (
      <g opacity="0.9">
        {/* warp threads */}
        <rect x={W * 0.12} y={baseY - 84} width={W * 0.76} height="3" rx="1.5" fill={p.accent} opacity="0.6" />
        <rect x={W * 0.12} y={baseY - 24} width={W * 0.76} height="3" rx="1.5" fill={p.accent} opacity="0.42" />
        {Array.from({ length: 34 }, (_, i) => (
          <line
            key={i}
            x1={W * 0.12 + (i / 34) * W * 0.76}
            y1={baseY - 80}
            x2={W * 0.12 + (i / 34) * W * 0.76}
            y2={baseY - 26}
            stroke={p.accent}
            strokeWidth="1.1"
            opacity={0.14 + (i % 4) * 0.07}
          />
        ))}
        {/* woven band — the finished cloth */}
        <rect x={W * 0.34} y={baseY - 52} width={W * 0.3} height="20" rx="2" fill={p.accent} opacity="0.35" />
        <rect x={W * 0.34} y={baseY - 52} width={W * 0.3} height="6" rx="2" fill={p.accent} opacity="0.6" />
        {/* loom frame */}
        <rect x={W * 0.1} y={baseY - 88} width="4" height="76" fill={p.ground} />
        <rect x={W * 0.88} y={baseY - 88} width="4" height="76" fill={p.ground} />
      </g>
    )
  }

  // table / food
  return (
    <g>
      {/* table plane */}
      <ellipse cx={W * 0.5} cy={baseY + 22} rx={W * 0.4} ry={20} fill="#000" opacity="0.35" />
      <rect x={W * 0.12} y={baseY - 6} width={W * 0.76} height="12" rx="5" fill={p.ground} />
      <rect x={W * 0.12} y={baseY - 6} width={W * 0.76} height="3" rx="1.5" fill={p.accent} opacity="0.45" />
      {/* dishes */}
      {Array.from({ length: 3 }, (_, i) => {
        const cx = W * (0.3 + i * 0.2)
        return (
          <g key={i}>
            <ellipse cx={cx} cy={baseY - 14} rx={26} ry={9} fill={p.far} opacity="0.9" />
            <ellipse cx={cx} cy={baseY - 18} rx={19} ry={7} fill={p.accent} opacity={0.3 + i * 0.13} />
            {/* steam */}
            <path
              d={`M${cx - 4} ${baseY - 30} q 5 -12 -2 -22`}
              stroke={p.accent}
              strokeWidth="1.6"
              fill="none"
              opacity="0.3"
              strokeLinecap="round"
            />
            <path
              d={`M${cx + 5} ${baseY - 32} q -5 -14 2 -24`}
              stroke={p.accent}
              strokeWidth="1.4"
              fill="none"
              opacity="0.2"
              strokeLinecap="round"
            />
          </g>
        )
      })}
      {/* hanging lamp — intimacy cue */}
      <g>
        <rect x={W * 0.5} y="0" width="1.5" height={baseY - 96} fill="#000" opacity="0.4" />
        <path d={`M${W * 0.5 - 18} ${baseY - 96} q 18 -14 36 0 z`} fill={p.ground} />
        <circle cx={W * 0.5} cy={baseY - 92} r="4" fill={p.accent} opacity="0.85" />
      </g>
    </g>
  )
}
