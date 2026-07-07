// Petits éléments décoratifs réutilisés dans plusieurs sections (hero, à propos...)
// pour recréer l'ambiance "formes flottantes + pointillés" du visuel de référence.

export function DotGrid({ className = '', rows = 5, cols = 5, color = 'currentColor' }) {
  const dots = []
  const gap = 12
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(<circle key={`${r}-${c}`} cx={c * gap + 4} cy={r * gap + 4} r="2" fill={color} />)
    }
  }
  return (
    <svg
      className={className}
      width={cols * gap}
      height={rows * gap}
      viewBox={`0 0 ${cols * gap} ${rows * gap}`}
      aria-hidden="true"
    >
      {dots}
    </svg>
  )
}

export function WaveSquiggle({ className = '' }) {
  return (
    <svg className={className} width="64" height="16" viewBox="0 0 64 16" fill="none" aria-hidden="true">
      <path
        d="M2 8c5-7 10-7 15 0s10 7 15 0 10-7 15 0 10 7 15 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DashedCircle({ className = '', size = 90 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 8" />
    </svg>
  )
}

export function RingCircle({ className = '', size = 40 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
}

export function SolidDot({ className = '', size = 22 }) {
  return <span className={`block rounded-full ${className}`} style={{ width: size, height: size }} aria-hidden="true" />
}
