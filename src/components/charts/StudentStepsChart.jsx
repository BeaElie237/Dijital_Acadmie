import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function StudentStepsChart({ tasks }) {
  const data = tasks
    .slice()
    .sort((a, b) => a.step_number - b.step_number)
    .map((t) => ({
      name: `Étape ${t.step_number}`,
      note: t.note ?? null
    }))

  const hasNotes = data.some((d) => d.note !== null)

  if (!hasNotes) {
    return <p className="text-sm text-slate-400">Aucune note enregistrée pour le moment.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [value !== null ? `${value}/20` : '—', 'Note']} />
        <Bar dataKey="note" fill="#2a5cff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
