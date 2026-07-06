import { TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../lib/constants'

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${TASK_STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {TASK_STATUS_LABELS[status] ?? status}
    </span>
  )
}
