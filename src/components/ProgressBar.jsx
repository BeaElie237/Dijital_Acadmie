export default function ProgressBar({ value, className = '' }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className={`w-full ${className}`}>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-brand-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
