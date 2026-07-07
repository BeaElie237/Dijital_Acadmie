import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'

export default function AnimatedCounter({ value, suffix = '', className = '' }) {
  const { ref, value: current } = useAnimatedCounter(value)

  return (
    <span ref={ref} className={className}>
      {current}
      {suffix}
    </span>
  )
}
