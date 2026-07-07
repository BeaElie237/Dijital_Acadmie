import { motion } from 'framer-motion'
import heroImage from '../../assets/vitrine/hero-student-placeholder.svg'
import Reveal from './ui/Reveal'
import { DotGrid, WaveSquiggle, DashedCircle, RingCircle, SolidDot } from './ui/FloatingShapes'

export default function Hero() {
  const scrollToServices = (e) => {
    e.preventDefault()
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="accueil" className="relative overflow-hidden bg-pastel-mint pt-32 pb-20 sm:pt-40 sm:pb-28">
      <DotGrid className="absolute top-24 left-4 sm:left-10 text-teal-300/70" rows={6} cols={6} />
      <DotGrid className="absolute bottom-10 right-4 sm:right-16 text-teal-300/50" rows={5} cols={5} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center relative">
        <div>
          <Reveal direction="up">
            <WaveSquiggle className="text-teal-500 mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1]">
              La <span className="text-coral-500">meilleure</span>
              <br />
              plateforme pour suivre
              <br />
              vos étudiants
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <p className="mt-6 text-slate-500 max-w-md">
              Dijital accompagne écoles et entreprises dans le suivi des stages, la formation et la
              réalisation de projets logiciels et IA sur mesure.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#services"
                onClick={scrollToServices}
                className="inline-flex items-center rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold px-7 py-3.5 transition-colors shadow-lg shadow-teal-500/30"
              >
                Découvrir nos services
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal direction="right" delay={0.15} className="relative flex justify-center">
          <div className="relative">
            <RingCircle size={64} className="absolute -top-6 -right-4 text-violet-500 animate-float" />
            <DashedCircle size={110} className="absolute top-6 right-0 text-coral-300 animate-float-slow" />
            <SolidDot size={26} className="absolute top-1/3 -left-6 bg-sunshine-400 animate-float-delay" />

            <motion.img
              src={heroImage}
              alt="Illustration d'un étudiant accompagné par Dijital"
              className="relative z-10 w-64 sm:w-80 lg:w-96 h-auto drop-shadow-xl"
              loading="eager"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            <RingCircle size={40} className="absolute bottom-6 -right-2 text-violet-500 animate-float" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
