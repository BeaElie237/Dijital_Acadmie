import { useEffect, useState, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../../lib/supabaseClient'
import { downloadCsv } from '../../lib/csvExport'

function randomToken() {
  return crypto.randomUUID().replace(/-/g, '')
}

export default function AttendanceAdmin() {
  const [label, setLabel] = useState('')
  const [duration, setDuration] = useState(15)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [sessions, setSessions] = useState([])
  const [records, setRecords] = useState([])
  const [now, setNow] = useState(Date.now())

  const loadSessions = useCallback(async () => {
    const { data } = await supabase
      .from('attendance_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    setSessions(data ?? [])
  }, [])

  const loadRecords = useCallback(async () => {
    const { data } = await supabase
      .from('attendance_records')
      .select('*, students(student_code, full_name), attendance_sessions(label, created_at)')
      .order('scanned_at', { ascending: false })
      .limit(200)
    setRecords(data ?? [])
  }, [])

  useEffect(() => {
    loadSessions()
    loadRecords()
  }, [loadSessions, loadRecords])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    const token = randomToken()
    const expiresAt = new Date(Date.now() + duration * 60 * 1000).toISOString()

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('attendance_sessions').insert({
      token,
      label: label || `Session du ${new Date().toLocaleDateString('fr-FR')}`,
      expires_at: expiresAt,
      created_by: user.id
    })

    setCreating(false)
    if (error) {
      setError(error.message)
    } else {
      setLabel('')
      loadSessions()
    }
  }

  const activeSession = sessions.find((s) => new Date(s.expires_at).getTime() > now)

  const exportCsv = () => {
    downloadCsv(
      'presences.csv',
      records.map((r) => ({
        code: r.students?.student_code,
        nom: r.students?.full_name,
        session: r.attendance_sessions?.label,
        date: new Date(r.scanned_at).toLocaleString('fr-FR')
      })),
      [
        { key: 'code', label: 'Identifiant' },
        { key: 'nom', label: 'Nom' },
        { key: 'session', label: 'Session' },
        { key: 'date', label: 'Date/Heure' }
      ]
    )
  }

  const scanUrl = activeSession
    ? `${window.location.origin}/etudiant/scan?token=${activeSession.token}`
    : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Présence (QR code)</h2>
        <p className="text-sm text-slate-500">Générez un QR code de session pour l'appel</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Nouvelle session</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label">Nom de la session (optionnel)</label>
              <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex: Cours du matin" />
            </div>
            <div>
              <label className="label">Durée de validité (minutes)</label>
              <input
                type="number"
                min="1"
                max="240"
                className="input"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={creating} className="btn-primary w-full">
              {creating ? 'Génération...' : 'Générer le QR code'}
            </button>
          </form>
        </div>

        <div className="card flex flex-col items-center justify-center">
          {activeSession ? (
            <>
              <p className="font-medium mb-2">{activeSession.label}</p>
              <QRCodeSVG value={scanUrl} size={200} />
              <p className="text-xs text-slate-400 mt-3 break-all text-center">{scanUrl}</p>
              <CountdownBadge expiresAt={activeSession.expires_at} now={now} />
            </>
          ) : (
            <p className="text-slate-400">Aucune session active. Créez-en une pour afficher le QR code.</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold">Historique des présences</h3>
          <button className="btn-outline" onClick={exportCsv}>
            Exporter en CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2 pr-4">Identifiant</th>
                <th className="py-2 pr-4">Nom</th>
                <th className="py-2 pr-4">Session</th>
                <th className="py-2 pr-4">Date/Heure</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono">{r.students?.student_code}</td>
                  <td className="py-2 pr-4">{r.students?.full_name}</td>
                  <td className="py-2 pr-4 text-slate-500">{r.attendance_sessions?.label}</td>
                  <td className="py-2 pr-4 text-slate-400">{new Date(r.scanned_at).toLocaleString('fr-FR')}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    Aucune présence enregistrée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CountdownBadge({ expiresAt, now }) {
  const remainingMs = new Date(expiresAt).getTime() - now
  const remainingMin = Math.max(0, Math.floor(remainingMs / 60000))
  const remainingSec = Math.max(0, Math.floor((remainingMs % 60000) / 1000))

  return (
    <p className="badge bg-green-100 text-green-700 mt-3">
      Expire dans {remainingMin}m {remainingSec}s
    </p>
  )
}
