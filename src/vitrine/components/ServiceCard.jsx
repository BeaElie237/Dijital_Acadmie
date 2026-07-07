import {
  GraduationCap,
  Code2,
  ServerCog,
  Router,
  BrainCircuit,
  Boxes,
  ChartNoAxesCombined,
  Database,
  Megaphone,
  BookOpen,
  Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'
import Reveal from './ui/Reveal'
import { TECHNOLOGIES } from '../data/technologies'

// Import nommé explicite (plutôt que `import * as Icons`) pour permettre le tree-shaking :
// seules les icônes réellement utilisées sont incluses dans le bundle final.
const ICONS = {
  GraduationCap,
  Code2,
  ServerCog,
  Router,
  BrainCircuit,
  Boxes,
  ChartNoAxesCombined,
  Database,
  Megaphone,
  BookOpen
}

const PASTEL_BG = {
  mint: 'bg-pastel-mint',
  rose: 'bg-pastel-rose',
  cream: 'bg-pastel-cream',
  lavender: 'bg-pastel-lavender',
  sky: 'bg-pastel-sky'
}

const ACCENT_TEXT = {
  teal: 'text-teal-600 bg-teal-100',
  coral: 'text-coral-600 bg-coral-100',
  sunshine: 'text-sunshine-700 bg-sunshine-100',
  violet: 'text-violet-600 bg-violet-100'
}

export default function ServiceCard({ service, index }) {
  const Icon = ICONS[service.icon] ?? Sparkles
  const techs = service.technologies
    ? TECHNOLOGIES.filter((t) => service.technologies.includes(t.id))
    : []

  return (
    <Reveal direction="up" delay={(index % 3) * 0.1}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`rounded-2xl p-6 h-full flex flex-col gap-4 ${PASTEL_BG[service.pastel] ?? 'bg-pastel-mint'}`}
      >
        <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${ACCENT_TEXT[service.accent] ?? ACCENT_TEXT.teal}`}>
          <Icon size={22} />
        </span>
        <h3 className="font-display font-semibold text-lg text-ink">{service.title}</h3>
        <p className="text-sm text-slate-600 flex-1">{service.description}</p>

        {techs.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            {techs.map((tech) => (
              <img
                key={tech.id}
                src={tech.logo}
                alt={tech.name}
                title={tech.name}
                className="w-7 h-7 rounded-lg"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </motion.div>
    </Reveal>
  )
}
