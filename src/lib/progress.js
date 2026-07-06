import { TASK_STATUS } from './constants'

export function progressPercent(tasks = []) {
  if (!tasks.length) return 0
  const done = tasks.filter(
    (t) => t.status === TASK_STATUS.TERMINE || t.status === TASK_STATUS.VALIDE
  ).length
  return (done / tasks.length) * 100
}

export function averageNote(tasks = []) {
  const notes = tasks.filter((t) => t.note !== null && t.note !== undefined).map((t) => Number(t.note))
  if (!notes.length) return null
  return notes.reduce((a, b) => a + b, 0) / notes.length
}

export function isLate(task) {
  if (!task.end_date) return false
  if (task.status === TASK_STATUS.VALIDE || task.status === TASK_STATUS.TERMINE) return false
  return new Date(task.end_date) < new Date()
}

export function globalStatus(tasks = []) {
  if (!tasks.length) return TASK_STATUS.NON_COMMENCE
  if (tasks.every((t) => t.status === TASK_STATUS.VALIDE)) return TASK_STATUS.VALIDE
  if (tasks.every((t) => t.status === TASK_STATUS.NON_COMMENCE)) return TASK_STATUS.NON_COMMENCE
  if (tasks.some((t) => t.status === TASK_STATUS.EN_COURS)) return TASK_STATUS.EN_COURS
  return TASK_STATUS.EN_COURS
}
