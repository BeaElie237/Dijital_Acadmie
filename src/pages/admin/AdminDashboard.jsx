import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { api } from '../../lib/api'
import { progressPercent, averageNote, globalStatus } from '../../lib/progress'
import StatusBadge from '../../components/StatusBadge'
import ProgressBar from '../../components/ProgressBar'
import PromoProgressChart from '../../components/charts/PromoProgressChart'

export default function AdminDashboard() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [progressFilter, setProgressFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [error, setError] = useState('')

  const loadStudents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('students')
      .select('*, tasks(*)')
      .order('created_at', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setStudents(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const rows = useMemo(() => {
    return students.map((s) => ({
      ...s,
      progress: progressPercent(s.tasks),
      avgNote: averageNote(s.tasks),
      status: globalStatus(s.tasks)
    }))
  }, [students])

  const filtered = rows.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_code.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (progressFilter === 'not_started') return s.progress === 0
    if (progressFilter === 'in_progress') return s.progress > 0 && s.progress < 100
    if (progressFilter === 'done') return s.progress === 100
    return true
  })

  const stats = useMemo(() => {
    const total = rows.length
    const avgProgress = total ? rows.reduce((a, r) => a + r.progress, 0) / total : 0
    const lateSteps = rows.reduce(
      (acc, r) => acc + r.tasks.filter((t) => t.end_date && new Date(t.end_date) < new Date() && t.status !== 'termine' && t.status !== 'valide').length,
      0
    )
    const notes = rows.map((r) => r.avgNote).filter((n) => n !== null)
    const avgNoteGlobal = notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null
    return { total, avgProgress, lateSteps, avgNoteGlobal }
  }, [rows])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Vue d’ensemble</h2>
          <p className="text-sm text-slate-500">Suivi de la promotion en un coup d’œil</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          + Nouvel étudiant
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Étudiants" value={stats.total} />
        <StatCard label="Progression moyenne" value={`${stats.avgProgress.toFixed(0)}%`} />
        <StatCard label="Étapes en retard" value={stats.lateSteps} highlight={stats.lateSteps > 0} />
        <StatCard
          label="Note moyenne"
          value={stats.avgNoteGlobal !== null ? `${stats.avgNoteGlobal.toFixed(1)}/20` : '—'}
        />
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Progression par étudiant</h3>
        <PromoProgressChart students={rows} />
      </div>

      <div className="card space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            className="input sm:max-w-xs"
            placeholder="Rechercher par nom, ID ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input sm:max-w-xs"
            value={progressFilter}
            onChange={(e) => setProgressFilter(e.target.value)}
          >
            <option value="all">Toutes les progressions</option>
            <option value="not_started">Non commencé</option>
            <option value="in_progress">En cours</option>
            <option value="done">Terminé (100%)</option>
          </select>
        </div>

        {loading ? (
          <p className="text-slate-500">Chargement...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Nom</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Progression</th>
                  <th className="py-2 pr-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-2 pr-4">
                      <Link to={`/admin/etudiants/${s.id}`} className="font-mono text-brand-700 hover:underline">
                        {s.student_code}
                      </Link>
                    </td>
                    <td className="py-2 pr-4">
                      <Link to={`/admin/etudiants/${s.id}`} className="hover:underline">
                        {s.full_name}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 text-slate-500">{s.email}</td>
                    <td className="py-2 pr-4 w-40">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={s.progress} />
                        <span className="text-xs text-slate-500 w-9">{s.progress.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      Aucun étudiant ne correspond à votre recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateStudentModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false)
            loadStudents()
          }}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, highlight }) {
  return (
    <div className="card">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-red-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  )
}

function CreateStudentModal({ onClose, onCreated }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { student } = await api.createStudent({ fullName, email })
      setResult(student)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md">
        {result ? (
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold">Étudiant créé !</h3>
            <p className="text-sm text-slate-600">
              Identifiant : <span className="font-mono font-bold text-brand-700">{result.student_code}</span>
              <br />
              Mot de passe par défaut : <span className="font-mono">{result.student_code}</span>
            </p>
            <button className="btn-primary w-full" onClick={onCreated}>
              Terminer
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">Nouvel étudiant</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nom complet</label>
                <input className="input" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button type="button" className="btn-secondary flex-1" onClick={onClose}>
                  Annuler
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
