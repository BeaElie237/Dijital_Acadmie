import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'

export default function StudentAttendance() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [totalSessions, setTotalSessions] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', user.id)
        .single()

      if (!student) {
        setLoading(false)
        return
      }

      const [{ data: recordData }, { count }] = await Promise.all([
        supabase
          .from('attendance_records')
          .select('*, attendance_sessions(label, created_at)')
          .eq('student_id', student.id)
          .order('scanned_at', { ascending: false }),
        supabase.from('attendance_sessions').select('id', { count: 'exact', head: true })
      ])

      setRecords(recordData ?? [])
      setTotalSessions(count ?? 0)
      setLoading(false)
    }
    load()
  }, [user.id])

  if (loading) return <p className="text-slate-500">Chargement...</p>

  const rate = totalSessions > 0 ? (records.length / totalSessions) * 100 : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mon historique de présence</h2>
        {rate !== null && (
          <p className="text-sm text-slate-500">
            {records.length} présence(s) sur {totalSessions} session(s) · taux : {rate.toFixed(0)}%
          </p>
        )}
      </div>

      <div className="card">
        {records.length === 0 ? (
          <p className="text-slate-400 text-sm">Aucune présence enregistrée pour le moment.</p>
        ) : (
          <ul className="divide-y text-sm">
            {records.map((r) => (
              <li key={r.id} className="py-3 flex justify-between">
                <span>{r.attendance_sessions?.label || 'Session'}</span>
                <span className="text-slate-400">{new Date(r.scanned_at).toLocaleString('fr-FR')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
