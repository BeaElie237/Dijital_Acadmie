import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'

// Anime un compteur de 0 jusqu'à `target` lorsque l'élément entre dans le viewport.
export function useAnimatedCounter(target, { duration = 1.6 } = {}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v))
    })
    return () => controls.stop()
  }, [isInView, target, duration])

  return { ref, value }
}
