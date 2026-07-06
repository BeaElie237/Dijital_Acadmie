import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import StatusBadge from '../../components/StatusBadge'
import ProgressBar from '../../components/ProgressBar'
import StudentStepsChart from '../../components/charts/StudentStepsChart'
import { progressPercent, averageNote } from '../../lib/progress'
import { STUDENT_EDITABLE_STATUSES, TASK_STATUS_LABELS, TASK_STATUS } from '../../lib/constants'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [student, setStudent] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('profile_id', user.id)
      .single()

    if (studentError) {
      setError(studentError.message)
      setLoading(false)
      return
    }

    const { data: taskData } = await supabase
      .from('tasks')
      .select('*')
      .eq('student_id', studentData.id)
      .order('step_number')

    setStudent(studentData)
    setTasks(taskData ?? [])
    setLoading(false)
  }, [user.id])

  useEffect(() => {
    load()
  }, [load])

  const handleStatusChange = async (taskId, status) => {
    const { error } = await supabase.rpc('update_own_task_status', { p_task_id: taskId, p_status: status })
    if (!error) load()
  }

  if (loading) return <p className="text-slate-500">Chargement...</p>
  if (error) return <p className="text-red-600">{error}</p>

  const progress = progressPercent(tasks)
  const avg = averageNote(tasks)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bonjour {student?.full_name?.split(' ')[0]} 👋</h2>
        <p className="text-sm text-slate-500">Identifiant : <span className="font-mono">{student?.student_code}</span></p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-2">
          <ProgressBar value={progress} />
          <span className="text-sm text-slate-500 w-12">{progress.toFixed(0)}%</span>
        </div>
        {avg !== null && <p className="text-sm text-slate-500">Moyenne actuelle : {avg.toFixed(1)}/20</p>}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Mes notes par étape</h3>
        <StudentStepsChart tasks={tasks} />
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Mes étapes de stage</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <p className="font-medium">
                  {task.step_number}. {task.step_name}
                </p>
                <StatusBadge status={task.status} />
              </div>

              {task.status === TASK_STATUS.VALIDE ? (
                <p className="text-xs text-slate-400">
                  Étape validée par l'enseignant — non modifiable.
                </p>
              ) : (
                <div className="max-w-xs">
                  <label className="label">Mettre à jour mon avancement</label>
                  <select
                    className="input"
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    {STUDENT_EDITABLE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {TASK_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(task.note !== null || task.comment) && (
                <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                  {task.note !== null && (
                    <p>
                      <span className="font-medium">Note :</span> {task.note}/20
                    </p>
                  )}
                  {task.comment && (
                    <p>
                      <span className="font-medium">Appréciation :</span> {task.comment}
                    </p>
                  )}
                </div>
              )}

              {(task.start_date || task.end_date) && (
                <p className="text-xs text-slate-400 mt-2">
                  {task.start_date && <>Début : {new Date(task.start_date).toLocaleDateString('fr-FR')} </>}
                  {task.end_date && <>· Fin : {new Date(task.end_date).toLocaleDateString('fr-FR')}</>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
