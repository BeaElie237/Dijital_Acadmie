// Icônes réseaux sociaux minimalistes (lucide-react n'embarque plus les logos de marque).
// Style cohérent avec lucide : trait, sans remplissage, 24x24, currentColor.

const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

export function LinkedinIcon(props) {
  return (
    <svg {...common} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10" x2="7.5" y2="17" />
      <circle cx="7.5" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-4.2c0-1.5 1-2.4 2.3-2.4 1.3 0 2.2 0.9 2.2 2.4V17" />
      <line x1="11.5" y1="10" x2="11.5" y2="17" />
    </svg>
  )
}

export function TwitterIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 4l7.5 9.5L4.3 20H7l5.2-5.8L16.5 20H20l-7.9-10L19.4 4H16.7l-4.8 5.4L8 4H4z" />
    </svg>
  )
}

export function InstagramIcon(props) {
  return (
    <svg {...common} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M14 21v-8h2.5l0.5-3H14V8c0-0.9 0.3-1.5 1.6-1.5H17V4c-0.3 0-1.4-0.1-2.6-0.1-2.6 0-4.4 1.6-4.4 4.4V10H7v3h3v8h4z" />
    </svg>
  )
}
