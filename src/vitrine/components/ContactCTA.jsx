import { Mail } from 'lucide-react'
import Reveal from './ui/Reveal'
import { CONFIG } from '../data/config'
import { DashedCircle, SolidDot } from './ui/FloatingShapes'
import LocationMap from './LocationMap'

export default function ContactCTA() {
  return (
    <section id="contact" className="relative py-20 sm:py-24 bg-teal-500 overflow-hidden">
      <DashedCircle size={140} className="absolute -top-10 -left-10 text-white/20" />
      <SolidDot size={26} className="absolute bottom-8 right-10 bg-sunshine-300/70 animate-float" />

      <Reveal className="relative max-w-2xl mx-auto text-center px-4">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
          Prêt à démarrer votre projet avec Dijital ?
        </h2>
        <p className="text-teal-50 mt-4">
          Parlons de vos besoins en formation, développement ou solutions IA — notre équipe vous répond rapidement.
        </p>
        <a
          href={`mailto:${CONFIG.CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 mt-8 rounded-full bg-white text-teal-700 font-semibold px-7 py-3.5 hover:bg-teal-50 transition-colors shadow-lg"
        >
          <Mail size={18} />
          Nous contacter
        </a>
      </Reveal>

      <div className="relative px-4">
        <LocationMap />
      </div>
    </section>
  )
}
