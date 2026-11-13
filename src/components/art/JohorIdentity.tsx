/**
 * JohorIdentity.tsx
 *
 * Branded, in-app illustration for the discovery header.
 *
 * WHY NOT PHOTOGRAPHY: the brief asks for authentic Johor photography from
 * appropriately licensed sources. We could not verify rights for any specific
 * photograph at build time, and the rules forbid presenting unverified or
 * AI-generated imagery as real locations. So this is an explicitly *illustrated*
 * skyline of Johor motifs — labelled as illustration in the UI. It never
 * pretends to be a photograph of a real place.
 */

import clsx from 'clsx'

export function JohorSkyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 300"
      className={clsx('h-full w-full', className)}
      role="img"
      aria-label="Illustration of Johor heritage rooftops and the ETS rail corridor"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A2050" />
          <stop offset="55%" stopColor="#123163" />
          <stop offset="100%" stopColor="#1B4278" />
        </linearGradient>
        <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0C979" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#D4A64A" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D4A85" />
          <stop offset="100%" stopColor="#163A6B" />
        </linearGradient>
      </defs>

      <rect width="640" height="300" fill="url(#sky)" />

      {/* sun / moon disc */}
      <circle cx="500" cy="86" r="34" fill="url(#warm)" opacity="0.85" />
      <circle cx="500" cy="86" r="52" fill="url(#warm)" opacity="0.10" />

      {/* distant ridge */}
      <path d="M0 196 L60 172 L110 186 L168 158 L232 182 L300 160 L368 184 L430 164 L500 186 L566 168 L640 190 L640 300 L0 300 Z" fill="url(#far)" opacity="0.55" />

      {/* kampung house with the distinctive Johor gable roof */}
      <g opacity="0.95">
        <path d="M60 196 L128 150 L196 196 Z" fill="#0B1425" opacity="0.9" />
        <path d="M60 196 L128 150 L196 196 Z" fill="none" stroke="#D4A64A" strokeWidth="1.6" opacity="0.6" />
        <rect x="76" y="196" width="104" height="60" fill="#0D1B33" />
        {/* stilts */}
        <rect x="86" y="250" width="6" height="20" fill="#0B1425" />
        <rect x="164" y="250" width="6" height="20" fill="#0B1425" />
        {/* lit windows */}
        <rect x="96" y="214" width="20" height="22" fill="url(#warm)" opacity="0.8" />
        <rect x="140" y="214" width="20" height="22" fill="url(#warm)" opacity="0.55" />
      </g>

      {/* shophouse row */}
      <g opacity="0.92">
        {[250, 300, 350, 400].map((x, i) => (
          <g key={x}>
            <rect x={x} y={i % 2 ? 176 : 168} width="44" height={i % 2 ? 112 : 120} fill="#0C1A32" />
            <rect x={x} y={i % 2 ? 176 : 168} width="44" height="5" fill="#C8102E" opacity="0.55" />
            {[0, 1, 2].map((r) => (
              <rect
                key={r}
                x={x + 9}
                y={(i % 2 ? 192 : 184) + r * 30}
                width="26"
                height="17"
                fill="url(#warm)"
                opacity={r === 0 ? 0.62 : 0.34}
              />
            ))}
          </g>
        ))}
      </g>

      {/* rail viaduct — the ETS corridor, drawn as structure not scenery */}
      <g>
        <rect x="0" y="258" width="640" height="8" fill="#0A1526" />
        <rect x="0" y="258" width="640" height="2" fill="#D4A64A" opacity="0.75" />
        {Array.from({ length: 15 }).map((_, i) => (
          <rect key={i} x={i * 44 + 12} y="266" width="7" height="34" fill="#0A1526" opacity="0.9" />
        ))}
        {/* catenary masts */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} opacity="0.55">
            <rect x={i * 84 + 30} y="212" width="2" height="46" fill="#7C93B8" />
            <rect x={i * 84 + 30} y="212" width="22" height="2" fill="#7C93B8" />
          </g>
        ))}
        {/* train on the viaduct */}
        <g>
          <rect x="386" y="238" width="150" height="20" rx="4" fill="#E9EEF6" />
          <rect x="386" y="238" width="150" height="6" rx="3" fill="#C8102E" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={394 + i * 23} y="247" width="15" height="7" rx="1.5" fill="#21456F" opacity="0.85" />
          ))}
          <circle cx="404" cy="259" r="3.2" fill="#0B1425" />
          <circle cx="518" cy="259" r="3.2" fill="#0B1425" />
        </g>
      </g>

      {/* foreground rail sleepers */}
      <g opacity="0.35">
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={i} x={i * 33 + 6} y="292" width="22" height="4" rx="1" fill="#8FA1B5" />
        ))}
      </g>
    </svg>
  )
}

/** Compact decorative divider using the Johor flag composition. */
export function JohorDivider({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center gap-2', className)} aria-hidden="true">
      <span className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-line" />
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-navy" />
        <span className="h-1.5 w-1.5 rounded-full bg-johor" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      </span>
      <span className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-line" />
    </div>
  )
}
