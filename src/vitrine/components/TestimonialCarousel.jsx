import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { TESTIMONIALS } from '../data/testimonials'

const AUTOPLAY_MS = 6000

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback((newIndex, dir) => {
    setDirection(dir)
    setIndex((newIndex + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [next])

  const testimonial = TESTIMONIALS[index]

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg min-h-[280px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={testimonial.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="p-8 sm:p-10 flex flex-col items-center text-center gap-4"
          >
            <Quote className="text-teal-300" size={32} />
            <p className="text-slate-600 text-lg leading-relaxed">{testimonial.text}</p>
            <div className="flex items-center gap-1 text-sunshine-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill={i < testimonial.rating ? 'currentColor' : 'none'} />
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
                loading="lazy"
              />
              <div className="text-left">
                <p className="font-semibold text-ink text-sm">{testimonial.name}</p>
                <p className="text-slate-400 text-xs">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          aria-label="Témoignage précédent"
          className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              aria-label={`Aller au témoignage ${i + 1}`}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-teal-500' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Témoignage suivant"
          className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
