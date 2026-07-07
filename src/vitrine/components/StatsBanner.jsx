import { GraduationCap, Rocket, Award, Users } from 'lucide-react'
import { STATS } from '../data/stats'
import AnimatedCounter from './ui/AnimatedCounter'
import Reveal from './ui/Reveal'

const ICONS = {
  etudiants: GraduationCap,
  projets: Rocket,
  formations: Award,
  technos: Users
}

export default function StatsBanner() {
  return (
    <section className="bg-teal-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat, i) => {
          const Icon = ICONS[stat.id] ?? Award
          return (
            <Reveal key={stat.id} direction="up" delay={i * 0.08} className="flex items-center gap-3 justify-center md:justify-start">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 shrink-0">
                <Icon className="text-white" size={22} />
              </span>
              <div className="text-left">
                <p className="text-white font-display font-bold text-2xl leading-none">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-teal-50 text-xs sm:text-sm mt-1">{stat.label}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
