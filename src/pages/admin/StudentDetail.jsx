import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { api } from '../../lib/api'
import StatusBadge from '../../components/StatusBadge'
import ProgressBar from '../../components/ProgressBar'
import StudentStepsChart from '../../components/charts/StudentStepsChart'
import { progressPercent, averageNote } from '../../lib/progress'
import { TASK_STATUS_LABELS } from '../../lib/constants'

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [student, setStudent] = useState(null)
  const [tasks, setTasks] = useState([])
  const [idHistory, setIdHistory] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const [{ data: studentData, error: studentError }, { data: taskData }, { data: historyData }, { data: attendanceData }] =
      await Promise.all([
        supabase.from('students').select('*').eq('id', id).single(),
        supabase.from('tasks').select('*').eq('student_id', id).order('step_number'),
        supabase.from('id_history').select('*').eq('student_id', id).order('changed_at', { ascending: false }),
        supabase
          .from('attendance_records')
          .select('*, attendance_sessions(label, created_at)')
          .eq('student_id', id)
          .order('scanned_at', { ascending: false })
      ])

    if (studentError) {
      setError(studentError.message)
    } else {
      setStudent(studentData)
      setTasks(taskData ?? [])
      setIdHistory(historyData ?? [])
      setAttendance(attendanceData ?? [])
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <p className="text-slate-500">Chargement...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!student) return <p>Étudiant introuvable.</p>

  return (
    <div className="space-y-6">
      <Link to="/admin" className="text-sm text-brand-700 hover:underline">
        ← Retour à la liste
      </Link>

      <StudentInfoCard student={student} onUpdated={load} onDeleted={() => navigate('/admin')} />

      <div className="card">
        <h3 className="font-semibold mb-4">Progression et notes</h3>
        <div className="flex items-center gap-3 mb-4">
          <ProgressBar value={progressPercent(tasks)} className="max-w-xs" />
          <span className="text-sm text-slate-500">{progressPercent(tasks).toFixed(0)}%</span>
          {averageNote(tasks) !== null && (
            <span className="text-sm text-slate-500">· Moyenne : {averageNote(tasks).toFixed(1)}/20</span>
          )}
        </div>
        <StudentStepsChart tasks={tasks} />
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Étapes du stage</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskEditor key={task.id} task={task} onUpdated={load} />
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Historique des identifiants</h3>
        {idHistory.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun changement d’identifiant.</p>
        ) : (
          <ul className="text-sm divide-y">
            {idHistory.map((h) => (
              <li key={h.id} className="py-2 flex flex-wrap justify-between gap-2">
                <span>
                  <span className="font-mono">{h.old_code}</span> → <span className="font-mono font-semibold">{h.new_code}</span>
                  {h.password_reset && <span className="ml-2 text-xs text-amber-600">(mot de passe réinitialisé)</span>}
                </span>
                <span className="text-slate-400">{new Date(h.changed_at).toLocaleString('fr-FR')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Historique des présences</h3>
        {attendance.length === 0 ? (
          <p className="text-sm text-slate-400">Aucune présence enregistrée.</p>
        ) : (
          <ul className="text-sm divide-y">
            {attendance.map((a) => (
              <li key={a.id} className="py-2 flex justify-between">
                <span>{a.attendance_sessions?.label || 'Session'}</span>
                <span className="text-slate-400">{new Date(a.scanned_at).toLocaleString('fr-FR')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function StudentInfoCard({ student, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(student.full_name)
  const [email, setEmail] = useState(student.email)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showRegenerate, setShowRegenerate] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.updateStudent({ studentId: student.id, fullName, email })
      setEditing(false)
      onUpdated()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.deleteStudent({ studentId: student.id })
      onDeleted()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-[240px]">
          <p className="text-xs text-slate-500">Identifiant</p>
          <p className="font-mono text-xl font-bold text-brand-700">{student.student_code}</p>

          {editing ? (
            <form onSubmit={handleSave} className="mt-3 space-y-3 max-w-sm">
              <div>
                <label className="label">Nom complet</label>
                <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="mt-2 text-lg font-semibold">{student.full_name}</p>
              <p className="text-slate-500 text-sm">{student.email}</p>
              <p className="text-xs text-slate-400 mt-1">
                Mot de passe {student.password_is_default ? 'par défaut (= identifiant)' : 'personnalisé'}
              </p>
            </>
          )}
        </div>

        {!editing && (
          <div className="flex flex-col gap-2 items-stretch">
            <button className="btn-outline" onClick={() => setEditing(true)}>
              Modifier les infos
            </button>
            <button className="btn-primary" onClick={() => setShowRegenerate(true)}>
              Régénérer l'ID
            </button>
            <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)}>
              Supprimer l'étudiant
            </button>
          </div>
        )}
      </div>

      {showRegenerate && (
        <RegenerateIdModal
          student={student}
          onClose={() => setShowRegenerate(false)}
          onDone={() => {
            setShowRegenerate(false)
            onUpdated()
          }}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Supprimer cet étudiant ?"
          message={`Cette action supprimera définitivement le compte de ${student.full_name} (${student.student_code}), ainsi que toutes ses données (étapes, présences, historique). Cette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          danger
          loading={saving}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

function RegenerateIdModal({ student, onClose, onDone }) {
  const [step, setStep] = useState(student.password_is_default ? 'confirm' : 'ask_password')
  const [resetPassword, setResetPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const doRegenerate = async (withPasswordReset) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.regenerateId({ studentId: student.id, resetPassword: withPasswordReset })
      setResult(res)
      setStep('done')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md">
        {step === 'ask_password' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Régénérer l'identifiant</h3>
            <p className="text-sm text-slate-600">
              Cet étudiant a déjà personnalisé son mot de passe. Voulez-vous aussi réinitialiser son mot de passe
              au nouvel identifiant ?
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={resetPassword}
                onChange={(e) => setResetPassword(e.target.checked)}
              />
              Réinitialiser aussi le mot de passe
            </label>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={onClose}>
                Annuler
              </button>
              <button className="btn-primary flex-1" onClick={() => setStep('confirm')}>
                Continuer
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Confirmer la régénération</h3>
            <p className="text-sm text-slate-600">
              L'identifiant actuel <span className="font-mono font-semibold">{student.student_code}</span> sera
              remplacé par un nouvel identifiant unique.
              {(student.password_is_default || resetPassword) && (
                <> Le mot de passe sera aussi réinitialisé au nouvel identifiant.</>
              )}
            </p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={onClose} disabled={loading}>
                Annuler
              </button>
              <button
                className="btn-primary flex-1"
                onClick={() => doRegenerate(resetPassword)}
                disabled={loading}
              >
                {loading ? 'Génération...' : 'Régénérer'}
              </button>
            </div>
          </div>
        )}

        {step === 'done' && result && (
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold">Nouvel identifiant généré</h3>
            <p className="text-2xl font-mono font-bold text-brand-700">{result.student.student_code}</p>
            {result.passwordReset && (
              <p className="text-sm text-amber-600">
                Le mot de passe a été réinitialisé à ce nouvel identifiant.
              </p>
            )}
            <button className="btn-primary w-full" onClick={onDone}>
              Terminer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ConfirmModal({ title, message, confirmLabel, danger, loading, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={onCancel} disabled={loading}>
            Annuler
          </button>
          <button className={`${danger ? 'btn-danger' : 'btn-primary'} flex-1`} onClick={onConfirm} disabled={loading}>
            {loading ? 'Veuillez patienter...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function TaskEditor({ task, onUpdated }) {
  const [status, setStatus] = useState(task.status)
  const [note, setNote] = useState(task.note ?? '')
  const [comment, setComment] = useState(task.comment ?? '')
  const [startDate, setStartDate] = useState(task.start_date ?? '')
  const [endDate, setEndDate] = useState(task.end_date ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dirty, setDirty] = useState(false)

  const markDirty = (setter) => (value) => {
    setter(value)
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const { error } = await supabase
      .from('tasks')
      .update({
        status,
        note: note === '' ? null : Number(note),
        comment: comment === '' ? null : comment,
        start_date: startDate || null,
        end_date: endDate || null
      })
      .eq('id', task.id)

    setSaving(false)
    if (error) {
      setError(error.message)
    } else {
      setDirty(false)
      onUpdated()
    }
  }

  const handleValidate = async () => {
    setSaving(true)
    const { error } = await supabase.from('tasks').update({ status: 'valide' }).eq('id', task.id)
    setSaving(false)
    if (error) setError(error.message)
    else {
      setStatus('valide')
      onUpdated()
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="font-medium">
          {task.step_number}. {task.step_name}
        </p>
        <StatusBadge status={task.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Statut</label>
          <select className="input" value={status} onChange={(e) => markDirty(setStatus)(e.target.value)}>
            {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Note (/20)</label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.25"
            className="input"
            value={note}
            onChange={(e) => markDirty(setNote)(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Date de début</label>
          <input
            type="date"
            className="input"
            value={startDate}
            onChange={(e) => markDirty(setStartDate)(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Date de fin</label>
          <input
            type="date"
            className="input"
            value={endDate}
            onChange={(e) => markDirty(setEndDate)(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Commentaire / appréciation</label>
          <textarea
            className="input"
            rows={2}
            value={comment}
            onChange={(e) => markDirty(setComment)(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="flex flex-wrap gap-2 mt-3">
        <button className="btn-outline" disabled={!dirty || saving} onClick={handleSave}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        {task.status !== 'valide' && (
          <button className="btn-primary" disabled={saving} onClick={handleValidate}>
            Valider l'étape
          </button>
        )}
      </div>
    </div>
  )
}
