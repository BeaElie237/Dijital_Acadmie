import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import aboutImage from '../../assets/vitrine/about-placeholder.png'
import videoThumb from '../../assets/vitrine/about-video-placeholder.svg'
import Reveal from './ui/Reveal'
import { DotGrid, RingCircle } from './ui/FloatingShapes'

const POINTS = [
  'Formateurs experts en développement, IA et data',
  'Suivi personnalisé et accompagnement à distance',
  'Accès continu aux ressources et aux projets réalisés'
]

export default function About() {
  return (
    <section className="py-20 sm:py-28 bg-pastel-sky/40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-16 items-center">
        <Reveal direction="left" className="relative flex justify-center md:justify-start">
          <div className="relative w-full max-w-sm">
            <DotGrid className="absolute -left-8 -bottom-8 text-teal-300/60" rows={6} cols={6} />
            <RingCircle size={44} className="absolute -top-6 right-6 text-sunshine-400 animate-float z-10" />
            <div className="absolute inset-x-6 top-6 bottom-0 rounded-[2.5rem] bg-pastel-cream" aria-hidden="true" />

            <img
              src={aboutImage}
              alt="Membre de l'équipe Dijital au travail sur ordinateur"
              className="w-full h-auto relative z-[1] drop-shadow-xl"
              loading="lazy"
            />

            <motion.img
              src={videoThumb}
              alt="Aperçu vidéo de présentation Dijital"
              className="hidden sm:block absolute -top-10 -left-10 w-40 rounded-xl shadow-lg z-[2]"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              loading="lazy"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 right-2 sm:right-8 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-2 z-[2]"
            >
              <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                <CheckCircle2 size={16} />
              </span>
              <span className="text-xs font-semibold text-ink">Projets réussis</span>
            </motion.div>
          </div>
        </Reveal>

        <Reveal direction="right">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-teal-600">À propos</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-3 relative inline-block">
            Apprenez et grandissez
            <br />
            depuis <span className="text-coral-500">n'importe où</span>
          </h2>
          <p className="text-slate-500 mt-5 max-w-md">
            Dijital est une startup qui allie formation, développement logiciel et intelligence
            artificielle pour faire grandir étudiants et entreprises, avec un accompagnement humain
            à chaque étape.
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="text-teal-500 shrink-0 mt-0.5" size={18} />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
